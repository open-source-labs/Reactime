/* eslint camelcase: "off" */

import { CAMPAIGN_IDS_KEY } from './mixpanel-persistence';
import { evaluateSelector } from './property-filters';
import { _ } from './utils';

// Internal class for notification display

var MixpanelNotification = function(notif_data, mixpanel_instance) {
    _.bind_instance_methods(this);

    this.mixpanel          = mixpanel_instance;
    this.persistence       = this.mixpanel['persistence'];
    this.resource_protocol = this.mixpanel.get_config('inapp_protocol');
    this.cdn_host          = this.mixpanel.get_config('cdn');

    this.campaign_id = _.escapeHTML(notif_data['id']);
    this.message_id  = _.escapeHTML(notif_data['message_id']);

    this.body            = (_.escapeHTML(notif_data['body']) || '').replace(/\n/g, '<br/>');
    this.cta             = _.escapeHTML(notif_data['cta']) || 'Close';
    this.notif_type      = _.escapeHTML(notif_data['type']) || 'takeover';
    this.style           = _.escapeHTML(notif_data['style']) || 'light';
    this.title           = _.escapeHTML(notif_data['title']) || '';
    this.video_width     = MixpanelNotification.VIDEO_WIDTH;
    this.video_height    = MixpanelNotification.VIDEO_HEIGHT;

    this.display_triggers = notif_data['display_triggers'] || [];

    // These fields are url-sanitized in the backend already.
    this.dest_url        = notif_data['cta_url'] || null;
    this.image_url       = notif_data['image_url'] || null;
    this.thumb_image_url = notif_data['thumb_image_url'] || null;
    this.video_url       = notif_data['video_url'] || null;

    if (this.thumb_image_url && this.thumb_image_url.indexOf('//') === 0) {
        this.thumb_image_url = this.thumb_image_url.replace('//', this.resource_protocol);
    }

    this.clickthrough = true;
    if (!this.dest_url) {
        this.dest_url = '#dismiss';
        this.clickthrough = false;
    }

    this.mini = this.notif_type === 'mini';
    if (!this.mini) {
        this.notif_type = 'takeover';
    }
    this.notif_width = !this.mini ? MixpanelNotification.NOTIF_WIDTH : MixpanelNotification.NOTIF_WIDTH_MINI;

    this._set_client_config();
    this.imgs_to_preload = this._init_image_html();
    this._init_video();
};

MixpanelNotification.ANIM_TIME         = 200;
MixpanelNotification.MARKUP_PREFIX     = 'mixpanel-notification';
MixpanelNotification.BG_OPACITY        = 0.6;
MixpanelNotification.NOTIF_TOP         = 25;
MixpanelNotification.NOTIF_START_TOP   = 200;
MixpanelNotification.NOTIF_WIDTH       = 388;
MixpanelNotification.NOTIF_WIDTH_MINI  = 420;
MixpanelNotification.NOTIF_HEIGHT_MINI = 85;
MixpanelNotification.THUMB_BORDER_SIZE = 5;
MixpanelNotification.THUMB_IMG_SIZE    = 60;
MixpanelNotification.THUMB_OFFSET      = Math.round(MixpanelNotification.THUMB_IMG_SIZE / 2);
MixpanelNotification.VIDEO_WIDTH       = 595;
MixpanelNotification.VIDEO_HEIGHT      = 334;

MixpanelNotification.prototype.show = function() {
    var self = this;
    this._set_client_config();

    // don't display until HTML body exists
    if (!this.body_el) {
        setTimeout(function() { self.show(); }, 300);
        return;
    }

    this._init_styles();
    this._init_notification_el();

    // wait for any images to load before showing notification
    this._preload_images(this._attach_and_animate);
};

MixpanelNotification.prototype.dismiss = _.safewrap(function() {
    if (!this.marked_as_shown) {
        // unexpected condition: user interacted with notif even though we didn't consider it
        // visible (see _mark_as_shown()); send tracking signals to mark delivery
        this._mark_delivery({'invisible': true});
    }

    var exiting_el = this.showing_video ? this._get_el('video') : this._get_notification_display_el();
    if (this.use_transitions) {
        this._remove_class('bg', 'visible');
        this._add_class(exiting_el, 'exiting');
        setTimeout(this._remove_notification_el, MixpanelNotification.ANIM_TIME);
    } else {
        var notif_attr, notif_start, notif_goal;
        if (this.mini) {
            notif_attr  = 'right';
            notif_start = 20;
            notif_goal  = -100;
        } else {
            notif_attr  = 'top';
            notif_start = MixpanelNotification.NOTIF_TOP;
            notif_goal  = MixpanelNotification.NOTIF_START_TOP + MixpanelNotification.NOTIF_TOP;
        }
        this._animate_els([
            {
                el:    this._get_el('bg'),
                attr:  'opacity',
                start: MixpanelNotification.BG_OPACITY,
                goal:  0.0
            },
            {
                el:    exiting_el,
                attr:  'opacity',
                start: 1.0,
                goal:  0.0
            },
            {
                el:    exiting_el,
                attr:  notif_attr,
                start: notif_start,
                goal:  notif_goal
            }
        ], MixpanelNotification.ANIM_TIME, this._remove_notification_el);
    }
});

MixpanelNotification.prototype._add_class = _.safewrap(function(el, class_name) {
    class_name = MixpanelNotification.MARKUP_PREFIX + '-' + class_name;
    if (typeof el === 'string') {
        el = this._get_el(el);
    }
    if (!el.className) {
        el.className = class_name;
    } else if (!~(' ' + el.className + ' ').indexOf(' ' + class_name + ' ')) {
        el.className += ' ' + class_name;
    }
});
MixpanelNotification.prototype._remove_class = _.safewrap(function(el, class_name) {
    class_name = MixpanelNotification.MARKUP_PREFIX + '-' + class_name;
    if (typeof el === 'string') {
        el = this._get_el(el);
    }
    if (el.className) {
        el.className = (' ' + el.className + ' ')
            .replace(' ' + class_name + ' ', '')
            .replace(/^[\s\xA0]+/, '')
            .replace(/[\s\xA0]+$/, '');
    }
});

MixpanelNotification.prototype._animate_els = _.safewrap(function(anims, mss, done_cb, start_time) {
    var self = this,
        in_progress = false,
        ai, anim,
        cur_time = 1 * new Date(), time_diff;

    start_time = start_time || cur_time;
    time_diff = cur_time - start_time;

    for (ai = 0; ai < anims.length; ai++) {
        anim = anims[ai];
        if (typeof anim.val === 'undefined') {
            anim.val = anim.start;
        }
        if (anim.val !== anim.goal) {
            in_progress = true;
            var anim_diff = anim.goal - anim.start,
                anim_dir = anim.goal >= anim.start ? 1 : -1;
            anim.val = anim.start + anim_diff * time_diff / mss;
            if (anim.attr !== 'opacity') {
                anim.val = Math.round(anim.val);
            }
            if ((anim_dir > 0 && anim.val >= anim.goal) || (anim_dir < 0 && anim.val <= anim.goal)) {
                anim.val = anim.goal;
            }
        }
    }
    if (!in_progress) {
        if (done_cb) {
            done_cb();
        }
        return;
    }

    for (ai = 0; ai < anims.length; ai++) {
        anim = anims[ai];
        if (anim.el) {
            var suffix = anim.attr === 'opacity' ? '' : 'px';
            anim.el.style[anim.attr] = String(anim.val) + suffix;
        }
    }
    setTimeout(function() { self._animate_els(anims, mss, done_cb, start_time); }, 10);
});

MixpanelNotification.prototype._attach_and_animate = _.safewrap(function() {
    var self = this;

    // no possibility to double-display
    if (this.shown || this._get_shown_campaigns()[this.campaign_id]) {
        return;
    }
    this.shown = true;

    this.body_el.appendChild(this.notification_el);
    setTimeout(function() {
        var notif_el = self._get_notification_display_el();
        if (self.use_transitions) {
            if (!self.mini) {
                self._add_class('bg', 'visible');
            }
            self._add_class(notif_el, 'visible');
            self._mark_as_shown();
        } else {
            var notif_attr, notif_start, notif_goal;
            if (self.mini) {
                notif_attr  = 'right';
                notif_start = -100;
                notif_goal  = 20;
            } else {
                notif_attr  = 'top';
                notif_start = MixpanelNotification.NOTIF_START_TOP + MixpanelNotification.NOTIF_TOP;
                notif_goal  = MixpanelNotification.NOTIF_TOP;
            }
            self._animate_els([
                {
                    el:    self._get_el('bg'),
                    attr:  'opacity',
                    start: 0.0,
                    goal:  MixpanelNotification.BG_OPACITY
                },
                {
                    el:    notif_el,
                    attr:  'opacity',
                    start: 0.0,
                    goal:  1.0
                },
                {
                    el:    notif_el,
                    attr:  notif_attr,
                    start: notif_start,
                    goal:  notif_goal
                }
            ], MixpanelNotification.ANIM_TIME, self._mark_as_shown);
        }
    }, 100);
    _.register_event(self._get_el('cancel'), 'click', function(e) {
        e.preventDefault();
        self.dismiss();
    });
    var click_el = self._get_el('button') ||
                        self._get_el('mini-content');
    _.register_event(click_el, 'click', function(e) {
        e.preventDefault();
        if (self.show_video) {
            self._track_event('$campaign_open', {'$resource_type': 'video'});
            self._switch_to_video();
        } else {
            self.dismiss();
            if (self.clickthrough) {
                var tracking_cb = null;
                if (self.mixpanel.get_config('inapp_link_new_window')) {
                    window.open(self.dest_url);
                } else {
                    tracking_cb = function() {
                        window.location.href = self.dest_url;
                    };
                }
                self._track_event('$campaign_open', {'$resource_type': 'link'}, tracking_cb);
            }
        }
    });
});

MixpanelNotification.prototype._get_el = function(id) {
    return document.getElementById(MixpanelNotification.MARKUP_PREFIX + '-' + id);
};

MixpanelNotification.prototype._get_notification_display_el = function() {
    return this._get_el(this.notif_type);
};

MixpanelNotification.prototype._get_shown_campaigns = function() {
    return this.persistence['props'][CAMPAIGN_IDS_KEY] || (this.persistence['props'][CAMPAIGN_IDS_KEY] = {});
};

MixpanelNotification.prototype._matches_event_data = _.safewrap(function(event_data) {
    var event_name = event_data['event'] || '';
    for (var i = 0; i < this.display_triggers.length; i++) {
        var display_trigger = this.display_triggers[i];
        var match_event = display_trigger['event'] || '';
        if (match_event === '$any_event' || event_name === display_trigger['event']) {
            if (display_trigger['selector'] && !_.isEmptyObject(display_trigger['selector'])) {
                if (evaluateSelector(display_trigger['selector'], event_data['properties'])) {
                    return true;
                }
            } else {
                return true;
            }
        }
    }
    return false;
});


MixpanelNotification.prototype._browser_lte = function(browser, version) {
    return this.browser_versions[browser] && this.browser_versions[browser] <= version;
};

MixpanelNotification.prototype._init_image_html = function() {
    var imgs_to_preload = [];

    if (!this.mini) {
        if (this.image_url) {
            imgs_to_preload.push(this.image_url);
            this.img_html = '<img id="img" src="' + this.image_url + '"/>';
        } else {
            this.img_html = '';
        }
        if (this.thumb_image_url) {
            imgs_to_preload.push(this.thumb_image_url);
            this.thumb_img_html =
                    '<div id="thumbborder-wrapper"><div id="thumbborder"></div></div>' +
                    '<img id="thumbnail"' +
                        ' src="' + this.thumb_image_url + '"' +
                        ' width="' + MixpanelNotification.THUMB_IMG_SIZE + '"' +
                        ' height="' + MixpanelNotification.THUMB_IMG_SIZE + '"' +
                    '/>' +
                    '<div id="thumbspacer"></div>';
        } else {
            this.thumb_img_html = '';
        }
    } else {
        this.thumb_image_url = this.thumb_image_url || (this.cdn_host + '/site_media/images/icons/notifications/mini-news-dark.png');
        imgs_to_preload.push(this.thumb_image_url);
    }

    return imgs_to_preload;
};

MixpanelNotification.prototype._init_notification_el = function() {
    var notification_html = '';
    var video_src         = '';
    var video_html        = '';
    var cancel_html       = '<div id="cancel">' +
                                    '<div id="cancel-icon"></div>' +
                                '</div>';

    this.notification_el = document.createElement('div');
    this.notification_el.id = MixpanelNotification.MARKUP_PREFIX + '-wrapper';
    if (!this.mini) {
        // TAKEOVER notification
        var close_html  = (this.clickthrough || this.show_video) ? '' : '<div id="button-close"></div>',
            play_html   = this.show_video ? '<div id="button-play"></div>' : '';
        if (this._browser_lte('ie', 7)) {
            close_html = '';
            play_html = '';
        }
        notification_html =
                '<div id="takeover">' +
                    this.thumb_img_html +
                    '<div id="mainbox">' +
                        cancel_html +
                        '<div id="content">' +
                            this.img_html +
                            '<div id="title">' + this.title + '</div>' +
                            '<div id="body">' + this.body + '</div>' +
                            '<div id="tagline">' +
                                '<a href="http://mixpanel.com?from=inapp" target="_blank">POWERED BY MIXPANEL</a>' +
                            '</div>' +
                        '</div>' +
                        '<div id="button">' +
                            close_html +
                            '<a id="button-link" href="' + this.dest_url + '">' + this.cta + '</a>' +
                            play_html +
                        '</div>' +
                    '</div>' +
                '</div>';
    } else {
        // MINI notification
        notification_html =
                '<div id="mini">' +
                    '<div id="mainbox">' +
                        cancel_html +
                        '<div id="mini-content">' +
                            '<div id="mini-icon">' +
                                '<div id="mini-icon-img"></div>' +
                            '</div>' +
                            '<div id="body">' +
                                '<div id="body-text"><div>' + this.body + '</div></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div id="mini-border"></div>' +
                '</div>';
    }
    if (this.youtube_video) {
        video_src = this.resource_protocol + 'www.youtube.com/embed/' + this.youtube_video +
                '?wmode=transparent&showinfo=0&modestbranding=0&rel=0&autoplay=1&loop=0&vq=hd1080';
        if (this.yt_custom) {
            video_src += '&enablejsapi=1&html5=1&controls=0';
            video_html =
                    '<div id="video-controls">' +
                        '<div id="video-progress" class="video-progress-el">' +
                            '<div id="video-progress-total" class="video-progress-el"></div>' +
                            '<div id="video-elapsed" class="video-progress-el"></div>' +
                        '</div>' +
                        '<div id="video-time" class="video-progress-el"></div>' +
                    '</div>';
        }
    } else if (this.vimeo_video) {
        video_src = this.resource_protocol + 'player.vimeo.com/video/' + this.vimeo_video + '?autoplay=1&title=0&byline=0&portrait=0';
    }
    if (this.show_video) {
        this.video_iframe =
                '<iframe id="' + MixpanelNotification.MARKUP_PREFIX + '-video-frame" ' +
                    'width="' + this.video_width + '" height="' + this.video_height + '" ' +
                    ' src="' + video_src + '"' +
                    ' frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen="1" scrolling="no"' +
                '></iframe>';
        video_html =
                '<div id="video-' + (this.flip_animate ? '' : 'no') + 'flip">' +
                    '<div id="video">' +
                        '<div id="video-holder"></div>' +
                        video_html +
                    '</div>' +
                '</div>';
    }
    var main_html = video_html + notification_html;
    if (this.flip_animate) {
        main_html =
                (this.mini ? notification_html : '') +
                '<div id="flipcontainer"><div id="flipper">' +
                    (this.mini ? video_html : main_html) +
                '</div></div>';
    }

    this.notification_el.innerHTML =
        ('<div id="overlay" class="' + this.notif_type + '">' +
            '<div id="campaignid-' + this.campaign_id + '">' +
                '<div id="bgwrapper">' +
                    '<div id="bg"></div>' +
                    main_html +
                '</div>' +
            '</div>' +
        '</div>')
            .replace(/class="/g, 'class="' + MixpanelNotification.MARKUP_PREFIX + '-')
            .replace(/id="/g, 'id="' + MixpanelNotification.MARKUP_PREFIX + '-');
};

MixpanelNotification.prototype._init_styles = function() {
    if (this.style === 'dark') {
        this.style_vals = {
            bg:             '#1d1f25',
            bg_actions:     '#282b32',
            bg_hover:       '#3a4147',
            bg_light:       '#4a5157',
            border_gray:    '#32353c',
            cancel_opacity: '0.4',
            mini_hover:     '#2a3137',
            text_title:     '#fff',
            text_main:      '#9498a3',
            text_tagline:   '#464851',
            text_hover:     '#ddd'
        };
    } else {
        this.style_vals = {
            bg:             '#fff',
            bg_actions:     '#e7eaee',
            bg_hover:       '#eceff3',
            bg_light:       '#f5f5f5',
            border_gray:    '#e4ecf2',
            cancel_opacity: '1.0',
            mini_hover:     '#fafafa',
            text_title:     '#5c6578',
            text_main:      '#8b949b',
            text_tagline:   '#ced9e6',
            text_hover:     '#7c8598'
        };
    }
    var shadow = '0px 0px 35px 0px rgba(45, 49, 56, 0.7)',
        video_shadow = shadow,
        mini_shadow = shadow,
        thumb_total_size = MixpanelNotification.THUMB_IMG_SIZE + MixpanelNotification.THUMB_BORDER_SIZE * 2,
        anim_seconds = (MixpanelNotification.ANIM_TIME / 1000) + 's';
    if (this.mini) {
        shadow = 'none';
    }

    // don't display on small viewports
    var notif_media_queries = {},
        min_width = MixpanelNotification.NOTIF_WIDTH_MINI + 20;
    notif_media_queries['@media only screen and (max-width: ' + (min_width - 1) + 'px)'] = {
        '#overlay': {
            'display': 'none'
        }
    };
    var notif_styles = {
        '.flipped': {
            'transform': 'rotateY(180deg)'
        },
        '#overlay': {
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',
            'overflow': 'auto',
            'text-align': 'center',
            'z-index': '10000',
            'font-family': '"Helvetica", "Arial", sans-serif',
            '-webkit-font-smoothing': 'antialiased',
            '-moz-osx-font-smoothing': 'grayscale'
        },
        '#overlay.mini': {
            'height': '0',
            'overflow': 'visible'
        },
        '#overlay a': {
            'width': 'initial',
            'padding': '0',
            'text-decoration': 'none',
            'text-transform': 'none',
            'color': 'inherit'
        },
        '#bgwrapper': {
            'position': 'relative',
            'width': '100%',
            'height': '100%'
        },
        '#bg': {
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',
            'min-width': this.doc_width * 4 + 'px',
            'min-height': this.doc_height * 4 + 'px',
            'background-color': 'black',
            'opacity': '0.0',
            '-ms-filter': 'progid:DXImageTransform.Microsoft.Alpha(Opacity=60)', // IE8
            'filter': 'alpha(opacity=60)', // IE5-7
            'transition': 'opacity ' + anim_seconds
        },
        '#bg.visible': {
            'opacity': MixpanelNotification.BG_OPACITY
        },
        '.mini #bg': {
            'width': '0',
            'height': '0',
            'min-width': '0'
        },
        '#flipcontainer': {
            'perspective': '1000px',
            'position': 'absolute',
            'width': '100%'
        },
        '#flipper': {
            'position': 'relative',
            'transform-style': 'preserve-3d',
            'transition': '0.3s'
        },
        '#takeover': {
            'position': 'absolute',
            'left': '50%',
            'width': MixpanelNotification.NOTIF_WIDTH + 'px',
            'margin-left': Math.round(-MixpanelNotification.NOTIF_WIDTH / 2) + 'px',
            'backface-visibility': 'hidden',
            'transform': 'rotateY(0deg)',
            'opacity': '0.0',
            'top': MixpanelNotification.NOTIF_START_TOP + 'px',
            'transition': 'opacity ' + anim_seconds + ', top ' + anim_seconds
        },
        '#takeover.visible': {
            'opacity': '1.0',
            'top': MixpanelNotification.NOTIF_TOP + 'px'
        },
        '#takeover.exiting': {
            'opacity': '0.0',
            'top': MixpanelNotification.NOTIF_START_TOP + 'px'
        },
        '#thumbspacer': {
            'height': MixpanelNotification.THUMB_OFFSET + 'px'
        },
        '#thumbborder-wrapper': {
            'position': 'absolute',
            'top': (-MixpanelNotification.THUMB_BORDER_SIZE) + 'px',
            'left': (MixpanelNotification.NOTIF_WIDTH / 2 - MixpanelNotification.THUMB_OFFSET - MixpanelNotification.THUMB_BORDER_SIZE) + 'px',
            'width': thumb_total_size + 'px',
            'height': (thumb_total_size / 2) + 'px',
            'overflow': 'hidden'
        },
        '#thumbborder': {
            'position': 'absolute',
            'width': thumb_total_size + 'px',
            'height': thumb_total_size + 'px',
            'border-radius': thumb_total_size + 'px',
            'background-color': this.style_vals.bg_actions,
            'opacity': '0.5'
        },
        '#thumbnail': {
            'position': 'absolute',
            'top': '0px',
            'left': (MixpanelNotification.NOTIF_WIDTH / 2 - MixpanelNotification.THUMB_OFFSET) + 'px',
            'width': MixpanelNotification.THUMB_IMG_SIZE + 'px',
            'height': MixpanelNotification.THUMB_IMG_SIZE + 'px',
            'overflow': 'hidden',
            'z-index': '100',
            'border-radius': MixpanelNotification.THUMB_IMG_SIZE + 'px'
        },
        '#mini': {
            'position': 'absolute',
            'right': '20px',
            'top': MixpanelNotification.NOTIF_TOP + 'px',
            'width': this.notif_width + 'px',
            'height': MixpanelNotification.NOTIF_HEIGHT_MINI * 2 + 'px',
            'margin-top': 20 - MixpanelNotification.NOTIF_HEIGHT_MINI + 'px',
            'backface-visibility': 'hidden',
            'opacity': '0.0',
            'transform': 'rotateX(90deg)',
            'transition': 'opacity 0.3s, transform 0.3s, right 0.3s'
        },
        '#mini.visible': {
            'opacity': '1.0',
            'transform': 'rotateX(0deg)'
        },
        '#mini.exiting': {
            'opacity': '0.0',
            'right': '-150px'
        },
        '#mainbox': {
            'border-radius': '4px',
            'box-shadow': shadow,
            'text-align': 'center',
            'background-color': this.style_vals.bg,
            'font-size': '14px',
            'color': this.style_vals.text_main
        },
        '#mini #mainbox': {
            'height': MixpanelNotification.NOTIF_HEIGHT_MINI + 'px',
            'margin-top': MixpanelNotification.NOTIF_HEIGHT_MINI + 'px',
            'border-radius': '3px',
            'transition': 'background-color ' + anim_seconds
        },
        '#mini-border': {
            'height': (MixpanelNotification.NOTIF_HEIGHT_MINI + 6) + 'px',
            'width': (MixpanelNotification.NOTIF_WIDTH_MINI + 6) + 'px',
            'position': 'absolute',
            'top': '-3px',
            'left': '-3px',
            'margin-top': MixpanelNotification.NOTIF_HEIGHT_MINI + 'px',
            'border-radius': '6px',
            'opacity': '0.25',
            'background-color': '#fff',
            'z-index': '-1',
            'box-shadow': mini_shadow
        },
        '#mini-icon': {
            'position': 'relative',
            'display': 'inline-block',
            'width': '75px',
            'height': MixpanelNotification.NOTIF_HEIGHT_MINI + 'px',
            'border-radius': '3px 0 0 3px',
            'background-color': this.style_vals.bg_actions,
            'background': 'linear-gradient(135deg, ' + this.style_vals.bg_light + ' 0%, ' + this.style_vals.bg_actions + ' 100%)',
            'transition': 'background-color ' + anim_seconds
        },
        '#mini:hover #mini-icon': {
            'background-color': this.style_vals.mini_hover
        },
        '#mini:hover #mainbox': {
            'background-color': this.style_vals.mini_hover
        },
        '#mini-icon-img': {
            'position': 'absolute',
            'background-image': 'url(' + this.thumb_image_url + ')',
            'width': '48px',
            'height': '48px',
            'top': '20px',
            'left': '12px'
        },
        '#content': {
            'padding': '30px 20px 0px 20px'
        },
        '#mini-content': {
            'text-align': 'left',
            'height': MixpanelNotification.NOTIF_HEIGHT_MINI + 'px',
            'cursor': 'pointer'
        },
        '#img': {
            'width': '328px',
            'margin-top': '30px',
            'border-radius': '5px'
        },
        '#title': {
            'max-height': '600px',
            'overflow': 'hidden',
            'word-wrap': 'break-word',
            'padding': '25px 0px 20px 0px',
            'font-size': '19px',
            'font-weight': 'bold',
            'color': this.style_vals.text_title
        },
        '#body': {
            'max-height': '600px',
            'margin-bottom': '25px',
            'overflow': 'hidden',
            'word-wrap': 'break-word',
            'line-height': '21px',
            'font-size': '15px',
            'font-weight': 'normal',
            'text-align': 'left'
        },
        '#mini #body': {
            'display': 'inline-block',
            'max-width': '250px',
            'margin': '0 0 0 30px',
            'height': MixpanelNotification.NOTIF_HEIGHT_MINI + 'px',
            'font-size': '16px',
            'letter-spacing': '0.8px',
            'color': this.style_vals.text_title
        },
        '#mini #body-text': {
            'display': 'table',
            'height': MixpanelNotification.NOTIF_HEIGHT_MINI + 'px'
        },
        '#mini #body-text div': {
            'display': 'table-cell',
            'vertical-align': 'middle'
        },
        '#tagline': {
            'margin-bottom': '15px',
            'font-size': '10px',
            'font-weight': '600',
            'letter-spacing': '0.8px',
            'color': '#ccd7e0',
            'text-align': 'left'
        },
        '#tagline a': {
            'color': this.style_vals.text_tagline,
            'transition': 'color ' + anim_seconds
        },
        '#tagline a:hover': {
            'color': this.style_vals.text_hover
        },
        '#cancel': {
            'position': 'absolute',
            'right': '0',
            'width': '8px',
            'height': '8px',
            'padding': '10px',
            'border-radius': '20px',
            'margin': '12px 12px 0 0',
            'box-sizing': 'content-box',
            'cursor': 'pointer',
            'transition': 'background-color ' + anim_seconds
        },
        '#mini #cancel': {
            'margin': '7px 7px 0 0'
        },
        '#cancel-icon': {
            'width': '8px',
            'height': '8px',
            'overflow': 'hidden',
            'background-image': 'url(' + this.cdn_host + '/site_media/images/icons/notifications/cancel-x.png)',
            'opacity': this.style_vals.cancel_opacity
        },
        '#cancel:hover': {
            'background-color': this.style_vals.bg_hover
        },
        '#button': {
            'display': 'block',
            'height': '60px',
            'line-height': '60px',
            'text-align': 'center',
            'background-color': this.style_vals.bg_actions,
            'border-radius': '0 0 4px 4px',
            'overflow': 'hidden',
            'cursor': 'pointer',
            'transition': 'background-color ' + anim_seconds
        },
        '#button-close': {
            'display': 'inline-block',
            'width': '9px',
            'height': '60px',
            'margin-right': '8px',
            'vertical-align': 'top',
            'background-image': 'url(' + this.cdn_host + '/site_media/images/icons/notifications/close-x-' + this.style + '.png)',
            'background-repeat': 'no-repeat',
            'background-position': '0px 25px'
        },
        '#button-play': {
            'display': 'inline-block',
            'width': '30px',
            'height': '60px',
            'margin-left': '15px',
            'background-image': 'url(' + this.cdn_host + '/site_media/images/icons/notifications/play-' + this.style + '-small.png)',
            'background-repeat': 'no-repeat',
            'background-position': '0px 15px'
        },
        'a#button-link': {
            'display': 'inline-block',
            'vertical-align': 'top',
            'text-align': 'center',
            'font-size': '17px',
            'font-weight': 'bold',
            'overflow': 'hidden',
            'word-wrap': 'break-word',
            'color': this.style_vals.text_title,
            'transition': 'color ' + anim_seconds
        },
        '#button:hover': {
            'background-color': this.style_vals.bg_hover,
            'color': this.style_vals.text_hover
        },
        '#button:hover a': {
            'color': this.style_vals.text_hover
        },

        '#video-noflip': {
            'position': 'relative',
            'top': (-this.video_height * 2) + 'px'
        },
        '#video-flip': {
            'backface-visibility': 'hidden',
            'transform': 'rotateY(180deg)'
        },
        '#video': {
            'position': 'absolute',
            'width': (this.video_width - 1) + 'px',
            'height': this.video_height + 'px',
            'top': MixpanelNotification.NOTIF_TOP + 'px',
            'margin-top': '100px',
            'left': '50%',
            'margin-left': Math.round(-this.video_width / 2) + 'px',
            'overflow': 'hidden',
            'border-radius': '5px',
            'box-shadow': video_shadow,
            'transform': 'translateZ(1px)', // webkit rendering bug http://stackoverflow.com/questions/18167981/clickable-link-area-unexpectedly-smaller-after-css-transform
            'transition': 'opacity ' + anim_seconds + ', top ' + anim_seconds
        },
        '#video.exiting': {
            'opacity': '0.0',
            'top': this.video_height + 'px'
        },
        '#video-holder': {
            'position': 'absolute',
            'width': (this.video_width - 1) + 'px',
            'height': this.video_height + 'px',
            'overflow': 'hidden',
            'border-radius': '5px'
        },
        '#video-frame': {
            'margin-left': '-1px',
            'width': this.video_width + 'px'
        },
        '#video-controls': {
            'opacity': '0',
            'transition': 'opacity 0.5s'
        },
        '#video:hover #video-controls': {
            'opacity': '1.0'
        },
        '#video .video-progress-el': {
            'position': 'absolute',
            'bottom': '0',
            'height': '25px',
            'border-radius': '0 0 0 5px'
        },
        '#video-progress': {
            'width': '90%'
        },
        '#video-progress-total': {
            'width': '100%',
            'background-color': this.style_vals.bg,
            'opacity': '0.7'
        },
        '#video-elapsed': {
            'width': '0',
            'background-color': '#6cb6f5',
            'opacity': '0.9'
        },
        '#video #video-time': {
            'width': '10%',
            'right': '0',
            'font-size': '11px',
            'line-height': '25px',
            'color': this.style_vals.text_main,
            'background-color': '#666',
            'border-radius': '0 0 5px 0'
        }
    };

    // IE hacks
    if (this._browser_lte('ie', 8)) {
        _.extend(notif_styles, {
            '* html #overlay': {
                'position': 'absolute'
            },
            '* html #bg': {
                'position': 'absolute'
            },
            'html, body': {
                'height': '100%'
            }
        });
    }
    if (this._browser_lte('ie', 7)) {
        _.extend(notif_styles, {
            '#mini #body': {
                'display': 'inline',
                'zoom': '1',
                'border': '1px solid ' + this.style_vals.bg_hover
            },
            '#mini #body-text': {
                'padding': '20px'
            },
            '#mini #mini-icon': {
                'display': 'none'
            }
        });
    }

    // add vendor-prefixed style rules
    var VENDOR_STYLES = [
            'backface-visibility', 'border-radius', 'box-shadow', 'opacity',
            'perspective', 'transform', 'transform-style', 'transition'
        ],
        VENDOR_PREFIXES = ['khtml', 'moz', 'ms', 'o', 'webkit'];
    for (var selector in notif_styles) {
        for (var si = 0; si < VENDOR_STYLES.length; si++) {
            var prop = VENDOR_STYLES[si];
            if (prop in notif_styles[selector]) {
                var val = notif_styles[selector][prop];
                for (var pi = 0; pi < VENDOR_PREFIXES.length; pi++) {
                    notif_styles[selector]['-' + VENDOR_PREFIXES[pi] + '-' + prop] = val;
                }
            }
        }
    }

    var inject_styles = function(styles, media_queries) {
        var create_style_text = function(style_defs) {
            var st = '';
            for (var selector in style_defs) {
                var mp_selector = selector
                    .replace(/#/g, '#' + MixpanelNotification.MARKUP_PREFIX + '-')
                    .replace(/\./g, '.' + MixpanelNotification.MARKUP_PREFIX + '-');
                st += '\n' + mp_selector + ' {';
                var props = style_defs[selector];
                for (var k in props) {
                    st += k + ':' + props[k] + ';';
                }
                st += '}';
            }
            return st;
        };
        var create_media_query_text = function(mq_defs) {
            var mqt = '';
            for (var mq in mq_defs) {
                mqt += '\n' + mq + ' {' + create_style_text(mq_defs[mq]) + '\n}';
            }
            return mqt;
        };

        var style_text = create_style_text(styles) + create_media_query_text(media_queries),
            head_el = document.head || document.getElementsByTagName('head')[0] || document.documentElement,
            style_el = document.createElement('style');
        head_el.appendChild(style_el);
        style_el.setAttribute('type', 'text/css');
        if (style_el.styleSheet) { // IE
            style_el.styleSheet.cssText = style_text;
        } else {
            style_el.textContent = style_text;
        }
    };
    inject_styles(notif_styles, notif_media_queries);
};

MixpanelNotification.prototype._init_video = _.safewrap(function() {
    if (!this.video_url) {
        return;
    }
    var self = this;

    // Youtube iframe API compatibility
    self.yt_custom = 'postMessage' in window;

    self.dest_url = self.video_url;
    var youtube_match = self.video_url.match(
            // http://stackoverflow.com/questions/2936467/parse-youtube-video-id-using-preg-match
            /(?:youtube(?:-nocookie)?\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i
        ),
        vimeo_match = self.video_url.match(
            /vimeo\.com\/.*?(\d+)/i
        );
    if (youtube_match) {
        self.show_video = true;
        self.youtube_video = youtube_match[1];

        if (self.yt_custom) {
            window['onYouTubeIframeAPIReady'] = function() {
                if (self._get_el('video-frame')) {
                    self._yt_video_ready();
                }
            };

            // load Youtube iframe API; see https://developers.google.com/youtube/iframe_api_reference
            var tag = document.createElement('script');
            tag.src = self.resource_protocol + 'www.youtube.com/iframe_api';
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    } else if (vimeo_match) {
        self.show_video = true;
        self.vimeo_video = vimeo_match[1];
    }

    // IE <= 7, FF <= 3: fall through to video link rather than embedded player
    if (self._browser_lte('ie', 7) || self._browser_lte('firefox', 3)) {
        self.show_video = false;
        self.clickthrough = true;
    }
});

MixpanelNotification.prototype._mark_as_shown = _.safewrap(function() {
    // click on background to dismiss
    var self = this;
    _.register_event(self._get_el('bg'), 'click', function() {
        self.dismiss();
    });

    var get_style = function(el, style_name) {
        var styles = {};
        if (document.defaultView && document.defaultView.getComputedStyle) {
            styles = document.defaultView.getComputedStyle(el, null); // FF3 requires both args
        } else if (el.currentStyle) { // IE
            styles = el.currentStyle;
        }
        return styles[style_name];
    };

    if (this.campaign_id) {
        var notif_el = this._get_el('overlay');
        if (notif_el && get_style(notif_el, 'visibility') !== 'hidden' && get_style(notif_el, 'display') !== 'none') {
            this._mark_delivery();
        }
    }
});

MixpanelNotification.prototype._mark_delivery = _.safewrap(function(extra_props) {
    if (!this.marked_as_shown) {
        this.marked_as_shown = true;

        if (this.campaign_id) {
            // mark notification shown (local cache)
            this._get_shown_campaigns()[this.campaign_id] = 1 * new Date();
            this.persistence.save();
        }

        // track delivery
        this._track_event('$campaign_delivery', extra_props);

        // mark notification shown (mixpanel property)
        this.mixpanel['people']['append']({
            '$campaigns': this.campaign_id,
            '$notifications': {
                'campaign_id': this.campaign_id,
                'message_id':  this.message_id,
                'type':        'web',
                'time':        new Date()
            }
        });
    }
});

MixpanelNotification.prototype._preload_images = function(all_loaded_cb) {
    var self = this;
    if (this.imgs_to_preload.length === 0) {
        all_loaded_cb();
        return;
    }

    var preloaded_imgs = 0;
    var img_objs = [];
    var onload = function() {
        preloaded_imgs++;
        if (preloaded_imgs === self.imgs_to_preload.length && all_loaded_cb) {
            all_loaded_cb();
            all_loaded_cb = null;
        }
    };
    for (var i = 0; i < this.imgs_to_preload.length; i++) {
        var img = new Image();
        img.onload = onload;
        img.src = this.imgs_to_preload[i];
        if (img.complete) {
            onload();
        }
        img_objs.push(img);
    }

    // IE6/7 doesn't fire onload reliably
    if (this._browser_lte('ie', 7)) {
        setTimeout(function() {
            var imgs_loaded = true;
            for (i = 0; i < img_objs.length; i++) {
                if (!img_objs[i].complete) {
                    imgs_loaded = false;
                }
            }
            if (imgs_loaded && all_loaded_cb) {
                all_loaded_cb();
                all_loaded_cb = null;
            }
        }, 500);
    }
};

MixpanelNotification.prototype._remove_notification_el = _.safewrap(function() {
    window.clearInterval(this._video_progress_checker);
    this.notification_el.style.visibility = 'hidden';
    this.body_el.removeChild(this.notification_el);
});

MixpanelNotification.prototype._set_client_config = function() {
    var get_browser_version = function(browser_ex) {
        var match = navigator.userAgent.match(browser_ex);
        return match && match[1];
    };
    this.browser_versions = {};
    this.browser_versions['chrome']  = get_browser_version(/Chrome\/(\d+)/);
    this.browser_versions['firefox'] = get_browser_version(/Firefox\/(\d+)/);
    this.browser_versions['ie']      = get_browser_version(/MSIE (\d+).+/);
    if (!this.browser_versions['ie'] && !(window.ActiveXObject) && 'ActiveXObject' in window) {
        this.browser_versions['ie'] = 11;
    }

    this.body_el = document.body || document.getElementsByTagName('body')[0];
    if (this.body_el) {
        this.doc_width = Math.max(
            this.body_el.scrollWidth, document.documentElement.scrollWidth,
            this.body_el.offsetWidth, document.documentElement.offsetWidth,
            this.body_el.clientWidth, document.documentElement.clientWidth
        );
        this.doc_height = Math.max(
            this.body_el.scrollHeight, document.documentElement.scrollHeight,
            this.body_el.offsetHeight, document.documentElement.offsetHeight,
            this.body_el.clientHeight, document.documentElement.clientHeight
        );
    }

    // detect CSS compatibility
    var ie_ver = this.browser_versions['ie'];
    var sample_styles = document.createElement('div').style,
        is_css_compatible = function(rule) {
            if (rule in sample_styles) {
                return true;
            }
            if (!ie_ver) {
                rule = rule[0].toUpperCase() + rule.slice(1);
                var props = ['O' + rule, 'Webkit' + rule, 'Moz' + rule];
                for (var i = 0; i < props.length; i++) {
                    if (props[i] in sample_styles) {
                        return true;
                    }
                }
            }
            return false;
        };
    this.use_transitions = this.body_el &&
        is_css_compatible('transition') &&
        is_css_compatible('transform');
    this.flip_animate = (this.browser_versions['chrome'] >= 33 || this.browser_versions['firefox'] >= 15) &&
        this.body_el &&
        is_css_compatible('backfaceVisibility') &&
        is_css_compatible('perspective') &&
        is_css_compatible('transform');
};

MixpanelNotification.prototype._switch_to_video = _.safewrap(function() {
    var self = this,
        anims = [
            {
                el:    self._get_notification_display_el(),
                attr:  'opacity',
                start: 1.0,
                goal:  0.0
            },
            {
                el:    self._get_notification_display_el(),
                attr:  'top',
                start: MixpanelNotification.NOTIF_TOP,
                goal:  -500
            },
            {
                el:    self._get_el('video-noflip'),
                attr:  'opacity',
                start: 0.0,
                goal:  1.0
            },
            {
                el:    self._get_el('video-noflip'),
                attr:  'top',
                start: -self.video_height * 2,
                goal:  0
            }
        ];

    if (self.mini) {
        var bg = self._get_el('bg'),
            overlay = self._get_el('overlay');
        bg.style.width = '100%';
        bg.style.height = '100%';
        overlay.style.width = '100%';

        self._add_class(self._get_notification_display_el(), 'exiting');
        self._add_class(bg, 'visible');

        anims.push({
            el:    self._get_el('bg'),
            attr:  'opacity',
            start: 0.0,
            goal:  MixpanelNotification.BG_OPACITY
        });
    }

    var video_el = self._get_el('video-holder');
    video_el.innerHTML = self.video_iframe;

    var video_ready = function() {
        if (window['YT'] && window['YT']['loaded']) {
            self._yt_video_ready();
        }
        self.showing_video = true;
        self._get_notification_display_el().style.visibility = 'hidden';
    };
    if (self.flip_animate) {
        self._add_class('flipper', 'flipped');
        setTimeout(video_ready, MixpanelNotification.ANIM_TIME);
    } else {
        self._animate_els(anims, MixpanelNotification.ANIM_TIME, video_ready);
    }
});

MixpanelNotification.prototype._track_event = function(event_name, properties, cb) {
    if (this.campaign_id) {
        properties = properties || {};
        properties = _.extend(properties, {
            'campaign_id':     this.campaign_id,
            'message_id':      this.message_id,
            'message_type':    'web_inapp',
            'message_subtype': this.notif_type
        });
        this.mixpanel['track'](event_name, properties, cb);
    } else if (cb) {
        cb.call();
    }
};

MixpanelNotification.prototype._yt_video_ready = _.safewrap(function() {
    var self = this;
    if (self.video_inited) {
        return;
    }
    self.video_inited = true;

    var progress_bar  = self._get_el('video-elapsed'),
        progress_time = self._get_el('video-time'),
        progress_el   = self._get_el('video-progress');

    new window['YT']['Player'](MixpanelNotification.MARKUP_PREFIX + '-video-frame', {
        'events': {
            'onReady': function(event) {
                var ytplayer = event['target'],
                    video_duration = ytplayer['getDuration'](),
                    pad = function(i) {
                        return ('00' + i).slice(-2);
                    },
                    update_video_time = function(current_time) {
                        var secs = Math.round(video_duration - current_time),
                            mins = Math.floor(secs / 60),
                            hours = Math.floor(mins / 60);
                        secs -= mins * 60;
                        mins -= hours * 60;
                        progress_time.innerHTML = '-' + (hours ? hours + ':' : '') + pad(mins) + ':' + pad(secs);
                    };
                update_video_time(0);
                self._video_progress_checker = window.setInterval(function() {
                    var current_time = ytplayer['getCurrentTime']();
                    progress_bar.style.width = (current_time / video_duration * 100) + '%';
                    update_video_time(current_time);
                }, 250);
                _.register_event(progress_el, 'click', function(e) {
                    var clickx = Math.max(0, e.pageX - progress_el.getBoundingClientRect().left);
                    ytplayer['seekTo'](video_duration * clickx / progress_el.clientWidth, true);
                });
            }
        }
    });
});

export { MixpanelNotification };

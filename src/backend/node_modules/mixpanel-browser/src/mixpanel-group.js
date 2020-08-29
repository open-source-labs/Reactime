/* eslint camelcase: "off" */
import { addOptOutCheckMixpanelGroup } from './gdpr-utils';
import { apiActions } from './api-actions';
import { _ } from './utils';

/**
 * Mixpanel Group Object
 * @constructor
 */
var MixpanelGroup = function() {};

_.extend(MixpanelGroup.prototype, apiActions);

MixpanelGroup.prototype._init = function(mixpanel_instance, group_key, group_id) {
    this._mixpanel = mixpanel_instance;
    this._group_key = group_key;
    this._group_id = group_id;
};

/**
 * Set properties on a group.
 *
 * ### Usage:
 *
 *     mixpanel.get_group('company', 'mixpanel').set('Location', '405 Howard');
 *
 *     // or set multiple properties at once
 *     mixpanel.get_group('company', 'mixpanel').set({
 *          'Location': '405 Howard',
 *          'Founded' : 2009,
 *     });
 *     // properties can be strings, integers, dates, or lists
 *
 * @param {Object|String} prop If a string, this is the name of the property. If an object, this is an associative array of names and values.
 * @param {*} [to] A value to set on the given property name
 * @param {Function} [callback] If provided, the callback will be called after the tracking event
 */
MixpanelGroup.prototype.set = addOptOutCheckMixpanelGroup(function(prop, to, callback) {
    var data = this.set_action(prop, to);
    if (_.isObject(prop)) {
        callback = to;
    }
    return this._send_request(data, callback);
});

/**
 * Set properties on a group, only if they do not yet exist.
 * This will not overwrite previous group property values, unlike
 * group.set().
 *
 * ### Usage:
 *
 *     mixpanel.get_group('company', 'mixpanel').set_once('Location', '405 Howard');
 *
 *     // or set multiple properties at once
 *     mixpanel.get_group('company', 'mixpanel').set_once({
 *          'Location': '405 Howard',
 *          'Founded' : 2009,
 *     });
 *     // properties can be strings, integers, lists or dates
 *
 * @param {Object|String} prop If a string, this is the name of the property. If an object, this is an associative array of names and values.
 * @param {*} [to] A value to set on the given property name
 * @param {Function} [callback] If provided, the callback will be called after the tracking event
 */
MixpanelGroup.prototype.set_once = addOptOutCheckMixpanelGroup(function(prop, to, callback) {
    var data = this.set_once_action(prop, to);
    if (_.isObject(prop)) {
        callback = to;
    }
    return this._send_request(data, callback);
});

/**
 * Unset properties on a group permanently.
 *
 * ### Usage:
 *
 *     mixpanel.get_group('company', 'mixpanel').unset('Founded');
 *
 * @param {String} prop The name of the property.
 * @param {Function} [callback] If provided, the callback will be called after the tracking event
 */
MixpanelGroup.prototype.unset = addOptOutCheckMixpanelGroup(function(prop, callback) {
    var data = this.unset_action(prop);
    return this._send_request(data, callback);
});

/**
 * Merge a given list with a list-valued group property, excluding duplicate values.
 *
 * ### Usage:
 *
 *     // merge a value to a list, creating it if needed
 *     mixpanel.get_group('company', 'mixpanel').union('Location', ['San Francisco', 'London']);
 *
 * @param {String} list_name Name of the property.
 * @param {Array} values Values to merge with the given property
 * @param {Function} [callback] If provided, the callback will be called after the tracking event
 */
MixpanelGroup.prototype.union = addOptOutCheckMixpanelGroup(function(list_name, values, callback) {
    if (_.isObject(list_name)) {
        callback = values;
    }
    var data = this.union_action(list_name, values);
    return this._send_request(data, callback);
});

/**
 * Permanently delete a group.
 *
 * ### Usage:
 *     mixpanel.get_group('company', 'mixpanel').delete();
 */
MixpanelGroup.prototype['delete'] = addOptOutCheckMixpanelGroup(function(callback) {
    var data = this.delete_action();
    return this._send_request(data, callback);
});

/**
 * Remove a property from a group. The value will be ignored if doesn't exist.
 *
 * ### Usage:
 *
 *     mixpanel.get_group('company', 'mixpanel').remove('Location', 'London');
 *
 * @param {String} list_name Name of the property.
 * @param {Object} value Value to remove from the given group property
 * @param {Function} [callback] If provided, the callback will be called after the tracking event
 */
MixpanelGroup.prototype.remove = addOptOutCheckMixpanelGroup(function(list_name, value, callback) {
    var data = this.remove_action(list_name, value);
    return this._send_request(data, callback);
});

MixpanelGroup.prototype._send_request = function(data, callback) {
    data['$group_key'] = this._group_key;
    data['$group_id'] = this._group_id;
    data['$token'] = this._get_config('token');

    var date_encoded_data = _.encodeDates(data);
    return this._mixpanel._track_or_batch({
        truncated_data: _.truncate(date_encoded_data, 255),
        endpoint: this._get_config('api_host') + '/groups/',
        batcher: this._mixpanel.request_batchers.groups
    }, callback);
};

MixpanelGroup.prototype._is_reserved_property = function(prop) {
    return prop === '$group_key' || prop === '$group_id';
};

MixpanelGroup.prototype._get_config = function(conf) {
    return this._mixpanel.get_config(conf);
};

MixpanelGroup.prototype.toString = function() {
    return this._mixpanel.toString() + '.group.' + this._group_key + '.' + this._group_id;
};

// MixpanelGroup Exports
MixpanelGroup.prototype['remove']   = MixpanelGroup.prototype.remove;
MixpanelGroup.prototype['set']      = MixpanelGroup.prototype.set;
MixpanelGroup.prototype['set_once'] = MixpanelGroup.prototype.set_once;
MixpanelGroup.prototype['union']    = MixpanelGroup.prototype.union;
MixpanelGroup.prototype['unset']    = MixpanelGroup.prototype.unset;
MixpanelGroup.prototype['toString'] = MixpanelGroup.prototype.toString;

export {MixpanelGroup};

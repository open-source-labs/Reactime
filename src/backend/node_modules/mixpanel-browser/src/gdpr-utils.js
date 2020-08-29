/**
 * GDPR utils
 *
 * The General Data Protection Regulation (GDPR) is a regulation in EU law on data protection
 * and privacy for all individuals within the European Union. It addresses the export of personal
 * data outside the EU. The GDPR aims primarily to give control back to citizens and residents
 * over their personal data and to simplify the regulatory environment for international business
 * by unifying the regulation within the EU.
 *
 * This set of utilities is intended to enable opt in/out functionality in the Mixpanel JS SDK.
 * These functions are used internally by the SDK and are not intended to be publicly exposed.
 */

import { _, window } from './utils';

/**
 * A function used to track a Mixpanel event (e.g. MixpanelLib.track)
 * @callback trackFunction
 * @param {String} event_name The name of the event. This can be anything the user does - 'Button Click', 'Sign Up', 'Item Purchased', etc.
 * @param {Object} [properties] A set of properties to include with the event you're sending. These describe the user who did the event or details about the event itself.
 * @param {Function} [callback] If provided, the callback function will be called after tracking the event.
 */

/** Public **/

var GDPR_DEFAULT_PERSISTENCE_PREFIX = '__mp_opt_in_out_';

/**
 * Opt the user in to data tracking and cookies/localstorage for the given token
 * @param {string} token - Mixpanel project tracking token
 * @param {Object} [options]
 * @param {trackFunction} [options.track] - function used for tracking a Mixpanel event to record the opt-in action
 * @param {string} [options.trackEventName] - event name to be used for tracking the opt-in action
 * @param {Object} [options.trackProperties] - set of properties to be tracked along with the opt-in action
 * @param {string} [options.persistenceType] Persistence mechanism used - cookie or localStorage
 * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
 * @param {Number} [options.cookieExpiration] - number of days until the opt-in cookie expires
 * @param {string} [options.cookieDomain] - custom cookie domain
 * @param {boolean} [options.crossSiteCookie] - whether the opt-in cookie is set as cross-site-enabled
 * @param {boolean} [options.crossSubdomainCookie] - whether the opt-in cookie is set as cross-subdomain or not
 * @param {boolean} [options.secureCookie] - whether the opt-in cookie is set as secure or not
 */
export function optIn(token, options) {
    _optInOut(true, token, options);
}

/**
 * Opt the user out of data tracking and cookies/localstorage for the given token
 * @param {string} token - Mixpanel project tracking token
 * @param {Object} [options]
 * @param {string} [options.persistenceType] Persistence mechanism used - cookie or localStorage
 * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
 * @param {Number} [options.cookieExpiration] - number of days until the opt-out cookie expires
 * @param {string} [options.cookieDomain] - custom cookie domain
 * @param {boolean} [options.crossSiteCookie] - whether the opt-in cookie is set as cross-site-enabled
 * @param {boolean} [options.crossSubdomainCookie] - whether the opt-out cookie is set as cross-subdomain or not
 * @param {boolean} [options.secureCookie] - whether the opt-out cookie is set as secure or not
 */
export function optOut(token, options) {
    _optInOut(false, token, options);
}

/**
 * Check whether the user has opted in to data tracking and cookies/localstorage for the given token
 * @param {string} token - Mixpanel project tracking token
 * @param {Object} [options]
 * @param {string} [options.persistenceType] Persistence mechanism used - cookie or localStorage
 * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
 * @returns {boolean} whether the user has opted in to the given opt type
 */
export function hasOptedIn(token, options) {
    return _getStorageValue(token, options) === '1';
}

/**
 * Check whether the user has opted out of data tracking and cookies/localstorage for the given token
 * @param {string} token - Mixpanel project tracking token
 * @param {Object} [options]
 * @param {string} [options.persistenceType] Persistence mechanism used - cookie or localStorage
 * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
 * @param {boolean} [options.ignoreDnt] - flag to ignore browser DNT settings and always return false
 * @returns {boolean} whether the user has opted out of the given opt type
 */
export function hasOptedOut(token, options) {
    if (_hasDoNotTrackFlagOn(options)) {
        return true;
    }
    return _getStorageValue(token, options) === '0';
}

/**
 * Wrap a MixpanelLib method with a check for whether the user is opted out of data tracking and cookies/localstorage for the given token
 * If the user has opted out, return early instead of executing the method.
 * If a callback argument was provided, execute it passing the 0 error code.
 * @param {function} method - wrapped method to be executed if the user has not opted out
 * @returns {*} the result of executing method OR undefined if the user has opted out
 */
export function addOptOutCheckMixpanelLib(method) {
    return _addOptOutCheck(method, function(name) {
        return this.get_config(name);
    });
}

/**
 * Wrap a MixpanelPeople method with a check for whether the user is opted out of data tracking and cookies/localstorage for the given token
 * If the user has opted out, return early instead of executing the method.
 * If a callback argument was provided, execute it passing the 0 error code.
 * @param {function} method - wrapped method to be executed if the user has not opted out
 * @returns {*} the result of executing method OR undefined if the user has opted out
 */
export function addOptOutCheckMixpanelPeople(method) {
    return _addOptOutCheck(method, function(name) {
        return this._get_config(name);
    });
}

/**
 * Wrap a MixpanelGroup method with a check for whether the user is opted out of data tracking and cookies/localstorage for the given token
 * If the user has opted out, return early instead of executing the method.
 * If a callback argument was provided, execute it passing the 0 error code.
 * @param {function} method - wrapped method to be executed if the user has not opted out
 * @returns {*} the result of executing method OR undefined if the user has opted out
 */
export function addOptOutCheckMixpanelGroup(method) {
    return _addOptOutCheck(method, function(name) {
        return this._get_config(name);
    });
}

/**
 * Clear the user's opt in/out status of data tracking and cookies/localstorage for the given token
 * @param {string} token - Mixpanel project tracking token
 * @param {Object} [options]
 * @param {string} [options.persistenceType] Persistence mechanism used - cookie or localStorage
 * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
 * @param {Number} [options.cookieExpiration] - number of days until the opt-in cookie expires
 * @param {string} [options.cookieDomain] - custom cookie domain
 * @param {boolean} [options.crossSiteCookie] - whether the opt-in cookie is set as cross-site-enabled
 * @param {boolean} [options.crossSubdomainCookie] - whether the opt-in cookie is set as cross-subdomain or not
 * @param {boolean} [options.secureCookie] - whether the opt-in cookie is set as secure or not
 */
export function clearOptInOut(token, options) {
    options = options || {};
    _getStorage(options).remove(
        _getStorageKey(token, options), !!options.crossSubdomainCookie, options.cookieDomain
    );
}

/** Private **/

/**
 * Get storage util
 * @param {Object} [options]
 * @param {string} [options.persistenceType]
 * @returns {object} either _.cookie or _.localstorage
 */
function _getStorage(options) {
    options = options || {};
    return options.persistenceType === 'localStorage' ? _.localStorage : _.cookie;
}

/**
 * Get the name of the cookie that is used for the given opt type (tracking, cookie, etc.)
 * @param {string} token - Mixpanel project tracking token
 * @param {Object} [options]
 * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
 * @returns {string} the name of the cookie for the given opt type
 */
function _getStorageKey(token, options) {
    options = options || {};
    return (options.persistencePrefix || GDPR_DEFAULT_PERSISTENCE_PREFIX) + token;
}

/**
 * Get the value of the cookie that is used for the given opt type (tracking, cookie, etc.)
 * @param {string} token - Mixpanel project tracking token
 * @param {Object} [options]
 * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
 * @returns {string} the value of the cookie for the given opt type
 */
function _getStorageValue(token, options) {
    return _getStorage(options).get(_getStorageKey(token, options));
}

/**
 * Check whether the user has set the DNT/doNotTrack setting to true in their browser
 * @param {Object} [options]
 * @param {string} [options.window] - alternate window object to check; used to force various DNT settings in browser tests
 * @param {boolean} [options.ignoreDnt] - flag to ignore browser DNT settings and always return false
 * @returns {boolean} whether the DNT setting is true
 */
function _hasDoNotTrackFlagOn(options) {
    if (options && options.ignoreDnt) {
        return false;
    }
    var win = (options && options.window) || window;
    var nav = win['navigator'] || {};
    var hasDntOn = false;

    _.each([
        nav['doNotTrack'], // standard
        nav['msDoNotTrack'],
        win['doNotTrack']
    ], function(dntValue) {
        if (_.includes([true, 1, '1', 'yes'], dntValue)) {
            hasDntOn = true;
        }
    });

    return hasDntOn;
}

/**
 * Set cookie/localstorage for the user indicating that they are opted in or out for the given opt type
 * @param {boolean} optValue - whether to opt the user in or out for the given opt type
 * @param {string} token - Mixpanel project tracking token
 * @param {Object} [options]
 * @param {trackFunction} [options.track] - function used for tracking a Mixpanel event to record the opt-in action
 * @param {string} [options.trackEventName] - event name to be used for tracking the opt-in action
 * @param {Object} [options.trackProperties] - set of properties to be tracked along with the opt-in action
 * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
 * @param {Number} [options.cookieExpiration] - number of days until the opt-in cookie expires
 * @param {string} [options.cookieDomain] - custom cookie domain
 * @param {boolean} [options.crossSiteCookie] - whether the opt-in cookie is set as cross-site-enabled
 * @param {boolean} [options.crossSubdomainCookie] - whether the opt-in cookie is set as cross-subdomain or not
 * @param {boolean} [options.secureCookie] - whether the opt-in cookie is set as secure or not
 */
function _optInOut(optValue, token, options) {
    if (!_.isString(token) || !token.length) {
        console.error('gdpr.' + (optValue ? 'optIn' : 'optOut') + ' called with an invalid token');
        return;
    }

    options = options || {};

    _getStorage(options).set(
        _getStorageKey(token, options),
        optValue ? 1 : 0,
        _.isNumber(options.cookieExpiration) ? options.cookieExpiration : null,
        !!options.crossSubdomainCookie,
        !!options.secureCookie,
        !!options.crossSiteCookie,
        options.cookieDomain
    );

    if (options.track && optValue) { // only track event if opting in (optValue=true)
        options.track(options.trackEventName || '$opt_in', options.trackProperties, {
            'send_immediately': true
        });
    }
}

/**
 * Wrap a method with a check for whether the user is opted out of data tracking and cookies/localstorage for the given token
 * If the user has opted out, return early instead of executing the method.
 * If a callback argument was provided, execute it passing the 0 error code.
 * @param {function} method - wrapped method to be executed if the user has not opted out
 * @param {function} getConfigValue - getter function for the Mixpanel API token and other options to be used with opt-out check
 * @returns {*} the result of executing method OR undefined if the user has opted out
 */
function _addOptOutCheck(method, getConfigValue) {
    return function() {
        var optedOut = false;

        try {
            var token = getConfigValue.call(this, 'token');
            var ignoreDnt = getConfigValue.call(this, 'ignore_dnt');
            var persistenceType = getConfigValue.call(this, 'opt_out_tracking_persistence_type');
            var persistencePrefix = getConfigValue.call(this, 'opt_out_tracking_cookie_prefix');
            var win = getConfigValue.call(this, 'window'); // used to override window during browser tests

            if (token) { // if there was an issue getting the token, continue method execution as normal
                optedOut = hasOptedOut(token, {
                    ignoreDnt: ignoreDnt,
                    persistenceType: persistenceType,
                    persistencePrefix: persistencePrefix,
                    window: win
                });
            }
        } catch(err) {
            console.error('Unexpected error when checking tracking opt-out status: ' + err);
        }

        if (!optedOut) {
            return method.apply(this, arguments);
        }

        var callback = arguments[arguments.length - 1];
        if (typeof(callback) === 'function') {
            callback(0);
        }

        return;
    };
}

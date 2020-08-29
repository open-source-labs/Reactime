const {merge_modifiers, ProfileHelpers} = require('./profile_helpers');

class MixpanelPeople extends ProfileHelpers() {
    constructor(mp_instance) {
        super();
        this.mixpanel = mp_instance;
        this.endpoint = '/engage';
    }

    /** people.set_once(distinct_id, prop, to, modifiers, callback)
        ---
        The same as people.set but in the words of mixpanel:
        mixpanel.people.set_once

        " This method allows you to set a user attribute, only if
            it is not currently set. It can be called multiple times
            safely, so is perfect for storing things like the first date
            you saw a user, or the referrer that brought them to your
            website for the first time. "

    */
    set_once(distinct_id, prop, to, modifiers, callback) {
        const identifiers = {$distinct_id: distinct_id};
        this._set(prop, to, modifiers, callback, {identifiers, set_once: true});
    }

    /**
        people.set(distinct_id, prop, to, modifiers, callback)
        ---
        set properties on an user record in engage

        usage:

            mixpanel.people.set('bob', 'gender', 'm');

            mixpanel.people.set('joe', {
                'company': 'acme',
                'plan': 'premium'
            });
    */
    set(distinct_id, prop, to, modifiers, callback) {
        const identifiers = {$distinct_id: distinct_id};
        this._set(prop, to, modifiers, callback, {identifiers});
    }

    /**
        people.increment(distinct_id, prop, by, modifiers, callback)
        ---
        increment/decrement properties on an user record in engage

        usage:

            mixpanel.people.increment('bob', 'page_views', 1);

            // or, for convenience, if you're just incrementing a counter by 1, you can
            // simply do
            mixpanel.people.increment('bob', 'page_views');

            // to decrement a counter, pass a negative number
            mixpanel.people.increment('bob', 'credits_left', -1);

            // like mixpanel.people.set(), you can increment multiple properties at once:
            mixpanel.people.increment('bob', {
                counter1: 1,
                counter2: 3,
                counter3: -2
            });
    */
    increment(distinct_id, prop, by, modifiers, callback) {
        // TODO extract to ProfileHelpers

        var $add = {};

        if (typeof(prop) === 'object') {
            if (typeof(by) === 'object') {
                callback = modifiers;
                modifiers = by;
            } else {
                callback = by;
            }
            for (const [key, val] of Object.entries(prop)) {
                if (isNaN(parseFloat(val))) {
                    if (this.mixpanel.config.debug) {
                        console.error("Invalid increment value passed to mixpanel.people.increment - must be a number");
                        console.error("Passed " + key + ":" + val);
                    }
                } else {
                    $add[key] = val;
                }
            };
        } else {
            if (typeof(by) === 'number' || !by) {
                by = by || 1;
                $add[prop] = by;
                if (typeof(modifiers) === 'function') {
                    callback = modifiers;
                }
            } else if (typeof(by) === 'function') {
                callback = by;
                $add[prop] = 1;
            } else {
                callback = modifiers;
                modifiers = (typeof(by) === 'object') ? by : {};
                $add[prop] = 1;
            }
        }

        var data = {
            '$add': $add,
            '$token': this.mixpanel.token,
            '$distinct_id': distinct_id
        };

        data = merge_modifiers(data, modifiers);

        if (this.mixpanel.config.debug) {
            console.log("Sending the following data to Mixpanel (Engage):");
            console.log(data);
        }

        this.mixpanel.send_request({ method: "GET", endpoint: "/engage", data: data }, callback);
    }

    /**
        people.append(distinct_id, prop, value, modifiers, callback)
        ---
        Append a value to a list-valued people analytics property.

        usage:

            // append a value to a list, creating it if needed
            mixpanel.people.append('bob', 'pages_visited', 'homepage');

            // like mixpanel.people.set(), you can append multiple properties at once:
            mixpanel.people.append('bob', {
                list1: 'bob',
                list2: 123
            });
    */
    append(distinct_id, prop, value, modifiers, callback) {
        // TODO extract to ProfileHelpers

        var $append = {};

        if (typeof(prop) === 'object') {
            if (typeof(value) === 'object') {
                callback = modifiers;
                modifiers = value;
            } else {
                callback = value;
            }
            Object.keys(prop).forEach(function(key) {
                $append[key] = prop[key];
            });
        } else {
            $append[prop] = value;
            if (typeof(modifiers) === 'function') {
                callback = modifiers;
            }
        }

        var data = {
            '$append': $append,
            '$token': this.mixpanel.token,
            '$distinct_id': distinct_id
        };

        data = merge_modifiers(data, modifiers);

        if (this.mixpanel.config.debug) {
            console.log("Sending the following data to Mixpanel (Engage):");
            console.log(data);
        }

        this.mixpanel.send_request({ method: "GET", endpoint: "/engage", data: data }, callback);
    }

    /**
        people.track_charge(distinct_id, amount, properties, modifiers, callback)
        ---
        Record that you have charged the current user a certain
        amount of money.

        usage:

            // charge a user $29.99
            mixpanel.people.track_charge('bob', 29.99);

            // charge a user $19 on the 1st of february
            mixpanel.people.track_charge('bob', 19, { '$time': new Date('feb 1 2012') });
    */
    track_charge(distinct_id, amount, properties, modifiers, callback) {
        if (typeof(properties) === 'function' || !properties) {
            callback = properties || function() {};
            properties = {};
        } else {
            if (typeof(modifiers) === 'function' || !modifiers) {
                callback = modifiers || function() {};
                if (properties.$ignore_time || properties.hasOwnProperty("$ip")) {
                    modifiers = {};
                    Object.keys(properties).forEach(function(key) {
                        modifiers[key] = properties[key];
                        delete properties[key];
                    });
                }
            }
        }

        if (typeof(amount) !== 'number') {
            amount = parseFloat(amount);
            if (isNaN(amount)) {
                console.error("Invalid value passed to mixpanel.people.track_charge - must be a number");
                return;
            }
        }

        properties.$amount = amount;

        if (properties.hasOwnProperty('$time')) {
            var time = properties.$time;
            if (Object.prototype.toString.call(time) === '[object Date]') {
                properties.$time = time.toISOString();
            }
        }

        var data = {
            '$append': { '$transactions': properties },
            '$token': this.mixpanel.token,
            '$distinct_id': distinct_id
        };

        data = merge_modifiers(data, modifiers);

        if (this.mixpanel.config.debug) {
            console.log("Sending the following data to Mixpanel (Engage):");
            console.log(data);
        }

        this.mixpanel.send_request({ method: "GET", endpoint: "/engage", data: data }, callback);
    }

    /**
        people.clear_charges(distinct_id, modifiers, callback)
        ---
        Clear all the current user's transactions.

        usage:

            mixpanel.people.clear_charges('bob');
    */
    clear_charges(distinct_id, modifiers, callback) {
        var data = {
            '$set': { '$transactions': [] },
            '$token': this.mixpanel.token,
            '$distinct_id': distinct_id
        };

        if (typeof(modifiers) === 'function') { callback = modifiers; }

        data = merge_modifiers(data, modifiers);

        if (this.mixpanel.config.debug) {
            console.log("Clearing this user's charges:", distinct_id);
        }

        this.mixpanel.send_request({ method: "GET", endpoint: "/engage", data: data }, callback);
    }

    /**
        people.delete_user(distinct_id, modifiers, callback)
        ---
        delete an user record in engage

        usage:

            mixpanel.people.delete_user('bob');
    */
    delete_user(distinct_id, modifiers, callback) {
        const identifiers = {$distinct_id: distinct_id};
        this._delete_profile({identifiers, modifiers, callback});
    }

    /**
        people.remove(distinct_id, data, modifiers, callback)
        ---
        remove a value from a list-valued user profile property.

        usage:

            mixpanel.people.remove('bob', {'browsers': 'firefox'});

            mixpanel.people.remove('bob', {'browsers': 'chrome', 'os': 'linux'});
    */
    remove(distinct_id, data, modifiers, callback) {
        const identifiers = {'$distinct_id': distinct_id};
        this._remove({identifiers, data, modifiers, callback})
    }

    /**
        people.union(distinct_id, data, modifiers, callback)
        ---
        merge value(s) into a list-valued people analytics property.

        usage:

            mixpanel.people.union('bob', {'browsers': 'firefox'});

            mixpanel.people.union('bob', {'browsers': ['chrome'], os: ['linux']});
    */
    union(distinct_id, data, modifiers, callback) {
        const identifiers = {$distinct_id: distinct_id};
        this._union({identifiers, data, modifiers, callback});
    }

    /**
        people.unset(distinct_id, prop, modifiers, callback)
        ---
        delete a property on an user record in engage

        usage:

            mixpanel.people.unset('bob', 'page_views');

            mixpanel.people.unset('bob', ['page_views', 'last_login']);
    */
    unset(distinct_id, prop, modifiers, callback) {
        const identifiers = {$distinct_id: distinct_id};
        this._unset({identifiers, prop, modifiers, callback});
    }
};

exports.MixpanelPeople = MixpanelPeople;

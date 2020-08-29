const Mixpanel = require('../lib/mixpanel-node');
const Sinon = require('sinon');
const {create_profile_helpers} = require('../lib/profile_helpers');

// shared test case
const test_send_request_args = function(test, func, {args, expected, use_modifiers, use_callback} = {}) {
    let expected_data = {$token: this.token, $distinct_id: this.distinct_id, ...expected};
    let callback;

    args = [this.distinct_id, ...(args ? args : [])];

    if (use_modifiers) {
        var modifiers = {
            '$ignore_alias': true,
            '$ignore_time': true,
            '$ip': '1.2.3.4',
            '$time': 1234567890
        };
        Object.assign(expected_data, modifiers);
        args.push(modifiers);
    }
    if (use_callback) {
        callback = function() {};
        args.push(callback);
    }

    this.mixpanel.people[func](...args);

    const expectedSendRequestArgs = [{ method: 'GET', endpoint: this.endpoint, data: expected_data }];
    test.ok(
        this.send_request.calledWithMatch(...expectedSendRequestArgs),
        `people.${func} didn't call send_request with correct arguments
        Actual arguments:    ${JSON.stringify(this.send_request.getCall(0).args)}
        expected to include: ${JSON.stringify(expectedSendRequestArgs)}`
    );
    if (use_callback) {
        test.ok(
            this.send_request.args[0][1] === callback,
            `people.${func} didn't call send_request with a callback`
        );
    }
    test.done();
};

exports.people = {
    setUp: function(next) {
        this.endpoint = '/engage';
        this.distinct_id = 'user1';
        this.token = 'token';

        this.send_request = Sinon.stub();

        this.mixpanel = Mixpanel.init(this.token);
        this.mixpanel.send_request = this.send_request

        this.test_send_request_args = test_send_request_args;

        next();
    },

    tearDown: function(next) {
        next();
    },

    _set: {
        "handles set_once correctly": function(test){
            this.test_send_request_args(test, 'set_once', {
                args: ['key1', 'val1'],
                expected: {$set_once: {'key1': 'val1'}},
            });
        },

        "calls send_request with correct endpoint and data": function(test) {
            this.test_send_request_args(test, 'set', {
                args: ['key1', 'val1'],
                expected: {$set: {'key1': 'val1'}},
            });
        },

        "supports being called with a property object": function(test) {
            this.test_send_request_args(test, 'set', {
                args: [{'key1': 'val1', 'key2': 'val2'}],
                expected: {$set: {'key1': 'val1', 'key2': 'val2'}},
            });
        },

        "supports being called with a property object (set_once)": function(test) {
            this.test_send_request_args(test, 'set_once', {
                args: [{'key1': 'val1', 'key2': 'val2'}],
                expected: {$set_once: {'key1': 'val1', 'key2': 'val2'}},
            });
        },

        "supports being called with a modifiers argument": function(test) {
            this.test_send_request_args(test, 'set', {
                args: ['key1', 'val1'],
                expected: {$set: {'key1': 'val1'}},
                use_modifiers: true,
            });
        },

        "supports being called with a modifiers argument (set_once)": function(test) {
            this.test_send_request_args(test, 'set_once', {
                args: ['key1', 'val1'],
                expected: {$set_once: {'key1': 'val1'}},
                use_modifiers: true,
            });
        },

        "supports being called with a properties object and a modifiers argument": function(test) {
            this.test_send_request_args(test, 'set', {
                args: [{'key1': 'val1', 'key2': 'val2'}],
                expected: {$set: {'key1': 'val1', 'key2': 'val2'}},
                use_modifiers: true,
            });
        },

        "supports being called with a properties object and a modifiers argument (set_once)": function(test) {
            this.test_send_request_args(test, 'set_once', {
                args: [{'key1': 'val1', 'key2': 'val2'}],
                expected: {$set_once: {'key1': 'val1', 'key2': 'val2'}},
                use_modifiers: true,
            });
        },

        "handles the ip property in a property object properly": function(test) {
            this.test_send_request_args(test, 'set', {
                args: [{'ip': '1.2.3.4', 'key1': 'val1', 'key2': 'val2'}],
                expected: {
                    $ip: '1.2.3.4',
                    $set: {'key1': 'val1', 'key2': 'val2'},
                },
            });
        },

        "handles the $ignore_time property in a property object properly": function(test) {
            this.test_send_request_args(test, 'set', {
                args: [{'$ignore_time': true, 'key1': 'val1', 'key2': 'val2'}],
                expected: {
                    $ignore_time: true,
                    $set: {'key1': 'val1', 'key2': 'val2'},
                },
            });
        },

        "supports being called with a callback": function(test) {
            this.test_send_request_args(test, 'set', {
                args: ['key1', 'val1'],
                expected: {$set: {'key1': 'val1'}},
                use_callback: true,
            });
        },

        "supports being called with a callback (set_once)": function(test) {
            this.test_send_request_args(test, 'set_once', {
                args: ['key1', 'val1'],
                expected: {$set_once: {'key1': 'val1'}},
                use_callback: true,
            });
        },

        "supports being called with a properties object and a callback": function(test) {
            this.test_send_request_args(test, 'set', {
                args: [{'key1': 'val1', 'key2': 'val2'}],
                expected: {$set: {'key1': 'val1', 'key2': 'val2'}},
                use_callback: true,
            });
        },

        "supports being called with a properties object and a callback (set_once)": function(test) {
            this.test_send_request_args(test, 'set_once', {
                args: [{'key1': 'val1', 'key2': 'val2'}],
                expected: {$set_once: {'key1': 'val1', 'key2': 'val2'}},
                use_callback: true,
            });
        },

        "supports being called with a modifiers argument and a callback": function(test) {
            this.test_send_request_args(test, 'set', {
                args: ['key1', 'val1'],
                expected: {$set: {'key1': 'val1'}},
                use_callback: true,
                use_modifiers: true,
            });
        },

        "supports being called with a modifiers argument and a callback (set_once)": function(test) {
            this.test_send_request_args(test, 'set_once', {
                args: ['key1', 'val1'],
                expected: {$set_once: {'key1': 'val1'}},
                use_callback: true,
                use_modifiers: true,
            });
        },

        "supports being called with a properties object, a modifiers argument and a callback": function(test) {
            this.test_send_request_args(test, 'set', {
                args: [{'key1': 'val1', 'key2': 'val2'}],
                expected: {$set: {'key1': 'val1', 'key2': 'val2'}},
                use_callback: true,
                use_modifiers: true,
            });
        },

        "supports being called with a properties object, a modifiers argument and a callback (set_once)": function(test) {
            this.test_send_request_args(test, 'set_once', {
                args: [{'key1': 'val1', 'key2': 'val2'}],
                expected: {$set_once: {'key1': 'val1', 'key2': 'val2'}},
                use_callback: true,
                use_modifiers: true,
            });
        },
    },

    increment: {
        "calls send_request with correct endpoint and data": function(test) {
            this.test_send_request_args(test, 'increment', {
                args: ['key1'],
                expected: {$add: {'key1': 1}},
            });
        },

        "supports incrementing key by value": function(test) {
            this.test_send_request_args(test, 'increment', {
                args: ['key1', 2],
                expected: {$add: {'key1': 2}},
            });
        },

        "supports incrementing key by value and a modifiers argument": function(test) {
            this.test_send_request_args(test, 'increment', {
                args: ['key1', 2],
                expected: {$add: {'key1': 2}},
                use_modifiers: true,
            });
        },

        "supports incrementing multiple keys": function(test) {
            this.test_send_request_args(test, 'increment', {
                args: [{'key1': 5, 'key2': -3}],
                expected: {$add: {'key1': 5, 'key2': -3}},
            });
        },

        "supports incrementing multiple keys and a modifiers argument": function(test) {
            this.test_send_request_args(test, 'increment', {
                args: [{'key1': 5, 'key2': -3}],
                expected: {$add: {'key1': 5, 'key2': -3}},
                use_modifiers: true,
            });
        },

        "ignores invalid values": function(test) {
            this.test_send_request_args(test, 'increment', {
                args: [{
                    'key1': 'bad',
                    'key2': 3,
                    'key3': undefined,
                    'key4': '5',
                    'key5': new Date(),
                    'key6': function() {},
                }],
                expected: {$add: {'key2': 3, 'key4': '5'}},
            });
        },

        "supports being called with a callback": function(test) {
            this.test_send_request_args(test, 'increment', {
                args: ['key1'],
                expected: {$add: {'key1': 1}},
                use_callback: true,
            });
        },

        "supports incrementing key by value with a callback": function(test) {
            this.test_send_request_args(test, 'increment', {
                args: ['key1', 2],
                expected: {$add: {'key1': 2}},
                use_callback: true,
            });
        },

        "supports incrementing key by value with a modifiers argument and callback": function(test) {
            this.test_send_request_args(test, 'increment', {
                args: ['key1', 2],
                expected: {$add: {'key1': 2}},
                use_callback: true,
                use_modifiers: true,
            });
        },

        "supports incrementing multiple keys with a callback": function(test) {
            this.test_send_request_args(test, 'increment', {
                args: [{'key1': 5, 'key2': -3}],
                expected: {$add: {'key1': 5, 'key2': -3}},
                use_callback: true,
            });
        },

        "supports incrementing multiple keys with a modifiers argument and callback": function(test) {
            this.test_send_request_args(test, 'increment', {
                args: [{'key1': 5, 'key2': -3}],
                expected: {$add: {'key1': 5, 'key2': -3}},
                use_callback: true,
                use_modifiers: true,
            });
        },
    },

    append: {
        "calls send_request with correct endpoint and data": function(test) {
            this.test_send_request_args(test, 'append', {
                args: ['key1', 'value'],
                expected: {$append: {'key1': 'value'}},
            });
        },

        "supports being called with modifiers": function(test) {
            this.test_send_request_args(test, 'append', {
                args: ['key1', 'value'],
                expected: {$append: {'key1': 'value'}},
                use_modifiers: true,
            });
        },

        "supports being called with a callback": function(test) {
            this.test_send_request_args(test, 'append', {
                args: ['key1', 'value'],
                expected: {$append: {'key1': 'value'}},
                use_callback: true,
            });
        },

        "supports appending multiple keys with values": function(test) {
            this.test_send_request_args(test, 'append', {
                args: [{'key1': 'value1', 'key2': 'value2'}],
                expected: {$append: {'key1': 'value1', 'key2': 'value2'}},
            });
        },

        "supports appending multiple keys with values and a modifiers argument": function(test) {
            this.test_send_request_args(test, 'append', {
                args: [{'key1': 'value1', 'key2': 'value2'}],
                expected: {$append: {'key1': 'value1', 'key2': 'value2'}},
                use_modifiers: true,
            });
        },

        "supports appending multiple keys with values and a callback": function(test) {
            this.test_send_request_args(test, 'append', {
                args: [{'key1': 'value1', 'key2': 'value2'}],
                expected: {$append: {'key1': 'value1', 'key2': 'value2'}},
                use_callback: true,
            });
        },

        "supports appending multiple keys with values with a modifiers argument and callback": function(test) {
            this.test_send_request_args(test, 'append', {
                args: [{'key1': 'value1', 'key2': 'value2'}],
                expected: {$append: {'key1': 'value1', 'key2': 'value2'}},
                use_callback: true,
                use_modifiers: true,
            });
        },
    },

    track_charge: {
        "calls send_request with correct endpoint and data": function(test) {
            this.test_send_request_args(test, 'track_charge', {
                args: [50],
                expected: {$append: {$transactions: {$amount: 50}}},
            });
        },

        "supports being called with a property object": function(test) {
            var time = new Date('Feb 1 2012');
            this.test_send_request_args(test, 'track_charge', {
                args: [50, {$time: time, isk: 'isk'}],
                expected: {$append: {$transactions: {
                    $amount: 50,
                    $time:   time.toISOString(),
                    isk:     'isk',
                }}},
            });
        },

        "supports being called with a modifiers argument": function(test) {
            this.test_send_request_args(test, 'track_charge', {
                args: [50],
                expected: {$append: {$transactions: {$amount: 50}}},
                use_modifiers: true,
            });
        },

        "supports being called with a property object and a modifiers argument": function(test) {
            var time = new Date('Feb 1 2012');
            this.test_send_request_args(test, 'track_charge', {
                args: [50, {$time: time, isk: 'isk'}],
                expected: {$append: {$transactions: {
                    $amount: 50,
                    $time:   time.toISOString(),
                    isk:     'isk',
                }}},
                use_modifiers: true,
            });
        },

        "supports being called with a callback": function(test) {
            this.test_send_request_args(test, 'track_charge', {
                args: [50],
                expected: {$append: {$transactions: {$amount: 50}}},
                use_callback: true,
            });
        },

        "supports being called with properties and a callback": function(test) {
            this.test_send_request_args(test, 'track_charge', {
                args: [50, {}],
                expected: {$append: {$transactions: {$amount: 50}}},
                use_callback: true,
            });
        },

        "supports being called with modifiers and a callback": function(test) {
            this.test_send_request_args(test, 'track_charge', {
                args: [50],
                expected: {$append: {$transactions: {$amount: 50}}},
                use_callback: true,
                use_modifiers: true,
            });
        },

        "supports being called with properties, modifiers and a callback": function(test) {
            var time = new Date('Feb 1 2012');
            this.test_send_request_args(test, 'track_charge', {
                args: [50, {$time: time, isk: 'isk'}],
                expected: {$append: {$transactions: {
                    $amount: 50,
                    $time:   time.toISOString(),
                    isk:     'isk',
                }}},
                use_callback: true,
                use_modifiers: true,
            });
        },
    },

    clear_charges: {
        "calls send_request with correct endpoint and data": function(test) {
            this.test_send_request_args(test, 'clear_charges', {
                expected: {$set: {$transactions: []}},
            });
        },

        "supports being called with a modifiers argument": function(test) {
            this.test_send_request_args(test, 'clear_charges', {
                expected: {$set: {$transactions: []}},
                use_modifiers: true,
            });
        },

        "supports being called with a callback": function(test) {
            this.test_send_request_args(test, 'clear_charges', {
                expected: {$set: {$transactions: []}},
                use_callback: true,
            });
        },

        "supports being called with a modifiers argument and a callback": function(test) {
            this.test_send_request_args(test, 'clear_charges', {
                expected: {$set: {$transactions: []}},
                use_callback: true,
                use_modifiers: true,
            });
        },
    },

    delete_user: {
        "calls send_request with correct endpoint and data": function(test) {
            this.test_send_request_args(test, 'delete_user', {
                expected: {$delete: ''},
            });
        },

        "supports being called with a modifiers argument": function(test) {
            this.test_send_request_args(test, 'delete_user', {
                expected: {$delete: ''},
                use_modifiers: true,
            });
        },

        "supports being called with a callback": function(test) {
            this.test_send_request_args(test, 'delete_user', {
                expected: {$delete: ''},
                use_callback: true,
            });
        },

        "supports being called with a modifiers argument and a callback": function(test) {
            this.test_send_request_args(test, 'delete_user', {
                expected: {$delete: ''},
                use_callback: true,
                use_modifiers: true,
            });
        },
    },

    remove: {
        "calls send_request with correct endpoint and data": function(test) {
            this.test_send_request_args(test, 'remove', {
                args: [{'key1': 'value1', 'key2': 'value2'}],
                expected: {$remove: {'key1': 'value1', 'key2': 'value2'}},
            });
        },

        "errors on non-scalar argument types": function(test) {
            this.mixpanel.people.remove(this.distinct_id, {'key1': ['value1']});
            this.mixpanel.people.remove(this.distinct_id, {key1: {key: 'val'}});
            this.mixpanel.people.remove(this.distinct_id, 1231241.123);
            this.mixpanel.people.remove(this.distinct_id, [5]);
            this.mixpanel.people.remove(this.distinct_id, {key1: function() {}});
            this.mixpanel.people.remove(this.distinct_id, {key1: [function() {}]});

            test.ok(
              !this.mixpanel.send_request.called,
              "people.remove shouldn't call send_request on invalid arguments"
            );
            test.done();
        },

        "supports being called with a modifiers argument": function(test) {
            this.test_send_request_args(test, 'remove', {
                args: [{'key1': 'value1'}],
                expected: {$remove: {'key1': 'value1'}},
                use_modifiers: true,
            });
        },

        "supports being called with a callback": function(test) {
            this.test_send_request_args(test, 'remove', {
                args: [{'key1': 'value1'}],
                expected: {$remove: {'key1': 'value1'}},
                use_callback: true,
            });
        },

        "supports being called with a modifiers argument and a callback": function(test) {
            this.test_send_request_args(test, 'remove', {
                args: [{'key1': 'value1'}],
                expected: {$remove: {'key1': 'value1'}},
                use_callback: true,
                use_modifiers: true,
            });
        },
    },

    union: {
        "calls send_request with correct endpoint and data": function(test) {
            this.test_send_request_args(test, 'union', {
                args: [{'key1': ['value1', 'value2']}],
                expected: {$union: {'key1': ['value1', 'value2']}},
            });
        },

        "supports being called with a scalar value": function(test) {
            this.test_send_request_args(test, 'union', {
                args: [{'key1': 'value1'}],
                expected: {$union: {'key1': ['value1']}},
            });
        },

        "errors on other argument types": function(test) {
            this.mixpanel.people.union(this.distinct_id, {key1: {key: 'val'}});
            this.mixpanel.people.union(this.distinct_id, 1231241.123);
            this.mixpanel.people.union(this.distinct_id, [5]);
            this.mixpanel.people.union(this.distinct_id, {key1: function() {}});
            this.mixpanel.people.union(this.distinct_id, {key1: [function() {}]});

            test.ok(
                !this.mixpanel.send_request.called,
                "people.union shouldn't call send_request on invalid arguments"
            );
            test.done();
        },

        "supports being called with a modifiers argument": function(test) {
            this.test_send_request_args(test, 'union', {
                args: [{'key1': ['value1', 'value2']}],
                expected: {$union: {'key1': ['value1', 'value2']}},
                use_modifiers: true,
            });
        },

        "supports being called with a callback": function(test) {
            this.test_send_request_args(test, 'union', {
                args: [{'key1': ['value1', 'value2']}],
                expected: {$union: {'key1': ['value1', 'value2']}},
                use_callback: true,
            });
        },

        "supports being called with a modifiers argument and a callback": function(test) {
            this.test_send_request_args(test, 'union', {
                args: [{'key1': ['value1', 'value2']}],
                expected: {$union: {'key1': ['value1', 'value2']}},
                use_callback: true,
                use_modifiers: true,
            });
        },
    },

    unset: {
        "calls send_request with correct endpoint and data": function(test) {
            this.test_send_request_args(test, 'unset', {
                args: ['key1'],
                expected: {$unset: ['key1']},
            });
        },

        "supports being called with a property array": function(test) {
            this.test_send_request_args(test, 'unset', {
                args: [['key1', 'key2']],
                expected: {$unset: ['key1', 'key2']},
            });
        },

        "errors on other argument types": function(test) {
            this.mixpanel.people.unset(this.distinct_id, { key1:'val1', key2:'val2' });
            this.mixpanel.people.unset(this.distinct_id, 1231241.123);

            test.ok(
                !this.mixpanel.send_request.called,
                "people.unset shouldn't call send_request on invalid arguments"
            );
            test.done();
        },

        "supports being called with a modifiers argument": function(test) {
            this.test_send_request_args(test, 'unset', {
                args: ['key1'],
                expected: {$unset: ['key1']},
                use_modifiers: true,
            });
        },

        "supports being called with a callback": function(test) {
            this.test_send_request_args(test, 'unset', {
                args: ['key1'],
                expected: {$unset: ['key1']},
                use_callback: true,
            });
        },

        "supports being called with a modifiers argument and a callback": function(test) {
            this.test_send_request_args(test, 'unset', {
                args: ['key1'],
                expected: {$unset: ['key1']},
                use_callback: true,
                use_modifiers: true,
            });
        },
    },
};

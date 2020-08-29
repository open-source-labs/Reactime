var Mixpanel    = require('../lib/mixpanel-node'),
    Sinon       = require('sinon');

exports.alias = {
    setUp: function(next) {
        this.mixpanel = Mixpanel.init('token', { key: 'key' });

        Sinon.stub(this.mixpanel, 'send_request');

        next();
    },

    tearDown: function(next) {
        this.mixpanel.send_request.restore();

        next();
    },

    "calls send_request with correct endpoint and data": function(test) {
        var alias = "test",
            distinct_id = "old_id",
            expected_endpoint = "/track",
            expected_data = {
                event: '$create_alias',
                properties: {
                    distinct_id: distinct_id,
                    alias: alias,
                    token: 'token'
                }
            };

        this.mixpanel.alias(distinct_id, alias);

        test.ok(
            this.mixpanel.send_request.calledWithMatch({ endpoint: expected_endpoint, data: expected_data }),
            "alias didn't call send_request with correct arguments"
        );

        test.done();
    }
};

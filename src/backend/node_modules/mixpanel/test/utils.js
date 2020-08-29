var async_all = require('../lib/utils').async_all,
    Sinon     = require('sinon');

exports.async_all = {
    "calls callback with empty results if no requests": function(test) {
        var requests = [],
            handler_fn = Sinon.stub();

        test.expect(2);
        async_all(requests, handler_fn, function(error, results) {
            test.equal(error, null, "error should be null");
            test.equal(results.length, 0, "results should be empty array");
            test.done();
        });
    },

    "runs handler for each request and calls callback with results": function(test) {
        var requests = [1, 2, 3],
            handler_fn = Sinon.stub();

        handler_fn
            .onCall(0).callsArgWithAsync(1, null, 4)
            .onCall(1).callsArgWithAsync(1, null, 5)
            .onCall(2).callsArgWithAsync(1, null, 6);

        test.expect(6);
        async_all(requests, handler_fn, function(error, results) {
            test.equal(handler_fn.callCount, requests.length, "handler function should be called for each request");
            test.equal(handler_fn.getCall(0).args[0], 1, "handler called with request value");
            test.equal(handler_fn.getCall(1).args[0], 2, "handler called with request value");
            test.equal(handler_fn.getCall(2).args[0], 3, "handler called with request value");
            test.equal(error, null, "error should be null");
            test.deepEqual(results, [4, 5, 6], "results should be array of results from handler");
            test.done();
        });
    },

    "calls callback with errors and results from handler": function(test) {
        var requests = [1, 2, 3],
            handler_fn = Sinon.stub();

        handler_fn
            .onCall(0).callsArgWithAsync(1, 'error1', null)
            .onCall(1).callsArgWithAsync(1, 'error2', null)
            .onCall(2).callsArgWithAsync(1, null, 6);

        test.expect(6);
        async_all(requests, handler_fn, function(error, results) {
            test.equal(handler_fn.callCount, requests.length, "handler function should be called for each request");
            test.equal(handler_fn.getCall(0).args[0], 1, "handler called with request value");
            test.equal(handler_fn.getCall(1).args[0], 2, "handler called with request value");
            test.equal(handler_fn.getCall(2).args[0], 3, "handler called with request value");
            test.deepEqual(error, ['error1', 'error2'], "errors should be returned in an array");
            test.deepEqual(results, [null, null, 6], "results should be array of results from handler");
            test.done();
        });
    }

};



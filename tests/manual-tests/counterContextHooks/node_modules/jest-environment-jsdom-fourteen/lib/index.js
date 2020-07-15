"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var jest_util_1 = require("jest-util");
var jest_mock_1 = require("jest-mock");
var fake_timers_1 = require("@jest/fake-timers");
var jsdom_1 = require("jsdom");
var JSDOMEnvironment = /** @class */ (function () {
    function JSDOMEnvironment(config, options) {
        if (options === void 0) { options = {}; }
        this.dom = new jsdom_1.JSDOM("<!DOCTYPE html>", __assign({ pretendToBeVisual: true, runScripts: "dangerously", url: config.testURL, virtualConsole: new jsdom_1.VirtualConsole().sendTo(options.console || console) }, config.testEnvironmentOptions));
        var global = (this.global = this.dom.window.document.defaultView);
        if (!global) {
            throw new Error("JSDOM did not return a Window object");
        }
        // Node's error-message stack size is limited at 10, but it's pretty useful
        // to see more than that when a test fails.
        this.global.Error.stackTraceLimit = 100;
        jest_util_1.installCommonGlobals(global, config.globals);
        // Report uncaught errors.
        this.errorEventListener = function (event) {
            if (userErrorListenerCount === 0 && event.error) {
                process.emit("uncaughtException", event.error);
            }
        };
        global.addEventListener("error", this.errorEventListener);
        // However, don't report them as uncaught if the user listens to 'error' event.
        // In that case, we assume the might have custom error handling logic.
        var originalAddListener = global.addEventListener;
        var originalRemoveListener = global.removeEventListener;
        var userErrorListenerCount = 0;
        global.addEventListener = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args[0] === "error") {
                userErrorListenerCount++;
            }
            return originalAddListener.apply(this, args);
        };
        global.removeEventListener = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args[0] === "error") {
                userErrorListenerCount--;
            }
            return originalRemoveListener.apply(this, args);
        };
        this.moduleMocker = new jest_mock_1.ModuleMocker(global);
        var timerConfig = {
            idToRef: function (id) { return id; },
            refToId: function (ref) { return ref; },
        };
        this.fakeTimers = new fake_timers_1.JestFakeTimers({
            config: config,
            global: global,
            moduleMocker: this.moduleMocker,
            timerConfig: timerConfig,
        });
    }
    JSDOMEnvironment.prototype.setup = function () {
        return Promise.resolve();
    };
    JSDOMEnvironment.prototype.teardown = function () {
        if (this.fakeTimers) {
            this.fakeTimers.dispose();
        }
        if (this.global) {
            if (this.errorEventListener) {
                this.global.removeEventListener("error", this.errorEventListener);
            }
            // Dispose "document" to prevent "load" event from triggering.
            Object.defineProperty(this.global, "document", { value: null });
            this.global.close();
        }
        this.errorEventListener = null;
        // @ts-ignore
        this.global = null;
        this.dom = null;
        this.fakeTimers = null;
        return Promise.resolve();
    };
    JSDOMEnvironment.prototype.runScript = function (script) {
        if (this.dom) {
            return this.dom.runVMScript(script);
        }
        return null;
    };
    return JSDOMEnvironment;
}());
module.exports = JSDOMEnvironment;

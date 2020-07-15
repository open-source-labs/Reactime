"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  documentRef: true,
  windowRef: true,
  EventListener: true,
  useEventListener: true
};
Object.defineProperty(exports, "EventListener", {
  enumerable: true,
  get: function get() {
    return _EventListener.default;
  }
});
Object.defineProperty(exports, "useEventListener", {
  enumerable: true,
  get: function get() {
    return _useEventListener.default;
  }
});
exports.windowRef = exports.documentRef = void 0;

var _EventListener = _interopRequireDefault(require("./EventListener"));

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _types[key];
    }
  });
});

var _useEventListener = _interopRequireDefault(require("./useEventListener"));

var documentRef = {
  current: typeof document === 'undefined' ? null : document
};
exports.documentRef = documentRef;
var windowRef = {
  current: typeof window === 'undefined' ? null : window
};
exports.windowRef = windowRef;
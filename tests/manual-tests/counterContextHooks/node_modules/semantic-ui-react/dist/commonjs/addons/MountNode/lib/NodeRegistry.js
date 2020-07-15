"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var NodeRegistry = function NodeRegistry() {
  var _this = this;

  (0, _classCallCheck2["default"])(this, NodeRegistry);
  (0, _defineProperty2["default"])(this, "add", function (nodeRef, component) {
    if (_this.nodes.has(nodeRef)) {
      var set = _this.nodes.get(nodeRef);

      set.add(component);
      return;
    }

    _this.nodes.set(nodeRef, new Set([component]));
  });
  (0, _defineProperty2["default"])(this, "del", function (nodeRef, component) {
    if (!_this.nodes.has(nodeRef)) return;

    var set = _this.nodes.get(nodeRef);

    if (set.size === 1) {
      _this.nodes["delete"](nodeRef);

      return;
    }

    set["delete"](component);
  });
  (0, _defineProperty2["default"])(this, "emit", function (nodeRef, callback) {
    callback(nodeRef, _this.nodes.get(nodeRef));
  });
  this.nodes = new Map();
};

exports["default"] = NodeRegistry;
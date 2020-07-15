"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _memoize2 = _interopRequireDefault(require("lodash/memoize"));

var _invoke2 = _interopRequireDefault(require("lodash/invoke"));

var _reactComponentRef = require("@stardust-ui/react-component-ref");

var ReferenceProxy =
/*#__PURE__*/
function () {
  function ReferenceProxy(refObject) {
    (0, _classCallCheck2["default"])(this, ReferenceProxy);
    this.ref = refObject;
  }

  (0, _createClass2["default"])(ReferenceProxy, [{
    key: "getBoundingClientRect",
    value: function getBoundingClientRect() {
      return (0, _invoke2["default"])(this.ref.current, 'getBoundingClientRect', {});
    }
  }, {
    key: "clientWidth",
    get: function get() {
      return this.getBoundingClientRect().width;
    }
  }, {
    key: "clientHeight",
    get: function get() {
      return this.getBoundingClientRect().height;
    }
  }, {
    key: "parentNode",
    get: function get() {
      return this.ref.current ? this.ref.current.parentNode : undefined;
    }
  }]);
  return ReferenceProxy;
}();
/**
 * Popper.js does not support ref objects from `createRef()` as referenceElement. If we will pass
 * directly `ref`, `ref.current` will be `null` at the render process. We use memoize to keep the
 * same reference between renders.
 *
 * @see https://popper.js.org/popper-documentation.html#referenceObject
 */


var createReferenceProxy = (0, _memoize2["default"])(function (reference) {
  return new ReferenceProxy((0, _reactComponentRef.isRefObject)(reference) ? reference : (0, _reactComponentRef.toRefObject)(reference));
});
var _default = createReferenceProxy;
exports["default"] = _default;
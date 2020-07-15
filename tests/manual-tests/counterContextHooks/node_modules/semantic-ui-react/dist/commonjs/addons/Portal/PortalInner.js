"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _invoke2 = _interopRequireDefault(require("lodash/invoke"));

var _reactComponentRef = require("@stardust-ui/react-component-ref");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _reactDom = require("react-dom");

var _lib = require("../../lib");

/**
 * An inner component that allows you to render children outside their parent.
 */
var PortalInner =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(PortalInner, _Component);

  function PortalInner() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, PortalInner);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(PortalInner)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleRef", function (c) {
      (0, _reactComponentRef.handleRef)(_this.props.innerRef, c);
    });
    return _this;
  }

  (0, _createClass2["default"])(PortalInner, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      (0, _invoke2["default"])(this.props, 'onMount', null, this.props);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      (0, _invoke2["default"])(this.props, 'onUnmount', null, this.props);
    }
  }, {
    key: "render",
    value: function render() {
      if (!(0, _lib.isBrowser)()) return null;
      var _this$props = this.props,
          children = _this$props.children,
          _this$props$mountNode = _this$props.mountNode,
          mountNode = _this$props$mountNode === void 0 ? document.body : _this$props$mountNode;
      return (0, _reactDom.createPortal)(_react["default"].createElement(_reactComponentRef.Ref, {
        innerRef: this.handleRef
      }, children), mountNode);
    }
  }]);
  return PortalInner;
}(_react.Component);

(0, _defineProperty2["default"])(PortalInner, "handledProps", ["children", "innerRef", "mountNode", "onMount", "onUnmount"]);
PortalInner.propTypes = process.env.NODE_ENV !== "production" ? {
  /** Primary content. */
  children: _propTypes["default"].node.isRequired,

  /** Called with a ref to the inner node. */
  innerRef: _lib.customPropTypes.ref,

  /** The node where the portal should mount. */
  mountNode: _propTypes["default"].any,

  /**
   * Called when the portal is mounted on the DOM
   *
   * @param {null}
   * @param {object} data - All props.
   */
  onMount: _propTypes["default"].func,

  /**
   * Called when the portal is unmounted from the DOM
   *
   * @param {null}
   * @param {object} data - All props.
   */
  onUnmount: _propTypes["default"].func
} : {};
var _default = PortalInner;
exports["default"] = _default;
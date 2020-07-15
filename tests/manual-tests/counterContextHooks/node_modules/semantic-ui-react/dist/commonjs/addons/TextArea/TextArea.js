"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _invoke2 = _interopRequireDefault(require("lodash/invoke"));

var _get2 = _interopRequireDefault(require("lodash/get"));

var _reactComponentRef = require("@stardust-ui/react-component-ref");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _lib = require("../../lib");

/**
 * A TextArea can be used to allow for extended user input.
 * @see Form
 */
var TextArea =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(TextArea, _Component);

  function TextArea() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, TextArea);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(TextArea)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "ref", (0, _react.createRef)());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "focus", function () {
      return _this.ref.current.focus();
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleChange", function (e) {
      var value = (0, _get2["default"])(e, 'target.value');
      (0, _invoke2["default"])(_this.props, 'onChange', e, (0, _objectSpread2["default"])({}, _this.props, {
        value: value
      }));
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleInput", function (e) {
      var value = (0, _get2["default"])(e, 'target.value');
      (0, _invoke2["default"])(_this.props, 'onInput', e, (0, _objectSpread2["default"])({}, _this.props, {
        value: value
      }));
    });
    return _this;
  }

  (0, _createClass2["default"])(TextArea, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          rows = _this$props.rows,
          value = _this$props.value;
      var rest = (0, _lib.getUnhandledProps)(TextArea, this.props);
      var ElementType = (0, _lib.getElementType)(TextArea, this.props);
      return _react["default"].createElement(_reactComponentRef.Ref, {
        innerRef: this.ref
      }, _react["default"].createElement(ElementType, (0, _extends2["default"])({}, rest, {
        onChange: this.handleChange,
        onInput: this.handleInput,
        rows: rows,
        value: value
      })));
    }
  }]);
  return TextArea;
}(_react.Component);

(0, _defineProperty2["default"])(TextArea, "defaultProps", {
  as: 'textarea',
  rows: 3
});
(0, _defineProperty2["default"])(TextArea, "handledProps", ["as", "onChange", "onInput", "rows", "value"]);
TextArea.propTypes = process.env.NODE_ENV !== "production" ? {
  /** An element type to render as (string or function). */
  as: _propTypes["default"].elementType,

  /**
   * Called on change.
   * @param {SyntheticEvent} event - The React SyntheticEvent object
   * @param {object} data - All props and the event value.
   */
  onChange: _propTypes["default"].func,

  /**
   * Called on input.
   * @param {SyntheticEvent} event - The React SyntheticEvent object
   * @param {object} data - All props and the event value.
   */
  onInput: _propTypes["default"].func,

  /** Indicates row count for a TextArea. */
  rows: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),

  /** The value of the textarea. */
  value: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string])
} : {};
var _default = TextArea;
exports["default"] = _default;
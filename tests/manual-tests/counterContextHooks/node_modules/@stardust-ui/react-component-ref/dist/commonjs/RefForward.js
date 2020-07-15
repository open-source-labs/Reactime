"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var PropTypes = _interopRequireWildcard(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _handleRef = _interopRequireDefault(require("./handleRef"));

var _types = require("./types");

var RefForward =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(RefForward, _React$Component);

  function RefForward() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, RefForward);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(RefForward)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleRefOverride", function (node) {
      var _this$props = _this.props,
          children = _this$props.children,
          innerRef = _this$props.innerRef;
      (0, _handleRef.default)(children.ref, node);
      (0, _handleRef.default)(innerRef, node);
    });
    return _this;
  }

  (0, _createClass2.default)(RefForward, [{
    key: "render",
    value: function render() {
      var children = this.props.children;
      return React.cloneElement(children, {
        ref: this.handleRefOverride
      });
    }
  }]);
  return RefForward;
}(React.Component);

exports.default = RefForward;
(0, _defineProperty2.default)(RefForward, "displayName", 'RefForward');
(0, _defineProperty2.default)(RefForward, "propTypes", process.env.NODE_ENV !== 'production' ? {
  children: PropTypes.element.isRequired,
  innerRef: _types.refPropType.isRequired
} : {});
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as PropTypes from 'prop-types';
import * as React from 'react';
import handleRef from './handleRef';
import { refPropType } from './types';

var RefForward =
/*#__PURE__*/
function (_React$Component) {
  _inherits(RefForward, _React$Component);

  function RefForward() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, RefForward);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(RefForward)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "handleRefOverride", function (node) {
      var _this$props = _this.props,
          children = _this$props.children,
          innerRef = _this$props.innerRef;
      handleRef(children.ref, node);
      handleRef(innerRef, node);
    });

    return _this;
  }

  _createClass(RefForward, [{
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

_defineProperty(RefForward, "displayName", 'RefForward');

_defineProperty(RefForward, "propTypes", process.env.NODE_ENV !== 'production' ? {
  children: PropTypes.element.isRequired,
  innerRef: refPropType.isRequired
} : {});

export { RefForward as default };
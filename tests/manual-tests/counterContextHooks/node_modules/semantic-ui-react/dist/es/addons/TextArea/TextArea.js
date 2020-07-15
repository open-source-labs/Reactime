import _extends from "@babel/runtime/helpers/extends";
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _invoke from "lodash/invoke";
import _get from "lodash/get";
import { Ref } from '@stardust-ui/react-component-ref';
import PropTypes from 'prop-types';
import React, { Component, createRef } from 'react';
import { getElementType, getUnhandledProps } from '../../lib';
/**
 * A TextArea can be used to allow for extended user input.
 * @see Form
 */

var TextArea =
/*#__PURE__*/
function (_Component) {
  _inherits(TextArea, _Component);

  function TextArea() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, TextArea);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(TextArea)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "ref", createRef());

    _defineProperty(_assertThisInitialized(_this), "focus", function () {
      return _this.ref.current.focus();
    });

    _defineProperty(_assertThisInitialized(_this), "handleChange", function (e) {
      var value = _get(e, 'target.value');

      _invoke(_this.props, 'onChange', e, _objectSpread({}, _this.props, {
        value: value
      }));
    });

    _defineProperty(_assertThisInitialized(_this), "handleInput", function (e) {
      var value = _get(e, 'target.value');

      _invoke(_this.props, 'onInput', e, _objectSpread({}, _this.props, {
        value: value
      }));
    });

    return _this;
  }

  _createClass(TextArea, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          rows = _this$props.rows,
          value = _this$props.value;
      var rest = getUnhandledProps(TextArea, this.props);
      var ElementType = getElementType(TextArea, this.props);
      return React.createElement(Ref, {
        innerRef: this.ref
      }, React.createElement(ElementType, _extends({}, rest, {
        onChange: this.handleChange,
        onInput: this.handleInput,
        rows: rows,
        value: value
      })));
    }
  }]);

  return TextArea;
}(Component);

_defineProperty(TextArea, "defaultProps", {
  as: 'textarea',
  rows: 3
});

_defineProperty(TextArea, "handledProps", ["as", "onChange", "onInput", "rows", "value"]);

TextArea.propTypes = process.env.NODE_ENV !== "production" ? {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /**
   * Called on change.
   * @param {SyntheticEvent} event - The React SyntheticEvent object
   * @param {object} data - All props and the event value.
   */
  onChange: PropTypes.func,

  /**
   * Called on input.
   * @param {SyntheticEvent} event - The React SyntheticEvent object
   * @param {object} data - All props and the event value.
   */
  onInput: PropTypes.func,

  /** Indicates row count for a TextArea. */
  rows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  /** The value of the textarea. */
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
} : {};
export default TextArea;
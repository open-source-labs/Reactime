"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _set2 = _interopRequireDefault(require("lodash/set"));

var _invoke2 = _interopRequireDefault(require("lodash/invoke"));

var _get2 = _interopRequireDefault(require("lodash/get"));

var _isNil2 = _interopRequireDefault(require("lodash/isNil"));

var _reactComponentRef = require("@stardust-ui/react-component-ref");

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _lib = require("../../lib");

/**
 * A checkbox allows a user to select a value from a small set of options, often binary.
 * @see Form
 * @see Radio
 */
var Checkbox =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(Checkbox, _Component);

  function Checkbox() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, Checkbox);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(Checkbox)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "inputRef", (0, _react.createRef)());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "labelRef", (0, _react.createRef)());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "canToggle", function () {
      var _this$props = _this.props,
          disabled = _this$props.disabled,
          radio = _this$props.radio,
          readOnly = _this$props.readOnly;
      var checked = _this.state.checked;
      return !disabled && !readOnly && !(radio && checked);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "computeTabIndex", function () {
      var _this$props2 = _this.props,
          disabled = _this$props2.disabled,
          tabIndex = _this$props2.tabIndex;
      if (!(0, _isNil2["default"])(tabIndex)) return tabIndex;
      return disabled ? -1 : 0;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleClick", function (e) {
      var id = _this.props.id;
      var _this$state = _this.state,
          checked = _this$state.checked,
          indeterminate = _this$state.indeterminate;
      var isInputClick = (0, _invoke2["default"])(_this.inputRef.current, 'contains', e.target);
      var isLabelClick = (0, _invoke2["default"])(_this.labelRef.current, 'contains', e.target);
      var isRootClick = !isLabelClick && !isInputClick;
      var hasId = !(0, _isNil2["default"])(id);
      var isLabelClickAndForwardedToInput = isLabelClick && hasId; // https://github.com/Semantic-Org/Semantic-UI-React/pull/3351

      if (!isLabelClickAndForwardedToInput) {
        (0, _invoke2["default"])(_this.props, 'onClick', e, (0, _objectSpread2["default"])({}, _this.props, {
          checked: !checked,
          indeterminate: !!indeterminate
        }));
      }

      if (_this.isClickFromMouse) {
        _this.isClickFromMouse = false;

        if (isLabelClick && !hasId) {
          _this.handleChange(e);
        } // Changes should be triggered for the slider variation


        if (isRootClick) {
          _this.handleChange(e);
        }

        if (isLabelClick && hasId) {
          // To prevent two clicks from being fired from the component we have to stop the propagation
          // from the "input" click: https://github.com/Semantic-Org/Semantic-UI-React/issues/3433
          e.stopPropagation();
        }
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleChange", function (e) {
      var checked = _this.state.checked;
      if (!_this.canToggle()) return;
      (0, _invoke2["default"])(_this.props, 'onChange', e, (0, _objectSpread2["default"])({}, _this.props, {
        checked: !checked,
        indeterminate: false
      }));

      _this.trySetState({
        checked: !checked,
        indeterminate: false
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleMouseDown", function (e) {
      var _this$state2 = _this.state,
          checked = _this$state2.checked,
          indeterminate = _this$state2.indeterminate;
      (0, _invoke2["default"])(_this.props, 'onMouseDown', e, (0, _objectSpread2["default"])({}, _this.props, {
        checked: !!checked,
        indeterminate: !!indeterminate
      }));

      if (!e.defaultPrevented) {
        (0, _invoke2["default"])(_this.inputRef.current, 'focus');
      } // Heads up!
      // We need to call "preventDefault" to keep element focused.


      e.preventDefault();
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleMouseUp", function (e) {
      var _this$state3 = _this.state,
          checked = _this$state3.checked,
          indeterminate = _this$state3.indeterminate;
      _this.isClickFromMouse = true;
      (0, _invoke2["default"])(_this.props, 'onMouseUp', e, (0, _objectSpread2["default"])({}, _this.props, {
        checked: !!checked,
        indeterminate: !!indeterminate
      }));
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "setIndeterminate", function () {
      var indeterminate = _this.state.indeterminate;
      (0, _set2["default"])(_this.inputRef, 'current.indeterminate', !!indeterminate);
    });
    return _this;
  }

  (0, _createClass2["default"])(Checkbox, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setIndeterminate();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.setIndeterminate();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          className = _this$props3.className,
          disabled = _this$props3.disabled,
          label = _this$props3.label,
          id = _this$props3.id,
          name = _this$props3.name,
          radio = _this$props3.radio,
          readOnly = _this$props3.readOnly,
          slider = _this$props3.slider,
          toggle = _this$props3.toggle,
          type = _this$props3.type,
          value = _this$props3.value;
      var _this$state4 = this.state,
          checked = _this$state4.checked,
          indeterminate = _this$state4.indeterminate;
      var classes = (0, _classnames["default"])('ui', (0, _lib.useKeyOnly)(checked, 'checked'), (0, _lib.useKeyOnly)(disabled, 'disabled'), (0, _lib.useKeyOnly)(indeterminate, 'indeterminate'), // auto apply fitted class to compact white space when there is no label
      // https://semantic-ui.com/modules/checkbox.html#fitted
      (0, _lib.useKeyOnly)((0, _isNil2["default"])(label), 'fitted'), (0, _lib.useKeyOnly)(radio, 'radio'), (0, _lib.useKeyOnly)(readOnly, 'read-only'), (0, _lib.useKeyOnly)(slider, 'slider'), (0, _lib.useKeyOnly)(toggle, 'toggle'), 'checkbox', className);
      var unhandled = (0, _lib.getUnhandledProps)(Checkbox, this.props);
      var ElementType = (0, _lib.getElementType)(Checkbox, this.props);

      var _partitionHTMLProps = (0, _lib.partitionHTMLProps)(unhandled, {
        htmlProps: _lib.htmlInputAttrs
      }),
          _partitionHTMLProps2 = (0, _slicedToArray2["default"])(_partitionHTMLProps, 2),
          htmlInputProps = _partitionHTMLProps2[0],
          rest = _partitionHTMLProps2[1]; // Heads Up!
      // Do not remove empty labels, they are required by SUI CSS


      var labelElement = (0, _lib.createHTMLLabel)(label, {
        defaultProps: {
          htmlFor: id
        },
        autoGenerateKey: false
      }) || _react["default"].createElement("label", {
        htmlFor: id
      });

      return _react["default"].createElement(ElementType, (0, _extends2["default"])({}, rest, {
        className: classes,
        onClick: this.handleClick,
        onChange: this.handleChange,
        onMouseDown: this.handleMouseDown,
        onMouseUp: this.handleMouseUp
      }), _react["default"].createElement(_reactComponentRef.Ref, {
        innerRef: this.inputRef
      }, _react["default"].createElement("input", (0, _extends2["default"])({}, htmlInputProps, {
        checked: checked,
        className: "hidden",
        disabled: disabled,
        id: id,
        name: name,
        readOnly: true,
        tabIndex: this.computeTabIndex(),
        type: type,
        value: value
      }))), _react["default"].createElement(_reactComponentRef.Ref, {
        innerRef: this.labelRef
      }, labelElement));
    }
  }]);
  return Checkbox;
}(_lib.AutoControlledComponent);

exports["default"] = Checkbox;
(0, _defineProperty2["default"])(Checkbox, "defaultProps", {
  type: 'checkbox'
});
(0, _defineProperty2["default"])(Checkbox, "autoControlledProps", ['checked', 'indeterminate']);
(0, _defineProperty2["default"])(Checkbox, "handledProps", ["as", "checked", "className", "defaultChecked", "defaultIndeterminate", "disabled", "fitted", "id", "indeterminate", "label", "name", "onChange", "onClick", "onMouseDown", "onMouseUp", "radio", "readOnly", "slider", "tabIndex", "toggle", "type", "value"]);
Checkbox.propTypes = process.env.NODE_ENV !== "production" ? {
  /** An element type to render as (string or function). */
  as: _propTypes["default"].elementType,

  /** Whether or not checkbox is checked. */
  checked: _propTypes["default"].bool,

  /** Additional classes. */
  className: _propTypes["default"].string,

  /** The initial value of checked. */
  defaultChecked: _propTypes["default"].bool,

  /** Whether or not checkbox is indeterminate. */
  defaultIndeterminate: _propTypes["default"].bool,

  /** A checkbox can appear disabled and be unable to change states */
  disabled: _propTypes["default"].bool,

  /** Removes padding for a label. Auto applied when there is no label. */
  fitted: _propTypes["default"].bool,

  /** A unique identifier. */
  id: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),

  /** Whether or not checkbox is indeterminate. */
  indeterminate: _propTypes["default"].bool,

  /** The text of the associated label element. */
  label: _lib.customPropTypes.itemShorthand,

  /** The HTML input name. */
  name: _propTypes["default"].string,

  /**
   * Called when the user attempts to change the checked state.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props and proposed checked/indeterminate state.
   */
  onChange: _propTypes["default"].func,

  /**
   * Called when the checkbox or label is clicked.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props and current checked/indeterminate state.
   */
  onClick: _propTypes["default"].func,

  /**
   * Called when the user presses down on the mouse.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props and current checked/indeterminate state.
   */
  onMouseDown: _propTypes["default"].func,

  /**
   * Called when the user releases the mouse.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props and current checked/indeterminate state.
   */
  onMouseUp: _propTypes["default"].func,

  /** Format as a radio element. This means it is an exclusive option. */
  radio: _lib.customPropTypes.every([_propTypes["default"].bool, _lib.customPropTypes.disallow(['slider', 'toggle'])]),

  /** A checkbox can be read-only and unable to change states. */
  readOnly: _propTypes["default"].bool,

  /** Format to emphasize the current selection state. */
  slider: _lib.customPropTypes.every([_propTypes["default"].bool, _lib.customPropTypes.disallow(['radio', 'toggle'])]),

  /** A checkbox can receive focus. */
  tabIndex: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),

  /** Format to show an on or off choice. */
  toggle: _lib.customPropTypes.every([_propTypes["default"].bool, _lib.customPropTypes.disallow(['radio', 'slider'])]),

  /** HTML input type, either checkbox or radio. */
  type: _propTypes["default"].oneOf(['checkbox', 'radio']),

  /** The HTML input value. */
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number])
} : {};
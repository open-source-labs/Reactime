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

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _invoke2 = _interopRequireDefault(require("lodash/invoke"));

var _reactComponentEventListener = require("@stardust-ui/react-component-event-listener");

var _reactComponentRef = require("@stardust-ui/react-component-ref");

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _lib = require("../../lib");

var _SidebarPushable = _interopRequireDefault(require("./SidebarPushable"));

var _SidebarPusher = _interopRequireDefault(require("./SidebarPusher"));

/**
 * A sidebar hides additional content beside a page.
 */
var Sidebar =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(Sidebar, _Component);

  function Sidebar(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, Sidebar);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Sidebar).call(this, props));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "ref", (0, _react.createRef)());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleAnimationStart", function () {
      var visible = _this.props.visible;
      var callback = visible ? 'onVisible' : 'onHide';
      clearTimeout(_this.animationTimer);
      _this.animationTimer = setTimeout(_this.handleAnimationEnd, Sidebar.animationDuration);

      if (_this.skipNextCallback) {
        _this.skipNextCallback = false;
        return;
      }

      (0, _invoke2["default"])(_this.props, callback, null, _this.props);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleAnimationEnd", function () {
      var visible = _this.props.visible;
      var callback = visible ? 'onShow' : 'onHidden';

      _this.setState({
        animationTick: 0
      });

      (0, _invoke2["default"])(_this.props, callback, null, _this.props);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleDocumentClick", function (e) {
      if (!(0, _lib.doesNodeContainClick)(_this.ref.current, e)) {
        _this.skipNextCallback = true;
        (0, _invoke2["default"])(_this.props, 'onHide', e, (0, _objectSpread2["default"])({}, _this.props, {
          visible: false
        }));
      }
    });
    _this.state = {
      animationTick: 0,
      visible: props.visible
    };
    return _this;
  }

  (0, _createClass2["default"])(Sidebar, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.state.animationTick > prevState.animationTick) {
        this.handleAnimationStart();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearTimeout(this.animationTimer);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          animation = _this$props.animation,
          className = _this$props.className,
          children = _this$props.children,
          content = _this$props.content,
          direction = _this$props.direction,
          target = _this$props.target,
          visible = _this$props.visible,
          width = _this$props.width;
      var animationTick = this.state.animationTick;
      var classes = (0, _classnames["default"])('ui', animation, direction, width, (0, _lib.useKeyOnly)(animationTick > 0, 'animating'), (0, _lib.useKeyOnly)(visible, 'visible'), 'sidebar', className);
      var rest = (0, _lib.getUnhandledProps)(Sidebar, this.props);
      var ElementType = (0, _lib.getElementType)(Sidebar, this.props);
      var targetRef = (0, _reactComponentRef.isRefObject)(target) ? target : (0, _reactComponentRef.toRefObject)(target);
      return _react["default"].createElement(_reactComponentRef.Ref, {
        innerRef: this.ref
      }, _react["default"].createElement(ElementType, (0, _extends2["default"])({}, rest, {
        className: classes
      }), _lib.childrenUtils.isNil(children) ? content : children, visible && _react["default"].createElement(_reactComponentEventListener.EventListener, {
        listener: this.handleDocumentClick,
        targetRef: targetRef,
        type: "click"
      })));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      // We use `animationTick` to understand when an animation should be scheduled
      var tickIncrement = !!props.visible === !!state.visible ? 0 : 1;
      return {
        animationTick: state.animationTick + tickIncrement,
        visible: props.visible
      };
    }
  }]);
  return Sidebar;
}(_react.Component);

(0, _defineProperty2["default"])(Sidebar, "defaultProps", {
  direction: 'left',
  target: _reactComponentEventListener.documentRef,
  visible: false
});
(0, _defineProperty2["default"])(Sidebar, "animationDuration", 500);
(0, _defineProperty2["default"])(Sidebar, "autoControlledProps", ['visible']);
(0, _defineProperty2["default"])(Sidebar, "Pushable", _SidebarPushable["default"]);
(0, _defineProperty2["default"])(Sidebar, "Pusher", _SidebarPusher["default"]);
(0, _defineProperty2["default"])(Sidebar, "handledProps", ["animation", "as", "children", "className", "content", "direction", "onHidden", "onHide", "onShow", "onVisible", "target", "visible", "width"]);
Sidebar.propTypes = process.env.NODE_ENV !== "production" ? {
  /** An element type to render as (string or function). */
  as: _propTypes["default"].elementType,

  /** Animation style. */
  animation: _propTypes["default"].oneOf(['overlay', 'push', 'scale down', 'uncover', 'slide out', 'slide along']),

  /** Primary content. */
  children: _propTypes["default"].node,

  /** Additional classes. */
  className: _propTypes["default"].string,

  /** Shorthand for primary content. */
  content: _lib.customPropTypes.contentShorthand,

  /** Direction the sidebar should appear on. */
  direction: _propTypes["default"].oneOf(['top', 'right', 'bottom', 'left']),

  /**
   * Called before a sidebar begins to animate out.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onHide: _propTypes["default"].func,

  /**
   * Called after a sidebar has finished animating out.
   *
   * @param {null}
   * @param {object} data - All props.
   */
  onHidden: _propTypes["default"].func,

  /**
   * Called when a sidebar has finished animating in.
   *
   * @param {null}
   * @param {object} data - All props.
   */
  onShow: _propTypes["default"].func,

  /**
   * Called when a sidebar begins animating in.
   *
   * @param {null}
   * @param {object} data - All props.
   */
  onVisible: _propTypes["default"].func,

  /** A sidebar can handle clicks on the passed element. */
  target: _propTypes["default"].oneOfType([_lib.customPropTypes.domNode, _lib.customPropTypes.refObject]),

  /** Controls whether or not the sidebar is visible on the page. */
  visible: _propTypes["default"].bool,

  /** Sidebar width. */
  width: _propTypes["default"].oneOf(['very thin', 'thin', 'wide', 'very wide'])
} : {};
var _default = Sidebar;
exports["default"] = _default;
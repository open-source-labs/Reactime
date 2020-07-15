import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _isUndefined from "lodash/isUndefined";
import _startsWith from "lodash/startsWith";
import _filter from "lodash/filter";
import _isEmpty from "lodash/isEmpty";
import _keys from "lodash/keys";
import _intersection from "lodash/intersection";
import _has from "lodash/has";
import _each from "lodash/each";
import _invoke from "lodash/invoke";
import { Component } from 'react';
import { getAutoControlledStateValue, getDefaultPropName } from './AutoControlledComponent';

var ModernAutoControlledComponent =
/*#__PURE__*/
function (_Component) {
  _inherits(ModernAutoControlledComponent, _Component);

  function ModernAutoControlledComponent() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ModernAutoControlledComponent);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ModernAutoControlledComponent)).call.apply(_getPrototypeOf2, [this].concat(args)));
    var _this$constructor = _this.constructor,
        autoControlledProps = _this$constructor.autoControlledProps,
        getAutoControlledStateFromProps = _this$constructor.getAutoControlledStateFromProps;
    var state = _invoke(_assertThisInitialized(_this), 'getInitialAutoControlledState', _this.props) || {};

    if (process.env.NODE_ENV !== 'production') {
      var _this$constructor2 = _this.constructor,
          defaultProps = _this$constructor2.defaultProps,
          name = _this$constructor2.name,
          propTypes = _this$constructor2.propTypes,
          getDerivedStateFromProps = _this$constructor2.getDerivedStateFromProps; // require usage of getAutoControlledStateFromProps()

      if (getDerivedStateFromProps !== ModernAutoControlledComponent.getDerivedStateFromProps) {
        /* eslint-disable-next-line no-console */
        console.error("Auto controlled ".concat(name, " must specify a static getAutoControlledStateFromProps() instead of getDerivedStateFromProps()."));
      } // require propTypes


      _each(autoControlledProps, function (prop) {
        var defaultProp = getDefaultPropName(prop); // regular prop

        if (!_has(propTypes, defaultProp)) {
          console.error("".concat(name, " is missing \"").concat(defaultProp, "\" propTypes validation for auto controlled prop \"").concat(prop, "\"."));
        } // its default prop


        if (!_has(propTypes, prop)) {
          console.error("".concat(name, " is missing propTypes validation for auto controlled prop \"").concat(prop, "\"."));
        }
      }); // prevent autoControlledProps in defaultProps
      //
      // When setting state, auto controlled props values always win (so the parent can manage them).
      // It is not reasonable to decipher the difference between props from the parent and defaultProps.
      // Allowing defaultProps results in trySetState always deferring to the defaultProp value.
      // Auto controlled props also listed in defaultProps can never be updated.
      //
      // To set defaults for an AutoControlled prop, you can set the initial state in the
      // constructor or by using an ES7 property initializer:
      // https://babeljs.io/blog/2015/06/07/react-on-es6-plus#property-initializers


      var illegalDefaults = _intersection(autoControlledProps, _keys(defaultProps));

      if (!_isEmpty(illegalDefaults)) {
        console.error(['Do not set defaultProps for autoControlledProps. You can set defaults by', 'setting state in the constructor or using an ES7 property initializer', '(https://babeljs.io/blog/2015/06/07/react-on-es6-plus#property-initializers)', "See ".concat(name, " props: \"").concat(illegalDefaults, "\".")].join(' '));
      } // prevent listing defaultProps in autoControlledProps
      //
      // Default props are automatically handled.
      // Listing defaults in autoControlledProps would result in allowing defaultDefaultValue props.


      var illegalAutoControlled = _filter(autoControlledProps, function (prop) {
        return _startsWith(prop, 'default');
      });

      if (!_isEmpty(illegalAutoControlled)) {
        console.error(['Do not add default props to autoControlledProps.', 'Default props are automatically handled.', "See ".concat(name, " autoControlledProps: \"").concat(illegalAutoControlled, "\".")].join(' '));
      }
    } // Auto controlled props are copied to state.
    // Set initial state by copying auto controlled props to state.
    // Also look for the default prop for any auto controlled props (foo => defaultFoo)
    // so we can set initial values from defaults.


    var initialAutoControlledState = autoControlledProps.reduce(function (acc, prop) {
      acc[prop] = getAutoControlledStateValue(prop, _this.props, state, true);

      if (process.env.NODE_ENV !== 'production') {
        var defaultPropName = getDefaultPropName(prop);
        var _name = _this.constructor.name; // prevent defaultFoo={} along side foo={}

        if (!_isUndefined(_this.props[defaultPropName]) && !_isUndefined(_this.props[prop])) {
          console.error("".concat(_name, " prop \"").concat(prop, "\" is auto controlled. Specify either ").concat(defaultPropName, " or ").concat(prop, ", but not both."));
        }
      }

      return acc;
    }, {});
    _this.state = _objectSpread({}, state, initialAutoControlledState, {
      autoControlledProps: autoControlledProps,
      getAutoControlledStateFromProps: getAutoControlledStateFromProps
    });
    return _this;
  }

  _createClass(ModernAutoControlledComponent, null, [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      var autoControlledProps = state.autoControlledProps,
          getAutoControlledStateFromProps = state.getAutoControlledStateFromProps; // Solve the next state for autoControlledProps

      var newStateFromProps = autoControlledProps.reduce(function (acc, prop) {
        var isNextDefined = !_isUndefined(props[prop]); // if next is defined then use its value

        if (isNextDefined) acc[prop] = props[prop];
        return acc;
      }, {}); // Due to the inheritance of the AutoControlledComponent we should call its
      // getAutoControlledStateFromProps() and merge it with the existing state

      if (getAutoControlledStateFromProps) {
        var computedState = getAutoControlledStateFromProps(props, _objectSpread({}, state, newStateFromProps)); // We should follow the idea of getDerivedStateFromProps() and return only modified state

        return _objectSpread({}, newStateFromProps, computedState);
      }

      return newStateFromProps;
    }
    /**
     * Override this method to use getDerivedStateFromProps() in child components.
     */

  }, {
    key: "getAutoControlledStateFromProps",
    value: function getAutoControlledStateFromProps() {
      return null;
    }
  }]);

  return ModernAutoControlledComponent;
}(Component);

export { ModernAutoControlledComponent as default };
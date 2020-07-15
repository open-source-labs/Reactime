import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import handleRef from './handleRef';
import { refPropType } from './types';

var RefFindNode =
/*#__PURE__*/
function (_React$Component) {
  _inherits(RefFindNode, _React$Component);

  function RefFindNode() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, RefFindNode);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(RefFindNode)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "prevNode", null);

    return _this;
  }

  _createClass(RefFindNode, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.prevNode = ReactDOM.findDOMNode(this);
      handleRef(this.props.innerRef, this.prevNode);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var currentNode = ReactDOM.findDOMNode(this);

      if (this.prevNode !== currentNode) {
        this.prevNode = currentNode;
        handleRef(this.props.innerRef, currentNode);
      }

      if (prevProps.innerRef !== this.props.innerRef) {
        handleRef(this.props.innerRef, currentNode);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      handleRef(this.props.innerRef, null);
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      return children;
    }
  }]);

  return RefFindNode;
}(React.Component);

_defineProperty(RefFindNode, "displayName", 'RefFindNode');

_defineProperty(RefFindNode, "propTypes", process.env.NODE_ENV !== 'production' ? {
  children: PropTypes.element.isRequired,
  innerRef: refPropType.isRequired
} : {});

export { RefFindNode as default };
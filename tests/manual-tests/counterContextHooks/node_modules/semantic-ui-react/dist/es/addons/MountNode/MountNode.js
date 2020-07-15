import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { customPropTypes } from '../../lib';
import getNodeRefFromProps from './lib/getNodeRefFromProps';
import handleClassNamesChange from './lib/handleClassNamesChange';
import NodeRegistry from './lib/NodeRegistry';
var nodeRegistry = new NodeRegistry();
/**
 * A component that allows to manage classNames on a DOM node in declarative manner.
 */

var MountNode =
/*#__PURE__*/
function (_Component) {
  _inherits(MountNode, _Component);

  function MountNode() {
    _classCallCheck(this, MountNode);

    return _possibleConstructorReturn(this, _getPrototypeOf(MountNode).apply(this, arguments));
  }

  _createClass(MountNode, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(_ref) {
      var nextClassName = _ref.className;
      var currentClassName = this.props.className;
      return nextClassName !== currentClassName;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var nodeRef = getNodeRefFromProps(this.props);
      nodeRegistry.add(nodeRef, this);
      nodeRegistry.emit(nodeRef, handleClassNamesChange);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      nodeRegistry.emit(getNodeRefFromProps(this.props), handleClassNamesChange);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var nodeRef = getNodeRefFromProps(this.props);
      nodeRegistry.del(nodeRef, this);
      nodeRegistry.emit(nodeRef, handleClassNamesChange);
    }
  }, {
    key: "render",
    value: function render() {
      return null;
    }
  }]);

  return MountNode;
}(Component);

_defineProperty(MountNode, "handledProps", ["className", "node"]);

export { MountNode as default };
MountNode.propTypes = process.env.NODE_ENV !== "production" ? {
  /** Additional classes. */
  className: PropTypes.string,

  /** The DOM node where we will apply class names. Defaults to document.body. */
  node: PropTypes.oneOfType([customPropTypes.domNode, customPropTypes.refObject])
} : {};
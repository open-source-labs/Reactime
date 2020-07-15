"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _isNil2 = _interopRequireDefault(require("lodash/isNil"));

var _reactComponentRef = require("@stardust-ui/react-component-ref");

var _lib = require("../../../lib");

/**
 * Given `this.props`, return a `node` value or undefined.
 *
 * @param {object|React.RefObject} props Component's props
 * @return {React.RefObject|undefined}
 */
var getNodeRefFromProps = function getNodeRefFromProps(props) {
  var node = props.node;

  if ((0, _lib.isBrowser)()) {
    if ((0, _reactComponentRef.isRefObject)(node)) return node;
    return (0, _isNil2["default"])(node) ? (0, _reactComponentRef.toRefObject)(document.body) : (0, _reactComponentRef.toRefObject)(node);
  }
};

var _default = getNodeRefFromProps;
exports["default"] = _default;
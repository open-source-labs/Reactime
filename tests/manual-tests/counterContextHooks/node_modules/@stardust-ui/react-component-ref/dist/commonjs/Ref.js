"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var PropTypes = _interopRequireWildcard(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var ReactIs = _interopRequireWildcard(require("react-is"));

var _RefFindNode = _interopRequireDefault(require("./RefFindNode"));

var _RefForward = _interopRequireDefault(require("./RefForward"));

var _types = require("./types");

var Ref = function Ref(props) {
  var children = props.children,
      innerRef = props.innerRef;
  var child = React.Children.only(children);
  var ElementType = ReactIs.isForwardRef(child) ? _RefForward.default : _RefFindNode.default;
  return React.createElement(ElementType, {
    innerRef: innerRef
  }, child);
};

Ref.displayName = 'Ref'; // TODO: use Babel plugin for this

if (process.env.NODE_ENV !== 'production') {
  Ref.propTypes = {
    children: PropTypes.element.isRequired,
    innerRef: _types.refPropType.isRequired
  };
}

var _default = Ref;
exports.default = _default;
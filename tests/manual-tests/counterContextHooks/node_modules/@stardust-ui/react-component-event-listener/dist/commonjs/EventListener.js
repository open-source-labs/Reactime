"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var PropTypes = _interopRequireWildcard(require("prop-types"));

var _useEventListener = _interopRequireDefault(require("./useEventListener"));

function EventListener(props) {
  (0, _useEventListener.default)(props);
  return null;
}

EventListener.displayName = 'EventListener'; // TODO: use Babel plugin for this

EventListener.propTypes = process.env.NODE_ENV !== 'production' ? {
  capture: PropTypes.bool,
  listener: PropTypes.func.isRequired,
  targetRef: PropTypes.shape({
    current: PropTypes.object
  }).isRequired,
  type: PropTypes.string.isRequired
} : {};
EventListener.defaultProps = {
  capture: false
};
var _default = EventListener;
exports.default = _default;
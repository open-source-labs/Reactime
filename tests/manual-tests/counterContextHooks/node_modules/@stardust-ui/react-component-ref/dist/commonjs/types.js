"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.refPropType = void 0;

var PropTypes = _interopRequireWildcard(require("prop-types"));

/** A checker that matches the React.Ref type. */
var refPropType = PropTypes.oneOfType([PropTypes.func, PropTypes.object]);
exports.refPropType = refPropType;
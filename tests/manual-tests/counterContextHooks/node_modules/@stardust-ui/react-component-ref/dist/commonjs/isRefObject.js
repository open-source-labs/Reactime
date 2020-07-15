"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

/** Checks that the passed object is a valid React ref object. */
var isRefObject = function isRefObject(ref) {
  return (// https://github.com/facebook/react/blob/v16.8.2/packages/react-reconciler/src/ReactFiberCommitWork.js#L665
    ref !== null && (0, _typeof2.default)(ref) === 'object' && ref.hasOwnProperty('current')
  );
};

var _default = isRefObject;
exports.default = _default;
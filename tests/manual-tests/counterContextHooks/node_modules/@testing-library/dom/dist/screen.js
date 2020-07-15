"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.screen = void 0;

var queries = _interopRequireWildcard(require("./queries"));

var _getQueriesForElement = require("./get-queries-for-element");

var _prettyDom = require("./pretty-dom");

const debug = (element, maxLength, options) => Array.isArray(element) ? element.forEach(el => (0, _prettyDom.logDOM)(el, maxLength, options)) : (0, _prettyDom.logDOM)(element, maxLength, options);

const screen = typeof document !== 'undefined' && document.body ? (0, _getQueriesForElement.getQueriesForElement)(document.body, queries, {
  debug
}) : Object.keys(queries).reduce((helpers, key) => {
  helpers[key] = () => {
    throw new TypeError('For queries bound to document.body a global document has to be available... Learn more: https://testing-library.com/s/screen-global-error');
  };

  return helpers;
}, {
  debug
});
exports.screen = screen;
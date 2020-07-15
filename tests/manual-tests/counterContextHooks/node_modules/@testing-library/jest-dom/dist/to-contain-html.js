"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toContainHTML = toContainHTML;

var _jestMatcherUtils = require("jest-matcher-utils");

var _utils = require("./utils");

function toContainHTML(container, htmlText) {
  (0, _utils.checkHtmlElement)(container, toContainHTML, this);
  return {
    pass: container.outerHTML.includes(htmlText),
    message: () => {
      return [(0, _jestMatcherUtils.matcherHint)(`${this.isNot ? '.not' : ''}.toContainHTML`, 'element', ''), '', 'Received:', `  ${(0, _jestMatcherUtils.printReceived)(container.cloneNode(true))}`].join('\n');
    }
  };
}
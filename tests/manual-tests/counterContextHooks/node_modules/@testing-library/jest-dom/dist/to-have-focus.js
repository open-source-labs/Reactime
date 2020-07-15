"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toHaveFocus = toHaveFocus;

var _jestMatcherUtils = require("jest-matcher-utils");

var _utils = require("./utils");

function toHaveFocus(element) {
  (0, _utils.checkHtmlElement)(element, toHaveFocus, this);
  return {
    pass: element.ownerDocument.activeElement === element,
    message: () => {
      return [(0, _jestMatcherUtils.matcherHint)(`${this.isNot ? '.not' : ''}.toHaveFocus`, 'element', ''), '', 'Expected', `  ${(0, _jestMatcherUtils.printExpected)(element)}`, 'Received:', `  ${(0, _jestMatcherUtils.printReceived)(element.ownerDocument.activeElement)}`].join('\n');
    }
  };
}
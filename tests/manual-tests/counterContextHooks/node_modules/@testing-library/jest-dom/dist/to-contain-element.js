"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toContainElement = toContainElement;

var _jestMatcherUtils = require("jest-matcher-utils");

var _utils = require("./utils");

function toContainElement(container, element) {
  (0, _utils.checkHtmlElement)(container, toContainElement, this);

  if (element !== null) {
    (0, _utils.checkHtmlElement)(element, toContainElement, this);
  }

  return {
    pass: container.contains(element),
    message: () => {
      return [(0, _jestMatcherUtils.matcherHint)(`${this.isNot ? '.not' : ''}.toContainElement`, 'element', 'element'), '', (0, _jestMatcherUtils.RECEIVED_COLOR)(`${(0, _jestMatcherUtils.stringify)(container.cloneNode(false))} ${this.isNot ? 'contains:' : 'does not contain:'} ${(0, _jestMatcherUtils.stringify)(element ? element.cloneNode(false) : element)}
        `)].join('\n');
    }
  };
}
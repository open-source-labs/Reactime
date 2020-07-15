"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toHaveAttribute = toHaveAttribute;

var _jestMatcherUtils = require("jest-matcher-utils");

var _utils = require("./utils");

function printAttribute(name, value) {
  return value === undefined ? name : `${name}=${(0, _jestMatcherUtils.stringify)(value)}`;
}

function getAttributeComment(name, value) {
  return value === undefined ? `element.hasAttribute(${(0, _jestMatcherUtils.stringify)(name)})` : `element.getAttribute(${(0, _jestMatcherUtils.stringify)(name)}) === ${(0, _jestMatcherUtils.stringify)(value)}`;
}

function toHaveAttribute(htmlElement, name, expectedValue) {
  (0, _utils.checkHtmlElement)(htmlElement, toHaveAttribute, this);
  const isExpectedValuePresent = expectedValue !== undefined;
  const hasAttribute = htmlElement.hasAttribute(name);
  const receivedValue = htmlElement.getAttribute(name);
  return {
    pass: isExpectedValuePresent ? hasAttribute && this.equals(receivedValue, expectedValue) : hasAttribute,
    message: () => {
      const to = this.isNot ? 'not to' : 'to';
      const receivedAttribute = hasAttribute ? printAttribute(name, receivedValue) : null;
      const matcher = (0, _jestMatcherUtils.matcherHint)(`${this.isNot ? '.not' : ''}.toHaveAttribute`, 'element', (0, _jestMatcherUtils.printExpected)(name), {
        secondArgument: isExpectedValuePresent ? (0, _jestMatcherUtils.printExpected)(expectedValue) : undefined,
        comment: getAttributeComment(name, expectedValue)
      });
      return (0, _utils.getMessage)(matcher, `Expected the element ${to} have attribute`, printAttribute(name, expectedValue), 'Received', receivedAttribute);
    }
  };
}
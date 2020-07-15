"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toHaveTextContent = toHaveTextContent;

var _jestMatcherUtils = require("jest-matcher-utils");

var _utils = require("./utils");

function toHaveTextContent(htmlElement, checkWith, options = {
  normalizeWhitespace: true
}) {
  (0, _utils.checkHtmlElement)(htmlElement, toHaveTextContent, this);
  const textContent = options.normalizeWhitespace ? (0, _utils.normalize)(htmlElement.textContent) : htmlElement.textContent.replace(/\u00a0/g, ' '); // Replace &nbsp; with normal spaces

  const checkingWithEmptyString = textContent !== '' && checkWith === '';
  return {
    pass: !checkingWithEmptyString && (0, _utils.matches)(textContent, checkWith),
    message: () => {
      const to = this.isNot ? 'not to' : 'to';
      return (0, _utils.getMessage)((0, _jestMatcherUtils.matcherHint)(`${this.isNot ? '.not' : ''}.toHaveTextContent`, 'element', ''), checkingWithEmptyString ? `Checking with empty string will always match, use .toBeEmpty() instead` : `Expected element ${to} have text content`, checkWith, 'Received', textContent);
    }
  };
}
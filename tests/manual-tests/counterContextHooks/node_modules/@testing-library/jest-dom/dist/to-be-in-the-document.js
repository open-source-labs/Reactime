"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toBeInTheDocument = toBeInTheDocument;

var _jestMatcherUtils = require("jest-matcher-utils");

var _utils = require("./utils");

function toBeInTheDocument(element) {
  if (element !== null || !this.isNot) {
    (0, _utils.checkHtmlElement)(element, toBeInTheDocument, this);
  }

  const pass = element === null ? false : element.ownerDocument.contains(element);

  const errorFound = () => {
    return `expected document not to contain element, found ${(0, _jestMatcherUtils.stringify)(element.cloneNode(true))} instead`;
  };

  const errorNotFound = () => {
    return `element could not be found in the document`;
  };

  return {
    pass,
    message: () => {
      return [(0, _jestMatcherUtils.matcherHint)(`${this.isNot ? '.not' : ''}.toBeInTheDocument`, 'element', ''), '', (0, _jestMatcherUtils.RECEIVED_COLOR)(this.isNot ? errorFound() : errorNotFound())].join('\n');
    }
  };
}
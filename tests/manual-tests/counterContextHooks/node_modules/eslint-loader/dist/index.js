"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loader;

var _getOptions = _interopRequireDefault(require("./getOptions"));

var _Linter = _interopRequireDefault(require("./Linter"));

var _cacheLoader = _interopRequireDefault(require("./cacheLoader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loader(content, map) {
  const options = (0, _getOptions.default)(this);
  const linter = new _Linter.default(this, options);
  this.cacheable(); // return early if cached

  if (options.cache) {
    (0, _cacheLoader.default)(linter, content, map);
    return;
  }

  linter.printOutput(linter.lint(content));
  this.callback(null, content, map);
}
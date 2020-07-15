"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createEngine;

var _objectHash = _interopRequireDefault(require("object-hash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const engines = {};

function createEngine(options) {
  const {
    CLIEngine
  } = require(options.eslintPath);

  const hash = (0, _objectHash.default)(options);

  if (!engines[hash]) {
    engines[hash] = new CLIEngine(options);
  }

  return {
    CLIEngine,
    engine: engines[hash]
  };
}
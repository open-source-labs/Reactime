"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getOptions;

var _loaderUtils = _interopRequireDefault(require("loader-utils"));

var _schemaUtils = _interopRequireDefault(require("schema-utils"));

var _options = _interopRequireDefault(require("./options.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getOptions(loaderContext) {
  const options = {
    eslintPath: 'eslint',
    ..._loaderUtils.default.getOptions(loaderContext)
  };
  (0, _schemaUtils.default)(_options.default, options, {
    name: 'ESLint Loader',
    baseDataPath: 'options'
  });

  const {
    CLIEngine
  } = require(options.eslintPath);

  options.formatter = getFormatter(CLIEngine, options.formatter);

  if (options.outputReport && options.outputReport.formatter) {
    options.outputReport.formatter = getFormatter(CLIEngine, options.outputReport.formatter);
  }

  return options;
}

function getFormatter(CLIEngine, formatter) {
  if (typeof formatter === 'function') {
    return formatter;
  } // Try to get oficial formatter


  if (typeof formatter === 'string') {
    try {
      return CLIEngine.getFormatter(formatter);
    } catch (e) {// ignored
    }
  }

  return CLIEngine.getFormatter('stylish');
}
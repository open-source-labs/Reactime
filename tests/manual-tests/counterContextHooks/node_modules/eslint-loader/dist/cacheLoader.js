"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cacheLoader;

var _loaderFsCache = _interopRequireDefault(require("loader-fs-cache"));

var _package = require("../package.json");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cache = (0, _loaderFsCache.default)('eslint-loader');

function cacheLoader(linter, content, map) {
  const {
    loaderContext,
    options,
    CLIEngine
  } = linter;
  const callback = loaderContext.async();
  const cacheIdentifier = JSON.stringify({
    'eslint-loader': _package.version,
    eslint: CLIEngine.version
  });
  cache({
    directory: options.cache,
    identifier: cacheIdentifier,
    options,
    source: content,

    transform() {
      return linter.lint(content);
    }

  }, (err, res) => {
    // istanbul ignore next
    if (err) {
      return callback(err);
    }

    let error = err;

    try {
      linter.printOutput({ ...res,
        src: content
      });
    } catch (e) {
      error = e;
    }

    return callback(error, content, map);
  });
}
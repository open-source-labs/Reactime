"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
const path = require('path');

const _require = require('workbox-build'),
      copyWorkboxLibraries = _require.copyWorkboxLibraries,
      getModuleURL = _require.getModuleURL;
/**
 * @param {Object} compilation The webpack compilation.
 * @param {Object} config The options passed to the plugin constructor.
 * - config.excludeChunks may be modified by this function if
 *   config.importWorkboxFrom is set to a chunk name.
 * - config.modulePathPrefix may be modified by this function if
 *   config.importWorkboxFrom is set to 'local'.
 * @return {Array<string>|null} A list of URLs to use to import the Workbox
 * runtime code, or null if importWorkboxFrom is 'disabled'.
 * @private
 */


function getWorkboxSWImport(_x, _x2) {
  return _getWorkboxSWImport.apply(this, arguments);
}

function _getWorkboxSWImport() {
  _getWorkboxSWImport = (0, _asyncToGenerator2.default)(function* (compilation, config) {
    switch (config.importWorkboxFrom) {
      case 'cdn':
        {
          return [getModuleURL('workbox-sw')];
        }

      case 'local':
        {
          // This will create a local copy of the Workbox runtime libraries in
          // the output directory, independent of the webpack build pipeline.
          // In general, this should work, but one thing to keep in mind is that
          // when using the webpack-dev-server, the output will be created on
          // disk, rather than in the in-memory filesystem. (webpack-dev-server will
          // still be able to serve the runtime libraries from disk.)
          const wbDir = yield copyWorkboxLibraries(path.join(compilation.options.output.path, config.importsDirectory)); // We need to set this extra option in the config to ensure that the
          // workbox library loader knows where to get the local libraries from.

          config.modulePathPrefix = (compilation.options.output.publicPath || '') + path.join(config.importsDirectory, wbDir).split(path.sep).join('/');
          const workboxSWImport = config.modulePathPrefix + '/workbox-sw.js';
          return [workboxSWImport];
        }

      case 'disabled':
        {
          return null;
        }

      default:
        {
          // If importWorkboxFrom is anything else, then treat it as the name of
          // a webpack chunk that corresponds to the custom compilation of the
          // Workbox code.
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = compilation.chunks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              const chunk = _step.value;

              // Make sure that we actually have a chunk with the appropriate name.
              if (chunk.name === config.importWorkboxFrom) {
                config.excludeChunks.push(chunk.name);
                return chunk.files.map(file => {
                  return (compilation.options.output.publicPath || '') + file;
                });
              }
            } // If there's no chunk with the right name, treat it as a fatal error.

          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          throw Error(`importWorkboxFrom was set to ` + `'${config.importWorkboxFrom}', which is not an existing chunk name.`);
        }
    }
  });
  return _getWorkboxSWImport.apply(this, arguments);
}

module.exports = getWorkboxSWImport;
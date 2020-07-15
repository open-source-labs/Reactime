"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');

const getAssetHash = require('./get-asset-hash');

const resolveWebpackURL = require('./resolve-webpack-url');
/**
 * A single manifest entry that Workbox can precache.
 * When possible, we leave out the revision information, which tells Workbox
 * that the URL contains enough info to uniquely version the asset.
 *
 * @param {Array<string>} knownHashes All of the hashes that are associated
 * with this webpack build.
 * @param {string} url webpack asset url path
 * @param {string} [revision] A revision hash for the entry
 * @return {module:workbox-build.ManifestEntry} A single manifest entry
 *
 * @private
 */


function getEntry(knownHashes, url, revision) {
  // We're assuming that if the URL contains any of the known hashes
  // (either the short or full chunk hash or compilation hash) then it's
  // already revisioned, and we don't need additional out-of-band revisioning.
  if (!revision || knownHashes.some(hash => url.includes(hash))) {
    return {
      url
    };
  }

  return {
    revision,
    url
  };
}
/**
 * Filter to narrow down the asset list to chunks that:
 * - have a name.
 * - if there's a whitelist, the chunk's name is in the whitelist.
 * - if there's a blacklist, the chunk's name is not in the blacklist.
 *
 * TODO:
 *  Filter files by size:
 *    https://github.com/GoogleChrome/workbox/pull/808#discussion_r139606242
 *  Filter files that match `staticFileGlobsIgnorePatterns` (or something)
 *  but filter for [/\.map$/, /asset-manifest\.json$/] by default:
 *    https://github.com/GoogleChrome/workbox/pull/808#discussion_r140565156
 *
 * @param {Object<string, Object>} assetMetadata Metadata about the assets.
 * @param {Array<string>} [whitelist] Chunk names to include.
 * @param {Array<string>} [blacklist] Chunk names to exclude.
 * @return {Object<string, Object>} Filtered asset metadata.
 *
 * @private
 */


function filterAssets(assetMetadata, whitelist, blacklist) {
  const filteredMapping = {};

  var _arr = Object.entries(assetMetadata);

  for (var _i = 0; _i < _arr.length; _i++) {
    const _arr$_i = (0, _slicedToArray2.default)(_arr[_i], 2),
          file = _arr$_i[0],
          metadata = _arr$_i[1];

    const chunkName = metadata.chunkName; // This file is whitelisted if:
    // - Trivially, if there is no whitelist defined.
    // - There is a whitelist and our file is associated with a chunk whose name
    // is listed.

    const isWhitelisted = whitelist.length === 0 || whitelist.includes(chunkName); // This file is blacklisted if our file is associated with a chunk whose
    // name is listed.

    const isBlacklisted = blacklist.includes(chunkName); // Only include this entry in the filtered mapping if we're whitelisted and
    // not blacklisted.

    if (isWhitelisted && !isBlacklisted) {
      filteredMapping[file] = metadata;
    }
  }

  return filteredMapping;
}
/**
 * Takes in compilation.assets and compilation.chunks, and assigns metadata
 * to each file listed in assets:
 *
 * - If the asset was created by a chunk, it assigns the existing chunk name and
 * chunk hash.
 * - If the asset was created outside of a chunk, it assigns a chunk name of ''
 * and generates a hash of the asset.
 *
 * @param {Object} assets The compilation.assets
 * @param {Array<Object>} chunks The compilation.chunks
 * @return {Object<string, Object>} Mapping of asset paths to chunk name and
 * hash metadata.
 *
 * @private
 */


function generateMetadataForAssets(assets, chunks) {
  const mapping = {}; // Start out by getting metadata for all the assets associated with a chunk.

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = chunks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      const chunk = _step.value;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = chunk.files[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          const file = _step2.value;
          mapping[file] = {
            chunkName: chunk.name,
            hash: chunk.renderedHash
          };
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    } // Next, loop through the total list of assets and find anything that isn't
    // associated with a chunk.

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

  var _arr2 = Object.entries(assets);

  for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
    const _arr2$_i = (0, _slicedToArray2.default)(_arr2[_i2], 2),
          file = _arr2$_i[0],
          asset = _arr2$_i[1];

    if (file in mapping) {
      continue;
    }

    mapping[file] = {
      // Just use an empty string to denote the lack of chunk association.
      chunkName: '',
      hash: getAssetHash(asset)
    };
  }

  return mapping;
}
/**
 * Given an assetMetadata mapping, returns a Set of all of the hashes that
 * are associated with at least one asset.
 *
 * @param {Object<string, Object>} assetMetadata Mapping of asset paths to chunk
 * name and hash metadata.
 * @return {Set} The known hashes associated with an asset.
 *
 * @private
 */


function getKnownHashesFromAssets(assetMetadata) {
  const knownHashes = new Set();

  var _arr3 = Object.values(assetMetadata);

  for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
    const metadata = _arr3[_i3];
    knownHashes.add(metadata.hash);
  }

  return knownHashes;
}
/**
 * Generate an array of manifest entries using webpack's compilation data.
 *
 * @param {Object} compilation webpack compilation
 * @param {Object} config
 * @return {Array<workbox.build.ManifestEntry>}
 *
 * @private
 */


function getManifestEntriesFromCompilation(compilation, config) {
  const blacklistedChunkNames = config.excludeChunks;
  const whitelistedChunkNames = config.chunks;
  const assets = compilation.assets,
        chunks = compilation.chunks;
  const publicPath = compilation.options.output.publicPath;
  const assetMetadata = generateMetadataForAssets(assets, chunks);
  const filteredAssetMetadata = filterAssets(assetMetadata, whitelistedChunkNames, blacklistedChunkNames);
  const knownHashes = [compilation.hash, compilation.fullHash, ...getKnownHashesFromAssets(filteredAssetMetadata)].filter(hash => !!hash);
  const manifestEntries = [];

  var _arr4 = Object.entries(filteredAssetMetadata);

  for (var _i4 = 0; _i4 < _arr4.length; _i4++) {
    const _arr4$_i = (0, _slicedToArray2.default)(_arr4[_i4], 2),
          file = _arr4$_i[0],
          metadata = _arr4$_i[1];

    // Filter based on test/include/exclude options set in the config,
    // following webpack's conventions.
    // This matches the behavior of, e.g., UglifyJS's webpack plugin.
    if (!ModuleFilenameHelpers.matchObject(config, file)) {
      continue;
    }

    const publicURL = resolveWebpackURL(publicPath, file);
    const manifestEntry = getEntry(knownHashes, publicURL, metadata.hash);
    manifestEntries.push(manifestEntry);
  }

  return manifestEntries;
}

module.exports = getManifestEntriesFromCompilation;
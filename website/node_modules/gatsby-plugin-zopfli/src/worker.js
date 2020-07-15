'use strict'

const zopfli = require('@gfx/zopfli')
const path = require('path')
const util = require('util')
const fs = require('fs')
const mkdirp = require('mkdirp')
const mkdirpAsync = util.promisify(mkdirp)
const readFileAsync = util.promisify(fs.readFile)
const writeFileAsync = util.promisify(fs.writeFile)

async function compressFile (file, pluginOptions = {}) {
  // zopfli-gzip the asset to a new file with the .gz extension
  const fileBasePath = path.join(process.cwd(), 'public')
  const srcFileName = path.join(fileBasePath, file)
  const content = await readFileAsync(srcFileName)
  const compressed = await zopfli.gzipAsync(content, pluginOptions.compression || {})

  const destFilePath = (pluginOptions.path) ? path.join(fileBasePath, pluginOptions.path) : fileBasePath
  const destFileName = path.join(destFilePath, file) + '.gz'
  const destFileDirname = path.dirname(destFileName)

  await mkdirpAsync(destFileDirname)
  await writeFileAsync(destFileName, compressed)

  const result = {
    originalSize: content.length,
    compressedSize: compressed.length
  }

  return result
}

module.exports = function (file, options, callback) {
  compressFile(file, options)
    .then(details => callback(details, null))
    .catch((err) => callback(err))
}

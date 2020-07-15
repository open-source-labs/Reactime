'use strict'

const glob = require('glob')
const path = require('path')
const util = require('util')
const workerFarm = require('worker-farm')
const worker = require.resolve('./worker')

const defaultOptions = {
  extensions: ['css', 'js'],
  path: ''
}

const globAsync = util.promisify(glob)

async function onPostBuild ({ reporter }, pluginOptions) {
  const options = { ...defaultOptions, ...pluginOptions }
  const fileBasePath = path.join(process.cwd(), 'public')
  const patternExt = (options.extensions.length > 1) ? `{${options.extensions.join(',')}}` : options.extensions[0]
  const pattern = `**/*.${patternExt}`

  const files = await globAsync(pattern, { cwd: fileBasePath, ignore: '**/*.gz', nodir: true })

  const compressFile = workerFarm(worker)

  const activity = reporter.activityTimer('Zopfli compression')
  activity.start()

  let totalCompressed = 0
  let totalSavings = 0
  const compress = files.map(file => {
    return new Promise((resolve, reject) => {
      compressFile(file, pluginOptions, (details, err) => {
        if (err) {
          reporter.panicOnBuild(`Zopfli compression failed ${err}`)
          reject(err)
        }
        if (pluginOptions.verbose) {
          reporter.verbose(`${file} - original size: ${bytesToSize(details.originalSize)} compressed size: ${bytesToSize(details.compressedSize)}`)
        }
        totalSavings += (details.originalSize - details.compressedSize)
        activity.setStatus(` ${file} ${++totalCompressed}/${files.length}`)
        resolve()
      })
    })
  })
  await Promise.all(compress)
  workerFarm.end(compressFile)

  activity.setStatus(` ${totalCompressed}/${files.length}`)
  activity.end()

  reporter.info(`Zopfli compression total payload reduced ${bytesToSize(totalSavings)}`)
}

// courtesy https://web.archive.org/web/20120507054320/http://codeaid.net/javascript/convert-size-in-bytes-to-human-readable-format-(javascript)
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
const bytesToSize = (bytes) => {
  if (bytes < 2) return `${bytes} Byte`
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return `${Math.round(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`
}

exports.onPostBuild = onPostBuild

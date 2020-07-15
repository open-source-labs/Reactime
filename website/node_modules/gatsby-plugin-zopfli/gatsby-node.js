'use strict'

const zopfliPlugin = require('./src/zopfli-plugin')

exports.onPostBuild = zopfliPlugin.onPostBuild

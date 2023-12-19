/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

/** ChromeExtensionReloader plugin is a tool for hot-reloading code in a Chrome extension during development.
 * It works by injecting a script into the extension that listens for file changes and automatically reloads the extension when a file is modified.
 */


// const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

const config = {
  // use a "multi-main entry" to inject multiple dependent files together
  // and graph their dependencies into one "chunk"
  entry: {
    app: './src/app/index.tsx',
    background: './src/extension/background.js',
    content: './src/extension/contentScript.ts',
    backend: './src/backend/index.ts',
  },

};

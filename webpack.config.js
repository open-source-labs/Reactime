require('dotenv').config()
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

/** ChromeExtensionReloader plugin is a tool for hot-reloading code in a Chrome extension during development.
 * It works by injecting a script into the extension that listens for file changes and automatically reloads the extension when a file is modified.
 */



// const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

module.exports  = {
  mode: process.env.NODE_ENV || "production",
  // use a "multi-main entry" to inject multiple dependent files together
  // and graph their dependencies into one "chunk"
  entry: {
    app: './src/app/index.tsx',
    background: './src/extension/background.js',
    content: './src/extension/contentScript.ts',
    backend: './src/backend/index.ts',
  },
  watchOptions: {
    aggregateTimeout: 1000,
    ignored: /node_modules/,
  },
  output: {
    path: path.resolve(__dirname, 'src/extension/build/bundles'),
    filename: '[name].bundle.js',
  },
  devtool: "cheap-module-source-map",
  module: {
    rules: [ 
      /**
       * For all files ending in .ts or .tsx, except those in node_modules
       * => transpile typescript files into javascript file.
       */
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
        resolve: {
          extensions: ['.tsx', '.ts', '.js'],
        },
      },
      /**
       * For all files ending in .scss or .css files
       * Since sass-loader will only works with .scss & .sass files, for any .css file, webpack will skip sass-loader and use css-loader, then style-loader.
       */
      {
        test: /\.s?css$/,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ]
  },  
  // Add `.ts` and `.tsx` as a resolvable extension.
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

};

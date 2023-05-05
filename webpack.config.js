/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

/** ChromeExtensionReloader plugin is a tool for hot-reloading code in a Chrome extension during development.
 * It works by injecting a script into the extension that listens for file changes and automatically reloads the extension when a file is modified.
 */
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

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
  /**
   * Bundle each entry point into one "chunk" & store it in the extension/build/bundles folder
   * When load the unpacked extension in the chrome extension store, the src/extension/build folder is selected => load all bundles (app, backend, background & content script)
   */
  watchOptions: {
    poll: true,
    ignored: /node_modules/
  },
  
  output: {
    path: path.resolve(__dirname, 'src/extension/build/bundles'),
    filename: '[name].bundle.js',
  },

  node: {
    net: 'empty',
    tls: 'empty',
  },
  module: {
    /** The order of rules array is bottom to top.
     * In your rules array, the order is:
     * 1 .css and .scss files will be evaluated first will use the style-loader and css-loader, as well as the sass-loader (only applicable for .scss files).
     * 2 .tsx and .ts files will be evaluated third and will use the ts-loader.
     * 3 .jsx and .js files will be evaluated last and will use the babel-loader to transpile them into code that is compatible with older browsers.
     */
    rules: [
      /**
       * For all files ending .js or .jsx, except those in node_modules
       * => transpile them into code that is compatible with older browser using babel-loader
       */
      {
        test: /\.jsx?/,
        exclude: /(node_modules)/,
        resolve: {
          extensions: ['.js', '.jsx'],
        },
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'entry',
                  corejs: 3,
                  debug: true,
                },
              ],

              '@babel/preset-react',
              {
                plugins: ['@babel/plugin-proposal-class-properties'],
              },
            ],
          },
        },
      },
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
    ],
  },
  plugins: [
    // new TypedocWebpackPlugin({
    //   name: 'Contoso',
    //   mode: 'modules',
    //   theme: './typedoc-theme/',
    //   includeDeclarations: false,
    //   ignoreCompilerErrors: true,
    // }),
  ],

  // Add `.ts` and `.tsx` as a resolvable extension.
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
};

module.exports = (env, argv) => {
  /**
   * env stands for "environment" and is an object that contains environment-specific configuration properties.
   * argv stands for "argument vector" and is an object that contains the arguments passed to Webpack via the command line interface.
   * argv.mode is an argument that is parsed by the Webpack CLI to specify the build mode.
   * For example, running webpack --mode=production will set argv.mode to 'production'.
   */
  if (argv.mode === 'development') {
    /**
     * "cheap-module-source-map" is a type of source map in webpack.
     * A source map is a file that maps the source code to the compiled code, making it easier to debug and trace issues in the original source code.
     * devtool is option to control if & how source maps are generated
     * https://webpack.js.org/configuration/devtool/#root
     */
    config.devtool = 'cheap-module-source-map';
    config.plugins.push(
      new ChromeExtensionReloader({
        entries: {
          contentScript: ['app', 'content'],
          background: ['background'],
        },
      }),
    );
  } else {
    config.mode = 'production';
  }
  return config;
};

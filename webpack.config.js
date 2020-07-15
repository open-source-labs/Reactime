const path = require('path');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader'); // enable hot reloading while developing a chrome extension
// const TypedocWebpackPlugin = require('typedoc-webpack-plugin');


const config = {
  // use a "multi-main entry" to inject multiple dependent files together
  // and graph their dependencies into one "chunk"
  entry: {
    // app: './src/app/index.js',
    app: './src/app/index.tsx',
    background: './src/extension/background.js',
    content: './src/extension/contentScript.ts',
    backend: './src/backend/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'src/extension/build/bundles'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
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
              ['@babel/preset-env',
                {
                  useBuiltIns: 'entry',
                  corejs: 3,
                  debug: true,
                },
              ],

              '@babel/preset-react',
              {
                plugins: [
                  '@babel/plugin-proposal-class-properties',
                ],
              },
            ],
          },
        },
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
        resolve: {
          extensions: ['.tsx', '.ts', '.js'],
        },
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.plugins.push(
      new ChromeExtensionReloader({
        entries: {
          contentScript: ['app', 'content'],
          background: ['background'],
        },
      }),
    );
  }
  return config;
};

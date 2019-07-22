const path = require('path');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

const config = {
  entry: {
    main: './extension/index.js',
    background: './extension/background.js',
  },
  output: {
    path: path.resolve(__dirname, 'extension/dist'),
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
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  plugins: [],
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.plugins.push(new ChromeExtensionReloader());
  }
  return config;
};

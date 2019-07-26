const path = require('path');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

const config = {
  entry: {
    app: './src/app/index.js',
    background: './src/extension/background.js',
  },
  output: {
    path: path.resolve(__dirname, 'src/extension/dist'),
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
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [],
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.plugins.push(
      new ChromeExtensionReloader({
        entries: {
          contentScript: ['app'],
          background: ['background'],
        },
      }),
    );
  }
  return config;
};

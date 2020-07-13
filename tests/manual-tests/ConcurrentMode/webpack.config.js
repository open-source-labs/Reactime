const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'Frontend', 'index.js'),
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'Frontend', 'public'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: [
      path.join(__dirname, 'Frontend', 'public'),
      path.resolve(__dirname, 'node_modules')
    ]
  }
};

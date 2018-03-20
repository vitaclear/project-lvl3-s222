var HTMLWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
  entry: './dist/index.js',
  output: {
    filename: 'index_bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: 'Add RSS',
      filename: 'index.html',
      template: './src/index.html',
    }),
  ],
};

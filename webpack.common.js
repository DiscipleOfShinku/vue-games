const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports =
{
  entry:
  {
    app: './src/index.js'
  },
  plugins:
  [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Vue games'
    })
  ],
  output:
  {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module:
  {
    rules:
    [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use:
        {
          loader: 'babel-loader',
          options:
          {
            presets:
            [
              'env',
            ]
          }
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/,
        use:
        [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.styl$/,
        use:
        [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ]
      },
    ]
  }
};

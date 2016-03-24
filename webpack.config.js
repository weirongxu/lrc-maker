var isProduction = process.env.NODE_ENV === 'production'
var path = require('path')

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: './main.js',
  output: {
    filename: 'main.js',
    path: './build/assets/',
    publicPath: isProduction ? './assets/' : '/assets/',
  },
  module: {
    preLoaders: [
      {
        test: /\.(vue|js)$/,
        loader: 'eslint',
        exclude: /(node_modules|bower_components)/,
      },
    ],
    loaders: [
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?[\s\S]+)?$/,
        loader: 'url',
        query: {
          limit: 1000,
        }
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0']
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue',
      },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
  },
}

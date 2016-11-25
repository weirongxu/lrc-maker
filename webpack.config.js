var path = require('path')

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: './main.js',
  output: {
    filename: 'main.js',
    path: './build/assets/',
  },
  module: {
    // preLoaders: [
    //   {
    //     test: /\.(vue|js)$/,
    //     loader: 'eslint',
    //     exclude: /(node_modules|bower_components)/,
    //   },
    // ],
    loaders: [
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?[\s\S]+)?$/,
        loader: 'url',
        query: {
          limit: 1000,
        }
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css', 'resolve-url']
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'resolve-url', 'sass?sourceMap']
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.(yml|yaml)$/,
        loaders: ['json', 'yaml'],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
      },
      {
        test: /\.vue$/,
        loader: 'vue',
      },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.vue', '.yml', '.scss'],
  },
  devtool: 'inline-source-map',
}

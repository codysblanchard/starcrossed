module.exports = {
  entry: './main.jsx',
  output: { path: __dirname+"public/", filename: 'bundle.js' },
  watch:true,
  watchOptions:{
    aggregateTimeout:300,
    poll:1000,
    ignored: /node_modules/
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.(s*)css$/,
        use:['style-loader','css-loader', 'sass-loader']
      }
    ]
  },
};

module.exports = {
  entry: './main.jsx',
  output: { path: __dirname, filename: 'bundle.js' },
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

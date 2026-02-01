const path = require('path');

module.exports = {
  entry: './src/sdk/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'puzzle-tool-sdk.js',
    library: 'PuzzleTool',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this'
  },
  mode: 'production',
  optimization: {
    minimize: true,
    usedExports: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  }
};
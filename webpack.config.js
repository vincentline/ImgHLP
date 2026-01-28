/**
 * Webpack配置文件
 */

const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  entry: {
    'puzzle-tool-sdk': './src/sdk/index.js',
    'puzzle-tool-sdk.min': './src/sdk/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: {
      name: 'PuzzleTool',
      type: 'umd',
      export: 'default',
      umdNamedDefine: true
    },
    globalObject: 'this',
    clean: true
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
  plugins: [
    // new ESLintPlugin()
  ],
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all'
    }
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'examples')
    },
    port: 8080,
    open: true
  },
  mode: 'production'
};

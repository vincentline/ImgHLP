/**
 * Webpack 构建配置文件
 * 统一构建项目中的多个模块到 docs/ 目录
 */

const path = require('path');
const webpack = require('webpack');

module.exports = {
  // 构建模式: production(压缩代码) / development(开发模式)
  mode: 'production',
  
  // 构建入口: 配置多个模块的入口点
  entry: {
    // 拼图工具 SDK 入口
    'imgassli/dist/puzzle-tool-sdk': './src/modules/imgassli/src/sdk/index.js',
    // 图片编辑器入口
    'image-edit/dist/bundle': './src/modules/image-edit/script.js'
  },
  
  // 构建输出配置
  output: {
    path: path.resolve(__dirname, 'docs'), // 输出根目录
    filename: '[name].js', // 输出文件名
    library: '[name.includes("imgassli") ? "PuzzleTool" : ""]', // 库名称配置
    libraryTarget: 'umd', // 支持 CommonJS, AMD 和全局变量
    globalObject: 'this' // 确保在不同环境中正确引用全局对象
  },
  
  // 模块处理规则
  module: {
    rules: [
      {
        test: /\.js$/, // 处理所有 .js 文件
        exclude: /node_modules/, // 排除 node_modules
        use: {
          loader: 'babel-loader', // 使用 babel-loader 转译 ES6+ 代码
          options: {
            presets: ['@babel/preset-env'] // 使用 @babel/preset-env 预设
          }
        }
      }
    ]
  },
  
  // 模块解析配置
  resolve: {
    extensions: ['.js'] // 自动解析的扩展名
  },
  
  // 优化配置
  optimization: {
    minimize: true // 压缩代码
  },
  
  // 插件配置
  plugins: [
    new webpack.ProgressPlugin() // 显示构建进度
  ]
};

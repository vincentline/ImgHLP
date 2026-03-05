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
    'image-edit/dist/bundle': './src/modules/image-edit/script.js',
    // PNG压缩工具入口
    'png-compress/dist/bundle': './src/modules/png-compress/index.js'
  },
  
  // 构建输出配置
  output: {
    path: path.resolve(__dirname, 'docs'), // 输出根目录
    filename: '[name].js', // 输出文件名
    publicPath: '/', // 公共路径，确保WASM文件正确引用
    globalObject: 'this', // 确保在不同环境中正确引用全局对象
    assetModuleFilename: 'assets/[name][ext]'
  },
  
  // 实验性功能
  experiments: {
    asyncWebAssembly: true,
    layers: true
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
      },
      {
        test: /\.wasm$/,
        type: 'asset/resource'
      }
    ]
  },
  
  // 模块解析配置
  resolve: {
    extensions: ['.js', '.wasm'], // 自动解析的扩展名
    fallback: {
      path: false,
      fs: false
    }
  },
  
  // 优化配置
  optimization: {
    minimize: true // 压缩代码
  },
  
  // 插件配置
  plugins: [
    new webpack.ProgressPlugin() // 显示构建进度
  ],
  
  // 性能提示配置
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};

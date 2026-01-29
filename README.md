# ImgHLP图片处理服务中心

## 项目简介

图片处理服务中心是一个集成多个图片处理功能的一站式工具集合，旨在提供简单易用的图片处理解决方案。

## 功能模块

### 1. 拼图工具 (imgassli)

**功能特性**：
- ✅ 支持多张图片合并为拼图
- ✅ 生成Alpha通道图
- ✅ 生成位置信息文件
- ✅ 支持将拼图切割回多张原始图片
- ✅ 支持多种图片源格式（File、Blob、DataURL）
- ✅ 跨平台兼容（浏览器、Node.js）
- ✅ 简单易用的API接口

**使用方法**：
1. 进入 `pages/imgassli/index.html` 页面
2. 选择要合并的图片
3. 点击"合并图片"按钮
4. 查看生成的拼图、Alpha通道图和位置信息
5. 点击"切割图片"按钮可将拼图切割回原始图片

### 2. 图片编辑器 (img) - 开发中

**计划功能**：
- 基于Konva实现的图片编辑器
- 支持图片裁剪、调整、滤镜等功能
- 直观的用户界面
- 实时预览效果

### 3. 更多功能 - 规划中

未来将推出更多图片处理功能，敬请期待。

## 目录结构

```
ImgHLP/
├── public/              # 静态资源目录
│   ├── assets/          # 通用资源
│   │   ├── css/         # 样式文件
│   │   ├── js/          # 通用脚本
│   │   └── lib/         # 第三方库
│   └── common/          # 通用组件
├── pages/               # 功能页面目录
│   ├── imgassli/        # 拼图工具
│   │   ├── dist/        # 构建输出
│   │   ├── src/         # 源代码
│   │   │   ├── core/    # 核心功能
│   │   │   └── sdk/     # SDK
│   │   ├── examples/    # 示例
│   │   ├── index.html   # 页面入口
│   │   ├── package.json # 依赖配置
│   │   └── webpack.config.js # 构建配置
│   ├── img/             # 图片编辑器（预留）
│   └── ...              # 其他功能页面（预留）
├── index.html           # 根目录首页
├── INDEX.md             # 项目索引
├── README.md            # 项目说明
├── UPDATE_LOG.md        # 更新日志
├── .gitignore           # Git忽略文件
└── package.json         # 根目录依赖配置
```

## 快速开始

### 1. 访问首页

打开 `index.html` 文件，即可看到所有功能模块的入口链接。

### 2. 使用拼图工具

1. 从首页点击"拼图工具"进入
2. 或直接打开 `pages/imgassli/index.html`
3. 按照页面提示使用拼图功能

### 3. 构建拼图工具

进入拼图工具目录：

```bash
cd pages/imgassli
```

安装依赖：

```bash
npm install
```

构建项目：

```bash
# 开发环境构建
npm run build:dev

# 生产环境构建
npm run build:prod
```

## 技术栈

- **前端**：HTML5, CSS3, JavaScript (ES6+)
- **构建工具**：Webpack
- **第三方库**：无外部依赖，纯JavaScript实现
- **浏览器兼容**：
  - Chrome 60+
  - Firefox 55+
  - Safari 12+
  - Edge 79+

## 项目索引

详细的项目结构和文件索引请查看 `INDEX.md` 文件。

## 更新日志

详细的更新记录请查看 `UPDATE_LOG.md` 文件。

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 联系我们

如有任何问题或建议，敬请反馈。

---

**© 2026 图片处理服务中心**
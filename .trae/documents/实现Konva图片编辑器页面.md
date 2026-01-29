# 实现Konva图片编辑器页面

## 1. 目录结构

在现有目录结构基础上，创建以下目录和文件：

```
pages/
├── image-edit/            # 图片编辑器页面
│   ├── src/              # 源代码
│   │   ├── core/         # 核心功能
│   │   │   ├── canvas.js  # 画布管理
│   │   │   ├── layer.js   # 图层管理
│   │   │   ├── text.js    # 文字处理
│   │   │   └── export.js  # 导出功能
│   │   └── components/    # UI组件
│   │       ├── toolbar.js # 工具栏
│   │       ├── layers.js  # 图层面板
│   │       └── text-editor.js # 文字编辑器
│   ├── public/            # 静态资源
│   │   ├── css/           # 样式文件
│   │   └── js/            # 脚本文件
│   ├── index.html         # 页面入口
│   ├── package.json       # 依赖配置
│   ├── webpack.config.js  # 构建配置
│   └── script.js          # 主脚本
```

## 2. 依赖安装

在 `pages/image-edit` 目录下创建 `package.json` 文件，并安装以下依赖：

- konva：Canvas 2D绘图库
- react-konva：React 绑定的 Konva
- react：React 核心库
- react-dom：React DOM
- webpack：构建工具
- babel：JavaScript 编译器

## 3. 页面功能实现

### 3.1 画布管理
- 创建无限高宽的画布
- 实现工作区概念，默认500*500
- 支持修改工作区尺寸
- 导出时只导出工作区内容

### 3.2 图片编辑
- 支持打开或拖入文件进行编辑
- 支持多图片编辑
- 实现图层功能
- 支持对图片进行缩放、移动、旋转
- 支持改变图层位置
- 支持群组操作

### 3.3 文字编辑
- 支持输入文字
- 双击文字弹窗编辑文字
- 支持选择字号、字重、对齐方式
- 支持输入CSS样式实现复杂文字样式
- 点击确定应用到被双击的文字

### 3.4 UI界面
- 参考 `UI-DESIGN-SYSTEM.md` 中的设计规范
- 创建工具栏，包含常用编辑功能
- 创建图层面板，显示和管理所有图层
- 创建文字编辑器弹窗，用于编辑文字属性

## 4. 技术实现

### 4.1 核心技术
- 使用 Konva 库实现画布操作
- 使用 React 进行组件化开发
- 使用 Webpack 进行构建

### 4.2 关键功能
- 拖拽文件上传：使用 HTML5 Drag and Drop API
- 图层管理：使用 Konva 的 Layer 和 Group 类
- 文字编辑：使用自定义弹窗和 CSS 样式
- 导出功能：使用 Canvas 的 toDataURL 方法

## 5. 实现步骤

1. 创建目录结构
2. 安装依赖
3. 实现核心画布功能
4. 实现图片编辑功能
5. 实现文字编辑功能
6. 实现图层管理功能
7. 实现导出功能
8. 优化UI界面
9. 测试所有功能

## 6. 注意事项

- 确保与现有目录结构保持一致
- 参考 `UI-DESIGN-SYSTEM.md` 中的设计规范
- 确保所有功能都能正常工作
- 优化用户体验，确保操作流畅

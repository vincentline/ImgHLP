# 图片处理服务中心 - 项目索引

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

## 功能模块索引

### 1. 根目录首页
- **文件**：`index.html`
- **功能**：所有功能页面的入口，提供导航链接

### 2. 拼图工具 (imgassli)
- **目录**：`pages/imgassli/`
- **页面入口**：`pages/imgassli/index.html`
- **核心功能**：
  - 图片合并为拼图
  - 生成Alpha通道图
  - 生成位置信息文件
  - 拼图切割回原始图片
- **源代码**：
  - 核心逻辑：`pages/imgassli/src/core/`
  - SDK：`pages/imgassli/src/sdk/`
- **构建配置**：`pages/imgassli/webpack.config.js`
- **依赖配置**：`pages/imgassli/package.json`

### 3. 图片编辑器 (img) - 预留
- **目录**：`pages/img/`
- **状态**：开发中
- **计划功能**：基于Konva实现的图片编辑器，支持图片裁剪、调整、滤镜等功能

### 4. 未来功能 - 预留
- **目录**：`pages/` 下的其他子目录
- **状态**：规划中

## 静态资源

### 通用资源
- **目录**：`public/assets/`
- **第三方库**：`public/assets/lib/`

### 拼图工具资源
- **构建输出**：`pages/imgassli/dist/`
- **示例**：`pages/imgassli/examples/`

## 配置文件

| 文件             | 描述                 | 位置                      |
|-----------------|----------------------|---------------------------|
| package.json    | 根目录依赖配置       | `package.json`            |
| .gitignore      | Git忽略文件          | `.gitignore`              |
| UPDATE_LOG.md   | 更新日志             | `UPDATE_LOG.md`           |
| README.md       | 项目说明             | `README.md`               |
| INDEX.md        | 项目索引             | `INDEX.md`                |
| webpack.config.js | 拼图工具构建配置   | `pages/imgassli/webpack.config.js` |
| package.json    | 拼图工具依赖配置     | `pages/imgassli/package.json` |

## 快速导航

### 功能页面
- [首页](index.html)
- [拼图工具](pages/imgassli/index.html)
- [图片编辑器](pages/img/) - 开发中

### 开发相关
- [拼图工具构建](pages/imgassli/webpack.config.js)
- [拼图工具依赖](pages/imgassli/package.json)

## 注意事项

1. **路径引用**：所有页面内的路径引用都应使用相对路径，确保在不同环境下都能正常访问

2. **资源管理**：公共资源应放在 `public/assets/` 目录下，各功能模块的专属资源应放在对应模块目录下

3. **未来扩展**：新增功能模块时，应按照现有的目录结构规范创建新的子目录，并在 `INDEX.md` 中更新索引

4. **构建配置**：每个功能模块可以有自己的构建配置和依赖管理，确保模块间的独立性

## 更新记录

- **2026-01-29**：创建项目索引文件，初始化目录结构

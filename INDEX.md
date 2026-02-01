# ImgHLP图片处理服务中心 - 项目索引

## 目录结构

```
ImgHLP/
├── docs/               # 功能页面目录
│   ├── public/          # 静态资源目录
│   │   ├── assets/      # 通用资源
│   │   │   ├── css/     # 样式文件
│   │   │   ├── js/      # 通用脚本
│   │   │   └── lib/     # 第三方库
│   │   └── common/      # 通用组件
│   ├── auth/            # 登录认证
│   │   ├── login.html   # 登录页面
│   │   ├── styles.css   # 登录页面样式
│   │   └── header_logo_white.png # 登录页面logo
│   ├── imgassli/        # 拼图工具
│   │   ├── dist/        # 构建输出
│   │   ├── src/         # 源代码
│   │   │   ├── core/    # 核心功能
│   │   │   └── sdk/     # SDK
│   │   ├── examples/    # 示例
│   │   ├── index.html   # 页面入口
│   │   ├── package.json # 依赖配置
│   │   └── webpack.config.js # 构建配置
│   ├── index.html       # 首页
│   ├── img/             # 图片编辑器（预留）
│   └── ...              # 其他功能页面（预留）
├── 代码包/              # 云函数代码包
│   ├── merge/           # 合并图片云函数
│   ├── split/           # 切割图片云函数
│   └── serverless.yml   # Serverless配置
├── INDEX.md             # 项目索引
├── README.md            # 项目说明
├── UPDATE_LOG.md        # 更新日志
├── .gitignore           # Git忽略文件
├── 腾讯云部署方案.md     # 腾讯云部署方案
└── package.json         # 根目录依赖配置
```

## 功能模块索引

### 1. 根目录首页
- **文件**：`index.html`
- **功能**：所有功能页面的入口，提供导航链接
- **特点**：支持登录功能，登录后可返回首页

### 2. 认证模块 (auth)
- **目录**：`docs/auth/`
- **页面入口**：`docs/auth/login.html`
- **功能**：用户登录认证
- **特点**：
  - 支持模拟登录（开发环境）
  - 支持登录后返回来源页面
  - 集成腾讯云 CloudBase 认证（预留）

### 3. 拼图工具 (imgassli)
- **目录**：`docs/imgassli/`
- **页面入口**：`docs/imgassli/index.html`
- **核心功能**：
  - 图片合并为拼图
  - 生成Alpha通道图
  - 生成位置信息文件
  - 拼图切割回原始图片
- **技术特点**：
  - 集成云函数调用
  - 支持认证Token验证
  - 未登录时自动跳转到登录页面
- **源代码**：
  - 核心逻辑：`docs/imgassli/src/core/`
  - SDK：`docs/imgassli/src/sdk/`（包含API服务层）
- **构建配置**：`docs/imgassli/webpack.config.js`
- **依赖配置**：`docs/imgassli/package.json`

### 4. 云函数 (代码包)
- **目录**：`代码包/`
- **功能**：
  - 合并图片云函数：`代码包/merge/`
  - 切割图片云函数：`代码包/split/`
- **技术特点**：
  - 基于腾讯云函数（SCF）
  - 使用HTTP触发器
  - 集成CloudBase认证验证
  - 支持模拟Token验证（开发环境）

### 5. 图片编辑器 (img) - 预留
- **目录**：`docs/img/`
- **状态**：开发中
- **计划功能**：基于Konva实现的图片编辑器，支持图片裁剪、调整、滤镜等功能

### 6. 未来功能 - 预留
- **目录**：`docs/` 下的其他子目录
- **状态**：规划中

## 静态资源

### 通用资源
- **目录**：`docs/public/assets/`
- **第三方库**：`docs/public/assets/lib/`

### 拼图工具资源
- **构建输出**：`docs/imgassli/dist/`
- **示例**：`docs/imgassli/examples/`

## 配置文件

| 文件             | 描述                 | 位置                      |
|-----------------|----------------------|---------------------------|
| package.json    | 根目录依赖配置       | `package.json`            |
| .gitignore      | Git忽略文件          | `.gitignore`              |
| UPDATE_LOG.md   | 更新日志             | `UPDATE_LOG.md`           |
| README.md       | 项目说明             | `README.md`               |
| INDEX.md        | 项目索引             | `INDEX.md`                |
| webpack.config.js | 拼图工具构建配置   | `docs/imgassli/webpack.config.js` |
| package.json    | 拼图工具依赖配置     | `docs/imgassli/package.json` |

## 快速导航

### 功能页面
- [首页](index.html)
- [拼图工具](docs/imgassli/index.html)
- [图片编辑器](docs/img/) - 开发中

### 开发相关
- [拼图工具构建](docs/imgassli/webpack.config.js)
- [拼图工具依赖](docs/imgassli/package.json)

## 注意事项

1. **路径引用**：所有页面内的路径引用都应使用相对路径，确保在不同环境下都能正常访问

2. **资源管理**：公共资源应放在 `public/assets/` 目录下，各功能模块的专属资源应放在对应模块目录下

3. **未来扩展**：新增功能模块时，应按照现有的目录结构规范创建新的子目录，并在 `INDEX.md` 中更新索引

4. **构建配置**：每个功能模块可以有自己的构建配置和依赖管理，确保模块间的独立性

## 更新记录

- **2026-01-29**：创建项目索引文件，初始化目录结构

# ImgHLP图片处理服务中心 - 项目索引

## 目录结构

```
ImgHLP/
├── src/                # 源代码
│   ├── modules/        # 功能模块
│   │   ├── auth/       # 登录系统
│   │   ├── imgassli/   # 拼图工具
│   │   └── image-edit/ # 图片编辑器
│   └── common/         # 公共组件和API服务
├── docs/               # 构建产物和发布目录
│   ├── auth/           # 构建后的登录系统
│   ├── imgassli/       # 构建后的拼图工具
│   ├── image-edit/     # 构建后的图片编辑器
│   ├── imgassli-sdk/   # 拼图工具SDK构建产物
│   ├── common/         # 公共API服务
│   └── index.html      # 项目主页
├── 代码包/              # 云函数代码包
│   ├── merge/           # 合并图片云函数
│   ├── split/           # 切割图片云函数
│   └── serverless.yml   # Serverless配置
├── index.html           # 根目录首页
├── INDEX.md             # 项目索引
├── README.md            # 项目说明
├── UPDATE_LOG.md        # 更新日志
├── .gitignore           # Git忽略文件
├── webpack.config.js    # 构建配置
├── 腾讯云部署方案.md     # 腾讯云部署方案
└── package.json         # 根目录依赖配置
```

## 功能模块索引

### 1. 根目录首页
- **文件**：`index.html`
- **功能**：所有功能页面的入口，提供导航链接
- **特点**：支持登录功能，登录后可返回首页

### 2. 认证模块 (auth)
- **源代码目录**：`src/modules/auth/`
- **构建产物目录**：`docs/auth/`
- **页面入口**：`docs/auth/login.html`
- **功能**：用户登录认证
- **特点**：
  - 支持模拟登录（开发环境）
  - 支持跨域登录后返回来源页面
  - 集成腾讯云 CloudBase 认证（预留）

### 3. 拼图工具 (imgassli)
- **源代码目录**：`src/modules/imgassli/`
- **构建产物目录**：`docs/imgassli/`
- **SDK构建产物目录**：`docs/imgassli-sdk/`
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
  - 支持跨域调用
- **源代码**：
  - 核心逻辑：`src/modules/imgassli/src/core/`
  - SDK：`src/modules/imgassli/src/sdk/`

### 4. 图片编辑器 (image-edit)
- **源代码目录**：`src/modules/image-edit/`
- **构建产物目录**：`docs/image-edit/`
- **页面入口**：`docs/image-edit/index.html`
- **核心功能**：
  - 基于Konva的图片编辑器
  - 支持图层管理
  - 支持文本添加
  - 支持图片导出
- **技术特点**：
  - 集成云函数调用
  - 支持认证Token验证
  - 未登录时自动跳转到登录页面

### 5. 公共API服务 (common)
- **源代码目录**：`src/common/`
- **构建产物目录**：`docs/common/`
- **核心功能**：
  - 统一的API服务模块
  - 跨域认证处理
  - 云函数调用封装
  - 登录状态管理
- **技术特点**：
  - 支持跨域调用
  - 统一的错误处理
  - 模块化设计

### 6. 云函数 (代码包)
- **目录**：`代码包/`
- **功能**：
  - 合并图片云函数：`代码包/merge/`
  - 切割图片云函数：`代码包/split/`
- **技术特点**：
  - 基于腾讯云函数（SCF）
  - 使用HTTP触发器
  - 集成CloudBase认证验证
  - 支持模拟Token验证（开发环境）

### 7. 未来功能 - 预留
- **目录**：`src/modules/` 下的其他子目录
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

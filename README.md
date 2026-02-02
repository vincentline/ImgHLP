# ImgHLP图片处理服务中心

## 项目简介

图片处理服务中心是一个集成多个图片处理功能的一站式工具集合，旨在提供简单易用的图片处理解决方案。项目已集成腾讯云函数和认证系统，实现了前后端分离的架构。

## 技术栈

- **前端框架**：Vue.js 2.6.14  
- **后端服务**：腾讯云函数（SCF）  
- **触发方式**：HTTP触发器  
- **图片处理库**：HTML5 Canvas、Sharp.js（云函数）  
- **部署平台**：Tencent CloudBase  
- **认证**：腾讯云 CloudBase 认证  
- **构建工具**：Webpack  
- **依赖**：Buffer.js（用于 Base64 转换）  
- **开发环境**：模拟登录系统

## 功能模块

### 1. 认证模块 (auth)

**功能特性**：
- ✅ 用户登录认证
- ✅ 支持模拟登录（开发环境）
- ✅ 支持登录后返回来源页面
- ✅ 集成腾讯云 CloudBase 认证（预留）

**使用方法**：
1. 从首页或其他页面点击"登录"按钮
2. 输入任意用户名和密码
3. 登录成功后自动返回之前访问的页面

### 2. 拼图工具 (imgassli)

**功能特性**：
- ✅ 支持多张图片合并为拼图
- ✅ 生成Alpha通道图
- ✅ 生成位置信息文件
- ✅ 支持将拼图切割回多张原始图片
- ✅ 支持多种图片源格式（File、Blob、DataURL）
- ✅ 集成云函数调用
- ✅ 支持认证Token验证
- ✅ 未登录时自动跳转到登录页面

**使用方法**：
1. 从首页点击"拼图工具"进入
2. 或直接打开 `docs/imgassli/index.html`
3. 未登录时会自动跳转到登录页面
4. 登录后返回拼图工具页面
5. 选择要合并的图片
6. 点击"合并图片"按钮（调用云函数处理）
7. 查看生成的拼图、Alpha通道图和位置信息
8. 点击"切割图片"按钮可将拼图切割回原始图片（调用云函数处理）

### 3. 云函数服务

**功能特性**：
- ✅ 合并图片云函数
- ✅ 切割图片云函数
- ✅ 基于腾讯云函数（SCF）
- ✅ 使用HTTP触发器
- ✅ 集成CloudBase认证验证
- ✅ 支持模拟Token验证（开发环境）
- ✅ 高性能图片处理（使用Sharp.js）

**部署位置**：`代码包/` 目录

### 4. 图片编辑器 (img) - 开发中

**计划功能**：
- 基于Konva实现的图片编辑器
- 支持图片裁剪、调整、滤镜等功能
- 直观的用户界面
- 实时预览效果

### 5. 更多功能 - 规划中

未来将推出更多图片处理功能，敬请期待。

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

## 快速开始

### 1. 访问首页

打开 `index.html` 文件，即可看到所有功能模块的入口链接。

### 2. 使用拼图工具

1. 从首页点击"拼图工具"进入
2. 或直接打开 `docs/imgassli/index.html`
3. 未登录时会自动跳转到登录页面
4. 输入任意用户名和密码登录
5. 登录后返回拼图工具页面
6. 选择要合并的图片
7. 点击"合并图片"按钮（调用云函数处理）
8. 查看生成的拼图、Alpha通道图和位置信息
9. 点击"切割图片"按钮可将拼图切割回原始图片（调用云函数处理）

### 3. 构建项目

在项目根目录执行：

安装依赖：

```bash
npm install
```

构建项目：

```bash
# 构建所有模块
npm run build

# 开发模式构建
npm run build:dev

# 生产模式构建
npm run build:prod
```

构建产物将生成到 `docs/` 目录中。

### 4. 部署云函数

1. **配置云函数**：
   - 进入 `代码包/` 目录
   - 修改 `merge/index.js` 和 `split/index.js` 中的 CloudBase 环境 ID

2. **部署到腾讯云**：
   - 登录腾讯云控制台
   - 进入云函数服务
   - 创建 HTTP 函数
   - 上传代码包
   - 配置 HTTP 触发器

3. **配置前端**：
   - 修改 `src/common/api.js` 中的云函数 URL

### 5. 测试认证功能

1. **清除登录状态**：打开浏览器开发者工具，清除 localStorage
2. **访问需要认证的页面**：如 `docs/imgassli/index.html`
3. **自动跳转**：页面会自动跳转到登录页面
4. **登录测试**：输入任意用户名和密码登录
5. **验证跳转**：登录成功后会返回之前访问的页面

### 6. 测试跨域登录

1. **创建测试页面**：在项目根目录创建 `test-cross-domain.html`
2. **访问测试页面**：打开 `http://localhost:8080/test-cross-domain.html`
3. **点击登录**：点击"去登录"按钮
4. **登录测试**：输入任意用户名和密码登录
5. **验证跨域**：登录成功后会返回测试页面，并显示登录成功信息
6. **测试图片处理**：选择图片并点击"测试合并图片"按钮

### 7. 跨域集成指南

**目标页面集成步骤**：

1. **添加API服务引用**：
   ```html
   <script src="https://your-domain.com/common/api.js"></script>
   ```

2. **处理登录回调**：
   ```javascript
   window.onload = function() {
     if (ApiService.handleLoginCallback()) {
       console.log('登录成功！');
     }
   };
   ```

3. **检查登录状态**：
   ```javascript
   if (!ApiService.isLoggedIn()) {
     ApiService.redirectToLogin();
   }
   ```

4. **调用图片处理API**：
   ```javascript
   // 合并图片
   const result = await ApiService.merge(images);
   
   // 切割图片
   const result = await ApiService.split(mergedImage, positionData);
   ```

### 8. 配置生产环境

1. **替换环境 ID**：将所有代码中的 `你的环境ID` 替换为实际的 CloudBase 环境 ID
2. **配置云函数 URL**：替换 `src/common/api.js` 中的云函数 URL
3. **启用真实认证**：在云函数中启用 CloudBase 真实认证验证
4. **部署前端**：将前端代码部署到静态网站托管服务

### 9. 开发环境说明

- **模拟登录**：开发环境下使用模拟登录，输入任意用户名和密码即可
- **模拟 Token**：云函数会接受以 `mock-token-` 开头的 Token
- **日志输出**：控制台会输出相关日志，方便调试
- **CORS 处理**：云函数已配置 CORS 头，支持跨域请求

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

私有仓库

## 贡献

欢迎提交Issue和Pull Request！

## 联系我们

如有任何问题或建议，敬请反馈。

---

**© 2026 图片处理服务中心**
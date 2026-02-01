# 云函数代码包说明

## 项目结构

```
代码包/
├── merge/              # 图片合并云函数
│   ├── index.js        # 函数入口
│   ├── package.json    # 依赖配置
│   └── scf_bootstrap   # HTTP函数启动脚本
├── split/              # 图片切割云函数
│   ├── index.js        # 函数入口
│   ├── package.json    # 依赖配置
│   └── scf_bootstrap   # HTTP函数启动脚本
├── serverless.yml      # Serverless配置
└── README.md           # 说明文档
```

## 功能说明

### 1. 图片合并函数（merge）
- **功能**：合并多张图片为拼图，生成Alpha通道图和位置信息
- **输入**：多张图片文件（multipart/form-data）
- **输出**：包含拼图、Alpha通道图和位置信息的JSON

### 2. 图片切割函数（split）
- **功能**：将拼图切割回原始图片
- **输入**：拼图图片和位置信息
- **输出**：切割后的图片数组

## 部署步骤

### 方法1：使用Serverless Framework

1. **安装Serverless Framework**：
   ```bash
   npm install -g serverless
   ```

2. **配置腾讯云凭证**：
   ```bash
   serverless config provider --key <SecretId> --secret <SecretKey> -p tencent
   ```

3. **部署云函数**：
   ```bash
   cd 代码包
   serverless deploy
   ```

### 方法2：使用腾讯云控制台

1. **创建云函数**：
   - 登录腾讯云控制台，进入云函数服务
   - 创建"imgassli-merge"函数（Node.js 16.x）
   - 创建"imgassli-split"函数（Node.js 16.x）

2. **上传代码**：
   - 分别将merge和split目录的代码上传
   - 自动安装依赖

3. **配置API网关**：
   - 创建API服务
   - 配置路由和认证
   - 发布API

## 依赖项

| 依赖 | 版本 | 用途 |
|------|------|------|
| sharp | ^0.32.0 | 高性能图片处理 |

## 注意事项

1. **scf_bootstrap文件**：
   - 这是腾讯云HTTP函数必需的启动脚本
   - 确保文件存在且有执行权限
   - 用于指定如何启动和运行Node.js代码

2. **文件解析**：
   - 代码中的文件解析函数为模拟实现
   - 生产环境中建议使用busboy等成熟库

3. **性能优化**：
   - 建议设置内存为1024MB-2048MB
   - 超时时间设置为30-60秒

4. **安全性**：
   - 所有API调用必须使用HTTPS
   - 建议配置API网关认证

5. **错误处理**：
   - 代码包含基本错误处理
   - 生产环境中建议增强错误日志

## 测试

1. **本地测试**：
   ```bash
   cd 代码包/merge
   npm install
   node -e "require('./index.js').main({ headers: { 'content-type': 'multipart/form-data' }, body: '' }, {})"
   ```

2. **线上测试**：
   - 使用Postman或curl调用API
   - 上传图片文件测试合并功能
   - 使用拼图和位置信息测试切割功能

## 版本信息

- **版本**：v1.0.0
- **更新日期**：2026-02-01
- **适用环境**：腾讯云云函数 Node.js 16.x

## 参考文档

- [腾讯云云函数文档](https://cloud.tencent.com/document/product/583)
- [API网关文档](https://cloud.tencent.com/document/product/628)
- [Sharp图片处理库文档](https://sharp.pixelplumbing.com/)

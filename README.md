# 拼图工具SDK

拼图工具SDK是一个JavaScript库，提供图片拼图和切割功能，支持将多张图片合并为一张拼图，以及将拼图切割回多张原始图片。

## 功能特性

- ✅ 支持多张图片合并为拼图
- ✅ 生成Alpha通道图
- ✅ 生成位置信息文件
- ✅ 支持将拼图切割回多张原始图片
- ✅ 支持多种图片源格式（File、Blob、DataURL）
- ✅ 跨平台兼容（浏览器、Node.js）
- ✅ 简单易用的API接口

## 安装

### NPM

```bash
npm install puzzle-tool-sdk
```

### Yarn

```bash
yarn add puzzle-tool-sdk
```

### CDN

```html
<script src="https://cdn.example.com/puzzle-tool-sdk.min.js"></script>
```

## 使用方法

### ES Modules

```javascript
import PuzzleTool from 'puzzle-tool-sdk';

// 合并图片
const result = await PuzzleTool.merge([image1, image2, image3]);

// 切割图片
const cutImages = await PuzzleTool.split(mergedImage, positionData);
```

### CommonJS

```javascript
const PuzzleTool = require('puzzle-tool-sdk');

// 合并图片
const result = await PuzzleTool.merge([image1, image2, image3]);

// 切割图片
const cutImages = await PuzzleTool.split(mergedImage, positionData);
```

### 浏览器全局变量

```javascript
// 合并图片
const result = await PuzzleTool.merge([image1, image2, image3]);

// 切割图片
const cutImages = await PuzzleTool.split(mergedImage, positionData);
```

## API接口

### PuzzleTool.merge(images)

合并多张图片为拼图。

**参数**：
- `images`：Array - 图片源数组，每个元素可以是File、Blob或DataURL

**返回值**：
- Promise<Object> - 包含拼图、Alpha图和位置信息的对象
  - `mergedImage`：Blob - 拼图图片
  - `alphaImage`：Blob - Alpha通道图
  - `positionData`：Object - 位置信息

**示例**：

```javascript
const images = [
  // File对象
  document.querySelector('input[type="file"]').files[0],
  // Blob对象
  new Blob(['image data'], { type: 'image/png' }),
  // DataURL
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
];

try {
  const result = await PuzzleTool.merge(images);
  
  // 处理拼图
  const mergedUrl = URL.createObjectURL(result.mergedImage);
  document.querySelector('#mergedImage').src = mergedUrl;
  
  // 处理Alpha通道图
  const alphaUrl = URL.createObjectURL(result.alphaImage);
  document.querySelector('#alphaImage').src = alphaUrl;
  
  // 处理位置信息
  console.log('Position data:', result.positionData);
} catch (error) {
  console.error('Merge failed:', error);
}
```

### PuzzleTool.split(mergedImage, positionData)

切割拼图为多张原始图片。

**参数**：
- `mergedImage`：File|Blob|string - 拼图图片
- `positionData`：Object - 位置信息

**返回值**：
- Promise<Array> - 切割后的图片数组，每个元素包含：
  - `filename`：string - 文件名
  - `image`：Blob - 切割后的图片

**示例**：

```javascript
const mergedImage = document.querySelector('#mergedImage').src;
const positionData = {
  canvasSize: { width: 335, height: 335 },
  images: [
    {
      filename: 'image_0.png',
      position: { x: 10, y: 10 },
      size: { width: 158, height: 316 }
    },
    {
      filename: 'image_1.png',
      position: { x: 178, y: 10 },
      size: { width: 157, height: 316 }
    }
  ]
};

try {
  const cutImages = await PuzzleTool.split(mergedImage, positionData);
  
  // 处理切割后的图片
  cutImages.forEach((item, index) => {
    const url = URL.createObjectURL(item.image);
    const img = document.createElement('img');
    img.src = url;
    img.alt = item.filename;
    document.querySelector('#cutImages').appendChild(img);
  });
} catch (error) {
  console.error('Split failed:', error);
}
```

## 错误处理

SDK会在以下情况下抛出错误：

- 输入参数无效
- 图片加载失败
- 图片处理失败
- 切割失败

建议使用try-catch捕获错误：

```javascript
try {
  const result = await PuzzleTool.merge(images);
  // 处理结果
} catch (error) {
  console.error('Error:', error.message);
}
```

## 示例

### 示例1：基本使用

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>拼图工具示例</title>
  <script src="dist/puzzle-tool-sdk.min.js"></script>
</head>
<body>
  <h1>拼图工具示例</h1>
  
  <h2>1. 选择图片</h2>
  <input type="file" id="fileInput" accept=".png" multiple>
  <button id="mergeBtn">合并图片</button>
  
  <h2>2. 结果预览</h2>
  <div id="result">
    <h3>拼图</h3>
    <img id="mergedImage" alt="拼图">
    
    <h3>Alpha通道图</h3>
    <img id="alphaImage" alt="Alpha通道图">
    
    <h3>位置信息</h3>
    <pre id="positionData"></pre>
  </div>
  
  <h2>3. 切割图片</h2>
  <button id="splitBtn">切割图片</button>
  
  <h3>切割结果</h3>
  <div id="cutImages"></div>
  
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      let mergedResult = null;
      
      // 合并按钮点击事件
      document.getElementById('mergeBtn').addEventListener('click', async function() {
        const files = document.getElementById('fileInput').files;
        if (files.length === 0) {
          alert('请选择图片');
          return;
        }
        
        try {
          // 合并图片
          mergedResult = await PuzzleTool.merge(Array.from(files));
          
          // 显示拼图
          const mergedUrl = URL.createObjectURL(mergedResult.mergedImage);
          document.getElementById('mergedImage').src = mergedUrl;
          
          // 显示Alpha通道图
          const alphaUrl = URL.createObjectURL(mergedResult.alphaImage);
          document.getElementById('alphaImage').src = alphaUrl;
          
          // 显示位置信息
          document.getElementById('positionData').textContent = JSON.stringify(mergedResult.positionData, null, 2);
          
          alert('合并成功！');
        } catch (error) {
          console.error('合并失败:', error);
          alert('合并失败：' + error.message);
        }
      });
      
      // 切割按钮点击事件
      document.getElementById('splitBtn').addEventListener('click', async function() {
        if (!mergedResult) {
          alert('请先合并图片');
          return;
        }
        
        try {
          // 切割图片
          const cutImages = await PuzzleTool.split(mergedResult.mergedImage, mergedResult.positionData);
          
          // 显示切割结果
          const cutImagesContainer = document.getElementById('cutImages');
          cutImagesContainer.innerHTML = '';
          
          cutImages.forEach((item, index) => {
            const url = URL.createObjectURL(item.image);
            const img = document.createElement('img');
            img.src = url;
            img.alt = item.filename;
            img.style.margin = '10px';
            cutImagesContainer.appendChild(img);
          });
          
          alert('切割成功！');
        } catch (error) {
          console.error('切割失败:', error);
          alert('切割失败：' + error.message);
        }
      });
    });
  </script>
</body>
</html>
```

### 示例2：React使用

```jsx
import React, { useState } from 'react';
import PuzzleTool from 'puzzle-tool-sdk';

function App() {
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [cutImages, setCutImages] = useState([]);
  
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };
  
  const handleMerge = async () => {
    try {
      const mergedResult = await PuzzleTool.merge(files);
      setResult(mergedResult);
      setCutImages([]);
    } catch (error) {
      console.error('Merge failed:', error);
    }
  };
  
  const handleSplit = async () => {
    if (!result) return;
    
    try {
      const images = await PuzzleTool.split(result.mergedImage, result.positionData);
      setCutImages(images);
    } catch (error) {
      console.error('Split failed:', error);
    }
  };
  
  return (
    <div>
      <h1>拼图工具</h1>
      
      <input type="file" multiple accept=".png" onChange={handleFileChange} />
      <button onClick={handleMerge}>合并图片</button>
      
      {result && (
        <div>
          <h2>合并结果</h2>
          <img src={URL.createObjectURL(result.mergedImage)} alt="拼图" />
          <img src={URL.createObjectURL(result.alphaImage)} alt="Alpha通道图" />
          <pre>{JSON.stringify(result.positionData, null, 2)}</pre>
          <button onClick={handleSplit}>切割图片</button>
        </div>
      )}
      
      {cutImages.length > 0 && (
        <div>
          <h2>切割结果</h2>
          {cutImages.map((item, index) => (
            <img key={index} src={URL.createObjectURL(item.image)} alt={item.filename} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
```

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 技术依赖

- 无外部依赖，纯JavaScript实现
- 支持浏览器内置的Canvas API

## 开发

### 安装依赖

```bash
npm install
```

### 构建

```bash
# 开发环境构建
npm run build:dev

# 生产环境构建
npm run build:prod
```

### 开发服务器

```bash
npm run dev
```

### 代码检查

```bash
npm run lint
```

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 更新日志

### v1.0.0

- ✨ 初始版本
- ✅ 支持图片拼图功能
- ✅ 支持图片切割功能
- ✅ 生成Alpha通道图
- ✅ 生成位置信息文件
- ✅ 支持多种图片源格式
- ✅ 跨平台兼容

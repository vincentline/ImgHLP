// 图片合并云函数
const sharp = require('sharp');

// 验证认证token
async function verifyToken(token) {
  try {
    // 开发环境：接受模拟token
    if (token.startsWith('mock-token-')) {
      console.log('使用模拟token验证');
      return { user: { username: 'mock-user' } };
    }
    
    // 生产环境：这里可以替换为阿里云RAM或其他认证方式
    // 暂时使用简单的token验证
    if (!token || token.length < 8) {
      throw new Error('认证失败');
    }
    return { user: { username: 'authenticated-user' } };
  } catch (error) {
    throw new Error('认证失败');
  }
}

// 配置
const CONFIG = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGES: 10,
  DEFAULT_QUALITY: 80
};

// 处理CORS
function handleCORS(response) {
  response.headers = {
    ...response.headers,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
  return response;
}

// 解析Base64图片
function decodeBase64Image(dataString) {
  const matches = dataString.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) {
    throw new Error('无效的图片数据格式');
  }
  return {
    type: matches[1],
    buffer: Buffer.from(matches[2], 'base64')
  };
}

// 合并图片
async function mergeImages(images) {
  console.log(`开始合并 ${images.length} 张图片`);
  
  // 验证图片数量
  if (images.length === 0) {
    throw new Error('至少需要一张图片');
  }
  if (images.length > CONFIG.MAX_IMAGES) {
    throw new Error(`最多支持 ${CONFIG.MAX_IMAGES} 张图片`);
  }
  
  // 解析所有图片
  const imageBuffers = [];
  let maxWidth = 0;
  let totalHeight = 0;
  
  for (let i = 0; i < images.length; i++) {
    const imageData = images[i];
    console.log(`处理第 ${i + 1} 张图片: ${imageData.name}`);
    
    // 解析Base64
    const decoded = decodeBase64Image(imageData.image);
    
    // 验证图片大小
    if (decoded.buffer.length > CONFIG.MAX_IMAGE_SIZE) {
      throw new Error(`图片 ${imageData.name} 大小超过限制`);
    }
    
    // 获取图片信息
    const metadata = await sharp(decoded.buffer).metadata();
    imageBuffers.push({
      buffer: decoded.buffer,
      width: metadata.width,
      height: metadata.height,
      name: imageData.name
    });
    
    // 计算最大宽度和总高度
    maxWidth = Math.max(maxWidth, metadata.width);
    totalHeight += metadata.height;
  }
  
  console.log(`合并参数: 宽度=${maxWidth}, 高度=${totalHeight}`);
  
  // 创建空白画布
  const canvas = sharp({
    create: {
      width: maxWidth,
      height: totalHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  });
  
  // 合成图片
  let currentY = 0;
  const positionData = [];
  
  for (let i = 0; i < imageBuffers.length; i++) {
    const img = imageBuffers[i];
    const x = Math.floor((maxWidth - img.width) / 2); // 水平居中
    
    canvas.composite([{
      input: img.buffer,
      left: x,
      top: currentY
    }]);
    
    // 记录位置信息
    positionData.push({
      index: i,
      name: img.name,
      x: x,
      y: currentY,
      width: img.width,
      height: img.height
    });
    
    currentY += img.height;
  }
  
  // 输出合并后的图片
  const mergedBuffer = await canvas.png({ quality: CONFIG.DEFAULT_QUALITY }).toBuffer();
  const mergedBase64 = `data:image/png;base64,${mergedBuffer.toString('base64')}`;
  
  // 创建透明背景的alpha通道图片
  const alphaBuffer = await sharp({
    create: {
      width: maxWidth,
      height: totalHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  }).png().toBuffer();
  const alphaBase64 = `data:image/png;base64,${alphaBuffer.toString('base64')}`;
  
  console.log('图片合并完成');
  return {
    mergedImage: mergedBase64,
    alphaImage: alphaBase64,
    positionData
  };
}

// 主处理函数
exports.handler = async (event, context) => {
  console.log('=== 图片合并函数被调用 ===');
  console.log('Event:', JSON.stringify(event, null, 2));
  
  // 阿里云FC HTTP触发器格式适配
  let httpMethod = event.httpMethod || event.method || 'POST';
  let headers = event.headers || {};
  let body = event.body || '';
  let isBase64Encoded = event.isBase64Encoded || false;
  
  // 处理OPTIONS请求
  if (httpMethod === 'OPTIONS') {
    console.log('处理OPTIONS请求');
    return handleCORS({
      statusCode: 204,
      body: ''
    });
  }
  
  // 只处理POST请求
  if (httpMethod !== 'POST') {
    console.log('处理非POST请求');
    return handleCORS({
      statusCode: 405,
      body: JSON.stringify({ success: false, message: '只支持POST请求' })
    });
  }
  
  try {
    // 验证认证token
    const authHeader = headers.authorization || headers.Authorization;
    if (!authHeader) {
      return handleCORS({
        statusCode: 401,
        body: JSON.stringify({ success: false, message: '缺少认证token' })
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    await verifyToken(token);
    console.log('认证成功');
    
    // 解析请求体
    let requestBody;
    if (isBase64Encoded) {
      requestBody = JSON.parse(Buffer.from(body, 'base64').toString('utf-8'));
    } else {
      try {
        requestBody = JSON.parse(body || '{}');
      } catch {
        requestBody = {};
      }
    }
    
    console.log('请求体:', JSON.stringify(requestBody, null, 2));
    
    // 验证参数
    if (!requestBody.images || !Array.isArray(requestBody.images)) {
      throw new Error('缺少images参数');
    }
    
    // 合并图片
    const result = await mergeImages(requestBody.images);
    
    console.log('处理成功，返回结果');
    return handleCORS({
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: '图片合并成功',
        data: result
      })
    });
    
  } catch (error) {
    console.error('处理失败:', error);
    // 区分认证错误和其他错误
    if (error.message === '认证失败') {
      return handleCORS({
        statusCode: 401,
        body: JSON.stringify({ success: false, message: error.message })
      });
    }
    return handleCORS({
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: error.message || '处理失败，请稍后重试'
      })
    });
  }
};
// 图片切割云函数
const sharp = require('sharp');

// 配置
const CONFIG = {
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_CUT_REGIONS: 20,
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

// 切割图片
async function splitImage(mergedImage, positionData) {
  console.log(`开始切割图片，共 ${positionData.length} 个区域`);
  
  // 验证参数
  if (!mergedImage) {
    throw new Error('缺少合并图片');
  }
  if (!positionData || positionData.length === 0) {
    throw new Error('缺少位置信息');
  }
  if (positionData.length > CONFIG.MAX_CUT_REGIONS) {
    throw new Error(`最多支持 ${CONFIG.MAX_CUT_REGIONS} 个切割区域`);
  }
  
  // 解析图片
  const decoded = decodeBase64Image(mergedImage);
  
  // 验证图片大小
  if (decoded.buffer.length > CONFIG.MAX_IMAGE_SIZE) {
    throw new Error('图片大小超过限制');
  }
  
  // 获取原图信息
  const metadata = await sharp(decoded.buffer).metadata();
  console.log(`原图信息: 宽度=${metadata.width}, 高度=${metadata.height}`);
  
  // 切割图片
  const cutImages = [];
  
  for (let i = 0; i < positionData.length; i++) {
    const item = positionData[i];
    console.log(`切割第 ${i + 1} 个区域: ${item.name || `region_${i}`}`);
    
    // 验证切割区域
    if (item.x < 0 || item.y < 0 || 
        item.width <= 0 || item.height <= 0 ||
        item.x + item.width > metadata.width ||
        item.y + item.height > metadata.height) {
      throw new Error(`区域 ${i} 超出图片范围`);
    }
    
    // 提取对应区域
    const cutBuffer = await sharp(decoded.buffer)
      .extract({
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height
      })
      .png({ quality: CONFIG.DEFAULT_QUALITY })
      .toBuffer();
    
    // 转换为Base64
    const base64Image = `data:image/png;base64,${cutBuffer.toString('base64')}`;
    
    cutImages.push({
      index: item.index || i,
      filename: item.name || `cut_${i}.png`,
      image: base64Image,
      width: item.width,
      height: item.height
    });
  }
  
  console.log('图片切割完成');
  return cutImages;
}

// 主处理函数
exports.main = async (event, context) => {
  console.log('=== 图片切割函数被调用 ===');
  console.log('Event:', JSON.stringify(event, null, 2));
  
  // 处理OPTIONS请求
  if (event.httpMethod === 'OPTIONS') {
    console.log('处理OPTIONS请求');
    return handleCORS({
      statusCode: 204,
      body: ''
    });
  }
  
  // 只处理POST请求
  if (event.httpMethod !== 'POST') {
    console.log('处理非POST请求');
    return handleCORS({
      statusCode: 405,
      body: JSON.stringify({ success: false, message: '只支持POST请求' })
    });
  }
  
  try {
    // 解析请求体
    let body;
    if (event.isBase64Encoded) {
      body = JSON.parse(Buffer.from(event.body, 'base64').toString('utf-8'));
    } else {
      body = JSON.parse(event.body || '{}');
    }
    
    console.log('请求体:', JSON.stringify(body, null, 2));
    
    // 验证参数
    if (!body.mergedImage || !body.positionData) {
      throw new Error('缺少mergedImage或positionData参数');
    }
    
    // 切割图片
    const cutImages = await splitImage(body.mergedImage, body.positionData);
    
    console.log('处理成功，返回结果');
    return handleCORS({
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: '图片切割成功',
        data: {
          cutImages
        }
      })
    });
    
  } catch (error) {
    console.error('处理失败:', error);
    return handleCORS({
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: error.message || '处理失败，请稍后重试'
      })
    });
  }
};
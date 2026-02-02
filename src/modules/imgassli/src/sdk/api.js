/**
 * API服务层
 * 处理与云函数的通信
 */

// 云函数配置
const CONFIG = {
  MERGE_API_URL: 'https://imghlp-5gh0mgfu98b71b4e-1258489735.ap-shanghai.app.tcloudbase.com/merge', // 替换为实际的合并函数HTTP触发地址
  SPLIT_API_URL: 'https://imghlp-5gh0mgfu98b71b4e-1258489735.ap-shanghai.app.tcloudbase.com/split' // 替换为实际的切割函数HTTP触发地址
};

/**
 * 调用云函数
 * @param {string} url - 云函数URL
 * @param {Object} data - 请求数据
 * @returns {Promise<Object>} - 响应结果
 */
async function callCloudFunction(url, data) {
  try {
    // 获取认证token
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('请先登录');
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // 添加认证头
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || '云函数调用失败');
    }

    return result.data;
  } catch (error) {
    console.error('云函数调用失败:', error);
    throw new Error(`API调用失败: ${error.message}`);
  }
}

/**
 * 将File/Blob转换为Base64
 * @param {File|Blob} file - 文件对象
 * @returns {Promise<string>} - Base64字符串
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * 将Base64转换为Blob
 * @param {string} base64 - Base64字符串
 * @returns {Blob} - Blob对象
 */
function base64ToBlob(base64) {
  const matches = base64.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) {
    throw new Error('无效的Base64格式');
  }
  
  const type = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  return new Blob([buffer], { type: `image/${type}` });
}

// API服务
const ApiService = {
  /**
   * 调用合并云函数
   * @param {Array} files - 文件数组
   * @returns {Promise<Object>} - 合并结果
   */
  async merge(files) {
    // 转换文件为Base64
    const images = await Promise.all(
      files.map(async (file, index) => ({
        name: file.name || `image_${index}.png`,
        image: await fileToBase64(file)
      }))
    );

    // 调用云函数
    const data = await callCloudFunction(CONFIG.MERGE_API_URL, { images });

    // 转换返回的Base64为Blob
    return {
      mergedImage: base64ToBlob(data.mergedImage),
      alphaImage: base64ToBlob(data.alphaImage),
      positionData: data.positionData
    };
  },

  /**
   * 调用切割云函数
   * @param {File|Blob} mergedImage - 合并图片
   * @param {Object} positionData - 位置数据
   * @returns {Promise<Array>} - 切割结果
   */
  async split(mergedImage, positionData) {
    // 转换文件为Base64
    const mergedImageBase64 = await fileToBase64(mergedImage);

    // 调用云函数
    const data = await callCloudFunction(CONFIG.SPLIT_API_URL, {
      mergedImage: mergedImageBase64,
      positionData: positionData
    });

    // 转换返回的Base64为Blob
    return data.cutImages.map(item => ({
      filename: item.filename,
      image: base64ToBlob(item.image)
    }));
  },

  /**
   * 检查用户是否登录
   * @returns {boolean} - 是否已登录
   */
  isLoggedIn() {
    return !!localStorage.getItem('authToken');
  },

  /**
   * 登出
   */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
  }
};

export default ApiService;

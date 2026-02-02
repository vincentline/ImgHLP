/**
 * 统一API服务模块
 * 处理与云函数的通信，支持跨域调用
 */

// 云函数配置
const CONFIG = {
  MERGE_API_URL: 'https://imghlp-5gh0mgfu98b71b4e-1258489735.ap-shanghai.app.tcloudbase.com/merge',
  SPLIT_API_URL: 'https://imghlp-5gh0mgfu98b71b4e-1258489735.ap-shanghai.app.tcloudbase.com/split'
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
  const buffer = Uint8Array.from(atob(matches[2]), c => c.charCodeAt(0));
  return new Blob([buffer], { type: `image/${type}` });
}

/**
 * 处理登录回调（从登录页返回时）
 * @returns {boolean} - 是否成功处理登录回调
 */
function handleLoginCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('authToken');
  const userInfo = urlParams.get('userInfo');
  
  if (token && userInfo) {
    // 存储 token 和用户信息到本地
    localStorage.setItem('authToken', token);
    localStorage.setItem('userInfo', userInfo);
    
    // 清理 URL 中的 token 参数（避免泄露）
    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete('authToken');
    cleanUrl.searchParams.delete('userInfo');
    window.history.replaceState({}, '', cleanUrl.toString());
    
    return true;
  }
  return false;
}

/**
 * 检查登录状态
 * @returns {boolean} - 是否已登录
 */
function checkLoginStatus() {
  const token = localStorage.getItem('authToken');
  return !!token;
}

/**
 * 重定向到登录页面
 * @param {string} returnUrl - 登录后返回的URL
 */
function redirectToLogin(returnUrl) {
  const currentUrl = returnUrl || encodeURIComponent(window.location.href);
  window.location.href = `auth/login.html?returnUrl=${currentUrl}`;
}

// API服务
const ApiService = {
  // 云函数调用
  merge: async function(images) {
    // 转换文件为Base64
    const imageData = await Promise.all(
      images.map(async (file, index) => ({
        name: file.name || `image_${index}.png`,
        image: await fileToBase64(file)
      }))
    );

    // 调用云函数
    const data = await callCloudFunction(CONFIG.MERGE_API_URL, { images: imageData });

    // 转换返回的Base64为Blob
    return {
      mergedImage: base64ToBlob(data.mergedImage),
      alphaImage: base64ToBlob(data.alphaImage),
      positionData: data.positionData
    };
  },

  split: async function(mergedImage, positionData) {
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

  // 登录相关
  isLoggedIn: checkLoginStatus,
  redirectToLogin: redirectToLogin,
  handleLoginCallback: handleLoginCallback,
  logout: function() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
  }
};

// 导出API服务
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApiService;
} else if (typeof window !== 'undefined') {
  window.ApiService = ApiService;
}

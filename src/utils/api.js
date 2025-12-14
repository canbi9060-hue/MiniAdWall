// API 配置
// 生产环境使用后端服务的完整 URL
// 开发环境使用 localhost
const getApiBaseUrl = () => {
  // 如果设置了环境变量，优先使用
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // 生产环境使用后端服务地址
  if (import.meta.env.PROD) {
    return 'https://server-m0xj7vgud-bc-82a48503.vercel.app/api';
  }
  // 开发环境使用 localhost
  return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

// 通用请求函数
async function request(url, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    // 检查响应是否成功
    if (!response.ok) {
      // 尝试解析错误信息
      let errorMessage = '请求失败';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = `请求失败: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API请求错误:', error);
    // 如果是网络错误，提供更友好的错误信息
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('无法连接到服务器，请检查网络连接或稍后重试');
    }
    throw error;
  }
}

// 广告API
export const adAPI = {
  // 获取广告列表
  async getAds(sortBy = 'ranking') {
    const response = await request(`/ads?sortBy=${sortBy}`);
    return response.data;
  },

  // 创建广告
  async createAd(adData) {
    const response = await request('/ads', {
      method: 'POST',
      body: adData,
    });
    return response.data;
  },

  // 更新广告
  async updateAd(id, adData) {
    const response = await request(`/ads/${id}`, {
      method: 'PUT',
      body: adData,
    });
    return response.data;
  },

  // 删除广告
  async deleteAd(id) {
    const response = await request(`/ads/${id}`, {
      method: 'DELETE',
    });
    return response;
  },

  // 点击广告（点击数+1）
  async incrementClick(id) {
    const response = await request(`/ads/${id}/click`, {
      method: 'POST',
    });
    return response.data;
  },

  // 获取表单配置
  async getFormConfig() {
    const response = await request('/form-config');
    return response.data;
  },
};


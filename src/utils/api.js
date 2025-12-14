// API 配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '请求失败');
    }

    return data;
  } catch (error) {
    console.error('API请求错误:', error);
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


// 文件上传工具函数
// 自动检测环境：生产环境使用环境变量，开发环境使用 localhost
const getApiBaseUrl = () => {
  // 如果设置了环境变量，优先使用
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // 生产环境（部署在 Vercel 等平台）
  if (import.meta.env.MODE === 'production' || window.location.hostname !== 'localhost') {
    // 默认使用后端服务地址（需要在 Vercel 环境变量中配置）
    return 'https://server-fr8ahc1rq-bc-82a48503.vercel.app/api';
  }
  
  // 开发环境
  return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

export const uploadAPI = {
  // 上传单个视频文件
  async uploadVideo(file) {
    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload/video`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '上传失败');
      }

      // 返回完整的URL（包含服务器地址）
      const baseUrl = API_BASE_URL.replace('/api', '') || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://server-fr8ahc1rq-bc-82a48503.vercel.app');
      return {
        ...data.data,
        fullUrl: `${baseUrl}${data.data.url}`
      };
    } catch (error) {
      console.error('视频上传错误:', error);
      throw error;
    }
  },

  // 上传多个视频文件
  async uploadVideos(files) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('videos', file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/upload/videos`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '上传失败');
      }

      // 返回完整的URL（包含服务器地址）
      const baseUrl = API_BASE_URL.replace('/api', '') || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://server-fr8ahc1rq-bc-82a48503.vercel.app');
      return data.data.map(file => ({
        ...file,
        fullUrl: `${baseUrl}${file.url}`
      }));
    } catch (error) {
      console.error('视频上传错误:', error);
      throw error;
    }
  }
};


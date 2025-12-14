// 文件上传工具函数
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (import.meta.env.PROD) {
    return 'https://server-m0xj7vgud-bc-82a48503.vercel.app/api';
  }
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
      const baseUrl = API_BASE_URL.replace('/api', '') || 'http://localhost:3001';
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
      const baseUrl = API_BASE_URL.replace('/api', '') || 'http://localhost:3001';
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


import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { adRouter } from './routes/ads.js';
import { uploadRouter } from './routes/upload.js';
import { formConfigRouter } from './routes/formConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
// CORS 配置：允许所有来源（生产环境建议配置具体域名）
app.use(cors({
  origin: function (origin, callback) {
    // 允许所有来源（包括无 origin 的请求，如 Postman）
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));

// 处理预检请求
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务 - 提供上传的视频文件访问
// Vercel 无法写入代码目录，使用 /tmp/uploads
app.use('/uploads', express.static(path.join('/tmp', 'uploads')));

// 路由
app.use('/api/ads', adRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/form-config', formConfigRouter);

// 健康检查（同时支持 /health 和 /api/health，便于 Vercel 路由）
app.get(['/health', '/api/health'], (req, res) => {
  res.json({ status: 'ok', message: 'Mini广告墙后端服务运行正常' });
});

// 启动服务器（仅本地开发时）
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
    console.log(`📡 API 地址: http://localhost:${PORT}/api/ads`);
  });
}

// 导出给 Vercel serverless 函数使用
export default app;


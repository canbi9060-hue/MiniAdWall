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

// CORS 配置 - 允许所有来源（生产环境）
const allowedOrigins = [
  'http://localhost:3000',
  'https://miniad.top',
  'https://www.miniad.top',
  // 允许所有 Vercel 域名
  /https:\/\/.*\.vercel\.app$/,
  /https:\/\/.*\.vercel\.app\/.*$/
];

app.use(cors({
  origin: function (origin, callback) {
    // 允许没有 origin 的请求（如移动应用、Postman 等）
    if (!origin) return callback(null, true);
    
    // 检查是否在允许列表中
    const isAllowed = allowedOrigins.some(pattern => {
      if (typeof pattern === 'string') {
        return pattern === origin;
      }
      return pattern.test(origin);
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      // 生产环境允许所有来源（临时方案，确保可以访问）
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务 - 提供上传的视频文件访问
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 路由
app.use('/api/ads', adRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/form-config', formConfigRouter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mini广告墙后端服务运行正常' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📡 API 地址: http://localhost:${PORT}/api/ads`);
});


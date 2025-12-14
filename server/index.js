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
app.use(cors());
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


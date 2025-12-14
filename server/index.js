import express from 'express';
import cors from 'cors';
import { adRouter } from './routes/ads.js';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/ads', adRouter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mini广告墙后端服务运行正常' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📡 API 地址: http://localhost:${PORT}/api/ads`);
});


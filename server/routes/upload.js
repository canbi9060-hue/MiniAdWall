import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// 确保上传目录存在
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 配置multer存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名：时间戳 + 原始文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// 文件过滤器：只允许视频文件
const fileFilter = (req, file, cb) => {
  const allowedTypes = /mp4|webm|ogg|mov|avi|mkv/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype) || file.mimetype.startsWith('video/');

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('只支持视频文件格式（mp4, webm, ogg, mov, avi, mkv）'), false);
  }
};

// 配置multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 限制文件大小为100MB
  },
  fileFilter: fileFilter
});

// 单文件上传
router.post('/video', upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '没有上传文件'
      });
    }

    // 返回文件访问URL
    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      message: '视频上传成功',
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '视频上传失败',
      error: error.message
    });
  }
});

// 多文件上传
router.post('/videos', upload.array('videos', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有上传文件'
      });
    }

    // 返回所有文件的访问URL
    const files = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size
    }));
    
    res.json({
      success: true,
      message: '视频上传成功',
      data: files
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '视频上传失败',
      error: error.message
    });
  }
});

export { router as uploadRouter };


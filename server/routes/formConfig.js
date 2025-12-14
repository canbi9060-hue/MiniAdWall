import express from 'express';

const router = express.Router();

// 获取表单配置
router.get('/', (req, res) => {
  try {
    // 表单配置JSON
    const formConfig = [
      {
        field: 'title',
        name: '广告标题',
        component: 'Input',
        type: 'text',
        required: true,
        placeholder: '请输入广告标题',
        validator: {
          maxLength: 50,
          minLength: 1
        }
      },
      {
        field: 'publisher',
        name: '发布人',
        component: 'Input',
        type: 'text',
        required: true,
        placeholder: '请输入发布人',
        validator: {
          maxLength: 50,
          minLength: 1
        }
      },
      {
        field: 'content',
        name: '内容文案',
        component: 'Textarea',
        type: 'textarea',
        required: true,
        placeholder: '请输入内容文案',
        rows: 4,
        validator: {
          maxLength: 1000,
          minLength: 1
        }
      },
      {
        field: 'landingPage',
        name: '落地页',
        component: 'Input',
        type: 'url',
        required: true,
        placeholder: '请输入落地页URL',
        validator: {
          url: true
        }
      },
      {
        field: 'pricing',
        name: '出价',
        component: 'Input',
        type: 'number',
        required: true,
        placeholder: '请输入出价',
        step: '0.01',
        min: 0,
        unit: '元',
        validator: {
          number: true,
          min: 0
        }
      },
      {
        field: 'videos',
        name: '上传视频',
        component: 'VideoUpload',
        type: 'video',
        required: true,
        multiple: true,
        validator: {
          url: true
        }
      }
    ];

    res.json({
      success: true,
      data: formConfig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取表单配置失败',
      error: error.message
    });
  }
});

export { router as formConfigRouter };


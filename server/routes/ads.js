import express from 'express';
import { AdService } from '../services/adService.js';
import { validateAdData } from '../utils/validation.js';

const router = express.Router();
const adService = new AdService();

// 获取广告列表（支持排序）
router.get('/', async (req, res) => {
  try {
    const { sortBy = 'ranking' } = req.query;
    const ads = await adService.getAds(sortBy);
    res.json({
      success: true,
      data: ads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取广告列表失败',
      error: error.message
    });
  }
});

// 创建广告
router.post('/', async (req, res) => {
  try {
    const validation = validateAdData(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    const ad = await adService.createAd(validation.data);

    res.status(201).json({
      success: true,
      message: '广告创建成功',
      data: ad
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建广告失败',
      error: error.message
    });
  }
});

// 更新广告
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validation = validateAdData(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    const ad = await adService.updateAd(id, validation.data);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: '广告不存在'
      });
    }

    res.json({
      success: true,
      message: '广告更新成功',
      data: ad
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新广告失败',
      error: error.message
    });
  }
});

// 删除广告
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await adService.deleteAd(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: '广告不存在'
      });
    }

    res.json({
      success: true,
      message: '广告删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除广告失败',
      error: error.message
    });
  }
});

// 点击广告（点击数+1）
router.post('/:id/click', async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await adService.incrementClick(id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: '广告不存在'
      });
    }

    res.json({
      success: true,
      message: '点击记录成功',
      data: ad
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '记录点击失败',
      error: error.message
    });
  }
});

export { router as adRouter };


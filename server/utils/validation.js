// 验证工具函数
export function validateAdData({ title, publisher, content, landingPage, pricing, videos }) {
  // 验证必填字段
  if (!title || !publisher || !content || !landingPage || pricing === undefined) {
    return { valid: false, message: '缺少必填字段' };
  }

  // 验证URL格式
  try {
    new URL(landingPage);
  } catch {
    return { valid: false, message: '落地页URL格式不正确' };
  }

  // 验证出价
  const pricingNum = parseFloat(pricing);
  if (isNaN(pricingNum) || pricingNum < 0) {
    return { valid: false, message: '出价必须是非负数' };
  }

  // 验证视频URL数组（可选）
  let videosArray = [];
  if (videos) {
    if (Array.isArray(videos)) {
      videosArray = videos;
    } else if (typeof videos === 'string') {
      // 如果是字符串，尝试解析为JSON或按逗号分割
      try {
        videosArray = JSON.parse(videos);
      } catch {
        videosArray = videos.split(',').map(v => v.trim()).filter(v => v);
      }
    }
    
    // 验证每个视频URL格式
    for (const video of videosArray) {
      if (video) {
        try {
          new URL(video);
        } catch {
          return { valid: false, message: `视频URL格式不正确: ${video}` };
        }
      }
    }
  }

  return { 
    valid: true, 
    data: {
      title: title.trim(),
      publisher: publisher.trim(),
      content: content.trim(),
      landingPage: landingPage.trim(),
      pricing: pricingNum,
      videos: videosArray.filter(v => v) // 过滤空值
    }
  };
}


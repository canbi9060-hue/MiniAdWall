// 验证工具函数
export function validateAdData({ title, publisher, content, landingPage, pricing }) {
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

  return { 
    valid: true, 
    data: {
      title: title.trim(),
      publisher: publisher.trim(),
      content: content.trim(),
      landingPage: landingPage.trim(),
      pricing: pricingNum
    }
  };
}


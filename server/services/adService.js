import { AdRepository } from '../repositories/adRepository.js';

export class AdService {
  constructor() {
    this.repository = new AdRepository();
    this.MYSTERY_FACTOR = 0.42;
  }

  // 计算竞价排名分数
  calculateRankingScore(ad) {
    return ad.pricing + (ad.pricing * (ad.clicked || 0) * this.MYSTERY_FACTOR);
  }

  // 获取广告列表（支持排序，优化：缓存排序函数）
  async getAds(sortBy = 'ranking') {
    const ads = await this.repository.getAllAds();
    
    // 定义排序函数映射
    const sortFunctions = {
      hotness: (a, b) => (b.clicked || 0) - (a.clicked || 0),
      pricing: (a, b) => b.pricing - a.pricing,
      ranking: (a, b) => {
        const scoreA = this.calculateRankingScore(a);
        const scoreB = this.calculateRankingScore(b);
        return scoreB - scoreA;
      }
    };

    const sortFn = sortFunctions[sortBy] || sortFunctions.ranking;
    return [...ads].sort(sortFn);
  }

  // 创建广告
  async createAd(adData) {
    const newAd = {
      id: Date.now().toString(),
      title: adData.title,
      publisher: adData.publisher,
      content: adData.content,
      landingPage: adData.landingPage,
      pricing: adData.pricing,
      videos: adData.videos || [],
      clicked: 0,
      createdAt: new Date().toISOString()
    };

    return await this.repository.addAd(newAd);
  }

  // 更新广告
  async updateAd(id, adData) {
    const existingAd = await this.repository.getAdById(id);
    if (!existingAd) {
      return null;
    }

    const updatedAd = {
      ...existingAd,
      title: adData.title,
      publisher: adData.publisher,
      content: adData.content,
      landingPage: adData.landingPage,
      pricing: adData.pricing,
      videos: adData.videos || [],
      updatedAt: new Date().toISOString()
    };

    return await this.repository.updateAd(id, updatedAd);
  }

  // 删除广告
  async deleteAd(id) {
    return await this.repository.deleteAd(id);
  }

  // 增加点击数
  async incrementClick(id) {
    const ad = await this.repository.getAdById(id);
    if (!ad) {
      return null;
    }

    const updatedAd = {
      ...ad,
      clicked: (ad.clicked || 0) + 1
    };

    return await this.repository.updateAd(id, updatedAd);
  }
}


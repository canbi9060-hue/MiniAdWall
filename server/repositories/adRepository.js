import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/ads.json');

// 确保数据目录存在
const ensureDataDir = async () => {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

// 获取默认广告数据
const getDefaultAds = () => {
  return [
    {
      id: '1',
      title: '抖音',
      publisher: '字节跳动',
      content: '抖音是一个音乐创意短视频社交平台，用户可以通过这款软件选择歌曲，拍摄音乐短视频，形成自己的作品，会根据用户的爱好，来更新用户喜爱的视频。用视频分享生活，让世界看见真实的你。记录美好生活，分享精彩瞬间。支持多种特效、背景音乐，发起话题，通过评论、点赞、分享等方式与内容互动。',
      landingPage: 'https://www.douyin.com',
      pricing: 10.00,
      clicked: 2,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: '西瓜视频',
      publisher: '字节跳动',
      content: '西瓜视频是字节跳动旗下的个性化推荐视频平台，通过人工智能帮助每个人发现自己喜欢的视频，并帮助视频创作人轻松地向全世界分享自己的视频作品。平台内容涵盖音乐、影视、社会、农人、游戏、美食、儿童、生活、体育、文化、时尚、科技等类别，通过个性化推荐，源源不断地为不同人群提供优质内容。',
      landingPage: 'https://www.ixigua.com',
      pricing: 5.00,
      clicked: 2,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: '巨量引擎',
      publisher: '字节跳动',
      content: '巨量引擎是字节跳动旗下的综合数字化营销服务平台，致力于让不分体量、地域的企业及个体，都能通过数字化技术激发创造、驱动生意，实现商业的可持续增长。',
      landingPage: 'https://www.oceanengine.com',
      pricing: 5.00,
      clicked: 1,
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      title: '懂车帝',
      publisher: '字节跳动',
      content: '懂车帝是字节跳动旗下的一站式汽车信息与服务平台，致力于为用户提供真实、专业的汽车内容和高效的选车服务。同时为汽车行业和汽车品牌提供集内容、营销、交易于一体的数字化解决方案。',
      landingPage: 'https://www.dongchedi.com',
      pricing: 6.00,
      clicked: 0,
      createdAt: new Date().toISOString()
    },
    {
      id: '5',
      title: '今日头条',
      publisher: '字节跳动',
      content: '今日头条是一款基于数据挖掘的推荐引擎产品，为用户推荐信息、提供连接人与信息的服务的产品。由北京字节跳动科技有限公司开发。通过海量信息采集、深度数据挖掘和用户行为分析，为用户智能推荐个性化信息，从而开创了一种全新的新闻阅读模式。',
      landingPage: 'https://www.toutiao.com',
      pricing: 4.00,
      clicked: 1,
      createdAt: new Date().toISOString()
    },
    {
      id: '6',
      title: '飞书',
      publisher: '字节跳动',
      content: '飞书是字节跳动旗下的一站式协作平台，整合即时沟通、日历、在线文档、云盘、工作台等功能于一体，提供品质卓越的云协作体验，成就组织和个人，让工作更高效、更愉悦。',
      landingPage: 'https://www.feishu.cn',
      pricing: 3.00,
      clicked: 0,
      createdAt: new Date().toISOString()
    }
  ];
};

export class AdRepository {
  // 读取所有广告
  async getAllAds() {
    await ensureDataDir();
    
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      const ads = JSON.parse(data);
      return Array.isArray(ads) ? ads : [];
    } catch (error) {
      if (error.code === 'ENOENT') {
        // 文件不存在，初始化默认数据
        const defaultAds = getDefaultAds();
        await this.saveAllAds(defaultAds);
        return defaultAds;
      }
      throw error;
    }
  }

  // 保存所有广告
  async saveAllAds(ads) {
    await ensureDataDir();
    await fs.writeFile(DATA_FILE, JSON.stringify(ads, null, 2), 'utf-8');
  }

  // 添加广告
  async addAd(ad) {
    const ads = await this.getAllAds();
    ads.push(ad);
    await this.saveAllAds(ads);
    return ad;
  }

  // 根据ID获取广告
  async getAdById(id) {
    const ads = await this.getAllAds();
    return ads.find(ad => ad.id === id) || null;
  }

  // 更新广告
  async updateAd(id, updatedAd) {
    const ads = await this.getAllAds();
    const index = ads.findIndex(ad => ad.id === id);
    
    if (index === -1) {
      return null;
    }

    ads[index] = updatedAd;
    await this.saveAllAds(ads);
    return updatedAd;
  }

  // 删除广告
  async deleteAd(id) {
    const ads = await this.getAllAds();
    const filteredAds = ads.filter(ad => ad.id !== id);
    
    if (filteredAds.length === ads.length) {
      return false; // 没有找到要删除的广告
    }

    await this.saveAllAds(filteredAds);
    return true;
  }
}


import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import seedAds from '../data/ads.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 在 Vercel 上，代码目录是只读的，不能写入 ../data
// 因此在 Vercel 环境下改用 /tmp/data 目录，在本地仍使用原来的 ../data
const isVercel = process.env.VERCEL === '1';
const DATA_DIR = isVercel
  ? path.join('/tmp', 'data')
  : path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'ads.json');

// 代码仓库中的默认广告数据（来自 data/ads.json）
const DEFAULT_ADS = Array.isArray(seedAds) ? seedAds : [];

// 确保数据目录存在
const ensureDataDir = async () => {
  const dataDir = DATA_DIR;
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

export class AdRepository {
  // 读取所有广告
  async getAllAds() {
    await ensureDataDir();
    
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      const ads = JSON.parse(data);

      // 如果数据文件格式不对或为空数组，则使用代码中的默认广告重新初始化
      if (!Array.isArray(ads) || ads.length === 0) {
        await this.saveAllAds(DEFAULT_ADS);
        return DEFAULT_ADS;
      }

      return ads;
    } catch (error) {
      if (error.code === 'ENOENT') {
        // 主数据文件不存在：用默认广告初始化一次
        await this.saveAllAds(DEFAULT_ADS);
        return DEFAULT_ADS;
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


import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 在 Vercel 上，代码目录是只读的，不能写入 ../data
// 因此在 Vercel 环境下改用 /tmp/data 目录，在本地仍使用原来的 ../data
const isVercel = process.env.VERCEL === '1';
const DATA_DIR = isVercel
  ? path.join('/tmp', 'data')
  : path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'ads.json');

// 只读的种子数据文件（代码仓库中的默认数据）
// 本地和 Vercel 都可以从这里读取，但只在首次初始化时使用
const SEED_FILE = path.join(__dirname, '../data/ads.json');

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

      // 如果数据文件格式不对或为空数组，则再次从种子文件初始化
      if (!Array.isArray(ads) || ads.length === 0) {
        try {
          const seedData = await fs.readFile(SEED_FILE, 'utf-8');
          const seedAds = JSON.parse(seedData);
          const validAds = Array.isArray(seedAds) ? seedAds : [];
          await this.saveAllAds(validAds);
          return validAds;
        } catch {
          return [];
        }
      }

      return ads;
    } catch (error) {
      if (error.code === 'ENOENT') {
        // 主数据文件不存在：从只读的种子文件初始化一次
        try {
          const seedData = await fs.readFile(SEED_FILE, 'utf-8');
          const seedAds = JSON.parse(seedData);
          const ads = Array.isArray(seedAds) ? seedAds : [];
          await this.saveAllAds(ads);
          return ads;
        } catch (seedError) {
          // 种子文件也读取失败时，返回空数组，避免服务直接挂掉
          if (seedError.code === 'ENOENT') {
            return [];
          }
          throw seedError;
        }
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


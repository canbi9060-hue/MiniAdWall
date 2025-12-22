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

// 种子文件（随代码部署的默认广告数据）
// 在Vercel环境下，种子文件可能位于不同的路径
const SEED_FILE = isVercel
  ? path.join(process.cwd(), 'data', 'ads.json')
  : path.join(__dirname, '../data/ads.json');

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

      // 如果数据文件格式不对或为空数组，则使用种子数据重新初始化
      if (!Array.isArray(ads) || ads.length === 0) {
        console.log('数据文件为空或格式错误，尝试加载种子数据...');
        const seed = await this.readSeedAds();
        if (seed.length > 0) {
          await this.saveAllAds(seed);
          console.log(`成功加载 ${seed.length} 条种子数据`);
        } else {
          console.log('种子数据文件未找到，返回空数组');
        }
        return seed;
      }

      return ads;
    } catch (error) {
      if (error.code === 'ENOENT') {
        // 主数据文件不存在：用种子数据初始化一次
        console.log('数据文件不存在，尝试加载种子数据...');
        const seed = await this.readSeedAds();
        if (seed.length > 0) {
          await this.saveAllAds(seed);
          console.log(`成功加载 ${seed.length} 条种子数据`);
        } else {
          console.log('种子数据文件未找到，返回空数组');
        }
        return seed;
      }
      throw error;
    }
  }

  // 读取随代码发布的种子广告数据（尝试多种可能路径，防止打包路径不一致）
  async readSeedAds() {
    const candidates = [
      SEED_FILE,
      path.join(process.cwd(), 'data', 'ads.json'),
      path.join(process.cwd(), 'server/data', 'ads.json'),
      path.join(process.cwd(), '../data', 'ads.json'),
      path.join(__dirname, '../data/ads.json'),
      path.join(__dirname, '../../data/ads.json')
    ];

    for (const p of candidates) {
      try {
        const seedData = await fs.readFile(p, 'utf-8');
        const seedAds = JSON.parse(seedData);
        if (Array.isArray(seedAds) && seedAds.length > 0) {
          return seedAds;
        }
      } catch {
        // ignore and try next
      }
    }

    // 种子文件异常时，返回空数组以避免函数崩溃
    return [];
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


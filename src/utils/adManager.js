// 广告数据管理模块
export const AdManager = {
    STORAGE_KEY: 'mini_ad_wall_ads',
    MYSTERY_FACTOR: 0.42,

    // 获取默认广告数据
    getDefaultAds() {
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
    },

    // 获取所有广告
    getAllAds() {
        const adsJson = localStorage.getItem(this.STORAGE_KEY);
        if (adsJson) {
            return JSON.parse(adsJson);
        } else {
            // 首次加载，初始化默认数据
            const defaultAds = this.getDefaultAds();
            this.saveAllAds(defaultAds);
            return defaultAds;
        }
    },

    // 保存所有广告
    saveAllAds(ads) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ads));
        } catch (error) {
            console.error('保存数据失败:', error);
            if (error.name === 'QuotaExceededError') {
                console.warn('存储空间不足，尝试清理旧数据');
            }
        }
    },

    // 计算竞价排名分数
    calculateRankingScore(ad) {
        return ad.pricing + (ad.pricing * ad.clicked * this.MYSTERY_FACTOR);
    },

    // 按竞价排名排序
    sortAdsByRanking(ads) {
        return [...ads].sort((a, b) => {
            const scoreA = this.calculateRankingScore(a);
            const scoreB = this.calculateRankingScore(b);
            return scoreB - scoreA; // 降序排列
        });
    },

    // 添加广告
    addAd(adData) {
        const ads = this.getAllAds();
        const newAd = {
            id: Date.now().toString(),
            title: adData.title,
            publisher: adData.publisher,
            content: adData.content,
            landingPage: adData.landingPage,
            pricing: parseFloat(adData.pricing),
            clicked: 0,
            createdAt: new Date().toISOString()
        };
        ads.push(newAd);
        this.saveAllAds(ads);
        return newAd;
    },

    // 更新广告
    updateAd(id, adData) {
        const ads = this.getAllAds();
        const index = ads.findIndex(ad => ad.id === id);
        if (index !== -1) {
            ads[index] = {
                ...ads[index],
                title: adData.title,
                publisher: adData.publisher,
                content: adData.content,
                landingPage: adData.landingPage,
                pricing: parseFloat(adData.pricing),
                updatedAt: new Date().toISOString()
            };
            this.saveAllAds(ads);
            return ads[index];
        }
        return null;
    },

    // 删除广告
    deleteAd(id) {
        const ads = this.getAllAds();
        const filteredAds = ads.filter(ad => ad.id !== id);
        this.saveAllAds(filteredAds);
        return filteredAds.length < ads.length;
    },

    // 增加点击数
    incrementClick(id) {
        const ads = this.getAllAds();
        const ad = ads.find(ad => ad.id === id);
        if (ad) {
            ad.clicked = (ad.clicked || 0) + 1;
            this.saveAllAds(ads);
            return ad;
        }
        return null;
    },

    // 根据ID获取广告
    getAdById(id) {
        const ads = this.getAllAds();
        return ads.find(ad => ad.id === id);
    },

    // 清空所有数据
    clearAllAds() {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    // 导出数据
    exportAds() {
        const ads = this.getAllAds();
        const dataStr = JSON.stringify(ads, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ad-wall-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    // 导入数据
    importAds(jsonData) {
        try {
            const ads = JSON.parse(jsonData);
            if (Array.isArray(ads)) {
                this.saveAllAds(ads);
                return true;
            }
            return false;
        } catch (error) {
            console.error('导入数据失败:', error);
            return false;
        }
    }
};


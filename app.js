// 广告数据管理
const AdManager = {
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
            // 如果存储空间不足，尝试清理或提示用户
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
    }
};

// UI 管理
const UI = {
    // 渲染广告列表
    renderAdList() {
        const adList = document.getElementById('adList');
        const ads = AdManager.getAllAds();
        const sortedAds = AdManager.sortAdsByRanking(ads);

        if (sortedAds.length === 0) {
            adList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无广告，点击"新增广告"创建第一条广告</p>';
            return;
        }

        adList.innerHTML = sortedAds.map((ad, index) => {
            // 判断是否为热度前三
            const isTopThree = index < 3;
            const fireIcon = isTopThree ? '<i class="iconfont icon-huo"></i>' : '';
            
            return `
            <div class="ad-card" data-ad-id="${ad.id}">
                <div class="ad-card-header">
                    <div class="ad-title">${this.escapeHtml(ad.title)}</div>
                    <div class="operation-wrapper">
                        <button class="operation-btn" onclick="event.stopPropagation(); UI.toggleOperationMenu(event, '${ad.id}')">
                            操作 <span>▼</span>
                        </button>
                        <div class="operation-menu" id="menu-${ad.id}">
                            <button class="operation-menu-item" onclick="event.stopPropagation(); UI.openEditModal('${ad.id}')">编辑广告</button>
                            <button class="operation-menu-item" onclick="event.stopPropagation(); UI.openCopyModal('${ad.id}')">复制广告</button>
                            <button class="operation-menu-item" onclick="event.stopPropagation(); UI.openDeleteModal('${ad.id}')">删除广告</button>
                        </div>
                    </div>
                </div>
                <div class="ad-content">${this.escapeHtml(ad.content)}</div>
                <div class="ad-footer">
                    <span class="ad-hotness">${fireIcon}热度: ${ad.clicked || 0}</span>
                    <span class="ad-pricing">出价: ${parseFloat(ad.pricing).toFixed(2)}</span>
                </div>
            </div>
            `;
        }).join('');

        // 绑定广告卡片点击事件
        document.querySelectorAll('.ad-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // 如果点击的是操作按钮或菜单，不触发跳转
                if (e.target.closest('.operation-wrapper')) {
                    return;
                }
                const adId = card.getAttribute('data-ad-id');
                UI.handleAdClick(adId);
            });
        });
    },

    // 处理广告点击
    handleAdClick(adId) {
        const ad = AdManager.getAdById(adId);
        if (ad && ad.landingPage) {
            try {
                // 先打开新窗口，避免被浏览器阻止
                const newWindow = window.open(ad.landingPage, '_blank');
                
                // 如果窗口成功打开，再更新数据
                if (newWindow) {
                    // 使用异步方式延迟更新，避免阻塞主线程
                    setTimeout(() => {
                        try {
                            // 增加点击数
                            AdManager.incrementClick(adId);
                            // 延迟刷新列表，确保窗口打开完成
                            requestAnimationFrame(() => {
                                this.renderAdList();
                            });
                        } catch (error) {
                            console.error('更新点击数失败:', error);
                        }
                    }, 100);
                } else {
                    // 如果窗口被阻止，仍然更新点击数
                    AdManager.incrementClick(adId);
                    this.renderAdList();
                }
            } catch (error) {
                console.error('打开链接失败:', error);
                // 即使打开失败，也更新点击数
                try {
                    AdManager.incrementClick(adId);
                    this.renderAdList();
                } catch (updateError) {
                    console.error('更新数据失败:', updateError);
                }
            }
        }
    },

    // 切换操作菜单显示
    toggleOperationMenu(event, adId) {
        // 关闭所有其他菜单
        document.querySelectorAll('.operation-menu').forEach(menu => {
            if (menu.id !== `menu-${adId}`) {
                menu.classList.remove('show');
            }
        });

        // 切换当前菜单
        const menu = document.getElementById(`menu-${adId}`);
        if (menu) {
            menu.classList.toggle('show');
        }

        // 点击外部关闭菜单
        const closeMenu = (e) => {
            if (!e.target.closest('.operation-wrapper')) {
                document.querySelectorAll('.operation-menu').forEach(m => m.classList.remove('show'));
                document.removeEventListener('click', closeMenu);
            }
        };
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 0);
    },

    // 打开创建广告弹窗
    openCreateModal() {
        const modal = document.getElementById('adModal');
        const form = document.getElementById('adForm');
        const modalTitle = document.getElementById('modalTitle');
        const submitBtn = document.getElementById('submitBtn');

        modalTitle.textContent = '新建广告';
        submitBtn.textContent = '创建广告';
        form.reset();
        form.dataset.mode = 'create';
        form.dataset.adId = '';

        modal.classList.add('show');
    },

    // 打开编辑广告弹窗
    openEditModal(adId) {
        const ad = AdManager.getAdById(adId);
        if (!ad) return;

        const modal = document.getElementById('adModal');
        const form = document.getElementById('adForm');
        const modalTitle = document.getElementById('modalTitle');
        const submitBtn = document.getElementById('submitBtn');

        modalTitle.textContent = '编辑广告';
        submitBtn.textContent = '更新广告';

        // 填充表单数据
        document.getElementById('adTitle').value = ad.title;
        document.getElementById('publisher').value = ad.publisher;
        document.getElementById('content').value = ad.content;
        document.getElementById('landingPage').value = ad.landingPage;
        document.getElementById('pricing').value = ad.pricing;

        form.dataset.mode = 'edit';
        form.dataset.adId = adId;

        // 关闭操作菜单
        document.querySelectorAll('.operation-menu').forEach(m => m.classList.remove('show'));

        modal.classList.add('show');
    },

    // 打开复制广告弹窗
    openCopyModal(adId) {
        const ad = AdManager.getAdById(adId);
        if (!ad) return;

        const modal = document.getElementById('adModal');
        const form = document.getElementById('adForm');
        const modalTitle = document.getElementById('modalTitle');
        const submitBtn = document.getElementById('submitBtn');

        modalTitle.textContent = '复制广告';
        submitBtn.textContent = '创建广告';

        // 填充表单数据（除了ID）
        document.getElementById('adTitle').value = ad.title;
        document.getElementById('publisher').value = ad.publisher;
        document.getElementById('content').value = ad.content;
        document.getElementById('landingPage').value = ad.landingPage;
        document.getElementById('pricing').value = ad.pricing;

        form.dataset.mode = 'copy';
        form.dataset.adId = adId;

        // 关闭操作菜单
        document.querySelectorAll('.operation-menu').forEach(m => m.classList.remove('show'));

        modal.classList.add('show');
    },

    // 打开删除确认弹窗
    openDeleteModal(adId) {
        const modal = document.getElementById('deleteModal');
        modal.dataset.adId = adId;

        // 关闭操作菜单
        document.querySelectorAll('.operation-menu').forEach(m => m.classList.remove('show'));

        modal.classList.add('show');
    },

    // 关闭弹窗
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
    },

    // 显示提示消息
    showMessage(message, type = 'success') {
        // 创建提示元素
        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            background: ${type === 'success' ? '#52c41a' : '#ff4d4f'};
            color: white;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 2000;
            animation: slideInRight 0.3s;
        `;
        messageEl.textContent = message;

        // 添加动画样式
        if (!document.getElementById('messageStyles')) {
            const style = document.createElement('style');
            style.id = 'messageStyles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(messageEl);

        // 3秒后自动移除
        setTimeout(() => {
            messageEl.style.animation = 'slideInRight 0.3s reverse';
            setTimeout(() => {
                document.body.removeChild(messageEl);
            }, 300);
        }, 3000);
    },

    // HTML 转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 渲染广告列表
    UI.renderAdList();

    // 新增广告按钮
    document.getElementById('addAdBtn').addEventListener('click', () => {
        UI.openCreateModal();
    });

    // 关闭创建/编辑弹窗
    document.getElementById('closeModal').addEventListener('click', () => {
        UI.closeModal('adModal');
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
        UI.closeModal('adModal');
    });

    // 点击弹窗外部关闭
    document.getElementById('adModal').addEventListener('click', (e) => {
        if (e.target.id === 'adModal') {
            UI.closeModal('adModal');
        }
    });

    // 表单提交
    document.getElementById('adForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const form = e.target;
        const mode = form.dataset.mode;
        const adId = form.dataset.adId;

        // 使用 form-serialize 获取表单数据
        const formData = serialize(form, { hash: true });
        
        // 对字符串字段进行 trim 处理
        if (formData.title) formData.title = formData.title.trim();
        if (formData.publisher) formData.publisher = formData.publisher.trim();
        if (formData.content) formData.content = formData.content.trim();
        if (formData.landingPage) formData.landingPage = formData.landingPage.trim();

        // 验证
        if (!formData.title || !formData.publisher || !formData.content || !formData.landingPage || !formData.pricing) {
            UI.showMessage('请填写所有必填项', 'error');
            return;
        }

        if (isNaN(formData.pricing) || parseFloat(formData.pricing) < 0) {
            UI.showMessage('出价必须是有效的正数', 'error');
            return;
        }

        // 验证URL格式
        try {
            new URL(formData.landingPage);
        } catch {
            UI.showMessage('请输入有效的落地页URL', 'error');
            return;
        }

        // 执行操作
        let result = null;
        if (mode === 'create' || mode === 'copy') {
            result = AdManager.addAd(formData);
            if (result) {
                UI.showMessage('广告创建成功');
                UI.closeModal('adModal');
                UI.renderAdList();
            } else {
                UI.showMessage('广告创建失败', 'error');
            }
        } else if (mode === 'edit') {
            result = AdManager.updateAd(adId, formData);
            if (result) {
                UI.showMessage('广告更新成功');
                UI.closeModal('adModal');
                UI.renderAdList();
            } else {
                UI.showMessage('广告更新失败', 'error');
            }
        }
    });

    // 删除确认弹窗
    document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
        UI.closeModal('deleteModal');
    });

    document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
        const modal = document.getElementById('deleteModal');
        const adId = modal.dataset.adId;

        if (adId && AdManager.deleteAd(adId)) {
            UI.showMessage('广告删除成功');
            UI.closeModal('deleteModal');
            UI.renderAdList();
        } else {
            UI.showMessage('广告删除失败', 'error');
        }
    });

    // 点击删除弹窗外部关闭
    document.getElementById('deleteModal').addEventListener('click', (e) => {
        if (e.target.id === 'deleteModal') {
            UI.closeModal('deleteModal');
        }
    });
});


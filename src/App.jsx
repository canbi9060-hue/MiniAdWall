import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { adAPI } from './utils/api';
import { showMessage } from './utils/helpers';
import Navbar from './components/Navbar';
import AdList from './components/AdList';
import AdModal from './components/AdModal';
import DeleteModal from './components/DeleteModal';
import './App.css';

function App() {
    const [ads, setAds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // create, edit, copy
    const [currentAd, setCurrentAd] = useState(null);
    const [deleteAdId, setDeleteAdId] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortBy, setSortBy] = useState('ranking');

    // 加载广告列表（从后端API获取，不使用本地getDefaultAds）
    const loadAds = useCallback(async () => {
        setIsLoading(true);
        try {
            // 向后端请求广告列表，后端会自动初始化默认数据
            const allAds = await adAPI.getAds(sortBy);
            setAds(allAds);
        } catch (error) {
            console.error('加载广告列表失败:', error);
            showMessage('加载广告列表失败: ' + (error.message || '请确保后端服务已启动'), 'error');
            setAds([]); // 出错时设置为空数组
        } finally {
            setIsLoading(false);
        }
    }, [sortBy]);

    useEffect(() => {
        loadAds();
    }, [loadAds]);

    // 搜索和筛选后的广告列表（优化：缓存小写关键词）
    const filteredAds = useMemo(() => {
        const keyword = searchKeyword.trim().toLowerCase();
        if (!keyword) return ads;
        
        return ads.filter(ad => 
            ad.title.toLowerCase().includes(keyword) ||
            ad.publisher.toLowerCase().includes(keyword) ||
            ad.content.toLowerCase().includes(keyword)
        );
    }, [ads, searchKeyword]);

    // 统计信息
    const stats = useMemo(() => {
        const total = ads.length;
        const totalHotness = ads.reduce((sum, ad) => sum + (ad.clicked || 0), 0);
        const totalPricing = ads.reduce((sum, ad) => sum + ad.pricing, 0);
        return { total, totalHotness, totalPricing };
    }, [ads]);

    // 导出数据
    const handleExport = () => {
        try {
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
            showMessage('数据导出成功');
        } catch (error) {
            showMessage('数据导出失败', 'error');
        }
    };

    // 导入数据（暂时保留，但需要后端支持批量导入接口）
    const handleImport = (e) => {
        showMessage('批量导入功能需要后端支持，请使用创建广告功能', 'error');
        e.target.value = ''; // 重置文件输入
    };

    // 清空数据（暂时保留，但需要后端支持）
    const handleClearData = () => {
        showMessage('清空数据功能需要后端支持', 'error');
    };

    // 广告ID到广告对象的映射（用于快速查找）
    const adMap = useMemo(() => {
        const map = new Map();
        ads.forEach(ad => map.set(ad.id, ad));
        return map;
    }, [ads]);

    // 处理广告卡片点击（优化：只更新单个广告，不重新加载整个列表）
    const handleAdClick = useCallback(async (adId) => {
        const ad = adMap.get(adId);
        if (!ad?.landingPage) return;

        // 先打开新窗口
        const newWindow = window.open(ad.landingPage, '_blank');
        
        // 乐观更新：立即更新UI，然后同步后端
        setAds(prevAds => prevAds.map(a => 
            a.id === adId ? { ...a, clicked: (a.clicked || 0) + 1 } : a
        ));

        // 异步更新后端
        try {
            await adAPI.incrementClick(adId);
        } catch (error) {
            console.error('更新点击数失败:', error);
            // 回滚乐观更新
            setAds(prevAds => prevAds.map(a => 
                a.id === adId ? { ...a, clicked: Math.max(0, (a.clicked || 0) - 1) } : a
            ));
            showMessage('记录点击失败', 'error');
        }
    }, [adMap]);

    // 打开创建广告弹窗
    const handleAddClick = () => {
        setModalMode('create');
        setCurrentAd(null);
        setIsModalOpen(true);
    };

    // 打开编辑/复制广告弹窗（优化：使用Map快速查找）
    const handleEdit = useCallback((adId) => {
        const ad = adMap.get(adId);
        if (ad) {
            setModalMode('edit');
            setCurrentAd(ad);
            setIsModalOpen(true);
        }
    }, [adMap]);

    const handleCopy = useCallback((adId) => {
        const ad = adMap.get(adId);
        if (ad) {
            setModalMode('copy');
            setCurrentAd(ad);
            setIsModalOpen(true);
        }
    }, [adMap]);

    // 打开删除确认弹窗
    const handleDelete = (adId) => {
        setDeleteAdId(adId);
        setIsDeleteModalOpen(true);
    };

    // 处理表单提交（优化：成功后直接更新列表，不重新请求）
    const handleFormSubmit = useCallback(async (formData) => {
        try {
            let newAd;
            if (modalMode === 'create' || modalMode === 'copy') {
                newAd = await adAPI.createAd(formData);
                showMessage('广告创建成功');
                setIsModalOpen(false);
                // 直接添加到列表，保持排序
                setAds(prevAds => {
                    const updated = [...prevAds, newAd];
                    // 根据当前排序方式重新排序
                    if (sortBy === 'ranking') {
                        return updated.sort((a, b) => {
                            const scoreA = a.pricing + (a.pricing * (a.clicked || 0) * 0.42);
                            const scoreB = b.pricing + (b.pricing * (b.clicked || 0) * 0.42);
                            return scoreB - scoreA;
                        });
                    } else if (sortBy === 'hotness') {
                        return updated.sort((a, b) => (b.clicked || 0) - (a.clicked || 0));
                    } else {
                        return updated.sort((a, b) => b.pricing - a.pricing);
                    }
                });
            } else if (modalMode === 'edit') {
                newAd = await adAPI.updateAd(currentAd.id, formData);
                showMessage('广告更新成功');
                setIsModalOpen(false);
                // 直接更新列表中的广告
                setAds(prevAds => prevAds.map(ad => ad.id === currentAd.id ? newAd : ad));
            }
        } catch (error) {
            console.error('提交失败:', error);
            showMessage(error.message || '操作失败', 'error');
        }
    }, [modalMode, sortBy, currentAd]);

    // 确认删除（优化：直接更新列表，不重新请求）
    const handleConfirmDelete = async () => {
        if (!deleteAdId) return;
        
        const adIdToDelete = deleteAdId;
        // 乐观更新：立即从UI中移除
        setAds(prevAds => prevAds.filter(ad => ad.id !== adIdToDelete));
        setIsDeleteModalOpen(false);
        setDeleteAdId(null);
        
        try {
            await adAPI.deleteAd(adIdToDelete);
            showMessage('广告删除成功');
        } catch (error) {
            console.error('删除失败:', error);
            // 回滚：重新加载列表
            await loadAds();
            showMessage(error.message || '广告删除失败', 'error');
        }
    };

    // 取消删除
    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setDeleteAdId(null);
    };

    return (
        <>
            <Navbar
                onAddClick={handleAddClick}
                searchKeyword={searchKeyword}
                onSearchChange={setSearchKeyword}
                sortBy={sortBy}
                onSortChange={setSortBy}
                stats={stats}
                onExport={handleExport}
                onImport={handleImport}
                onClearData={handleClearData}
            />
            <div className="container">
                <main>
                    {isLoading ? (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '40px', 
                            color: '#999' 
                        }}>
                            正在加载广告数据...
                        </div>
                    ) : (
                        <AdList
                            ads={filteredAds}
                            onCardClick={handleAdClick}
                            onEdit={handleEdit}
                            onCopy={handleCopy}
                            onDelete={handleDelete}
                        />
                    )}
                </main>
            </div>

            <AdModal
                isOpen={isModalOpen}
                mode={modalMode}
                adData={currentAd}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </>
    );
}

export default App;


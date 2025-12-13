import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AdManager } from './utils/adManager';
import { showMessage } from './utils/helpers';
import Navbar from './components/Navbar';
import AdList from './components/AdList';
import AdModal from './components/AdModal';
import DeleteModal from './components/DeleteModal';
import './App.css';

function App() {
    const [ads, setAds] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // create, edit, copy
    const [currentAd, setCurrentAd] = useState(null);
    const [deleteAdId, setDeleteAdId] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortBy, setSortBy] = useState('ranking');

    // 加载广告列表
    const loadAds = useCallback(() => {
        const allAds = AdManager.getAllAds();
        let sortedAds;
        
        switch (sortBy) {
            case 'hotness':
                sortedAds = [...allAds].sort((a, b) => (b.clicked || 0) - (a.clicked || 0));
                break;
            case 'pricing':
                sortedAds = [...allAds].sort((a, b) => b.pricing - a.pricing);
                break;
            default:
                sortedAds = AdManager.sortAdsByRanking(allAds);
        }
        
        setAds(sortedAds);
    }, [sortBy]);

    useEffect(() => {
        loadAds();
    }, [loadAds]);

    // 搜索和筛选后的广告列表
    const filteredAds = useMemo(() => {
        if (!searchKeyword.trim()) {
            return ads;
        }
        const keyword = searchKeyword.toLowerCase();
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
            AdManager.exportAds();
            showMessage('数据导出成功');
        } catch (error) {
            showMessage('数据导出失败', 'error');
        }
    };

    // 导入数据
    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const jsonData = event.target.result;
                if (AdManager.importAds(jsonData)) {
                    showMessage('数据导入成功');
                    loadAds();
                } else {
                    showMessage('数据导入失败，请检查文件格式', 'error');
                }
            } catch (error) {
                showMessage('数据导入失败', 'error');
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // 重置文件输入
    };

    // 清空数据
    const handleClearData = () => {
        if (window.confirm('确定要清空所有数据吗？此操作不可恢复！')) {
            AdManager.clearAllAds();
            showMessage('数据已清空');
            loadAds();
        }
    };

    // 处理广告卡片点击
    const handleAdClick = useCallback((adId) => {
        const ad = AdManager.getAdById(adId);
        if (ad && ad.landingPage) {
            try {
                // 先打开新窗口
                const newWindow = window.open(ad.landingPage, '_blank');
                
                // 如果窗口成功打开，再更新数据
                if (newWindow) {
                    setTimeout(() => {
                        try {
                            AdManager.incrementClick(adId);
                            requestAnimationFrame(() => {
                                loadAds();
                            });
                        } catch (error) {
                            console.error('更新点击数失败:', error);
                        }
                    }, 100);
                } else {
                    AdManager.incrementClick(adId);
                    loadAds();
                }
            } catch (error) {
                console.error('打开链接失败:', error);
                try {
                    AdManager.incrementClick(adId);
                    loadAds();
                } catch (updateError) {
                    console.error('更新数据失败:', updateError);
                }
            }
        }
    }, [loadAds]);

    // 打开创建广告弹窗
    const handleAddClick = () => {
        setModalMode('create');
        setCurrentAd(null);
        setIsModalOpen(true);
    };

    // 打开编辑广告弹窗
    const handleEdit = (adId) => {
        const ad = AdManager.getAdById(adId);
        if (ad) {
            setModalMode('edit');
            setCurrentAd(ad);
            setIsModalOpen(true);
        }
    };

    // 打开复制广告弹窗
    const handleCopy = (adId) => {
        const ad = AdManager.getAdById(adId);
        if (ad) {
            setModalMode('copy');
            setCurrentAd(ad);
            setIsModalOpen(true);
        }
    };

    // 打开删除确认弹窗
    const handleDelete = (adId) => {
        setDeleteAdId(adId);
        setIsDeleteModalOpen(true);
    };

    // 处理表单提交
    const handleFormSubmit = (formData) => {
        let result = null;
        
        if (modalMode === 'create' || modalMode === 'copy') {
            result = AdManager.addAd(formData);
            if (result) {
                showMessage('广告创建成功');
                setIsModalOpen(false);
                loadAds();
            } else {
                showMessage('广告创建失败', 'error');
            }
        } else if (modalMode === 'edit') {
            result = AdManager.updateAd(currentAd.id, formData);
            if (result) {
                showMessage('广告更新成功');
                setIsModalOpen(false);
                loadAds();
            } else {
                showMessage('广告更新失败', 'error');
            }
        }
    };

    // 确认删除
    const handleConfirmDelete = () => {
        if (deleteAdId && AdManager.deleteAd(deleteAdId)) {
            showMessage('广告删除成功');
            setIsDeleteModalOpen(false);
            setDeleteAdId(null);
            loadAds();
        } else {
            showMessage('广告删除失败', 'error');
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
                    <AdList
                        ads={filteredAds}
                        onCardClick={handleAdClick}
                        onEdit={handleEdit}
                        onCopy={handleCopy}
                        onDelete={handleDelete}
                    />
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


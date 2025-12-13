import React, { useState } from 'react';
import logoImage from '../assets/logo.png';

const Navbar = ({ 
    onAddClick,
    searchKeyword, 
    onSearchChange, 
    sortBy, 
    onSortChange,
    stats,
    onExport,
    onImport,
    onClearData
}) => {
    const [showMore, setShowMore] = useState(false);

    return (
        <nav className="navbar">
            <div className="navbar-wrapper">
                <div className="navbar-main">
                <div className="navbar-title">
                    <img src={logoImage} alt="Mini" className="navbar-logo" />
                    <span className="navbar-title-text">广告墙</span>
                </div>
                <div className="navbar-search">
                    <input
                        type="text"
                        placeholder="搜索广告标题、发布人、内容..."
                        value={searchKeyword}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="search-input"
                    />
                    <i className="iconfont icon-sousuo1"></i>
                </div>
                <button className="btn-primary" onClick={onAddClick}>
                    + 新增广告
                </button>
                <select 
                    value={sortBy} 
                    onChange={(e) => onSortChange(e.target.value)}
                    className="sort-select"
                >
                    <option value="ranking">按排名排序</option>
                    <option value="hotness">按热度排序</option>
                    <option value="pricing">按出价排序</option>
                </select>
                <button 
                    className="btn-secondary" 
                    onClick={() => setShowMore(!showMore)}
                >
                    更多功能 ▼
                </button>
                </div>
                
                {showMore && (
                    <div className="navbar-more">
                        <div className="navbar-stats">
                            <span className="stat-item">
                                <strong>总数:</strong> {stats.total}
                            </span>
                            <span className="stat-item">
                                <strong>总热度:</strong> {stats.totalHotness}
                            </span>
                            <span className="stat-item">
                                <strong>总出价:</strong> ¥{stats.totalPricing.toFixed(2)}
                            </span>
                        </div>
                        <div className="navbar-tools">
                            <button className="btn-secondary" onClick={onExport}>
                                导出数据
                            </button>
                            <label className="btn-secondary" style={{ cursor: 'pointer', margin: '0 8px' }}>
                                导入数据
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={onImport}
                                    style={{ display: 'none' }}
                                />
                            </label>
                            <button className="btn-danger" onClick={onClearData}>
                                清空数据
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;


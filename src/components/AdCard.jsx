import React, { useState, useRef, useEffect } from 'react';

const AdCard = ({ ad, index, onCardClick, onEdit, onCopy, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const wrapperRef = useRef(null);

    const isTopThree = index < 3;

    // 点击外部关闭菜单
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => {
                document.removeEventListener('click', handleClickOutside);
            };
        }
    }, [showMenu]);

    const handleOperationClick = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const handleMenuAction = (e, action) => {
        e.stopPropagation();
        setShowMenu(false);
        action(ad.id);
    };

    const handleCardClick = (e) => {
        if (!wrapperRef.current?.contains(e.target)) {
            onCardClick(ad.id);
        }
    };

    return (
        <div className="ad-card" data-ad-id={ad.id} onClick={handleCardClick}>
            <div className="ad-card-header">
                <div className="ad-title">{ad.title}</div>
                <div className="operation-wrapper" ref={wrapperRef}>
                    <button 
                        className="operation-btn" 
                        onClick={handleOperationClick}
                    >
                        操作 <span>▼</span>
                    </button>
                    <div className={`operation-menu ${showMenu ? 'show' : ''}`} ref={menuRef}>
                        <button 
                            className="operation-menu-item" 
                            onClick={(e) => handleMenuAction(e, onEdit)}
                        >
                            编辑广告
                        </button>
                        <button 
                            className="operation-menu-item" 
                            onClick={(e) => handleMenuAction(e, onCopy)}
                        >
                            复制广告
                        </button>
                        <button 
                            className="operation-menu-item" 
                            onClick={(e) => handleMenuAction(e, onDelete)}
                        >
                            删除广告
                        </button>
                    </div>
                </div>
            </div>
            <div className="ad-content">{ad.content}</div>
            <div className="ad-footer">
                <span className="ad-hotness">
                    {isTopThree && <i className="iconfont icon-huo"></i>}
                    热度: {ad.clicked || 0}
                </span>
                <span className="ad-pricing">出价: {parseFloat(ad.pricing).toFixed(2)}</span>
            </div>
        </div>
    );
};

export default AdCard;


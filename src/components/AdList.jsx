import React from 'react';
import AdCard from './AdCard';

const AdList = React.memo(({ ads, onCardClick, onEdit, onCopy, onDelete }) => {
    if (ads.length === 0) {
        return (
            <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
                暂无广告，点击"新增广告"创建第一条广告
            </p>
        );
    }

    return (
        <div className="ad-list">
            {ads.map((ad, index) => (
                <AdCard
                    key={ad.id}
                    ad={ad}
                    index={index}
                    onCardClick={onCardClick}
                    onEdit={onEdit}
                    onCopy={onCopy}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
});

AdList.displayName = 'AdList';
export default AdList;


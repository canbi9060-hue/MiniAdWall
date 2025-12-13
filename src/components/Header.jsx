import React from 'react';

const Header = ({ onAddClick }) => {
    return (
        <header>
            <div className="header-left">
                <h1>Mini广告墙</h1>
            </div>
            <div className="header-right">
                <button className="btn-primary" onClick={onAddClick}>
                    + 新增广告
                </button>
            </div>
        </header>
    );
};

export default Header;


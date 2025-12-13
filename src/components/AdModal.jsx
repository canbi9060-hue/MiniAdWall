import React, { useEffect } from 'react';
import serialize from '../utils/formSerialize';

const AdModal = ({ 
    isOpen, 
    mode, 
    adData, 
    onClose, 
    onSubmit 
}) => {
    const formRef = React.useRef(null);

    useEffect(() => {
        if (isOpen && formRef.current && adData) {
            // 填充表单数据
            document.getElementById('adTitle').value = adData.title || '';
            document.getElementById('publisher').value = adData.publisher || '';
            document.getElementById('content').value = adData.content || '';
            document.getElementById('landingPage').value = adData.landingPage || '';
            document.getElementById('pricing').value = adData.pricing || '';
        }
    }, [isOpen, adData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = formRef.current;
        const formData = serialize(form, { hash: true });
        
        // 对字符串字段进行 trim 处理
        if (formData.title) formData.title = formData.title.trim();
        if (formData.publisher) formData.publisher = formData.publisher.trim();
        if (formData.content) formData.content = formData.content.trim();
        if (formData.landingPage) formData.landingPage = formData.landingPage.trim();

        // 验证
        if (!formData.title || !formData.publisher || !formData.content || !formData.landingPage || !formData.pricing) {
            return;
        }

        if (isNaN(formData.pricing) || parseFloat(formData.pricing) < 0) {
            return;
        }

        // 验证URL格式
        try {
            new URL(formData.landingPage);
        } catch {
            return;
        }

        onSubmit(formData);
    };

    const handleClose = () => {
        if (formRef.current) {
            formRef.current.reset();
        }
        onClose();
    };

    const modalTitle = mode === 'edit' ? '编辑广告' : mode === 'copy' ? '复制广告' : '新建广告';
    const submitText = mode === 'edit' ? '更新广告' : '创建广告';

    if (!isOpen) return null;

    return (
        <div className="modal show" id="adModal" onClick={(e) => {
            if (e.target.id === 'adModal') {
                handleClose();
            }
        }}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2 id="modalTitle">{modalTitle}</h2>
                    <button className="close-btn" onClick={handleClose}>&times;</button>
                </div>
                <form id="adForm" ref={formRef} onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="adTitle">广告标题<span className="required">*</span></label>
                        <input type="text" id="adTitle" name="title" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="publisher">发布人<span className="required">*</span></label>
                        <input type="text" id="publisher" name="publisher" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">内容文案<span className="required">*</span></label>
                        <textarea id="content" name="content" rows="4" required></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="landingPage">落地页<span className="required">*</span></label>
                        <input type="url" id="landingPage" name="landingPage" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="pricing">出价<span className="required">*</span></label>
                        <div className="pricing-input">
                            <input type="number" id="pricing" name="pricing" step="0.01" min="0" required />
                            <span className="unit">元</span>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={handleClose}>
                            取消
                        </button>
                        <button type="submit" className="btn-primary" id="submitBtn">
                            {submitText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdModal;


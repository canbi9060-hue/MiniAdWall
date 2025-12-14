import React, { useEffect, useState } from 'react';
import { adAPI } from '../utils/api';
import { showMessage } from '../utils/helpers';
import DynamicForm from './DynamicForm';

const AdModal = ({ 
    isOpen, 
    mode, 
    adData, 
    onClose, 
    onSubmit 
}) => {
    const [formConfig, setFormConfig] = useState([]);
    const [loading, setLoading] = useState(false);

    // 加载表单配置
    useEffect(() => {
        if (isOpen) {
            loadFormConfig();
        }
    }, [isOpen]);

    const loadFormConfig = async () => {
        try {
            setLoading(true);
            const config = await adAPI.getFormConfig();
            setFormConfig(config);
        } catch (error) {
            console.error('加载表单配置失败:', error);
            showMessage('加载表单配置失败: ' + (error.message || '请检查网络连接'), 'error');
            // 设置为空数组，让用户知道配置加载失败
            setFormConfig([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (formData) => {
        onSubmit(formData);
    };

    const handleClose = () => {
        onClose();
    };

    const modalTitle = mode === 'edit' ? '编辑广告' : mode === 'copy' ? '复制广告' : '新建广告';

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
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        加载表单配置中...
                    </div>
                ) : formConfig.length > 0 ? (
                    <DynamicForm
                        formConfig={formConfig}
                        initialData={adData}
                        onSubmit={handleSubmit}
                        onCancel={handleClose}
                    />
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                        表单配置加载失败
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdModal;

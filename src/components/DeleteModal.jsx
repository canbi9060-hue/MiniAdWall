import React from 'react';

const DeleteModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="modal show" id="deleteModal" onClick={(e) => {
            if (e.target.id === 'deleteModal') {
                onCancel();
            }
        }}>
            <div className="modal-content modal-small">
                <div className="modal-header">
                    <h2>操作提示:</h2>
                </div>
                <div className="modal-body">
                    <p>确定要删除选中的数据?</p>
                </div>
                <div className="form-actions">
                    <button type="button" className="btn-primary" onClick={onConfirm}>
                        确定删除
                    </button>
                    <button type="button" className="btn-secondary" onClick={onCancel}>
                        取消
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;


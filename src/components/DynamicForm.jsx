import React, { useState, useEffect } from 'react';
import { uploadAPI } from '../utils/upload';
import { showMessage } from '../utils/helpers';

const DynamicForm = ({ 
    formConfig, 
    initialData, 
    onSubmit, 
    onCancel 
}) => {
    const [formData, setFormData] = useState({});
    const [videos, setVideos] = useState(['']);
    const [uploading, setUploading] = useState({});
    const [errors, setErrors] = useState({});

    // 初始化表单数据
    useEffect(() => {
        if (initialData) {
            const data = {};
            formConfig.forEach(config => {
                if (config.field === 'videos') {
                    if (initialData.videos && Array.isArray(initialData.videos) && initialData.videos.length > 0) {
                        setVideos([...initialData.videos]);
                    }
                } else {
                    data[config.field] = initialData[config.field] || '';
                }
            });
            setFormData(data);
        } else {
            // 重置表单
            const data = {};
            formConfig.forEach(config => {
                if (config.field !== 'videos') {
                    data[config.field] = '';
                }
            });
            setFormData(data);
            setVideos(['']);
        }
    }, [initialData, formConfig]);

    // 处理输入变化
    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // 清除该字段的错误
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // 处理视频输入变化
    const handleVideoChange = (index, value) => {
        const newVideos = [...videos];
        newVideos[index] = value.trim();
        setVideos(newVideos);
    };

    // 处理文件上传
    const handleFileUpload = async (index, file) => {
        if (!file) return;

        // 验证文件类型
        const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
        if (!allowedTypes.some(type => file.type.includes(type.split('/')[1]))) {
            showMessage('只支持视频文件格式（mp4, webm, ogg, mov, avi, mkv）', 'error');
            return;
        }

        // 验证文件大小（100MB）
        if (file.size > 100 * 1024 * 1024) {
            showMessage('文件大小不能超过100MB', 'error');
            return;
        }

        setUploading(prev => ({ ...prev, [index]: true }));

        try {
            const result = await uploadAPI.uploadVideo(file);
            const newVideos = [...videos];
            newVideos[index] = result.fullUrl;
            setVideos(newVideos);
            showMessage('视频上传成功');
        } catch (error) {
            console.error('上传失败:', error);
            showMessage(error.message || '视频上传失败', 'error');
        } finally {
            setUploading(prev => {
                const newState = { ...prev };
                delete newState[index];
                return newState;
            });
        }
    };

    const addVideoInput = () => {
        setVideos([...videos, '']);
    };

    const removeVideoInput = (index) => {
        if (videos.length > 1) {
            const newVideos = videos.filter((_, i) => i !== index);
            setVideos(newVideos);
        } else {
            handleVideoChange(index, '');
        }
    };

    // 验证字段
    const validateField = (config, value) => {
        const { validator, required } = config;
        const errors = [];

        // 必填验证
        if (required && (!value || (typeof value === 'string' && !value.trim()))) {
            return `${config.name}不能为空`;
        }

        if (!value && !required) {
            return null; // 非必填字段为空时不验证
        }

        // URL验证
        if (validator?.url) {
            try {
                new URL(value);
            } catch {
                return `${config.name}格式不正确`;
            }
        }

        // 数字验证
        if (validator?.number) {
            const num = parseFloat(value);
            if (isNaN(num)) {
                return `${config.name}必须是数字`;
            }
            if (validator.min !== undefined && num < validator.min) {
                return `${config.name}不能小于${validator.min}`;
            }
            if (validator.max !== undefined && num > validator.max) {
                return `${config.name}不能大于${validator.max}`;
            }
        }

        // 长度验证
        if (validator?.maxLength && value.length > validator.maxLength) {
            return `${config.name}不能超过${validator.maxLength}个字符`;
        }
        if (validator?.minLength && value.length < validator.minLength) {
            return `${config.name}不能少于${validator.minLength}个字符`;
        }

        return null;
    };

    // 验证表单
    const validateForm = () => {
        const newErrors = {};

        // 验证普通字段
        formConfig.forEach(config => {
            if (config.field !== 'videos') {
                const error = validateField(config, formData[config.field]);
                if (error) {
                    newErrors[config.field] = error;
                }
            }
        });

        // 验证视频字段
        const videoConfig = formConfig.find(c => c.field === 'videos');
        if (videoConfig) {
            const validVideos = videos.filter(v => v.trim());
            if (videoConfig.required && validVideos.length === 0) {
                newErrors.videos = '至少需要上传一个视频';
            } else {
                // 验证每个视频URL
                for (let i = 0; i < validVideos.length; i++) {
                    const error = validateField({ ...videoConfig, name: `视频${i + 1}` }, validVideos[i]);
                    if (error) {
                        newErrors[`video_${i}`] = error;
                        break;
                    }
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 提交表单
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // 组装提交数据
        const submitData = { ...formData };
        const validVideos = videos.filter(v => v.trim());
        if (validVideos.length > 0) {
            submitData.videos = validVideos;
        }

        onSubmit(submitData);
    };

    // 渲染表单项
    const renderField = (config) => {
        const { field, name, component, type, required, placeholder, rows, step, min, unit, validator } = config;
        const value = formData[field] || '';
        const error = errors[field];

        if (component === 'Input') {
            return (
                <div key={field} className="form-group">
                    <label htmlFor={field}>
                        {name}
                        {required && <span className="required">*</span>}
                    </label>
                    {type === 'number' && unit ? (
                        <div className="pricing-input">
                            <input
                                type={type}
                                id={field}
                                name={field}
                                value={value}
                                onChange={(e) => handleChange(field, e.target.value)}
                                placeholder={placeholder}
                                step={step}
                                min={min}
                                required={required}
                                className={error ? 'error' : ''}
                            />
                            <span className="unit">{unit}</span>
                        </div>
                    ) : (
                        <input
                            type={type}
                            id={field}
                            name={field}
                            value={value}
                            onChange={(e) => handleChange(field, e.target.value)}
                            placeholder={placeholder}
                            required={required}
                            className={error ? 'error' : ''}
                        />
                    )}
                    {error && <div className="error-message">{error}</div>}
                </div>
            );
        }

        if (component === 'Textarea') {
            return (
                <div key={field} className="form-group">
                    <label htmlFor={field}>
                        {name}
                        {required && <span className="required">*</span>}
                    </label>
                    <textarea
                        id={field}
                        name={field}
                        value={value}
                        onChange={(e) => handleChange(field, e.target.value)}
                        placeholder={placeholder}
                        rows={rows || 4}
                        required={required}
                        className={error ? 'error' : ''}
                    />
                    {error && <div className="error-message">{error}</div>}
                </div>
            );
        }

        if (component === 'VideoUpload') {
            return (
                <div key={field} className="form-group">
                    <label htmlFor={field}>
                        {name}
                        {required && <span className="required">*</span>}
                    </label>
                    <div className="video-inputs">
                        {videos.map((video, index) => (
                            <div key={index} className="video-input-item">
                                <input
                                    type="url"
                                    placeholder={`视频 ${index + 1} URL 或上传文件`}
                                    value={video}
                                    onChange={(e) => handleVideoChange(index, e.target.value)}
                                    className={`video-url-input ${errors[`video_${index}`] ? 'error' : ''}`}
                                    disabled={uploading[index]}
                                />
                                <label className="btn-upload-video" title="上传视频文件">
                                    {uploading[index] ? (
                                        <span className="uploading">上传中...</span>
                                    ) : (
                                        <>
                                            📁
                                            <input
                                                type="file"
                                                accept="video/*"
                                                style={{ display: 'none' }}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        handleFileUpload(index, file);
                                                    }
                                                    e.target.value = '';
                                                }}
                                            />
                                        </>
                                    )}
                                </label>
                                <button
                                    type="button"
                                    className="btn-remove-video"
                                    onClick={() => removeVideoInput(index)}
                                    title={videos.length > 1 ? "删除视频" : "清空"}
                                    disabled={uploading[index]}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn-add-video"
                            onClick={addVideoInput}
                        >
                            + 添加视频
                        </button>
                    </div>
                    {errors.videos && <div className="error-message">{errors.videos}</div>}
                    {errors[`video_0`] && <div className="error-message">{errors[`video_0`]}</div>}
                    <small className="form-hint">可以输入视频URL地址，或点击📁按钮从本地上传视频文件（支持多个视频）</small>
                </div>
            );
        }

        return null;
    };

    return (
        <form onSubmit={handleSubmit}>
            {formConfig.map(config => renderField(config))}
            <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onCancel}>
                    取消
                </button>
                <button type="submit" className="btn-primary">
                    提交
                </button>
            </div>
        </form>
    );
};

export default DynamicForm;


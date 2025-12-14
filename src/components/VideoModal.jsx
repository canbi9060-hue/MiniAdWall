import React, { useState, useRef, useEffect } from 'react';

const VideoModal = ({ isOpen, videos, landingPage, onClose, onVideoEnd }) => {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const videoRef = useRef(null);

    // 当 videos 变化时，重新加载视频
    // 当弹窗打开或视频列表变化时，重新加载视频
    useEffect(() => {
        if (isOpen && videos && videos.length > 0 && videoRef.current) {
            setIsLoading(true);
            setHasError(false);
            setCurrentVideoIndex(0); // 重置到第一个视频
            const video = videoRef.current;
            
            // 停止当前播放
            video.pause();
            video.currentTime = 0;
            video.muted = true; // 先静音，浏览器更容易允许自动播放
            
            // 加载视频（使用最新的视频URL）
            const currentVideoUrl = videos[0];
            // 强制重新加载（清空src再设置，确保浏览器重新加载）
            if (video.src) {
                video.src = '';
            }
            // 使用 setTimeout 确保清空操作完成
            setTimeout(() => {
                if (videoRef.current && videos && videos.length > 0) {
                    videoRef.current.src = videos[0];
                    videoRef.current.load();
                }
            }, 0);
            
            // 监听视频加载完成
            const handleCanPlay = () => {
                setIsLoading(false);
                // 尝试播放
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            // 播放成功，延迟取消静音（给用户一点时间）
                            setTimeout(() => {
                                if (videoRef.current) {
                                    videoRef.current.muted = false;
                                }
                            }, 500);
                        })
                        .catch(err => {
                            console.error('视频自动播放失败:', err);
                            setIsLoading(false);
                            // 显示提示，让用户点击播放
                        });
                }
            };

            const handleError = () => {
                setIsLoading(false);
                setHasError(true);
                console.error('视频加载失败');
            };

            video.addEventListener('canplay', handleCanPlay);
            video.addEventListener('error', handleError);

            return () => {
                video.removeEventListener('canplay', handleCanPlay);
                video.removeEventListener('error', handleError);
            };
        }
    }, [isOpen, currentVideoIndex, videos]);

    useEffect(() => {
        if (!isOpen) {
            setCurrentVideoIndex(0);
            setIsLoading(true);
            setHasError(false);
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        }
    }, [isOpen]);

    const handleVideoEnd = () => {
        // 当前视频播放完成
        if (currentVideoIndex < videos.length - 1) {
            // 还有下一个视频，播放下一个
            setCurrentVideoIndex(currentVideoIndex + 1);
        } else {
            // 所有视频播放完成，关闭弹窗并跳转
            if (videoRef.current) {
                videoRef.current.pause();
            }
            onVideoEnd();
        }
    };

    const handleClose = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
        onClose();
    };

    const handleSkip = () => {
        // 跳过视频，直接跳转
        if (videoRef.current) {
            videoRef.current.pause();
        }
        onVideoEnd();
    };

    // 当 videos 数组变化时，重置索引并重新加载（使用 videos 的字符串化作为依赖）
    const videosKey = videos ? JSON.stringify(videos) : '';
    useEffect(() => {
        if (videos && videos.length > 0 && isOpen && videoRef.current) {
            if (currentVideoIndex >= videos.length) {
                setCurrentVideoIndex(0);
            }
            // 视频列表变化时，强制重新加载
            const currentVideoUrl = videos[0];
            setCurrentVideoIndex(0);
            setIsLoading(true);
            setHasError(false);
            const video = videoRef.current;
            video.pause();
            video.currentTime = 0;
            video.muted = true;
            // 清空并重新设置src
            video.src = '';
            setTimeout(() => {
                if (videoRef.current && videos && videos.length > 0) {
                    videoRef.current.src = videos[0];
                    videoRef.current.load();
                }
            }, 0);
        }
    }, [videosKey, isOpen]); // 使用 videosKey 而不是 videos，确保检测到数组内容变化

    if (!isOpen || !videos || videos.length === 0) return null;

    const validIndex = Math.min(currentVideoIndex, videos.length - 1);
    const currentVideo = videos[validIndex];

    return (
        <div 
            className="modal show video-modal" 
            id="videoModal"
            onClick={(e) => {
                if (e.target.id === 'videoModal') {
                    handleClose();
                }
            }}
        >
            <div className="modal-content video-modal-content">
                <div className="video-modal-header">
                    <div className="video-progress">
                        视频 {currentVideoIndex + 1} / {videos.length}
                    </div>
                    <div className="video-modal-actions">
                        <button className="btn-skip" onClick={handleSkip}>
                            跳过
                        </button>
                        <button className="close-btn" onClick={handleClose}>&times;</button>
                    </div>
                </div>
                <div className="video-container">
                    {isLoading && !hasError && (
                        <div className="video-loading">
                            <div className="loading-spinner"></div>
                            <p>视频加载中...</p>
                        </div>
                    )}
                    {hasError && (
                        <div className="video-error">
                            <p>视频加载失败</p>
                            <p className="error-hint">请检查视频URL是否正确</p>
                            <button className="btn-retry" onClick={() => {
                                setHasError(false);
                                setIsLoading(true);
                                if (videoRef.current) {
                                    videoRef.current.load();
                                }
                            }}>
                                重试
                            </button>
                        </div>
                    )}
                    <video
                        ref={videoRef}
                        src={currentVideo}
                        controls
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                        onEnded={handleVideoEnd}
                        onPlay={() => setIsLoading(false)}
                        onError={() => {
                            setHasError(true);
                            setIsLoading(false);
                        }}
                        className="video-player"
                        style={{ display: hasError ? 'none' : 'block' }}
                    >
                        您的浏览器不支持视频播放
                    </video>
                </div>
                {videos.length > 1 && (
                    <div className="video-indicators">
                        {videos.map((_, index) => (
                            <div
                                key={index}
                                className={`video-indicator ${index === currentVideoIndex ? 'active' : ''} ${index < currentVideoIndex ? 'completed' : ''}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoModal;


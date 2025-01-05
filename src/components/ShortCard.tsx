import React, { useState, useEffect, useRef } from 'react';
import { ShortCardProps } from '../types/content';
import { VideoCategory } from '../types/content';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  VolumeX, 
  Volume2, 
  Pause, 
  Play 
} from 'lucide-react';

export const ShortCard: React.FC<ShortCardProps> = ({ short, isActive = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(short.likes);
  const [isDoubleTapLiking, setIsDoubleTapLiking] = useState(false);
  const doubleTapTimer = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastTapTime = useRef(0);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch((error) => {
            console.error('Error playing video:', error);
            setIsPlaying(false);
          });
        }
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const time = (percentage / 100) * videoRef.current.duration;
    
    videoRef.current.currentTime = time;
    setProgress(percentage);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVideoTap = () => {
    const currentTime = Date.now();
    const tapLength = currentTime - lastTapTime.current;
    const DOUBLE_TAP_DELAY = 300;

    if (tapLength < DOUBLE_TAP_DELAY) {
      // Double tap detected
      handleLike();
      setIsDoubleTapLiking(true);
      if (doubleTapTimer.current) {
        clearTimeout(doubleTapTimer.current);
      }
      doubleTapTimer.current = setTimeout(() => {
        setIsDoubleTapLiking(false);
      }, 1000);
    }

    lastTapTime.current = currentTime;
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className="relative w-full h-screen max-h-[844px] bg-black">
      {/* Video Container */}
      <div 
        className="relative w-full h-full"
        onClick={handleVideoTap}
      >
        <video
          ref={videoRef}
          src={short.videoUrl}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
        />
        
        {/* Double Tap Like Animation */}
        {isDoubleTapLiking && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart className="w-24 h-24 text-red-500 animate-ping" fill="red" />
          </div>
        )}

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          {/* Progress Bar */}
          <div 
            ref={progressRef}
            className="w-full h-1 bg-gray-600 rounded cursor-pointer mb-4"
            onClick={handleProgressBarClick}
          >
            <div 
              className="h-full bg-white rounded"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
              className="bg-black/40 p-2 rounded-full"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </button>

            <div className="flex items-center gap-4">
              <span className="text-white text-sm">
                {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="bg-black/40 p-2 rounded-full"
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6 text-white" />
                ) : (
                  <Volume2 className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center mb-4">
            <img
              src={short.userAvatar}
              alt={short.username}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-white font-medium">@{short.username}</span>
          </div>
          
          {/* Title and Description */}
          <h2 className="text-white font-semibold mb-2">{short.title}</h2>
          <p className="text-white/80 text-sm">{short.description}</p>
        </div>

        {/* Right side buttons */}
        <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6">
          {/* Like Button */}
          <button 
            className="flex flex-col items-center"
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
          >
            <div className="bg-black/40 p-2 rounded-full">
              <Heart 
                className={`w-6 h-6 ${isLiked ? 'text-red-500' : 'text-white'}`}
                fill={isLiked ? 'currentColor' : 'none'}
              />
            </div>
            <span className="text-white text-sm mt-1">{likeCount}</span>
          </button>

          {/* Comment Button */}
          <button className="flex flex-col items-center">
            <div className="bg-black/40 p-2 rounded-full">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-sm mt-1">Comments</span>
          </button>

          {/* Share Button */}
          <button className="flex flex-col items-center">
            <div className="bg-black/40 p-2 rounded-full">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-sm mt-1">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortCard;
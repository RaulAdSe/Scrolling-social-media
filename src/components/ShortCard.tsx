import React, { useState, useEffect, useRef } from 'react';
import { ShortCardProps } from '../types/content';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  VolumeX, 
  Volume2, 
  Pause, 
  Play,
  Info
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
  const [showInfo, setShowInfo] = useState(false);
  const doubleTapTimer = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastTapTime = useRef(0);

  // Video playback control effects
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

  // Video progress tracking
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

  // Get category color
  const getCategoryColor = () => {
    const colors: Record<string, string> = {
      music: 'bg-purple-500',
      sports: 'bg-green-500',
      gaming: 'bg-blue-500',
      education: 'bg-yellow-500',
      entertainment: 'bg-pink-500'
    };
    return colors[short.category] || 'bg-gray-500';
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

        {/* Info Overlay */}
        {showInfo && (
          <div className="absolute inset-0 bg-black/80 p-4 flex flex-col justify-center">
            <h3 className="text-white font-semibold mb-2">Video Information</h3>
            <p className="text-white/90 mb-1">Category: {short.category}</p>
            <p className="text-white/90 mb-1">Duration: {short.duration}</p>
            <p className="text-white/90 mb-1">Tags: {short.tags.join(', ')}</p>
            <p className="text-white/90">Views: {short.views.toLocaleString()}</p>
          </div>
        )}

        {/* Bottom Controls Container */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-20 pb-6">
          {/* Progress Bar */}
          <div className="px-4 mb-4">
            <div 
              ref={progressRef}
              className="w-full h-1 bg-gray-600 rounded cursor-pointer"
              onClick={handleProgressBarClick}
            >
              <div 
                className="h-full bg-white rounded"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="px-4">
            {/* User Info and Title */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={short.userAvatar}
                  alt={short.username}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-white font-medium">@{short.username}</span>
              </div>
              <h2 className="text-white font-semibold text-lg">{short.title}</h2>
              <p className="text-white/80 text-sm mt-1">{short.description}</p>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayPause();
                  }}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white" />
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>

                <span className="text-white/80 text-sm">
                  {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                </span>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike();
                  }}
                  className="flex items-center gap-1"
                >
                  <Heart 
                    className={`w-6 h-6 ${isLiked ? 'text-red-500' : 'text-white'}`}
                    fill={isLiked ? 'currentColor' : 'none'}
                  />
                  <span className="text-white text-sm">{likeCount.toLocaleString()}</span>
                </button>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfo(!showInfo);
                  }}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <Info className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full ${getCategoryColor()} text-white text-sm font-medium`}>
          {short.category}
        </div>
      </div>
    </div>
  );
};

export default ShortCard;
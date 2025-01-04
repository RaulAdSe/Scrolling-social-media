// src/components/ShortCard.tsx
import { useState, useEffect, useRef } from 'react';
import { ShortCardProps } from '../types/content';
import { Heart, MessageCircle, Share2, VolumeX, Volume2 } from 'lucide-react';

export const ShortCard: React.FC<ShortCardProps> = ({ short, isActive = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('Error playing video:', error);
          });
        }
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setError('Error loading video');
  };

  return (
    <div className="relative w-full h-screen max-h-[844px] bg-black">
      {/* Video Container */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          src={short.videoUrl}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent" />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <p className="text-white">Failed to load video</p>
          </div>
        )}
        
        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 bg-black/40 p-2 rounded-full"
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-white" />
          ) : (
            <Volume2 className="w-6 h-6 text-white" />
          )}
        </button>
        
        {/* Overlay for title and description */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
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
          <button className="flex flex-col items-center">
            <div className="bg-black/40 p-2 rounded-full">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-sm mt-1">{formatNumber(short.likes)}</span>
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
// src/services/api.ts
import { Short, ShortsResponse, VideoCategory } from '../types/content';

// Mock database of videos with proper categorization
const VIDEO_DATABASE = [
  // Music Category
  {
    id: 'music-1',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    title: 'Street Music Performance 🎸',
    description: 'Amazing street musician playing guitar #music #street #live',
    category: 'music',
    tags: ['music', 'street', 'performance']
  },
  {
    id: 'music-2',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    title: 'Piano Concerto Highlights 🎹',
    description: 'Beautiful classical piano performance #classical #piano #concert',
    category: 'music',
    tags: ['classical', 'piano', 'concert']
  },

  // Sports Category
  {
    id: 'sports-1',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    title: 'Basketball Highlights 🏀',
    description: 'Amazing basketball plays from the weekend #sports #basketball',
    category: 'sports',
    tags: ['sports', 'basketball', 'highlights']
  },
  {
    id: 'sports-2',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    title: 'Soccer Goals Compilation ⚽',
    description: 'Best soccer goals of the month #soccer #sports #goals',
    category: 'sports',
    tags: ['sports', 'soccer', 'goals']
  },

  // Gaming Category
  {
    id: 'gaming-1',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    title: 'Epic Gaming Moment 🎮',
    description: 'Incredible gameplay highlights from latest releases #gaming #gameplay',
    category: 'gaming',
    tags: ['gaming', 'gameplay', 'highlights']
  },
  {
    id: 'gaming-2',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    title: 'Speedrun World Record 🏃',
    description: 'New world record speedrun attempt #gaming #speedrun',
    category: 'gaming',
    tags: ['gaming', 'speedrun', 'record']
  },

  // Education Category
  {
    id: 'education-1',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    title: 'Quick Math Tricks 📚',
    description: 'Learn these simple math tricks to calculate faster #education #math',
    category: 'education',
    tags: ['education', 'math', 'tutorial']
  },
  {
    id: 'education-2',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    title: 'Science Experiment 🧪',
    description: 'Amazing chemical reaction explained #science #education #experiment',
    category: 'education',
    tags: ['education', 'science', 'experiment']
  },

  // Entertainment Category
  {
    id: 'entertainment-1',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    title: 'Funny Moments Compilation 😂',
    description: 'Best funny moments of the week #entertainment #funny #compilation',
    category: 'entertainment',
    tags: ['entertainment', 'funny', 'compilation']
  },
  {
    id: 'entertainment-2',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    title: 'Magic Tricks Revealed ✨',
    description: 'Amazing magic tricks and how they work #magic #entertainment',
    category: 'entertainment',
    tags: ['entertainment', 'magic', 'tutorial']
  }
];

// Helper function to generate random user data
const generateUserData = (videoId: string) => {
  const usernames = ['creator', 'influencer', 'content_master', 'viral_star', 'trending_now'];
  const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
  
  return {
    username: `${randomUsername}_${videoId}`,
    userAvatar: `/api/placeholder/${40 + Math.floor(Math.random() * 20)}/${40 + Math.floor(Math.random() * 20)}`
  };
};

// Helper function to generate engagement metrics
const generateEngagementMetrics = () => {
  return {
    likes: Math.floor(Math.random() * 1000000),
    views: Math.floor(Math.random() * 10000000),
    duration: `0:${(Math.floor(Math.random() * 45) + 15).toString().padStart(2, '0')}` // 15-60 seconds
  };
};

export const fetchShorts = async (
  cursor?: string,
  category?: VideoCategory,
  limit: number = 5
): Promise<ShortsResponse> => {
  try {
    // Filter videos by category if specified
    let filteredVideos = category
      ? VIDEO_DATABASE.filter(video => video.category === category)
      : VIDEO_DATABASE;

    // Handle pagination
    const page = cursor ? parseInt(cursor) : 0;
    const startIdx = (page * limit) % filteredVideos.length;
    
    // Get videos for current page
    const pageVideos = Array.from({ length: Math.min(limit, filteredVideos.length) }, (_, i) => {
      const videoIdx = (startIdx + i) % filteredVideos.length;
      const baseVideo = filteredVideos[videoIdx];
      const userData = generateUserData(baseVideo.id);
      const metrics = generateEngagementMetrics();
      
      return {
        ...baseVideo,
        ...userData,
        ...metrics,
        thumbnailUrl: `/api/placeholder/390/844`,
        createdAt: new Date(Date.now() - Math.random() * 7776000000).toISOString() // Random date within last 90 days
      };
    });

    // Determine if there are more pages
    const hasMore = (page + 1) * limit < filteredVideos.length;

    return {
      items: pageVideos,
      nextCursor: hasMore ? String(page + 1) : null,
      hasMore
    };
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};
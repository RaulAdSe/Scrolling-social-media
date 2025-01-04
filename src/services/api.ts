// src/services/api.ts
import { Short, ShortsResponse } from '../types/content';

export const fetchShorts = async (
  cursor?: string,
  limit: number = 5
): Promise<ShortsResponse> => {
  try {
    // Using reliable CDN hosted videos
    const demoVideos = [
      'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/bbb.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
    ];

    const videoTitles = [
      "Streaming Test 🎥",
      "Big Buck Bunny 🐰",
      "For Bigger Blazes 🔥",
      "For Bigger Escapes 🚀",
      "For Bigger Fun 🎮"
    ];

    const videoDescriptions = [
      "A test video stream for your viewing pleasure #testing",
      "The classic Big Buck Bunny animation #animation #classic",
      "Watch this amazing video about blazes! #video #cool",
      "An exciting escape sequence #action #adventure",
      "Fun times ahead with this video #fun #entertainment"
    ];

    const page = cursor ? parseInt(cursor) : 0;
    const startIdx = (page * limit) % demoVideos.length;
    
    const mockShorts: Short[] = Array.from({ length: limit }, (_, i) => {
      const videoIdx = (startIdx + i) % demoVideos.length;
      return {
        id: `${page}-${i}`,
        username: `creator_${videoIdx + 1}`,
        userAvatar: `/api/placeholder/50/50`,
        videoUrl: demoVideos[videoIdx],
        thumbnailUrl: `/api/placeholder/390/844`,
        title: videoTitles[videoIdx],
        likes: Math.floor(Math.random() * 100000),
        views: Math.floor(Math.random() * 1000000),
        duration: "0:30",
        description: videoDescriptions[videoIdx],
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      };
    });

    return {
      items: mockShorts,
      nextCursor: String(page + 1),
      hasMore: true,
    };
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};
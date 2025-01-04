// src/types/content.ts

export interface Short {
    id: string;
    username: string;
    userAvatar: string;
    videoUrl: string; // In our mock we'll use placeholder
    thumbnailUrl: string;
    title: string;
    likes: number;
    views: number;
    duration: string;
    createdAt: string;
    description: string;
  }
  
  export interface ShortsResponse {
    items: Short[];
    nextCursor?: string;
    hasMore: boolean;
  }
  
  export interface ShortsProps {
    items: Short[];
    isLoading: boolean;
    isError: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
  }
  
  export interface ShortCardProps {
    short: Short;
    isActive?: boolean;
  }
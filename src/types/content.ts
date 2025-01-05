// src/types/content.ts

export type VideoCategory = 'gaming' | 'music' | 'education' | 'entertainment' | 'sports';

export interface Short {
  id: string;
  username: string;
  userAvatar: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  likes: number;
  views: number;
  duration: string;
  description: string;
  createdAt: string;
  category?: VideoCategory;
  tags?: string[];
}

export interface ShortsResponse {
  items: Short[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ShortCardProps {
  short: Short;
  isActive?: boolean;
}

export interface ContentCardProps {
  content: {
    title: string;
    description: string;
    createdAt: string;
  };
}

export interface ShortsProps {
  items: Short[];
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  selectedCategory?: VideoCategory;
}

export interface CategoryFilterProps {
  selectedCategory?: VideoCategory;
  onCategorySelect: (category: VideoCategory | undefined) => void;
}
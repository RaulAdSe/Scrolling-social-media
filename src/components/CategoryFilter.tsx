'use client';

import React from 'react';
import { VideoCategory, CategoryFilterProps } from '../types/content';
import { 
  Music, 
  Trophy,
  Gamepad, 
  GraduationCap,
  Film,
} from 'lucide-react';

const CATEGORIES: { value: VideoCategory; label: string; icon: React.ReactNode }[] = [
  { value: 'music', label: 'Music', icon: <Music className="w-5 h-5" /> },
  { value: 'sports', label: 'Sports', icon: <Trophy className="w-5 h-5" /> },
  { value: 'gaming', label: 'Gaming', icon: <Gamepad className="w-5 h-5" /> },
  { value: 'education', label: 'Education', icon: <GraduationCap className="w-5 h-5" /> },
  { value: 'entertainment', label: 'Entertainment', icon: <Film className="w-5 h-5" /> },
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-2 p-2 overflow-x-auto no-scrollbar">
        <button
          className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${!selectedCategory 
              ? 'bg-foreground text-background' 
              : 'bg-foreground/10 text-foreground hover:bg-foreground/20'
            }`}
          onClick={() => onCategorySelect(undefined)}
        >
          All
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category.value}
            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${selectedCategory === category.value
                ? 'bg-foreground text-background'
                : 'bg-foreground/10 text-foreground hover:bg-foreground/20'
              }`}
            onClick={() => onCategorySelect(category.value)}
          >
            {category.icon}
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export { CategoryFilter };
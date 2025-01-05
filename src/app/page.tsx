'use client';

import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ShortsContainer } from '@/components/ShortsContainer';
import { CategoryFilter } from '@/components/CategoryFilter';
import { fetchShorts } from '@/services/api';
import { ShortsResponse, VideoCategory } from '@/types/content';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | undefined>();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError,
    refetch
  } = useInfiniteQuery<ShortsResponse, Error>({
    queryKey: ['shorts', selectedCategory],
    queryFn: ({ pageParam }) => 
      fetchShorts(pageParam?.toString(), selectedCategory),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  const handleCategorySelect = (category: VideoCategory | undefined) => {
    setSelectedCategory(category);
    refetch();
  };

  return (
    <main className="h-screen bg-black overflow-hidden">
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
      <div className="h-full pt-16">
        <ShortsContainer
          items={items}
          isLoading={isFetching}
          isError={isError}
          hasMore={hasNextPage ?? false}
          onLoadMore={() => fetchNextPage()}
          selectedCategory={selectedCategory}
        />
      </div>
    </main>
  );
}
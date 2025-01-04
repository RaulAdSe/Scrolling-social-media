// src/app/page.tsx
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { ShortsContainer } from '@/components/ShortsContainer';
import { fetchShorts } from '@/services/api';
import { ShortsResponse } from '@/types/content';

export default function Home() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError,
  } = useInfiniteQuery<ShortsResponse, Error>({
    queryKey: ['shorts'],
    queryFn: ({ pageParam = undefined }) => fetchShorts(pageParam as string | undefined),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <main className="h-screen bg-black overflow-hidden">
      <ShortsContainer
        items={items}
        isLoading={isFetching}
        isError={isError}
        hasMore={hasNextPage ?? false}
        onLoadMore={() => fetchNextPage()}
      />
    </main>
  );
}
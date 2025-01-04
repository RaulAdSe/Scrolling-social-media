// src/components/InfiniteScroll.tsx
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { ContentCard } from './ContentCard';
import { InfiniteScrollProps } from '../types/content';

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  items,
  isLoading,
  isError,
  hasMore,
  onLoadMore,
}) => {
  const { lastElementRef } = useInfiniteScroll({
    onLoadMore,
    hasMore,
    isLoading,
  });

  if (isError) {
    return (
      <div className="text-center text-red-500 py-8">
        Error loading content. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div
            key={item.id}
            ref={index === items.length - 1 ? lastElementRef : undefined}
          >
            <ContentCard content={item} />
          </div>
        ))}
      </div>
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        </div>
      )}
    </div>
  );
};
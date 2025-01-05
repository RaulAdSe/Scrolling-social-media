// src/components/ShortsContainer.tsx
import { useState, useEffect } from 'react';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { ShortCard } from './ShortCard';
import { Short, ShortsProps } from '../types/content';

const ShortsContainer: React.FC<ShortsProps> = ({
  items,
  isLoading,
  isError,
  hasMore,
  onLoadMore,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { lastElementRef } = useInfiniteScroll({
    onLoadMore,
    hasMore,
    isLoading,
  });

  useEffect(() => {
    const handleScroll = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-index'));
          if (!isNaN(index)) {
            setActiveIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleScroll, {
      threshold: 0.7,
    });

    const containers = document.querySelectorAll('.short-container');
    containers.forEach((container) => observer.observe(container));

    return () => observer.disconnect();
  }, [items]);

  if (isError) {
    return (
      <div className="text-center text-red-500 py-8">
        Error loading shorts. Please try again later.
      </div>
    );
  }

  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
      {items.map((item: Short, index: number) => (
        <div
          key={item.id}
          ref={index === items.length - 1 ? lastElementRef : undefined}
          className="short-container snap-start w-full h-screen flex items-center justify-center"
          data-index={index}
        >
          <ShortCard 
            short={item} 
            isActive={index === activeIndex}
          />
        </div>
      ))}
      {isLoading && (
        <div className="flex items-center justify-center h-screen">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent" />
        </div>
      )}
    </div>
  );
};

export { ShortsContainer };
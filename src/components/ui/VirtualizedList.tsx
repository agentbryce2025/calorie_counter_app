import React, { useEffect, useRef, useState } from 'react';

interface VirtualizedListProps<T> {
  data: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
  itemKey?: (item: T, index: number) => string | number;
  onScroll?: (scrollTop: number) => void;
}

/**
 * A virtualized list component that only renders items currently visible in the viewport.
 * This significantly improves performance for large lists by reducing DOM elements.
 */
function VirtualizedList<T>({
  data,
  height,
  itemHeight,
  renderItem,
  overscan = 3,
  className = '',
  itemKey,
  onScroll
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const totalHeight = data.length * itemHeight;

  // Calculate which items should be visible
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    data.length - 1,
    Math.floor((scrollTop + height) / itemHeight) + overscan
  );
  
  // Items that will actually be rendered
  const visibleItems = data.slice(startIndex, endIndex + 1);
  
  // Handle scroll events
  const handleScroll = () => {
    if (containerRef.current) {
      const newScrollTop = containerRef.current.scrollTop;
      setScrollTop(newScrollTop);
      onScroll?.(newScrollTop);
    }
  };
  
  // Register a scroll listener when the component mounts
  useEffect(() => {
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener('scroll', handleScroll);
      return () => currentContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height }}
      data-testid="virtualized-list-container"
    >
      <div
        className="relative w-full"
        style={{ height: totalHeight }}
        data-testid="virtualized-list-inner"
      >
        {visibleItems.map((item, relativeIndex) => {
          const actualIndex = startIndex + relativeIndex;
          const key = itemKey ? itemKey(item, actualIndex) : actualIndex;
          
          return (
            <div
              key={key}
              className="absolute w-full"
              style={{
                top: actualIndex * itemHeight,
                height: itemHeight
              }}
              data-testid={`virtualized-item-${actualIndex}`}
            >
              {renderItem(item, actualIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VirtualizedList;
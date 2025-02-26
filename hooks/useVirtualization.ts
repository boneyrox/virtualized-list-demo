import { useState, useEffect, useMemo } from 'react';
import { VirtualizationConfig } from '../types';

export const useVirtualization = ({
  totalItems,
  itemHeight,
  containerHeight,
  overscan = 3
}: VirtualizationConfig) => {
  const [scrollTop, setScrollTop] = useState(0);

  const {
    startIndex,
    endIndex,
    visibleItems,
    totalHeight
  } = useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const end = Math.min(totalItems - 1, start + visibleCount + 2 * overscan);

    return {
      startIndex: start,
      endIndex: end,
      visibleItems: end - start + 1,
      totalHeight: totalItems * itemHeight
    };
  }, [scrollTop, containerHeight, itemHeight, totalItems, overscan]);

  return {
    startIndex,
    endIndex,
    scrollTop,
    setScrollTop,
    totalHeight,
    visibleItems
  };
};
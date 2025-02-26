"use client";

import type React from "react";
import { useState, useCallback, useMemo } from "react";

type Item = {
  id: number;
  text: string;
};

type VirtualizedListProps = {
  items: Item[];
};

const ITEM_HEIGHT = 50;
const WINDOW_HEIGHT = 400;
const BUFFER_ITEMS = 5;

const VirtualizedList: React.FC<VirtualizedListProps> = ({ items }) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItemCount = Math.ceil(WINDOW_HEIGHT / ITEM_HEIGHT);
  const totalHeight = items.length * ITEM_HEIGHT;

  const getVisibleRange = useCallback(() => {
    const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
    const endIndex = Math.min(
      startIndex + visibleItemCount + BUFFER_ITEMS,
      items.length
    );
    return { startIndex: Math.max(0, startIndex - BUFFER_ITEMS), endIndex };
  }, [scrollTop, items.length, visibleItemCount]);

  const visibleItems = useMemo(() => {
    const { startIndex, endIndex } = getVisibleRange();
    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index,
    }));
  }, [getVisibleRange, items]);

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      id="virtualized-list"
      className="border border-gray-700 rounded overflow-auto"
      style={{ height: WINDOW_HEIGHT }}
      onScroll={onScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleItems.map((item) => (
          <div
            key={item.id}
            className="absolute w-full p-4 border-b border-gray-700"
            style={{
              height: ITEM_HEIGHT,
              top: item.index * ITEM_HEIGHT,
            }}
          >
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualizedList;

"use client";

import { useState, useEffect, useCallback } from "react";

type PerformanceMetricsProps = {
  listType: "virtualized" | "normal";
};

const PerformanceMetrics = ({ listType }: PerformanceMetricsProps) => {
  const [renderTime, setRenderTime] = useState<number | null>(null);
  const [scrollTime, setScrollTime] = useState<number | null>(null);
  const [scrollLoadMetrics, setScrollLoadMetrics] = useState<{
    avgFrameTime: number;
    droppedFrames: number;
  } | null>(null);

  const measureScrollLoad = useCallback(() => {
    const list = document.querySelector(`#${listType}-list`);
    if (!list) return;

    let frames = 0;
    let totalFrameTime = 0;
    let droppedFrames = 0;
    let lastFrameTime = performance.now();
    let isScrolling = false;

    const frameCallback = () => {
      if (!isScrolling) return;

      const now = performance.now();
      const frameTime = now - lastFrameTime;

      // Frame times over 16.67ms (60fps) are considered dropped frames
      if (frameTime > 16.67) {
        droppedFrames++;
      }

      totalFrameTime += frameTime;
      frames++;
      lastFrameTime = now;

      requestAnimationFrame(frameCallback);
    };

    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(frameCallback);
      }
    };

    const handleScrollEnd = () => {
      setTimeout(() => {
        isScrolling = false;
        const avgFrameTime = totalFrameTime / frames;
        setScrollLoadMetrics({
          avgFrameTime,
          droppedFrames,
        });
      }, 150);
    };

    list.addEventListener("scroll", handleScroll, { passive: true });
    list.addEventListener("scrollend", handleScrollEnd, { passive: true });

    return () => {
      list.removeEventListener("scroll", handleScroll);
      list.removeEventListener("scrollend", handleScrollEnd);
    };
  }, [listType]);

  const measureScrollPerformance = useCallback(() => {
    const list = document.querySelector(`#${listType}-list`);
    if (!list) return;

    return new Promise<number>((resolve) => {
      // Reset scroll position to top first
      list.scrollTop = 0;

      // Wait for any potential scroll animations to settle
      requestAnimationFrame(() => {
        const startScroll = performance.now();

        list.scrollTop = list.scrollHeight;

        // Listen for scroll end
        const handleScroll = () => {
          if (list.scrollTop + list.clientHeight >= list.scrollHeight) {
            const endScroll = performance.now();
            list.removeEventListener("scroll", handleScroll);
            resolve(endScroll - startScroll);
          }
        };

        list.addEventListener("scroll", handleScroll, { passive: true });
      });
    });
  }, [listType]);

  useEffect(() => {
    let isMounted = true;
    let cleanup: (() => void) | undefined;

    const measurePerformance = async () => {
      const renderStart = performance.now();

      requestAnimationFrame(async () => {
        if (!isMounted) return;

        const renderEnd = performance.now();
        setRenderTime(renderEnd - renderStart);

        await new Promise((resolve) => setTimeout(resolve, 100));

        try {
          const scrollDuration = await measureScrollPerformance();
          if (isMounted && scrollDuration !== undefined) {
            setScrollTime(scrollDuration);
          }
        } catch (error) {
          console.error("Error measuring scroll performance:", error);
        }

        cleanup = measureScrollLoad();
      });
    };

    measurePerformance();

    return () => {
      isMounted = false;
      if (cleanup) cleanup();
    };
  }, [listType, measureScrollPerformance, measureScrollLoad]);

  return (
    <div className="mt-4 p-4 bg-gray-800 rounded">
      <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
      <p>
        Initial Render Time:{" "}
        {renderTime ? `${renderTime.toFixed(2)} ms` : "Measuring..."}
      </p>
      <p>
        Scroll to Bottom Time:{" "}
        {scrollTime ? `${scrollTime.toFixed(2)} ms` : "Measuring..."}
      </p>
      {scrollLoadMetrics && (
        <div className="mt-2">
          <p className="text-amber-400">Scroll Performance:</p>
          <p className="ml-2">
            Average Frame Time: {scrollLoadMetrics.avgFrameTime.toFixed(2)} ms
            {scrollLoadMetrics.avgFrameTime > 16.67 && (
              <span className="text-red-400 ml-2">(Poor)</span>
            )}
          </p>
          <p className="ml-2">
            Dropped Frames: {scrollLoadMetrics.droppedFrames}
            {scrollLoadMetrics.droppedFrames > 0 && (
              <span className="text-red-400 ml-2">(Jank detected)</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default PerformanceMetrics;

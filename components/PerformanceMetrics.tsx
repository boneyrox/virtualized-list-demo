"use client"

import { useState, useEffect } from "react"

type PerformanceMetricsProps = {
  listType: "virtualized" | "normal"
}

const PerformanceMetrics = ({ listType }: PerformanceMetricsProps) => {
  const [renderTime, setRenderTime] = useState<number | null>(null)
  const [scrollTime, setScrollTime] = useState<number | null>(null)

  useEffect(() => {
    const start = performance.now()

    // Use requestAnimationFrame to ensure we measure after the list has rendered
    requestAnimationFrame(() => {
      const end = performance.now()
      setRenderTime(end - start)
    })

    // Measure scroll performance
    const measureScrollPerformance = () => {
      const list = document.querySelector(`#${listType}-list`)
      if (list) {
        const startScroll = performance.now()
        list.scrollTop = list.scrollHeight
        const endScroll = performance.now()
        setScrollTime(endScroll - startScroll)
      }
    }

    // Wait a bit to ensure the list is fully rendered before measuring scroll performance
    setTimeout(measureScrollPerformance, 100)
  }, [listType])

  return (
    <div className="mt-4 p-4 bg-gray-800 rounded">
      <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
      <p>Initial Render Time: {renderTime ? `${renderTime.toFixed(2)} ms` : "Measuring..."}</p>
      <p>Scroll to Bottom Time: {scrollTime ? `${scrollTime.toFixed(2)} ms` : "Measuring..."}</p>
    </div>
  )
}

export default PerformanceMetrics


import VirtualizedList from "@/components/VirtualizedList"
import NormalList from "@/components/NormalList"
import PerformanceMetrics from "@/components/PerformanceMetrics"

// Generate dummy data
const generateItems = (count: number) => Array.from({ length: count }, (_, i) => ({ id: i, text: `Item ${i + 1}` }))

const items = generateItems(10000)

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Custom Virtualized vs Normal List Demo</h1>
      <div className="flex w-full space-x-4">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">Custom Virtualized List</h2>
          <VirtualizedList items={items} />
          <PerformanceMetrics listType="virtualized" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">Normal List</h2>
          <NormalList items={items} />
          <PerformanceMetrics listType="normal" />
        </div>
      </div>
    </main>
  )
}


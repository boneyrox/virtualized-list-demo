import { useMemo } from "react";

interface ListItemProps {
  item: {
    id: number;
    text: string;
    calculations: number[];
    timestamp: string;
    metadata: {
      color: string;
      priority: number;
      tags: string[];
    };
  };
  style?: React.CSSProperties;
}

const ListItem = ({ item, style }: ListItemProps) => {
  // Expensive calculation simulation
  const computedValue = useMemo(() => {
    return item.calculations.reduce((acc, curr) => {
      // Artificial computational load
      let result = acc;
      for (let i = 0; i < 100; i++) {
        result += Math.pow(curr, 2) / (i + 1);
      }
      return result;
    }, 0);
  }, [item.calculations]);

  return (
    <div
      className="p-4 border-b border-gray-700 hover:bg-gray-800 transition-colors"
      style={{
        ...style,
        background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${item.metadata.color}22 100%)`,
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{item.text}</h3>
          <p className="text-sm text-gray-400">
            Priority: {Array(item.metadata.priority).fill("⭐").join("")}
          </p>
        </div>
        <div className="text-right text-sm text-gray-400">
          {new Date(item.timestamp).toLocaleTimeString()}
        </div>
      </div>
      <div className="mt-2 text-sm">
        <span className="text-gray-400">Computed: </span>
        <span className="font-mono">{computedValue.toFixed(2)}</span>
      </div>
      <div className="mt-2 flex gap-2">
        {item.metadata.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-700 rounded-full text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ListItem;

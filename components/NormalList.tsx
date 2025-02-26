"use client"

type Item = {
  id: number
  text: string
}

type NormalListProps = {
  items: Item[]
}

const NormalList = ({ items }: NormalListProps) => {
  return (
    <div id="normal-list" className="border border-gray-700 rounded h-[400px] overflow-y-auto">
      {items.map((item) => (
        <div key={item.id} className="p-4 border-b border-gray-700">
          {item.text}
        </div>
      ))}
    </div>
  )
}

export default NormalList


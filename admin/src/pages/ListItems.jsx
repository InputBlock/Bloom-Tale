import { Search } from "lucide-react"
import ItemCard from "../components/ListItems/ItemCard"

export default function ListItems() {
  const items = [
    { id: "10001", name: "Red Rose Bouquet", category: "Roses", price: "25.00", stock: 120 },
    { id: "10002", name: "Sunflower Delight", category: "Sunflowers", price: "60.00", stock: 85 },
    { id: "10003", name: "Tulip Garden", category: "Tulips", price: "45.00", stock: 0 },
    { id: "10004", name: "Lily Elegance", category: "Lilies", price: "55.00", stock: 45 },
    { id: "10005", name: "Mixed Bouquet", category: "Mixed", price: "35.00", stock: 92 },
  ]

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by item ID or name..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

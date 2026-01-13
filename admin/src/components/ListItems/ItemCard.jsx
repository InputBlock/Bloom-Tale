import { ChevronDown } from "lucide-react"

export default function ItemCard({ item }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center">
          <span className="text-gray-600 font-bold text-sm">#{item.id}</span>
        </div>
        <div>
          <h3 className="text-gray-900 font-semibold text-lg">{item.name}</h3>
          <p className="text-gray-500 text-sm">{item.category}</p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div>
          <p className="text-gray-500 text-xs mb-1">PRICE</p>
          <p className="text-gray-900 font-bold text-lg">${item.price}</p>
        </div>

        <div>
          <p className="text-gray-500 text-xs mb-1">STOCK</p>
          <p className="text-gray-900 font-bold text-lg">{item.stock}</p>
        </div>

        <button
          className={`px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
            item.stock > 0
              ? "bg-gray-200 text-gray-900"
              : "bg-red-100 text-red-600"
          }`}
        >
          {item.stock > 0 ? "Active" : "Out of Stock"}
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  )
}

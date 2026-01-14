import { useState } from "react"

export default function ProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "Rose",
    color: "Red",
    price: "",
    quantities: [],
    inStock: true,
  })

  const quantities = [6, 12, 24, 36, 50]

  const toggleQuantity = (qty) => {
    setFormData(prev => ({
      ...prev,
      quantities: prev.quantities.includes(qty)
        ? prev.quantities.filter(q => q !== qty)
        : [...prev.quantities, qty]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-900 font-medium mb-2">Flower Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Red Rose, Sunflower, Tulip"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      <div>
        <label className="block text-gray-900 font-medium mb-2">Product Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Write a detailed description about the flower (origin, care tips, occasions, etc.)"
          rows={5}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-900 font-medium mb-2">Category</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option>Rose</option>
            <option>Tulip</option>
            <option>Sunflower</option>
            <option>Lily</option>
            <option>Orchid</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-900 font-medium mb-2">sub category</label>
          <select
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option>Red</option>
            <option>White</option>
            <option>Pink</option>
            <option>Yellow</option>
            <option>Purple</option>
            <option>Mixed</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-900 font-medium mb-2">Price</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
              step="0.01"
              className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-gray-900 font-medium mb-3">Quantity Options (stems)</label>
        <div className="flex flex-wrap gap-3">
          {quantities.map((qty) => (
            <button
              key={qty}
              type="button"
              onClick={() => toggleQuantity(qty)}
              className={`px-6 py-3 rounded-full border-2 transition ${
                formData.quantities.includes(qty)
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400"
              }`}
            >
              {qty}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="inStock"
          checked={formData.inStock}
          onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
          className="w-5 h-5 accent-black"
        />
        <label htmlFor="inStock" className="text-gray-900 font-medium cursor-pointer">
          In Stock
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition"
      >
        Add Flower Product
      </button>
    </form>
  )
}

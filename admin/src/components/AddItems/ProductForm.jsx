import { useState } from "react"
import axios from "axios"
import { CheckCircle2, XCircle, X } from "lucide-react"

const API_URL = "http://localhost:8000/api/v1/admin"

const initialForm = {
  name: "",
  description: "",
  type: "Rose",
  color: "Red",
  price: "",
  quantities: [],
  inStock: true,
}

export default function ProductForm({ images, setImages }) {
  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const quantities = [6, 12, 24, 36, 50]

  const toggleQuantity = (qty) => {
    setFormData(prev => ({
      ...prev,
      quantities: prev.quantities.includes(qty)
        ? prev.quantities.filter(q => q !== qty)
        : [...prev.quantities, qty]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = new FormData()
      data.append("name", formData.name)
      data.append("description", formData.description)
      data.append("category", formData.type)
      data.append("subcategory", formData.color)
      data.append("price", formData.price)
      data.append("sizes", JSON.stringify(formData.quantities))
      data.append("stock", formData.inStock ? 100 : 0)
      
      if (images[0]?.file) {
        data.append("image", images[0].file)
      }

      await axios.post(`${API_URL}/add`, data)
      setMessage({ type: "success", text: "Product added successfully!" })
      setFormData(initialForm)
      setImages([])
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error.response?.data?.error || "Failed to add product" 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Message Modal */}
      {message && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setMessage(null)}>
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md mx-4 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setMessage(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <div className="flex justify-center mb-4">
              {message.type === "success" 
                ? <CheckCircle2 size={80} className="text-green-500" />
                : <XCircle size={80} className="text-red-500" />
              }
            </div>
            <h3 className={`text-2xl font-bold text-center mb-2 ${message.type === "success" ? "text-green-700" : "text-red-700"}`}>
              {message.type === "success" ? "Success!" : "Error"}
            </h3>
            <p className="text-gray-600 text-center text-lg">{message.text}</p>
          </div>
        </div>
      )}

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
            <label className="block text-gray-900 font-medium mb-2">Sub Category</label>
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

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <input
            type="checkbox"
            id="inStock"
            checked={formData.inStock}
            onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
            className="w-5 h-5 accent-black cursor-pointer"
          />
          <label htmlFor="inStock" className="text-gray-900 font-medium cursor-pointer select-none">
            In Stock
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? "Adding Product..." : "Add Flower Product"}
        </button>
      </form>
    </>
  )
}

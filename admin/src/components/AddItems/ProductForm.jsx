import { useState, useEffect } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, X } from "lucide-react"

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
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" })
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [message])

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
    setMessage({ type: "", text: "" })
    setLoading(true)

    try {
      const token = localStorage.getItem("adminToken")
      
      const response = await axios.post(
        "http://localhost:8000/api/v1/admin/add",
        {
          name: formData.name,
          description: formData.description,
          category: formData.type,
          subcategory: formData.color,
          price: parseFloat(formData.price),
          sizes: formData.quantities,
          stock: formData.inStock ? 100 : 0
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )

      setMessage({ type: "success", text: "Product added successfully!" })
      // Reset form
      setFormData({
        name: "",
        description: "",
        type: "Rose",
        color: "Red",
        price: "",
        quantities: [],
        inStock: true,
      })
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to connect to server. Please try again."
      setMessage({ type: "error", text: errorMessage })
      console.error("Error adding product:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {message.text && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setMessage({ type: "", text: "" })}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
            >
              <div className="relative bg-white rounded-xl shadow-2xl p-8">
                {/* Close Button */}
                <button
                  onClick={() => setMessage({ type: "", text: "" })}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  {message.type === "success" ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                      className="text-green-500"
                    >
                      <CheckCircle2 size={80} />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                      className="text-red-500"
                    >
                      <XCircle size={80} />
                    </motion.div>
                  )}
                </div>

                {/* Message */}
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`text-2xl font-bold text-center mb-2 ${
                    message.type === "success" ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {message.type === "success" ? "Success!" : "Error"}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 text-center text-lg"
                >
                  {message.text}
                </motion.p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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

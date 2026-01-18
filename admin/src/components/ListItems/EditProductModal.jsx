import { useState, useEffect } from "react"
import { X } from "lucide-react"

export default function EditProductModal({ product, isOpen, onClose, onSave }) {
  const [editProduct, setEditProduct] = useState(null)

  const categories = [
    "Birthday",
    "Anniversary",
    "Forever Flowers",
    "Fragrances",
    "Premium",
    "Corporate",
    "Combos"
  ]

  useEffect(() => {
    if (product) {
      setEditProduct({ 
        ...product,
        pricing: product.pricing || { small: 0, medium: 0, large: 0 }
      })
    }
  }, [product])

  if (!isOpen || !editProduct) return null

  const handleSave = () => {
    onSave(editProduct)
  }

  const handlePricingChange = (size, value) => {
    setEditProduct({
      ...editProduct,
      pricing: {
        ...editProduct.pricing,
        [size]: value === "" ? "" : parseFloat(value) || 0
      }
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              value={editProduct.name}
              onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={editProduct.category}
              onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Pricing Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Pricing</label>
            
            {(editProduct.category === "Fragrances" || editProduct.category === "Combos") ? (
              // Single Price for Fragrances and Combos
              <div>
                <label className="block text-xs text-gray-500 mb-1">Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editProduct.pricing.small}
                  onChange={(e) => {
                    const price = e.target.value
                    setEditProduct({
                      ...editProduct,
                      pricing: {
                        small: price === "" ? "" : parseFloat(price) || 0,
                        medium: price === "" ? "" : parseFloat(price) || 0,
                        large: price === "" ? "" : parseFloat(price) || 0
                      }
                    })
                  }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="0.00"
                />
              </div>
            ) : (
              // Three Sizes for other categories
              <>
                {/* Small Price */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Small (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editProduct.pricing.small}
                    onChange={(e) => handlePricingChange('small', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="0.00"
                  />
                </div>

                {/* Medium Price */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Medium (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editProduct.pricing.medium}
                    onChange={(e) => handlePricingChange('medium', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="0.00"
                  />
                </div>

                {/* Large Price */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Large (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editProduct.pricing.large}
                    onChange={(e) => handlePricingChange('large', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="0.00"
                  />
                </div>
              </>
            )}
          </div>

          {/* Same Day Delivery Toggle */}
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Same Day Delivery</p>
              <p className="text-sm text-gray-500">Enable same day delivery for this product</p>
            </div>
            <button
              onClick={() => setEditProduct({ ...editProduct, sameDayDelivery: !editProduct.sameDayDelivery })}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                editProduct.sameDayDelivery ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  editProduct.sameDayDelivery ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* List Toggle */}
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">List this product</p>
              <p className="text-sm text-gray-500">Show this product to customers</p>
            </div>
            <button
              onClick={() => setEditProduct({ ...editProduct, isListed: !editProduct.isListed })}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                editProduct.isListed ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  editProduct.isListed ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

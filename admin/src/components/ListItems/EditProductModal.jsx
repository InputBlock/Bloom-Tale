import { useState, useEffect } from "react"
import { X } from "lucide-react"

// Categories that use single pricing (no sizes) - product_type: "simple"
const SINGLE_PRICE_CATEGORIES = ["Candles", "Combos", "Balloons"]

export default function EditProductModal({ product, isOpen, onClose, onSave }) {
  const [editProduct, setEditProduct] = useState(null)

  const categories = [
    "Birthday",
    "Anniversary",
    "Forever Flowers",
    "Candles",
    "Balloons",
    "Premium",
    "Corporate",
    "Combos"
  ]

  useEffect(() => {
    if (product) {
      setEditProduct({ 
        ...product,
        pricing: product.pricing || { small: 0, medium: 0, large: 0 },
        discount_percentage: product.discount_percentage || 0
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Edit Product</h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">{/* Product Name */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              value={editProduct.name}
              onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm sm:text-base"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={editProduct.category}
              onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm sm:text-base"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Pricing Section */}
          <div className="space-y-2 sm:space-y-3">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">Pricing</label>
            
            {SINGLE_PRICE_CATEGORIES.includes(editProduct.category) ? (
              // Single Price for Candles, Combos, Balloons
              <div>
                <label className="block text-[10px] sm:text-xs text-gray-500 mb-1">Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editProduct.price || editProduct.pricing?.small || ""}
                  onChange={(e) => {
                    const price = e.target.value === "" ? "" : parseFloat(e.target.value) || 0
                    setEditProduct({
                      ...editProduct,
                      price: price,
                      pricing: { small: null, medium: null, large: null }
                    })
                  }}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm sm:text-base"
                  placeholder="0.00"
                />
              </div>
            ) : (
              // Three Sizes for other categories - Horizontal Layout
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {/* Small Price */}
                <div>
                  <label className="block text-[10px] sm:text-xs text-gray-500 mb-1">Small (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editProduct.pricing.small}
                    onChange={(e) => handlePricingChange('small', e.target.value)}
                    className="w-full px-2 sm:px-3 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm sm:text-base"
                    placeholder="0.00"
                  />
                </div>

                {/* Medium Price */}
                <div>
                  <label className="block text-[10px] sm:text-xs text-gray-500 mb-1">Medium (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editProduct.pricing.medium}
                    onChange={(e) => handlePricingChange('medium', e.target.value)}
                    className="w-full px-2 sm:px-3 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm sm:text-base"
                    placeholder="0.00"
                  />
                </div>

                {/* Large Price */}
                <div>
                  <label className="block text-[10px] sm:text-xs text-gray-500 mb-1">Large (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editProduct.pricing.large}
                    onChange={(e) => handlePricingChange('large', e.target.value)}
                    className="w-full px-2 sm:px-3 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm sm:text-base"
                    placeholder="0.00"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Discount Percentage */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Discount Percentage <span className="text-gray-500 text-[10px] sm:text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={editProduct.discount_percentage || 0}
                onChange={(e) => {
                  const value = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0))
                  setEditProduct({ ...editProduct, discount_percentage: value })
                }}
                min="0"
                max="100"
                step="1"
                className="w-full pr-8 sm:pr-10 pl-3 sm:pl-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm sm:text-base"
              />
              <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">%</span>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
              Shows crossed-out original price to customers (0-100%)
            </p>
            {editProduct.discount_percentage > 0 && (
              <div className="mt-2 p-2 sm:p-2.5 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-[10px] sm:text-xs text-blue-900">
                  <strong>💡 Preview:</strong> Customer sees{" "}
                  {SINGLE_PRICE_CATEGORIES.includes(editProduct.category) ? (
                    editProduct.price && (
                      <span>
                        <span className="line-through text-gray-500">₹{(parseFloat(editProduct.price) * (1 + parseFloat(editProduct.discount_percentage) / 100)).toFixed(0)}</span>{" "}
                        <strong className="text-green-700">₹{parseFloat(editProduct.price).toFixed(0)}</strong>
                      </span>
                    )
                  ) : (
                    editProduct.pricing?.medium && (
                      <span>
                        <span className="line-through text-gray-500">₹{(parseFloat(editProduct.pricing.medium) * (1 + parseFloat(editProduct.discount_percentage) / 100)).toFixed(0)}</span>{" "}
                        <strong className="text-green-700">₹{parseFloat(editProduct.pricing.medium).toFixed(0)}</strong>
                      </span>
                    )
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Same Day Delivery Toggle */}
          <div className="flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 text-sm sm:text-base">Same Day Delivery</p>
              <p className="text-xs sm:text-sm text-gray-500">Enable same day delivery for this product</p>
            </div>
            <button
              onClick={() => setEditProduct({ ...editProduct, sameDayDelivery: !editProduct.sameDayDelivery })}
              className={`relative w-10 sm:w-12 h-5 sm:h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                editProduct.sameDayDelivery ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 sm:w-5 h-4 sm:h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  editProduct.sameDayDelivery ? "translate-x-5 sm:translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Combo Toggle */}
          <div className="flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div>
              <p className="font-medium text-gray-900 text-sm sm:text-base"> Combo</p>
              <p className="text-xs sm:text-sm text-purple-600">Show in Combo section</p>
            </div>
            <button
              onClick={() => setEditProduct({ ...editProduct, isCombo: !editProduct.isCombo })}
              className={`relative w-10 sm:w-12 h-5 sm:h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                editProduct.isCombo ? "bg-purple-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 sm:w-5 h-4 sm:h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  editProduct.isCombo ? "translate-x-5 sm:translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* List Toggle */}
          <div className="flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 text-sm sm:text-base">List this product</p>
              <p className="text-xs sm:text-sm text-gray-500">Show this product to customers</p>
            </div>
            <button
              onClick={() => setEditProduct({ ...editProduct, isListed: !editProduct.isListed })}
              className={`relative w-10 sm:w-12 h-5 sm:h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                editProduct.isListed ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 sm:w-5 h-4 sm:h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  editProduct.isListed ? "translate-x-5 sm:translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Actions - Sticky Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 sm:p-6 flex gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm sm:text-base"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

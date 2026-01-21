import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, XCircle, X } from "lucide-react"
import { productsAPI } from "../../api"

// Categories that use single pricing (no sizes) - product_type: "simple"
const SINGLE_PRICE_CATEGORIES = ["Candles", "Combos", "Balloons"]

export default function ProductForm({ images = [], setImages = () => {} }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "Birthday",
    price: "", // Single price for Candles/Combos
    pricing: {
      small: "",
      medium: "",
      large: ""
    },
    discount_percentage: "", // Discount percentage for display
    inStock: true,
    sameDayDelivery: false,
    bestSeller: false,
    combo: false, // Combo field
    isActive: true,
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

  const categories = [
    "Birthday",
    "Anniversary",
    "Forever Flowers",
    "Candles",
    "Balloons",
    "Premium",
    "Corporate"
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: "", text: "" })
    setLoading(true)

    try {
      const isSinglePrice = SINGLE_PRICE_CATEGORIES.includes(formData.type)
      
      // Create FormData for multipart/form-data
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("category", formData.type)
      formDataToSend.append("stock", formData.inStock ? 100 : 0)
      formDataToSend.append("same_day_delivery", formData.sameDayDelivery)
      formDataToSend.append("bestSeller", formData.bestSeller)
      formDataToSend.append("combo", formData.combo)
      formDataToSend.append("is_active", formData.isActive)
      
      // Send price or pricing based on category
      if (isSinglePrice) {
        // For Candles/Combos - send single price
        formDataToSend.append("price", formData.price)
      } else {
        // For other categories - send pricing object
        formDataToSend.append("pricing", JSON.stringify(formData.pricing))
      }
      
      // Send discount percentage
      formDataToSend.append("discount_percentage", formData.discount_percentage || 0)
      
      // Append all image files - first image will be the main image
      if (images.length > 0) {
        images.forEach((img) => {
          if (img.file) {
            formDataToSend.append("images", img.file)
          }
        })
      }

      await productsAPI.add(formDataToSend)

      setMessage({ type: "success", text: "Product added successfully!" })
      // Reset form
      setFormData({
        name: "",
        description: "",
        type: "Birthday",
        price: "",
        pricing: {
          small: "",
          medium: "",
          large: ""
        },
        discount_percentage: "",
        inStock: true,
        sameDayDelivery: false,
        bestSeller: false,
        combo: false,
        isActive: true,
      })
      // Clear images
      setImages([])
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

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">

      <div>
        <label className="block text-gray-900 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">Flower Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Red Rose, Sunflower, Tulip"
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm sm:text-base"
        />
      </div>

      <div>
        <label className="block text-gray-900 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">Product Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Write a detailed description about the flower (origin, care tips, occasions, etc.)"
          rows={4}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none text-sm sm:text-base"
        />
      </div>

      <div>
        <label className="block text-gray-900 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">Category</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm sm:text-base"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        {SINGLE_PRICE_CATEGORIES.includes(formData.type) ? (
          // Single Price for Candles and Combos
          <>
            <label className="block text-gray-900 font-medium mb-2 sm:mb-3 text-sm sm:text-base">Price</label>
            <div className="relative max-w-full sm:max-w-md">
              <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                step="0.01"
                className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm sm:text-base"
              />
            </div>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">Set the price for this product</p>
          </>
        ) : (
          // Three Sizes for other categories
          <>
            <label className="block text-gray-900 font-medium mb-2 sm:mb-3 text-sm sm:text-base">Pricing by Size</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Small Size */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">Small</label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                  <input
                    type="number"
                    value={formData.pricing.small}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      pricing: { ...formData.pricing, small: e.target.value }
                    })}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Medium Size */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">Medium</label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                  <input
                    type="number"
                    value={formData.pricing.medium}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      pricing: { ...formData.pricing, medium: e.target.value }
                    })}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Large Size */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">Large</label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                  <input
                    type="number"
                    value={formData.pricing.large}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      pricing: { ...formData.pricing, large: e.target.value }
                    })}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">Set different prices for small, medium, and large arrangements</p>
          </>
        )}
      </div>

      {/* Discount Percentage Field */}
      <div>
        <label className="block text-gray-900 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
          Discount Percentage <span className="text-gray-500 text-xs sm:text-sm font-normal">(Optional)</span>
        </label>
        <div className="relative max-w-full sm:max-w-md">
          <input
            type="number"
            value={formData.discount_percentage}
            onChange={(e) => {
              const value = e.target.value === "" ? "" : Math.min(100, Math.max(0, parseFloat(e.target.value) || 0))
              setFormData({ ...formData, discount_percentage: value })
            }}
            placeholder="0"
            min="0"
            max="100"
            step="1"
            className="w-full pr-8 sm:pr-10 pl-3 sm:pl-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm sm:text-base"
          />
          <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">%</span>
        </div>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">
          Enter discount percentage to show as crossed-out original price (0-100%). Leave at 0 for no discount display.
        </p>
        {formData.discount_percentage > 0 && (
          <div className="mt-2 sm:mt-3 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <p className="text-xs sm:text-sm font-medium text-blue-900 mb-1">💡 Preview:</p>
            {SINGLE_PRICE_CATEGORIES.includes(formData.type) ? (
              formData.price && (
                <p className="text-xs sm:text-sm text-blue-800">
                  Customer will see: <span className="line-through text-gray-500">₹{(parseFloat(formData.price) * (1 + parseFloat(formData.discount_percentage) / 100)).toFixed(0)}</span>{" "}
                  <strong className="text-green-700">₹{parseFloat(formData.price).toFixed(0)}</strong>{" "}
                  <span className="text-green-600 font-semibold">({formData.discount_percentage}% OFF)</span>
                </p>
              )
            ) : (
              <p className="text-xs sm:text-sm text-blue-800">
                Customer will see all size prices with <strong>{formData.discount_percentage}% markup</strong> crossed out
                {formData.pricing.medium && (
                  <span className="block mt-1">
                    Example (Medium): <span className="line-through text-gray-500">₹{(parseFloat(formData.pricing.medium) * (1 + parseFloat(formData.discount_percentage) / 100)).toFixed(0)}</span>{" "}
                    <strong className="text-green-700">₹{parseFloat(formData.pricing.medium).toFixed(0)}</strong>
                  </span>
                )}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:gap-3">
        <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
          <label htmlFor="isActive" className="text-sm sm:text-base text-gray-900 font-medium cursor-pointer select-none">
            Product Active
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 sm:w-11 h-5 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 sm:after:h-5 after:w-4 sm:after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
          <input
            type="checkbox"
            id="inStock"
            checked={formData.inStock}
            onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
            className="w-4 sm:w-5 h-4 sm:h-5 accent-black cursor-pointer"
          />
          <label htmlFor="inStock" className="text-sm sm:text-base text-gray-900 font-medium cursor-pointer select-none">
            In Stock
          </label>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
          <input
            type="checkbox"
            id="sameDayDelivery"
            checked={formData.sameDayDelivery}
            onChange={(e) => setFormData({ ...formData, sameDayDelivery: e.target.checked })}
            className="w-4 sm:w-5 h-4 sm:h-5 accent-black cursor-pointer"
          />
          <label htmlFor="sameDayDelivery" className="text-sm sm:text-base text-gray-900 font-medium cursor-pointer select-none">
            Same Day Delivery Available
          </label>
        </div>

        {/* NEW: Best Seller Toggle */}
        <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border-2 border-amber-200">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <label htmlFor="bestSeller" className="text-sm sm:text-base text-gray-900 font-medium cursor-pointer select-none">
               Best Seller
            </label>
            <span className="text-[10px] sm:text-xs text-amber-600 font-medium px-1.5 sm:px-2 py-0.5 bg-amber-100 rounded-full">
              Featured
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="bestSeller"
              checked={formData.bestSeller}
              onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 sm:w-11 h-5 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 sm:after:h-5 after:w-4 sm:after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {/* Combo Toggle */}
        <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <label htmlFor="combo" className="text-sm sm:text-base text-gray-900 font-medium cursor-pointer select-none">
               Combo
            </label>
            <span className="text-[10px] sm:text-xs text-purple-600 font-medium px-1.5 sm:px-2 py-0.5 bg-purple-100 rounded-full">
              Bundle
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="combo"
              checked={formData.combo}
              onChange={(e) => setFormData({ ...formData, combo: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 sm:w-11 h-5 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 sm:after:h-5 after:w-4 sm:after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
      >
        {loading ? "Adding Product..." : "Add Flower Product"}
      </button>
    </form>
    </>
  )
}
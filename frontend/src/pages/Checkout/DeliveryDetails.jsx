import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, Loader2 } from "lucide-react"

export default function DeliveryDetails({ formData, handleInputChange, onSubmit }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Get token from localStorage for auth
      const token = localStorage.getItem("token")
      const headers = {
        "Content-Type": "application/json",
      }
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch("/api/v1/order/checkout", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          address: {
            fullName: formData.recipientName,
            mobile: formData.mobileNumber,
            house: formData.apartment,
            street: formData.streetAddress,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            addressTag: formData.addressTag || "Home",
          }
        }),
      })

      // Get response text first, then try to parse as JSON
      const responseText = await response.text()
      let data
      
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        // If not JSON, show the text response or a generic error
        console.error("Non-JSON response:", responseText)
        throw new Error(responseText || "Server error. Please try again.")
      }

      if (!response.ok) {
        // Show the actual backend error message
        const errorMsg = data.message || data.error || "Failed to save delivery details"
        throw new Error(errorMsg)
      }

      // Handle successful response - check for order ID in different response structures
      const orderId = data._id || (data.data && data.data._id)
      if (orderId) {
        onSubmit(orderId)
      } else {
        console.error("Response data:", data)
        throw new Error("Order ID not received from server")
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.")
      console.error("Checkout error:", err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8"
    >
      {/* Back to Cart Button */}
      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-[#3e4026] font-medium mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
      >
        <ChevronLeft size={20} className="sm:w-5 sm:h-5 w-4 h-4" />
        <span>Back to Cart</span>
      </button>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Title and Name */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Title <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e4026] text-sm sm:text-base"
              required
            >
              <option>Mr.</option>
              <option>Mrs.</option>
              <option>Ms.</option>
              <option>Dr.</option>
            </select>
          </div>
          <div className="sm:col-span-3">
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Recipient Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.recipientName}
              onChange={(e) => handleInputChange('recipientName', e.target.value)}
              placeholder="First Name & Last Name"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e4026] text-sm sm:text-base"
              required
            />
            <p className="text-xs text-gray-500 mt-1 text-right">(0/60)</p>
          </div>
        </div>

        {/* Mobile Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Recipient Mobile No <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="w-16 sm:w-20 px-2 sm:px-3 py-2 sm:py-3 bg-gray-100 border border-gray-300 rounded-lg text-center text-sm sm:text-base">
                + 91
              </div>
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                placeholder="Mobile Number"
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e4026] text-sm sm:text-base"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Recipient Alternate Number
            </label>
            <div className="flex gap-2">
              <div className="w-16 sm:w-20 px-2 sm:px-3 py-2 sm:py-3 bg-gray-100 border border-gray-300 rounded-lg text-center text-sm sm:text-base">
                + 91
              </div>
              <input
                type="tel"
                value={formData.alternateMobile}
                onChange={(e) => handleInputChange('alternateMobile', e.target.value)}
                placeholder="Alternate No. (Optional)"
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e4026] text-sm sm:text-base"
              />
            </div>
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Delivery Country <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e4026] text-sm sm:text-base"
            required
          >
            <option>🇮🇳 India</option>
            <option>🇺🇸 United States</option>
            <option>🇬🇧 United Kingdom</option>
          </select>
        </div>

        {/* State */}
        <div>
          <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            placeholder="Maharashtra"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e4026] text-sm sm:text-base"
            required
          />
        </div>

        {/* Pincode and City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Pincode/Zipcode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
              placeholder="400008"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e4026] text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Mumbai"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e4026] text-sm sm:text-base"
              required
            />
          </div>
        </div>

        {/* Street Address */}
        <div>
          <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.streetAddress}
            onChange={(e) => handleInputChange('streetAddress', e.target.value)}
            placeholder="Building / Area / Locality"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e4026] text-sm sm:text-base"
            required
          />
          <p className="text-xs text-gray-500 mt-1 text-right">(0/180)</p>
        </div>

        {/* Apartment */}
        <div>
          <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            House/Apartment <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.apartment}
            onChange={(e) => handleInputChange('apartment', e.target.value)}
            placeholder="Flat No. / Floor / Unit No"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e4026] text-sm sm:text-base"
            required
          />
          <p className="text-xs text-gray-500 mt-1 text-right">(0/180)</p>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full bg-[#3e4026] text-white py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-[#5e6043] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>SAVING...</span>
            </>
          ) : (
            "SAVE & DELIVER"
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}

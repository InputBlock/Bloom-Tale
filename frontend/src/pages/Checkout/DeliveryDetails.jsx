import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Loader2, MapPin, Edit2 } from "lucide-react"

export default function DeliveryDetails({ formData, handleInputChange, onSubmit }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [savedAddresses, setSavedAddresses] = useState([])
  const [loadingAddresses, setLoadingAddresses] = useState(true)
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)

  // Fetch saved addresses on component mount
  useEffect(() => {
    const fetchSavedAddresses = async () => {
      try {
        const token = localStorage.getItem("token")
        const headers = {
          "Content-Type": "application/json",
        }
        if (token) {
          headers["Authorization"] = `Bearer ${token}`
        }

        const response = await fetch("/api/v1/order/getaddress", {
          method: "POST",
          headers,
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          // Handle different response structures
          const addresses = data.data || data.addresses || data || []
          setSavedAddresses(Array.isArray(addresses) ? addresses : [])
          
          // If no saved addresses, show the form
          if (!addresses || addresses.length === 0) {
            setShowNewAddressForm(true)
          }
        } else {
          // If no addresses or error, show the form
          setShowNewAddressForm(true)
        }
      } catch (err) {
        console.error("Error fetching addresses:", err)
        // On error, show the form
        setShowNewAddressForm(true)
      } finally {
        setLoadingAddresses(false)
      }
    }

    fetchSavedAddresses()
  }, [])

  // Handle address selection
  const handleAddressSelect = (address) => {
    setSelectedAddressId(address._id)
    // Populate form with selected address
    handleInputChange('recipientName', address.fullName || '')
    handleInputChange('mobileNumber', address.mobile || '')
    handleInputChange('apartment', address.house || '')
    handleInputChange('streetAddress', address.street || '')
    handleInputChange('city', address.city || '')
    handleInputChange('state', address.state || '')
    handleInputChange('pincode', address.pincode || '')
    handleInputChange('addressTag', address.addressTag || 'Home')
  }

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

  if (loadingAddresses) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-lg p-8 flex items-center justify-center min-h-[400px]"
      >
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-[#3e4026]" size={40} />
          <p className="text-gray-600">Loading saved addresses...</p>
        </div>
      </motion.div>
    )
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

      {/* Saved Addresses Section */}
      {savedAddresses.length > 0 && !showNewAddressForm && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#3e4026]">
              Select Delivery Address
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {savedAddresses.map((address) => (
              <motion.div
                key={address._id}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleAddressSelect(address)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedAddressId === address._id
                    ? 'border-[#3e4026] bg-[#3e4026]/5'
                    : 'border-gray-200 hover:border-[#3e4026]/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <MapPin className={`mt-1 flex-shrink-0 ${
                    selectedAddressId === address._id ? 'text-[#3e4026]' : 'text-gray-400'
                  }`} size={20} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">{address.fullName}</span>
                      {address.addressTag && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                          {address.addressTag}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {address.house}, {address.street}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">
                      Mobile: +91 {address.mobile}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddressSelect(address)
                      setShowNewAddressForm(true)
                    }}
                    className="text-[#3e4026] hover:text-[#5e6043] transition-colors p-2 hover:bg-gray-100 rounded"
                    aria-label="Edit address"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {selectedAddressId && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              type="button"
              onClick={(e) => {
                e.preventDefault()
                handleFormSubmit(e)
              }}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full mt-6 bg-[#3e4026] text-white py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-[#5e6043] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>PROCESSING...</span>
                </>
              ) : (
                "DELIVER TO THIS ADDRESS"
              )}
            </motion.button>
          )}
        </div>
      )}

      {/* New Address Form */}
      <AnimatePresence>
        {(showNewAddressForm || savedAddresses.length === 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {savedAddresses.length > 0 && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-[#3e4026]">
                  Add New Address
                </h2>
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(false)}
                  className="text-gray-600 hover:text-[#3e4026] font-medium text-sm sm:text-base transition-colors"
                >
                  Cancel
                </button>
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
        )}
      </AnimatePresence>
    </motion.div>
  )
}

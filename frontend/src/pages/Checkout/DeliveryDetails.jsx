import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Home, Plus, Phone } from "lucide-react"

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
            email: formData.email,
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
      <div className="bg-white border border-gray-200 rounded-sm p-6 sm:p-8 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-3 text-gray-400" size={32} />
          <p className="text-gray-500 text-sm">Loading addresses...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-sm text-red-600 text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* Saved Addresses */}
      {savedAddresses.length > 0 && !showNewAddressForm && (
        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="divide-y divide-gray-100">
            {savedAddresses.map((address) => (
              <div
                key={address._id}
                className={`p-4 sm:p-5 ${selectedAddressId === address._id ? 'bg-gray-50' : ''}`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <Home size={16} className="sm:w-[18px] sm:h-[18px] text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm sm:text-base font-medium text-gray-900">{address.title} {address.fullName}</span>
                      {address.addressTag && (
                        <span className="px-2 py-0.5 bg-gray-900 text-white text-[10px] font-medium rounded-sm">
                          {address.addressTag}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          handleAddressSelect(address)
                          setShowNewAddressForm(true)
                        }}
                        className="text-gray-500 hover:text-gray-900 text-xs sm:text-sm ml-auto sm:ml-2"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {[address.house, address.street, address.pincode, address.city + '-' + address.state].filter(Boolean).join(', ')}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm text-gray-600">
                      <Phone size={12} />
                      <span>+91-{address.mobile}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleAddressSelect(address)
                      handleFormSubmit({ preventDefault: () => {} })
                    }}
                    disabled={loading}
                    className="px-3 sm:px-4 py-2 bg-gray-900 text-white text-xs sm:text-sm font-medium hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 rounded-sm flex-shrink-0"
                  >
                    {loading && selectedAddressId === address._id ? 'PROCESSING...' : 'DELIVER HERE'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Address Button */}
      {savedAddresses.length > 0 && !showNewAddressForm && (
        <button
          type="button"
          onClick={() => setShowNewAddressForm(true)}
          className="w-full p-3 sm:p-4 border border-gray-300 border-dashed bg-white rounded-sm flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-all active:scale-95"
        >
          <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="text-sm sm:text-base font-medium">ADD NEW ADDRESS</span>
        </button>
      )}

      {/* New Address Form */}
      <AnimatePresence>
        {(showNewAddressForm || savedAddresses.length === 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-gray-200 rounded-sm"
          >
            {savedAddresses.length > 0 && (
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200">
                <span className="text-sm sm:text-base font-medium text-gray-900">Add New Address</span>
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(false)}
                  className="text-gray-500 hover:text-gray-900 text-xs sm:text-sm active:scale-95"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Save Address Checkbox */}
            <div className="p-4 sm:p-5 border-b border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.saveAddress}
                  onChange={(e) => handleInputChange('saveAddress', e.target.checked)}
                  className="w-4 h-4 rounded-sm border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span className="text-xs sm:text-sm text-gray-700 flex items-center gap-1">
                  <Home size={14} /> Save this address as <strong>'My Home'</strong>
                </span>
              </label>
            </div>

            <form onSubmit={handleFormSubmit} className="p-4 sm:p-5 space-y-4">
              {/* Title and Name */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs sm:text-sm text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2.5 border-b border-gray-300 bg-transparent focus:outline-none focus:border-gray-900 text-xs sm:text-sm"
                    required
                  >
                    <option>Mr.</option>
                    <option>Mrs.</option>
                    <option>Ms.</option>
                    <option>Dr.</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs sm:text-sm text-gray-700 mb-1">
                    Recipient Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => handleInputChange('recipientName', e.target.value)}
                    className="w-full px-3 py-2.5 border-b border-gray-300 bg-transparent focus:outline-none focus:border-gray-900 text-xs sm:text-sm"
                    required
                  />
                  <p className="text-[10px] text-gray-400 mt-1 text-right">({formData.recipientName?.length || 0}/60)</p>
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs sm:text-sm text-gray-700 mb-1">
                  Delivery Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2.5 border-b border-gray-300 bg-transparent focus:outline-none focus:border-gray-900 text-xs sm:text-sm"
                  required
                >
                  <option value="India">🇮🇳 India</option>
                  <option value="United States">🇺🇸 United States</option>
                  <option value="United Kingdom">🇬🇧 United Kingdom</option>
                </select>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs sm:text-sm text-gray-700 mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.streetAddress}
                  onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                  className="w-full px-3 py-2.5 border-b border-gray-300 bg-transparent focus:outline-none focus:border-gray-900 text-xs sm:text-sm"
                  required
                />
                <p className="text-[10px] text-gray-400 mt-1 text-right">({formData.streetAddress?.length || 0}/180)</p>
              </div>

              {/* House/Apartment */}
              <div>
                <label className="block text-xs sm:text-sm text-gray-700 mb-1">
                  House/Apartment <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.apartment}
                  onChange={(e) => handleInputChange('apartment', e.target.value)}
                  className="w-full px-3 py-2.5 border-b border-gray-300 bg-transparent focus:outline-none focus:border-gray-900 text-xs sm:text-sm"
                  required
                />
              </div>

              {/* Pincode, City, State */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs sm:text-sm text-gray-700 mb-1">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    className="w-full px-3 py-2.5 border-b border-gray-300 bg-transparent focus:outline-none focus:border-gray-900 text-xs sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2.5 border-b border-gray-300 bg-transparent focus:outline-none focus:border-gray-900 text-xs sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3 py-2.5 border-b border-gray-300 bg-transparent focus:outline-none focus:border-gray-900 text-xs sm:text-sm"
                    required
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs sm:text-sm text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="px-3 py-2.5 border-b border-gray-300 bg-transparent text-xs sm:text-sm text-gray-500">+91</span>
                  <input
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                    className="flex-1 px-3 py-2.5 border-b border-gray-300 bg-transparent focus:outline-none focus:border-gray-900 text-xs sm:text-sm"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>SAVING...</span>
                  </>
                ) : (
                  "SAVE & DELIVER"
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

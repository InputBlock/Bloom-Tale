import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Home, Plus, Phone, MapPin, User, ChevronRight, CheckCircle } from "lucide-react"
import { orderAPI, deliveryAPI } from "../../api"
import { useGlobalPincode } from "../../context/PincodeContext"

export default function DeliveryDetails({ formData, handleInputChange, onSubmit }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [savedAddresses, setSavedAddresses] = useState([])
  const [loadingAddresses, setLoadingAddresses] = useState(true)
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  
  // Get session pincode
  const { pincode: sessionPincode, isPincodeVerified } = useGlobalPincode()
  
  // Pre-fill pincode from session on mount
  useEffect(() => {
    if (sessionPincode && !formData.pincode) {
      handleInputChange('pincode', sessionPincode)
    }
  }, [sessionPincode])

  // Fetch saved addresses on component mount
  useEffect(() => {
    const fetchSavedAddresses = async () => {
      try {
        const { response, data } = await orderAPI.getAddress()

        if (response.ok) {
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
      const { response, data } = await orderAPI.checkout({
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
      })

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
      <div className="bg-white border border-[#EDE8E0] rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-3 text-[#3e4026]" size={32} />
          <p className="text-[#5e6043] text-sm">Loading addresses...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-5"
    >
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <span className="text-red-500">!</span>
          </div>
          {error}
        </motion.div>
      )}

      {/* Saved Addresses */}
      {savedAddresses.length > 0 && !showNewAddressForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#EDE8E0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#EDE8E0]">
            <h3 className="font-medium text-[#3e4026]">Saved Addresses</h3>
            <p className="text-sm text-[#5e6043] mt-1">Select a delivery address</p>
          </div>
          <div className="divide-y divide-[#EDE8E0]">
            {savedAddresses.map((address, index) => (
              <motion.div
                key={address._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-5 hover:bg-[#FAF8F5] transition-colors cursor-pointer ${
                  selectedAddressId === address._id ? 'bg-[#EDE8E0]/50 ring-2 ring-inset ring-[#3e4026]/10' : ''
                }`}
                onClick={() => handleAddressSelect(address)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#EDE8E0] flex items-center justify-center shrink-0">
                    <Home size={18} className="text-[#3e4026]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-[#3e4026]">{address.fullName}</span>
                      {address.addressTag && (
                        <span className="px-2.5 py-1 bg-[#3e4026] text-white text-[10px] font-medium rounded-full uppercase tracking-wide">
                          {address.addressTag}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#5e6043] leading-relaxed">
                      {[address.house, address.street].filter(Boolean).join(', ')}
                    </p>
                    <p className="text-sm text-[#5e6043]">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-sm text-[#5e6043]">
                      <Phone size={13} />
                      <span>+91 {address.mobile}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddressSelect(address)
                        setShowNewAddressForm(true)
                      }}
                      className="text-sm text-[#5e6043] hover:text-[#3e4026] transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddressSelect(address)
                        handleFormSubmit({ preventDefault: () => {} })
                      }}
                      disabled={loading}
                      className="px-5 py-2.5 bg-[#3e4026] text-white text-sm font-medium rounded-full hover:bg-[#5e6043] transition-all disabled:opacity-50 flex items-center gap-2 group"
                    >
                      {loading && selectedAddressId === address._id ? (
                        <>
                          <Loader2 className="animate-spin" size={14} />
                          Processing...
                        </>
                      ) : (
                        <>
                          Deliver Here
                          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Address Button */}
      {savedAddresses.length > 0 && !showNewAddressForm && (
        <motion.button
          type="button"
          onClick={() => setShowNewAddressForm(true)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full p-5 border-2 border-dashed border-[#3e4026]/30 rounded-2xl bg-white flex items-center justify-center gap-3 text-[#5e6043] hover:text-[#3e4026] hover:border-[#3e4026]/50 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-[#EDE8E0] flex items-center justify-center group-hover:bg-[#3e4026]/10 transition-colors">
            <Plus size={20} />
          </div>
          <span className="font-medium">Add New Address</span>
        </motion.button>
      )}

      {/* New Address Form */}
      <AnimatePresence>
        {(showNewAddressForm || savedAddresses.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-sm border border-[#EDE8E0] overflow-hidden"
          >
            {savedAddresses.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8E0]">
                <div>
                  <h3 className="font-medium text-[#3e4026]">New Address</h3>
                  <p className="text-sm text-[#5e6043] mt-0.5">Enter delivery details</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(false)}
                  className="text-sm text-[#5e6043] hover:text-[#3e4026] transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Save Address Checkbox */}
            <div className="px-6 py-4 bg-[#FAF8F5] border-b border-[#EDE8E0]">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.saveAddress}
                    onChange={(e) => handleInputChange('saveAddress', e.target.checked)}
                    className="w-5 h-5 rounded border-[#5e6043] text-[#3e4026] focus:ring-[#3e4026] focus:ring-offset-0"
                  />
                </div>
                <span className="text-sm text-[#5e6043] flex items-center gap-2">
                  <Home size={16} className="text-[#5e6043]" /> 
                  Save this address as <span className="font-medium text-[#3e4026]">"My Home"</span>
                </span>
              </label>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
              {/* Title and Name */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#5e6043] uppercase tracking-wide mb-2">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-[#EDE8E0] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#3e4026]/10 focus:border-[#3e4026] text-sm text-[#3e4026] transition-all"
                    required
                  >
                    <option>Mr.</option>
                    <option>Mrs.</option>
                    <option>Ms.</option>
                    <option>Dr.</option>
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-medium text-[#5e6043] uppercase tracking-wide mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => handleInputChange('recipientName', e.target.value)}
                    placeholder="Recipient's full name"
                    className="w-full px-4 py-3 border border-[#EDE8E0] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#3e4026]/10 focus:border-[#3e4026] text-sm text-[#3e4026] transition-all placeholder:text-[#5e6043]/50"
                    required
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-medium text-[#5e6043] uppercase tracking-wide mb-2">
                  Delivery Country <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-4 py-3 border border-[#EDE8E0] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#3e4026]/10 focus:border-[#3e4026] text-sm text-[#3e4026] transition-all"
                  required
                >
                  <option value="India">🇮🇳 India</option>
                  <option value="United States">🇺🇸 United States</option>
                  <option value="United Kingdom">🇬🇧 United Kingdom</option>
                </select>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-medium text-[#5e6043] uppercase tracking-wide mb-2">
                  Street Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.streetAddress}
                  onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                  placeholder="Street name, area, locality"
                  className="w-full px-4 py-3 border border-[#EDE8E0] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#3e4026]/10 focus:border-[#3e4026] text-sm text-[#3e4026] transition-all placeholder:text-[#5e6043]/50"
                  required
                />
              </div>

              {/* House/Apartment */}
              <div>
                <label className="block text-xs font-medium text-[#5e6043] uppercase tracking-wide mb-2">
                  House / Apartment <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.apartment}
                  onChange={(e) => handleInputChange('apartment', e.target.value)}
                  placeholder="Flat, suite, unit, building, floor"
                  className="w-full px-4 py-3 border border-[#EDE8E0] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#3e4026]/10 focus:border-[#3e4026] text-sm text-[#3e4026] transition-all placeholder:text-[#5e6043]/50"
                  required
                />
              </div>

              {/* Pincode, City, State */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#5e6043] uppercase tracking-wide mb-2">
                    Pincode <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      className={`w-full px-4 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#3e4026]/10 focus:border-[#3e4026] text-sm text-[#3e4026] transition-all placeholder:text-[#5e6043]/50 ${
                        isPincodeVerified && formData.pincode === sessionPincode 
                          ? 'border-green-400 bg-green-50/30' 
                          : 'border-[#EDE8E0]'
                      }`}
                      required
                    />
                    {isPincodeVerified && formData.pincode === sessionPincode && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                    )}
                  </div>
                  {isPincodeVerified && formData.pincode === sessionPincode && (
                    <p className="text-[10px] text-green-600 mt-1">✓ Verified for delivery</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5e6043] uppercase tracking-wide mb-2">
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City"
                    className="w-full px-4 py-3 border border-[#EDE8E0] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#3e4026]/10 focus:border-[#3e4026] text-sm text-[#3e4026] transition-all placeholder:text-[#5e6043]/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5e6043] uppercase tracking-wide mb-2">
                    State <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="State"
                    className="w-full px-4 py-3 border border-[#EDE8E0] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#3e4026]/10 focus:border-[#3e4026] text-sm text-[#3e4026] transition-all placeholder:text-[#5e6043]/50"
                    required
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-medium text-[#5e6043] uppercase tracking-wide mb-2">
                  Mobile Number <span className="text-red-400">*</span>
                </label>
                <div className="flex">
                  <span className="px-4 py-3 border border-r-0 border-[#EDE8E0] rounded-l-xl bg-[#FAF8F5] text-sm text-[#5e6043] font-medium">+91</span>
                  <input
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                    placeholder="10-digit mobile number"
                    className="flex-1 px-4 py-3 border border-[#EDE8E0] rounded-r-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#3e4026]/10 focus:border-[#3e4026] text-sm text-[#3e4026] transition-all placeholder:text-[#5e6043]/50"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                className="w-full py-4 bg-[#3e4026] text-white font-medium rounded-xl hover:bg-[#5e6043] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#3e4026]/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Review</span>
                    <ChevronRight size={18} />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

import { useState } from "react"
import { Minus, Plus, Heart } from "lucide-react"
import { useCart } from "../../context/CartContext"
import { useNavigate } from "react-router-dom"
import SuccessModal from "../common/SuccessModal"

export default function ProductInfo({ product }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("Medium")
  const [modalState, setModalState] = useState({ isOpen: false, message: "", type: "success" })
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [selectedDeliveryType, setSelectedDeliveryType] = useState("fixed")
  const [activeTab, setActiveTab] = useState("description")
  const [pincode, setPincode] = useState("")
  const [pincodeStatus, setPincodeStatus] = useState(null) // null, 'checking', 'available', 'unavailable'
  const [showPincodeWarning, setShowPincodeWarning] = useState(false)
  const { addToCart, isLoggedIn } = useCart()
  const navigate = useNavigate()

  // Get the price based on selected size
  const getCurrentPrice = () => {
    if (!product?.pricing) return 0
    const sizeKey = selectedSize.toLowerCase()
    return product.pricing[sizeKey] || 0
  }

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      if (!product.stock || quantity < product.stock) {
        setQuantity((prev) => prev + 1)
      }
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "") // Only allow digits
    if (value.length <= 6) {
      setPincode(value)
      setPincodeStatus(null)
      setShowPincodeWarning(false)
    }
  }

  const checkPincodeAvailability = async () => {
    if (pincode.length !== 6) {
      setPincodeStatus('unavailable')
      return
    }

    setPincodeStatus('checking')
    
    // Check if pincode is in the 50000+ range (not serviceable)
    setTimeout(() => {
      const pincodeNum = parseInt(pincode)
      if (pincodeNum >= 500000) {
        setPincodeStatus('unavailable')
      } else {
        setPincodeStatus('available')
      }
    }, 500)
  }

  const handleAddToCart = async () => {
    if (!product) return

    // Check if pincode is verified
    if (pincodeStatus !== 'available') {
      setShowPincodeWarning(true)
      // Focus the pincode input
      document.querySelector('input[type="text"][placeholder="Enter Pincode"]')?.focus()
      // Scroll to pincode section
      document.querySelector('input[type="text"][placeholder="Enter Pincode"]')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
      return
    }

    if (!isLoggedIn()) {
      navigate("/login", { state: { from: `/product/${product.product_id}` } })
      return
    }
    
    if (!addToCart) {
      console.error("addToCart function not available")
      return
    }

    const result = await addToCart({
      product_id: product.product_id,
      quantity: quantity,
      size: selectedSize.toLowerCase(),
    })

    if (result && result.success) {
      setModalState({ isOpen: true, message: "Product added to cart successfully!", type: "success" })
      setTimeout(() => {
        setModalState({ isOpen: false, message: "", type: "success" })
      }, 1500)
    } else if (result && !result.success) {
      setModalState({ isOpen: true, message: result.message || "Failed to add product to cart", type: "error" })
      setTimeout(() => setModalState({ isOpen: false, message: "", type: "success" }), 4000)
    }
  }

  const handleBuyNow = async () => {
    if (!product) return

    // Check if pincode is verified
    if (pincodeStatus !== 'available') {
      setShowPincodeWarning(true)
      // Focus the pincode input
      document.querySelector('input[type="text"][placeholder="Enter Pincode"]')?.focus()
      // Scroll to pincode section
      document.querySelector('input[type="text"][placeholder="Enter Pincode"]')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
      return
    }

    if (!isLoggedIn()) {
      navigate("/login", { state: { from: `/product/${product.product_id}` } })
      return
    }

    if (!addToCart) {
      console.error("addToCart function not available")
      return
    }

    const result = await addToCart({
      product_id: product.product_id,
      quantity: quantity,
      size: selectedSize.toLowerCase(),
    })

    if (result && result.success) {
      setModalState({ isOpen: true, message: "Product added to cart successfully!", type: "success" })
      setTimeout(() => {
        setModalState({ isOpen: false, message: "", type: "success" })
        navigate("/cart")
      }, 1500)
    } else if (result && !result.success) {
      setModalState({ isOpen: true, message: result.message || "Failed to add product to cart", type: "error" })
      setTimeout(() => setModalState({ isOpen: false, message: "", type: "success" }), 4000)
    }
  }

  if (!product) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 w-3/4"></div>
        <div className="h-6 bg-gray-200 w-1/4"></div>
        <div className="h-12 bg-gray-200 w-1/3"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 px-4 sm:px-6 md:px-8">
      {/* Same Day Delivery Badge or Category */}
      {product.same_day_delivery ? (
        <div className="inline-flex items-center gap-2 sm:gap-2.5 bg-[#f9f8f6] px-3 sm:px-4 py-1.5 sm:py-2 border border-[#3e4026]/20 rounded">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3e4026]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
          <span className="text-[10px] sm:text-xs font-semibold text-[#3e4026] tracking-wider uppercase">Same Day Delivery</span>
        </div>
      ) : product.category ? (
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#3e4026]/70 font-medium">
          {product.category}
        </p>
      ) : null}

      {/* Product Title */}
      <h1 
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#3e4026] leading-tight"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {product.name}
      </h1>

      {/* Price and Quantity Section */}
      <div className="flex items-start justify-between gap-4 sm:gap-6 md:gap-8">
        <div className="flex-1">
          <div className="text-2xl sm:text-3xl md:text-4xl font-light text-[#3e4026]">
            ₹ {getCurrentPrice()?.toLocaleString()}
          </div>
        </div>
        
        {/* Quantity on the right */}
        <div className="flex flex-col items-end">
          <div className="inline-flex items-center border border-gray-300 bg-white rounded-sm">
            <button
              onClick={() => handleQuantityChange("decrement")}
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={quantity <= 1}
            >
              <Minus size={14} className="sm:w-4 sm:h-4 text-[#3e4026]" />
            </button>
            <span className="w-12 sm:w-16 text-center text-sm sm:text-base text-[#3e4026] font-medium">{quantity}</span>
            <button
              onClick={() => handleQuantityChange("increment")}
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={product.stock && quantity >= product.stock}
            >
              <Plus size={14} className="sm:w-4 sm:h-4 text-[#3e4026]" />
            </button>
          </div>
        </div>
      </div>

      {/* Size Selection - Full Width */}
      <div>
        <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#3e4026]/60 mb-2 sm:mb-3 font-medium">Size</p>
        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
          {['Small', 'Medium', 'Large'].map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`py-2.5 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium transition-all active:scale-95 border rounded-sm ${
                selectedSize === size 
                  ? "bg-[#3e4026] text-white border-[#3e4026]" 
                  : "bg-white text-[#3e4026] border-gray-300 hover:border-[#3e4026]"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Pincode Availability Check */}
      <div>
        <p className="text-xs tracking-[0.2em] uppercase text-[#3e4026]/60 mb-3 font-medium">Check Delivery Availability</p>
        <div className="flex gap-3 items-start">
          <div className="flex-1">
            <input
              type="text"
              value={pincode}
              onChange={handlePincodeChange}
              placeholder="Enter Pincode"
              maxLength="6"
              className={`w-full border px-4 py-3 text-sm focus:outline-none transition-colors ${
                showPincodeWarning && pincodeStatus !== 'available'
                  ? 'border-amber-500 focus:border-amber-600'
                  : 'border-gray-300 focus:border-[#3e4026]'
              }`}
            />
          </div>
          <button
            onClick={checkPincodeAvailability}
            disabled={pincode.length !== 6 || pincodeStatus === 'checking'}
            className="bg-[#3e4026] text-white px-6 py-3 text-sm font-medium hover:bg-[#2d2f1c] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {pincodeStatus === 'checking' ? 'Checking...' : 'Check'}
          </button>
        </div>
        {showPincodeWarning && pincodeStatus !== 'available' && (
          <div className="flex items-start gap-2 mt-3 p-3 bg-amber-50 border border-amber-300 rounded">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm font-medium text-amber-800">
              Please enter your pincode and check delivery availability to proceed
            </p>
          </div>
        )}
        {pincodeStatus === 'available' && (
          <div className="flex items-center gap-2 mt-3 p-3 bg-green-50 border border-green-200 rounded">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-green-800">Delivery Available</p>
              <p className="text-xs text-green-600 mt-0.5">We deliver to your location</p>
            </div>
          </div>
        )}
        {pincodeStatus === 'unavailable' && (
          <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800 mb-1">Delivery Not Available</p>
                <p className="text-xs text-red-600 leading-relaxed">
                  We currently don't deliver to pincode {pincode}. We're working to expand our delivery network.
                </p>
                <button
                  onClick={() => {
                    setPincode("")
                    setPincodeStatus(null)
                    setShowPincodeWarning(false)
                  }}
                  className="mt-2 text-xs font-medium text-red-700 hover:text-red-800 underline"
                >
                  Try another pincode
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delivery Information - Conditional based on same_day_delivery */}
      {product.same_day_delivery ? (
        <div className={`space-y-4 pt-2 ${pincodeStatus === 'unavailable' ? 'opacity-40 pointer-events-none' : ''}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#3e4026]">
              Pick the Best Time and Way to Deliver!
            </h3>
            <div className="inline-flex items-center gap-2 sm:gap-2.5 bg-[#f9f8f6] px-3 sm:px-4 py-1.5 sm:py-2 border border-[#3e4026]/20 rounded">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3e4026]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span className="text-[10px] sm:text-xs font-semibold text-[#3e4026] tracking-wider">Today, 18 Jan 2026</span>
            </div>
          </div>

          {/* Delivery Type Options - Fixed Time, Midnight, and Express */}
          <div className="grid grid-cols-3 gap-3">
            {/* Fixed Time Delivery */}
            <button
              onClick={() => setSelectedDeliveryType("fixed")}
              disabled={pincodeStatus === 'unavailable'}
              className={`p-4 text-left border transition-all ${
                selectedDeliveryType === "fixed"
                  ? "border-[#3e4026] bg-[#f9f8f6]"
                  : "border-gray-200 bg-white hover:border-[#3e4026]"
              }`}
            >
              <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                <h4 className="text-xs sm:text-sm font-semibold text-[#3e4026]">Fixed Time</h4>
                <span className="text-xs sm:text-sm font-medium text-[#3e4026]">₹ 150</span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#3e4026]/70 leading-relaxed">
                Delivery during selected 2 hours slot
              </p>
            </button>

            {/* Midnight Delivery */}
            <button
              onClick={() => setSelectedDeliveryType("midnight")}
              disabled={pincodeStatus === 'unavailable'}
              className={`p-4 text-left border transition-all ${
                selectedDeliveryType === "midnight"
                  ? "border-[#3e4026] bg-[#f9f8f6]"
                  : "border-gray-200 bg-white hover:border-[#3e4026]"
              }`}
            >
              <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                <h4 className="text-xs sm:text-sm font-semibold text-[#3e4026]">Midnight</h4>
                <span className="text-xs sm:text-sm font-medium text-[#3e4026]">₹ 175</span>
              </div>
              <p className="text-xs text-[#3e4026]/70 leading-relaxed">
                Delivery between 11:00 PM - 2:00 AM
              </p>
            </button>

            {/* Express Delivery */}
            <button
              onClick={() => setSelectedDeliveryType("express")}
              disabled={pincodeStatus === 'unavailable'}
              className={`p-4 text-left border transition-all ${
                selectedDeliveryType === "express"
                  ? "border-[#3e4026] bg-[#f9f8f6]"
                  : "border-gray-200 bg-white hover:border-[#3e4026]"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-semibold text-[#3e4026]">Express</h4>
                <span className="text-sm font-medium text-[#3e4026]">₹ 349</span>
              </div>
              <p className="text-xs text-[#3e4026]/70 leading-relaxed">
                Fast delivery within 2-3 hours
              </p>
            </button>
          </div>

          {/* Time Slot Selector (shown for Fixed Time) */}
          {selectedDeliveryType === "fixed" && (
            <select 
              disabled={pincodeStatus === 'unavailable'}
              className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#3e4026] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option>Select Time Slot</option>
              <option>9:00 AM - 11:00 AM</option>
              <option>11:00 AM - 1:00 PM</option>
              <option>1:00 PM - 3:00 PM</option>
              <option>3:00 PM - 5:00 PM</option>
              <option>5:00 PM - 7:00 PM</option>
              <option>7:00 PM - 9:00 PM</option>
            </select>
          )}
        </div>
      ) : (
        <div className="bg-[#f9f8f6] border border-[#3e4026]/20 rounded-sm p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#3e4026]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#3e4026] mb-1">Standard Delivery</p>
              <p className="text-[10px] sm:text-xs text-[#3e4026]/70">Expected delivery in 2-3 business days</p>
            </div>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Description Section */}
      <div>
        <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#3e4026] mb-2 sm:mb-3 pb-2 border-b border-gray-200">
          Description
        </h3>
        <div className="py-2">
          {product.description ? (
            <p className="text-[#3e4026]/80 leading-relaxed text-xs sm:text-sm">
              {product.description}
            </p>
          ) : (
            <p className="text-[#3e4026]/80 leading-relaxed text-xs sm:text-sm">
              {product.name} is a sculpted arrangement of delicate balance and quiet grace. 
              Purple and white shaded carnations, white carnations, sweet avalanche roses, 
              purple roses, purple carnations and white spray solidago are hand-arranged to 
              create a stunning display that celebrates life's precious moments.
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 pt-2">
        <button 
          onClick={handleAddToCart}
          disabled={!product.stock || product.stock === 0 || pincodeStatus === 'unavailable'}
          className="bg-[#3e4026] text-white py-4 px-6 text-sm font-semibold hover:bg-[#2d2f1c] transition-all uppercase tracking-wider flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <span>Add to Cart</span>
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
        <button 
          onClick={handleBuyNow}
          disabled={!product.stock || product.stock === 0 || pincodeStatus === 'unavailable'}
          className="bg-white border-2 border-[#3e4026] text-[#3e4026] py-4 px-6 text-sm font-semibold hover:bg-[#3e4026] hover:text-white transition-all uppercase tracking-wider disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          Buy Now
        </button>
      </div>

      {/* Success Modal */}
      <SuccessModal 
        isOpen={modalState.isOpen}
        message={modalState.message}
        type={modalState.type}
        onClose={() => setModalState({ isOpen: false, message: "", type: "success" })}
      />
    </div>
  )
}

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

  const handleAddToCart = async () => {
    if (!product) return

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
    <div className="space-y-6 px-6 md:px-8">
      {/* Same Day Delivery Badge or Category */}
      {product.same_day_delivery ? (
        <div className="inline-flex items-center gap-2.5 bg-[#f9f8f6] px-4 py-2 border border-[#3e4026]/20 rounded">
          <svg className="w-4 h-4 text-[#3e4026]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
          <span className="text-xs font-semibold text-[#3e4026] tracking-wider uppercase">Same Day Delivery</span>
        </div>
      ) : product.category ? (
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#3e4026]/70 font-medium">
          {product.category}
        </p>
      ) : null}

      {/* Product Title */}
      <h1 
        className="text-3xl md:text-4xl lg:text-5xl text-[#3e4026] leading-tight"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {product.name}
      </h1>

      {/* Price and Quantity Section */}
      <div className="flex items-start justify-between gap-8">
        <div className="flex-1">
          <div className="text-3xl md:text-4xl font-light text-[#3e4026]">
            ₹ {getCurrentPrice()?.toLocaleString()}
          </div>
        </div>
        
        {/* Quantity on the right */}
        <div className="flex flex-col items-end">
          <div className="inline-flex items-center border border-gray-300 bg-white">
            <button
              onClick={() => handleQuantityChange("decrement")}
              className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={quantity <= 1}
            >
              <Minus size={16} className="text-[#3e4026]" />
            </button>
            <span className="w-16 text-center text-[#3e4026] font-medium">{quantity}</span>
            <button
              onClick={() => handleQuantityChange("increment")}
              className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={product.stock && quantity >= product.stock}
            >
              <Plus size={16} className="text-[#3e4026]" />
            </button>
          </div>
        </div>
      </div>

      {/* Size Selection - Full Width */}
      <div>
        <p className="text-xs tracking-[0.2em] uppercase text-[#3e4026]/60 mb-3 font-medium">Size</p>
        <div className="grid grid-cols-3 gap-3 w-full">
          {['Small', 'Medium', 'Large'].map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`py-3 px-4 text-sm font-medium transition-all border ${
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

      {/* Delivery Information - Conditional based on same_day_delivery */}
      {product.same_day_delivery ? (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#3e4026]">
              Pick the Best Time and Way to Deliver!
            </h3>
            <div className="inline-flex items-center gap-2.5 bg-[#f9f8f6] px-4 py-2 border border-[#3e4026]/20 rounded">
              <svg className="w-4 h-4 text-[#3e4026]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span className="text-xs font-semibold text-[#3e4026] tracking-wider">Today, 18 Jan 2026</span>
            </div>
          </div>

          {/* Delivery Type Options - Only Fixed Time and Midnight */}
          <div className="grid grid-cols-2 gap-3">
            {/* Fixed Time Delivery */}
            <button
              onClick={() => setSelectedDeliveryType("fixed")}
              className={`p-4 text-left border transition-all ${
                selectedDeliveryType === "fixed"
                  ? "border-[#3e4026] bg-[#f9f8f6]"
                  : "border-gray-200 bg-white hover:border-[#3e4026]"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-semibold text-[#3e4026]">Fixed Time</h4>
                <span className="text-sm font-medium text-[#3e4026]">₹ 150</span>
              </div>
              <p className="text-xs text-[#3e4026]/70 leading-relaxed">
                Delivery during selected 2 hours slot
              </p>
            </button>

            {/* Midnight Delivery */}
            <button
              onClick={() => setSelectedDeliveryType("midnight")}
              className={`p-4 text-left border transition-all ${
                selectedDeliveryType === "midnight"
                  ? "border-[#3e4026] bg-[#f9f8f6]"
                  : "border-gray-200 bg-white hover:border-[#3e4026]"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-semibold text-[#3e4026]">Midnight</h4>
                <span className="text-sm font-medium text-[#3e4026]">₹ 175</span>
              </div>
              <p className="text-xs text-[#3e4026]/70 leading-relaxed">
                Delivery between 11:00 PM - 11:59 PM
              </p>
            </button>
          </div>

          {/* Time Slot Selector (shown for Fixed Time) */}
          {selectedDeliveryType === "fixed" && (
            <select className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#3e4026]">
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
        <div className="bg-[#f9f8f6] border border-[#3e4026]/20 rounded p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-[#3e4026]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#3e4026] mb-1">Standard Delivery</p>
              <p className="text-xs text-[#3e4026]/70">Expected delivery in 2-3 business days</p>
            </div>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Description Section */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#3e4026] mb-3 pb-2 border-b border-gray-200">
          Description
        </h3>
        <div className="py-2">
          {product.description ? (
            <p className="text-[#3e4026]/80 leading-relaxed text-sm">
              {product.description}
            </p>
          ) : (
            <p className="text-[#3e4026]/80 leading-relaxed text-sm">
              {product.name} is a sculpted arrangement of delicate balance and quiet grace. 
              Purple and white shaded carnations, white carnations, sweet avalanche roses, 
              purple roses, purple carnations and white spray solidago are hand-arranged to 
              create a stunning display that celebrates life's precious moments.
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <button 
          onClick={handleAddToCart}
          disabled={!product.stock || product.stock === 0}
          className="bg-[#3e4026] text-white py-4 px-6 text-sm font-semibold hover:bg-[#2d2f1c] transition-all uppercase tracking-wider flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <span>Add to Cart</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
        <button 
          onClick={handleBuyNow}
          disabled={!product.stock || product.stock === 0}
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

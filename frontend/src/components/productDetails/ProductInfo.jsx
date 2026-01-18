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
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState("today")
  const [selectedDeliveryType, setSelectedDeliveryType] = useState("standard")
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
        <div className="inline-flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full">
          <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10a1 1 0 112 0v4a1 1 0 11-2 0v-4zm1-5a1 1 0 100 2 1 1 0 000-2z" />
          </svg>
          <span className="text-xs font-medium text-purple-700 tracking-wide">Same Day Delivery</span>
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
            USD {getCurrentPrice()?.toLocaleString()}
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

      {/* Stock Status with Pincode Check */}
      <div className="flex items-center gap-4 py-3 border-y border-gray-200">
        <select className="flex-1 border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-[#3e4026]">
          <option>INDIA</option>
          <option>USA</option>
          <option>UK</option>
        </select>
        <input 
          type="text" 
          placeholder="400008" 
          className="w-32 border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-[#3e4026]"
        />
        {product.stock && product.stock > 0 ? (
          <span className="text-xs text-green-600 flex items-center gap-1.5 font-medium whitespace-nowrap">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            Available ✓
          </span>
        ) : (
          <span className="text-xs text-red-500">Out of Stock</span>
        )}
      </div>

      {/* Size Selection - Below Price */}
      <div>
        <p className="text-xs tracking-[0.2em] uppercase text-[#3e4026]/60 mb-3 font-medium">Size</p>
        <div className="flex gap-3">
          {['Small', 'Medium', 'Large'].map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-8 py-3 text-sm font-medium transition-all border ${
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

      {/* Pick the Best Time and Way to Deliver */}
      <div className="space-y-4 pt-2">
        <h3 className="text-base font-semibold text-[#3e4026]">
          Pick the Best Time and Way to Deliver!
        </h3>

        {/* Delivery Date Selection */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedDeliveryDate("today")}
            className={`py-3 px-4 text-sm font-medium border transition-all ${
              selectedDeliveryDate === "today"
                ? "border-[#3e4026] bg-[#3e4026] text-white"
                : "border-gray-300 bg-white text-[#3e4026] hover:border-[#3e4026]"
            }`}
          >
            Today, 18 Jan
          </button>
          <button
            onClick={() => setSelectedDeliveryDate("tomorrow")}
            className={`py-3 px-4 text-sm font-medium border transition-all ${
              selectedDeliveryDate === "tomorrow"
                ? "border-[#3e4026] bg-[#3e4026] text-white"
                : "border-gray-300 bg-white text-[#3e4026] hover:border-[#3e4026]"
            }`}
          >
            Tomorrow, 19 Jan
          </button>
        </div>

        {/* Delivery Type Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Standard Delivery */}
          <button
            onClick={() => setSelectedDeliveryType("standard")}
            className={`p-4 text-left border transition-all ${
              selectedDeliveryType === "standard"
                ? "border-[#3e4026] bg-[#f9f8f6]"
                : "border-gray-200 bg-white hover:border-[#3e4026]"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-sm font-semibold text-[#3e4026]">Standard</h4>
              <span className="text-sm font-medium text-[#3e4026]">₹ 25</span>
            </div>
            <p className="text-xs text-[#3e4026]/70 leading-relaxed">
              Delivery during the selected slot
            </p>
          </button>

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

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Description Section */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#3e4026] mb-4 pb-3 border-b border-gray-200">
          Description
        </h3>
        <div className="py-4">
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
      <div className="grid grid-cols-2 gap-4 pt-6">
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

import { useState, useRef } from "react"
import { Minus, Plus } from "lucide-react"
import { useCart } from "../../context/CartContext"
import { useNavigate } from "react-router-dom"
import SuccessModal from "../common/SuccessModal"
import DeliveryCheck from "./DeliveryCheck"

export default function ProductInfo({ product }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("Medium")
  const [modalState, setModalState] = useState({ isOpen: false, message: "", type: "success" })
  const [deliveryStatus, setDeliveryStatus] = useState(null)
  const [deliveryZone, setDeliveryZone] = useState(null)
  const deliveryRef = useRef(null)
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

  const handleDeliveryStatusChange = (status, zone) => {
    setDeliveryStatus(status)
    setDeliveryZone(zone)
  }

  const handleAddToCart = async () => {
    if (!product) return

    // Check if pincode is verified
    if (deliveryStatus !== 'available') {
      deliveryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
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
      // Delivery info from DeliveryCheck component
      deliveryType: deliveryZone?.deliveryType || 'standard',
      deliveryFee: deliveryZone?.deliveryFee || 0,
      deliverySlot: deliveryZone?.deliverySlot || null,
      pincode: deliveryZone?.pincode || null,
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
    if (deliveryStatus !== 'available') {
      deliveryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
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
      // Delivery info from DeliveryCheck component
      deliveryType: deliveryZone?.deliveryType || 'standard',
      deliveryFee: deliveryZone?.deliveryFee || 0,
      deliverySlot: deliveryZone?.deliverySlot || null,
      pincode: deliveryZone?.pincode || null,
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

      {/* Delivery Check Component */}
      <div ref={deliveryRef}>
        <DeliveryCheck 
          onDeliveryStatusChange={handleDeliveryStatusChange}
          sameDayDelivery={product.same_day_delivery}
        />
      </div>

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
          disabled={!product.stock || product.stock === 0 || deliveryStatus !== 'available'}
          className="bg-[#3e4026] text-white py-4 px-6 text-sm font-semibold hover:bg-[#2d2f1c] transition-all uppercase tracking-wider flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <span>Add to Cart</span>
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
        <button 
          onClick={handleBuyNow}
          disabled={!product.stock || product.stock === 0 || deliveryStatus !== 'available'}
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

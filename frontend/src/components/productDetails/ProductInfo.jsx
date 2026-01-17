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
        navigate("/cart")
      }, 1500)
    } else if (result && !result.success) {
      setModalState({ isOpen: true, message: result.message || "Failed to add product to cart", type: "error" })
      setTimeout(() => setModalState({ isOpen: false, message: "", type: "success" }), 3000)
    }
  }

  const handleBuyNow = async () => {
    if (!product) return

    if (!isLoggedIn()) {
      navigate("/login", { state: { from: `/product/${product.product_id}` } })
      return
    }

    await handleAddToCart()
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
    <div className="space-y-6">
      {/* Category */}
      {product.category && (
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#3e4026]/70 font-medium">
          {product.category}
        </p>
      )}

      {/* Product Title */}
      <h1 
        className="text-3xl md:text-4xl text-[#3e4026]"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {product.name}
      </h1>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-light text-[#3e4026]">
          ₹{getCurrentPrice()?.toLocaleString()}
        </span>
      </div>

      {/* Stock Status */}
      {product.stock && product.stock > 0 ? (
        <p className="text-xs text-green-600 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-600"></span>
          In Stock {product.stock <= 10 && `• Only ${product.stock} left`}
        </p>
      ) : (
        <p className="text-xs text-gray-400">Out of Stock</p>
      )}

      {/* Description with Show More/Less */}
      {product.description && (
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#3e4026]/60 mb-2">Description</p>
          <p className={`text-[#3e4026]/70 leading-relaxed ${!showFullDescription && product.description.length > 100 ? 'line-clamp-2' : ''}`}>
            {product.description}
          </p>
          {product.description.length > 100 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-[#3e4026] text-sm font-medium mt-2 hover:underline cursor-pointer"
            >
              {showFullDescription ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Size Selection */}
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#3e4026]/60 mb-3">Size</p>
        <div className="flex gap-3">
          {['Small', 'Medium', 'Large'].map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-6 py-3 text-sm transition-all border ${
                selectedSize === size 
                  ? "bg-[#3e4026] text-white border-[#3e4026]" 
                  : "bg-white text-[#3e4026] border-gray-200 hover:border-[#3e4026]"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#3e4026]/60 mb-3">Quantity</p>
        <div className="inline-flex items-center border border-gray-200">
          <button
            onClick={() => handleQuantityChange("decrement")}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40"
            disabled={quantity <= 1}
          >
            <Minus size={16} className="text-[#3e4026]" />
          </button>
          <span className="w-14 text-center text-[#3e4026]">{quantity}</span>
          <button
            onClick={() => handleQuantityChange("increment")}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40"
            disabled={product.stock && quantity >= product.stock}
          >
            <Plus size={16} className="text-[#3e4026]" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button 
          onClick={handleAddToCart}
          disabled={!product.stock || product.stock === 0}
          className="flex-1 bg-[#3e4026] text-white py-4 text-sm font-medium hover:bg-[#2d2f1c] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
        <button 
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`w-14 h-14 flex items-center justify-center border transition-colors ${
            isWishlisted 
              ? "border-[#3e4026] bg-[#3e4026] text-white" 
              : "border-gray-200 text-[#3e4026] hover:border-[#3e4026]"
          }`}
        >
          <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
        </button>
      </div>

      {/* Buy Now */}
      <button 
        onClick={handleBuyNow}
        disabled={!product.stock || product.stock === 0}
        className="w-full border border-[#3e4026] text-[#3e4026] py-4 text-sm font-medium hover:bg-[#3e4026] hover:text-white transition-colors disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        Buy Now
      </button>

      {/* Product Highlights */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f9f8f6] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#3e4026]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-[#3e4026]">Free Delivery</p>
              <p className="text-[10px] text-[#3e4026]/60">Orders above ₹999</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f9f8f6] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#3e4026]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-[#3e4026]">
                {product.same_day_delivery ? "Same Day Delivery" : "Standard Delivery"}
              </p>
              <p className="text-[10px] text-[#3e4026]/60">
                {product.same_day_delivery ? "Order before 2 PM" : "2-3 business days"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f9f8f6] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#3e4026]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-[#3e4026]">Fresh Guarantee</p>
              <p className="text-[10px] text-[#3e4026]/60">7-day freshness</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f9f8f6] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#3e4026]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-[#3e4026]">Hand Crafted</p>
              <p className="text-[10px] text-[#3e4026]/60">By expert florists</p>
            </div>
          </div>
        </div>
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

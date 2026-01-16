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
  const { addToCart, isLoggedIn } = useCart()
  const navigate = useNavigate()

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
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#3e4026]/60">
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
          ₹{product.price?.toLocaleString()}
        </span>
        {product.originalPrice && product.originalPrice > product.price && (
          <>
            <span className="text-lg text-gray-400 line-through">
              ₹{product.originalPrice?.toLocaleString()}
            </span>
            <span className="text-[10px] tracking-widest uppercase bg-[#3e4026] text-white px-2 py-1">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
            </span>
          </>
        )}
      </div>

      {/* Stock Status */}
      {product.stock && product.stock > 0 ? (
        <p className="text-xs text-green-600 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
          In Stock {product.stock <= 10 && `• Only ${product.stock} left`}
        </p>
      ) : (
        <p className="text-xs text-gray-400">Out of Stock</p>
      )}

      {/* Description */}
      {product.description && (
        <p className="text-[#3e4026]/70 leading-relaxed">
          {product.description}
        </p>
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

      {/* Product Details */}
      <div className="border-t border-gray-200 pt-6 mt-6 space-y-4">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#3e4026]/60">Details</p>
        <div className="space-y-2 text-sm text-[#3e4026]/70">
          <div className="flex justify-between">
            <span>Product ID</span>
            <span className="text-[#3e4026]">{product.product_id}</span>
          </div>
          <div className="flex justify-between">
            <span>Category</span>
            <span className="text-[#3e4026]">{product.category}</span>
          </div>
          {product.subcategory && (
            <div className="flex justify-between">
              <span>Subcategory</span>
              <span className="text-[#3e4026]">{product.subcategory}</span>
            </div>
          )}
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

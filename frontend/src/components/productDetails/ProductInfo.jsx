import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { useCart } from "../../context/CartContext"
import { useNavigate } from "react-router-dom"
import SuccessModal from "../common/SuccessModal"

export default function ProductInfo({ product }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null)
  const [modalState, setModalState] = useState({ isOpen: false, message: "", type: "success" })
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1)
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return
    
    if (!addToCart) {
      console.error("addToCart function not available")
      return
    }

    const result = await addToCart({
      product_id: product.product_id,
      quantity: quantity,
    })

    if (result && result.success) {
      // Show success message
      setModalState({ isOpen: true, message: "Product added to cart successfully!", type: "success" })
      setTimeout(() => {
        setModalState({ isOpen: false, message: "", type: "success" })
        navigate("/cart")
      }, 1500)
    } else if (result && !result.success) {
      // Show error message
      setModalState({ isOpen: true, message: result.message || "Failed to add product to cart", type: "error" })
      setTimeout(() => setModalState({ isOpen: false, message: "", type: "success" }), 3000)
    }
  }

  if (!product) {
    return <div>Loading product information...</div>
  }

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-3xl font-serif text-gray-900 mb-2">
          {product.name}
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm bg-[#EDE8E0] text-[#3e4026] px-3 py-1 rounded-full">
            {product.category}
          </span>
          {product.subcategory && (
            <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              {product.subcategory}
            </span>
          )}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-2xl font-bold text-gray-900">₹ {product.price}</p>
        {product.bestSeller && (
          <p className="text-sm text-yellow-600 mt-1 flex items-center gap-1">
            <span className="text-lg">⭐</span> Bestseller
          </p>
        )}
      </div>

      {/* Stock Status */}
      <div>
        {product.stock && product.stock > 0 ? (
          <p className="text-sm text-green-600 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
            In Stock ({product.stock} available)
          </p>
        ) : (
          <p className="text-sm text-red-600 font-semibold">Out of Stock</p>
        )}
      </div>

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-900 mb-3">Select Size</p>
          <div className="flex gap-3">
            {product.sizes.map((size, index) => (
              <button
                key={index}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border-2 rounded-lg transition ${
                  selectedSize === size 
                    ? "border-gray-900 bg-gray-900 text-white" 
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div>
        <p className="text-sm font-medium text-gray-900 mb-3">Quantity</p>
        <div className="flex items-center gap-4 border border-gray-300 rounded-md w-fit">
          <button
            onClick={() => handleQuantityChange("decrement")}
            className="p-3 hover:bg-gray-100"
            disabled={quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <span className="text-lg font-medium w-8 text-center">{quantity}</span>
          <button
            onClick={() => handleQuantityChange("increment")}
            className="p-3 hover:bg-gray-100"
            disabled={product.stock && quantity >= product.stock}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div>
          <h2 className="text-2xl font-serif text-gray-900 mb-4 border-b pb-2">
            Description:
          </h2>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={handleAddToCart}
          disabled={!product.stock || product.stock === 0}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-md transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          ADD TO CART
        </button>
        <button 
          disabled={!product.stock || product.stock === 0}
          className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-md transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          BUY IT NOW
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

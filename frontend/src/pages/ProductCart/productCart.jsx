import { useCart } from "../../context/CartContext"
import { Minus, Plus, Trash2, MapPin, Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/common/Header"

export default function ProductCart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, isLoggedIn, fetchCart, loading } = useCart()
  const [pincode, setPincode] = useState("400018")
  const navigate = useNavigate()

  // Immediately redirect if not logged in - before any other useEffect
  if (!isLoggedIn()) {
    navigate("/login", { state: { from: "/cart" }, replace: true })
    return null
  }

  // Check if user is logged in and fetch cart
  useEffect(() => {
    if (isLoggedIn()) {
      fetchCart()
    }
  }, [])

  const deliveryCharge = 25
  const cartTotal = getCartTotal()
  const totalAmount = cartTotal + deliveryCharge

  const handleQuantityChange = (product_id, currentQuantity, type) => {
    if (type === "increment") {
      updateQuantity(product_id, currentQuantity + 1)
    } else if (type === "decrement" && currentQuantity > 1) {
      updateQuantity(product_id, currentQuantity - 1)
    }
  }

  const formatDate = () => {
    const date = new Date()
    const day = date.getDate()
    const month = date.toLocaleString("default", { month: "short" })
    const year = date.getFullYear()
    const ordinal = (n) => {
      const s = ["th", "st", "nd", "rd"]
      const v = n % 100
      return n + (s[(v - 20) % 10] || s[v] || s[0])
    }
    return `On ${ordinal(day)} ${month} ${year} between 5pm - 9pm`
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </>
    )
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-serif text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add some beautiful blooms to your cart!</p>
            <button
              onClick={() => navigate("/home")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-md transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-gray-900 mb-3 sm:mb-4">Shopping Cart</h1>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm sm:text-base text-gray-700">
            <MapPin size={18} className="sm:w-5 sm:h-5" />
            <span className="font-medium">Delivery to:</span>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="border border-gray-300 rounded px-2 sm:px-3 py-1 w-28 sm:w-40 text-center text-sm sm:text-base"
              placeholder="Enter pincode"
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {cartItems.map((item) => {
            const productInfo = item.product || {}
            const productImage = productInfo.images_uri?.[0] || null
            
            return (
              <div
                key={item._id || item.product_id}
                className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6"
              >
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={productInfo.name || "Product"}
                        className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 flex items-center justify-center bg-gradient-to-br from-[#EDE8E0] to-[#5e6043]/10 rounded-lg">
                        <span className="text-6xl">🌸</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info and Actions Container */}
                  <div className="flex-1 flex flex-col gap-3">
                    {/* Product Title */}
                    <h3 className="text-base sm:text-lg lg:text-xl font-serif text-gray-900">
                      {productInfo.name || "Product"}
                    </h3>
                    
                    {/* Delivery Info */}
                    <div className="text-xs sm:text-sm">
                      <p className="font-semibold text-gray-900 mb-1">
                        Standard Delivery - ₹ {deliveryCharge}
                      </p>
                      <p className="text-gray-600">{formatDate()}</p>
                      <p className="text-gray-600">Pincode - {pincode}</p>
                    </div>

                    {/* Price and Actions Row - Mobile/Tablet */}
                    <div className="flex items-center justify-between gap-2 mt-auto">
                      {/* Price */}
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        ₹ {(item.price * item.quantity).toLocaleString()}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          className="text-gray-400 hover:text-red-500 transition p-1"
                          aria-label="Add to wishlist"
                        >
                          <Heart size={20} className="sm:w-6 sm:h-6" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-gray-400 hover:text-red-500 transition p-1"
                          aria-label="Remove from cart"
                        >
                          <Trash2 size={20} className="sm:w-6 sm:h-6" />
                        </button>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 border border-gray-300 rounded-md w-fit">
                      <button
                        onClick={() => handleQuantityChange(item.product_id, item.quantity, "decrement")}
                        className="p-2 sm:p-3 hover:bg-gray-100 transition"
                      >
                        <Minus size={14} className="sm:w-4 sm:h-4" />
                      </button>
                      <span className="text-base sm:text-lg font-medium w-6 sm:w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.product_id, item.quantity, "increment")}
                        className="p-2 sm:p-3 hover:bg-gray-100 transition"
                      >
                        <Plus size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <p className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 text-center sm:text-left">
              Total Amount : <span className="font-bold">₹ {totalAmount.toLocaleString()}</span>
            </p>
            <button 
              onClick={() => navigate("/checkout")}
              className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-12 lg:px-16 text-sm sm:text-base transition whitespace-nowrap rounded"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

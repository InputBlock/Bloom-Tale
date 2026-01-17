import { useCart } from "../../context/CartContext"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/common/Header"

export default function ProductCart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, isLoggedIn, fetchCart, loading } = useCart()
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
  const totalAmount = getCartTotal() + deliveryCharge

  const handleQuantityChange = (product_id, currentQuantity, type) => {
    if (type === "increment") {
      updateQuantity(product_id, currentQuantity + 1)
    } else if (type === "decrement" && currentQuantity > 1) {
      updateQuantity(product_id, currentQuantity - 1)
    }
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
            <p className="text-gray-600 mb-6 font-['Poppins']">Add some beautiful blooms to your cart!</p>
            <button
              onClick={() => navigate("/home")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-md transition font-['Poppins']"
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
        </div>

        {/* Cart Items */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {cartItems.map((item) => {
            const productInfo = item.product || {}
            const productImage = productInfo.images_uri?.[0] || null
            
            return (
              <div
                key={item._id || item.product_id}
                className="relative bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={productInfo.name || "Product"}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-gradient-to-br from-[#EDE8E0] to-[#5e6043]/10 rounded-lg">
                        <span className="text-4xl">🌸</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    {/* Product Title - Larger */}
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-serif text-gray-900 mb-2 leading-tight">
                      {productInfo.name || "Product"}
                    </h3>
                    
                    {/* Delivery Info - Compact */}
                    <p className="text-sm text-gray-600 font-['Poppins'] mb-1">
                      Standard Delivery - ₹ {deliveryCharge}
                    </p>
                  </div>

                  {/* Right Side - Price & Controls */}
                  <div className="flex flex-col items-end gap-3">
                    {/* Price */}
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 font-['Poppins']">
                      ₹ {(item.price * item.quantity).toLocaleString()}
                    </p>

                    {/* Controls Row */}
                    <div className="flex items-center gap-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() => handleQuantityChange(item.product_id, item.quantity, "decrement")}
                          className="p-2 hover:bg-gray-100 transition"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-base font-medium w-8 text-center font-['Poppins']">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.product_id, item.quantity, "increment")}
                          className="p-2 hover:bg-gray-100 transition"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition p-2 rounded-md border border-gray-300 hover:border-red-300"
                        aria-label="Remove from cart"
                      >
                        <Trash2 size={18} />
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
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 font-['Poppins']">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </p>
              <p className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 font-['Poppins']">
                Total Amount : <span className="font-bold">₹ {totalAmount.toLocaleString()}</span>
              </p>
            </div>
            <button 
              onClick={() => navigate("/checkout", { state: { totalAmount } })}
              className="w-full sm:w-auto font-semibold py-2.5 sm:py-3 px-6 sm:px-12 lg:px-16 text-sm sm:text-base transition whitespace-nowrap rounded shadow-md bg-[#5d6c4e] hover:bg-[#4a5840] text-white hover:shadow-lg font-['Poppins']"
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

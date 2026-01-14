import { useCart } from "../context/CartContext"
import { Minus, Plus, Trash2, MapPin, Heart } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function ProductCart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart()
  const [pincode, setPincode] = useState("400018")
  const navigate = useNavigate()

  const deliveryCharge = 25
  const totalAmount = getCartTotal() + deliveryCharge

  const handleQuantityChange = (cartId, currentQuantity, type) => {
    if (type === "increment") {
      updateQuantity(cartId, currentQuantity + 1)
    } else if (type === "decrement" && currentQuantity > 1) {
      updateQuantity(cartId, currentQuantity - 1)
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

  if (cartItems.length === 0) {
    return (
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
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-gray-900 mb-4">Shopping Cart</h1>
          <div className="flex items-center justify-center gap-2 text-gray-700">
            <MapPin size={20} />
            <span className="font-medium">Delivery to:</span>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 w-40 text-center"
              placeholder="Enter pincode"
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {cartItems.map((item) => (
            <div
              key={item.cartId}
              className="bg-white rounded-lg shadow-sm p-6 flex flex-col lg:flex-row gap-6"
            >
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-48 h-48 object-cover rounded-lg"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-serif text-gray-900 mb-2">{item.name}</h3>
                  
                  {/* Delivery Info */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-900">
                      Standard Delivery - ₹ {deliveryCharge}
                    </p>
                    <p className="text-sm text-gray-600">{formatDate()}</p>
                    <p className="text-sm text-gray-600">Pincode - {pincode}</p>
                  </div>
                </div>
              </div>

              {/* Price and Actions */}
              <div className="flex flex-col items-end justify-between">
                <div className="flex items-start gap-4">
                  <p className="text-2xl font-bold text-gray-900">
                    ₹ {(item.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    className="text-gray-400 hover:text-red-500 transition"
                    aria-label="Add to wishlist"
                  >
                    <Heart size={24} />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="text-gray-400 hover:text-red-500 transition"
                    aria-label="Remove from cart"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 border border-gray-300 rounded-md mt-4">
                  <button
                    onClick={() => handleQuantityChange(item.cartId, item.quantity, "decrement")}
                    className="p-3 hover:bg-gray-100 transition"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.cartId, item.quantity, "increment")}
                    className="p-3 hover:bg-gray-100 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xl sm:text-2xl font-medium text-gray-900">
              Total Amount : <span className="font-bold">₹ {totalAmount.toLocaleString()}</span>
            </p>
            <button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-8 sm:px-16 text-sm sm:text-base transition whitespace-nowrap">
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

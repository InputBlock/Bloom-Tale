import { useCart } from "../../context/CartContext"
import { Minus, Plus, Trash2, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/common/Header"
import { IoCheckboxOutline, IoSquareOutline } from "react-icons/io5"

export default function ProductCart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, isLoggedIn, fetchCart, loading } = useCart()
  const [pincode, setPincode] = useState("400018")
  const [selectedItems, setSelectedItems] = useState([])
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

  // Initialize all items as selected when cart loads
  useEffect(() => {
    if (cartItems.length > 0) {
      setSelectedItems(cartItems.map(item => item.product_id))
    }
  }, [cartItems.length])

  const deliveryCharge = 25
  
  // Calculate total for selected items only
  const selectedItemsTotal = cartItems
    .filter(item => selectedItems.includes(item.product_id))
    .reduce((total, item) => total + (item.price * item.quantity), 0)
  
  const totalAmount = selectedItemsTotal + (selectedItems.length > 0 ? deliveryCharge : 0)

  // Handle checkbox selection
  const handleSelectItem = (product_id) => {
    setSelectedItems(prev => 
      prev.includes(product_id) 
        ? prev.filter(id => id !== product_id)
        : [...prev, product_id]
    )
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(cartItems.map(item => item.product_id))
    }
  }

  const isAllSelected = selectedItems.length === cartItems.length && cartItems.length > 0

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
        </div>

        {/* Select All Checkbox */}
        <div className="mb-3 sm:mb-4 bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-200 hover:border-[#5d6c4e] transition-colors">
          <div 
            onClick={handleSelectAll}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="flex-shrink-0">
              {isAllSelected ? (
                <IoCheckboxOutline className="w-6 h-6 text-[#5d6c4e] transition-transform group-hover:scale-110" />
              ) : (
                <IoSquareOutline className="w-6 h-6 text-gray-400 transition-all group-hover:text-[#5d6c4e] group-hover:scale-110" />
              )}
            </div>
            <span className="text-sm sm:text-base font-semibold text-gray-900">
              Select All ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </span>
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
                className={`relative bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 border-2 transition-all ${
                  selectedItems.includes(item.product_id) 
                    ? 'border-[#5d6c4e] shadow-md' 
                    : 'border-transparent hover:border-gray-200'
                }`}
              >
                {/* Checkbox - Top Right */}
                <div 
                  onClick={() => handleSelectItem(item.product_id)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 cursor-pointer group z-10"
                >
                  {selectedItems.includes(item.product_id) ? (
                    <IoCheckboxOutline className="w-7 h-7 sm:w-8 sm:h-8 text-[#5d6c4e] transition-transform group-hover:scale-110" />
                  ) : (
                    <IoSquareOutline className="w-7 h-7 sm:w-8 sm:h-8 text-gray-300 transition-all group-hover:text-[#5d6c4e] group-hover:scale-110" />
                  )}
                </div>

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

                    {/* Price and Quantity Row */}
                    <div className="flex items-center justify-between gap-3 mt-auto flex-wrap">
                      {/* Price */}
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        ₹ {(item.price * item.quantity).toLocaleString()}
                      </p>

                      {/* Quantity Selector and Delete Button */}
                      <div className="flex items-center gap-3">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-2 border border-gray-300 rounded-md">
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
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition p-2 rounded-md border border-gray-300 hover:border-red-300"
                      aria-label="Remove from cart"
                    >
                      <Trash2 size={20} className="sm:w-5 sm:h-5" />
                    </button>
                      </div>
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
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                {selectedItems.length} item(s) selected
              </p>
              <p className="text-base sm:text-lg lg:text-xl font-medium text-gray-900">
                Total Amount : <span className="font-bold">₹ {totalAmount.toLocaleString()}</span>
              </p>
            </div>
            <button 
              onClick={() => {
                if (selectedItems.length > 0) {
                  navigate("/checkout", { state: { selectedItems, totalAmount } })
                }
              }}
              disabled={selectedItems.length === 0}
              className={`w-full sm:w-auto font-semibold py-2.5 sm:py-3 px-6 sm:px-12 lg:px-16 text-sm sm:text-base transition whitespace-nowrap rounded shadow-md ${
                selectedItems.length === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#5d6c4e] hover:bg-[#4a5840] text-white hover:shadow-lg'
              }`}
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

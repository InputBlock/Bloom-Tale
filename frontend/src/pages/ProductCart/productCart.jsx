import { useCart } from "../../context/CartContext"
import { Minus, Plus, Trash2, ChevronDown, ChevronUp, Package } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/common/Header"

export default function ProductCart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, isLoggedIn, fetchCart, loading } = useCart()
  const navigate = useNavigate()
  const [expandedCombos, setExpandedCombos] = useState({})

  // Count combos for numbering
  const getComboNumber = (index) => {
    let comboCount = 0
    for (let i = 0; i <= index; i++) {
      if (sortedCartItems[i]?.isCombo) {
        comboCount++
      }
    }
    return comboCount
  }

  const toggleComboDetails = (itemId) => {
    setExpandedCombos(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

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

  // Sort cart items to show combos first
  const sortedCartItems = [...cartItems].sort((a, b) => {
    if (a.isCombo && !b.isCombo) return -1
    if (!a.isCombo && b.isCombo) return 1
    return 0
  })

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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-serif text-gray-900 mb-3 sm:mb-4">Your Cart is Empty</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 font-['Poppins']">Add some beautiful blooms to your cart!</p>
            <button
              onClick={() => navigate("/shop")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 sm:px-8 text-sm sm:text-base rounded-sm transition-all active:scale-95 font-['Poppins']"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-gray-900 mb-3 sm:mb-4">Shopping Cart</h1>
        </div>

        {/* Cart Items */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {sortedCartItems.map((item, index) => {
            const isCombo = item.isCombo
            const isExpanded = expandedCombos[item._id || item.product_id]
            
            if (isCombo) {
              // COMBO ITEM RENDERING
              const comboNumber = getComboNumber(index)
              const comboImages = item.combo_items?.map(ci => ci.image).filter(Boolean) || []
              
              return (
                <div
                  key={item._id || item.product_id}
                  className="relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start gap-4 sm:gap-6">
                      {/* Combo Image Collage */}
                      <div className="flex-shrink-0">
                        {comboImages.length > 0 ? (
                          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-[#3e4026]/20 shadow-md">
                            {comboImages.length === 1 ? (
                              <img
                                src={comboImages[0]}
                                alt="Combo item"
                                className="w-full h-full object-cover"
                              />
                            ) : comboImages.length === 2 ? (
                              <div className="grid grid-cols-2 w-full h-full">
                                <img
                                  src={comboImages[0]}
                                  alt="Item 1"
                                  className="w-full h-full object-cover"
                                />
                                <img
                                  src={comboImages[1]}
                                  alt="Item 2"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : comboImages.length === 3 ? (
                              <>
                                <img
                                  src={comboImages[0]}
                                  alt="Item 1"
                                  className="absolute top-0 left-0 w-1/2 h-full object-cover"
                                />
                                <img
                                  src={comboImages[1]}
                                  alt="Item 2"
                                  className="absolute top-0 right-0 w-1/2 h-1/2 object-cover"
                                />
                                <img
                                  src={comboImages[2]}
                                  alt="Item 3"
                                  className="absolute bottom-0 right-0 w-1/2 h-1/2 object-cover"
                                />
                              </>
                            ) : (
                              <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                                {comboImages.slice(0, 4).map((img, idx) => (
                                  <img
                                    key={idx}
                                    src={img}
                                    alt={`Item ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                ))}
                              </div>
                            )}
                            {/* Combo Badge */}
                            <div className="absolute top-1 left-1 bg-[#3e4026] text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg">
                              {comboImages.length} Items
                            </div>
                          </div>
                        ) : (
                          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-gradient-to-br from-[#3e4026]/10 to-[#3e4026]/5 rounded-xl border-2 border-[#3e4026]/20">
                            <Package className="w-10 h-10 text-[#3e4026]/40" />
                          </div>
                        )}
                      </div>

                      {/* Combo Info */}
                      <div className="flex-1 min-w-0">
                        {/* Combo Title */}
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl sm:text-2xl font-bold text-[#3e4026]">
                            Combo {comboNumber}
                          </h3>
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                            {item.discount_percentage}% OFF
                          </span>
                        </div>
                        
                        {/* Combo Details Summary */}
                        <p className="text-sm text-gray-600 mb-2">
                          {item.combo_items?.length || 0} items • Delivery: ₹{item.delivery_charge}
                        </p>

                        {/* View Details Button */}
                        <button
                          onClick={() => toggleComboDetails(item._id || item.product_id)}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3e4026] hover:text-[#2d2f1c] transition-colors border-b-2 border-transparent hover:border-[#3e4026] pb-0.5"
                        >
                          {isExpanded ? 'Hide Details' : 'View Details'}
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>

                      {/* Right Side - Price & Controls */}
                      <div className="flex flex-col items-end gap-3">
                        {/* Original & Discounted Price */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500 line-through">
                            ₹{item.subtotal?.toLocaleString()}
                          </p>
                          <p className="text-2xl font-bold text-[#3e4026]">
                            ₹{item.price?.toLocaleString()}
                          </p>
                          <p className="text-xs text-green-600 font-semibold">
                            Saved ₹{item.discount?.toLocaleString()}
                          </p>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition p-2.5 rounded-lg border border-gray-300 hover:border-red-300"
                          aria-label="Remove combo"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Combo Details */}
                    {isExpanded && item.combo_items && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Items in this Combo</h4>
                        <div className="space-y-3">
                          {item.combo_items.map((comboItem, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              {/* Item Image */}
                              <div className="flex-shrink-0">
                                {comboItem.image ? (
                                  <img
                                    src={comboItem.image}
                                    alt={comboItem.name}
                                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                  />
                                ) : (
                                  <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-lg">
                                    <Package className="w-6 h-6 text-gray-400" />
                                  </div>
                                )}
                              </div>

                              {/* Item Info */}
                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                                  {comboItem.name}
                                </h5>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  {comboItem.size && (
                                    <span className="px-2 py-0.5 bg-white border border-gray-300 rounded-full font-medium">
                                      {comboItem.size}
                                    </span>
                                  )}
                                  {comboItem.color && (
                                    <span className="flex items-center gap-1">
                                      <div 
                                        className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                                        style={{ backgroundColor: comboItem.color.hex }}
                                      />
                                      <span>{comboItem.color.name}</span>
                                    </span>
                                  )}
                                  <span className="font-semibold">Qty: {comboItem.quantity}</span>
                                </div>
                              </div>

                              {/* Item Price */}
                              <div className="text-right">
                                <p className="text-sm font-bold text-gray-900">
                                  ₹{(comboItem.price * comboItem.quantity).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Combo Pricing Summary */}
                        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Subtotal</span>
                              <span className="font-semibold">₹{item.subtotal?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Delivery</span>
                              <span className="font-semibold">₹{item.delivery_charge?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-green-700">
                              <span className="font-semibold">Discount ({item.discount_percentage}%)</span>
                              <span className="font-bold">-₹{item.discount?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-green-300">
                              <span className="font-bold text-[#3e4026]">Total</span>
                              <span className="font-bold text-[#3e4026] text-lg">₹{item.price?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            }
            
            // REGULAR PRODUCT RENDERING
            const productInfo = item.product || {}
            const productImage = productInfo.images_uri?.[0] || null
            
            return (
              <div
                key={item._id || item.product_id}
                className="relative bg-white rounded-sm shadow-sm p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={productInfo.name || "Product"}
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover object-center rounded-sm"
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
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-serif text-gray-900 mb-1 sm:mb-2 leading-tight">
                      {productInfo.name || "Product"}
                    </h3>
                    
                    {/* Delivery Info - Compact */}
                    <p className="text-xs sm:text-sm text-gray-600 font-['Poppins'] mb-1">
                      Standard Delivery - ₹ {deliveryCharge}
                    </p>
                  </div>

                  {/* Right Side - Price & Controls */}
                  <div className="flex flex-col items-end gap-2 sm:gap-3">
                    {/* Price */}
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 font-['Poppins']">
                      ₹ {(item.price * item.quantity).toLocaleString()}
                    </p>

                    {/* Controls Row */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-300 rounded-sm">
                        <button
                          onClick={() => handleQuantityChange(item.product_id, item.quantity, "decrement")}
                          className="p-2 hover:bg-gray-100 transition-all active:scale-95"
                        >
                          <Minus size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <span className="text-sm sm:text-base font-medium w-7 sm:w-8 text-center font-['Poppins']">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.product_id, item.quantity, "increment")}
                          className="p-2 hover:bg-gray-100 transition-all active:scale-95"
                        >
                          <Plus size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95 p-2 rounded-sm border border-gray-300 hover:border-red-300"
                        aria-label="Remove from cart"
                      >
                        <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4">
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
              className="w-full sm:w-auto font-semibold py-2.5 sm:py-3 px-6 sm:px-12 lg:px-16 text-sm sm:text-base transition-all active:scale-95 whitespace-nowrap rounded-sm shadow-md bg-[#5d6c4e] hover:bg-[#4a5840] text-white hover:shadow-lg font-['Poppins']"
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

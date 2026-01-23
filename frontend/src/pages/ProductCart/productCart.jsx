import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useCart } from "../../context/CartContext"
import Header from "../../components/common/Header"
import { DELIVERY_CONSTANTS, getRemainingForFreeDelivery } from "../../constants/delivery"
import { 
  FreeDeliveryBanner, 
  ComboCartItem, 
  RegularCartItem, 
  CartFooter, 
  EmptyCart 
} from "./components"

export default function ProductCart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, isLoggedIn, loading } = useCart()
  const navigate = useNavigate()
  const [expandedCombos, setExpandedCombos] = useState({})

  // Redirect if not logged in
  if (!isLoggedIn()) {
    navigate("/login", { state: { from: "/cart" }, replace: true })
    return null
  }

  // Sort cart items: combos first
  const sortedCartItems = [...cartItems].sort((a, b) => {
    if (a.isCombo && !b.isCombo) return -1
    if (!a.isCombo && b.isCombo) return 1
    return 0
  })

  // Check if any cart item has same-day delivery
  const hasSameDayDelivery = cartItems.some(item => 
    item.deliveryType === 'fixed' || item.deliveryType === 'midnight' || item.deliveryType === 'express'
  )

  // Use appropriate threshold based on delivery type
  const { FREE_DELIVERY_THRESHOLD, SAME_DAY_FREE_DELIVERY_THRESHOLD } = DELIVERY_CONSTANTS
  const freeDeliveryThreshold = hasSameDayDelivery ? SAME_DAY_FREE_DELIVERY_THRESHOLD : FREE_DELIVERY_THRESHOLD
  
  // Calculate delivery and totals
  const cartTotal = getCartTotal()
  const baseDeliveryCharge = cartItems.reduce((maxCharge, item) => {
    const itemCharge = item.delivery_charge || item.deliveryFee || 0
    return Math.max(maxCharge, itemCharge)
  }, 0)
  
  // Check if any combo has free delivery already applied
  const hasComboWithFreeDelivery = cartItems.some(item => 
    item.isCombo && (item.freeDeliveryApplied || item.delivery_charge === 0)
  )
  
  // Free delivery if: cart >= threshold OR combo already has free delivery
  const isFreeDelivery = cartTotal >= freeDeliveryThreshold || hasComboWithFreeDelivery
  
  // For same-day delivery, only fixed time can be free (midnight/express always charged)
  const hasMidnightOrExpress = cartItems.some(item => 
    item.deliveryType === 'midnight' || item.deliveryType === 'express'
  )
  const deliveryCharge = (isFreeDelivery && !hasMidnightOrExpress) ? 0 : baseDeliveryCharge
  const remainingForFree = isFreeDelivery ? 0 : Math.max(freeDeliveryThreshold - cartTotal, 0)
  const totalAmount = cartTotal + deliveryCharge

  // Get combo number for display
  const getComboNumber = (index) => {
    let comboCount = 0
    for (let i = 0; i <= index; i++) {
      if (sortedCartItems[i]?.isCombo) comboCount++
    }
    return comboCount
  }

  // Handlers
  const toggleComboDetails = (itemId) => {
    setExpandedCombos(prev => ({ ...prev, [itemId]: !prev[itemId] }))
  }

  const handleQuantityChange = (product_id, currentQuantity, type) => {
    if (type === "increment") {
      updateQuantity(product_id, currentQuantity + 1)
    } else if (type === "decrement" && currentQuantity > 1) {
      updateQuantity(product_id, currentQuantity - 1)
    }
  }

  const handleCheckout = () => {
    navigate("/checkout", { state: { totalAmount } })
  }

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="animate-spin h-12 w-12 text-gray-900" />
        </div>
      </>
    )
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <EmptyCart onContinueShopping={() => navigate("/shop")} />
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
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-gray-900 mb-3 sm:mb-4">
              Shopping Cart
            </h1>
          </div>

          {/* Free Delivery Banner */}
          {cartItems.length > 0 && !hasMidnightOrExpress && (
            <FreeDeliveryBanner
              isFreeDelivery={isFreeDelivery}
              cartTotal={cartTotal}
              remainingForFree={remainingForFree}
              threshold={freeDeliveryThreshold}
            />
          )}

          {/* Midnight/Express delivery notice - no free delivery */}
          {cartItems.length > 0 && hasMidnightOrExpress && (
            <div className="mb-4 sm:mb-6 bg-amber-50 border border-amber-200 p-4 rounded">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-amber-800">
                  Midnight & Express delivery charges apply regardless of order amount
                </span>
              </div>
            </div>
          )}

          {/* Cart Items */}
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            {sortedCartItems.map((item, index) => {
              const itemId = item._id || item.product_id
              
              if (item.isCombo) {
                return (
                  <ComboCartItem
                    key={itemId}
                    item={item}
                    comboNumber={getComboNumber(index)}
                    isExpanded={expandedCombos[itemId]}
                    onToggleDetails={() => toggleComboDetails(itemId)}
                    onRemove={() => removeFromCart(item.product_id)}
                  />
                )
              }
              
              return (
                <RegularCartItem
                  key={itemId}
                  item={item}
                  isFreeDelivery={isFreeDelivery}
                  baseDeliveryCharge={baseDeliveryCharge}
                  onQuantityChange={handleQuantityChange}
                  onRemove={removeFromCart}
                />
              )
            })}
          </div>
        </div>

        {/* Fixed Footer */}
        <CartFooter
          itemCount={cartItems.length}
          totalAmount={totalAmount}
          onCheckout={handleCheckout}
        />
      </div>
    </>
  )
}

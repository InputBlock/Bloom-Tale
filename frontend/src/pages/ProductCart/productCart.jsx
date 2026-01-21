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

  // Calculate delivery and totals
  const { FREE_DELIVERY_THRESHOLD } = DELIVERY_CONSTANTS
  const cartTotal = getCartTotal()
  const baseDeliveryCharge = cartItems.reduce((maxCharge, item) => {
    const itemCharge = item.delivery_charge || item.deliveryFee || 0
    return Math.max(maxCharge, itemCharge)
  }, 0)
  const isFreeDelivery = cartTotal >= FREE_DELIVERY_THRESHOLD
  const deliveryCharge = isFreeDelivery ? 0 : baseDeliveryCharge
  const remainingForFree = getRemainingForFreeDelivery(cartTotal)
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
          {cartItems.length > 0 && (
            <FreeDeliveryBanner
              isFreeDelivery={isFreeDelivery}
              cartTotal={cartTotal}
              remainingForFree={remainingForFree}
              threshold={FREE_DELIVERY_THRESHOLD}
            />
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

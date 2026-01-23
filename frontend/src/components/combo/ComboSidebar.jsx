import { useState, useEffect, useRef } from "react"
import { X, MapPin, Truck, Check, Package, ShoppingCart, Minus, Plus } from "lucide-react"
import { useCombo } from "../../context/ComboContext"
import { useCart } from "../../context/CartContext"
import { useGlobalPincode } from "../../context/PincodeContext"
import { useNavigate } from "react-router-dom"
import SuccessModal from "../common/SuccessModal"

export default function ComboSidebar({ isOpen = true, onClose = () => {} }) {
  const { 
    comboItems, 
    removeFromCombo, 
    updateQuantity,
    selectDeliveryOption,
    calculateTotal,
    calculateDiscount,
    calculateFinalTotal,
    selectedDeliveryOption,
    clearCombo
  } = useCombo()

  const { addToCart } = useCart()
  const { 
    pincode: globalPincode, 
    setPincode, 
    checkPincode, 
    isChecking: pincodeChecking, 
    isPincodeVerified,
    status: pincodeStatus 
  } = useGlobalPincode()
  const navigate = useNavigate()
  
  const [pincodeInput, setPincodeInput] = useState(globalPincode || "")
  const [pincodeMessage, setPincodeMessage] = useState(null)
  const [addingToCart, setAddingToCart] = useState(false)
  const [modalState, setModalState] = useState({ isOpen: false, message: "", type: "success" })

  // Sync local input with global pincode on mount and when global changes
  useEffect(() => {
    if (globalPincode && globalPincode !== pincodeInput) {
      setPincodeInput(globalPincode)
    }
  }, [globalPincode])

  // Show message based on global pincode status
  useEffect(() => {
    if (pincodeStatus === 'available' && globalPincode) {
      setPincodeMessage({ type: 'success', message: 'Delivery available!' })
      selectDeliveryOption('standard')
    } else if (pincodeStatus === 'unavailable' && globalPincode) {
      setPincodeMessage({ type: 'error', message: 'Service not available for this pincode' })
    }
  }, [pincodeStatus, globalPincode])
  
  // Swipe to close state
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartY = useRef(0)
  const sidebarRef = useRef(null)

  // Handle swipe gesture for mobile
  const handleTouchStart = (e) => {
    // Only allow drag from the header/drag handle area
    const touch = e.touches[0]
    dragStartY.current = touch.clientY
    setIsDragging(true)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    const touch = e.touches[0]
    const deltaY = touch.clientY - dragStartY.current
    // Only allow dragging down (positive delta)
    if (deltaY > 0) {
      setDragY(deltaY)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    // If dragged more than 100px down, close the sidebar
    if (dragY > 100) {
      onClose()
    }
    // Reset drag position with animation
    setDragY(0)
  }

  // Reset drag when closed
  useEffect(() => {
    if (!isOpen) {
      setDragY(0)
    }
  }, [isOpen])

  const DELIVERY_CHARGE = 199
  const FREE_DELIVERY_THRESHOLD = 1500
  
  // Check if combo qualifies for free delivery
  const discountedTotal = calculateTotal() - calculateDiscount()
  const qualifiesForFreeDelivery = discountedTotal >= FREE_DELIVERY_THRESHOLD || 
                                   (discountedTotal + DELIVERY_CHARGE) >= FREE_DELIVERY_THRESHOLD
  const finalDeliveryCharge = qualifiesForFreeDelivery ? 0 : DELIVERY_CHARGE

  const handleVerifyPincode = async () => {
    if (pincodeInput.length !== 6) {
      setPincodeMessage({ type: 'error', message: 'Please enter valid 6-digit pincode' })
      return
    }

    setPincodeMessage(null)
    
    // Use global pincode context to check
    const result = await checkPincode(pincodeInput)
    
    if (result.success) {
      setPincodeMessage({ type: 'success', message: result.message })
      selectDeliveryOption('standard')
    } else {
      setPincodeMessage({ type: 'error', message: result.message })
    }
  }

  const handleAddToCart = async () => {
    if (!isPincodeVerified || comboItems.length === 0 || addingToCart) return

    setAddingToCart(true)
    
    try {
      const subtotal = calculateTotal()
      const discount = calculateDiscount()
      const discountedPrice = subtotal - discount
      // Only add delivery if doesn't qualify for free delivery
      const finalPrice = discountedPrice + finalDeliveryCharge
      
      // Create combo product with all details
      const comboProduct = {
        product_id: `COMBO_${Date.now()}`,
        name: 'Custom Combo Package',
        quantity: 1,
        price: finalPrice, // Price after 20% discount + delivery (₹1559)
        isCombo: true,
        combo_items: comboItems.map(item => ({
          product_id: item.product_id,
          name: item.name,
          image: item.images_uri,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor,
          price: item.price
        })),
        delivery_pincode: globalPincode || pincodeInput,
        delivery_charge: 0, // Delivery already included in price
        subtotal: calculateTotal(),
        discount: calculateDiscount(),
        discount_percentage: 20
      }

      const result = await addToCart(comboProduct)
      
      if (result?.success) {
        // Show success modal
        setModalState({ 
          isOpen: true, 
          message: "Combo added to cart successfully! Redirecting...", 
          type: "success" 
        })
        
        // Clear combo and show success
        clearCombo()
        setPincodeInput('')
        setPincodeMessage(null)
        
        // Navigate to cart page
        setTimeout(() => {
          setModalState({ isOpen: false, message: "", type: "success" })
          navigate('/cart')
        }, 1500)
      } else {
        setModalState({ 
          isOpen: true, 
          message: result?.message || "Failed to add combo to cart", 
          type: "error" 
        })
        setTimeout(() => setModalState({ isOpen: false, message: "", type: "success" }), 3000)
      }
    } catch (error) {
      console.error('Error adding combo to cart:', error)
      setModalState({ 
        isOpen: true, 
        message: "Failed to add combo to cart", 
        type: "error" 
      })
      setTimeout(() => setModalState({ isOpen: false, message: "", type: "success" }), 3000)
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <div 
      ref={sidebarRef}
      className={`fixed left-0 right-0 bottom-0 md:right-0 md:left-auto md:top-[78px] md:bottom-auto h-[85vh] md:h-[calc(100vh-73px)] w-full md:w-[320px] bg-white border-t md:border-t-0 md:border-l border-gray-200 z-50 flex flex-col overflow-hidden rounded-t-3xl md:rounded-none ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      } md:translate-y-0 md:translate-x-0`}
      style={{
        transform: `translateY(${isOpen ? dragY : '100%'}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        boxShadow: isOpen ? '0 -10px 40px -10px rgba(0,0,0,0.2)' : 'none'
      }}
    >
      {/* Drag Handle - Mobile Only - Swipe to close */}
      <div 
        className="md:hidden flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-10 h-1.5 bg-gray-300 rounded-full mb-1"></div>
        <p className="text-[10px] text-gray-400 font-medium">Swipe down to close</p>
      </div>
      
      {/* Header */}
      <div className="px-4 pb-3 pt-1 md:pt-4 flex-shrink-0 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#3e4026] rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#3e4026]">Your Combo</h2>
              <p className="text-xs text-gray-500">{comboItems.length} {comboItems.length === 1 ? 'item' : 'items'} • Save 20%</p>
            </div>
          </div>
          {/* X button - Desktop Only */}
          <button
            onClick={onClose}
            className="hidden md:flex p-2 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
        {/* Pincode Section */}
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-[#3e4026]" />
            <h3 className="text-sm font-medium text-[#3e4026]">Delivery Pincode</h3>
          </div>
          
          <div className="flex items-stretch gap-2">
            <input
              type="text"
              value={pincodeInput}
              onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter pincode"
              className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-[#3e4026] focus:ring-1 focus:ring-[#3e4026]/20 focus:outline-none transition-all"
              maxLength={6}
            />
            <button
              onClick={handleVerifyPincode}
              disabled={pincodeInput.length !== 6 || pincodeChecking}
              className="flex-shrink-0 px-4 py-2 text-sm bg-[#3e4026] text-white rounded-md font-medium hover:bg-[#2d2f1c] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap min-w-[70px]"
            >
              {pincodeChecking ? (
                <span className="flex items-center justify-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                </span>
              ) : 'Check'}
            </button>
          </div>

          {pincodeMessage && (
            <div className={`mt-3 p-2.5 rounded-lg flex items-center gap-2 text-xs font-medium ${
              pincodeMessage.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200 shadow-sm' 
                : 'bg-red-50 text-red-700 border border-red-200 shadow-sm'
            }`}>
              {pincodeMessage.type === 'success' ? (
                <Check className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <X className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>{pincodeMessage.message}</span>
            </div>
          )}
        </div>

        {/* Standard Delivery Info */}
        {isPincodeVerified && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-[#3e4026]/10 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-[#3e4026]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-[#3e4026]">Standard Delivery</h3>
                  <span className="text-sm font-medium text-[#3e4026]">₹{DELIVERY_CHARGE}</span>
                </div>
                <p className="text-xs text-[#3e4026]/60 leading-relaxed">
                  Expected delivery in 2-3 business days
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Combo Items */}
        {comboItems.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm text-[#3e4026]">Items in Combo</h3>
            {comboItems.map((item) => (
              <div key={`${item.product_id}-${item.selectedSize || item.selectedColor?.id}`} className="flex gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                  {item.images_uri ? (
                    <img src={item.images_uri} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-[#3e4026] truncate leading-tight">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    {item.selectedSize && (
                      <span className="text-[10px] px-2 py-0.5 bg-[#3e4026]/5 border border-[#3e4026]/20 rounded-full font-medium text-[#3e4026]">
                        {item.selectedSize}
                      </span>
                    )}
                    {item.selectedColor && (
                      <div className="flex items-center gap-1">
                        <div 
                          className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm" 
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <span className="text-[10px] text-[#3e4026]/70 font-medium">{item.selectedColor.name}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-[#3e4026] mt-1.5">₹{item.price.toLocaleString()}</p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCombo(item.product_id, item.selectedSize, item.selectedColor?.id)}
                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  
                  <div className="flex items-center gap-1 bg-gray-50 rounded-lg border border-gray-200">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.selectedSize, item.selectedColor?.id, Math.max(1, item.quantity - 1))}
                      className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 transition-colors rounded-l-lg"
                    >
                      <Minus className="w-3 h-3 text-[#3e4026]" />
                    </button>
                    <span className="text-xs font-semibold w-7 text-center text-[#3e4026]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.selectedSize, item.selectedColor?.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 transition-colors rounded-r-lg"
                    >
                      <Plus className="w-3 h-3 text-[#3e4026]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 flex-shrink-0">
        {comboItems.length > 0 ? (
          <>
            <div className="space-y-2.5 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#3e4026]/70">Subtotal</span>
                <span className="text-[#3e4026]">₹{calculateTotal().toFixed(2)}</span>
              </div>
              
              {isPincodeVerified && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#3e4026]/70">Delivery</span>
                  {qualifiesForFreeDelivery ? (
                    <span className="text-green-600 font-medium">FREE</span>
                  ) : (
                    <span className="text-[#3e4026]">₹{DELIVERY_CHARGE.toFixed(2)}</span>
                  )}
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Discount (20%)</span>
                <span className="text-green-600">-₹{calculateDiscount().toFixed(2)}</span>
              </div>
              
              <div className="pt-2.5 border-t-2 border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-[#3e4026]">Total</span>
                  <span className="text-xl font-bold text-[#3e4026]">
                    ₹{(calculateTotal() - calculateDiscount() + (isPincodeVerified ? finalDeliveryCharge : 0)).toFixed(2)}
                  </span>
                </div>
                {isPincodeVerified && qualifiesForFreeDelivery && (
                  <p className="text-xs text-green-600 mt-1 text-right">
                    Total Saved: ₹{(calculateDiscount() + DELIVERY_CHARGE).toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!isPincodeVerified || comboItems.length === 0 || addingToCart}
              className="w-full bg-[#3e4026] text-white py-3.5 rounded-lg font-bold hover:bg-[#2d2f1c] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-md disabled:shadow-none"
            >
              <ShoppingCart className="w-4 h-4" />
              {addingToCart ? 'Adding to Cart...' : isPincodeVerified ? 'Add Combo to Cart' : 'Verify Pincode First'}
            </button>
          </>
        ) : (
          <div className="text-center py-6">
            <Package className="w-12 h-12 text-[#3e4026]/20 mx-auto mb-2" />
            <p className="text-[#3e4026]/50 text-sm font-medium">Your combo is empty</p>
          </div>
        )}
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

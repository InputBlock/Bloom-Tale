import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, Package, ShoppingBag, Truck, CreditCard, Lock } from "lucide-react"
import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"
import DeliveryDetails from "./DeliveryDetails"
import OrderSummary from "./OrderSummary"
import Payment from "./Payment"
import { useCart } from "../../context/CartContext"
import { orderAPI } from "../../api"

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [orderId, setOrderId] = useState(null)
  const [orderDetails, setOrderDetails] = useState(null)
  const { cartItems, getCartTotal } = useCart()
  
  const [formData, setFormData] = useState({
    saveAddress: false,
    title: "Mr.",
    recipientName: "",
    country: "India",
    streetAddress: "",
    apartment: "",
    pincode: "",
    city: "",
    state: "",
    mobileNumber: "",
    alternateMobile: "",
    email: "",
    what3words: "",
    addressType: "Home",
    addressTag: "",
    whatsappUpdates: true,
    messageOccasion: "General Gifting",
    personalizeMessage: false,
    customMessage: "",
    messageType: ""
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleDeliverySubmit = async (newOrderId) => {
    setOrderId(newOrderId)
    
    // Fetch order details
    try {
      const { response, data } = await orderAPI.getSummary(newOrderId)

      if (response.ok) {
        setOrderDetails(data.data)
      }
    } catch (error) {
      console.error("Error fetching order details:", error)
    }
    
    setCurrentStep(2)
  }

  const steps = [
    { id: 1, name: "Delivery", icon: Truck },
    { id: 2, name: "Review", icon: ShoppingBag },
    { id: 3, name: "Payment", icon: CreditCard },
  ]

  // Calculate cart total for sidebar
  const cartTotal = getCartTotal ? getCartTotal() : 0
  
  // Calculate delivery fee from cart items (before order is created)
  const cartDeliveryFee = cartItems?.reduce((maxCharge, item) => {
    const itemCharge = item.delivery_charge || item.deliveryFee || 0
    return Math.max(maxCharge, itemCharge)
  }, 0) || 0
  
  // Calculate handling charge for Candles category (₹50 fixed)
  const CANDLE_HANDLING_CHARGE = 50
  const hasCandles = cartItems?.some(item => 
    item.product?.category === "Candles" || item.category === "Candles"
  )
  const cartHandlingCharge = hasCandles ? CANDLE_HANDLING_CHARGE : 0
  
  // Use orderDetails values if available, otherwise use cart values
  const displayDeliveryFee = orderDetails?.deliveryFee ?? cartDeliveryFee
  const displayHandlingCharge = orderDetails?.handlingCharge ?? cartHandlingCharge
  
  // Calculate subtotal (items total without delivery/handling)
  const cartItemsTotal = cartItems?.reduce((sum, item) => {
    const price = item.price || item.product?.price || 0
    const quantity = item.quantity || 1
    return sum + (price * quantity)
  }, 0) || 0
  
  // Display values for sidebar
  const displaySubtotal = orderDetails 
    ? (orderDetails.totalAmount - (orderDetails.deliveryFee || 0) - (orderDetails.handlingCharge || 0)) 
    : cartItemsTotal
  const displayTotal = orderDetails 
    ? orderDetails.totalAmount 
    : (cartItemsTotal + cartDeliveryFee + cartHandlingCharge)

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          
          {/* Page Title */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-light text-[#3e4026] tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>Checkout</h1>
            <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-[#5e6043]">
              <Lock size={14} />
              <span>Secure checkout</span>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Column - Main Content */}
            <div className="flex-1">
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon
                    const isCompleted = currentStep > step.id
                    const isCurrent = currentStep === step.id
                    
                    return (
                      <div key={step.id} className="flex items-center flex-1">
                        <button
                          onClick={() => {
                            if (step.id < currentStep) {
                              setCurrentStep(step.id)
                            }
                          }}
                          disabled={step.id > currentStep}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isCompleted 
                              ? "bg-[#3e4026] text-white shadow-lg shadow-[#3e4026]/20" 
                              : isCurrent 
                              ? "bg-[#3e4026] text-white shadow-lg shadow-[#3e4026]/20" 
                              : "bg-[#EDE8E0] text-[#5e6043]"
                          }`}>
                            {isCompleted ? (
                              <CheckCircle2 size={22} />
                            ) : (
                              <StepIcon size={20} />
                            )}
                          </div>
                          <span className={`text-xs font-medium tracking-wide transition-colors ${
                            isCurrent ? "text-[#3e4026]" : isCompleted ? "text-[#3e4026]" : "text-[#5e6043]/60"
                          }`}>
                            {step.name}
                          </span>
                        </button>
                        
                        {index < steps.length - 1 && (
                          <div className="flex-1 h-[2px] mx-4 mt-[-20px]">
                            <div className={`h-full transition-all duration-500 ${
                              isCompleted ? "bg-[#3e4026]" : "bg-[#EDE8E0]"
                            }`} />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <DeliveryDetails
                    formData={formData}
                    handleInputChange={handleInputChange}
                    onSubmit={handleDeliverySubmit}
                  />
                )}

                {currentStep === 2 && (
                  <OrderSummary
                    formData={formData}
                    orderDetails={orderDetails}
                    onBack={() => setCurrentStep(1)}
                    onNext={() => setCurrentStep(3)}
                  />
                )}

                {currentStep === 3 && (
                  <Payment
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    orderDetails={orderDetails}
                    onBack={() => setCurrentStep(2)}
                    orderId={orderId}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Right Column - Order Summary Sidebar */}
            <div className="lg:w-[340px] xl:w-[400px] shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-[#EDE8E0] sticky top-24 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-[#3e4026] to-[#5e6043]">
                  <h3 className="font-medium text-white tracking-wide">Your Order</h3>
                  <p className="text-white/70 text-sm mt-1">{(orderDetails?.items || cartItems || []).length} item(s)</p>
                </div>

                {/* Cart Items */}
                <div className="p-5 max-h-[320px] overflow-y-auto">
                  {(orderDetails?.items || cartItems || []).map((item, index) => {
                    const imageUrl = item.productImage || item.product?.images_uri?.[0] || item.product?.image
                    const name = item.productName || item.product?.name || item.name || 'Product'
                    const price = item.price || item.product?.price || 0
                    const quantity = item.quantity || 1

                    return (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-4 mb-4 pb-4 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0"
                      >
                        <div className="w-20 h-20 bg-[#EDE8E0] rounded-xl overflow-hidden shrink-0">
                          {imageUrl ? (
                            <img src={imageUrl} alt={name} className="w-full h-full object-cover object-center" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={24} className="text-[#5e6043]" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                          <p className="text-sm font-medium text-[#3e4026] line-clamp-2 leading-snug">{name}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-[#5e6043] bg-[#EDE8E0] px-2 py-0.5 rounded">Qty: {quantity}</span>
                            <p className="text-sm font-semibold text-[#3e4026]">
                              ₹{price.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Billing Summary */}
                <div className="p-5 border-t border-[#EDE8E0] bg-[#FAF8F5]">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#5e6043]">Subtotal</span>
                      <span className="text-[#3e4026] font-medium">
                        ₹{displaySubtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5e6043]">Shipping</span>
                      <span className="text-[#3e4026] font-medium">
                        {displayDeliveryFee > 0 
                          ? `₹${displayDeliveryFee.toLocaleString('en-IN')}` 
                          : 'Free'}
                      </span>
                    </div>
                    {displayHandlingCharge > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[#5e6043]">Handling</span>
                        <span className="text-[#3e4026] font-medium">
                          ₹{displayHandlingCharge.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[#5e6043]">Tax</span>
                      <span className="text-[#5e6043]">Included</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-[#EDE8E0]">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-[#3e4026]">Total</span>
                      <span className="text-xl font-bold text-[#3e4026]">
                        ₹{displayTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Trust Badges */}
                <div className="px-5 py-4 border-t border-[#EDE8E0] flex items-center justify-center gap-6 text-xs text-[#5e6043]">
                  <div className="flex items-center gap-1.5">
                    <Lock size={12} />
                    <span>SSL Secured</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck size={12} />
                    <span>Fast Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

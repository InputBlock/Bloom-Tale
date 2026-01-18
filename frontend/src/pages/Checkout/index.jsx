import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, Package, IndianRupee } from "lucide-react"
import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"
import DeliveryDetails from "./DeliveryDetails"
import OrderSummary from "./OrderSummary"
import Payment from "./Payment"
import { useCart } from "../../context/CartContext"

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

  const handleDeliverySubmit = async (orderId) => {
    setOrderId(orderId)
    
    // Fetch order details
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/v1/order/${orderId}/orderSummary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setOrderDetails(data.data)
      }
    } catch (error) {
      console.error("Error fetching order details:", error)
    }
    
    setCurrentStep(2)
  }

  const steps = [
    { id: 1, name: "Delivery Details" },
    { id: 2, name: "Order Summary" },
    { id: 3, name: "Payment" },
  ]

  // Calculate cart total for sidebar
  const cartTotal = getCartTotal ? getCartTotal() : 0

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Main Content */}
            <div className="flex-1">
              {/* Progress Tabs */}
              <div className="bg-white border-b border-gray-200 mb-6">
                <div className="flex">
                  {steps.map((step, index) => (
                    <button
                      key={step.id}
                      onClick={() => {
                        // Only allow going back, not forward
                        if (step.id < currentStep) {
                          setCurrentStep(step.id)
                        }
                      }}
                      disabled={step.id > currentStep}
                      className={`flex-1 py-4 px-6 text-center font-medium transition-all relative ${
                        currentStep === step.id
                          ? "text-gray-900 border-b-2 border-gray-900"
                          : currentStep > step.id
                          ? "text-gray-600 hover:text-gray-900"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {currentStep > step.id && (
                          <CheckCircle2 size={18} className="text-green-600" />
                        )}
                        <span className="text-sm">{step.name}</span>
                      </div>
                    </button>
                  ))}
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
            <div className="lg:w-[380px] flex-shrink-0">
              <div className="bg-white border border-gray-200 sticky top-24">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Order Summary</h3>
                  <span className="font-semibold text-gray-900">
                    Total: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(orderDetails?.totalAmount || cartTotal)}
                  </span>
                </div>

                {/* Cart Items */}
                <div className="p-4 max-h-[400px] overflow-y-auto">
                  {(orderDetails?.items || cartItems || []).map((item, index) => {
                    const imageUrl = item.productImage || item.product?.images_uri?.[0] || item.product?.image
                    const name = item.productName || item.product?.name || item.name || 'Product'
                    const price = item.price || item.product?.price || 0
                    const quantity = item.quantity || 1

                    return (
                      <div key={index} className="flex gap-3 mb-4 pb-4 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {imageUrl ? (
                            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={20} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                          <p className="text-sm text-gray-900 font-semibold mt-1">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Qty. {quantity}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Billing Summary */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Item(s)</span>
                      <span className="text-gray-900">{(orderDetails?.items || cartItems || []).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sub Total</span>
                      <span className="text-gray-900">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(orderDetails?.totalAmount || cartTotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                      <span className="text-gray-900">Total Amount</span>
                      <span className="text-gray-900">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(orderDetails?.totalAmount || cartTotal)}
                      </span>
                    </div>
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

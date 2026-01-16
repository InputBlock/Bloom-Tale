import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"
import DeliveryDetails from "./DeliveryDetails"
import OrderSummary from "./OrderSummary"
import Payment from "./Payment"

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [orderId, setOrderId] = useState(null)
  
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

  const handleDeliverySubmit = (orderId) => {
    setOrderId(orderId)
    setCurrentStep(2)
  }

  return (
    <div className="min-h-screen bg-[#EDE8E0]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-[#3e4026]' : 'text-gray-400'}`}>
                {currentStep > 1 ? (
                  <CheckCircle2 size={24} className="text-green-600" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                    <div className={currentStep === 1 ? 'w-3 h-3 bg-[#3e4026] rounded-full' : ''} />
                  </div>
                )}
                <span className="font-medium">Delivery Details</span>
              </div>
            </div>

            <div className="w-16 h-0.5 bg-gray-300" />

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-[#3e4026]' : 'text-gray-400'}`}>
                {currentStep > 2 ? (
                  <CheckCircle2 size={24} className="text-green-600" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                    <div className={currentStep === 2 ? 'w-3 h-3 bg-[#3e4026] rounded-full' : ''} />
                  </div>
                )}
                <span className="font-medium">Order Summary</span>
              </div>
            </div>

            <div className="w-16 h-0.5 bg-gray-300" />

            {/* Step 3 */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-[#3e4026]' : 'text-gray-400'}`}>
                <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                  <div className={currentStep === 3 ? 'w-3 h-3 bg-[#3e4026] rounded-full' : ''} />
                </div>
                <span className="font-medium">Payment</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Form */}
          <div>
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
                  onBack={() => setCurrentStep(1)}
                  onNext={() => setCurrentStep(3)}
                />
              )}

              {currentStep === 3 && (
                <Payment
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  onBack={() => setCurrentStep(2)}
                  orderId={orderId}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Plus, ChevronDown, ChevronUp, Smartphone, Banknote, ChevronLeft } from "lucide-react"
import Header from "../components/common/Header"
import Footer from "../components/common/Footer"

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showContactDetails, setShowContactDetails] = useState(true)
  const [showMessageCard, setShowMessageCard] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("upi")
  
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

  const occasions = [
    "General Gifting",
    "Christmas",
    "Holiday Season",
    "Birthday",
    "Anniversary",
    "Wedding",
    "House Warming"
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleDeliverySubmit = (e) => {
    e.preventDefault()
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
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-xl shadow-lg p-8"
                >
                  {/* Back to Cart Button */}
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#3e4026] font-medium mb-6 transition-colors"
                  >
                    <ChevronLeft size={20} />
                    <span>Back to Cart</span>
                  </button>

                  <form onSubmit={handleDeliverySubmit} className="space-y-6">
                    {/* Title and Name */}
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Title <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e4026]"
                          required
                        >
                          <option>Mr.</option>
                          <option>Mrs.</option>
                          <option>Ms.</option>
                          <option>Dr.</option>
                        </select>
                      </div>
                      <div className="col-span-3">
                        <label className="block text-gray-700 font-medium mb-2">
                          Recipient Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.recipientName}
                          onChange={(e) => handleInputChange('recipientName', e.target.value)}
                          placeholder="First Name & Last Name"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e4026]"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1 text-right">(0/60)</p>
                      </div>
                    </div>

                    {/* Mobile Numbers */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Recipient Mobile No <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                          <div className="w-20 px-3 py-3 bg-gray-100 border border-gray-300 rounded-lg text-center">
                            + 91
                          </div>
                          <input
                            type="tel"
                            value={formData.mobileNumber}
                            onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                            placeholder="Mobile Number"
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e4026]"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Recipient Alternate Number
                        </label>
                        <div className="flex gap-2">
                          <div className="w-20 px-3 py-3 bg-gray-100 border border-gray-300 rounded-lg text-center">
                            + 91
                          </div>
                          <input
                            type="tel"
                            value={formData.alternateMobile}
                            onChange={(e) => handleInputChange('alternateMobile', e.target.value)}
                            placeholder="Alternate No. (Optional)"
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e4026]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Delivery Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e4026]"
                        required
                      >
                        <option>🇮🇳 India</option>
                        <option>🇺🇸 United States</option>
                        <option>🇬🇧 United Kingdom</option>
                      </select>
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="Maharashtra"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e4026]"
                        required
                      />
                    </div>

                    {/* Pincode and City */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Pincode/Zipcode <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.pincode}
                          onChange={(e) => handleInputChange('pincode', e.target.value)}
                          placeholder="400008"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e4026]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="Mumbai"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e4026]"
                          required
                        />
                      </div>
                    </div>

                    {/* Street Address */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.streetAddress}
                        onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                        placeholder="Building / Area / Locality"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e4026]"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1 text-right">(0/180)</p>
                    </div>

                    {/* Apartment */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        House/Apartment <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.apartment}
                        onChange={(e) => handleInputChange('apartment', e.target.value)}
                        placeholder="Flat No. / Floor / Unit No"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e4026]"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1 text-right">(0/180)</p>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-[#3e4026] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#5e6043] transition-colors"
                    >
                      SAVE & DELIVER
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Previous Button */}
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-2 text-[#3e4026] hover:text-[#5e6043] font-medium transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m15 18-6-6 6-6"/>
                    </svg>
                    Back to Delivery Details
                  </button>

                  {/* Delivery Details Summary */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800">Delivery Details Summary</h3>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-[#3e4026] hover:text-[#5e6043] text-sm font-medium underline"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="space-y-4 text-gray-700">
                      <div className="border-b pb-3">
                        <p className="text-sm text-gray-500 mb-1">Recipient Name</p>
                        <p className="font-semibold">{formData.title} {formData.recipientName}</p>
                      </div>

                      <div className="border-b pb-3">
                        <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
                        <p>{formData.apartment}</p>
                        <p>{formData.streetAddress}</p>
                        <p>{formData.city}, {formData.state} - {formData.pincode}</p>
                        <p>{formData.country}</p>
                      </div>

                      <div className="border-b pb-3">
                        <p className="text-sm text-gray-500 mb-1">Contact Number</p>
                        <p className="font-medium">+91 {formData.mobileNumber}</p>
                        {formData.alternateMobile && (
                          <p className="text-sm text-gray-600">Alt: +91 {formData.alternateMobile}</p>
                        )}
                      </div>

                      {formData.email && (
                        <div className="border-b pb-3">
                          <p className="text-sm text-gray-500 mb-1">Email</p>
                          <p>{formData.email}</p>
                        </div>
                      )}

                      {formData.what3words && (
                        <div className="border-b pb-3">
                          <p className="text-sm text-gray-500 mb-1">What3words</p>
                          <p className="text-sm">{formData.what3words}</p>
                        </div>
                      )}

                      {formData.addressTag && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Address Tag</p>
                          <p className="font-medium">{formData.addressTag}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Navigation Button */}
                  <motion.button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#3e4026] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#5e6043] transition-colors"
                  >
                    MAKE PAYMENT
                  </motion.button>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Previous Button */}
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center gap-2 text-[#3e4026] hover:text-[#5e6043] font-medium transition-colors"
                  >
                    <ChevronLeft size={20} />
                    Back to Order Summary
                  </button>

                  {/* Payment Amount Card */}
                  <div className="bg-gradient-to-r from-[#3e4026] to-[#5e6043] rounded-xl shadow-lg p-8 text-white">
                    <p className="text-sm opacity-90 mb-2">Total Amount</p>
                    <h2 className="text-4xl font-bold mb-1">₹ 1,820</h2>
                    <p className="text-sm opacity-80">Including all taxes and delivery charges</p>
                  </div>

                  {/* Payment Methods */}
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Select Payment Method</h3>
                    
                    <div className="space-y-4">
                      {/* UPI Option */}
                      <motion.button
                        type="button"
                        onClick={() => setPaymentMethod("upi")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full p-6 rounded-lg border-2 transition-all flex items-center gap-4 ${
                          paymentMethod === "upi"
                            ? "border-[#3e4026] bg-[#EDE8E0]"
                            : "border-gray-300 hover:border-[#5e6043]"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          paymentMethod === "upi" ? "bg-[#3e4026] text-white" : "bg-gray-100 text-gray-600"
                        }`}>
                          <Smartphone size={24} />
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="font-semibold text-gray-900 text-lg">UPI Payment</h4>
                          <p className="text-sm text-gray-600">Pay using Google Pay, PhonePe, Paytm & more</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "upi" ? "border-[#3e4026]" : "border-gray-300"
                        }`}>
                          {paymentMethod === "upi" && (
                            <div className="w-3 h-3 bg-[#3e4026] rounded-full" />
                          )}
                        </div>
                      </motion.button>

                      {/* Cash on Delivery Option */}
                      <motion.button
                        type="button"
                        onClick={() => setPaymentMethod("cod")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full p-6 rounded-lg border-2 transition-all flex items-center gap-4 ${
                          paymentMethod === "cod"
                            ? "border-[#3e4026] bg-[#EDE8E0]"
                            : "border-gray-300 hover:border-[#5e6043]"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          paymentMethod === "cod" ? "bg-[#3e4026] text-white" : "bg-gray-100 text-gray-600"
                        }`}>
                          <Banknote size={24} />
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="font-semibold text-gray-900 text-lg">Cash on Delivery</h4>
                          <p className="text-sm text-gray-600">Pay when you receive the order</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "cod" ? "border-[#3e4026]" : "border-gray-300"
                        }`}>
                          {paymentMethod === "cod" && (
                            <div className="w-3 h-3 bg-[#3e4026] rounded-full" />
                          )}
                        </div>
                      </motion.button>
                    </div>

                    {/* Place Order Button */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-8 bg-[#3e4026] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#5e6043] transition-colors shadow-lg"
                    >
                      {paymentMethod === "upi" ? "PROCEED TO PAY ₹ 1,820" : "PLACE ORDER"}
                    </motion.button>

                    {/* Payment Info */}
                    <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <CheckCircle2 size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">
                        <strong>Safe & Secure:</strong> Your payment information is protected with industry-standard encryption.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

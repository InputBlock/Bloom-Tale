import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Smartphone, Banknote, ChevronLeft, Loader2, X, Shield, CreditCard, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Payment({ paymentMethod, setPaymentMethod, onBack, orderId, orderDetails }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const navigate = useNavigate()

  const totalAmount = orderDetails?.totalAmount || 0

  const handlePlaceOrder = async () => {
    if (!orderId) {
      setError("Order ID is missing. Please go back and try again.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const paymentMethodValue = paymentMethod === "upi" ? "ONLINE" : "COD"
      
      // Get token from localStorage for auth
      const token = localStorage.getItem("token")
      const headers = {
        "Content-Type": "application/json",
      }
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      // Step 1: Set payment method
      const response = await fetch(`/api/v1/order/${orderId}/payment-method`, {
        method: "PATCH",
        headers,
        credentials: "include",
        body: JSON.stringify({
          paymentMethod: paymentMethodValue
        }),
      })

      // Get response text first, then try to parse as JSON
      const responseText = await response.text()
      let data
      
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Non-JSON response:", responseText)
        throw new Error("Server error. Please try again.")
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to set payment method")
      }

      // Step 2: Handle based on payment method
      if (paymentMethod === "cod") {
        // Show success modal for COD
        setShowSuccessModal(true)
      } else {
        // Redirect to Razorpay payment page for UPI
        navigate("/razorpay-payment", { state: { orderId } })
      }
      
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.")
      console.error("Payment error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-5"
      >
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <span className="text-red-500 font-medium">!</span>
            </div>
            {error}
          </motion.div>
        )}

        {/* Payment Methods Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#EDE8E0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#EDE8E0]">
            <h3 className="font-medium text-[#3e4026]">Payment Method</h3>
            <p className="text-sm text-[#5e6043] mt-0.5">Choose how you'd like to pay</p>
          </div>
          
          <div className="p-5 space-y-3">
            {/* UPI Option */}
            <motion.button
              type="button"
              onClick={() => setPaymentMethod("upi")}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full p-5 border-2 rounded-xl transition-all flex items-center gap-4 text-left ${
                paymentMethod === "upi"
                  ? "border-[#3e4026] bg-[#EDE8E0]/50 ring-4 ring-[#3e4026]/5"
                  : "border-[#EDE8E0] hover:border-[#5e6043] bg-white"
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                paymentMethod === "upi" ? "bg-[#3e4026] text-white shadow-lg" : "bg-[#EDE8E0] text-[#5e6043]"
              }`}>
                <Smartphone size={22} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-[#3e4026]">UPI / Online Payment</h4>
                  <span className="px-2 py-0.5 bg-[#3e4026]/10 text-[#3e4026] text-[10px] font-medium rounded-full uppercase">Recommended</span>
                </div>
                <p className="text-sm text-[#5e6043] mt-0.5">Pay securely with GPay, PhonePe, Paytm & more</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                paymentMethod === "upi" ? "border-[#3e4026] bg-[#3e4026]" : "border-[#5e6043]/30"
              }`}>
                {paymentMethod === "upi" && (
                  <CheckCircle2 size={14} className="text-white" />
                )}
              </div>
            </motion.button>

            {/* Cash on Delivery Option */}
            <motion.button
              type="button"
              onClick={() => setPaymentMethod("cod")}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full p-5 border-2 rounded-xl transition-all flex items-center gap-4 text-left ${
                paymentMethod === "cod"
                  ? "border-[#3e4026] bg-[#EDE8E0]/50 ring-4 ring-[#3e4026]/5"
                  : "border-[#EDE8E0] hover:border-[#5e6043] bg-white"
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                paymentMethod === "cod" ? "bg-[#3e4026] text-white shadow-lg" : "bg-[#EDE8E0] text-[#5e6043]"
              }`}>
                <Banknote size={22} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-[#3e4026]">Cash on Delivery</h4>
                <p className="text-sm text-[#5e6043] mt-0.5">Pay with cash when your order arrives</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                paymentMethod === "cod" ? "border-[#3e4026] bg-[#3e4026]" : "border-[#5e6043]/30"
              }`}>
                {paymentMethod === "cod" && (
                  <CheckCircle2 size={14} className="text-white" />
                )}
              </div>
            </motion.button>
          </div>
        </div>

        {/* Total Amount Display */}
        <div className="bg-gradient-to-r from-[#3e4026] to-[#5e6043] rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Amount</p>
              <p className="text-3xl font-bold mt-1">₹{totalAmount.toLocaleString('en-IN')}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
              <CreditCard size={24} className="text-white" />
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <motion.button
          type="button"
          onClick={handlePlaceOrder}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.99 }}
          className="w-full py-4 bg-[#3e4026] text-white font-medium rounded-xl hover:bg-[#5e6043] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-[#3e4026]/20"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Processing...</span>
            </>
          ) : (
            <>
              {paymentMethod === "upi" ? (
                <>
                  <span>Pay ₹{totalAmount.toLocaleString('en-IN')}</span>
                  <Sparkles size={18} />
                </>
              ) : (
                <span>Place Order</span>
              )}
            </>
          )}
        </motion.button>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 text-[#5e6043] text-sm">
          <Shield size={14} />
          <span>256-bit SSL encryption • 100% secure checkout</span>
        </div>
      </motion.div>

    {/* Success Modal for COD */}
    <AnimatePresence>
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowSuccessModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background decoration */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-[#EDE8E0] to-[#FAF8F5]" />
            
            {/* Close Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-[#5e6043] hover:text-[#3e4026] transition-colors z-10"
            >
              <X size={18} />
            </button>

            <div className="relative">
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-to-br from-[#3e4026] to-[#5e6043] rounded-full flex items-center justify-center shadow-xl shadow-[#3e4026]/30"
                >
                  <CheckCircle2 size={40} className="text-white" />
                </motion.div>
              </div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-[#3e4026] text-center mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Order Confirmed!
                </h2>
                <p className="text-[#5e6043] text-center text-sm mb-6">
                  Thank you for your order. We'll send you a confirmation email shortly.
                </p>
              </motion.div>

              {/* Order ID */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-2xl p-4 mb-6"
              >
                <p className="text-xs text-[#5e6043] text-center mb-1 uppercase tracking-wide">Order ID</p>
                <p className="text-base font-semibold text-[#3e4026] text-center font-mono">
                  {orderId}
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-[#3e4026] text-white py-3.5 rounded-xl font-medium hover:bg-[#5e6043] transition-all shadow-lg shadow-[#3e4026]/10"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => navigate("/orders")}
                  className="w-full border-2 border-[#EDE8E0] text-[#3e4026] py-3.5 rounded-xl font-medium hover:bg-[#FAF8F5] transition-all"
                >
                  Track Order
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
  )
}

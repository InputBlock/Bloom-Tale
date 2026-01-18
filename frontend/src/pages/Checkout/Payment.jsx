import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Smartphone, Banknote, ChevronLeft, Loader2, X, Shield } from "lucide-react"
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
        className="space-y-6"
      >
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-sm">
            <p className="text-red-600 text-xs sm:text-sm">{error}</p>
          </div>
        )}

        {/* Payment Methods */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Select Payment Method</h3>
          
          {/* UPI Option */}
          <button
            type="button"
            onClick={() => setPaymentMethod("upi")}
            className={`w-full p-4 sm:p-5 border rounded-sm transition-all active:scale-95 flex items-center gap-3 sm:gap-4 text-left ${
              paymentMethod === "upi"
                ? "border-gray-900 bg-gray-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
              paymentMethod === "upi" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"
            }`}>
              <Smartphone size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm sm:text-base font-medium text-gray-900">UPI Payment</h4>
              <p className="text-xs sm:text-sm text-gray-500">Google Pay, PhonePe, Paytm & more</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              paymentMethod === "upi" ? "border-gray-900" : "border-gray-300"
            }`}>
              {paymentMethod === "upi" && (
                <div className="w-2.5 h-2.5 bg-gray-900 rounded-full" />
              )}
            </div>
          </button>

          {/* Cash on Delivery Option */}
          <button
            type="button"
            onClick={() => setPaymentMethod("cod")}
            className={`w-full p-4 sm:p-5 border rounded-sm transition-all active:scale-95 flex items-center gap-3 sm:gap-4 text-left ${
              paymentMethod === "cod"
                ? "border-gray-900 bg-gray-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
              paymentMethod === "cod" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"
            }`}>
              <Banknote size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm sm:text-base font-medium text-gray-900">Cash on Delivery</h4>
              <p className="text-xs sm:text-sm text-gray-500">Pay when you receive the order</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              paymentMethod === "cod" ? "border-gray-900" : "border-gray-300"
            }`}>
              {paymentMethod === "cod" && (
                <div className="w-2.5 h-2.5 bg-gray-900 rounded-full" />
              )}
            </div>
          </button>
        </div>

        {/* Place Order Button */}
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full mt-6 bg-gray-900 text-white py-3 sm:py-3.5 rounded-sm text-sm sm:text-base font-medium hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <span>PROCESSING...</span>
            </>
          ) : (
            paymentMethod === "upi" ? `PROCEED TO PAY ₹${totalAmount.toLocaleString('en-IN')}` : "PLACE ORDER"
          )}
        </button>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 text-gray-400 text-xs sm:text-sm">
          <Shield size={12} className="sm:w-[14px] sm:h-[14px]" />
          <span className="text-center">Secure payment powered by industry-standard encryption</span>
        </div>
      </motion.div>

    {/* Success Modal for COD */}
    <AnimatePresence>
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowSuccessModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-sm shadow-xl max-w-sm w-full p-5 sm:p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-all active:scale-95"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>

            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle2 size={32} className="sm:w-9 sm:h-9 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 text-center mb-2">
              Order Placed!
            </h2>
            <p className="text-gray-500 text-center text-xs sm:text-sm mb-4">
              You will receive a confirmation email shortly.
            </p>

            {/* Order ID */}
            <div className="bg-gray-50 rounded-sm p-3 mb-4 sm:mb-5">
              <p className="text-[10px] sm:text-xs text-gray-400 text-center mb-1">Order ID</p>
              <p className="text-xs sm:text-sm font-medium text-gray-900 text-center font-mono">
                {orderId}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => navigate("/")}
                className="w-full bg-gray-900 text-white py-3 rounded-sm font-medium hover:bg-gray-800 transition-all active:scale-95 text-xs sm:text-sm"
              >
                CONTINUE SHOPPING
              </button>
              <button
                onClick={() => navigate("/orders")}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-sm font-medium hover:bg-gray-50 transition-all active:scale-95 text-xs sm:text-sm"
              >
                VIEW ORDERS
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
  )
}

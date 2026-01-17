import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Smartphone, Banknote, ChevronLeft, Loader2, X } from "lucide-react"
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
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="space-y-6"
      >
        {/* Previous Button */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-[#3e4026] hover:text-[#5e6043] font-medium transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Order Summary
        </button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Payment Amount Card */}
      <div className="bg-gradient-to-r from-[#3e4026] to-[#5e6043] rounded-xl shadow-lg p-8 text-white">
        <p className="text-sm opacity-90 mb-2">Total Amount</p>
        <h2 className="text-4xl font-bold mb-1">₹ {totalAmount.toLocaleString('en-IN')}</h2>
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
          onClick={handlePlaceOrder}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full mt-8 bg-[#3e4026] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#5e6043] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>PROCESSING...</span>
            </>
          ) : (
            paymentMethod === "upi" ? `PROCEED TO PAY ₹ ${totalAmount.toLocaleString('en-IN')}` : "PLACE ORDER"
          )}
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

    {/* Success Modal for COD */}
    <AnimatePresence>
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSuccessModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 size={48} className="text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Your order has been placed successfully. You will receive a confirmation email shortly.
            </p>

            {/* Order ID */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 text-center mb-1">Order ID</p>
              <p className="text-lg font-semibold text-gray-900 text-center font-mono">
                {orderId}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/")}
                className="w-full bg-[#3e4026] text-white py-3 rounded-lg font-semibold hover:bg-[#5e6043] transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate("/orders")}
                className="w-full border-2 border-[#3e4026] text-[#3e4026] py-3 rounded-lg font-semibold hover:bg-[#EDE8E0] transition-colors"
              >
                View Orders
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
  )
}

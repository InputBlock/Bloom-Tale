import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { motion } from "framer-motion"
import Header from "../components/common/Header"
import Footer from "../components/common/Footer"
import { orderAPI } from "../api"
import { useCart } from "../context/CartContext"

export default function RazorpayPayment() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const razorpayInstance = useRef(null)
  const paymentInitiated = useRef(false)
  const navigate = useNavigate()
  const location = useLocation()
  const orderId = location.state?.orderId
  const { clearCart } = useCart()

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    // Prevent re-opening Razorpay on back/refresh
    if (paymentInitiated.current) {
      return
    }

    if (!orderId) {
      setError("Order ID is missing")
      setLoading(false)
      return
    }

    paymentInitiated.current = true
    initiateRazorpayPayment()

    // Cleanup on unmount
    return () => {
      if (razorpayInstance.current) {
        razorpayInstance.current.close()
      }
    }
  }, [orderId])

  const initiateRazorpayPayment = async () => {
    try {
      // Step 1: Create Razorpay order
      const { response, data: responseData } = await orderAPI.createPayment(orderId)

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create payment")
      }

      const razorpayOrder = responseData.data

      // Step 2: Load Razorpay script
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true
      document.body.appendChild(script)

      script.onload = () => {
        // Step 3: Open Razorpay checkout
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_ID", // Replace with your Razorpay key
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Bloom Tale",
          description: "Order Payment",
          order_id: razorpayOrder.id,
          handler: function (response) {
            // Payment successful - Razorpay modal will close automatically
            // Verify payment in background and redirect
            verifyPayment(response)
          },
          prefill: {
            name: "",
            email: "",
            contact: "",
          },
          theme: {
            color: "#3e4026",
          },
          modal: {
            ondismiss: async function () {
              // Mark payment as failed when user cancels
              await markPaymentFailed()
              setLoading(false)
              setError("Payment cancelled")
            },
            // Handle payment failure
            confirm_close: true,
          },
        }

        razorpayInstance.current = new window.Razorpay(options)
        
        // Handle payment failure events
        razorpayInstance.current.on('payment.failed', async function (response) {
          console.log("Payment failed:", response.error)
          await markPaymentFailed()
          razorpayInstance.current.close()
          setLoading(false)
          setError(response.error.description || "Payment failed. Please try again.")
        })
        
        razorpayInstance.current.open()
        setLoading(false)
      }

      script.onerror = () => {
        setError("Failed to load payment gateway")
        setLoading(false)
      }
    } catch (err) {
      setError(err.message || "An error occurred")
      setLoading(false)
    }
  }

  const verifyPayment = async (paymentResponse) => {
    try {
      const { response, data } = await orderAPI.verifyPayment({
        orderId: orderId,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      })

      if (!response.ok) {
        // Mark payment as failed in backend
        await markPaymentFailed()
        setError(data.message || "Payment verification failed")
        setLoading(false)
        return
      }
      
      // Clear cart in frontend state
      clearCart()
      
      // Payment verified successfully - redirect with replace to prevent back navigation
      setPaymentSuccess(true)
      setTimeout(() => {
        navigate("/orders", { replace: true })
      }, 1500)
    } catch (err) {
      setError(err.message || "Payment verification failed")
      setLoading(false)
    }
  }

  const markPaymentFailed = async () => {
    try {
      await orderAPI.markPaymentFailed(orderId)
    } catch (err) {
      console.error("Failed to mark payment as failed:", err)
    }
  }

  return (
    <div className="min-h-screen bg-[#EDE8E0] flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-sm shadow-xl p-6 sm:p-8 max-w-md w-full"
        >
          {loading && !error && !paymentSuccess && (
            <div className="text-center">
              <div className="flex justify-center mb-4 sm:mb-6">
                <Loader2 size={48} className="sm:w-16 sm:h-16 animate-spin text-[#3e4026]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Initializing Payment
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Please wait while we prepare your payment...
              </p>
            </div>
          )}

          {error && !paymentSuccess && (
            <div className="text-center">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle size={36} className="sm:w-12 sm:h-12 text-red-600" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Payment Failed
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">{error}</p>
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-[#3e4026] text-white text-sm sm:text-base py-3 rounded-sm font-semibold hover:bg-[#5e6043] transition-all active:scale-95"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate("/shop")}
                  className="w-full border-2 border-[#3e4026] text-[#3e4026] text-sm sm:text-base py-3 rounded-sm font-semibold hover:bg-[#EDE8E0] transition-all active:scale-95"
                >
                  Go to Shop
                </button>
              </div>
            </div>
          )}

          {paymentSuccess && (
            <div className="text-center">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={36} className="sm:w-12 sm:h-12 text-green-600" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Payment Successful!
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">
                Your payment has been processed successfully. Redirecting to orders...
              </p>
              <div className="flex justify-center">
                <Loader2 size={20} className="sm:w-6 sm:h-6 animate-spin text-[#3e4026]" />
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

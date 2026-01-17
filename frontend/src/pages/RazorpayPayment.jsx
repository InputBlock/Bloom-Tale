import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { motion } from "framer-motion"
import Header from "../components/common/Header"
import Footer from "../components/common/Footer"

export default function RazorpayPayment() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const razorpayInstance = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const orderId = location.state?.orderId

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is missing")
      setLoading(false)
      return
    }

    initiateRazorpayPayment()
  }, [orderId])

  const initiateRazorpayPayment = async () => {
    try {
      const token = localStorage.getItem("token")
      
      // Step 1: Create Razorpay order
      const response = await fetch("/api/v1/order/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ orderId }),
      })

      const responseData = await response.json()

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
          handler: async function (response) {
            // Payment successful - show verifying state
            setLoading(true)
            await verifyPayment(response)
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
    setLoading(true)
    setError("") // Clear any previous errors
    
    try {
      const token = localStorage.getItem("token")

      const response = await fetch("/api/v1/order/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          orderId: orderId,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Mark payment as failed in backend
        await markPaymentFailed()
        if (razorpayInstance.current) {
          razorpayInstance.current.close()
        }
        throw new Error(data.message || "Payment verification failed")
      }

      // Close Razorpay modal
      if (razorpayInstance.current) {
        razorpayInstance.current.close()
      }
      
      setPaymentSuccess(true)
      // Immediate redirect without delay
      navigate("/orders")
    } catch (err) {
      setError(err.message || "Payment verification failed")
      setLoading(false)
    }
  }

  const markPaymentFailed = async () => {
    try {
      const token = localStorage.getItem("token")
      
      await fetch("/api/v1/order/markPaymentFailed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ orderId }),
      })
    } catch (err) {
      console.error("Failed to mark payment as failed:", err)
    }
  }

  return (
    <div className="min-h-screen bg-[#EDE8E0] flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
        >
          {loading && !error && !paymentSuccess && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Loader2 size={64} className="animate-spin text-[#3e4026]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Initializing Payment
              </h2>
              <p className="text-gray-600">
                Please wait while we prepare your payment...
              </p>
            </div>
          )}

          {error && !paymentSuccess && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle size={48} className="text-red-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Payment Failed
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-[#3e4026] text-white py-3 rounded-lg font-semibold hover:bg-[#5e6043] transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-full border-2 border-[#3e4026] text-[#3e4026] py-3 rounded-lg font-semibold hover:bg-[#EDE8E0] transition-colors"
                >
                  Go to Home
                </button>
              </div>
            </div>
          )}

          {paymentSuccess && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={48} className="text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Payment Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                Your payment has been processed successfully. Redirecting to orders...
              </p>
              <div className="flex justify-center">
                <Loader2 size={24} className="animate-spin text-[#3e4026]" />
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

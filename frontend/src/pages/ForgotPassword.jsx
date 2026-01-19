import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Header from "../components/common/Header"
import F_email from "../components/login/F_email"
import F_otp from "../components/login/F_otp"
import F_newPassword from "../components/login/F_newPassword"
import { showToast } from "../components/common/ToastContainer"

export default function ForgotPassword() {
  const [step, setStep] = useState("email") // "email" | "otp" | "newPassword" | "done"
  const [userEmail, setUserEmail] = useState("")
  const [otpValue, setOtpValue] = useState("")
  const navigate = useNavigate()

  const handleEmailNext = async (email) => {
    try {
      const response = await fetch("/api/v1/forgotPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      })

      // Handle non-JSON responses gracefully
      let data
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        const text = await response.text()
        data = { message: text || "Server error occurred" }
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP")
      }

      setUserEmail(email)
      setStep("otp")
      showToast("OTP sent to your email", "success")
      return { success: true }
    } catch (error) {
      showToast(error.message || "Failed to send OTP", "error")
      return { success: false }
    }
  }

  const handleOtpNext = (otp) => {
    setOtpValue(otp)
    setStep("newPassword")
    showToast("OTP verified successfully", "success")
  }

  const handlePasswordSubmit = async (password) => {
    try {
      const response = await fetch("/api/v1/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ otp: otpValue, newPassword: password }),
      })

      // Handle non-JSON responses gracefully
      let data
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        const text = await response.text()
        data = { message: text || "Server error occurred" }
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password")
      }

      showToast("Password reset successful", "success")
      setStep("done")
      setTimeout(() => {
        navigate("/login")
      }, 2000)
      return { success: true }
    } catch (error) {
      showToast(error.message || "Failed to reset password", "error")
      return { success: false }
    }
  }

  const handleResendOtp = async () => {
    try {
      const response = await fetch("/api/v1/forgotPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: userEmail }),
      })

      // Handle non-JSON responses gracefully
      let data
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        const text = await response.text()
        data = { message: text || "Server error occurred" }
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP")
      }

      showToast("OTP resent to your email", "success")
      return { success: true }
    } catch (error) {
      showToast(error.message || "Failed to resend OTP", "error")
      return { success: false }
    }
  }

  return (
    <div className="min-h-screen bg-[#EDE8E0]">
      <Header />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>›</span>
          <Link to="/login" className="hover:text-gray-900 transition-colors">Login</Link>
          <span>›</span>
          <span className="text-gray-900">Forgot Password</span>
        </nav>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-250px)] py-8 sm:py-12 px-4 sm:px-6">
        <div className="w-full max-w-md">
          {step === "email" && <F_email onNext={handleEmailNext} />}
          {step === "otp" && (
            <F_otp 
              email={userEmail} 
              onNext={handleOtpNext}
              onResend={handleResendOtp}
            />
          )}
          {step === "newPassword" && (
            <F_newPassword onSubmit={handlePasswordSubmit} />
          )}
          {step === "done" && (
            <div className="w-full max-w-md mx-auto bg-white rounded-sm shadow-lg p-6 sm:p-8 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif text-gray-800 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Password Reset Successful!
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm">
                Your password has been successfully reset. Redirecting to login...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

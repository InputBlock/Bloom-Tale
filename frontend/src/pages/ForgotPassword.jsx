import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Header from "../components/common/Header"
import F_email from "../components/login/F_email"
import F_otp from "../components/login/F_otp"
import F_newPassword from "../components/login/F_newPassword"

export default function ForgotPassword() {
  const [step, setStep] = useState("email") // "email" | "otp" | "newPassword" | "done"
  const [userEmail, setUserEmail] = useState("")
  const navigate = useNavigate()

  const handleEmailNext = (email) => {
    setUserEmail(email)
    setStep("otp")
    console.log("Sending OTP to:", email)
  }

  const handleOtpNext = (otpValue) => {
    console.log("Verifying OTP:", otpValue)
    setStep("newPassword")
  }

  const handlePasswordSubmit = (password) => {
    console.log("Setting new password:", password)
    setStep("done")
    setTimeout(() => {
      navigate("/login")
    }, 2000)
  }

  const handleResendOtp = () => {
    console.log("Resending OTP to:", userEmail)
  }

  return (
    <div className="min-h-screen bg-[#EDE8E0]">
      <Header />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span>›</span>
          <Link to="/login" className="hover:text-gray-900">Login</Link>
          <span>›</span>
          <span className="text-gray-900">Forgot Password</span>
        </nav>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-250px)] py-12 px-4">
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
            <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-serif text-gray-800 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Password Reset Successful!
              </h2>
              <p className="text-gray-600 text-sm">
                Your password has been successfully reset. Redirecting to login...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

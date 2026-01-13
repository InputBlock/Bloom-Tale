import { useState } from "react"
import Header from "../components/common/Header"
import L_email from "../components/login/L_email"
import L_otp from "../components/login/L_otp"

export default function Login() {
  const [step, setStep] = useState("email") // "email" or "otp"
  const [userEmail, setUserEmail] = useState("")

  const handleEmailNext = (email) => {
    setUserEmail(email)
    setStep("otp")
    // Here you would normally send OTP to email
    console.log("Sending OTP to:", email)
  }

  const handleOtpSubmit = (otpValue) => {
    // Here you would verify the OTP
    console.log("Verifying OTP:", otpValue, "for email:", userEmail)
    // On success, redirect to home or dashboard
  }

  const handleResendOtp = () => {
    // Here you would resend OTP
    console.log("Resending OTP to:", userEmail)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
        <div className="w-full max-w-md">
          {step === "email" ? (
            <L_email onNext={handleEmailNext} />
          ) : (
            <L_otp 
              email={userEmail} 
              onSubmit={handleOtpSubmit}
              onResend={handleResendOtp}
            />
          )}
        </div>
      </div>
    </div>
  )
}
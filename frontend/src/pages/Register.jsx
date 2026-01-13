import { useState } from "react"
import Header from "../components/common/Header"
import R_credentials from "../components/register/R_credentials"
import R_otp from "../components/register/R_otp"

export default function Register() {
  const [step, setStep] = useState("credentials") // "credentials" or "otp"
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")

  const handleCredentialsNext = (email, password) => {
    setUserEmail(email)
    setUserPassword(password)
    setStep("otp")
    // Here you would normally send OTP to email
    console.log("Sending OTP to:", email)
  }

  const handleOtpSubmit = (otpValue) => {
    // Here you would verify the OTP and create the account
    console.log("Verifying OTP:", otpValue, "for email:", userEmail)
    console.log("Password:", userPassword)
    // On success, redirect to home or dashboard
  }

  const handleResendOtp = () => {
    // Here you would resend OTP
    console.log("Resending OTP to:", userEmail)
  }

  return (
    <div className="min-h-screen bg-[#EDE8E0]">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
        <div className="w-full max-w-md">
          {step === "credentials" ? (
            <R_credentials onNext={handleCredentialsNext} />
          ) : (
            <R_otp 
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
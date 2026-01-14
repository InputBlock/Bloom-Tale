import { useState } from "react"
import Header from "../components/common/Header"
import R_credentials from "../components/register/R_credentials"
import R_otp from "../components/register/R_otp"

export default function Register() {
  const [step, setStep] = useState("credentials") // "credentials" or "otp"
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")

  const handleCredentialsNext = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      // Success - OTP sent
      setUserEmail(email)
      setUserPassword(password)
      setStep("otp")
      return { success: true, message: data.message }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, message: error.message }
    }
  }

  const handleOtpSubmit = async (otpValue) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/verifyOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies
        body: JSON.stringify({ otp: otpValue }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed")
      }

      // Success - account created
      alert("Account created successfully! Please login.")
      window.location.href = "/login"
      return { success: true, message: data.message }
    } catch (error) {
      console.error("OTP verification error:", error)
      return { success: false, message: error.message }
    }
  }

  const handleResendOtp = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: userEmail, password: userPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP")
      }

      return { success: true, message: "OTP resent successfully" }
    } catch (error) {
      console.error("Resend OTP error:", error)
      return { success: false, message: error.message }
    }
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
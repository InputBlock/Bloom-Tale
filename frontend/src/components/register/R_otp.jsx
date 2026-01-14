import { useState, useRef } from "react"

export default function R_otp({ email, onSubmit, onResend }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const inputRefs = useRef([])

  const handleChange = (index, value) => {
    if (isNaN(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpValue = otp.join("")
    if (otpValue.length === 6) {
      setLoading(true)
      setError("")
      const result = await onSubmit(otpValue)
      setLoading(false)
      
      if (!result.success) {
        setError(result.message)
      }
    }
  }

  const handleResend = async () => {
    setResending(true)
    setError("")
    setSuccessMessage("")
    const result = await onResend()
    setResending(false)
    
    if (result.success) {
      setSuccessMessage(result.message)
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
      <h1 className="text-2xl font-serif text-gray-800 mb-2 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
        Verify Your Email
      </h1>
      <p className="text-gray-600 text-sm text-center mb-8">
        We've sent a verification code to<br />
        <span className="font-medium text-gray-800">{email}</span>
      </p>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm mb-4">
            {successMessage}
          </div>
        )}
        
        <div className="flex gap-2 justify-center mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B7C59] focus:border-transparent transition"
              disabled={loading}
            />
          ))}
        </div>

        <div className="text-center mb-6">
          <span className="text-gray-500 text-sm">Didn't receive the code? </span>
          <button
            type="button"
            onClick={handleResend}
            className="text-[#6B7C59] font-semibold text-sm hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={resending || loading}
          >
            {resending ? "Sending..." : "Resend OTP"}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-[#6B7C59] hover:bg-[#5A6B4A] text-white font-medium py-3 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || otp.join("").length !== 6}
        >
          {loading ? "VERIFYING..." : "VERIFY & CREATE ACCOUNT"}
        </button>
      </form>
    </div>
  )
}

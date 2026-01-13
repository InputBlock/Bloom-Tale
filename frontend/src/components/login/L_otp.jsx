import { useState, useRef } from "react"

export default function L_otp({ email, onSubmit, onResend }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const otpValue = otp.join("")
    if (otpValue.length === 6) {
      onSubmit(otpValue)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-2xl font-serif text-gray-900 mb-2 text-center">
        Enter OTP to verify Email
      </h1>
      <p className="text-gray-600 text-sm text-center mb-8">
        We've sent a verification code to <span className="font-medium">{email}</span>
      </p>

      <form onSubmit={handleSubmit}>
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
              className="w-14 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            />
          ))}
        </div>

        <div className="text-center mb-6">
          <span className="text-gray-500 text-sm">Didn't receive OTP? </span>
          <button
            type="button"
            onClick={onResend}
            className="text-gray-900 font-semibold text-sm hover:underline"
          >
            Resend OTP
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 rounded-md transition duration-200"
        >
          SUBMIT
        </button>
      </form>
    </div>
  )
}

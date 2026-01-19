import { useState } from "react"

export default function F_email({ onNext }) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (email) {
      setLoading(true)
      await onNext(email)
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
      <h1 className="text-3xl font-serif text-gray-800 mb-2 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
        Forgot Password?
      </h1>
      <p className="text-sm text-gray-600 text-center mb-8">
        Don't worry! Enter your email and we'll send you an OTP to reset your password.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B7C59] focus:border-transparent transition"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#6B7C59] hover:bg-[#5A6B4A] text-white font-medium py-3 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Remember your password?{" "}
        <a href="/login" className="text-[#6B7C59] hover:underline font-medium">
          Back to Login
        </a>
      </p>
    </div>
  )
}


import { useState } from "react"
import { Link } from "react-router-dom"
import Header from "../components/common/Header"
import L_email from "../components/login/L_email"

export default function Login() {
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")

  const handleLogin = (email, password) => {
    setUserEmail(email)
    setUserPassword(password)
    // Here you would normally authenticate the user
    console.log("Logging in with:", email, password)
    // On success, redirect to home or dashboard
  }

  return (
    <div className="min-h-screen bg-[#EDE8E0]">
      <Header />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span>›</span>
          <span className="text-gray-900">Login</span>
        </nav>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-250px)] py-12 px-4">
        <div className="w-full max-w-md">
          <L_email onNext={handleLogin} />
        </div>
      </div>
    </div>
  )
}
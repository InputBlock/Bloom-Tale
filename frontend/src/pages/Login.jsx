import { Link, useNavigate, useLocation } from "react-router-dom"
import Header from "../components/common/Header"
import L_email from "../components/login/L_email"
import { showToast } from "../components/common/ToastContainer"

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || "/home"

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch("/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies
        body: JSON.stringify({ email, password }),
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
        throw new Error(data.message || "Login failed")
      }

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data.data.user))
      
      showToast("Welcome back, bloom lover! 🌸", "success")
      
      // Redirect to the page user came from or home page
      navigate(from)
      return { success: true, message: data.message }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: error.message || "Something went wrong" }
    }
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
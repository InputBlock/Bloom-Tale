import { useState, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { authAPI } from "../api"

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null) // null = loading
  
  useEffect(() => {
    // Verify auth by making a protected request
    const checkAuth = async () => {
      try {
        // Try to access a protected endpoint - if cookie is valid, it works
        await authAPI.checkAuth()
        setIsAuthenticated(true)
      } catch {
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [])
  
  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

"use client"

import { useState, useEffect, useRef } from "react"
import { Search, User, ShoppingCart, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../../context/CartContext"

export default function Header() {
  const navigate = useNavigate()
  const { getCartCount, isLoggedIn, clearCart } = useCart()
  const [userEmail, setUserEmail] = useState("")
  const [showLogout, setShowLogout] = useState(false)
  const logoutRef = useRef(null)

  useEffect(() => {
    if (isLoggedIn()) {
      const user = JSON.parse(localStorage.getItem("user"))
      if (user && user.email) {
        setUserEmail(user.email)
      }
    }
  }, [isLoggedIn])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (logoutRef.current && !logoutRef.current.contains(event.target)) {
        setShowLogout(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCartClick = () => {
    if (!isLoggedIn()) {
      navigate("/login", { state: { from: "/cart" } })
    } else {
      navigate("/cart")
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/v1/logout", {
        method: "POST",
        credentials: "include",
      })
      
      // Clear local storage
      localStorage.removeItem("user")
      
      // Clear cart
      clearCart()
      
      // Redirect to home
      navigate("/home")
      window.location.reload()
    } catch (error) {
      console.error("Logout error:", error)
      // Still logout locally even if API fails
      localStorage.removeItem("user")
      clearCart()
      navigate("/home")
      window.location.reload()
    }
  }

  const getFirstLetter = () => {
    return userEmail ? userEmail.charAt(0).toUpperCase() : "U"
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Top Search Bar */}
      <div className="bg-[#5d6c4e] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex-1 max-w-md mx-auto w-full">
          <div className="flex items-center bg-[#4a5840] rounded px-3 py-2">
            <input
              type="text"
              placeholder="Search for Flowers"
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-300 outline-none"
            />
            <Search size={18} className="text-gray-300" />
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button 
            onClick={() => navigate("/cart")}
            className="relative p-2 hover:bg-[#4a5840] rounded-full transition-colors duration-300"
          >
            <ShoppingCart size={20} />
            <span className="absolute top-0 right-0 bg-[#4a5840] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {getCartCount()}
            </span>
          </button>
          <button className="p-2 hover:bg-[#4a5840] rounded-full transition-colors duration-300">
            <User size={20} />
          </button>
          
          {/* Profile Button with Logout Dropdown */}
          <div className="relative" ref={logoutRef}>
            <button 
              onClick={() => setShowLogout(!showLogout)}
              className="p-2 hover:bg-[#5e6043] rounded-full transition-colors duration-300"
            >
              {isLoggedIn() ? (
                <div className="w-8 h-8 rounded-full bg-[#5e6043] flex items-center justify-center text-white font-semibold">
                  {getFirstLetter()}
                </div>
              ) : (
                <User size={20} />
              )}
            </button>
            
            {/* Logout Dropdown */}
            {isLoggedIn() && showLogout && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  {userEmail}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

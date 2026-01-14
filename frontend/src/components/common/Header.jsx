"use client"

import { useState, useEffect, useRef } from "react"
import { Search, User, ShoppingCart, Menu, X, LogOut, UserCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import { showToast } from "./ToastContainer"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [user, setUser] = useState(null)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { getCartCount } = useCart()

  // Load user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/v1/logout", {
        method: "POST",
        credentials: "include", // Important for cookies
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear local data and redirect even if API fails
      localStorage.removeItem("user")
      setUser(null)
      setIsUserDropdownOpen(false)
      showToast("See you soon, petal friend! 🌼", "info")
      navigate("/")
    }
  }

  const getUserInitial = () => {
    if (!user || !user.email) return "U"
    return user.email.charAt(0).toUpperCase()
  }

  const categories = [
    "Same Day Delivery",
    "Birthday Flowers",
    "Anniversary Flowers",
    "Grand Openings",
    "Condolences & Fragrances",
    "Potted Plants",
    "Gift Combos",
    "Services",
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Top Search Bar */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex-1 max-w-md mx-auto w-full">
          <div className="flex items-center bg-gray-800 rounded px-3 py-2">
            <input
              type="text"
              placeholder="Search for Flowers"
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-400 outline-none"
            />
            <Search size={18} className="text-gray-400" />
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button 
            onClick={() => navigate("/cart")}
            className="relative p-2 hover:bg-gray-800 rounded-full"
          >
            <ShoppingCart size={20} />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {getCartCount()}
            </span>
          </button>
          
          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {user ? (
              <>
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6B7C59] to-[#5A6B4A] flex items-center justify-center text-white font-semibold text-sm hover:shadow-lg transition-shadow"
                >
                  {getUserInitial()}
                </button>
                
                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {user.username || "User"}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false)
                        navigate("/profile")
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <UserCircle size={16} />
                      My Profile
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button 
                onClick={() => navigate("/login")}
                className="p-2 hover:bg-gray-800 rounded-full"
              >
                <User size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between md:justify-start gap-4 overflow-x-auto pb-2 md:pb-0">
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {categories.map((category, index) => (
            <button
              key={index}
              className="text-xs md:text-sm whitespace-nowrap text-gray-700 hover:text-gray-900 px-2 py-1 md:px-3"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            {categories.map((category, index) => (
              <button
                key={index}
                className="block w-full text-left text-sm text-gray-700 hover:text-gray-900 px-3 py-2"
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { Search, User, ShoppingCart, LogOut, Menu, X } from "lucide-react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { getCartCount, isLoggedIn, clearCart } = useCart()
  const [userEmail, setUserEmail] = useState("")
  const [showLogout, setShowLogout] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
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
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
      await fetch("/api/v1/logout", {
        method: "POST",
        credentials: "include",
      })
      
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      clearCart()
      navigate("/home")
      window.location.reload()
    } catch (error) {
      console.error("Logout error:", error)
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      clearCart()
      navigate("/home")
      window.location.reload()
    }
  }

  const getFirstLetter = () => {
    return userEmail ? userEmail.charAt(0).toUpperCase() : "U"
  }

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ]

  const isHomePage = location.pathname === "/" || location.pathname === "/home"
  const headerBg = scrolled || !isHomePage ? "bg-white shadow-sm" : "bg-transparent"
  const textColor = scrolled || !isHomePage ? "text-[#3e4026]" : "text-white"
  const iconColor = scrolled || !isHomePage ? "text-[#3e4026]" : "text-white"

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/home" className="flex items-center">
            <img 
              src="/BloomTaleLogopng(500x350px).png" 
              alt="Bloom Tale" 
              className="h-16 md:h-20 w-auto object-contain "
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm tracking-wide ${textColor} hover:opacity-70 transition-all duration-300 ${
                  location.pathname === link.path ? "border-b border-current pb-0.5" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button 
              className={`p-2 ${iconColor} hover:opacity-70 transition-all duration-300`}
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            {/* Cart */}
            <button 
              onClick={handleCartClick}
              className={`relative p-2 ${iconColor} hover:opacity-70 transition-all duration-300`}
              aria-label="Cart"
            >
              <ShoppingCart size={20} strokeWidth={1.5} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#3e4026] text-white text-[10px] w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>
            
            {/* Profile */}
            <div className="relative" ref={logoutRef}>
              <button 
                onClick={() => {
                  if (!isLoggedIn()) {
                    navigate("/login")
                  } else {
                    setShowLogout(!showLogout)
                  }
                }}
                className={`p-2 ${iconColor} hover:opacity-70 transition-all duration-300`}
                aria-label="Account"
              >
                {isLoggedIn() ? (
                  <div className="w-9 h-9 rounded-full bg-[#3e4026] flex items-center justify-center text-white text-sm font-medium border-2 border-white shadow-md">
                    {getFirstLetter()}
                  </div>
                ) : (
                  <User size={20} strokeWidth={1.5} />
                )}
              </button>
              
              {/* Logout Dropdown */}
              <AnimatePresence>
                {isLoggedIn() && showLogout && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden"
                  >
                    <div className="px-4 py-4 bg-[#f9f8f6] border-b border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Signed in as</p>
                      <p className="text-sm font-medium text-[#3e4026] truncate">{userEmail}</p>
                    </div>
                    <Link
                      to="/orders"
                      onClick={() => setShowLogout(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ShoppingCart size={16} className="text-gray-400" />
                      My Orders
                    </Link>
                    <div className="border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 ${iconColor} hover:opacity-70 transition-all duration-300`}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <nav className="max-w-7xl mx-auto px-6 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 text-[#3e4026] text-lg border-b border-gray-100 last:border-0"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

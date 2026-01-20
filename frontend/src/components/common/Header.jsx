"use client"

import { useState, useEffect, useRef } from "react"
import { Search, User, ShoppingCart, LogOut, Menu, X, ChevronDown } from "lucide-react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import { motion, AnimatePresence } from "framer-motion"
import SearchBar from "./SearchBar"
import { logout } from "../../utils/api"

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { getCartCount, isLoggedIn, clearCart } = useCart()
  const [userEmail, setUserEmail] = useState("")
  const [showLogout, setShowLogout] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showServicesDropdown, setShowServicesDropdown] = useState(false)
  const logoutRef = useRef(null)
  const servicesRef = useRef(null)

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
      if (servicesRef.current && !servicesRef.current.contains(event.target)) {
        setShowServicesDropdown(false)
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
      clearCart();
      await logout(); // Uses centralized logout from api.js
      // No need for manual cleanup or navigation - handled by logout()
    } catch (error) {
      // Fallback: still clear and redirect even if API fails
      clearCart();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/home");
      window.location.reload();
    }
  };

  const getFirstLetter = () => {
    return userEmail ? userEmail.charAt(0).toUpperCase() : "U"
  }

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Services", path: "/services", hasDropdown: true },
    { name: "Contact", path: "/contact" },
  ]

  const serviceCategories = [
    { name: "Wedding", path: "/services?tab=wedding" },
    { name: "Social", path: "/services?tab=social" },
    { name: "Corporate", path: "/services?tab=corporate" },
  ]

  const isHomePage = location.pathname === "/" || location.pathname === "/home"
  const headerBg = scrolled || !isHomePage ? "bg-white shadow-sm" : "bg-transparent"
  const textColor = scrolled || !isHomePage ? "text-[#3e4026]" : "text-white"
  const iconColor = scrolled || !isHomePage ? "text-[#3e4026]" : "text-white"

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8 h-20">
          {/* Logo */}
          <Link to="/home" className="flex items-center flex-shrink-0">
            <img 
              src="/BloomTaleLogopng(500x350px).png" 
              alt="Bloom Tale" 
              className="h-10 sm:h-12 md:h-16 w-auto object-contain"
            />
          </Link>

          {/* Centered Search Bar - Desktop */}
          <SearchBar scrolled={scrolled} isHomePage={isHomePage} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 flex-shrink-0">
            {navLinks.map((link) => (
              link.hasDropdown ? (
                <div 
                  key={link.path}
                  className="relative"
                  ref={servicesRef}
                  onMouseEnter={() => setShowServicesDropdown(true)}
                  onMouseLeave={() => setShowServicesDropdown(false)}
                >
                  <Link
                    to={link.path}
                    className={`flex items-center gap-1 text-sm tracking-wide ${textColor} hover:opacity-70 transition-all duration-300 ${
                      location.pathname === link.path ? "border-b border-current pb-0.5" : ""
                    }`}
                  >
                    {link.name}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${showServicesDropdown ? 'rotate-180' : ''}`} />
                  </Link>
                  
                  {/* Services Dropdown */}
                  <AnimatePresence>
                    {showServicesDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-52 bg-black/30 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 overflow-hidden"
                        style={{ backdropFilter: 'blur(20px)' }}
                      >
                        <div className="p-3">
                          <div className="mb-2">
                            <h4 className="text-[10px] font-semibold text-white/60 uppercase tracking-wider px-2">Our Services</h4>
                          </div>
                          <div className="space-y-0.5">
                            {serviceCategories.map((service, index) => (
                              <Link
                                key={index}
                                to={service.path}
                                onClick={() => setShowServicesDropdown(false)}
                                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/20 hover:shadow-md transition-all duration-300 group"
                              >
                                <span>{service.name}</span>
                                <ChevronDown size={14} className="-rotate-90 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm tracking-wide ${textColor} hover:opacity-70 transition-all duration-300 ${
                    location.pathname === link.path ? "border-b border-current pb-0.5" : ""
                  }`}
                >
                  {link.name}
                </Link>
              )
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">

            {/* Cart */}
            <button 
              onClick={handleCartClick}
              className={`relative p-2.5 md:p-2 ${iconColor} hover:opacity-70 transition-all duration-300`}
              aria-label="Cart"
            >
              <ShoppingCart size={22} className="md:w-5 md:h-5" strokeWidth={1.5} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#3e4026] text-white text-[10px] md:text-[10px] w-5 h-5 md:w-5 md:h-5 flex items-center justify-center rounded-full font-semibold">
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
                className={`p-2.5 md:p-2 ${iconColor} hover:opacity-70 transition-all duration-300`}
                aria-label="Account"
              >
                {isLoggedIn() ? (
                  <div className="w-9 h-9 md:w-9 md:h-9 rounded-full bg-[#3e4026] flex items-center justify-center text-white text-sm font-medium border-2 border-white shadow-md">
                    {getFirstLetter()}
                  </div>
                ) : (
                  <User size={22} className="md:w-5 md:h-5" strokeWidth={1.5} />
                )}
              </button>
              
              {/* Logout Dropdown */}
              <AnimatePresence>
                {isLoggedIn() && showLogout && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 bg-black/30 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 overflow-hidden"
                    style={{ backdropFilter: 'blur(20px)' }}
                  >
                    <div className="px-4 py-4 border-b border-white/10">
                      <p className="text-xs text-white/60 mb-1">Signed in as</p>
                      <p className="text-sm font-medium text-white truncate">{userEmail}</p>
                    </div>
                    <Link
                      to="/orders"
                      onClick={() => setShowLogout(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/20 transition-all duration-200"
                    >
                      <ShoppingCart size={16} className="text-white/80" />
                      My Orders
                    </Link>
                    <div className="border-t border-white/10">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/20 flex items-center gap-3 transition-all duration-200"
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
              className={`md:hidden p-2.5 ${iconColor} hover:opacity-70 transition-all duration-300`}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
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
            className="md:hidden bg-white border-t shadow-lg"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-4 px-3 text-[#3e4026] text-base font-medium border-b border-gray-100 last:border-0 active:bg-gray-50 transition-colors"
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
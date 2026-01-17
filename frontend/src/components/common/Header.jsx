"use client"

import { useState, useEffect, useRef } from "react"
import { Search, User, ShoppingCart, LogOut, Menu, X, ChevronDown } from "lucide-react"
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
  const [searchQuery, setSearchQuery] = useState("")
  const [showServicesDropdown, setShowServicesDropdown] = useState(false)
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const logoutRef = useRef(null)
  const servicesRef = useRef(null)
  const searchRef = useRef(null)

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
    // Fetch all products for search suggestions
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/v1/getProduct/list', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await response.json()
        if (data.success && data.data) {
          setAllProducts(data.data)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (logoutRef.current && !logoutRef.current.contains(event.target)) {
        setShowLogout(false)
      }
      if (servicesRef.current && !servicesRef.current.contains(event.target)) {
        setShowServicesDropdown(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchSuggestions(false)
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

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearchSuggestions(false)
      setSearchQuery("")
    }
  }

  const handleSearchInputChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim().length > 0) {
      // Generate suggestions
      const suggestions = []
      const queryLower = query.toLowerCase()

      // Product name matches
      const productMatches = allProducts
        .filter(p => p.name?.toLowerCase().includes(queryLower))
        .slice(0, 5)
        .map(p => ({
          type: 'product',
          text: p.name,
          category: p.category,
          price: p.pricing?.small || p.pricing?.medium || p.pricing?.large,
          image: p.images_uri?.[0]
        }))

      // Category suggestions
      const categories = ['Birthday', 'Anniversary', 'Wedding', 'Corporate', 'Premium']
      const categoryMatches = categories
        .filter(c => c.toLowerCase().includes(queryLower))
        .map(c => ({ type: 'category', text: c }))

      // Price-based suggestions
      const priceKeywords = ['under 500', 'under 1000', 'under 2000', 'above 2000']
      const priceMatches = priceKeywords
        .filter(p => p.includes(queryLower) || queryLower.includes('under') || queryLower.includes('below'))
        .map(p => ({ type: 'price', text: `Flowers ${p}` }))

      suggestions.push(...productMatches, ...categoryMatches.slice(0, 2), ...priceMatches.slice(0, 2))
      setSearchSuggestions(suggestions.slice(0, 8))
      setShowSearchSuggestions(true)
    } else {
      setShowSearchSuggestions(false)
      setSearchSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'product') {
      navigate(`/shop?search=${encodeURIComponent(suggestion.text)}`)
    } else if (suggestion.type === 'category') {
      navigate(`/shop?search=${encodeURIComponent(suggestion.text)}`)
    } else if (suggestion.type === 'price') {
      navigate(`/shop?search=${encodeURIComponent(suggestion.text)}`)
    }
    setShowSearchSuggestions(false)
    setSearchQuery("")
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
              className="h-14 md:h-16 w-auto object-contain"
            />
          </Link>

          {/* Centered Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4" ref={searchRef}>
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onFocus={() => searchQuery.trim() && setShowSearchSuggestions(true)}
                placeholder="Search flowers, arrangements, occasions..."
                className={`w-full px-4 py-2.5 pr-12 rounded-full border transition-colors duration-300 ${
                  scrolled || !isHomePage 
                    ? "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-200" 
                    : "bg-white/10 border-white/30 text-white placeholder-white/70 focus:border-white/30"
                } focus:outline-none focus:ring-0 focus:shadow-none focus:rounded-full`}
                style={{ boxShadow: 'none !important', outline: 'none !important', borderRadius: '9999px !important' }}
              />
              <button
                type="submit"
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${
                  scrolled || !isHomePage 
                    ? "text-gray-600 hover:bg-gray-100" 
                    : "text-white hover:bg-white/10"
                }`}
                aria-label="Search"
              >
                <Search size={18} strokeWidth={2} />
              </button>

              {/* Search Suggestions Dropdown */}
              <AnimatePresence>
                {showSearchSuggestions && searchSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden max-h-[400px] overflow-y-auto"
                    style={{ backdropFilter: 'blur(20px)' }}
                  >
                    <div className="p-3">
                      <div className="mb-2">
                        <h4 className="text-[10px] font-semibold text-white/60 uppercase tracking-wider px-2">Search Results</h4>
                      </div>
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/20 hover:shadow-md transition-all duration-200 text-left group"
                        >
                          {suggestion.type === 'product' ? (
                            <>
                              <div className="w-10 h-10 bg-white/20 rounded-lg overflow-hidden flex-shrink-0">
                                {suggestion.image ? (
                                  <img src={suggestion.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-white/60">
                                    <Search size={16} />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{suggestion.text}</p>
                                <p className="text-xs text-white/60">{suggestion.category}</p>
                              </div>
                              {suggestion.price && (
                                <span className="text-xs font-medium text-white">₹{suggestion.price}</span>
                              )}
                            </>
                          ) : suggestion.type === 'category' ? (
                            <>
                              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <ChevronDown size={16} className="text-white -rotate-90" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-white">{suggestion.text}</p>
                                <p className="text-xs text-white/60">Category</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-xs">₹</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-white">{suggestion.text}</p>
                                <p className="text-xs text-white/60">Price range</p>
                              </div>
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

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
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">

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
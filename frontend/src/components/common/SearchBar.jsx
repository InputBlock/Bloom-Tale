import { useState, useEffect, useRef } from "react"
import { Search, ChevronDown, ArrowLeft } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { productsAPI } from "../../api"

export default function SearchBar({ scrolled, isHomePage }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [isExpanded, setIsExpanded] = useState(false)
  const searchRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    // Fetch all products for search suggestions
    const fetchProducts = async () => {
      try {
        const { response, data } = await productsAPI.getList()
        if (data.success && data.data) {
          setAllProducts(data.data)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
    fetchProducts()
  }, [])

  // Force close search overlay when route changes
  useEffect(() => {
    setIsExpanded(false)
    setShowSearchSuggestions(false)
    setSearchQuery("")
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't handle click outside when mobile overlay is expanded
      // Mobile overlay has its own navigation handling
      if (isExpanded) {
        return
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isExpanded])

  const handleExpandSearch = () => {
    setIsExpanded(true)
    // Focus input after animation
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const handleCollapseSearch = () => {
    setIsExpanded(false)
    setSearchQuery("")
    setShowSearchSuggestions(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearchSuggestions(false)
      setSearchQuery("")
      setIsExpanded(false)
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
          image: p.images_uri?.[0],
          productId: p.product_id
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
    // Immediately close search UI - force synchronous state update
    setIsExpanded(false)
    setShowSearchSuggestions(false)
    setSearchQuery("")
    
    // Small delay to ensure overlay animation completes before navigation
    setTimeout(() => {
      // Navigate based on suggestion type
      if (suggestion.type === 'product' && suggestion.productId) {
        navigate(`/product/${suggestion.productId}`)
      } else if (suggestion.type === 'product') {
        navigate(`/shop?search=${encodeURIComponent(suggestion.text)}`)
      } else if (suggestion.type === 'category') {
        navigate(`/shop?search=${encodeURIComponent(suggestion.text)}`)
      } else if (suggestion.type === 'price') {
        navigate(`/shop?search=${encodeURIComponent(suggestion.text)}`)
      }
    }, 100)
  }

  return (
    <>
      {/* Mobile: Collapsed state - just the search icon */}
      {!isExpanded && (
        <button
          onClick={handleExpandSearch}
          className={`md:hidden p-2 rounded-full transition-all duration-300 ${
            scrolled || !isHomePage 
              ? "text-gray-600 hover:bg-gray-100" 
              : "text-white hover:bg-white/10"
          }`}
          aria-label="Search"
        >
          <Search size={20} strokeWidth={2} />
        </button>
      )}

      {/* Mobile: Expanded search bar overlay */}
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="md:hidden fixed inset-0 bg-white z-50"
          >
            <div className="flex items-center gap-3 p-4 border-b border-gray-200">
              <button
                onClick={handleCollapseSearch}
                className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close search"
              >
                <ArrowLeft size={20} strokeWidth={2} />
              </button>
              
              <form onSubmit={handleSearch} className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => searchQuery.trim() && setShowSearchSuggestions(true)}
                  placeholder="Search flowers..."
                  className="w-full px-4 py-2.5 pr-12 text-base rounded-full border bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-300 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-all"
                  aria-label="Search"
                >
                  <Search size={18} strokeWidth={2} />
                </button>
              </form>
            </div>

            {/* Search Suggestions for Mobile Expanded View */}
            {showSearchSuggestions && searchSuggestions.length > 0 && (
              <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 72px)' }}>
                <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                  Search Results
                </h4>
                {searchSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    role="button"
                    tabIndex={0}
                    onTouchEnd={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      // Get navigation path
                      let path = ''
                      if (suggestion.type === 'product' && suggestion.productId) {
                        path = `/product/${suggestion.productId}`
                      } else if (suggestion.type === 'product') {
                        path = `/shop?search=${encodeURIComponent(suggestion.text)}`
                      } else if (suggestion.type === 'category') {
                        path = `/shop?search=${encodeURIComponent(suggestion.text)}`
                      } else if (suggestion.type === 'price') {
                        path = `/shop?search=${encodeURIComponent(suggestion.text)}`
                      }
                      // Close overlay first
                      setIsExpanded(false)
                      setShowSearchSuggestions(false)
                      setSearchQuery("")
                      // Navigate immediately
                      if (path) {
                        navigate(path)
                      }
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      // Get navigation path
                      let path = ''
                      if (suggestion.type === 'product' && suggestion.productId) {
                        path = `/product/${suggestion.productId}`
                      } else if (suggestion.type === 'product') {
                        path = `/shop?search=${encodeURIComponent(suggestion.text)}`
                      } else if (suggestion.type === 'category') {
                        path = `/shop?search=${encodeURIComponent(suggestion.text)}`
                      } else if (suggestion.type === 'price') {
                        path = `/shop?search=${encodeURIComponent(suggestion.text)}`
                      }
                      // Close overlay first
                      setIsExpanded(false)
                      setShowSearchSuggestions(false)
                      setSearchQuery("")
                      // Navigate immediately
                      if (path) {
                        navigate(path)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleSuggestionClick(suggestion)
                      }
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 text-left border-b border-gray-100 last:border-0 cursor-pointer select-none"
                  >
                    {suggestion.type === 'product' ? (
                      <>
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 pointer-events-none">
                          {suggestion.image ? (
                            <img src={suggestion.image} alt="" className="w-full h-full object-cover pointer-events-none" draggable={false} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 pointer-events-none">
                              <Search size={16} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pointer-events-none">
                          <p className="text-sm font-medium text-gray-900 truncate">{suggestion.text}</p>
                          <p className="text-xs text-gray-500 truncate">{suggestion.category}</p>
                        </div>
                        {suggestion.price && (
                          <span className="text-sm font-semibold text-gray-900 flex-shrink-0 pointer-events-none">₹{suggestion.price}</span>
                        )}
                      </>
                    ) : suggestion.type === 'category' ? (
                      <>
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 pointer-events-none">
                          <ChevronDown size={18} className="text-gray-600 -rotate-90" />
                        </div>
                        <div className="flex-1 pointer-events-none">
                          <p className="text-sm font-medium text-gray-900">{suggestion.text}</p>
                          <p className="text-xs text-gray-500">Category</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 pointer-events-none">
                          <span className="text-gray-600 font-bold text-sm">₹</span>
                        </div>
                        <div className="flex-1 pointer-events-none">
                          <p className="text-sm font-medium text-gray-900">{suggestion.text}</p>
                          <p className="text-xs text-gray-500">Price range</p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop: Normal search bar */}
      <div className="hidden md:flex flex-1 max-w-xl mx-2 md:mx-4" ref={searchRef}>
        <form onSubmit={handleSearch} className="w-full relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            onFocus={() => searchQuery.trim() && setShowSearchSuggestions(true)}
            placeholder="Search flowers..."
            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-10 sm:pr-12 text-sm sm:text-base !rounded-full border transition-colors duration-300 focus:outline-none focus:ring-0 focus:!rounded-full active:!rounded-full ${
              scrolled || !isHomePage 
                ? "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-200" 
                : "bg-white/10 border-white/30 text-white placeholder-white/70 focus:border-white/30"
            }`}
            style={{ 
              borderRadius: '9999px !important'
            }}
          />
          <button
            type="submit"
            className={`absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full transition-all duration-300 ${
              scrolled || !isHomePage 
                ? "text-gray-600 hover:bg-gray-100" 
                : "text-white hover:bg-white/10"
            }`}
            aria-label="Search"
          >
            <Search size={18} className="sm:w-[18px] sm:h-[18px]" strokeWidth={2} />
          </button>

          {/* Search Suggestions Dropdown */}
          <AnimatePresence>
            {showSearchSuggestions && searchSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-h-[300px] md:max-h-[400px] overflow-hidden z-50"
                style={{ 
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div className="p-2 md:p-3 max-h-[300px] md:max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  <div className="mb-1 md:mb-2">
                    <h4 className="text-[9px] md:text-[10px] font-semibold text-white/60 uppercase tracking-wider px-2">Search Results</h4>
                  </div>
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleSuggestionClick(suggestion)
                    }}
                    type="button"
                    className="w-full flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-2.5 rounded-lg hover:bg-white/20 hover:shadow-md transition-all duration-200 text-left group cursor-pointer touch-manipulation"
                  >
                    {suggestion.type === 'product' ? (
                      <>
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg overflow-hidden flex-shrink-0">
                          {suggestion.image ? (
                            <img src={suggestion.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/60">
                              <Search size={14} className="md:w-4 md:h-4" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs md:text-sm font-medium text-white truncate">{suggestion.text}</p>
                          <p className="text-[10px] md:text-xs text-white/60 truncate">{suggestion.category}</p>
                        </div>
                        {suggestion.price && (
                          <span className="text-[10px] md:text-xs font-medium text-white flex-shrink-0">₹{suggestion.price}</span>
                        )}
                      </>
                    ) : suggestion.type === 'category' ? (
                      <>
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ChevronDown size={14} className="md:w-4 md:h-4 text-white -rotate-90" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs md:text-sm font-medium text-white">{suggestion.text}</p>
                          <p className="text-[10px] md:text-xs text-white/60">Category</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-[10px] md:text-xs">₹</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs md:text-sm font-medium text-white">{suggestion.text}</p>
                          <p className="text-[10px] md:text-xs text-white/60">Price range</p>
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
    </>
  )
}

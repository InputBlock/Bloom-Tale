import { useState, useEffect, useRef } from "react"
import { Search, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { productsAPI } from "../../api"

export default function SearchBar({ scrolled, isHomePage }) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const searchRef = useRef(null)

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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

  return (
    <div className="flex flex-1 max-w-xl mx-2 md:mx-4" ref={searchRef}>
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
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-2.5 rounded-lg hover:bg-white/20 hover:shadow-md transition-all duration-200 text-left group"
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
  )
}

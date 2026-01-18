import { useState, useEffect, useRef } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { useInView } from "framer-motion"
import { ChevronRight } from "lucide-react"
import Header from "../components/common/Header"
import Footer from "../components/common/Footer"
import { useCart } from "../context/CartContext"
import SuccessModal from "../components/common/SuccessModal"
import { ProductGrid, FilterSidebar } from "../components/shop"

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  
  // State
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState('featured')
  const [hoveredId, setHoveredId] = useState(null)
  const [modalState, setModalState] = useState({ isOpen: false, message: "", type: "success" })
  
  // Filter accordion states
  const [openFilters, setOpenFilters] = useState({
    category: true,
    price: false,
  })
  
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0)
    // Update searchQuery from URL params
    const search = searchParams.get('search')
    if (search) {
      setSearchQuery(search)
      setSelectedCategory('all') // Reset category when searching
    }
  }, [searchParams])

  // Categories - matching SubHeader categories
  const categories = [
    { id: 'all', name: 'All Flowers' },
    { id: 'same-day-delivery', name: 'Same Day Delivery' },
    { id: 'birthday', name: 'Birthday' },
    { id: 'anniversary', name: 'Anniversary' },
    { id: 'forever-flowers', name: 'Forever Flowers' },
    { id: 'candles', name: 'Candles' },
    { id: 'premium', name: 'Premium' },
    { id: 'corporate', name: 'Corporate' },
    { id: 'combos', name: 'Combos' },
  ]

  // Price ranges
  const priceRanges = [
    { id: 'under-500', name: 'UNDER ₹500' },
    { id: '500-1000', name: '₹500 - ₹1,000' },
    { id: '1000-2000', name: '₹1,000 - ₹2,000' },
    { id: 'above-2000', name: 'ABOVE ₹2,000' },
  ]

  // Get page title based on selected category
  const getPageTitle = () => {
    if (searchQuery) return `SEARCH RESULTS FOR "${searchQuery.toUpperCase()}"`
    if (selectedCategory === 'all') return 'LUXURY FLOWER DELIVERY'
    const category = categories.find(c => c.id === selectedCategory)
    return category ? category.name.toUpperCase() : 'LUXURY FLOWER DELIVERY'
  }

  // Helper function to get product price consistently
  const getProductPrice = (product) => {
    // Check in the same order as displayed: medium -> small -> large -> price
    return product.pricing?.medium || product.pricing?.small || product.pricing?.large || product.price || 0
  }

  // Smart search filter function
  const filterBySearch = (products, query) => {
    if (!query) return products

    const queryLower = query.toLowerCase().trim()
    let filtered = products

    // Extract price from query (e.g., "under 500", "below 1000", "under 1500")
    const priceMatch = queryLower.match(/(under|below|less than|above|over|more than)\s*[₹rs.]?\s*(\d+)/)
    const priceOperator = priceMatch ? priceMatch[1] : null
    const priceValue = priceMatch ? parseInt(priceMatch[2]) : null

    // Filter products
    filtered = products.filter(product => {
      // Get product price using the consistent helper function
      const productPrice = getProductPrice(product)
      
      // Name match
      const nameMatch = product.name?.toLowerCase().includes(queryLower)
      
      // Description match
      const descMatch = product.description?.toLowerCase().includes(queryLower)
      
      // Category match
      const categoryMatch = product.category?.toLowerCase().includes(queryLower)
      
      // Price filter if specified
      if (priceValue !== null) {
        // Generic terms that should be ignored when combined with price
        const genericTerms = /^(flower|flowers|bouquet|bouquets|arrangement|arrangements|gift|gifts|product|products)?\s*(under|below|less than|above|over|more than)\s*[₹rs.]?\s*\d+$/i
        
        // Check if it's purely price-based (with or without generic terms)
        const isPurelyPriceQuery = genericTerms.test(queryLower)
        
        if (isPurelyPriceQuery) {
          // Only apply price filter
          if (priceOperator === 'under' || priceOperator === 'below' || priceOperator === 'less than') {
            return productPrice < priceValue
          } else if (priceOperator === 'above' || priceOperator === 'over' || priceOperator === 'more than') {
            return productPrice > priceValue
          }
        } else {
          // Remove the price part from query to get the actual search text
          const textQuery = queryLower.replace(/(under|below|less than|above|over|more than)\s*[₹rs.]?\s*\d+/, '').trim()
          
          // Check if remaining text matches product details
          const textMatch = textQuery ? (
            product.name?.toLowerCase().includes(textQuery) ||
            product.description?.toLowerCase().includes(textQuery) ||
            product.category?.toLowerCase().includes(textQuery)
          ) : true
          
          // Apply both text and price filters
          if (priceOperator === 'under' || priceOperator === 'below' || priceOperator === 'less than') {
            return textMatch && productPrice < priceValue
          } else if (priceOperator === 'above' || priceOperator === 'over' || priceOperator === 'more than') {
            return textMatch && productPrice > priceValue
          }
        }
      }
      
      return nameMatch || descMatch || categoryMatch
    })

    return filtered
  }

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        
        // Build query params
        const params = new URLSearchParams()
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory)
        }
        
        const response = await fetch(`/api/v1/getProduct/list?${params.toString()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
        
        const data = await response.json()
        
        if (data.success && data.data) {
          let sortedProducts = [...data.data]
          
          // Apply search filter first if search query exists
          if (searchQuery) {
            sortedProducts = filterBySearch(sortedProducts, searchQuery)
          } else {
            // Filter by category if no search query
            if (selectedCategory !== 'all') {
              if (selectedCategory === 'same-day-delivery') {
                // Filter by same_day_delivery flag
                sortedProducts = sortedProducts.filter(p => p.same_day_delivery === true)
              } else {
                // Filter by category name (convert id to match backend format)
                const categoryName = selectedCategory.replace(/-/g, ' ')
                sortedProducts = sortedProducts.filter(p => 
                  p.category?.toLowerCase() === categoryName.toLowerCase()
                )
              }
            }
          }
          
          // Client-side sorting
          if (sortBy === 'price-low') {
            sortedProducts.sort((a, b) => {
              const priceA = getProductPrice(a)
              const priceB = getProductPrice(b)
              return priceA - priceB
            })
          } else if (sortBy === 'price-high') {
            sortedProducts.sort((a, b) => {
              const priceA = getProductPrice(a)
              const priceB = getProductPrice(b)
              return priceB - priceA
            })
          } else if (sortBy === 'newest') {
            sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          } else if (sortBy === 'bestselling') {
            sortedProducts.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0))
          }
          
          setProducts(sortedProducts)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, sortBy, searchQuery])

  // Update URL when category changes
  useEffect(() => {
    if (selectedCategory !== 'all') {
      setSearchParams({ category: selectedCategory })
    } else {
      setSearchParams({})
    }
  }, [selectedCategory, setSearchParams])

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`)
  }

  const handleAddToCart = async (e, product) => {
    e.stopPropagation()
    
    const result = await addToCart({
      product_id: product.product_id,
      quantity: 1,
    })

    if (result?.success) {
      setModalState({ isOpen: true, message: "Added to cart!", type: "success" })
      setTimeout(() => setModalState({ isOpen: false, message: "", type: "success" }), 4000)
    } else {
      setModalState({ isOpen: true, message: result?.message || "Failed to add", type: "error" })
      setTimeout(() => setModalState({ isOpen: false, message: "", type: "success" }), 4000)
    }
  }

  const toggleFilter = (name) => {
    setOpenFilters(prev => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Header />
      
      <main className="pt-24">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-6">
          <nav className="flex items-center gap-2 text-[11px] tracking-[0.12em] text-[#9a9a9a]">
            <Link to="/home" className="hover:text-[#3e4026] transition-colors">HOME</Link>
            <ChevronRight size={10} className="text-[#c4c4c4]" />
            <span className="text-[#3e4026]">{searchQuery ? 'SEARCH' : 'CATEGORIES'}</span>
          </nav>
          
          {/* Search Results Info */}
          {searchQuery && (
            <div className="mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-[#3e4026]">{products.length}</span> results for 
                <span className="font-semibold text-[#3e4026]"> "{searchQuery}"</span>
              </p>
              {products.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Try searching with different keywords or <button onClick={() => { setSearchQuery(''); navigate('/shop'); }} className="text-[#3e4026] underline">browse all products</button>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Page Title */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 mt-6">
          <h1 
            className="text-2xl md:text-[28px] text-[#3e4026] tracking-[0.08em] mb-4"
            style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400 }}
          >
            {getPageTitle()}
          </h1>
          <p className="text-[#7a7a7a] text-[14px] leading-relaxed max-w-xl">
            Send extraordinary <span className="text-[#3e4026] underline underline-offset-2 cursor-pointer hover:no-underline">flowers</span> and{' '}
            <span className="text-[#3e4026] underline underline-offset-2 cursor-pointer hover:no-underline">luxury bouquets</span>, whatever the moment.
          </p>
          <button className="text-[11px] tracking-[0.12em] text-[#3e4026] underline underline-offset-4 mt-3 hover:no-underline transition-all">
            READ MORE
          </button>
        </div>

        {/* Main Content with Sidebar */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
          <div className="flex gap-16">
            
            {/* Left Sidebar - Filters (Sticky) */}
            <div className="hidden lg:block w-52 flex-shrink-0">
              <div className="sticky top-24">
                <FilterSidebar
                  categories={categories}
                  priceRanges={priceRanges}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  openFilters={openFilters}
                  onToggleFilter={toggleFilter}
                />
              </div>
            </div>

            {/* Right - Products */}
            <div className="flex-1" ref={sectionRef}>
              {/* Products Count */}
              <div className="mb-10">
                <p className="text-[13px] tracking-[0.2em] text-[#3e4026] font-medium">
                  {products.length} PRODUCTS
                </p>
              </div>
              
              <ProductGrid
                products={products}
                loading={loading}
                isInView={isInView}
                hoveredId={hoveredId}
                onHover={setHoveredId}
                onLeave={() => setHoveredId(null)}
                onProductClick={handleProductClick}
                onAddToCart={handleAddToCart}
                onViewAll={() => setSelectedCategory('all')}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Success Modal */}
      <SuccessModal
        isOpen={modalState.isOpen}
        message={modalState.message}
        type={modalState.type}
        onClose={() => setModalState({ isOpen: false, message: "", type: "success" })}
      />
    </div>
  )
}

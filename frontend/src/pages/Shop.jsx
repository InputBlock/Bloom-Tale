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
  }, [])

  // Categories - matching SubHeader categories
  const categories = [
    { id: 'all', name: 'All Flowers' },
    { id: 'same-day-delivery', name: 'Same Day Delivery' },
    { id: 'birthday', name: 'Birthday' },
    { id: 'anniversary', name: 'Anniversary' },
    { id: 'forever-flowers', name: 'Forever Flowers' },
    { id: 'fragrances', name: 'Fragrances' },
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
    if (selectedCategory === 'all') return 'LUXURY FLOWER DELIVERY'
    const category = categories.find(c => c.id === selectedCategory)
    return category ? category.name.toUpperCase() : 'LUXURY FLOWER DELIVERY'
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
          
          // Filter by category if needed
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
          
          // Client-side sorting
          if (sortBy === 'price-low') {
            sortedProducts.sort((a, b) => {
              const priceA = a.pricing?.small || a.pricing?.medium || a.pricing?.large || 0
              const priceB = b.pricing?.small || b.pricing?.medium || b.pricing?.large || 0
              return priceA - priceB
            })
          } else if (sortBy === 'price-high') {
            sortedProducts.sort((a, b) => {
              const priceA = a.pricing?.small || a.pricing?.medium || a.pricing?.large || 0
              const priceB = b.pricing?.small || b.pricing?.medium || b.pricing?.large || 0
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
  }, [selectedCategory, sortBy])

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
            <span className="text-[#3e4026]">CATEGORIES</span>
          </nav>
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

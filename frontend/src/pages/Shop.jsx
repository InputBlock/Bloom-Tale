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
    colour: false,
    price: false,
  })
  
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  // Categories
  const categories = [
    { id: 'all', name: 'All Flowers' },
    { id: 'roses', name: 'Roses' },
    { id: 'bouquets', name: 'Bouquets' },
    { id: 'forever-flowers', name: 'Forever Flowers' },
    { id: 'seasonal', name: 'Seasonal' },
    { id: 'birthday', name: 'Birthday' },
    { id: 'anniversary', name: 'Anniversary' },
    { id: 'sympathy', name: 'Sympathy' },
  ]

  // Colours for filter
  const colours = [
    { id: 'red', name: 'RED', hex: '#c41e3a' },
    { id: 'pink', name: 'PINK', hex: '#ffb6c1' },
    { id: 'white', name: 'WHITE', hex: '#ffffff' },
    { id: 'yellow', name: 'YELLOW', hex: '#ffd700' },
    { id: 'purple', name: 'PURPLE', hex: '#9b59b6' },
  ]

  // Price ranges
  const priceRanges = [
    { id: 'under-500', name: 'UNDER ₹500' },
    { id: '500-1000', name: '₹500 - ₹1,000' },
    { id: '1000-2000', name: '₹1,000 - ₹2,000' },
    { id: 'above-2000', name: 'ABOVE ₹2,000' },
  ]

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
            sortedProducts = sortedProducts.filter(p => 
              p.category?.toLowerCase() === selectedCategory.toLowerCase()
            )
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
      setTimeout(() => setModalState({ isOpen: false, message: "", type: "success" }), 2000)
    } else {
      setModalState({ isOpen: true, message: result?.message || "Failed to add", type: "error" })
      setTimeout(() => setModalState({ isOpen: false, message: "", type: "success" }), 2000)
    }
  }

  const toggleFilter = (name) => {
    setOpenFilters(prev => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Header />
      
      <main className="pt-8">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8">
          <nav className="flex items-center gap-2 text-[11px] tracking-[0.12em] text-[#9a9a9a]">
            <Link to="/" className="hover:text-[#3e4026] transition-colors">HOME</Link>
            <ChevronRight size={10} className="text-[#c4c4c4]" />
            <span className="text-[#3e4026]">FRESH FLOWERS</span>
          </nav>
        </div>

        {/* Page Title */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
          <h1 
            className="text-2xl md:text-[28px] text-[#3e4026] tracking-[0.08em] mb-4"
            style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400 }}
          >
            LUXURY FLOWER DELIVERY
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
            
            {/* Left Sidebar - Filters */}
            <FilterSidebar
              categories={categories}
              colours={colours}
              priceRanges={priceRanges}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              openFilters={openFilters}
              onToggleFilter={toggleFilter}
            />

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

import { useState, useEffect, useRef } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { motion, useInView } from "framer-motion"
import { 
  ChevronDown, 
  ChevronUp,
  ChevronRight,
  Heart,
} from "lucide-react"
import Header from "../components/common/Header"
import Footer from "../components/common/Footer"
import { useCart } from "../context/CartContext"
import SuccessModal from "../components/common/SuccessModal"

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

  // Filter Section Component
  const FilterSection = ({ title, name, children }) => (
    <div className="border-b border-[#e8e6e3]">
      <button
        onClick={() => toggleFilter(name)}
        className="w-full flex items-center justify-between py-4 group"
      >
        <span className="text-[12px] tracking-[0.15em] text-[#5c5c5c] group-hover:text-[#3e4026] transition-colors">{title}</span>
        {openFilters[name] ? <ChevronUp size={14} className="text-[#8b8b8b]" /> : <ChevronDown size={14} className="text-[#8b8b8b]" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${openFilters[name] ? 'max-h-96 pb-5' : 'max-h-0'}`}>
        {children}
      </div>
    </div>
  )

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
            <aside className="hidden lg:block w-52 flex-shrink-0">
              <h2 className="text-[15px] tracking-[0.15em] text-[#3e4026] mb-8 font-medium">FILTER</h2>
              
              {/* Category Filter */}
              <FilterSection title="CATEGORY" name="category">
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`block text-[12px] tracking-[0.1em] transition-colors ${
                        selectedCategory === cat.id 
                          ? 'text-[#3e4026] font-medium' 
                          : 'text-[#3e4026]/50 hover:text-[#3e4026]'
                      }`}
                    >
                      {cat.name.toUpperCase()}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Colour Filter */}
              <FilterSection title="COLOUR" name="colour">
                <div className="space-y-2">
                  {colours.map((c) => (
                    <button
                      key={c.id}
                      className="flex items-center gap-2 text-[11px] tracking-wider text-[#3e4026]/50 hover:text-[#3e4026] transition-colors"
                    >
                      <span 
                        className="w-4 h-4 rounded-full border border-[#ddd] shadow-sm"
                        style={{ backgroundColor: c.hex }}
                      />
                      {c.name}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Price Filter */}
              <FilterSection title="PRICE" name="price">
                <div className="space-y-3">
                  {priceRanges.map((r) => (
                    <button
                      key={r.id}
                      className="block text-[12px] tracking-[0.1em] text-[#8b8b8b] hover:text-[#3e4026] transition-colors"
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              </FilterSection>
            </aside>

            {/* Right - Products */}
            <div className="flex-1" ref={sectionRef}>
              {/* Products Count */}
              <div className="mb-10">
                <p className="text-[13px] tracking-[0.2em] text-[#3e4026] font-medium">
                  {products.length} PRODUCTS
                </p>
              </div>
              {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-[#f9f8f6] mb-4"></div>
                    <div className="h-5 bg-[#eceae7] w-3/4 mb-2"></div>
                    <div className="h-5 bg-[#eceae7] w-1/3 mb-2"></div>
                    <div className="h-3 bg-[#eceae7] w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[#3e4026]/40 mb-4 text-sm">No products found</p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-[#3e4026] text-sm underline underline-offset-4 hover:no-underline"
                >
                  View all flowers
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredId(product._id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => handleProductClick(product.product_id)}
                    className="group cursor-pointer"
                  >
                    {/* Product Image */}
                    <div className="relative overflow-hidden mb-4 aspect-[3/4] bg-[#f9f8f6]">
                      {product.images_uri?.[0] ? (
                        <motion.img
                          src={product.images_uri[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          animate={{
                            scale: hoveredId === product._id ? 1.05 : 1,
                          }}
                          transition={{ duration: 0.6 }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-gray-300">No Image</div>
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                      {/* Quick Add Button */}
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                          opacity: hoveredId === product._id ? 1 : 0,
                          y: hoveredId === product._id ? 0 : 10,
                        }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => handleAddToCart(e, product)}
                        className="absolute bottom-4 left-4 right-4 bg-white py-3 text-sm font-medium text-[#3e4026] hover:bg-[#3e4026] hover:text-white transition-colors duration-300"
                      >
                        Add to Cart
                      </motion.button>

                      {/* Arrow Icon */}
                      <div className="absolute top-4 right-4 w-10 h-10 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Heart size={18} className="text-[#3e4026]" />
                      </div>

                      {/* Category Badge */}
                      {product.category && (
                        <div className="absolute top-4 left-4">
                          <span className="text-[10px] tracking-widest uppercase bg-white px-3 py-1.5 text-[#3e4026]">
                            {product.category}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div>
                      <h3 
                        className="text-lg text-[#3e4026] mb-1 group-hover:underline"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                      >
                        {product.name}
                      </h3>
                      <p className="text-lg font-light text-[#3e4026]">
                        ₹{(product.pricing?.small || product.pricing?.medium || product.pricing?.large || product.price || 0).toLocaleString()}
                      </p>
                      
                      {/* Stock Status */}
                      {product.stock && product.stock > 0 ? (
                        <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-600"></span>
                          In Stock
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 mt-2">Out of Stock</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
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

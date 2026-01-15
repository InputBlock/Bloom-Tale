"use client"

import { Heart, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useCart } from "../../context/CartContext"

export default function BestsellingBlooms() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredId, setHoveredId] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const navigate = useNavigate()
  const { addToCart } = useCart()

  // Fetch bestseller products from backend
  useEffect(() => {
    const fetchBestsellerProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/v1/getProduct/bestseller', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        const data = await response.json()
        
        if (data.success && data.data) {
          setProducts(data.data)
        }
      } catch (error) {
        console.error('Error fetching bestseller products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBestsellerProducts()
  }, [])

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`)
  }

  const handleAddToCart = async (e, product) => {
    e.stopPropagation()
    
    const result = await addToCart({
      product_id: product.product_id,
      quantity: 1,
    })

    if (result && result.success) {
      alert("Product added to cart!")
    } else if (result && !result.success) {
      // User will be redirected to login if not logged in
      alert(result.message || "Failed to add to cart")
    }
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <section ref={sectionRef} className="py-12 md:py-20 bg-[#EDE8E0]/30 px-4 md:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#5e6043]/5 blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#3e4026]/5 blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:text-left"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[12px] uppercase tracking-[0.25em] text-[#5e6043] mb-2 font-medium"
          >
            Most Loved
          </motion.p>
          <h2 
            className="text-3xl md:text-4xl text-[#3e4026] mb-2"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Bestselling Blooms
          </h2>
          <p className="text-gray-600 text-sm md:text-base">Floral arrangements that get the most love</p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3e4026]"></div>
          </div>
        )}

        {/* Products Grid with Controls */}
        {!loading && products.length > 0 && (
          <div className="relative">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredId(product._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => handleProductClick(product.product_id)}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="relative h-64 md:h-72 bg-gray-200 overflow-hidden group">
                    {product.images_uri && product.images_uri.length > 0 ? (
                      <motion.img
                        src={product.images_uri[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        animate={{
                          scale: hoveredId === product._id ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.4 }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EDE8E0] to-[#5e6043]/10">
                        <span className="text-8xl">🌸</span>
                      </div>
                    )}
                    {/* Gradient Overlay on Hover */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredId === product._id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-gradient-to-t from-[#3e4026]/40 to-transparent"
                    />
                    
                    {/* Wishlist Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        // Add to wishlist logic here
                      }}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <Heart 
                        size={18} 
                        className={`transition-colors duration-300 ${
                          hoveredId === product._id ? "text-red-500 fill-red-500" : "text-gray-600"
                        }`} 
                      />
                    </motion.button>

                    {/* Quick View Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: hoveredId === product._id ? 1 : 0,
                        y: hoveredId === product._id ? 0 : 10,
                      }}
                      transition={{ duration: 0.3 }}
                      className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-[#3e4026]"
                    >
                      Quick View
                    </motion.div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-base mb-2">{product.name}</h3>

                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className="text-xs bg-[#EDE8E0] text-[#3e4026] px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                    </div>

                    {/* Price */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="text-xl font-bold text-[#3e4026] mb-2"
                    >
                      ₹ {product.price}
                    </motion.p>

                    {/* Stock Status */}
                    {product.stock && product.stock > 0 ? (
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="text-xs text-[#5e6043] font-semibold mb-4 flex items-center gap-1"
                      >
                        <span className="w-2 h-2 bg-[#5e6043] rounded-full animate-pulse"></span>
                        In Stock
                      </motion.p>
                    ) : (
                      <p className="text-xs text-gray-400 font-semibold mb-4">Out of Stock</p>
                    )}

                    {/* Add to Cart Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-full bg-[#3e4026] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#5e6043] transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Navigation Arrows */}
            <motion.button
              onClick={handlePrev}
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              className="hidden lg:flex absolute left-0 top-1/3 -translate-x-6 bg-white border-2 border-[#5e6043]/20 rounded-full p-3 hover:bg-[#EDE8E0] transition-all duration-300 shadow-lg"
            >
              <ChevronLeft size={20} className="text-[#3e4026]" />
            </motion.button>
            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              className="hidden lg:flex absolute right-0 top-1/3 translate-x-6 bg-white border-2 border-[#5e6043]/20 rounded-full p-3 hover:bg-[#EDE8E0] transition-all duration-300 shadow-lg"
            >
              <ChevronRight size={20} className="text-[#3e4026]" />
            </motion.button>
          </div>
        )}

        {/* No Products Message */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No bestseller products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}

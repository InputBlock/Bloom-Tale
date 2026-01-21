"use client"

import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { useNavigate } from "react-router-dom"
import SuccessModal from "../common/SuccessModal"
import { productsAPI } from "../../api"

export default function BestsellingBlooms() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredId, setHoveredId] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalState, setModalState] = useState({ isOpen: false, message: "", type: "success" })
  const sectionRef = useRef(null)
  const touchStartRef = useRef({ x: 0, y: 0 })
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const navigate = useNavigate()

  // Fetch bestseller products from backend
  useEffect(() => {
    const fetchBestsellerProducts = async () => {
      try {
        setLoading(true)
        const { response, data } = await productsAPI.getBestsellers()
        
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

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 sm:mb-10 md:mb-12">
          <div>
            <p className="text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#3e4026]/60 mb-3 sm:mb-4">
              Most Loved
            </p>
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl text-[#3e4026]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Bestselling
              <br />
              <span className="italic">Blooms</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mt-5 sm:mt-6 md:mt-0">
            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 border border-gray-200 rounded-sm flex items-center justify-center hover:bg-[#3e4026] hover:text-white hover:border-[#3e4026] active:scale-95 transition-all duration-300"
              aria-label="Previous products"
            >
              <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 border border-gray-200 rounded-sm flex items-center justify-center hover:bg-[#3e4026] hover:text-white hover:border-[#3e4026] active:scale-95 transition-all duration-300"
              aria-label="Next products"
            >
              <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-[#3e4026] border-t-transparent animate-spin"></div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredId(product._id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleProductClick(product.product_id)}
                onTouchStart={(e) => {
                  const touch = e.touches[0]
                  touchStartRef.current = { x: touch.clientX, y: touch.clientY }
                }}
                onTouchEnd={(e) => {
                  const touch = e.changedTouches[0]
                  const deltaX = Math.abs(touch.clientX - touchStartRef.current.x)
                  const deltaY = Math.abs(touch.clientY - touchStartRef.current.y)
                  // If moved more than 10px, it's a scroll - don't navigate
                  if (deltaX > 10 || deltaY > 10) {
                    return
                  }
                  e.preventDefault()
                  handleProductClick(product.product_id)
                }}
                className="group cursor-pointer touch-manipulation select-none"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {/* Product Image */}
                <div className="relative overflow-hidden mb-3 sm:mb-4 aspect-[3/4] bg-[#f9f8f6] rounded-sm">
                  {product.images_uri && product.images_uri.length > 0 ? (
                    <motion.img
                      src={product.images_uri[0]}
                      alt={product.name}
                      className="w-full h-full object-cover object-center"
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
                  
                  {/* Buy Now Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: hoveredId === product._id ? 1 : 0,
                      y: hoveredId === product._id ? 0 : 10,
                    }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleProductClick(product.product_id)
                    }}
                    className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 bg-white py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-[#3e4026] hover:bg-[#3e4026] hover:text-white active:scale-95 transition-all duration-300 rounded-sm"
                  >
                    Buy Now
                  </motion.button>

                  {/* Category Badge */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4">
                    <span className="text-[9px] sm:text-[10px] tracking-widest uppercase bg-white rounded-sm px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 text-[#3e4026]">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div>
                  <h3 
                    className="text-sm sm:text-base md:text-lg text-[#3e4026] mb-1 group-hover:underline line-clamp-2"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {product.name}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg font-light text-[#3e4026]">₹{product.pricing?.medium || product.price || 0}</p>
                  
                  {/* Stock Status */}
                  {product.stock && product.stock > 0 ? (
                    <p className="text-[10px] sm:text-xs text-green-600 mt-1.5 sm:mt-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                      In Stock
                    </p>
                  ) : (
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2">Out of Stock</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Button */}
        {!loading && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-8 sm:mt-10 md:mt-12"
          >
            <button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#3e4026] font-medium border-b border-[#3e4026] pb-1 hover:gap-3 active:scale-95 transition-all duration-300"
            >
              View All Products
              <ArrowUpRight size={14} className="sm:w-4 sm:h-4" />
            </button>
          </motion.div>
        )}

        {/* No Products Message */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">No bestseller products available at the moment.</p>
          </div>
        )}
      </div>

      {/* Success Modal */}
      <SuccessModal 
        isOpen={modalState.isOpen}
        message={modalState.message}
        type={modalState.type}
        onClose={() => setModalState({ isOpen: false, message: "", type: "success" })}
      />
    </section>
  )
}

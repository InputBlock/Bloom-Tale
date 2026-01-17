"use client"

import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import SuccessModal from "../common/SuccessModal"

export default function BestsellingBlooms() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredId, setHoveredId] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalState, setModalState] = useState({ isOpen: false, message: "", type: "success" })
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
      setModalState({ isOpen: true, message: "Product added to cart successfully!", type: "success" })
      setTimeout(() => setModalState({ isOpen: false, message: "", type: "success" }), 4000)
    } else if (result && !result.success) {
      setModalState({ isOpen: true, message: result.message || "Failed to add to cart", type: "error" })
      setTimeout(() => setModalState({ isOpen: false, message: "", type: "success" }), 4000)
    }
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#3e4026]/60 mb-4">
              Most Loved
            </p>
            <h2 
              className="text-4xl md:text-5xl text-[#3e4026]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Bestselling
              <br />
              <span className="italic">Blooms</span>
            </h2>
          </div>
          <div className="flex items-center gap-4 mt-6 md:mt-0">
            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="w-12 h-12 border border-gray-200 flex items-center justify-center hover:bg-[#3e4026] hover:text-white hover:border-[#3e4026] transition-all duration-300"
              aria-label="Previous products"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 border border-gray-200 flex items-center justify-center hover:bg-[#3e4026] hover:text-white hover:border-[#3e4026] transition-all duration-300"
              aria-label="Next products"
            >
              <ArrowRight size={18} />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  {product.images_uri && product.images_uri.length > 0 ? (
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
                    <ArrowUpRight size={18} className="text-[#3e4026]" />
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] tracking-widest uppercase bg-white px-3 py-1.5 text-[#3e4026]">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div>
                  <h3 
                    className="text-lg text-[#3e4026] mb-1 group-hover:underline"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {product.name}
                  </h3>
                  <p className="text-lg font-light text-[#3e4026]">₹{product.pricing?.medium || product.price || 0}</p>
                  
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

        {/* View All Button */}
        {!loading && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12"
          >
            <button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center gap-2 text-[#3e4026] font-medium border-b border-[#3e4026] pb-1 hover:gap-3 transition-all duration-300"
            >
              View All Products
              <ArrowUpRight size={16} />
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

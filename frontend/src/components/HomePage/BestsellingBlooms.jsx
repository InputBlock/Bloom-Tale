"use client"

import { Heart, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"

export default function BestsellingBlooms() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredId, setHoveredId] = useState(null)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const products = [
    {
      id: 1,
      name: "Blooming Elegance",
      price: "₹ 2245",
      rating: 4.8,
      reviews: 320,
      sameDayDelivery: true,
      image: "/white-flowers-arrangement.jpg",
    },
    {
      id: 2,
      name: "Happy Birthday",
      price: "₹ 2795",
      rating: 4.9,
      reviews: 250,
      sameDayDelivery: true,
      image: "/purple-flowers-birthday.jpg",
    },
    {
      id: 3,
      name: "Love Romance",
      price: "₹ 1195",
      rating: 4.7,
      reviews: 410,
      sameDayDelivery: true,
      image: "/red-roses-bouquet.png",
    },
    {
      id: 4,
      name: "Bright Wishes",
      price: "₹ 4095",
      rating: 5.0,
      reviews: 180,
      sameDayDelivery: true,
      image: "/colorful-flowers-arrangement.jpg",
    },
  ]

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

        {/* Products Grid with Controls */}
        <div className="relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative h-64 md:h-72 bg-gray-200 overflow-hidden group">
                  <motion.img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    animate={{
                      scale: hoveredId === product.id ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.4 }}
                  />
                  {/* Gradient Overlay on Hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredId === product.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-t from-[#3e4026]/40 to-transparent"
                  />
                  
                  {/* Wishlist Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Heart 
                      size={18} 
                      className={`transition-colors duration-300 ${
                        hoveredId === product.id ? "text-red-500 fill-red-500" : "text-gray-600"
                      }`} 
                    />
                  </motion.button>

                  {/* Quick View Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: hoveredId === product.id ? 1 : 0,
                      y: hoveredId === product.id ? 0 : 10,
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

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={
                            isInView
                              ? { opacity: 1, scale: 1 }
                              : { opacity: 0, scale: 0 }
                          }
                          transition={{ delay: 0.5 + index * 0.1 + i * 0.05 }}
                        >
                          <Star size={14} fill="currentColor" />
                        </motion.div>
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="text-xl font-bold text-[#3e4026] mb-2"
                  >
                    {product.price}
                  </motion.p>

                  {/* Same Day Delivery */}
                  {product.sameDayDelivery && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="text-xs text-[#5e6043] font-semibold mb-4 flex items-center gap-1"
                    >
                      <span className="w-2 h-2 bg-[#5e6043] rounded-full animate-pulse"></span>
                      Same Day Delivery
                    </motion.p>
                  )}

                  {/* Add to Cart Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
      </div>
    </section>
  )
}

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Heart, Check } from "lucide-react"

export default function CategoryShowcase() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const navigate = useNavigate()

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-[#f9f8f6]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side - Image/Video */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              {/* Save your Valentine flowers image as: /valentine-flowers-frame.jpg in the public folder */}
              <img
                src="/Valentine.png"
                alt="Valentine's Day Flowers"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Main Heading */}
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl text-[#3e4026] leading-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Surprise Your <span className="text-red-600 italic">Valentine!</span>
            </h2>

            {/* Subheading */}
            <p className="text-2xl md:text-3xl text-[#3e4026] font-light">
              Let us arrange a smile.
            </p>

            {/* Description Paragraph */}
            <p className="text-gray-500 text-base leading-relaxed">
             At Bloom Tale, every bouquet tells a story, handcrafted with passion and care, using freshest blooms to create heartfelt arrangements that bring joy, beauty, and unforgettable moments to every occasion.
            </p>


            {/* CTA Button */}
            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/shop?occasion=valentine')}
                className="bg-red-600 text-white px-8 py-4 text-lg font-semibold hover:bg-red-700 transition-colors duration-300 flex items-center gap-2 shadow-lg"
              >
                <Heart size={20} className="fill-white" />
                Shop Valentine's Collection
              </motion.button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

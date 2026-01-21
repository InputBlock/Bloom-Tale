import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Leaf, Heart, Award } from "lucide-react"

export default function AboutSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "500+", label: "Unique Arrangements" },
    { number: "15+", label: "Years Experience" },
  ]

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          {/* Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3 sm:space-y-4">
                <img
                  src="/1.png"
                  alt="Colorful flower arrangement"
                  className="w-full h-48 sm:h-56 md:h-64 object-cover object-center rounded-sm"
                />
                <img
                  src="/5.png"
                  alt="Purple flowers"
                  className="w-full h-36 sm:h-40 md:h-48 object-cover object-center rounded-sm"
                />
              </div>
              <div className="pt-6 sm:pt-8">
                <img
                  src="/4.png"
                  alt="Red roses bouquet"
                  className="w-full h-60 sm:h-72 md:h-80 object-cover object-center rounded-sm"
                />
              </div>
            </div>
            
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-[#3e4026] text-white p-4 sm:p-5 md:p-6 shadow-xl rounded-sm"
            >
              <p className="text-2xl sm:text-3xl font-light mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>7+</p>
              <p className="text-[10px] sm:text-xs tracking-wider uppercase">Years of Excellence</p>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-5 sm:space-y-6 md:space-y-8"
          >
            <div>
              <p className="text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#3e4026]/60 mb-3 sm:mb-4">
                About Us
              </p>
              <h2 
                className="text-3xl sm:text-4xl md:text-5xl text-[#3e4026] mb-4 sm:mb-5 md:mb-6 leading-tight"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                We Create Beautiful
                <br />
                <span className="italic">Floral Experiences</span>
              </h2>
            </div>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base md:text-lg">
              At Bloom Tale, every bouquet tells a story. We believe in the power of flowers 
              to express emotions, celebrate moments, and bring joy to everyday life. Our 
              artisans carefully select each stem to create arrangements that are as unique 
              as the occasions they celebrate.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6 pt-2 sm:pt-3 md:pt-4">
              {[
                { icon: Leaf, text: "Farm Fresh" },
                { icon: Heart, text: "Handcrafted" },
                { icon: Award, text: "Premium Quality" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2.5 sm:gap-3"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#3e4026]/5 rounded-sm flex items-center justify-center flex-shrink-0">
                    <item.icon size={16} className="sm:w-[18px] sm:h-[18px] text-[#3e4026]" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

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
    <section ref={sectionRef} className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="/1.png"
                  alt="Colorful flower arrangement"
                  className="w-full h-64 object-cover"
                />
                <img
                  src="/5.png"
                  alt="Purple flowers"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="pt-8">
                <img
                  src="/4.png"
                  alt="Red roses bouquet"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
            
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-[#3e4026] text-white p-6 shadow-xl"
            >
              <p className="text-3xl font-light mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>7+</p>
              <p className="text-xs tracking-wider uppercase">Years of Excellence</p>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#3e4026]/60 mb-4">
                About Us
              </p>
              <h2 
                className="text-4xl md:text-5xl text-[#3e4026] mb-6 leading-tight"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                We Create Beautiful
                <br />
                <span className="italic">Floral Experiences</span>
              </h2>
            </div>

            <p className="text-gray-600 leading-relaxed text-lg">
              At Bloom Tale, every bouquet tells a story. We believe in the power of flowers 
              to express emotions, celebrate moments, and bring joy to everyday life. Our 
              artisans carefully select each stem to create arrangements that are as unique 
              as the occasions they celebrate.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
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
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-[#3e4026]/5 flex items-center justify-center">
                    <item.icon size={18} className="text-[#3e4026]" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 border-b-2 border-[#3e4026] pb-1 text-[#3e4026] font-medium hover:gap-4 transition-all"
            >
              Learn More About Us
              <span>→</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Truck, ShieldCheck, Clock, Flower2 } from "lucide-react"

export default function WhyChooseUs() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const features = [
    {
      icon: Flower2,
      title: "Farm Fresh Daily",
      description: "Flowers sourced directly from premium growers and delivered within 24 hours of cutting.",
    },
    {
      icon: Truck,
      title: "Same Day Delivery",
      description: "Order before 2pm for guaranteed same-day delivery to your doorstep.",
    },
    {
      icon: ShieldCheck,
      title: "Freshness Guarantee",
      description: "7-day freshness promise or we'll replace your arrangement for free.",
    },
    {
      icon: Clock,
      title: "Expert Care",
      description: "Each bouquet is hand-arranged by our expert florists with 7+ years experience.",
    },
  ]

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#3e4026]/60 mb-4">
            Why Choose Us
          </p>
        </motion.div>

        {/* Feature Grid - 4 cards in one line */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 bg-[#f9f8f6] hover:bg-[#f4f3f0] transition-colors duration-300 group"
            >
              <div className="w-12 h-12 bg-white flex items-center justify-center mb-4 group-hover:bg-[#3e4026] transition-colors duration-300">
                <feature.icon 
                  size={22} 
                  className="text-[#3e4026] group-hover:text-white transition-colors duration-300" 
                  strokeWidth={1.5}
                />
              </div>
              <h3 
                className="text-lg text-[#3e4026] mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

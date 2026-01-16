import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function WeddingServices() {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  const categories = [
    "Wedding theme designing & setup",
    "Catering",
    "Transportation",
    "Photography",
    "Gifting [hampers]",
    "Bridal makeup [MUA services]",
    "Location scouting"
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate('/services/wedding')}
      className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500"
    >
        {/* Image */}
        <div className="relative h-80 bg-gradient-to-br from-pink-50 to-rose-100">
          <div className="absolute inset-0">
            <img
              src="/wedding-services.jpg"
              alt="Wedding Services"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Badge */}
          <div className="absolute top-4 left-4 bg-[#3e4026] text-white px-3 py-1 text-xs font-medium">
            Premium
          </div>
        </div>

        {/* Title Section */}
        <div className="bg-white p-6">
          <h3 
            className="text-2xl text-[#3e4026] mb-2 flex items-center justify-between"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Wedding
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </h3>
          <p className="text-gray-600 text-sm">Elegant ceremonies</p>
        </div>

        {/* Hover Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-[#3e4026]/95 text-white p-6 flex flex-col justify-center"
            >
              <h4 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Our Services
              </h4>
              <ul className="space-y-2">
                {categories.slice(0, 4).map((category, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    {category}
                  </motion.li>
                ))}
                {categories.length > 4 && (
                  <li className="text-sm text-white/80 mt-2">+ {categories.length - 4} more</li>
                )}
              </ul>
              <p className="text-xs text-white/80 mt-4">Click to view details</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
  )
}

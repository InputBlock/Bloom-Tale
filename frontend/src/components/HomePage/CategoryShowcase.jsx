import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"

export default function CategoryShowcase() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const navigate = useNavigate()

  const categories = [
    {
      id: 1,
      name: "Birthday",
      tagline: "Celebrate Another Year",
      image: "/purple-flowers-birthday.jpg",
    },
    {
      id: 2,
      name: "Anniversary",
      tagline: "Celebrate Your Love",
      image: "/annivarsary-carousel.jpg",
    },
    {
      id: 3,
      name: "Wedding",
      tagline: "Perfect Bridal Blooms",
      image: "/wedding-blooms-carousel.jpg",
    },
    {
      id: 4,
      name: "Sympathy",
      tagline: "Thoughtful Tributes",
      image: "/white-flowers-arrangement.jpg",
    },
  ]

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-[#f9f8f6]">
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
              Shop By Occasion
            </p>
            <h2 
              className="text-4xl md:text-5xl text-[#3e4026]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Perfect for Every
              <br />
              <span className="italic">Moment</span>
            </h2>
          </div>
          <motion.button
            whileHover={{ gap: '12px' }}
            onClick={() => navigate('/shop')}
            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-[#3e4026] font-medium hover:underline"
          >
            View All Categories
            <ArrowUpRight size={16} />
          </motion.button>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => navigate(`/shop?occasion=${category.name.toLowerCase()}`)}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden mb-4 aspect-[3/4]">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                
                {/* Arrow Icon */}
                <div className="absolute bottom-4 right-4 w-10 h-10 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight size={18} className="text-[#3e4026]" />
                </div>
              </div>
              
              <h3 
                className="text-xl text-[#3e4026] mb-1"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">{category.tagline}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

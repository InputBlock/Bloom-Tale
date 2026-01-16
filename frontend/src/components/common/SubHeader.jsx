import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { 
  Menu, 
  X,
  Truck, 
  Cake, 
  Heart, 
  Flower2, 
  Flame, 
  Sparkles, 
  Building2, 
  Gift, 
  Settings 
} from "lucide-react"

export default function SubHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const categories = [
    { name: "Same Day Delivery", icon: Truck, path: "/shop?delivery=same-day" },
    { name: "Birthday", icon: Cake, path: "/shop?occasion=birthday" },
    { name: "Anniversary", icon: Heart, path: "/shop?occasion=anniversary" },
    { name: "Forever Flowers", icon: Flower2, path: "/shop?type=forever" },
    { name: "Fragrances", icon: Flame, path: "/shop?type=fragrances" },
    { name: "Premium", icon: Sparkles, path: "/shop?type=premium" },
    { name: "Corporate", icon: Building2, path: "/shop?type=corporate" },
    { name: "Combos", icon: Gift, path: "/shop?type=combo" },
    { name: "Services", icon: Settings, path: "/services" },
  ]

  return (
    <section className="bg-[#f9f8f6] border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Desktop View */}
        <div className="hidden md:flex items-center justify-between py-4">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ y: -2 }}
                onClick={() => navigate(category.path)}
                className="group flex flex-col items-center gap-2 px-2 py-2 transition-all duration-300"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 group-hover:bg-[#3e4026] group-hover:border-[#3e4026] transition-all duration-300">
                  <Icon 
                    size={18} 
                    className="text-[#3e4026] group-hover:text-white transition-colors duration-300" 
                    strokeWidth={1.5}
                  />
                </div>
                <span className="text-[10px] tracking-wide text-[#3e4026]/70 group-hover:text-[#3e4026] text-center leading-tight transition-colors duration-300">
                  {category.name}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* Mobile View */}
        <div className="md:hidden py-3">
          <button 
            className="flex items-center gap-2 text-[#3e4026]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            <span className="text-sm font-medium">Browse Categories</span>
          </button>

          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 grid grid-cols-3 gap-4 pb-4"
            >
              {categories.map((category, index) => {
                const Icon = category.icon
                return (
                  <button
                    key={index}
                    onClick={() => {
                      navigate(category.path)
                      setIsMenuOpen(false)
                    }}
                    className="flex flex-col items-center gap-2 p-3 bg-white hover:bg-[#3e4026] group transition-colors duration-300"
                  >
                    <Icon 
                      size={20} 
                      className="text-[#3e4026] group-hover:text-white transition-colors" 
                      strokeWidth={1.5} 
                    />
                    <span className="text-[10px] text-[#3e4026] group-hover:text-white text-center">
                      {category.name}
                    </span>
                  </button>
                )
              })}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

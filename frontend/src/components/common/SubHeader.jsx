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
  Gift
} from "lucide-react"

export default function SubHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const categories = [
    { name: "Same Day Delivery", icon: Truck, path: "/shop?category=same-day-delivery" },
    { name: "Birthday", icon: Cake, path: "/shop?category=birthday" },
    { name: "Anniversary", icon: Heart, path: "/shop?category=anniversary" },
    { name: "Forever Flowers", icon: Flower2, path: "/shop?category=forever-flowers" },
    { name: "Candles", icon: Flame, path: "/shop?category=candles" },
    { name: "Premium", icon: Sparkles, path: "/shop?category=premium" },
    { name: "Corporate", icon: Building2, path: "/shop?category=corporate" },
    { name: "Combos", icon: Gift, path: "/shop?category=combos" },
  ]

  return (
    <section className="bg-[#f5f4f0] border-y border-[#e8e6e1]">
      {/* Desktop View - Full Width */}
      <div className="hidden md:block w-full">
        <div className="flex items-stretch justify-between">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.01, duration: 0.2 }}
                whileHover={{ backgroundColor: "rgba(62, 64, 38, 0.04)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(category.path)}
                className="flex-1 flex flex-col items-center justify-center gap-3 py-5 cursor-pointer transition-all duration-200 border-r border-[#e8e6e1] last:border-r-0"
              >
                <div className="w-11 h-11 flex items-center justify-center bg-white rounded-xl shadow-sm border border-[#e8e6e1]">
                  <Icon 
                    size={20} 
                    className="text-[#3e4026]"
                    strokeWidth={1.5}
                  />
                </div>
                <span className="text-[11px] font-semibold tracking-wide text-[#3e4026]/80 text-center">
                  {category.name}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden px-4 py-3">
        <button 
          className="flex items-center gap-2 text-[#3e4026] cursor-pointer py-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          <span className="text-sm font-semibold">Explore Bloom Collections</span>
        </button>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 pb-2"
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
                  className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-white rounded-xl cursor-pointer shadow-sm active:scale-95 transition-transform"
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-[#f5f4f0] rounded-lg">
                    <Icon 
                      size={20} 
                      className="text-[#3e4026]" 
                      strokeWidth={1.5} 
                    />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-medium text-[#3e4026] text-center leading-tight">
                    {category.name}
                  </span>
                </button>
              )
            })}
          </motion.div>
        )}
      </div>
    </section>
  )
}

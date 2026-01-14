import { useState } from "react"
import { motion } from "framer-motion"
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

  const categories = [
    { name: "Same Day Delivery", icon: Truck },
    { name: "Birthday Flowers", icon: Cake },
    { name: "Anniversary Flowers", icon: Heart },
    { name: "Forever Flowers", icon: Flower2 },
    { name: "Candles & Fragrances", icon: Flame },
    { name: "Signature & Premium Collections", icon: Sparkles },
    { name: "Corporate & Bulk Gifting", icon: Building2 },
    { name: "Festive Combo & Add On", icon: Gift },
    { name: "Services", icon: Settings },
  ]

  return (
    <div className="bg-[#EDE8E0] px-4 pt-2 pb-2">
      {/* Sub Navigation with Glass Effect */}
      <div className="relative backdrop-blur-2xl bg-white/50 border border-white/30 shadow-xl rounded-2xl overflow-hidden">
        {/* Glass overlay for enhanced effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/30 to-transparent pointer-events-none"></div>
        
        {/* Noise texture for frosted glass effect */}
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}></div>
        
        <div className="relative w-full px-4 py-3">
          {/* Desktop View */}
          <div className="hidden md:flex items-center justify-evenly gap-2 max-w-7xl mx-auto">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <>
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group flex flex-col items-center gap-2 flex-1 px-1 py-1 transition-all duration-300"
                  >
                    <div className="w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center rounded-full bg-[#EDE8E0]/50 group-hover:bg-[#5e6043]/10 transition-all duration-300 border border-[#5e6043]/20">
                      <Icon 
                        size={16} 
                        className="text-[#5e6043] group-hover:text-[#3e4026] transition-colors duration-300 lg:w-[18px] lg:h-[18px]" 
                        strokeWidth={1.5}
                      />
                    </div>
                    <span className="text-[9px] lg:text-[10px] text-[#3e4026] font-medium text-center leading-tight whitespace-nowrap group-hover:text-[#5e6043] transition-colors duration-300">
                      {category.name}
                    </span>
                  </motion.button>
                  {index < categories.length - 1 && (
                    <div className="h-12 w-px bg-[#5e6043]/20"></div>
                  )}
                </>
              )
            })}
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            <button 
              className="flex items-center gap-2 text-[#3e4026] font-medium"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              <span className="text-sm">Categories</span>
            </button>

            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 grid grid-cols-2 gap-3"
              >
                {categories.map((category, index) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={index}
                      className="flex items-center gap-2 p-2 bg-[#EDE8E0]/30 rounded-lg hover:bg-[#5e6043]/10 transition-colors"
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#5e6043]/20">
                        <Icon size={16} className="text-[#5e6043]" strokeWidth={1.5} />
                      </div>
                      <span className="text-xs text-[#3e4026] font-medium">{category.name}</span>
                    </button>
                  )
                })}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

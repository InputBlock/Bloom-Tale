import Header from "../components/common/Header"
import SubHeader from "../components/common/SubHeader"
import Hero from "../components/HomePage/Hero"
import BestsellingBlooms from "../components/HomePage/BestsellingBlooms"
import Footer from "../components/common/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show scroll to top button when user scrolls past 500px
      setShowScrollTop(window.scrollY > 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-[#EDE8E0]">
      <Header />
      <SubHeader />
      <Hero />
      
      {/* Scroll Down Indicator - Only show when at top */}
      <AnimatePresence>
        {!showScrollTop && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative -mt-8 mb-8 flex justify-center z-20"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border-2 border-white/40 shadow-lg"
            >
              <span className="text-gray-700 text-sm font-semibold mb-1">Scroll Down</span>
              <ChevronDown size={28} className="text-gray-700 font-bold" strokeWidth={3} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button - Show when scrolled down */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 flex flex-col items-center bg-[#5d6c4e] hover:bg-[#4a5840] backdrop-blur-md p-4 rounded-full shadow-2xl transition-colors duration-300"
          >
            <ChevronUp size={28} className="text-white font-bold" strokeWidth={3} />
          </motion.button>
        )}
      </AnimatePresence>

      <BestsellingBlooms />
      <Footer />
    </div>
  )
}

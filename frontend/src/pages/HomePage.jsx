import Header from "../components/common/Header"
import SubHeader from "../components/common/SubHeader"
import Hero from "../components/HomePage/Hero"
import BestsellingBlooms from "../components/HomePage/BestsellingBlooms"
import AboutSection from "../components/HomePage/AboutSection"
import WhyChooseUs from "../components/HomePage/WhyChooseUs"
import CategoryShowcase from "../components/HomePage/SeasonalShowCase"
import Testimonials from "../components/HomePage/Testimonials"
import Footer from "../components/common/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      {/* Categories SubHeader below hero */}
      <SubHeader />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-[#3e4026] hover:bg-[#2d2f1c] flex items-center justify-center shadow-lg transition-colors duration-300"
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} className="text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      <AboutSection />
      <BestsellingBlooms />
      <CategoryShowcase />
      <WhyChooseUs />
      <Testimonials />
      <Footer />
    </div>
  )
}

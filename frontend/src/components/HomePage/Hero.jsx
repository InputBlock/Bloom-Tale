import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

const heroSlides = [
  {
    id: 1,
    subtitle: "Fresh Flowers, Delivered Daily",
    title: "Bloom Tale",
    description: "Handcrafted bouquets for life's most meaningful moments",
    buttonText: "Shop Now",
    image: "/annivarsary-carousel.jpg",
  },
  {
    id: 2,
    subtitle: "Wedding Collection",
    title: "Your Perfect Day",
    description: "Elegant arrangements to make your celebration unforgettable",
    buttonText: "Explore Wedding",
    image: "/wedding-blooms-carousel.jpg",
  },
  {
    id: 3,
    subtitle: "Seasonal Favorites",
    title: "Spring Blooms",
    description: "Discover the beauty of nature's freshest flowers",
    buttonText: "View Collection",
    image: "/seasonal-carousel.jpg",
  },
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const handlePrev = () => {
    setIsAutoPlaying(false)
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  return (
    <section className="relative h-[90vh] md:h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full flex items-center z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {/* Subtitle */}
                <motion.p
                  className="text-white/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4"
                >
                  {heroSlides[currentSlide].subtitle}
                </motion.p>

                {/* Title */}
                <h1 
                  className="text-5xl md:text-7xl lg:text-8xl text-white font-light mb-6 leading-tight"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {heroSlides[currentSlide].title}
                </h1>

                {/* Description */}
                <p className="text-white/90 text-lg md:text-xl mb-8 font-light max-w-lg">
                  {heroSlides[currentSlide].description}
                </p>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/shop')}
                  className="group inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 text-sm font-medium tracking-wide hover:bg-gray-100 transition-all duration-300"
                >
                  {heroSlides[currentSlide].buttonText}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-12 right-12 flex gap-3 z-20">
        <button
          onClick={handlePrev}
          className="w-12 h-12 border border-white/40 hover:bg-white/10 text-white flex items-center justify-center transition-all duration-300"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          className="w-12 h-12 border border-white/40 hover:bg-white/10 text-white flex items-center justify-center transition-all duration-300"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-12 left-12 z-20">
        <div className="flex items-center gap-4 text-white">
          <span className="text-3xl font-light" style={{ fontFamily: 'Playfair Display, serif' }}>
            0{currentSlide + 1}
          </span>
          <div className="w-12 h-px bg-white/40" />
          <span className="text-sm text-white/60">0{heroSlides.length}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <motion.div
          key={currentSlide}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 6, ease: 'linear' }}
          className="h-full bg-white"
        />
      </div>
    </section>
  )
}

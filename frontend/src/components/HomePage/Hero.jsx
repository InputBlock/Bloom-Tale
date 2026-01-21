import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

const heroSlides = [
  {
    id: 1,
    subtitle: "Fresh Flowers, Delivered Daily",
    title: "Bloom Tale",
    description: "Every bouquet holds a story you can’t put into words.",
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
  const [isLoaded, setIsLoaded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Mark as loaded after component mounts
    setIsLoaded(true)
  }, [])

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
    <section className="relative h-[85vh] sm:h-[90vh] md:h-screen overflow-hidden bg-gray-900">
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
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${heroSlides[currentSlide].image})`,
              willChange: 'transform'
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full flex items-center z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full">
          <div className="max-w-2xl">
            {isLoaded && (
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
                    className="text-white/80 text-[11px] sm:text-xs md:text-sm tracking-[0.25em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4"
                  >
                    {heroSlides[currentSlide].subtitle}
                  </motion.p>

                  {/* Title */}
                  <h1 
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-light mb-4 sm:mb-5 md:mb-6 leading-tight"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {heroSlides[currentSlide].title}
                  </h1>

                  {/* Description */}
                  <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-7 md:mb-8 font-light max-w-lg">
                    {heroSlides[currentSlide].description}
                  </p>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/shop')}
                    className="group inline-flex items-center gap-2 sm:gap-3 bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-medium tracking-wide hover:bg-gray-100 active:scale-95 transition-all duration-300 rounded-sm"
                  >
                    {heroSlides[currentSlide].buttonText}
                    <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px] group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-6 sm:bottom-8 md:bottom-12 right-4 sm:right-6 md:right-12 flex gap-2 sm:gap-3 z-20">
        <button
          onClick={handlePrev}
          className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 border border-white/40 hover:bg-white/10 text-white flex items-center justify-center active:scale-95 transition-all duration-300 rounded-sm backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={handleNext}
          className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 border border-white/40 hover:bg-white/10 text-white flex items-center justify-center active:scale-95 transition-all duration-300 rounded-sm backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-4 sm:left-6 md:left-12 z-20">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-white">
          <span className="text-2xl sm:text-3xl font-light" style={{ fontFamily: 'Playfair Display, serif' }}>
            0{currentSlide + 1}
          </span>
          <div className="w-8 sm:w-10 md:w-12 h-px bg-white/40" />
          <span className="text-xs sm:text-sm text-white/60">0{heroSlides.length}</span>
        </div>
      </div>

      {/* Progress Bar */}
      {isLoaded && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
          <motion.div
            key={currentSlide}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 6, ease: 'linear' }}
            className="h-full bg-white"
          />
        </div>
      )}
    </section>
  )
}

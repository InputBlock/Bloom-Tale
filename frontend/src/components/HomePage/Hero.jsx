import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

const heroSlides = [
  {
    id: 1,
    title: "Anniversary Special",
    description: "Fresh blooms for milestones, yours or someone special's",
    buttonText: "ORDER NOW",
    image: "/annivarsary-carousel.jpg",
  },
  {
    id: 2,
    title: "Wedding Blooms",
    description: "Elegant arrangements to make your special day unforgettable",
    buttonText: "EXPLORE NOW",
    image: "/wedding-blooms-carousel.jpg",
  },
  {
    id: 3,
    title: "Seasonal Collection",
    description: "Discover the beauty of fresh seasonal flowers",
    buttonText: "SHOP NOW",
    image: "/seasonal-carousel.jpg",
  },
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
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
    <section className="relative h-96 md:h-125 bg-[#EDE8E0] overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[#5e6043]/5 blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-[#3e4026]/5 blur-3xl" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="relative h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroSlides[currentSlide].image})`,
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-center items-start px-6 md:px-20 lg:px-24 max-w-3xl pt-8 pb-16">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-4 leading-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {heroSlides[currentSlide].title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl lg:text-2xl text-gray-50 mb-8 leading-relaxed max-w-xl"
            >
              {heroSlides[currentSlide].description}
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#3e4026] text-white px-10 py-4 text-base font-semibold hover:bg-[#5e6043] transition-all duration-300 rounded-sm shadow-lg"
            >
              {heroSlides[currentSlide].buttonText}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-2 md:p-3 transition-all duration-300 z-10"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-2 md:p-3 transition-all duration-300 z-10"
      >
        <ChevronRight size={24} />
      </button>

      {/* Carousel Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {heroSlides.map((_, index) => (
          <motion.div
            key={index}
            onClick={() => {
              setIsAutoPlaying(false)
              setCurrentSlide(index)
            }}
            className={`cursor-pointer transition-all duration-300 ${index === currentSlide
                ? "w-8 h-2 bg-white rounded-full"
                : "w-2 h-2 bg-gray-400 rounded-full hover:bg-gray-300"
              }`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
    </section>
  )
}

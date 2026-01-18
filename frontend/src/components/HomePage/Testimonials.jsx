import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Star, ArrowLeft, ArrowRight } from "lucide-react"

export default function Testimonials() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      title: "Verified Customer",
      rating: 5,
      text: "The most beautiful flowers I've ever received. Fresh, fragrant, and absolutely stunning. The attention to detail in the arrangement was remarkable.",
      image: "/testimonial-1.jpg",
    },
    {
      id: 2,
      name: "Rahul Verma",
      title: "Regular Customer",
      rating: 5,
      text: "Same-day delivery saved our anniversary! The roses were incredibly fresh and the premium packaging made it feel truly special.",
      image: "/testimonial-2.jpg",
    },
    {
      id: 3,
      name: "Ananya Patel",
      title: "Wedding Client",
      rating: 5,
      text: "They handled all the flowers for my sister's wedding. Professional, creative, and exceeded every expectation. Absolutely recommend!",
      image: "/testimonial-3.jpg",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 lg:py-32 bg-[#3e4026] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-20 items-center">
          {/* Left Side - Header */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-white/50 mb-3 sm:mb-4">
              Testimonials
            </p>
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl text-white mb-4 sm:mb-5 md:mb-6 leading-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              What Our
              <br />
              <span className="italic">Customers Say</span>
            </h2>

            {/* Navigation */}
            <div className="flex items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
              <button
                onClick={handlePrev}
                className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 border border-white/30 rounded-sm flex items-center justify-center hover:bg-white hover:text-[#3e4026] text-white active:scale-95 transition-all duration-300"
                aria-label="Previous testimonial"
              >
                <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 border border-white/30 rounded-sm flex items-center justify-center hover:bg-white hover:text-[#3e4026] text-white active:scale-95 transition-all duration-300"
                aria-label="Next testimonial"
              >
                <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <span className="text-white/50 ml-2 sm:ml-4 text-xs sm:text-sm tracking-widest">
                {String(currentIndex + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
              </span>
            </div>
          </motion.div>

          {/* Right Side - Testimonial Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-sm"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4 sm:mb-5 md:mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} size={16} className="sm:w-[18px] sm:h-[18px] text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p 
                  className="text-white text-lg sm:text-xl md:text-2xl leading-relaxed mb-6 sm:mb-7 md:mb-8"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  "{testimonials[currentIndex].text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium text-sm sm:text-base">
                      {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm sm:text-base">{testimonials[currentIndex].name}</p>
                    <p className="text-white/50 text-xs sm:text-sm">{testimonials[currentIndex].title}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress Dots */}
            <div className="flex gap-1.5 sm:gap-2 mt-5 sm:mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1 transition-all duration-500 rounded-full ${
                    index === currentIndex ? "w-6 sm:w-8 bg-white" : "w-3 sm:w-4 bg-white/30"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

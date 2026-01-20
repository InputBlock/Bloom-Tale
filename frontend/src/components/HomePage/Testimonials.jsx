import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { ArrowLeft, ArrowRight, Quote } from "lucide-react"

export default function Testimonials() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: "Raja Kumari",
      title: "Actress",
      rating: 5,
      text: "Exquisite arrangements for my events and photoshoots. Their creativity and attention to detail bring my vision to life every single time. Truly exceptional!",
      image: "/raja-kumari.jpg",
    },
    {
      id: 2,
      name: "Priya Sharma",
      title: "Verified Customer",
      rating: 5,
      text: "The most beautiful flowers I've ever received. Fresh, fragrant, and absolutely stunning. The attention to detail in the arrangement was remarkable.",
      image: "/priya-sharma.jpg",
    },
    {
      id: 3,
      name: "Rahul Verma",
      title: "Regular Customer",
      rating: 5,
      text: "Same-day delivery saved our anniversary! The roses were incredibly fresh and the premium packaging made it feel truly special.",
      image: "/rahul-verma.jpg",
    },
    {
      id: 4,
      name: "Ananya Patel",
      title: "Wedding Client",
      rating: 5,
      text: "They handled all the flowers for my sister's wedding. Professional, creative, and exceeded every expectation. Absolutely recommend!",
      image: "/ananya-patel.jpg",
    },
  ]

  const itemsPerPage = 2
  const totalPages = Math.ceil(testimonials.length / itemsPerPage)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const getVisibleTestimonials = () => {
    const startIndex = currentIndex * itemsPerPage
    return testimonials.slice(startIndex, startIndex + itemsPerPage)
  }

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 lg:py-32 bg-[#3e4026] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 lg:gap-16 items-start">
          {/* Left Side - Header */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.7 }}
            className="lg:sticky lg:top-32"
          >
            <p className="text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-white/50 mb-3 sm:mb-4">
              Testimonials
            </p>
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-6 sm:mb-8 leading-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              What Our <span className="italic">Customers Say</span>
            </h2>

            {/* Navigation */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={handlePrev}
                className="w-10 h-10 sm:w-12 sm:h-12 border border-white/30 rounded-sm flex items-center justify-center hover:bg-white hover:text-[#3e4026] text-white active:scale-95 transition-all duration-300"
                aria-label="Previous page"
              >
                <ArrowLeft size={20} />
              </button>
              
              {/* Dots */}
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === currentIndex ? "w-8 bg-white" : "w-4 bg-white/30"
                    }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-10 h-10 sm:w-12 sm:h-12 border border-white/30 rounded-sm flex items-center justify-center hover:bg-white hover:text-[#3e4026] text-white active:scale-95 transition-all duration-300"
                aria-label="Next page"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>

          {/* Right Side - Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getVisibleTestimonials().map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg overflow-hidden shadow-lg flex flex-col"
              >
                {/* Image */}
                <div className="h-48 sm:h-56 md:h-64 overflow-hidden">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Text */}
                  <p className="text-gray-700 text-sm sm:text-base mb-6 leading-relaxed flex-grow">
                    {testimonial.text}
                  </p>

                  {/* Author */}
                  <div>
                    <p className="font-semibold text-gray-900 text-base sm:text-lg">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

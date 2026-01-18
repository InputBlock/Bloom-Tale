import { motion } from "framer-motion"
import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function WeddingServicesPage() {
  const navigate = useNavigate()

  const services = [
    {
      title: "Wedding Theme Designing & Setup",
      description: "Transform your vision into reality with our expert theme design and comprehensive setup services, ensuring every detail reflects your unique love story.",
      image: "/services/wedding-theme.jpg" // Add image
    },
    {
      title: "Catering",
      description: "Delight your guests with exquisite culinary experiences, featuring customized menus and presentation that matches your wedding's elegance.",
      image: "/services/catering.jpg" // Add image
    },
    {
      title: "Transportation",
      description: "Ensure seamless arrivals and departures with our premium transportation services, from vintage cars to luxury vehicles.",
      image: "/services/transportation.jpg" // Add image
    },
    {
      title: "Photography",
      description: "Capture every precious moment with our professional photography services, creating timeless memories you'll cherish forever.",
      image: "/services/photography.jpg" // Add image
    },
    {
      title: "Gifting & Hampers",
      description: "Express gratitude with thoughtfully curated gift hampers and favors that leave a lasting impression on your guests.",
      image: "/services/gifting.jpg" // Add image
    },
    {
      title: "Bridal Makeup (MUA Services)",
      description: "Look absolutely stunning on your special day with our professional makeup artists who specialize in bridal beauty.",
      image: "/services/bridal-makeup.jpg" // Add image
    },
    {
      title: "Location Scouting",
      description: "Discover the perfect venue that matches your dreams, with our expert location scouting and recommendation services.",
      image: "/services/location-scouting.jpg" // Add image
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-10 md:pb-12 bg-gradient-to-br from-pink-50 to-rose-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 text-[#3e4026] hover:text-[#2d2f1c] mb-6 sm:mb-8 transition-colors text-sm sm:text-base active:scale-95"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            <span>Back to Services</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#3e4026] mb-3 sm:mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Wedding Services
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl">
              Elegant ceremonies crafted with perfection. From intimate gatherings to grand celebrations, 
              we bring your dream wedding to life with our comprehensive planning and execution services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                {/* Image */}
                <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 bg-gradient-to-br from-pink-50 to-rose-100 rounded-sm overflow-hidden mb-4 sm:mb-5 md:mb-6">
                  {/* ADD SERVICE IMAGES HERE */}
                  {/* Image will be at {service.image} */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-400 text-sm">{service.title} Image</p>
                  </div>
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-[#3e4026]/0 group-hover:bg-[#3e4026]/20 transition-all duration-300" />
                </div>

                {/* Content */}
                <div>
                  <h3 
                    className="text-xl sm:text-2xl md:text-3xl text-[#3e4026] mb-2 sm:mb-3 group-hover:text-[#2d2f1c] transition-colors"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#f9f8f6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl text-[#3e4026] mb-3 sm:mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Ready to Plan Your Dream Wedding?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8">
              Let's create an unforgettable celebration together
            </p>
            <button className="bg-[#3e4026] text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold hover:bg-[#2d2f1c] transition-all rounded-sm active:scale-95">
              Get a Quote
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

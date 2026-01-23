// Wedding Services Data Export
import { motion } from "framer-motion"
import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const weddingServicesData = [
  {
    title: "Wedding Theme Designing & Setup",
    description: "Transform your vision into reality with our expert theme design and comprehensive setup services, ensuring every detail reflects your unique love story.",
    images: [
      "/serviceimage/wedding-1.png?v=2",
      "/serviceimage/wedding-2.png?v=2",
      "/serviceimage/wedding-3.png?v=2",
      "/serviceimage/wedding-4.png?v=2"
    ]
  },
  {
    title: "Let us assist your wedding story into eternity",
    description: "Complete wedding journey management from pre-wedding to the grand celebration. We create dedicated Instagram pages for couples, manage your wedding timeline, coordinate all vendors, and ensure every moment from engagement to reception is perfectly executed and beautifully documented.",
    images: [
      "/serviceimage/assist-1.png",
      "/serviceimage/assist-2.png",
      "/serviceimage/assist-3.png",
      "/serviceimage/assist-4.png"
    ]
  },
  {
    title: "Catering",
    description: "Delight your guests with exquisite culinary experiences, featuring customized menus and presentation that matches your wedding's elegance.",
    images: [
      "/serviceimage/catering-1.png",
      "/serviceimage/catering-2.png",
      "/serviceimage/catering-3.png",
      "/serviceimage/catering-4.png"
    ]
  },
  {
    title: "Transportation",
    description: "Ensure seamless arrivals and departures with our premium transportation services, from vintage cars to luxury vehicles.",
    images: [
      "/serviceimage/transportation-1.png",
      "/serviceimage/transportation-2.png",
      "/serviceimage/transportation-3.png",
      "/serviceimage/transportation-4.png"
    ]
  },
  {
    title: "Social Media Management",
    description: "Capture every precious moment with our professional photography services, creating timeless memories you'll cherish forever.",
    images: [
      "/serviceimage/photography-1.png",
      "/serviceimage/photography-2.png",
      "/serviceimage/photography-3.png",
      "/serviceimage/photography-4.png"
    ]
  },
  {
    title: "Gifting & Hampers",
    description: "Express gratitude with thoughtfully curated gift hampers and favors that leave a lasting impression on your guests.",
    images: [
      "/serviceimage/gifting-1.png",
      "/serviceimage/gifting-2.png",
      "/serviceimage/gifting-3.png",
      "/serviceimage/gifting-4.png"
    ]
  },
  {
    title: "Bridal Makeup (MUA Services)",
    description: "Look absolutely stunning on your special day with our professional makeup artists who specialize in bridal beauty.",
    images: [
      "/serviceimage/makeup-1.png",
      "/serviceimage/makeup-2.png",
      "/serviceimage/makeup-3.png",
      "/serviceimage/makeup-4.png"
    ]
  },
  {
    title: "Location Scouting",
    description: "Discover the perfect venue that matches your dreams, with our expert location scouting and recommendation services.",
    images: [
      "/serviceimage/location-1.png",
      "/serviceimage/location-2.png",
      "/serviceimage/location-3.png",
      "/serviceimage/location-4.png"
    ]
  }
]

export const weddingGalleryData = [
  { id: 1, image: "/gallery/wedding-1.jpg", alt: "Wedding Ceremony" },
  { id: 2, image: "/gallery/wedding-2.jpg", alt: "Wedding Couple" },
  { id: 3, image: "/gallery/wedding-3.jpg", alt: "Wedding Venue" },
  { id: 4, image: "/gallery/wedding-4.jpg", alt: "Wedding Decor" },
  { id: 5, image: "/gallery/wedding-5.jpg", alt: "Wedding Stage" },
  { id: 6, image: "/gallery/wedding-6.jpg", alt: "Wedding Couple Portrait" },
  { id: 7, image: "/gallery/wedding-7.jpg", alt: "Wedding Reception" },
  { id: 8, image: "/gallery/wedding-8.jpg", alt: "Wedding Table Setup" }
]

// Wedding Services Page Component
export default function WeddingServices() {
  const navigate = useNavigate()
  const services = weddingServicesData

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
                {/* Image Grid - 4 Images */}
                <div className="relative h-auto bg-gradient-to-br from-pink-50 to-rose-100 rounded-sm overflow-hidden mb-4 sm:mb-5 md:mb-6">
                  <div className="grid grid-cols-2 gap-1">
                    {service.images.map((img, imgIndex) => (
                      <div 
                        key={imgIndex}
                        className="relative aspect-square bg-gray-100 overflow-hidden"
                      >
                        <img 
                          src={img} 
                          alt={`${service.title} - ${imgIndex + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="%239ca3af"%3EImage ' + (imgIndex + 1) + '%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-[#3e4026]/0 group-hover:bg-[#3e4026]/10 transition-all duration-300 pointer-events-none" />
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

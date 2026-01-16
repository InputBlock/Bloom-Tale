import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { useState, useEffect } from "react"

export default function Services() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [activeTab, setActiveTab] = useState("wedding")
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Reset showAll when tab changes
    setShowAll(false)
  }, [activeTab])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const serviceOverviews = {
    wedding: {
      title: "Wedding Services",
      description: "Create your dream wedding with our expert planning and execution, delivering elegant, personalized celebrations from intimate moments to grand affairs."
    },
    social: {
      title: "Social Events",
      description: "Celebrate life's precious moments with style and sophistication. Whether it's a milestone birthday, anniversary, or special gathering, we craft memorable experiences that bring joy to you and your loved ones."
    },
    corporate: {
      title: "Corporate Events",
      description: "Elevate your brand with professionally executed corporate events. From product launches to annual galas, we deliver seamless experiences that inspire, engage, and leave lasting impressions on your stakeholders."
    }
  }

  const weddingServices = [
    {
      title: "Wedding Theme Designing & Setup",
      description: "Transform your vision into reality with our expert theme design and comprehensive setup services, ensuring every detail reflects your unique love story.",
      image: "/services/wedding-theme.jpg"
    },
    {
      title: "Catering",
      description: "Delight your guests with exquisite culinary experiences, featuring customized menus and presentation that matches your wedding's elegance.",
      image: "/services/catering.jpg"
    },
    {
      title: "Transportation",
      description: "Ensure seamless arrivals and departures with our premium transportation services, from vintage cars to luxury vehicles.",
      image: "/services/transportation.jpg"
    },
    {
      title: "Photography",
      description: "Capture every precious moment with our professional photography services, creating timeless memories you'll cherish forever.",
      image: "/services/photography.jpg"
    },
    {
      title: "Gifting & Hampers",
      description: "Express gratitude with thoughtfully curated gift hampers and favors that leave a lasting impression on your guests.",
      image: "/services/gifting.jpg"
    },
    {
      title: "Bridal Makeup (MUA Services)",
      description: "Look absolutely stunning on your special day with our professional makeup artists who specialize in bridal beauty.",
      image: "/services/bridal-makeup.jpg"
    },
    {
      title: "Location Scouting",
      description: "Discover the perfect venue that matches your dreams, with our expert location scouting and recommendation services.",
      image: "/services/location-scouting.jpg"
    }
  ]

  const socialServices = [
    {
      title: "Birthday Parties",
      description: "Create unforgettable birthday celebrations with themed decorations, entertainment, and personalized touches that make every milestone special.",
      image: "/services/birthday.jpg"
    },
    {
      title: "Anniversaries",
      description: "Celebrate love and commitment with elegant anniversary setups that honor your journey together with sophistication and style.",
      image: "/services/anniversary.jpg"
    },
    {
      title: "Baby Showers",
      description: "Welcome new beginnings with adorable baby shower arrangements featuring delicate decorations and memorable moments.",
      image: "/services/baby-shower.jpg"
    },
    {
      title: "Cultural & Community Events",
      description: "Celebrate traditions and bring communities together with festive decorations for Diwali, Christmas, and other cultural occasions.",
      image: "/services/cultural-events.jpg"
    },
    {
      title: "Social Cause Events",
      description: "Make a difference with impactful awareness programs and NGO events that inspire positive change in the community.",
      image: "/services/social-cause.jpg"
    }
  ]

  const corporateServices = [
    {
      title: "Employee Engagement Programs",
      description: "Boost team morale and productivity with engaging corporate events designed to inspire collaboration and celebrate achievements.",
      image: "/services/employee-engagement.jpg"
    },
    {
      title: "Training & Workshops",
      description: "Facilitate professional development with well-organized training sessions and interactive workshops in inspiring environments.",
      image: "/services/training.jpg"
    },
    {
      title: "Brand Activations",
      description: "Create immersive brand experiences that engage audiences and build lasting connections with your target market.",
      image: "/services/brand-activation.jpg"
    },
    {
      title: "Award Nights",
      description: "Honor excellence and achievement with glamorous award ceremonies that recognize and celebrate outstanding performance.",
      image: "/services/award-nights.jpg"
    },
    {
      title: "Corporate Offsites",
      description: "Strengthen team bonds and foster innovation with memorable offsite retreats in stunning locations.",
      image: "/services/offsites.jpg"
    },
    {
      title: "Conference & Seminars",
      description: "Execute professional conferences and seminars with state-of-the-art facilities and seamless coordination.",
      image: "/services/conference.jpg"
    },
    {
      title: "Product Launches",
      description: "Make a lasting impression with spectacular product launch events that showcase your brand's innovation and excellence.",
      image: "/services/product-launch.jpg"
    },
    {
      title: "Annual Day & Gala Dinner",
      description: "Host prestigious corporate gatherings with sophisticated themes, premium entertainment, and flawless execution.",
      image: "/services/gala-dinner.jpg"
    }
  ]

  const getActiveServices = () => {
    switch(activeTab) {
      case "wedding": return weddingServices
      case "social": return socialServices
      case "corporate": return corporateServices
      default: return weddingServices
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

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

      {/* Services Section */}
      <section className="pt-20 md:pt-28 pb-12 md:pb-16 bg-[#f9f8f6]">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h1 
              className="text-3xl md:text-5xl text-[#3e4026] mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Our Services
            </h1>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center mb-12 md:mb-16">
            <div className="inline-flex gap-8 md:gap-12 border-b-2 border-gray-200">
              <button
                onClick={() => setActiveTab("wedding")}
                className={`pb-4 px-2 text-lg md:text-xl font-medium transition-all relative ${
                  activeTab === "wedding" 
                    ? "text-[#3e4026]" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Wedding
                {activeTab === "wedding" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3e4026]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("social")}
                className={`pb-4 px-2 text-lg md:text-xl font-medium transition-all relative ${
                  activeTab === "social" 
                    ? "text-[#3e4026]" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Social
                {activeTab === "social" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3e4026]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("corporate")}
                className={`pb-4 px-2 text-lg md:text-xl font-medium transition-all relative ${
                  activeTab === "corporate" 
                    ? "text-[#3e4026]" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Corporate
                {activeTab === "corporate" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3e4026]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Services Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
            >
              {/* Service Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-3xl mx-auto mb-16"
              >
                <h2 
                  className="text-3xl md:text-4xl text-[#3e4026] mb-4"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {serviceOverviews[activeTab].title}
                </h2>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  {serviceOverviews[activeTab].description}
                </p>
              </motion.div>

              {/* Subcategories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                {getActiveServices().slice(0, showAll ? undefined : 2).map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Image */}
                    <div className="relative h-72 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      {/* ADD SERVICE IMAGES HERE */}
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f9f8f6] to-gray-100">
                        <p className="text-gray-400 text-sm">{service.title}</p>
                      </div>
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-[#3e4026]/0 group-hover:bg-[#3e4026]/10 transition-all duration-500" />
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                      <div className="w-12 h-1 bg-[#3e4026] mb-4" />
                      <h3 
                        className="text-2xl md:text-3xl text-[#3e4026] mb-4 group-hover:text-[#2d2f1c] transition-colors duration-300"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                      >
                        {service.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        {service.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* View More Button */}
              {getActiveServices().length > 2 && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-[#3e4026] text-white font-medium hover:bg-[#2d2f1c] transition-colors duration-300"
                  >
                    <span>{showAll ? 'Show Less' : `View More (${getActiveServices().length - 2} more)`}</span>
                    <motion.svg
                      animate={{ rotate: showAll ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 
              className="text-4xl md:text-5xl text-[#3e4026] mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Ready to Plan Your
              <br />
              <span className="italic">Perfect Event?</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Let's discuss how we can make your next event truly exceptional
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#3e4026] text-white px-10 py-4 text-lg font-semibold hover:bg-[#2d2f1c] transition-colors shadow-lg"
            >
              Contact Us Today
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"

export default function Services() {
  const [searchParams] = useSearchParams()
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [activeTab, setActiveTab] = useState("wedding")
  const [showAll, setShowAll] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [showAllGallery, setShowAllGallery] = useState(false)
  const [activeSlideIndexes, setActiveSlideIndexes] = useState({})
  const [activeMainImageIndexes, setActiveMainImageIndexes] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Check URL parameters for tab
    const tabParam = searchParams.get("tab")
    if (tabParam && ["wedding", "social", "corporate"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  useEffect(() => {
    // Reset showAll when tab changes
    setShowAll(false)
    setShowAllGallery(false)
  }, [activeTab])

  // Auto-advance main images for all services
  useEffect(() => {
    const activeServices = getActiveServices()
    const visibleCount = showAll ? activeServices.length : Math.min(2, activeServices.length)
    const galleryLength = 8 // Number of images per service
    
    // Initialize indexes for all visible services
    const newIndexes = {}
    for (let i = 0; i < visibleCount; i++) {
      if (activeMainImageIndexes[i] === undefined) {
        newIndexes[i] = 0
      }
    }
    if (Object.keys(newIndexes).length > 0) {
      setActiveMainImageIndexes(prev => ({ ...prev, ...newIndexes }))
    }
    
    // Set up intervals for auto-advancing
    const intervals = []
    for (let i = 0; i < visibleCount; i++) {
      const interval = setInterval(() => {
        setActiveMainImageIndexes(prev => ({
          ...prev,
          [i]: ((prev[i] || 0) + 1) % galleryLength
        }))
      }, 3500)
      intervals.push(interval)
    }
    
    return () => intervals.forEach(interval => clearInterval(interval))
  }, [activeTab, showAll])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const openModal = (service) => {
    setSelectedService(service)
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedService(null)
    setIsSuccess(false)
    setIsSubmitting(false)
    document.body.style.overflow = 'auto'
  }

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch("http://localhost:8000/api/v1/enquiry/createEnquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          service: selectedService?.title
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsSubmitting(false)
        setIsSuccess(true)
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        })
        
        // Auto-close after showing success message
        setTimeout(() => {
          closeModal()
        }, 2500)
      } else {
        const errorData = await response.json()
        console.error(errorData.message || "Failed to submit enquiry")
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error)
      setIsSubmitting(false)
    }
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
      image: "/wedding-theme.jpg"
    },
    {
      title: "Social Media Management",
      description: "Share your love story beautifully with our comprehensive social media management service. We create a dedicated Instagram page for your wedding, curate stunning content from pre-wedding to post-wedding moments, and assist you throughout your journey. Let us capture and showcase every magical moment of your celebration.",
      image: "/services/social-media.jpg"
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
    },
    {
      title: "ATL & BTL Events",
      description: "Execute impactful above-the-line and below-the-line marketing campaigns with innovative strategies and memorable brand experiences.",
      image: "/services/atl-btl.jpg"
    }
  ]

  const weddingGallery = [
    { id: 1, image: "/gallery/wedding-1.jpg", alt: "Wedding Ceremony" },
    { id: 2, image: "/gallery/wedding-2.jpg", alt: "Wedding Couple" },
    { id: 3, image: "/gallery/wedding-3.jpg", alt: "Wedding Venue" },
    { id: 4, image: "/gallery/wedding-4.jpg", alt: "Wedding Decor" },
    { id: 5, image: "/gallery/wedding-5.jpg", alt: "Wedding Stage" },
    { id: 6, image: "/gallery/wedding-6.jpg", alt: "Wedding Couple Portrait" },
    { id: 7, image: "/gallery/wedding-7.jpg", alt: "Wedding Reception" },
    { id: 8, image: "/gallery/wedding-8.jpg", alt: "Wedding Table Setup" }
  ]

  const socialGallery = [
    { id: 1, image: "/gallery/social-1.jpg", alt: "Birthday Party" },
    { id: 2, image: "/gallery/social-2.jpg", alt: "Anniversary Celebration" },
    { id: 3, image: "/gallery/social-3.jpg", alt: "Baby Shower" },
    { id: 4, image: "/gallery/social-4.jpg", alt: "Cultural Event" },
    { id: 5, image: "/gallery/social-5.jpg", alt: "Social Gathering" },
    { id: 6, image: "/gallery/social-6.jpg", alt: "Party Decor" },
    { id: 7, image: "/gallery/social-7.jpg", alt: "Event Setup" },
    { id: 8, image: "/gallery/social-8.jpg", alt: "Celebration" }
  ]

  const corporateGallery = [
    { id: 1, image: "/gallery/corporate-1.jpg", alt: "Corporate Event" },
    { id: 2, image: "/gallery/corporate-2.jpg", alt: "Conference" },
    { id: 3, image: "/gallery/corporate-3.jpg", alt: "Product Launch" },
    { id: 4, image: "/gallery/corporate-4.jpg", alt: "Award Night" },
    { id: 5, image: "/gallery/corporate-5.jpg", alt: "Corporate Gala" },
    { id: 6, image: "/gallery/corporate-6.jpg", alt: "Brand Activation" },
    { id: 7, image: "/gallery/corporate-7.jpg", alt: "Corporate Offsite" },
    { id: 8, image: "/gallery/corporate-8.jpg", alt: "Training Workshop" }
  ]

  const getActiveServices = () => {
    switch(activeTab) {
      case "wedding": return weddingServices
      case "social": return socialServices
      case "corporate": return corporateServices
      default: return weddingServices
    }
  }

  const getActiveGallery = () => {
    switch(activeTab) {
      case "wedding": return weddingGallery
      case "social": return socialGallery
      case "corporate": return corporateGallery
      default: return weddingGallery
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-white to-[#f5f5f5]">
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
      <section className="pt-20 md:pt-28 pb-16 md:pb-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Tabs */}
          <div className="flex justify-start mb-12">
            <div className="inline-flex gap-12 md:gap-16">
              <button
                onClick={() => setActiveTab("wedding")}
                className={`pb-2 px-1 text-base md:text-lg font-normal uppercase tracking-widest transition-all relative ${
                  activeTab === "wedding" 
                    ? "text-[#3e4026]" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Wedding
                {activeTab === "wedding" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#3e4026]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("social")}
                className={`pb-2 px-1 text-base md:text-lg font-normal uppercase tracking-widest transition-all relative ${
                  activeTab === "social" 
                    ? "text-[#3e4026]" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Social
                {activeTab === "social" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#3e4026]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("corporate")}
                className={`pb-2 px-1 text-base md:text-lg font-normal uppercase tracking-widest transition-all relative ${
                  activeTab === "corporate" 
                    ? "text-[#3e4026]" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Corporate
                {activeTab === "corporate" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#3e4026]"
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
              className="space-y-24"
            >
              {/* Subcategories with Numbered Sections */}
              <div className="space-y-20">
                {getActiveServices().slice(0, showAll ? undefined : 2).map((service, index) => {
                  // Create unified gallery images array for this service
                  const galleryImages = [1, 2, 3, 4, 5, 6, 7, 8]
                  
                  const currentImageIndex = activeMainImageIndexes[index] || 0
                  
                  // Calculate which thumbnails to show (4 at a time, centered around current image)
                  const getThumbnailRange = () => {
                    const startIdx = Math.max(0, Math.min(currentImageIndex - 1, galleryImages.length - 4))
                    return galleryImages.slice(startIdx, startIdx + 4).map((img, idx) => ({
                      imageNum: img,
                      globalIndex: startIdx + idx
                    }))
                  }
                  
                  const visibleThumbnails = getThumbnailRange()
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white"
                    >
                      <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-start`}>
                        {/* Content Side */}
                        <div className="w-full lg:w-1/2 space-y-6">
                          {/* Numbered Header */}
                          <div className="flex items-baseline gap-3">
                            <span className="text-6xl md:text-7xl lg:text-8xl font-extralight text-gray-200/80">0{index + 1}</span>
                            <h2 
                              className="text-xl md:text-2xl lg:text-3xl text-[#3e4026] uppercase tracking-wider font-normal"
                              style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                              {service.title.split('&').map((part, i, arr) => (
                                <span key={i}>
                                  {part}
                                  {i < arr.length - 1 && <span className="italic text-[#c4a574]">&</span>}
                                </span>
                              ))}
                            </h2>
                          </div>

                          {/* Description */}
                          <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                            {service.description}
                          </p>

                          {/* CTA Button */}
                          <button
                            onClick={() => openModal(service)}
                            className="px-8 py-3 bg-[#3e4026] hover:bg-[#2d2f1c] text-white font-medium rounded-md transition-colors duration-300"
                          >
                            Book Us for {service.title}
                          </button>

                          {/* Sliding Thumbnail Gallery */}
                          <div className="pt-6">
                            <div className="relative overflow-hidden">
                              <div className="grid grid-cols-4 gap-4">
                                <AnimatePresence mode="popLayout">
                                  {visibleThumbnails.map((thumb) => (
                                    <motion.div
                                      key={thumb.globalIndex}
                                      layout
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.9 }}
                                      transition={{ duration: 0.3 }}
                                      onClick={() => setActiveMainImageIndexes(prev => ({ ...prev, [index]: thumb.globalIndex }))}
                                      className={`aspect-square bg-[#f5f3f0] overflow-hidden transition-all cursor-pointer ${
                                        currentImageIndex === thumb.globalIndex 
                                          ? 'ring-2 ring-[#3e4026] ring-offset-2' 
                                          : 'hover:ring-1 hover:ring-gray-300'
                                      }`}
                                    >
                                      <div className="w-full h-full flex items-center justify-center">
                                        <span className={`text-sm ${
                                          currentImageIndex === thumb.globalIndex 
                                            ? 'text-[#3e4026] font-semibold' 
                                            : 'text-gray-400'
                                        }`}>
                                          {thumb.imageNum}
                                        </span>
                                      </div>
                                    </motion.div>
                                  ))}
                                </AnimatePresence>
                              </div>
                            </div>
                            
                            {/* Progress Indicator */}
                            <div className="flex justify-center gap-1.5 mt-3">
                              {galleryImages.map((_, imgIdx) => (
                                <button
                                  key={imgIdx}
                                  onClick={() => setActiveMainImageIndexes(prev => ({ ...prev, [index]: imgIdx }))}
                                  className={`h-1.5 rounded-full transition-all duration-300 ${
                                    currentImageIndex === imgIdx 
                                      ? 'bg-[#3e4026] w-8' 
                                      : 'bg-gray-300 hover:bg-gray-400 w-1.5'
                                  }`}
                                  aria-label={`Go to image ${imgIdx + 1}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Image Side */}
                        <div className="w-full lg:w-1/2 h-[400px] lg:h-[520px] rounded-xl overflow-hidden relative bg-[#f5f3f0]">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={`main-${index}-${currentImageIndex}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                              className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f5f3f0] to-[#e8e6e2]"
                            >
                              {/* Placeholder - replace with actual images */}
                              <div className="text-center">
                                <p className="text-gray-400 text-base">{service.title} - {galleryImages[currentImageIndex]}</p>
                              </div>
                            </motion.div>
                          </AnimatePresence>
                          
                          {/* Bottom Navigation Bar */}
                          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm py-4 px-6">
                            <div className="flex items-center justify-between">
                              {/* Previous Arrow */}
                              <button
                                onClick={() => setActiveMainImageIndexes(prev => ({ 
                                  ...prev, 
                                  [index]: (prev[index] - 1 + galleryImages.length) % galleryImages.length 
                                }))}
                                className="w-10 h-10 rounded-full border border-gray-300 hover:border-[#3e4026] flex items-center justify-center transition-all"
                                aria-label="Previous image"
                              >
                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 15l-5-5 5-5" stroke="#3e4026" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                              
                              {/* Title with Image Number */}
                              <span className="text-sm md:text-base text-[#3e4026] font-medium tracking-wide">
                                {service.title} - {galleryImages[currentImageIndex]}
                              </span>
                              
                              {/* Next Arrow */}
                              <button
                                onClick={() => setActiveMainImageIndexes(prev => ({ 
                                  ...prev, 
                                  [index]: (prev[index] + 1) % galleryImages.length 
                                }))}
                                className="w-10 h-10 rounded-full border border-gray-300 hover:border-[#3e4026] flex items-center justify-center transition-all"
                                aria-label="Next image"
                              >
                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M8 15l5-5-5-5" stroke="#3e4026" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* View More Button */}
              {getActiveServices().length > 2 && (
                <div className="text-center mt-4">
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

      {/* Enquiry Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={closeModal}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
                aria-label="Close modal"
              >
                <X size={18} className="text-gray-500" />
              </button>

              {/* Form Content */}
              <div className="p-8 md:p-10">
                {isSuccess ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-16 h-16 bg-[#3e4026] rounded-full flex items-center justify-center mb-5"
                    >
                      <motion.svg
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="w-8 h-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <motion.path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                    </motion.div>
                    <h2
                      className="text-2xl text-[#3e4026] mb-2 text-center font-semibold"
                    >
                      Request Submitted!
                    </h2>
                    <p className="text-gray-500 text-center text-sm">
                      We'll get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="text-center mb-8">
                      <h2 className="text-2xl md:text-3xl text-[#3e4026] font-semibold mb-2">
                        Book This Service
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Fill in your details and we'll reach out to you
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">Name</label>
                          <input
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleFormChange}
                            className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:bg-gray-200 outline-none transition-all placeholder-gray-400 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone *</label>
                          <input
                            type="tel"
                            name="phone"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:bg-gray-200 outline-none transition-all placeholder-gray-400 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Email *</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleFormChange}
                          required
                          className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:bg-gray-200 outline-none transition-all placeholder-gray-400 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Message</label>
                        <textarea
                          name="message"
                          placeholder="Tell us about your requirements..."
                          value={formData.message}
                          onChange={handleFormChange}
                          rows="3"
                          className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:bg-gray-200 outline-none transition-all placeholder-gray-400 resize-none text-sm"
                        />
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                        className={`w-full py-3.5 rounded-lg font-medium transition-all text-sm mt-2 ${
                          isSubmitting 
                            ? 'bg-[#3e4026]/70 cursor-wait text-white' 
                            : 'bg-[#3e4026] hover:bg-[#2d2f1c] text-white'
                        }`}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            />
                            Sending...
                          </span>
                        ) : (
                          'Submit Request'
                        )}
                      </motion.button>

                      <p className="text-center text-xs text-gray-400 mt-4">
                        We respect your privacy. No spam, ever.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Gallery Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 
              className="text-4xl md:text-5xl text-[#3e4026] mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              OUR GALLERY
            </h2>
            {/* Decorative Divider */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-32 h-0.5 bg-[#c4a574]"></div>
            </div>
          </motion.div>

          {/* Gallery Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {getActiveGallery().slice(0, showAllGallery ? undefined : 4).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="relative group overflow-hidden aspect-square bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer"
                >
                  {/* Placeholder for images - replace with actual images */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f9f8f6] to-gray-100">
                    <p className="text-gray-400 text-xs text-center px-2">{item.alt}</p>
                  </div>
                  {/* Image overlay on hover */}
                  <div className="absolute inset-0 bg-[#3e4026]/0 group-hover:bg-[#3e4026]/30 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
                      View
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Load More Button */}
          {getActiveGallery().length > 4 && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAllGallery(!showAllGallery)}
                className="inline-flex items-center gap-2 px-10 py-3 bg-[#3e4026] text-white font-medium hover:bg-[#2d2f1c] transition-colors duration-300 shadow-md"
              >
                <span>{showAllGallery ? 'Show Less' : 'Load More'}</span>
                <motion.svg
                  animate={{ rotate: showAllGallery ? 180 : 0 }}
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
        </div>
      </section>

      <Footer />
    </div>
  )
}

import { useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Leaf, Heart, Award, Star, Check, Flower } from "lucide-react"
import { aboutAPI } from "../../api"

// Icon mapping for dynamic icons from backend
const ICON_MAP = {
  Leaf,
  Heart,
  Award,
  Star,
  Check,
  Flower
}

// Default data (fallback when API fails or no data)
const DEFAULT_DATA = {
  images: [
    { url: "/1.png", alt: "Colorful flower arrangement" },
    { url: "/5.png", alt: "Purple flowers" },
    { url: "/4.png", alt: "Red roses bouquet" }
  ],
  badge_number: "7+",
  badge_text: "Years of Excellence",
  title_line1: "We Create Beautiful",
  title_line2: "Floral Experiences",
  description: "At Bloom Tale, every bouquet tells a story. We believe in the power of flowers to express emotions, celebrate moments, and bring joy to everyday life. Our artisans carefully select each stem to create arrangements that are as unique as the occasions they celebrate.",
  features: [
    { icon: "Leaf", text: "Farm Fresh" },
    { icon: "Heart", text: "Handcrafted" },
    { icon: "Award", text: "Premium Quality" }
  ]
}

export default function AboutSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })
  const [data, setData] = useState(DEFAULT_DATA)

  useEffect(() => {
    const fetchAboutSection = async () => {
      try {
        const { response, data: result } = await aboutAPI.get()
        if (!response.ok) {
          console.error("API response not ok:", response.status)
          return
        }
        console.log("About section API response:", result) // Debug log
        
        if (result.success && result.data) {
          // Merge with defaults for any missing fields
          setData({
            ...DEFAULT_DATA,
            ...result.data,
            images: result.data.images?.length > 0 ? result.data.images : DEFAULT_DATA.images,
            features: result.data.features?.length > 0 ? result.data.features : DEFAULT_DATA.features
          })
        }
      } catch (error) {
        console.error("Failed to fetch about section:", error)
        // Keep default data on error
      }
    }

    fetchAboutSection()
  }, [])

  // Get image URL (handles both API images and fallback)
  const getImageUrl = (index) => {
    if (data.images[index]) {
      return data.images[index].url
    }
    return DEFAULT_DATA.images[index]?.url || "/placeholder.png"
  }

  const getImageAlt = (index) => {
    if (data.images[index]) {
      return data.images[index].alt
    }
    return DEFAULT_DATA.images[index]?.alt || "Floral arrangement"
  }

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          {/* Image Grid */}
          <div
            className={`relative transition-all duration-700 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3 sm:space-y-4">
                <img
                  src={getImageUrl(0)}
                  alt={getImageAlt(0)}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover object-center rounded-sm"
                />
                <img
                  src={getImageUrl(1)}
                  alt={getImageAlt(1)}
                  className="w-full h-36 sm:h-40 md:h-48 object-cover object-center rounded-sm"
                />
              </div>
              <div className="pt-6 sm:pt-8">
                <img
                  src={getImageUrl(2)}
                  alt={getImageAlt(2)}
                  className="w-full h-60 sm:h-72 md:h-80 object-cover object-center rounded-sm"
                />
              </div>
            </div>
            
            {/* Floating Badge */}
            <div
              className={`absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-[#3e4026] text-white p-4 sm:p-5 md:p-6 shadow-xl rounded-sm transition-all duration-500 delay-500 ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
            >
              <p className="text-2xl sm:text-3xl font-light mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                {data.badge_number}
              </p>
              <p className="text-[10px] sm:text-xs tracking-wider uppercase">{data.badge_text}</p>
            </div>
          </div>

          {/* Content */}
          <div
            className={`space-y-5 sm:space-y-6 md:space-y-8 transition-all duration-700 delay-200 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
          >
            <div>
              <p className="text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#3e4026]/60 mb-3 sm:mb-4">
                About Us
              </p>
              <h2 
                className="text-3xl sm:text-4xl md:text-5xl text-[#3e4026] mb-4 sm:mb-5 md:mb-6 leading-tight"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {data.title_line1}
                <br />
                <span className="italic">{data.title_line2}</span>
              </h2>
            </div>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base md:text-lg">
              {data.description}
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6 pt-2 sm:pt-3 md:pt-4">
              {data.features.map((item, index) => {
                const IconComponent = ICON_MAP[item.icon] || Leaf
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2.5 sm:gap-3 transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                    style={{ transitionDelay: `${400 + index * 100}ms` }}
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#3e4026]/5 rounded-sm flex items-center justify-center shrink-0">
                      <IconComponent size={16} className="sm:w-[18px] sm:h-[18px] text-[#3e4026]" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">{item.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

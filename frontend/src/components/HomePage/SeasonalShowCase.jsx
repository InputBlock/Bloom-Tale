import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Heart, Sparkles, Gift, Play, Pause } from "lucide-react"

const API_URL = import.meta.env.VITE_API_BASE_URL || ""

export default function CategoryShowcase() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const videoContainerRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const [isPlaying, setIsPlaying] = useState(false)
  const [heroData, setHeroData] = useState(null)
  const [loading, setLoading] = useState(true)

  const features = [
    { icon: Heart, text: "Hand picked just for you." },
    { icon: Sparkles, text: "Unique flower arrangements." },
    { icon: Gift, text: "Best way to say you care." },
  ]

  // Fetch hero section data from backend
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/admin/hero`)
        const result = await response.json()
        // Handle ApiResponse format: { statusCode, data, message }
        const sections = result.data || result
        if (sections && sections.length > 0) {
          setHeroData(sections[0]) // Get the first/latest hero section
        }
      } catch (error) {
        console.error("Failed to fetch hero data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchHeroData()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleError = (e) => console.error("Video error:", e)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('error', handleError)
    }
  }, [])

  // Auto-play video when section comes into view
  useEffect(() => {
    const video = videoRef.current
    if (!video || !heroData) return

    // Create intersection observer for auto-play
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Play video when visible
            video.play().catch((err) => {
              console.log("Auto-play prevented:", err)
            })
          } else {
            // Pause video when not visible
            video.pause()
          }
        })
      },
      { threshold: 0.3 } // Trigger when 30% of video is visible
    )

    if (videoContainerRef.current) {
      observer.observe(videoContainerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [heroData])

  const togglePlay = async () => {
    const video = videoRef.current
    if (!video) return

    try {
      if (video.paused) {
        await video.play()
        setIsPlaying(true)
      } else {
        video. pause()
        setIsPlaying(false)
      }
    } catch (err) {
      console.error("Playback error:", err)
    }
  }

  return (
    <section ref={sectionRef} className="py-12 sm:py-14 md:py-16 lg:py-24 bg-[#f9f8f6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
          
          {/* Left Side - Video/Image with Play Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div ref={videoContainerRef} className="aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden bg-[#eae8e4] relative">
              {/* Check if media is video or image */}
              {heroData?.media_uri?.match(/\.(mp4|webm|mov|avi)$/i) ? (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                    preload="auto"
                    src={heroData.media_uri}
                  />
                  {/* Play/Pause Button */}
                  <button 
                    onClick={togglePlay}
                    type="button"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                    className="absolute inset-0 flex items-center justify-center group cursor-pointer"
                  >
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center shadow-lg transition-all ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                      {isPlaying ? (
                        <Pause size={18} className="sm:w-[22px] sm:h-[22px] text-[#3e4026]" />
                      ) : (
                        <Play size={18} className="sm:w-[22px] sm:h-[22px] text-[#3e4026] ml-1" />
                      )}
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                    preload="auto"
                  >
                    <source src={heroData?.media_uri || "/valentine-video.mp4"} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {/* Play/Pause Button */}
                  <button 
                    onClick={togglePlay}
                    type="button"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                    className="absolute inset-0 flex items-center justify-center group cursor-pointer"
                  >
                    <div className={`w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg transition-all ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                      {isPlaying ? (
                        <Pause size={22} className="text-[#3e4026]" />
                      ) : (
                        <Play size={22} className="text-[#3e4026] ml-1" />
                      )}
                    </div>
                  </button>
                </>
              )}
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-4 sm:space-y-5"
          >
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#3e4026] leading-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {(() => {
                const text = heroData?.surprise_text || "Surprise Your Valentine!"
                const words = text.split(" ")
                const lastWord = words.pop()
                return (
                  <>
                    {words.join(" ")} <span className="text-[#e85a5a] italic">{lastWord}</span>
                  </>
                )
              })()}
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-[#3e4026] font-medium">
              {heroData?.sub_text || "Let us arrange a smile."}
            </p>

            <p className="text-[#3e4026]/60 text-xs sm:text-sm leading-relaxed">
              {heroData?.description || "At Everbelle, we believe every bouquet tells a unique story. Our passion for flowers ensures each arrangement is crafted with meticulous care and heartfelt intention, designed to bring unparalleled joy and beauty to your most cherished moments. We hand-select the freshest blooms to create stunning displays that truly speak from the heart, making every occasion unforgettable."}
            </p>

            <div className="space-y-2.5 sm:space-y-3 pt-2 sm:pt-3">
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity:  0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-2.5 sm:gap-3"
                >
                  <feature.icon size={14} className="sm:w-4 sm:h-4 text-[#d4a5a5] flex-shrink-0" />
                  <span className="text-[#3e4026]/80 text-xs sm:text-sm">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
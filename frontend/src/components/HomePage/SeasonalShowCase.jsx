import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Heart, Sparkles, Gift, Play, Pause } from "lucide-react"

export default function CategoryShowcase() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const [isPlaying, setIsPlaying] = useState(false)

  const features = [
    { icon: Heart, text: "Hand picked just for you." },
    { icon: Sparkles, text: "Unique flower arrangements." },
    { icon: Gift, text: "Best way to say you care." },
  ]

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
    <section ref={sectionRef} className="py-16 md:py-24 bg-[#f9f8f6]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left Side - Video with Play Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#eae8e4] relative">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
                preload="auto"
              >
                <source src="/valentine-video.mp4" type="video/mp4" />
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
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-5"
          >
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl text-[#3e4026] leading-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Surprise Your <span className="text-[#e85a5a] italic">Valentine!</span>
            </h2>

            <p className="text-lg md:text-xl text-[#3e4026] font-medium">
              Let us arrange a smile. 
            </p>

            <p className="text-[#3e4026]/60 text-sm leading-relaxed">
              At Everbelle, we believe every bouquet tells a unique story. Our passion for flowers ensures each arrangement is crafted with meticulous care and heartfelt intention, designed to bring unparalleled joy and beauty to your most cherished moments.  We hand-select the freshest blooms to create stunning displays that truly speak from the heart, making every occasion unforgettable.
            </p>

            <div className="space-y-3 pt-3">
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity:  0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <feature.icon size={16} className="text-[#d4a5a5]" />
                  <span className="text-[#3e4026]/80 text-sm">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { ArrowRight, Check } from "lucide-react"

export default function Newsletter() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail("")
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-[#f9f8f6] relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/newsletter-flowers.jpg" 
          alt=""
          className="w-full h-full object-cover opacity-10"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#3e4026]/60 mb-4">
              Newsletter
            </p>
            <h2 
              className="text-4xl md:text-5xl text-[#3e4026] mb-6 leading-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Stay in <span className="italic">Bloom</span>
            </h2>
            <p className="text-gray-600 mb-10 leading-relaxed">
              Subscribe to receive exclusive offers, seasonal arrangements, 
              and floral inspiration delivered to your inbox.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-white border border-gray-200 focus:outline-none focus:border-[#3e4026] transition-colors text-[#3e4026] placeholder:text-gray-400"
              required
            />
            <motion.button
              whileHover={{ scale: isSubscribed ? 1 : 1.02 }}
              whileTap={{ scale: isSubscribed ? 1 : 0.98 }}
              type="submit"
              disabled={isSubscribed}
              className={`px-8 py-4 font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                isSubscribed
                  ? "bg-green-600 text-white"
                  : "bg-[#3e4026] text-white hover:bg-[#2d2f1c]"
              }`}
            >
              {isSubscribed ? (
                <>
                  <Check size={18} />
                  <span>Subscribed</span>
                </>
              ) : (
                <>
                  <span>Subscribe</span>
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xs text-gray-400 mt-6"
          >
            No spam, ever. Unsubscribe anytime.
          </motion.p>
        </div>
      </div>
    </section>
  )
}

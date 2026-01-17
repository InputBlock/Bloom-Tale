import { motion, AnimatePresence } from "framer-motion"
import { XCircle, X } from "lucide-react"

// SVG Flower Components
const Rose = ({ className, style }) => (
  <svg viewBox="0 0 64 64" className={className} style={style}>
    <ellipse cx="32" cy="28" rx="14" ry="12" fill="#f4b8c5" />
    <ellipse cx="26" cy="24" rx="8" ry="9" fill="#f9d1da" />
    <ellipse cx="38" cy="24" rx="8" ry="9" fill="#f9d1da" />
    <ellipse cx="32" cy="20" rx="6" ry="7" fill="#fce4e9" />
    <ellipse cx="32" cy="32" rx="10" ry="8" fill="#e8a0b0" />
    <path d="M32 40 L32 58" stroke="#7d9a6a" strokeWidth="3" strokeLinecap="round" />
    <ellipse cx="26" cy="50" rx="6" ry="3" fill="#a8c899" transform="rotate(-30 26 50)" />
    <ellipse cx="38" cy="52" rx="5" ry="2.5" fill="#a8c899" transform="rotate(25 38 52)" />
  </svg>
)

const Tulip = ({ className, style }) => (
  <svg viewBox="0 0 64 64" className={className} style={style}>
    <ellipse cx="32" cy="22" rx="10" ry="16" fill="#f9d1da" />
    <ellipse cx="26" cy="20" rx="6" ry="14" fill="#f4b8c5" />
    <ellipse cx="38" cy="20" rx="6" ry="14" fill="#f4b8c5" />
    <ellipse cx="32" cy="18" rx="4" ry="10" fill="#fce4e9" />
    <path d="M32 36 L32 58" stroke="#7d9a6a" strokeWidth="3" strokeLinecap="round" />
    <ellipse cx="28" cy="48" rx="8" ry="3" fill="#a8c899" transform="rotate(-20 28 48)" />
  </svg>
)

const Daisy = ({ className, style }) => (
  <svg viewBox="0 0 64 64" className={className} style={style}>
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <ellipse
        key={i}
        cx="32"
        cy="18"
        rx="5"
        ry="12"
        fill="#fef9f0"
        transform={`rotate(${angle} 32 32)`}
      />
    ))}
    <circle cx="32" cy="32" r="8" fill="#f7e4a3" />
    <path d="M32 42 L32 58" stroke="#7d9a6a" strokeWidth="3" strokeLinecap="round" />
    <ellipse cx="36" cy="50" rx="6" ry="3" fill="#a8c899" transform="rotate(15 36 50)" />
  </svg>
)

const Basket = ({ className }) => (
  <svg viewBox="0 0 120 80" className={className}>
    {/* Basket body */}
    <ellipse cx="60" cy="70" rx="50" ry="8" fill="#c9a66b" />
    <path
      d="M15 35 Q10 70 20 70 L100 70 Q110 70 105 35 Z"
      fill="#d4b07a"
    />
    {/* Wicker pattern */}
    {[25, 40, 55, 70, 85].map((x, i) => (
      <path
        key={i}
        d={`M${x} 35 Q${x + 5} 52 ${x} 68`}
        stroke="#b8956a"
        strokeWidth="2"
        fill="none"
      />
    ))}
    {[42, 52, 62].map((y, i) => (
      <path
        key={i}
        d={`M20 ${y} Q60 ${y + 5} 100 ${y}`}
        stroke="#b8956a"
        strokeWidth="1.5"
        fill="none"
      />
    ))}
    {/* Basket rim */}
    <ellipse cx="60" cy="35" rx="46" ry="6" fill="#c9a66b" />
    <ellipse cx="60" cy="33" rx="44" ry="5" fill="#e0c99a" />
    {/* Handle */}
    <path
      d="M25 33 Q25 5 60 5 Q95 5 95 33"
      stroke="#c9a66b"
      strokeWidth="6"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M25 33 Q25 8 60 8 Q95 8 95 33"
      stroke="#e0c99a"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
)

// Flower animation configurations
const flowers = [
  { Component: Rose, startX: -60, startY: -80, endX: -15, endY: 5, rotation: -15, delay: 0.1, scale: 0.7 },
  { Component: Tulip, startX: 60, startY: -100, endX: 15, endY: 0, rotation: 10, delay: 0.25, scale: 0.65 },
  { Component: Daisy, startX: 0, startY: -120, endX: 0, endY: -5, rotation: 5, delay: 0.4, scale: 0.6 },
]

export default function SuccessModal({ isOpen, message, type = "success", onClose }) {
  const isCartSuccess = type === "success" && (message?.toLowerCase().includes("cart") || message?.toLowerCase().includes("added"))

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25 
            }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className={`relative rounded-3xl shadow-2xl overflow-hidden ${
              isCartSuccess 
                ? "bg-gradient-to-b from-[#fdfcfa] to-[#f8f5f0] border border-[#e8e4dd]" 
                : type === "success"
                  ? "bg-white border-2 border-green-400"
                  : "bg-white border-2 border-red-400"
            }`}
            style={{
              width: isCartSuccess ? '320px' : '380px',
              boxShadow: isCartSuccess 
                ? '0 25px 60px -12px rgba(0, 0, 0, 0.15), 0 0 40px -10px rgba(244, 184, 197, 0.3)'
                : undefined
            }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-20"
              >
                <X size={20} />
              </button>

              {isCartSuccess ? (
                /* Cart Success Animation */
                <div className="px-8 pt-10 pb-8">
                  {/* Animation Container */}
                  <div className="relative h-44 flex items-end justify-center mb-4">
                    {/* Floating Flowers */}
                    {flowers.map(({ Component, startX, startY, endX, endY, rotation, delay, scale }, index) => (
                      <motion.div
                        key={index}
                        initial={{ 
                          x: startX, 
                          y: startY, 
                          opacity: 0, 
                          rotate: rotation - 20,
                          scale: scale * 0.8
                        }}
                        animate={{ 
                          x: endX, 
                          y: endY, 
                          opacity: 1, 
                          rotate: rotation,
                          scale: scale
                        }}
                        transition={{
                          delay: delay,
                          duration: 0.8,
                          ease: [0.34, 1.56, 0.64, 1], // Custom bounce easing
                        }}
                        className="absolute"
                        style={{ 
                          bottom: '35px',
                          left: '50%',
                          marginLeft: '-20px'
                        }}
                      >
                        <motion.div
                          animate={{ 
                            y: [0, -3, 0],
                          }}
                          transition={{
                            delay: delay + 0.8,
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Component className="w-10 h-10" />
                        </motion.div>
                      </motion.div>
                    ))}

                    {/* Basket */}
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ 
                        duration: 0.5, 
                        ease: [0.22, 1, 0.36, 1]
                      }}
                    >
                      <Basket className="w-28 h-20" />
                    </motion.div>

                    {/* Subtle glow behind basket */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 0.5, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="absolute bottom-2 w-32 h-8 bg-[#f4b8c5]/20 rounded-full blur-xl"
                    />
                  </div>

                  {/* Text with fade-up animation */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.7, 
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="text-center"
                  >
                    <h3 
                      className="text-xl font-medium text-[#3e4026] mb-1"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      Added to Cart
                    </h3>
                    <p className="text-sm text-[#7a7a7a]">
                      Your beautiful blooms await
                    </p>
                  </motion.div>

                  {/* Elegant progress bar */}
                  <motion.div
                    className="mt-6 h-0.5 bg-[#e8e4dd] rounded-full overflow-hidden"
                  >
                    <motion.div
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: 2.5, ease: "linear" }}
                      className="h-full bg-gradient-to-r from-[#f4b8c5] via-[#a8c899] to-[#f4b8c5] rounded-full"
                    />
                  </motion.div>
                </div>
              ) : (
                /* Standard Success/Error Modal */
                <div className="p-8">
                  <div className="flex justify-center mb-4">
                    {type === "success" ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
                      >
                        <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      >
                        <XCircle size={64} className="text-red-500" />
                      </motion.div>
                    )}
                  </div>

                  <h3 className={`text-2xl font-bold text-center mb-2 ${
                    type === "success" ? "text-green-700" : "text-red-700"
                  }`}>
                    {type === "success" ? "Success!" : "Error"}
                  </h3>
                  <p className="text-gray-600 text-center text-lg">
                    {message}
                  </p>

                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 3, ease: "linear" }}
                    className={`h-1 mt-6 rounded-full ${
                      type === "success" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

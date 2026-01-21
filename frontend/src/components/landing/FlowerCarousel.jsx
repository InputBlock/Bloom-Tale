import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Petal colors - soft pink, rose, and cream tones
const petalColors = [
  "rgba(255, 182, 193, 0.85)",
  "rgba(255, 218, 233, 0.8)",
  "rgba(255, 200, 200, 0.75)",
  "rgba(252, 228, 236, 0.85)",
  "rgba(255, 192, 203, 0.8)",
  "rgba(255, 240, 245, 0.75)",
];
// Petal component with wind-like motion animation
const Petal = ({ id, x, y, color, size, rotation, delay, driftX, driftY, rotateAmount, duration, swayAmount, onComplete }) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size * 1.3,
        background: `radial-gradient(ellipse at 30% 30%, ${color}, transparent 70%)`,
        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        boxShadow: `inset 0 0 ${size/4}px rgba(255,255,255,0.3)`,
      }}
      initial={{ 
        opacity: 0, 
        scale: 0,
        rotate: rotation,
        x: 0,
        y: 0 
      }}
      animate={{ 
        opacity: [0, 1, 0.9, 0.7, 0.4, 0],
        scale: [0.3, 1, 1.05, 0.95, 0.8, 0.4],
        rotate: rotation + rotateAmount,
        x: [0, swayAmount * 0.4, -swayAmount * 0.25, swayAmount * 0.3, driftX],
        y: [0, driftY * 0.2, driftY * 0.45, driftY * 0.7, driftY],
      }}
      transition={{ 
        duration: duration,
        delay: delay,
        ease: "easeOut",
        opacity: { duration: duration, times: [0, 0.1, 0.3, 0.55, 0.8, 1] },
        scale: { duration: duration, times: [0, 0.15, 0.4, 0.65, 0.85, 1] },
        x: { duration: duration, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" },
        y: { duration: duration, ease: "easeOut" },
        rotate: { duration: duration, ease: "easeInOut" },
      }}
      onAnimationComplete={() => onComplete(id)}
    />
  );
};

// Import flower images
import flowersCouples from "../../assets/flowers-couples.jpg";
import flowersCorporate from "../../assets/flowers-corporate.jpg";
import flowersCelebration from "../../assets/flowers-celebration.jpg";
import flowersGifting from "../../assets/flowers-gifting.jpg";

// Import scene images
import sceneCouples from "../../assets/scene-couples.jpg";
import sceneCorporate from "../../assets/scene-corporate.jpg";
import sceneCelebration from "../../assets/scene-celebration.jpg";
import sceneGifting from "../../assets/scene-gifting.jpg";


const categories = [
  {
    id: "couples",
    name: "For Couples",
    tagline: "Love in Bloom",
    description: "Express your heart with roses that speak louder than words",
    flowerImage: flowersCouples,
    sceneImage: sceneCouples,
  },
  {
    id: "corporate",
    name: "Corporate",
    tagline: "Elegance & Grace",
    description: "Sophisticated arrangements for professional moments",
    flowerImage: flowersCorporate,
    sceneImage: sceneCorporate,
  },
  {
    id: "celebration",
    name: "Celebration",
    tagline: "Joy Unfolded",
    description: "Vibrant blooms to make every celebration memorable",
    flowerImage: flowersCelebration,
    sceneImage: sceneCelebration,
  },
  {
    id: "gifting",
    name: "Gifting",
    tagline: "Moments to Cherish",
    description: "Thoughtful arrangements that say what words cannot",
    flowerImage: flowersGifting,
    sceneImage: sceneGifting,
  },
];

const FlowerCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [petals, setPetals] = useState([]);
  const containerRef = useRef(null);
  const lastPetalTime = useRef(0);
  const petalIdCounter = useRef(0);

  // Remove petal when animation completes
  const removePetal = useCallback((id) => {
    setPetals(prev => prev.filter(p => p.id !== id));
  }, []);

  // Handle mouse move to create petal effects
  const handleMouseMove = useCallback((e) => {
    const now = Date.now();
    if (now - lastPetalTime.current < 50) return; // Throttle to every 50ms
    lastPetalTime.current = now;

    if (petals.length > 80) return; // Limit petals to prevent lag

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create 3-5 petals at once
    const petalCount = Math.floor(Math.random() * 3) + 3;
    const newPetals = [];

    for (let i = 0; i < petalCount; i++) {
      const id = petalIdCounter.current++;
      const color = petalColors[Math.floor(Math.random() * petalColors.length)];
      const size = Math.random() * 16 + 8;
      const rotation = Math.random() * 360;
      const offsetX = (Math.random() - 0.5) * 40;
      const offsetY = (Math.random() - 0.5) * 40;
      const driftX = (Math.random() - 0.5) * 120;
      const driftY = Math.random() * 100 + 60;
      const rotateAmount = (Math.random() - 0.5) * 200;
      const duration = 3 + Math.random() * 1.5;
      const swayAmount = (Math.random() - 0.5) * 50;

      newPetals.push({
        id,
        x: x + offsetX - size / 2,
        y: y + offsetY - size / 2,
        color,
        size,
        rotation,
        delay: i * 0.05,
        driftX,
        driftY,
        rotateAmount,
        duration,
        swayAmount,
      });
    }

    setPetals(prev => [...prev, ...newPetals]);
  }, [petals.length]);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % categories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % categories.length);
  };

  const getCardPosition = (index) => {
    const diff = (index - activeIndex + categories.length) % categories.length;
    const positions = [
      { x: 0, y: 0, scale: 0.75, opacity: 0.6, rotate: -15, zIndex: 1 }, // Far left
      { x: -280, y: 20, scale: 0.85, opacity: 0.8, rotate: -8, zIndex: 2 }, // Left
      { x: 280, y: 20, scale: 0.85, opacity: 0.8, rotate: 8, zIndex: 2 }, // Right
      { x: 0, y: 0, scale: 0.75, opacity: 0.6, rotate: 15, zIndex: 1 }, // Far right
    ];

    if (categories.length === 4) {
      if (diff === 0) return { x: 0, y: -30, scale: 1, opacity: 1, rotate: 0, zIndex: 10 }; // Active behind glass
      if (diff === 1) return { x: 320, y: 40, scale: 0.75, opacity: 0.85, rotate: 12, zIndex: 3 };
      if (diff === 2) return { x: 0, y: 80, scale: 0.65, opacity: 0.5, rotate: 0, zIndex: 1 };
      if (diff === 3) return { x: -320, y: 40, scale: 0.75, opacity: 0.85, rotate: -12, zIndex: 3 };
    }

    return positions[diff % 4];
  };

  const activeCategory = categories[activeIndex];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen flex flex-col overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#fbf0d2,)]" />
      
      {/* Petal cursor trail effect */}
      <div className="absolute inset-0 bg-[#fff9e8] pointer-events-none z-0 overflow-hidden">
        {petals.map((petal) => (
          <Petal key={petal.id} {...petal} onComplete={removePetal} />
        ))}
      </div>

      {/* Logo Banner - Compact for mobile */}
      <div className="relative w-full h-sm:h-24 md:h-32 lg:h-40">
        <div className="bg h-25 sm:h-24 md:h-32 lg:h-43 w-32 sm:w-40 md:w-52 lg:w-60 rounded-b-xl sm:rounded-b-2xl md:rounded-b-3xl drop-shadow-sm ml-2 sm:ml-4 md:ml-6 lg:ml-10 flex items-center justify-center">
          <img src="/BloomTaleLogopng(500x350px).png" alt="BloomTale Logo" className="w-full h-full object-contain" />
        </div>
      </div>
      

      {/* Carousel Container */}
      <div className="relative w-full max-w-6xl mb-4 sm:mb-6 md:mb-8 lg:mb-10 mx-auto px-2 sm:px-4">
        {/* Flower Cards Circle - Hidden on mobile for cleaner UI */}
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-105 flex items-center justify-center carousel-container">
          {/* Background Flower Cards - Hide on mobile */}
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="absolute cursor-pointer hidden sm:block"
              initial={false}
              animate={getCardPosition(index)}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.6,
              }}
              onClick={() => {
                setIsAutoPlaying(false);
                setActiveIndex(index);
              }}
            >
              <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-2 sm:p-2.5 md:p-3 lg:p-4 shadow-lg transition-all duration-300">
                <div className="w-16 h-20 sm:w-20 sm:h-24 md:w-28 md:h-36 lg:w-40 lg:h-48 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden bg-gray-100 mb-1.5 sm:mb-2 md:mb-3">
                  <img
                    src={category.flowerImage}
                    alt={category.name}
                    className="w-full h-full object-cover object-[center_20%]"
                  />
                </div>
                <p className="text-gray-800 text-[10px] sm:text-xs md:text-sm font-sans text-center">
                  {category.name}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Central Showcase Card - Smaller on mobile */}
          <motion.div
            className="absolute z-20 w-60 h-80 mt-30 md:mt-0 sm:w-64 sm:h-80 md:w-72 md:h-96 lg:w-80 lg:h-110"
            initial={{ opacity: 1, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-[#FBF8F3] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden h-full shadow-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.5 }}
                  className="h-full flex flex-col"
                >
                  {/* Scene Image - Adjusted height for mobile */}
                  <div className="relative h-50 sm:h-40 md:h-52 lg:h-64 overflow-hidden rounded-t-xl sm:rounded-t-2xl md:rounded-t-3xl">
                    <img
                      src={activeCategory.sceneImage}
                      alt={activeCategory.tagline}
                      className="w-full h-full object-cover object-[center_20%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FBF8F3]/90" />
                  </div>

                  {/* Content - Compact for mobile */}
                  <div className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-center text-center bg-[#FBF8F3]">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-500 mb-1 sm:mb-1.5 md:mb-2 font-medium"
                    >
                      {activeCategory.name}
                    </motion.span>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-xl sm:text-2xl md:text-[28px] lg:text-3xl font-serif text-[#5e6043] mb-1.5 sm:mb-2 md:mb-3 leading-tight"
                    >
                      {activeCategory.tagline}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-[11px] sm:text-xs md:text-sm text-[#5e6043ac] leading-relaxed px-1 sm:px-2"
                    >
                      {activeCategory.description}
                    </motion.p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Navigation - Compact for mobile */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 mt-28 sm:mt-6 md:mt">
          <button
            onClick={handlePrev}
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white hover:bg-gray-50 active:scale-95 flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110"
            aria-label="Previous category"
          >
            <ChevronLeft className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-700" />
          </button>

          {/* Dots indicator */}
          <div className="flex gap-1.5 sm:gap-2">
            {categories.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setActiveIndex(index);
                }}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${index === activeIndex
                    ? "w-5 sm:w-6 md:w-8 bg-[#6B7C59]"
                    : "w-1.5 sm:w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                aria-label={`Go to category ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white hover:bg-gray-50 active:scale-95 flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110"
            aria-label="Next category"
          >
            <ChevronRight className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-700" />
          </button>
        </div>

        {/* CTA Button - Compact for mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mt-5 sm:mt-6 md:mt-8 lg:mt-10"
        >
          <motion.button
            onClick={() => window.location.href = '/home'}
            className="group relative px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3.5 lg:px-10 lg:py-4 bg-gradient-to-r from-[#5d6c4e] to-[#6b7c59] text-white rounded-full font-semibold text-xs sm:text-sm md:text-base tracking-wide overflow-hidden cursor-pointer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {/* Soft glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#6b7c59]/20 to-[#7a8c68]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            {/* Button shadow layers */}
            <div className="absolute inset-0 rounded-full shadow-[0_4px_20px_rgba(93,108,78,0.3)] group-hover:shadow-[0_8px_30px_rgba(93,108,78,0.5)] transition-all duration-300" />
            
            {/* Button text with icon */}
            <span className="relative flex items-center justify-center gap-2">
              <span className="drop-shadow-sm">Explore BloomTale</span>
              <svg 
                className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Footer - Compact for mobile */}
      <footer className="relative w-full bg-[#5d6c4e] text-white pt-6 sm:pt-8 md:pt-12 lg:pt-16 pb-4 sm:pb-6 md:pb-8 mt-auto">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-10 lg:gap-12 mb-4 sm:mb-6 md:mb-10 lg:mb-12">
            {/* Bloom Info */}
            <div>
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-serif mb-2 sm:mb-3 md:mb-4">Bloom Tale</h3>
              <p className="text-xs sm:text-sm md:text-base text-white/80 leading-relaxed">
                Every flower tells a story. We craft emotional connections through nature's beautiful arrangements.
              </p>
            </div>

            {/* Connect */}
            <div className="sm:ml-auto">
              <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3 md:mb-4">CONNECT</h3>
              <p className="text-xs sm:text-sm md:text-base text-white/80 mb-2 sm:mb-3 md:mb-4">thebloomtale0@gmail.com</p>
              <div className="flex gap-2 sm:gap-3 md:gap-4">
                {/* <a href="#" className="text-white/80 hover:text-white active:scale-95 transition-all">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a> */}
                <a href="https://www.instagram.com/bloomtale1?igsh=cGJmemNiNHk5N2tz" className="text-white/80 hover:text-white active:scale-95 transition-all">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://x.com/bloom_tale" className="text-white/80 hover:text-white active:scale-95 transition-all">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-3 sm:pt-4 md:pt-6 lg:pt-8 flex flex-col md:flex-row justify-between items-center gap-1.5 sm:gap-2 md:gap-3 text-[10px] sm:text-xs md:text-sm text-white/70">
            <p className="text-center md:text-left">© 2026 Bloomz. All rights reserved.</p>
            <p className="text-center md:text-right">Made with ❤️ for flowers</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FlowerCarousel;

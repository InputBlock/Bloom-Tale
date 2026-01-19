import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Petal colors - soft pink, rose, and cream tones (higher opacity)
const petalColors = [
  "rgba(255, 182, 193, 0.85)", // light pink
  "rgba(255, 218, 233, 0.8)", // soft rose
  "rgba(255, 200, 200, 0.75)", // blush
  "rgba(252, 228, 236, 0.85)", // cream pink
  "rgba(255, 192, 203, 0.8)", // pink
  "rgba(255, 240, 245, 0.75)", // lavender blush
];

// Leaf colors - soft green tones
const leafColors = [
  "rgba(144, 169, 129, 0.7)",
  "rgba(156, 181, 141, 0.65)",
  "rgba(169, 193, 154, 0.6)",
];



// Petal component using CSS shapes - soft wind-like motion
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

// Leaf component
const Leaf = ({ id, x, y, color, size, rotation, delay, driftX, driftY, rotateAmount, duration, swayAmount, onComplete }) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size * 1.5,
        background: `radial-gradient(ellipse at 40% 30%, ${color}, transparent 65%)`,
        borderRadius: '40% 60% 40% 60%',
      }}
      initial={{ 
        opacity: 0, 
        scale: 0,
        rotate: rotation,
        x: 0,
        y: 0 
      }}
      animate={{ 
        opacity: [0, 0.8, 0.6, 0.4, 0],
        scale: [0.3, 1, 0.95, 0.8, 0.4],
        rotate: rotation + rotateAmount,
        x: [0, swayAmount * 0.3, -swayAmount * 0.2, driftX],
        y: [0, driftY * 0.3, driftY * 0.6, driftY],
      }}
      transition={{ 
        duration: duration,
        delay: delay,
        ease: "easeOut",
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
  const [leaves, setLeaves] = useState([]);
  const containerRef = useRef(null);
  const lastPetalTime = useRef(0);
  const petalIdCounter = useRef(0);
  const leafIdCounter = useRef(0);

  // Remove petal when animation completes
  const removePetal = useCallback((id) => {
    setPetals(prev => prev.filter(p => p.id !== id));
  }, []);

  // Remove leaf when animation completes
  const removeLeaf = useCallback((id) => {
    setLeaves(prev => prev.filter(l => l.id !== id));
  }, []);

  // Handle mouse move to create petals and leaves
  const handleMouseMove = useCallback((e) => {
    const now = Date.now();
    // Create petals every 50ms
    if (now - lastPetalTime.current < 50) return;
    lastPetalTime.current = now;

    // Limit maximum petals and leaves to prevent lag
    if (petals.length > 100 || leaves.length > 40) return;

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
      const size = Math.random() * 16 + 8; // 8-24px size (cute small petals)
      const rotation = Math.random() * 360;
      const offsetX = (Math.random() - 0.5) * 40;
      const offsetY = (Math.random() - 0.5) * 40;
      // Pre-compute random animation values for smooth wind effect
      const driftX = (Math.random() - 0.5) * 120; // Horizontal drift
      const driftY = Math.random() * 100 + 60; // Float downward 60-160px
      const rotateAmount = (Math.random() - 0.5) * 200; // Gentle rotation
      const duration = 3 + Math.random() * 1.5; // 3-4.5 seconds
      const swayAmount = (Math.random() - 0.5) * 50; // Wind sway

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

    // Add 1-2 leaves occasionally (30% chance)
    if (Math.random() < 0.3) {
      const leafCount = Math.floor(Math.random() * 2) + 1;
      const newLeaves = [];

      for (let i = 0; i < leafCount; i++) {
        const id = leafIdCounter.current++;
        const color = leafColors[Math.floor(Math.random() * leafColors.length)];
        const size = Math.random() * 14 + 10; // 10-24px
        const rotation = Math.random() * 360;
        const offsetX = (Math.random() - 0.5) * 50;
        const offsetY = (Math.random() - 0.5) * 50;
        const driftX = (Math.random() - 0.5) * 100;
        const driftY = Math.random() * 120 + 70;
        const rotateAmount = (Math.random() - 0.5) * 180;
        const duration = 3.5 + Math.random() * 1.5;
        const swayAmount = (Math.random() - 0.5) * 60;

        newLeaves.push({
          id,
          x: x + offsetX - size / 2,
          y: y + offsetY - size / 2,
          color,
          size,
          rotation,
          delay: i * 0.08,
          driftX,
          driftY,
          rotateAmount,
          duration,
          swayAmount,
        });
      }

      setLeaves(prev => [...prev, ...newLeaves]);
    }
  }, [petals.length, leaves.length]);

  // Auto-rotate every 5 seconds
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#efefef,#ede0c0)]" />
      
      {/* Petal and leaf cursor trail effect - in background behind everything */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {petals.map((petal) => (
          <Petal
            key={petal.id}
            {...petal}
            onComplete={removePetal}
          />
        ))}
        {leaves.map((leaf) => (
          <Leaf
            key={leaf.id}
            {...leaf}
            onComplete={removeLeaf}
          />
        ))}
      </div>

      {/* Top banner */}
      <div className="relative w-full h-32 sm:h-36 md:h-40 flex flex-row">
        <div className="bg h-32 sm:h-36 md:h-43 w-44 sm:w-52 md:w-60 rounded-b-2xl sm:rounded-b-3xl md:rounded-b-4xl drop-shadow-sm ml-4 sm:ml-6 md:ml-10 flex items-center justify-center">
          <img src="/BloomTaleLogopng(500x350px).png" alt="BloomTale Logo" className="w-full h-full object-contain" />
        </div>
      </div>
      

      {/* Carousel Container */}
      <div className="relative w-full max-w-6xl mb-6 sm:mb-8 md:mb-10 mx-auto px-2 sm:px-4">
        {/* Flower Cards Circle */}
        <div className="relative h-80 sm:h-96 md:h-105 flex items-center justify-center carousel-container">
          {/* Background Flower Cards */}
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="absolute cursor-pointer"
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
              <div className="bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 md:p-4 shadow-lg transition-all duration-300">
                <div className="w-20 h-24 sm:w-28 sm:h-36 md:w-32 md:h-40 lg:w-40 lg:h-48 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 mb-2 sm:mb-3">
                  <img
                    src={category.flowerImage}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-gray-800 text-xs sm:text-sm md:text-medium font-sans text-center">
                  {category.name}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Central Showcase Card */}
          <motion.div
            className="absolute z-20 w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-110"
            initial={{ opacity: 1, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-[#FBF8F3] rounded-2xl sm:rounded-3xl overflow-hidden h-full shadow-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.5 }}
                  className="h-full flex flex-col"
                >
                  {/* Scene Image */}
                  <div className="relative h-44 sm:h-56 md:h-64 overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
                    <img
                      src={activeCategory.sceneImage}
                      alt={activeCategory.tagline}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#FBF8F3]" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-center text-center bg-[#FBF8F3]">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-medium"
                    >
                      {activeCategory.name}
                    </motion.span>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl md:text-[28px] font-serif text-[#5e6043] mb-3 leading-tight"
                    >
                      {activeCategory.tagline}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-sm text-[#5e6043ac] leading-relaxed px-2"
                    >
                      {activeCategory.description}
                    </motion.p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
          <button
            onClick={handlePrev}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-gray-50 active:scale-95 flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110"
            aria-label="Previous category"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </button>

          {/* Dots indicator */}
          <div className="flex gap-2">
            {categories.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setActiveIndex(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex
                    ? "w-8 bg-[#6B7C59]"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                aria-label={`Go to category ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-gray-50 active:scale-95 flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110"
            aria-label="Next category"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </button>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mt-8 sm:mt-10"
        >
          <button 
            onClick={() => window.location.href = '/home'}
            className="px-6 py-2.5 sm:px-8 sm:py-3 bg-[#5d6c4e] text-white rounded-full font-medium text-sm sm:text-base tracking-wide hover:bg-[#5A6B4A] active:scale-95 transition-all duration-300 hover:scale-105 shadow-md cursor-pointer">
            Explore BloomTale 
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative w-full bg-[#5d6c4e] text-white pt-10 sm:pt-12 md:pt-16 pb-6 sm:pb-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-10 md:mb-12">
            {/* Bloom Info */}
            <div>
              <h3 className="text-xl sm:text-2xl font-serif mb-3 sm:mb-4">Bloom Info</h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                Every flower tells a story. We craft emotional connections through nature's beautiful arrangements.
              </p>
            </div>

            {/* Explore */}
            <div>
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3 sm:mb-4">EXPLORE</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm sm:text-base text-white/80 hover:text-white transition-colors inline-block py-0.5">About Us</a></li>
                <li><a href="#" className="text-sm sm:text-base text-white/80 hover:text-white transition-colors inline-block py-0.5">Categories</a></li>
                <li><a href="#" className="text-sm sm:text-base text-white/80 hover:text-white transition-colors inline-block py-0.5">Subscription</a></li>
                <li><a href="#" className="text-sm sm:text-base text-white/80 hover:text-white transition-colors inline-block py-0.5">Collaboration</a></li>
                <li><a href="#" className="text-sm sm:text-base text-white/80 hover:text-white transition-colors inline-block py-0.5">Gallery</a></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3 sm:mb-4">CONNECT</h3>
              <p className="text-sm sm:text-base text-white/80 mb-3 sm:mb-4">hello@bloomz.com</p>
              <div className="flex gap-3 sm:gap-4">
                <a href="#" className="text-white/80 hover:text-white active:scale-95 transition-all">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="text-white/80 hover:text-white active:scale-95 transition-all">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="text-white/80 hover:text-white active:scale-95 transition-all">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/70">
            <p className="text-center md:text-left">© 2026 Bloomz. All rights reserved.</p>
            <p className="text-center md:text-right">Made with ❤️ for flowers</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FlowerCarousel;

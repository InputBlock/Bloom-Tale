import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="relative w-full min-h-screen flex flex-col  overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#efefef,#ede0c0)]" />

      {/* Top banner */}
      <div className="relative w-full h-40 flex flex-row ">
        <div className="text-[#5d6c4e] text-sm font-bold md:text-4xl/tight p-5 pl-6 w-200" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Choose the moment you want to Enhance with flowers
        </div>
        <div className="bg-white h-43 w-55 rounded-b-4xl drop-shadow-sm ml-115 flex items-center justify-center ">
          <img src="/BloomTaleLogopng(500x350px).png" alt="BloomTale Logo" className="w-full h-full object-contain" />
        </div>
      </div>
      

      {/* Carousel Container */}
      <div className="relative w-full max-w-6xl mb-10 mx-auto px-4">
        {/* Flower Cards Circle */}
        <div className="relative h-105 flex items-center justify-center carousel-container">
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
              <div className="bg-white rounded-3xl p-4 shadow-lg transition-all duration-300">
                <div className="w-32 h-40 md:w-40 md:h-48 rounded-2xl overflow-hidden bg-gray-100 mb-3">
                  <img
                    src={category.flowerImage}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-gray-800 text-medium font-sans text-center">
                  {category.name}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Central Showcase Card */}
          <motion.div
            className="absolute z-20 w-72 h-96 md:w-80 md:h-[450px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-[#FBF8F3] rounded-3xl overflow-hidden h-full shadow-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="h-full flex flex-col"
                >
                  {/* Scene Image */}
                  <div className="relative h-56 md:h-64 overflow-hidden rounded-t-3xl">
                    <img
                      src={activeCategory.sceneImage}
                      alt={activeCategory.tagline}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FBF8F3]/80" />
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
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110"
            aria-label="Previous category"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
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
            className="w-12 h-12 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110"
            aria-label="Next category"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mt-10"
        >
          <button 
            onClick={() => window.location.href = '/home'}
            className="px-8 py-3 bg-[#5d6c4e] text-white rounded-full font-medium text-sm tracking-wide hover:bg-[#5A6B4A] transition-all duration-300 hover:scale-105 shadow-md cursor-pointer"
          >
            Explore BloomTale
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative w-full bg-[#5d6c4e] text-white pt-16 pb-8 mt-auto">
        <div className="max-w-6xl mx-auto px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Bloom Info */}
            <div>
              <h3 className="text-2xl font-serif mb-4">Bloom Info</h3>
              <p className="text-white/80 leading-relaxed">
                Every flower tells a story. We craft emotional connections through nature's beautiful arrangements.
              </p>
            </div>

            {/* Explore */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">EXPLORE</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Categories</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Subscription</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Collaboration</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Gallery</a></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">CONNECT</h3>
              <p className="text-white/80 mb-4">hello@bloomz.com</p>
              <div className="flex gap-4">
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/70">
            <p>© 2026 Bloomz. All rights reserved.</p>
            <p>Made with ❤️ for flowers</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FlowerCarousel;

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
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-8">
      {/* Background linear */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#fffdf8,#e9e5d7)]" />
      
      {/* Decorative circles */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />

      {/* Carousel Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
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
                <p className="text-gray-800 text-sm font-serif text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {category.name}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Central Showcase Card */}
          <motion.div
            className="absolute z-20 w-72 h-96 md:w-80 md:h-112.5"
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
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#FBF8F3]/80" />
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
                      className="text-3xl md:text-4xl font-serif text-gray-800 mb-3 leading-tight"
                    >
                      {activeCategory.tagline}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-sm text-gray-600 leading-relaxed px-2"
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
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
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
          <button className="px-8 py-3 bg-[#6B7C59] text-white rounded-full font-medium text-sm tracking-wide hover:bg-[#5A6B4A] transition-all duration-300 hover:scale-105 shadow-md">
            Explore {activeCategory.name}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default FlowerCarousel;

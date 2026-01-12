import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import flower images
import flowersCouples from "@/assets/flowers-couples.jpg";
import flowersCorporate from "@/assets/flowers-corporate.jpg";
import flowersCelebration from "@/assets/flowers-celebration.jpg";
import flowersGifting from "@/assets/flowers-gifting.jpg";

// Import scene images
import sceneCouples from "@/assets/scene-couples.jpg";
import sceneCorporate from "@/assets/scene-corporate.jpg";
import sceneCelebration from "@/assets/scene-celebration.jpg";
import sceneGifting from "@/assets/scene-gifting.jpg";

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
      { x: 0, y: 0, scale: 0.75, opacity: 0.6, rotate: -15, zIndex: 1 },
      { x: -280, y: 20, scale: 0.85, opacity: 0.8, rotate: -8, zIndex: 2 },
      { x: 280, y: 20, scale: 0.85, opacity: 0.8, rotate: 8, zIndex: 2 },
      { x: 0, y: 0, scale: 0.75, opacity: 0.6, rotate: 15, zIndex: 1 },
    ];

    if (categories.length === 4) {
      if (diff === 0) return { x: 0, y: -30, scale: 1, opacity: 1, rotate: 0, zIndex: 10 };
      if (diff === 1) return { x: 320, y: 40, scale: 0.75, opacity: 0.85, rotate: 12, zIndex: 3 };
      if (diff === 2) return { x: 0, y: 80, scale: 0.65, opacity: 0.5, rotate: 0, zIndex: 1 };
      if (diff === 3) return { x: -320, y: 40, scale: 0.75, opacity: 0.85, rotate: -12, zIndex: 3 };
    }

    return positions[diff % 4];
  };

  const activeCategory = categories[activeIndex];

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-background to-background" />
      
      {/* Decorative circles */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />

      {/* Carousel Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
        {/* Flower Cards Circle */}
        <div className="relative h-[420px] flex items-center justify-center carousel-container">
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
              <div
                className={`w-40 h-48 md:w-48 md:h-56 rounded-2xl overflow-hidden shadow-card bg-card transition-all duration-300 ${
                  index === activeIndex ? "ring-2 ring-primary/30" : ""
                }`}
              >
                <img
                  src={category.flowerImage}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent p-3">
                  <p className="text-card text-sm font-medium">{category.name}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Central Glass Showcase Card */}
          <motion.div
            className="absolute z-20 w-72 h-96 md:w-80 md:h-[420px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass-card rounded-3xl overflow-hidden h-full pulse-glow">
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
                  <div className="relative h-56 md:h-64 overflow-hidden">
                    <img
                      src={activeCategory.sceneImage}
                      alt={activeCategory.tagline}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col justify-center text-center">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-xs uppercase tracking-widest text-muted-foreground mb-1"
                    >
                      {activeCategory.name}
                    </motion.span>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl md:text-3xl font-display text-foreground mb-2"
                    >
                      {activeCategory.tagline}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-sm text-muted-foreground leading-relaxed"
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
            className="w-12 h-12 rounded-full bg-card hover:bg-secondary flex items-center justify-center shadow-soft transition-all duration-300 hover:scale-110"
            aria-label="Previous category"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
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
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to category ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-card hover:bg-secondary flex items-center justify-center shadow-soft transition-all duration-300 hover:scale-110"
            aria-label="Next category"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mt-10"
        >
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium text-sm tracking-wide hover:shadow-glow transition-all duration-300 hover:scale-105">
            Explore {activeCategory.name}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default FlowerCarousel;

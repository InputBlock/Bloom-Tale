import { motion } from "framer-motion";

// Sparkle effect for welcome state
const Sparkle = ({ x, y, delay = 0, size = 8 }) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.3, 1, 1, 0.3],
        rotate: [0, 180],
      }}
      transition={{
        duration: 1.5,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 12 12">
        <path 
          d="M6 0 L6.8 4.5 L12 6 L6.8 7.5 L6 12 L5.2 7.5 L0 6 L5.2 4.5 Z" 
          fill="rgba(255, 255, 255, 0.9)"
        />
      </svg>
    </motion.div>
  );
};

// Multiple sparkles container
export const SparkleGroup = ({ active = false, className = "" }) => {
  if (!active) return null;

  const sparkles = [
    { x: "20%", y: "30%", delay: 0, size: 10 },
    { x: "75%", y: "25%", delay: 0.3, size: 8 },
    { x: "40%", y: "60%", delay: 0.6, size: 6 },
    { x: "85%", y: "55%", delay: 0.9, size: 9 },
    { x: "15%", y: "70%", delay: 1.2, size: 7 },
    { x: "60%", y: "80%", delay: 0.4, size: 8 },
    { x: "30%", y: "15%", delay: 0.7, size: 6 },
    { x: "90%", y: "40%", delay: 1.0, size: 7 },
  ];

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {sparkles.map((sparkle, i) => (
        <Sparkle key={i} {...sparkle} />
      ))}
    </div>
  );
};

export default Sparkle;

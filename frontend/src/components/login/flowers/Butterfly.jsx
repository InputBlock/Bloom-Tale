import { motion } from "framer-motion";

// Butterfly for success animation (BIGGER and more beautiful)
const Butterfly = ({ delay = 0, className = "", colorIndex = 0 }) => {
  // Predefined color variations
  const colors = [
    { primary: "#ffadd2", secondary: "#ff85c0", accent: "#ffd4e5" },
    { primary: "#add8ff", secondary: "#85c0ff", accent: "#d4e8ff" },
    { primary: "#d4adff", secondary: "#c085ff", accent: "#e8d4ff" },
    { primary: "#ffdfad", secondary: "#ffc085", accent: "#fff0d4" },
  ];
  const color = colors[colorIndex % colors.length];

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      initial={{ opacity: 0, y: 80, x: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 1, 1, 1, 0.8, 0],
        y: [80, 20, -50, -120, -200, -300],
        x: [0, 40, -20, 60, -30, 50],
        rotate: [0, 8, -8, 12, -5, 15],
        scale: [0.5, 1, 1.1, 1, 0.9, 0.7],
      }}
      transition={{
        duration: 5,
        delay: delay,
        ease: "easeOut",
        times: [0, 0.15, 0.35, 0.55, 0.75, 1],
      }}
    >
      <motion.svg
        width="50"
        height="40"
        viewBox="0 0 50 40"
        animate={{
          scaleX: [1, 0.2, 1, 0.2, 1],
        }}
        transition={{
          duration: 0.25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Left Upper Wing */}
        <motion.ellipse 
          cx="12" cy="14" rx="11" ry="13" 
          fill={color.accent}
          animate={{ ry: [13, 14, 13] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        <ellipse cx="10" cy="12" rx="7" ry="9" fill={color.primary} />
        <ellipse cx="8" cy="10" rx="3" ry="4" fill={color.secondary} opacity="0.7" />
        
        {/* Left Lower Wing */}
        <ellipse cx="10" cy="30" rx="7" ry="8" fill={color.accent} />
        <ellipse cx="9" cy="29" rx="4" ry="5" fill={color.primary} />
        
        {/* Right Upper Wing */}
        <motion.ellipse 
          cx="38" cy="14" rx="11" ry="13" 
          fill={color.accent}
          animate={{ ry: [13, 14, 13] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        <ellipse cx="40" cy="12" rx="7" ry="9" fill={color.primary} />
        <ellipse cx="42" cy="10" rx="3" ry="4" fill={color.secondary} opacity="0.7" />
        
        {/* Right Lower Wing */}
        <ellipse cx="40" cy="30" rx="7" ry="8" fill={color.accent} />
        <ellipse cx="41" cy="29" rx="4" ry="5" fill={color.primary} />
        
        {/* Wing patterns */}
        <circle cx="10" cy="16" r="2" fill="white" opacity="0.5" />
        <circle cx="40" cy="16" r="2" fill="white" opacity="0.5" />
        
        {/* Body */}
        <ellipse cx="25" cy="20" rx="3" ry="14" fill="#5a4a40" />
        <ellipse cx="25" cy="8" rx="2.5" ry="3" fill="#5a4a40" />
        
        {/* Eyes */}
        <circle cx="24" cy="6" r="1" fill="white" />
        <circle cx="26" cy="6" r="1" fill="white" />
        <circle cx="24" cy="6" r="0.5" fill="#222" />
        <circle cx="26" cy="6" r="0.5" fill="#222" />
        
        {/* Antennae */}
        <path d="M24 5 Q20 1 16 0" stroke="#5a4a40" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M26 5 Q30 1 34 0" stroke="#5a4a40" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="16" cy="0" r="1.5" fill="#5a4a40" />
        <circle cx="34" cy="0" r="1.5" fill="#5a4a40" />
      </motion.svg>
      
      {/* Sparkle trail */}
      <motion.div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2"
        animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1, 0.3] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        <svg width="8" height="8" viewBox="0 0 8 8">
          <path d="M4 0 L4.5 3.5 L8 4 L4.5 4.5 L4 8 L3.5 4.5 L0 4 L3.5 3.5 Z" fill="#ffe066" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default Butterfly;

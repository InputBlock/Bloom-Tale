import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Rose from "./Rose";
import Daisy from "./Daisy";
import Tulip from "./Tulip";
import LeafCompanion from "./LeafCompanion";
import Butterfly from "./Butterfly";
import { SparkleGroup } from "./Sparkle";

// Background grass blades - Softer muted greens
const GrassBlade = ({ x, delay = 0, height = 40, colorIndex = 0 }) => {
  // Predefined grass colors - softer pastel greens
  const grassColors = [
    "hsl(115, 40%, 45%)", "hsl(120, 38%, 47%)", "hsl(118, 42%, 43%)",
    "hsl(122, 36%, 48%)", "hsl(116, 44%, 44%)", "hsl(125, 38%, 46%)",
    "hsl(112, 40%, 47%)", "hsl(119, 35%, 44%)", "hsl(123, 42%, 45%)",
    "hsl(117, 38%, 49%)"
  ];
  
  return (
    <motion.div
      className="absolute bottom-0"
      style={{ left: `${x}%` }}
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <svg width="8" height={height} viewBox={`0 0 8 ${height}`}>
        <path 
          d={`M4 ${height} Q2 ${height * 0.6} 3 ${height * 0.3} Q4 0 4 0 Q4 0 5 ${height * 0.3} Q6 ${height * 0.6} 4 ${height}`}
          fill={grassColors[colorIndex % grassColors.length]}
          opacity="0.85"
        />
      </svg>
    </motion.div>
  );
};

// Static background flowers (small, decorative)
const SmallFlower = ({ x, y, color = "#ffb6c1", size = 12 }) => (
  <div className="absolute" style={{ left: `${x}%`, bottom: `${y}px` }}>
    <svg width={size} height={size} viewBox="0 0 20 20">
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <ellipse 
          key={i} 
          cx="10" cy="5" rx="3" ry="4" 
          fill={color} 
          transform={`rotate(${angle} 10 10)`}
          opacity="0.8"
        />
      ))}
      <circle cx="10" cy="10" r="2.5" fill="#ffe066" />
    </svg>
  </div>
);

// Decorative mushroom
const Mushroom = ({ x, flip = false }) => (
  <motion.div 
    className="absolute bottom-0" 
    style={{ left: `${x}%`, transform: flip ? "scaleX(-1)" : "none" }}
    initial={{ scale: 0, y: 10 }}
    animate={{ scale: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.3 }}
  >
    <svg width="25" height="30" viewBox="0 0 25 30">
      {/* Stem */}
      <rect x="9" y="18" width="7" height="12" rx="2" fill="#f5e6d3" />
      {/* Cap */}
      <ellipse cx="12.5" cy="16" rx="12" ry="10" fill="#e07a5f" />
      {/* Spots */}
      <circle cx="8" cy="13" r="2" fill="#f5e6d3" opacity="0.8" />
      <circle cx="15" cy="11" r="1.5" fill="#f5e6d3" opacity="0.8" />
      <circle cx="11" cy="18" r="1" fill="#f5e6d3" opacity="0.8" />
    </svg>
  </motion.div>
);

// Small ladybug
const Ladybug = ({ x, y }) => (
  <motion.div 
    className="absolute" 
    style={{ left: `${x}%`, bottom: `${y}px` }}
    animate={{ x: [0, 3, -2, 0], rotate: [0, 5, -5, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
  >
    <svg width="12" height="10" viewBox="0 0 12 10">
      <ellipse cx="6" cy="5" rx="5" ry="4" fill="#e53935" />
      <line x1="6" y1="1" x2="6" y2="9" stroke="#222" strokeWidth="0.8" />
      <circle cx="3.5" cy="4" r="1" fill="#222" />
      <circle cx="8.5" cy="4" r="1" fill="#222" />
      <circle cx="5" cy="6.5" r="0.8" fill="#222" />
      <circle cx="7" cy="6.5" r="0.8" fill="#222" />
      <circle cx="6" cy="1.5" r="1.5" fill="#222" />
    </svg>
  </motion.div>
);

// Orchestrates all flower animations based on login form state
const FlowerScene = ({ 
  focusedField = null,
  isPasswordVisible = false,
  loginState = "idle",
  className = ""
}) => {
  const containerRef = useRef(null);
  const [cursorAngle, setCursorAngle] = useState(0);

  // Derive flower state directly from props (no useEffect needed)
  const flowerState = useMemo(() => {
    if (loginState === "success") return "bloom";
    if (loginState === "error") return "sad";
    if (isPasswordVisible) return "shy"; // Eyes closed when password is visible
    if (focusedField === "password") return "private";
    if (focusedField === "email" || focusedField === "otp") return "welcome"; // OTP also shows friendly face
    return "idle";
  }, [focusedField, isPasswordVisible, loginState]);

  // Track cursor position relative to flower scene
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    // Calculate angle in degrees (-40 to 40 range for more movement)
    const angle = Math.atan2(deltaX, -deltaY) * (180 / Math.PI);
    const clampedAngle = Math.max(-40, Math.min(40, angle * 0.6));
    
    setCursorAngle(clampedAngle);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Generate grass blades with deterministic values
  const grassBlades = useMemo(() => Array.from({ length: 60 }, (_, i) => ({
    x: (i / 60) * 100 + ((i * 7) % 3) - 1,
    delay: i * 0.01,
    height: 25 + ((i * 13) % 25),
    colorIndex: i
  })), []);

  return (
    <motion.div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ minHeight: "100vh" }}
    >
      {/* Sky gradient background - Soft pastel theme */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #f0f5f3 0%, #e5efe8 25%, #dce8de 50%, #d0e0d2 75%, #c8d8ca 100%)",
          filter: "saturate(0.85) brightness(1.02)",
        }}
      />

      {/* Sun - Soft and subtle */}
      <motion.div 
        className="absolute top-8 right-12 w-16 h-16 rounded-full"
        style={{
          background: "radial-gradient(circle at 40% 40%, #fffdf5, #f5e6b8)",
          boxShadow: "0 0 40px rgba(255,230,150,0.35), 0 0 80px rgba(255,230,150,0.2)",
          opacity: 0.9,
        }}
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Soft clouds - More subtle */}
      <motion.div
        className="absolute top-16 left-10 opacity-40"
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <svg width="120" height="40" viewBox="0 0 120 40">
          <ellipse cx="30" cy="25" rx="25" ry="15" fill="white" />
          <ellipse cx="55" cy="20" rx="30" ry="18" fill="white" />
          <ellipse cx="85" cy="25" rx="25" ry="14" fill="white" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-28 left-1/3 opacity-35"
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
      >
        <svg width="100" height="35" viewBox="0 0 100 35">
          <ellipse cx="25" cy="22" rx="22" ry="13" fill="white" />
          <ellipse cx="50" cy="18" rx="25" ry="15" fill="white" />
          <ellipse cx="75" cy="22" rx="20" ry="12" fill="white" />
        </svg>
      </motion.div>

      {/* Background decorative elements - Soft and subtle */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Soft gradient circles */}
        <div className="absolute top-20 left-20 w-60 h-60 rounded-full bg-pink-50/25 blur-3xl" />
        <div className="absolute bottom-40 right-20 w-80 h-80 rounded-full bg-green-50/20 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-amber-50/15 blur-2xl" />
      </div>

      {/* Sparkles (visible during welcome state) */}
      <SparkleGroup active={flowerState === "welcome"} />

      {/* Rolling hills in background - Softer */}
      <svg className="absolute bottom-0 left-0 w-full h-48" viewBox="0 0 800 200" preserveAspectRatio="none">
        <path 
          d="M0 200 L0 120 Q100 80 200 100 Q350 130 450 90 Q550 50 650 80 Q750 110 800 70 L800 200 Z" 
          fill="#9fc5a0" 
          opacity="0.25"
        />
        <path 
          d="M0 200 L0 140 Q150 100 300 130 Q450 160 550 120 Q700 80 800 110 L800 200 Z" 
          fill="#8fb890" 
          opacity="0.35"
        />
      </svg>

      {/* Ground with grass texture - Softer */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(to top, #6a9a6a 0%, #7aaa7a 40%, #8aba8a 70%, transparent 100%)",
          filter: "saturate(0.8) brightness(1.05)",
        }}
      />

      {/* Grass blades */}
      <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden">
        {grassBlades.map((blade, i) => (
          <GrassBlade key={i} {...blade} />
        ))}
      </div>

      {/* Small decorative flowers in the grass - Muted pastel colors */}
      <SmallFlower x={8} y={35} color="#f5c6cb" size={14} />
      <SmallFlower x={15} y={25} color="#f8f9fa" size={10} />
      <SmallFlower x={25} y={40} color="#d4b8d9" size={12} />
      <SmallFlower x={75} y={30} color="#f5c6cb" size={11} />
      <SmallFlower x={82} y={42} color="#f8f9fa" size={13} />
      <SmallFlower x={90} y={28} color="#e8d4a8" size={10} />

      {/* Mushrooms */}
      <Mushroom x={5} />
      <Mushroom x={92} flip />

      {/* Ladybugs */}
      <Ladybug x={20} y={50} />
      <Ladybug x={78} y={45} />

      {/* MAIN FLOWER CHARACTERS */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-end justify-center gap-0 z-20">
        {/* Small Leaf - far left */}
        <motion.div
          className="relative -mr-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <LeafCompanion 
            cursorAngle={cursorAngle} 
            state={flowerState}
          />
        </motion.div>

        {/* Daisy - left */}
        <motion.div
          className="relative -mr-4 z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Daisy 
            cursorAngle={cursorAngle} 
            state={flowerState}
          />
        </motion.div>

        {/* Rose - center (HERO, biggest) */}
        <motion.div
          className="relative z-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0 }}
        >
          <Rose 
            cursorAngle={cursorAngle} 
            state={flowerState}
          />
        </motion.div>

        {/* Tulip - right */}
        <motion.div
          className="relative -ml-4 z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Tulip 
            cursorAngle={cursorAngle} 
            state={flowerState}
          />
        </motion.div>
      </div>

      {/* Butterflies (visible during success state) */}
      {flowerState === "bloom" && (
        <>
          <Butterfly delay={0.2} colorIndex={0} className="left-1/4 bottom-1/3" />
          <Butterfly delay={0.5} colorIndex={1} className="right-1/4 bottom-1/2" />
          <Butterfly delay={0.8} colorIndex={2} className="left-1/3 bottom-2/5" />
          <Butterfly delay={1.1} colorIndex={3} className="right-1/3 bottom-1/4" />
        </>
      )}

      {/* Success celebration glow */}
      {flowerState === "bloom" && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-60 rounded-full"
            style={{
              background: "radial-gradient(ellipse at center bottom, rgba(255,220,230,0.6) 0%, rgba(255,255,200,0.3) 40%, transparent 70%)",
            }}
          />
        </motion.div>
      )}

      {/* Interactive hint text - hidden during bloom */}
      {flowerState !== "bloom" && (
        <motion.div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm text-gray-500/70 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Move your cursor to interact with the flowers ✨
        </motion.div>
      )}
    </motion.div>
  );
};

export default FlowerScene;

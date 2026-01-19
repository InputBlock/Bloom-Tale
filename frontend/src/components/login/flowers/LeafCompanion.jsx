// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

// Cute eyes for the leaf with always visible mouth
const LeafEyes = ({ state, cursorAngle }) => {
  const getEyeState = () => {
    switch (state) {
      case "shy": return { scale: 0.8, pupilY: 2, blush: true, closedEyes: true, mouthType: "shy" };
      case "sad": return { scale: 0.75, pupilY: 3, sad: true, mouthType: "sad" };
      case "welcome": return { scale: 1.1, pupilY: 0, sparkle: true, mouthType: "smile" };
      case "private": return { scale: 1, pupilY: 0, closedEyes: true, mouthType: "neutral" };
      case "bloom": return { scale: 1.15, pupilY: -1, blush: true, mouthType: "happy" };
      default: return { scale: 1, pupilY: 0, mouthType: "gentle" };
    }
  };

  const eyeState = getEyeState();
  const pupilOffset = (cursorAngle / 40) * 2;

  const getMouthPath = () => {
    switch (eyeState.mouthType) {
      case "happy": return "M2 1 Q5 5 8 1";
      case "smile": return "M3 2 Q5 4 7 2";
      case "sad": return "M3 4 Q5 2 7 4";
      case "shy": return "M4 2 Q5 3 6 2";
      case "gentle": return "M3 2 Q5 3.5 7 2";
      default: return "M3 2 Q5 3 7 2";
    }
  };

  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
      <div className="flex items-center gap-1.5">
      {/* Left eye */}
      {eyeState.closedEyes ? (
        <svg width="12" height="12" viewBox="0 0 14 14">
          <motion.path
            d="M2 9 Q7 3 12 9"
            stroke="#333"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3 }}
          />
        </svg>
      ) : (
      <motion.svg 
        width="12" height={eyeState.squint ? 6 : 12} 
        viewBox="0 0 14 14"
        animate={{ scaleY: eyeState.scale }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <ellipse cx="7" cy="7" rx="5.5" ry={eyeState.squint ? 2.5 : 5.5} fill="white" stroke="#333" strokeWidth="1" />
        <motion.ellipse 
          cx={7 + pupilOffset} cy={7 + eyeState.pupilY * 0.4} rx="2.5" ry="2.5" fill="#333"
          animate={{ cx: 7 + pupilOffset, cy: 7 + eyeState.pupilY * 0.4 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        <circle cx={8 + pupilOffset} cy={6} r="1" fill="white" />
      </motion.svg>
      )}

      {/* Right eye */}
      {eyeState.closedEyes ? (
        <svg width="12" height="12" viewBox="0 0 14 14">
          <motion.path
            d="M2 9 Q7 3 12 9"
            stroke="#333"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          />
        </svg>
      ) : (
      <motion.svg 
        width="12" height={eyeState.squint ? 6 : 12} 
        viewBox="0 0 14 14"
        animate={{ scaleY: eyeState.scale }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <ellipse cx="7" cy="7" rx="5.5" ry={eyeState.squint ? 2.5 : 5.5} fill="white" stroke="#333" strokeWidth="1" />
        <motion.ellipse 
          cx={7 + pupilOffset} cy={7 + eyeState.pupilY * 0.4} rx="2.5" ry="2.5" fill="#333"
          animate={{ cx: 7 + pupilOffset, cy: 7 + eyeState.pupilY * 0.4 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        <circle cx={8 + pupilOffset} cy={6} r="1" fill="white" />
      </motion.svg>
      )}

      </div>

      {/* Blush */}
      {eyeState.blush && (
        <>
          <motion.div 
            className="absolute -left-1 top-0 w-2 h-1 rounded-full bg-green-300/50"
            initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
          />
          <motion.div 
            className="absolute -right-1 top-0 w-2 h-1 rounded-full bg-green-300/50"
            initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
          />
        </>
      )}

      {/* Cute mouth - always visible */}
      <motion.div 
        className="mt-0.5"
        animate={{ scale: eyeState.mouthType === "happy" ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <svg width="10" height="6" viewBox="0 0 10 6">
          <motion.path 
            d={getMouthPath()}
            stroke="#4a6a4a" 
            strokeWidth="1.2" 
            fill="none" 
            strokeLinecap="round"
            initial={false}
            animate={{ d: getMouthPath() }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          />
        </svg>
      </motion.div>
    </div>
  );
};

// Small leaf companion character (BIGGER with eyes!)
const LeafCompanion = ({ 
  cursorAngle = 0, 
  state = "idle", 
  className = "" 
}) => {
  const getScale = () => {
    switch (state) {
      case "welcome": return 1.08;
      case "shy": return 1.12;
      case "bloom": return 1.15;
      default: return 1;
    }
  };

  return (
    <div
      className={`relative ${className}`}
      style={{ width: "80px", height: "140px" }}
    >
      {/* Main Leaf Shape */}
      <motion.svg 
        width="80" 
        height="140" 
        viewBox="0 0 80 140"
        className="absolute bottom-0"
        animate={{ 
          rotate: state === "shy" ? 5 : 0,
          scale: getScale(),
          y: state === "bloom" ? -4 : 0,
        }}
        transition={{ type: "spring", stiffness: 80, damping: 18 }}
      >
        {/* Stem - Static */}
        <path
          d="M40 140 Q39 110 40 80"
          stroke="url(#leafStem)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* STEM BOTTOM FADE - Natural ground blend */}
        {/* Soft soil mound */}
        <ellipse cx="40" cy="140" rx="8" ry="2.5" fill="rgba(75, 105, 65, 0.18)" />
        <ellipse cx="40" cy="139" rx="5" ry="1.5" fill="rgba(90, 120, 80, 0.12)" />

        {/* Leaf body */}
        <path
          d="M40 10 Q72 35 68 70 Q58 105 40 115 Q22 105 12 70 Q8 35 40 10"
          fill="url(#leafBodyGrad)"
        />
        
        {/* Center vein */}
        <path d="M40 18 L40 100" stroke="#3d7a4d" strokeWidth="2.5" fill="none" opacity="0.7" />
        
        {/* Side veins */}
        <path d="M40 30 Q28 38 18 44" stroke="#3d7a4d" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M40 30 Q52 38 62 44" stroke="#3d7a4d" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M40 50 Q26 60 16 68" stroke="#3d7a4d" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M40 50 Q54 60 64 68" stroke="#3d7a4d" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M40 70 Q30 80 22 88" stroke="#3d7a4d" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M40 70 Q50 80 58 88" stroke="#3d7a4d" strokeWidth="1.5" fill="none" opacity="0.5" />

        <defs>
          <linearGradient id="leafBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8bc88b" />
            <stop offset="40%" stopColor="#6ab06a" />
            <stop offset="100%" stopColor="#4a9a4a" />
          </linearGradient>
          <linearGradient id="leafStem" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#5a8a5a" stopOpacity="0" />
            <stop offset="15%" stopColor="#4d7a4d" stopOpacity="0.6" />
            <stop offset="35%" stopColor="#5a8a5a" stopOpacity="1" />
            <stop offset="100%" stopColor="#5a8a5a" stopOpacity="1" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Cute Eyes */}
      <LeafEyes state={state} cursorAngle={cursorAngle} />

      {/* Dewdrops */}
      <motion.div
        className="absolute top-16 left-5 w-2.5 h-3 rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(200,240,255,0.7))",
        }}
        animate={{
          opacity: state === "bloom" ? [0.8, 1, 0.8] : 0.8,
          scale: state === "bloom" ? [1, 1.3, 1] : 1,
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-24 right-6 w-2 h-2.5 rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(200,240,255,0.6))",
        }}
        animate={{
          opacity: 0.7,
          scale: state === "bloom" ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Bloom sparkle */}
      {state === "bloom" && (
        <motion.div
          className="absolute top-2 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M8 0 L9 6 L16 8 L9 10 L8 16 L7 10 L0 8 L7 6 Z" fill="#ffe066" opacity="0.9" />
          </svg>
        </motion.div>
      )}
    </div>
  );
};

export default LeafCompanion;

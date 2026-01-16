import { motion } from "framer-motion";

// Cute Eyes Component for Daisy with always visible mouth
const DaisyEyes = ({ state, cursorAngle, size = 1 }) => {
  const getEyeState = () => {
    switch (state) {
      case "shy":
        return { eyeScale: 0.85, pupilY: 2, blush: true, closedEyes: true, mouthType: "shy" };
      case "sad":
        return { eyeScale: 0.8, pupilY: 3, sad: true, mouthType: "sad" };
      case "welcome":
        return { eyeScale: 1.1, pupilY: 0, blush: true, sparkle: true, mouthType: "smile" };
      case "private":
        return { eyeScale: 1, pupilY: 0, closedEyes: true, mouthType: "neutral" };
      case "bloom":
        return { eyeScale: 1.12, pupilY: -1, blush: true, sparkle: true, mouthType: "happy" };
      default:
        return { eyeScale: 1, pupilY: 0, mouthType: "gentle" };
    }
  };

  const getMouthPath = () => {
    switch (eyeState.mouthType) {
      case "happy": return "M4 2 Q10 9 16 2";
      case "smile": return "M5 3 Q10 7 15 3";
      case "sad": return "M5 7 Q10 3 15 7";
      case "shy": return "M7 4 Q10 6 13 4";
      case "gentle": return "M6 3 Q10 6 14 3";
      default: return "M6 4 Q10 6 14 4";
    }
  };

  const eyeState = getEyeState();
  const pupilOffset = (cursorAngle / 30) * 2.5;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ transform: `scale(${size})` }}>
      <div className="flex items-center justify-center gap-2">
      {/* Left Eye */}
      <motion.div
        className="relative"
        animate={{ scaleY: eyeState.eyeScale }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {eyeState.closedEyes ? (
          <svg width="18" height="18" viewBox="0 0 20 20">
            <motion.path
              d="M3 12 Q10 4 17 12"
              stroke="#3a3a3a"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
          </svg>
        ) : (
        <svg width="18" height={eyeState.squint ? 10 : 18} viewBox="0 0 20 20">
          <ellipse 
            cx="10" cy="10" 
            rx="8" ry={eyeState.squint ? 4 : 8} 
            fill="white" 
            stroke="#3a3a3a" 
            strokeWidth="1.5"
          />
          <motion.ellipse 
            cx="10" cy="10" rx="4" ry="4"
            fill="#3a3a3a"
            animate={{ cx: 10 + pupilOffset, cy: 10 + eyeState.pupilY }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          <circle cx={12 + pupilOffset} cy={8 + eyeState.pupilY} r="1.5" fill="white" />
        </svg>
        )}
        {eyeState.sad && (
          <motion.div className="absolute -top-1 left-0" animate={{ rotate: -12 }}>
            <svg width="18" height="6"><path d="M2 5 Q9 1 16 5" stroke="#4a4a4a" strokeWidth="2" fill="none" /></svg>
          </motion.div>
        )}
      </motion.div>

      {/* Right Eye */}
      <motion.div
        className="relative"
        animate={{ scaleY: eyeState.eyeScale }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {eyeState.closedEyes ? (
          <svg width="18" height="18" viewBox="0 0 20 20">
            <motion.path
              d="M3 12 Q10 4 17 12"
              stroke="#3a3a3a"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            />
          </svg>
        ) : (
        <svg width="18" height={eyeState.squint ? 10 : 18} viewBox="0 0 20 20">
          <ellipse 
            cx="10" cy="10" 
            rx="8" ry={eyeState.squint ? 4 : 8} 
            fill="white" 
            stroke="#3a3a3a" 
            strokeWidth="1.5"
          />
          <motion.ellipse 
            cx="10" cy="10" rx="4" ry="4"
            fill="#3a3a3a"
            animate={{ cx: 10 + pupilOffset, cy: 10 + eyeState.pupilY }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          <circle cx={12 + pupilOffset} cy={8 + eyeState.pupilY} r="1.5" fill="white" />
        </svg>
        )}
        {eyeState.sad && (
          <motion.div className="absolute -top-1 left-0" style={{ transform: "scaleX(-1)" }} animate={{ rotate: -12 }}>
            <svg width="18" height="6"><path d="M2 5 Q9 1 16 5" stroke="#4a4a4a" strokeWidth="2" fill="none" /></svg>
          </motion.div>
        )}
      </motion.div>

      </div>

      {/* Blush */}
      {eyeState.blush && (
        <>
          <motion.div className="absolute -left-1 top-1 w-3 h-1.5 rounded-full bg-pink-200/60" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} />
          <motion.div className="absolute -right-1 top-1 w-3 h-1.5 rounded-full bg-pink-200/60" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} />
        </>
      )}

      {/* Cute mouth - always visible */}
      <motion.div 
        className="mt-0.5"
        animate={{ scale: eyeState.mouthType === "happy" ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <svg width="20" height="10" viewBox="0 0 20 10">
          <motion.path 
            d={getMouthPath()}
            stroke="#5a4a3a" 
            strokeWidth="1.8" 
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

// Daisy flower - supporting character (BIGGER!)
const Daisy = ({ 
  cursorAngle = 0, 
  state = "idle", 
  className = "" 
}) => {
  const getPetalScale = () => {
    switch (state) {
      case "welcome": return 1.1;
      case "private": return 0.85;
      case "shy": return 0.78;
      case "sad": return 0.9;
      case "bloom": return 1.18;
      default: return 1;
    }
  };

  const getColorFilter = () => {
    switch (state) {
      case "sad": return "saturate(0.6) brightness(0.92)";
      case "bloom": return "saturate(1.2) brightness(1.08)";
      default: return "saturate(1)";
    }
  };

  return (
    <div
      className={`relative ${className}`}
      style={{ width: "160px", height: "300px" }}
    >
      {/* Curved Stem - Static with sepal connector */}
      <svg 
        className="absolute bottom-0 left-1/2 -translate-x-1/2" 
        width="60" 
        height="180" 
        viewBox="0 0 60 180"
        style={{ filter: getColorFilter() }}
      >
        <defs>
          <linearGradient id="daisyStem" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#5aa06a" stopOpacity="0" />
            <stop offset="10%" stopColor="#4d8a5a" stopOpacity="0.6" />
            <stop offset="25%" stopColor="#5aa06a" stopOpacity="1" />
            <stop offset="100%" stopColor="#5aa06a" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Main stem */}
        <path
          d="M30 180 Q27 140 30 100 Q33 60 30 20"
          stroke="url(#daisyStem)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        {/* Sepal/connector to flower head */}
        <ellipse cx="30" cy="18" rx="8" ry="5" fill="#5aa06a" />
        <ellipse cx="30" cy="15" rx="6" ry="4" fill="#6ab07a" />
        
        {/* STEM BOTTOM FADE - Natural ground blend */}
        <defs>
          <linearGradient id="daisyStemFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5aa06a" stopOpacity="1" />
            <stop offset="60%" stopColor="#5aa06a" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#5aa06a" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Soft soil mound */}
        <ellipse cx="30" cy="180" rx="10" ry="3" fill="rgba(80, 110, 70, 0.2)" />
        <ellipse cx="30" cy="179" rx="6" ry="2" fill="rgba(90, 120, 80, 0.15)" />
      </svg>

      {/* Leaves - Very subtle motion, positioned away from center */}
      <motion.div
        className="absolute bottom-20 left-1/2"
        style={{ translateX: "-130%", rotate: -40 }}
        animate={{ rotate: cursorAngle * 0.02 - 40 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <svg width="50" height="32" viewBox="0 0 55 35">
          <path d="M50 30 Q28 32 8 18 Q3 10 12 6 Q35 3 50 30" fill="#5a9a6a" />
          <path d="M45 27 Q30 22 15 14" stroke="#4a8a5a" strokeWidth="1.5" fill="none" opacity="0.5" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-1/2"
        style={{ translateX: "35%", rotate: 35 }}
        animate={{ rotate: cursorAngle * 0.02 + 35 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <svg width="42" height="28" viewBox="0 0 45 30">
          <path d="M5 25 Q22 28 38 15 Q42 8 35 5 Q18 3 5 25" fill="#5a9a6a" />
          <path d="M10 22 Q22 18 33 12" stroke="#4a8a5a" strokeWidth="1.5" fill="none" opacity="0.5" />
        </svg>
      </motion.div>

      {/* FLOWER HEAD - at TOP, connected to stem */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{ width: "150px", height: "150px" }}
        animate={{
          rotate: cursorAngle * 0.02,
          y: state === "sad" ? 6 : state === "bloom" ? -3 : 0,
          scale: state === "bloom" ? 1.06 : 1,
        }}
        transition={{ type: "spring", stiffness: 55, damping: 14 }}
      >
        {/* White Petals - Bigger */}
        {[0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 origin-bottom"
            style={{
              rotate: angle,
              translateX: "-50%",
              translateY: "-100%",
              filter: getColorFilter(),
            }}
            animate={{
              scaleY: getPetalScale(),
              scaleX: getPetalScale() * 0.9,
            }}
            transition={{ type: "spring", stiffness: 80, damping: 14, delay: i * 0.01 }}
          >
            <svg width="28" height="52" viewBox="0 0 28 52">
              <ellipse cx="14" cy="26" rx="12" ry="24" fill="url(#daisyPetal)" />
              <defs>
                <linearGradient id="daisyPetal" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="80%" stopColor="#f8f4ed" />
                  <stop offset="100%" stopColor="#efe8dc" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        ))}

        {/* Yellow Center with Face */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center z-10"
          style={{
            background: "radial-gradient(circle at 35% 35%, #ffe566, #f5c020)",
            boxShadow: state === "bloom" ? "0 0 25px rgba(255,224,102,0.6)" : "0 3px 12px rgba(0,0,0,0.1)",
          }}
          animate={{ scale: state === "bloom" ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 12 }}
        >
          <DaisyEyes state={state} cursorAngle={cursorAngle} size={1} />
        </motion.div>

        {/* Bloom glow */}
        {state === "bloom" && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)" }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Daisy;


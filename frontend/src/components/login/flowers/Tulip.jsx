import { motion } from "framer-motion";

// Cute Eyes for Tulip (peeks from inside the tulip) with always visible mouth
const TulipEyes = ({ state = "idle", cursorAngle = 0, size = 1 }) => {
  const getEyeState = () => {
    switch (state) {
      case "shy": return { eyeScale: 0.7, pupilY: 3, blush: true, peeking: true, closedEyes: true, mouthType: "shy" };
      case "sad": return { eyeScale: 0.75, pupilY: 4, sad: true, mouthType: "sad" };
      case "welcome": return { eyeScale: 1.1, pupilY: 0, blush: true, sparkle: true, mouthType: "smile" };
      case "private": return { eyeScale: 1, pupilY: 0, closedEyes: true, mouthType: "neutral" };
      case "bloom": return { eyeScale: 1.15, pupilY: -2, blush: true, mouthType: "happy" };
      default: return { eyeScale: 1, pupilY: 0, blush: true, mouthType: "gentle" };
    }
  };

  const eyeState = getEyeState();
  const safeCursorAngle = typeof cursorAngle === 'number' && !isNaN(cursorAngle) ? cursorAngle : 0;
  const pupilOffset = (safeCursorAngle / 30) * 2;

  const getMouthPath = () => {
    switch (eyeState.mouthType) {
      case "happy": return "M3 1 Q7 6 11 1";
      case "smile": return "M4 2 Q7 5 10 2";
      case "sad": return "M4 5 Q7 2 10 5";
      case "shy": return "M5 2 Q7 4 9 2";
      case "gentle": return "M4 2 Q7 4 10 2";
      default: return "M5 3 Q7 4 9 3";
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ transform: `scale(${size})` }}>
      <div className="flex items-center justify-center gap-1.5">
      {/* Left Eye */}
      <motion.div
        animate={{ scaleY: eyeState.eyeScale, y: eyeState.peeking ? 3 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {eyeState.closedEyes ? (
          <svg width="14" height="14" viewBox="0 0 16 16">
            <motion.path
              d="M3 10 Q8 4 13 10"
              stroke="#3a3a3a"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
          </svg>
        ) : (
        <svg width="14" height={eyeState.squint ? 8 : 14} viewBox="0 0 16 16">
          <ellipse cx={8} cy={8} rx={6} ry={eyeState.squint ? 3 : 6} fill="white" stroke="#3a3a3a" strokeWidth="1.2" />
          <motion.ellipse 
            cx={8 + (pupilOffset || 0)}
            cy={8 + ((eyeState.pupilY || 0) * 0.5)}
            rx={3}
            ry={3}
            fill="#3a3a3a"
            animate={{ 
              cx: 8 + (pupilOffset || 0), 
              cy: 8 + ((eyeState.pupilY || 0) * 0.5) 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          <motion.circle 
            cx={9 + (pupilOffset || 0)} 
            cy={6 + ((eyeState.pupilY || 0) * 0.3)} 
            r={1.2} 
            fill="white" 
          />
        </svg>
        )}
      </motion.div>

      {/* Right Eye */}
      <motion.div
        animate={{ scaleY: eyeState.eyeScale, y: eyeState.peeking ? 3 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {eyeState.closedEyes ? (
          <svg width="14" height="14" viewBox="0 0 16 16">
            <motion.path
              d="M3 10 Q8 4 13 10"
              stroke="#3a3a3a"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            />
          </svg>
        ) : (
        <svg width="14" height={eyeState.squint ? 8 : 14} viewBox="0 0 16 16">
          <ellipse cx={8} cy={8} rx={6} ry={eyeState.squint ? 3 : 6} fill="white" stroke="#3a3a3a" strokeWidth="1.2" />
          <motion.ellipse 
            cx={8 + (pupilOffset || 0)}
            cy={8 + ((eyeState.pupilY || 0) * 0.5)}
            rx={3}
            ry={3}
            fill="#3a3a3a"
            animate={{ 
              cx: 8 + (pupilOffset || 0), 
              cy: 8 + ((eyeState.pupilY || 0) * 0.5) 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          <motion.circle 
            cx={9 + (pupilOffset || 0)} 
            cy={6 + ((eyeState.pupilY || 0) * 0.3)} 
            r={1.2} 
            fill="white" 
          />
        </svg>
        )}
      </motion.div>

      </div>

      {/* Blush */}
      {eyeState.blush && (
        <>
          <motion.div className="absolute -left-2 top-0 w-2.5 h-1.5 rounded-full bg-pink-300/60" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} />
          <motion.div className="absolute -right-2 top-0 w-2.5 h-1.5 rounded-full bg-pink-300/60" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} />
        </>
      )}

      {/* Cute mouth - always visible */}
      <motion.div 
        className="mt-0.5"
        animate={{ scale: eyeState.mouthType === "happy" ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <svg width="14" height="8" viewBox="0 0 14 8">
          <motion.path 
            d={getMouthPath()}
            stroke="#5a4a3a" 
            strokeWidth="1.5" 
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

// Tulip flower - supporting character (BIGGER!)
const Tulip = ({ 
  cursorAngle = 0, 
  state = "idle", 
  className = "" 
}) => {
  const getPetalScale = () => {
    switch (state) {
      case "welcome": return 1.1;
      case "private": return 0.88;
      case "shy": return 0.8;
      case "sad": return 0.92;
      case "bloom": return 1.2;
      default: return 1;
    }
  };

  const getPetalSpread = () => {
    switch (state) {
      case "welcome": return 10;
      case "private": return -6;
      case "shy": return -10;
      case "sad": return 0;
      case "bloom": return 18;
      default: return 0;
    }
  };

  const getColorFilter = () => {
    switch (state) {
      case "sad": return "saturate(0.6) brightness(0.9)";
      case "bloom": return "saturate(1.25) brightness(1.1)";
      default: return "saturate(1)";
    }
  };

  return (
    <div
      className={`relative ${className}`}
      style={{ width: "130px", height: "300px" }}
    >
      {/* Curved Stem - Static with sepal connector */}
      <svg 
        className="absolute bottom-0 left-1/2 -translate-x-1/2" 
        width="50" 
        height="180" 
        viewBox="0 0 50 180"
        style={{ filter: getColorFilter() }}
      >
        <defs>
          <linearGradient id="tulipStem" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#4a9a5a" stopOpacity="0" />
            <stop offset="10%" stopColor="#3d8a4d" stopOpacity="0.6" />
            <stop offset="25%" stopColor="#4a9a5a" stopOpacity="1" />
            <stop offset="100%" stopColor="#4a9a5a" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Main stem */}
        <path
          d="M25 180 Q24 140 25 100 Q26 50 25 15"
          stroke="url(#tulipStem)"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
        {/* Sepal/connector bulge at top */}
        <ellipse cx="25" cy="12" rx="6" ry="4" fill="#4a9a5a" />
        
        {/* STEM BOTTOM FADE - Natural ground blend */}
        <defs>
          <linearGradient id="tulipStemFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4a9a5a" stopOpacity="1" />
            <stop offset="60%" stopColor="#4a9a5a" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4a9a5a" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Soft soil mound */}
        <ellipse cx="25" cy="180" rx="10" ry="3" fill="rgba(70, 100, 60, 0.2)" />
        <ellipse cx="25" cy="179" rx="6" ry="2" fill="rgba(85, 115, 75, 0.15)" />
      </svg>

      {/* Large Elegant Leaves - Very subtle motion */}
      <motion.div
        className="absolute bottom-10 left-1/2"
        style={{ translateX: "-115%", rotate: -25 }}
        animate={{ rotate: cursorAngle * 0.02 - 25 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <svg width="70" height="100" viewBox="0 0 70 100">
          <path d="M60 95 Q30 70 35 20 Q40 5 45 20 Q50 70 60 95" fill="#4a9a5a" />
          <path d="M58 90 Q40 65 42 30" stroke="#3a8a4a" strokeWidth="2" fill="none" opacity="0.4" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-16 left-1/2"
        style={{ translateX: "25%", rotate: 20 }}
        animate={{ rotate: cursorAngle * 0.02 + 20 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <svg width="60" height="90" viewBox="0 0 60 90">
          <path d="M10 85 Q35 62 32 18 Q28 5 24 18 Q20 62 10 85" fill="#4a9a5a" />
          <path d="M12 80 Q28 58 27 28" stroke="#3a8a4a" strokeWidth="2" fill="none" opacity="0.4" />
        </svg>
      </motion.div>

      {/* TULIP FLOWER HEAD - at TOP */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{ width: "100px", height: "120px" }}
        animate={{
          rotate: cursorAngle * 0.02,
          y: state === "sad" ? 6 : state === "bloom" ? -3 : 0,
          scale: state === "bloom" ? 1.05 : 1,
        }}
        transition={{ type: "spring", stiffness: 80, damping: 18 }}
      >
        {/* Back Petals */}
        <motion.div
          className="absolute bottom-0 left-1/2 origin-bottom"
          style={{ translateX: "-50%", filter: getColorFilter() }}
          animate={{ rotate: -getPetalSpread() * 0.5, scaleY: getPetalScale() }}
          transition={{ type: "spring", stiffness: 70, damping: 14 }}
        >
          <svg width="40" height="75" viewBox="0 0 40 75">
            <path d="M20 75 Q3 45 6 15 Q20 0 20 0 Q20 0 34 15 Q37 45 20 75" fill="url(#tulipBack)" />
            <defs>
              <linearGradient id="tulipBack" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ff5577" />
                <stop offset="100%" stopColor="#ff8099" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Left Petal */}
        <motion.div
          className="absolute bottom-0 left-1/2 origin-bottom"
          style={{ translateX: "-85%", filter: getColorFilter() }}
          animate={{ rotate: -getPetalSpread() - 12, scaleY: getPetalScale() }}
          transition={{ type: "spring", stiffness: 70, damping: 14, delay: 0.02 }}
        >
          <svg width="35" height="70" viewBox="0 0 35 70">
            <path d="M17 70 Q2 40 5 12 Q17 0 17 0 Q17 0 29 12 Q32 40 17 70" fill="url(#tulipLeft)" />
            <defs>
              <linearGradient id="tulipLeft" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ff4466" />
                <stop offset="100%" stopColor="#ff7088" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Right Petal */}
        <motion.div
          className="absolute bottom-0 left-1/2 origin-bottom"
          style={{ translateX: "-15%", filter: getColorFilter() }}
          animate={{ rotate: getPetalSpread() + 12, scaleY: getPetalScale() }}
          transition={{ type: "spring", stiffness: 70, damping: 14, delay: 0.02 }}
        >
          <svg width="35" height="70" viewBox="0 0 35 70">
            <path d="M17 70 Q2 40 5 12 Q17 0 17 0 Q17 0 29 12 Q32 40 17 70" fill="url(#tulipRight)" />
            <defs>
              <linearGradient id="tulipRight" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ff4466" />
                <stop offset="100%" stopColor="#ff7088" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Front Center Petal with Face */}
        <motion.div
          className="absolute bottom-0 left-1/2 origin-bottom z-10"
          style={{ translateX: "-50%", filter: getColorFilter() }}
          animate={{ rotate: getPetalSpread() * 0.2, scaleY: getPetalScale() }}
          transition={{ type: "spring", stiffness: 70, damping: 14 }}
        >
          <svg width="45" height="80" viewBox="0 0 45 80">
            <path d="M22 80 Q3 48 6 16 Q22 0 22 0 Q22 0 38 16 Q41 48 22 80" fill="url(#tulipFront)" />
            <defs>
              <linearGradient id="tulipFront" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ff3355" />
                <stop offset="100%" stopColor="#ff6080" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Eyes peeking from inside tulip */}
        <motion.div 
          className="absolute top-8 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: state === "shy" ? 8 : state === "bloom" ? -5 : 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 12 }}
        >
          <TulipEyes state={state} cursorAngle={cursorAngle} size={0.85} />
        </motion.div>

        {/* Bloom glow */}
        {state === "bloom" && (
          <motion.div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(255,100,130,0.4) 0%, transparent 70%)" }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Tulip;


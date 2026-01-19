// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

// Cute Eyes Component for flowers with neutral mouth by default
const FlowerFace = ({ state = "idle", cursorAngle = 0, size = 1 }) => {
  const getExpressionState = () => {
    switch (state) {
      case "shy":
        return { eyeScale: 0.9, pupilY: 2, blush: true, closedEyes: true, mouthType: "shy" };
      case "sad":
        return { eyeScale: 0.85, pupilY: 3, sad: true, mouthType: "sad" };
      case "welcome":
        return { eyeScale: 1.1, pupilY: 0, blush: true, sparkle: true, mouthType: "smile" };
      case "private":
        return { eyeScale: 1, pupilY: 0, closedEyes: true, mouthType: "neutral" };
      case "bloom":
        return { eyeScale: 1.15, pupilY: -1, blush: true, sparkle: true, mouthType: "happy" };
      default:
        // GENTLE SMILE expression by default - good vibes with subtle blush!
        return { eyeScale: 1, pupilY: 0, blush: true, mouthType: "gentle", sparkle: false };
    }
  };

  const expr = getExpressionState();
  const safeCursorAngle = typeof cursorAngle === 'number' && !isNaN(cursorAngle) ? cursorAngle : 0;
  const pupilOffset = (safeCursorAngle / 30) * 4;

  // Mouth path based on expression
  const getMouthPath = () => {
    switch (expr.mouthType) {
      case "happy":
        return "M6 4 Q16 14 26 4"; // Big smile
      case "smile":
        return "M8 5 Q16 11 24 5"; // Gentle smile
      case "sad":
        return "M8 10 Q16 4 24 10"; // Frown
      case "shy":
        return "M10 6 Q16 9 22 6"; // Small shy smile
      case "gentle":
        return "M9 6 Q16 10 23 6"; // Default gentle happy smile
      default:
        return "M9 6 Q16 10 23 6"; // Gentle smile as fallback
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ transform: `scale(${size})` }}>
      {/* Eyes Container */}
      <div className="flex items-center gap-2 mb-2">
        {/* Left Eye */}
        <motion.div
          className="relative"
          animate={{ scaleY: expr.eyeScale }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          {expr.closedEyes ? (
            /* Cute closed eye - curved line */
            <svg width="28" height="26" viewBox="0 0 28 26">
              <motion.path
                d="M4 16 Q14 6 24 16"
                stroke="#3a3a3a"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
              />
            </svg>
          ) : (
          <svg width="28" height={expr.squint ? 14 : 26} viewBox="0 0 28 26">
            {/* Eye white with subtle shadow */}
            <ellipse 
              cx="14" cy="13" 
              rx="12" ry={expr.squint ? 5 : 11} 
              fill="white" 
              stroke="#3a3a3a" 
              strokeWidth="1.5"
            />
            {/* Inner shadow for depth */}
            <ellipse 
              cx="14" cy="14" 
              rx="10" ry={expr.squint ? 4 : 9} 
              fill="url(#eyeShadow)" 
              opacity="0.15"
            />
            {/* Pupil */}
            <motion.ellipse 
              cx={14 + pupilOffset} 
              cy={13 + (typeof expr.pupilY === 'number' ? expr.pupilY : 0)}
              rx={6} ry={6}
              fill="#2a2a2a"
              animate={{ 
                cx: 14 + pupilOffset,
                cy: 13 + (typeof expr.pupilY === 'number' ? expr.pupilY : 0),
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
            {/* Eye shine - main */}
            <motion.circle 
              cx={16 + pupilOffset * 0.5} 
              cy={10 + (typeof expr.pupilY === 'number' ? expr.pupilY : 0) * 0.5} 
              r="2.5" 
              fill="white" 
            />
            {/* Eye shine - small */}
            <motion.circle 
              cx={12 + pupilOffset * 0.5} 
              cy={15 + (typeof expr.pupilY === 'number' ? expr.pupilY : 0) * 0.5} 
              r="1" 
              fill="white" 
              opacity="0.7"
            />
            {/* Sparkle for happy states */}
            {expr.sparkle && (
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0.8, 1.2, 1], opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
              >
                <path d="M24 4 L25 6 L27 5 L25 7 L26 9 L24 7 L22 9 L23 7 L21 6 L23 6 Z" fill="#FFD700" />
              </motion.g>
            )}
            <defs>
              <radialGradient id="eyeShadow" cx="50%" cy="0%" r="100%">
                <stop offset="0%" stopColor="#000" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
          </svg>
          )}
          {/* Sad eyebrow */}
          {expr.sad && (
            <motion.div
              className="absolute -top-2 left-0 w-full"
              initial={{ rotate: 0 }}
              animate={{ rotate: -20 }}
            >
              <svg width="24" height="10" viewBox="0 0 24 10">
                <path d="M2 8 Q12 2 22 6" stroke="#5a4a3a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
            </motion.div>
          )}
        </motion.div>

        {/* Right Eye */}
        <motion.div
          className="relative"
          animate={{ scaleY: expr.eyeScale }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          {expr.closedEyes ? (
            /* Cute closed eye - curved line */
            <svg width="28" height="26" viewBox="0 0 28 26">
              <motion.path
                d="M4 16 Q14 6 24 16"
                stroke="#3a3a3a"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.05 }}
              />
            </svg>
          ) : (
          <svg width="28" height={expr.squint ? 14 : 26} viewBox="0 0 28 26">
            <ellipse 
              cx="14" cy="13" 
              rx="12" ry={expr.squint ? 5 : 11} 
              fill="white" 
              stroke="#3a3a3a" 
              strokeWidth="1.5"
            />
            <ellipse 
              cx="14" cy="14" 
              rx="10" ry={expr.squint ? 4 : 9} 
              fill="url(#eyeShadow2)" 
              opacity="0.15"
            />
            <motion.ellipse 
              cx={14 + pupilOffset} 
              cy={13 + (typeof expr.pupilY === 'number' ? expr.pupilY : 0)}
              rx={6} ry={6}
              fill="#2a2a2a"
              animate={{ 
                cx: 14 + pupilOffset,
                cy: 13 + (typeof expr.pupilY === 'number' ? expr.pupilY : 0),
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
            <motion.circle 
              cx={16 + pupilOffset * 0.5} 
              cy={10 + (typeof expr.pupilY === 'number' ? expr.pupilY : 0) * 0.5} 
              r="2.5" 
              fill="white" 
            />
            <motion.circle 
              cx={12 + pupilOffset * 0.5} 
              cy={15 + (typeof expr.pupilY === 'number' ? expr.pupilY : 0) * 0.5} 
              r="1" 
              fill="white" 
              opacity="0.7"
            />
            {expr.sparkle && (
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0.8, 1.2, 1], opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5, delay: 0.3 }}
              >
                <path d="M24 4 L25 6 L27 5 L25 7 L26 9 L24 7 L22 9 L23 7 L21 6 L23 6 Z" fill="#FFD700" />
              </motion.g>
            )}
            <defs>
              <radialGradient id="eyeShadow2" cx="50%" cy="0%" r="100%">
                <stop offset="0%" stopColor="#000" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
          </svg>
          )}
          {expr.sad && (
            <motion.div
              className="absolute -top-2 left-0 w-full"
              style={{ transform: "scaleX(-1)" }}
              initial={{ rotate: 0 }}
              animate={{ rotate: -20 }}
            >
              <svg width="24" height="10" viewBox="0 0 24 10">
                <path d="M2 8 Q12 2 22 6" stroke="#5a4a3a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Blush cheeks */}
      {expr.blush && (
        <>
          <motion.div 
            className="absolute left-0 top-1/2 w-5 h-3 rounded-full"
            style={{ 
              background: "radial-gradient(ellipse, rgba(255,150,170,0.6), transparent)",
              transform: "translateX(-10px)"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
          />
          <motion.div 
            className="absolute right-0 top-1/2 w-5 h-3 rounded-full"
            style={{ 
              background: "radial-gradient(ellipse, rgba(255,150,170,0.6), transparent)",
              transform: "translateX(10px)"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
          />
        </>
      )}

      {/* Mouth - Always visible with different expressions */}
      <motion.div 
        className="mt-1"
        animate={{ 
          scale: expr.mouthType === "happy" ? 1 : 1,
        }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <svg width="32" height="16" viewBox="0 0 32 16">
          <motion.path 
            d={getMouthPath()}
            stroke="#5a4a3a" 
            strokeWidth="2.5" 
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

// Primary Rose flower - the main character - LARGER & MORE REALISTIC
const Rose = ({ 
  cursorAngle = 0, 
  state = "idle",
  className = "" 
}) => {
  const getPetalScale = () => {
    switch (state) {
      case "welcome": return 1.1;
      case "private": return 0.95;
      case "shy": return 0.9;
      case "sad": return 0.95;
      case "bloom": return 1.08; // Subtle bloom, not too big
      default: return 1;
    }
  };

  const getColorFilter = () => {
    switch (state) {
      case "sad": return "saturate(0.6) brightness(0.9)";
      case "bloom": return "saturate(1.2) brightness(1.08)";
      default: return "saturate(1)";
    }
  };

  return (
    <div
      className={`relative ${className}`}
      style={{ width: "260px", height: "480px" }}
    >
      {/* MAIN STEM - Connects from bottom to flower head */}
      <svg 
        className="absolute bottom-0 left-1/2 -translate-x-1/2" 
        width="120" 
        height="320" 
        viewBox="0 0 120 320"
        style={{ filter: getColorFilter() }}
      >
        <defs>
          {/* Realistic stem gradient with bottom fade */}
          <linearGradient id="roseStemGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#4a8c5a" stopOpacity="0" />
            <stop offset="8%" stopColor="#3d7a4d" stopOpacity="0.7" />
            <stop offset="20%" stopColor="#4a8c5a" stopOpacity="1" />
            <stop offset="100%" stopColor="#4a8c5a" stopOpacity="1" />
          </linearGradient>
          {/* Stem highlight */}
          <linearGradient id="stemHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          {/* Leaf gradients */}
          <linearGradient id="leafGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6aaa7a" />
            <stop offset="50%" stopColor="#4a9a5a" />
            <stop offset="100%" stopColor="#3d7a4d" />
          </linearGradient>
          <linearGradient id="leafGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6aaa7a" />
            <stop offset="50%" stopColor="#4a9a5a" />
            <stop offset="100%" stopColor="#3d7a4d" />
          </linearGradient>
        </defs>
        
        {/* Main stem path - static and organic */}
        <path
          d="M60 320 Q55 260 60 200 Q65 140 60 80 Q58 50 60 20"
          stroke="url(#roseStemGrad)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Stem highlight overlay */}
        <path
          d="M60 320 Q55 260 60 200 Q65 140 60 80 Q58 50 60 20"
          stroke="url(#stemHighlight)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        
       
       
        
        {/* LEFT LEAF - Classic rose leaf shape, properly attached */}
        <g transform="translate(0, 190)">
          {/* Leaf petiole (small stem connecting to main stem) */}
          <path d="M60 15 Q50 12 40 18" stroke="#4a8c5a" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* Main leaf - elegant oval shape */}
          <path 
            d="M40 18 Q20 5 8 20 Q0 35 10 50 Q25 62 40 50 Q50 38 40 18" 
            fill="url(#leafGradLeft)" 
          />
          {/* Center vein */}
          <path d="M40 20 Q25 35 12 45" stroke="#3a6a4a" strokeWidth="2" fill="none" opacity="0.4" />
          {/* Side veins */}
          <path d="M35 28 Q28 32 20 35" stroke="#3a6a4a" strokeWidth="1" fill="none" opacity="0.3" />
          <path d="M32 38 Q25 42 18 46" stroke="#3a6a4a" strokeWidth="1" fill="none" opacity="0.3" />
          {/* Highlight */}
          <ellipse cx="22" cy="30" rx="10" ry="8" fill="rgba(255,255,255,0.12)" transform="rotate(-20 22 30)" />
        </g>
        
        {/* RIGHT LEAF - Symmetrical, properly attached */}
        <g transform="translate(60, 130)">
          {/* Leaf petiole */}
          <path d="M0 15 Q10 10 20 15" stroke="#4a8c5a" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* Main leaf */}
          <path 
            d="M20 15 Q40 2 52 18 Q60 33 50 48 Q35 60 20 48 Q10 35 20 15" 
            fill="url(#leafGradRight)" 
          />
          {/* Center vein */}
          <path d="M22 18 Q35 32 48 42" stroke="#3a6a4a" strokeWidth="2" fill="none" opacity="0.4" />
          {/* Side veins */}
          <path d="M28 26 Q35 30 42 33" stroke="#3a6a4a" strokeWidth="1" fill="none" opacity="0.3" />
          <path d="M26 36 Q33 40 40 44" stroke="#3a6a4a" strokeWidth="1" fill="none" opacity="0.3" />
          {/* Highlight */}
          <ellipse cx="38" cy="28" rx="10" ry="8" fill="rgba(255,255,255,0.12)" transform="rotate(20 38 28)" />
        </g>
        
        {/* SMALL TOP LEAF - Near flower */}
        <g transform="translate(25, 75)">
          <path d="M35 8 Q28 5 22 10" stroke="#4a8c5a" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path 
            d="M22 10 Q10 5 5 15 Q2 25 10 32 Q20 38 28 28 Q34 18 22 10" 
            fill="#5a9a6a" 
          />
          <path d="M22 12 Q14 22 8 28" stroke="#3a6a4a" strokeWidth="1.5" fill="none" opacity="0.35" />
        </g>
        
        {/* STEM BOTTOM FADE - Natural ground blend */}
        <defs>
          <linearGradient id="stemBottomFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4a8c5a" stopOpacity="1" />
            <stop offset="70%" stopColor="#4a8c5a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4a8c5a" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Soft soil mound - subtle ground effect */}
        <ellipse cx="60" cy="320" rx="18" ry="5" fill="rgba(80, 100, 70, 0.25)" />
        <ellipse cx="60" cy="319" rx="12" ry="3" fill="rgba(90, 120, 80, 0.2)" />
        
        {/* Stem fade overlay - makes bottom disappear naturally */}
        <rect x="50" y="295" width="20" height="25" fill="url(#stemBottomFade)" style={{mixBlendMode: 'multiply'}} opacity="0.4" />
      </svg>

      {/* FLOWER HEAD - Connected to stem top */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ width: "240px", height: "240px", top: "0px" }}
        animate={{
          rotate: cursorAngle * 0.02,
          y: state === "sad" ? 8 : state === "bloom" ? -2 : 0,
          scale: state === "bloom" ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
      >


        {/* Outer Petals Layer - MUCH BIGGER realistic rose petals */}
        {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => (
          <motion.div
            key={`outer-${i}`}
            className="absolute top-1/2 left-1/2 origin-bottom"
            style={{
              rotate: angle + (i % 2 === 0 ? 5 : -5),
              translateX: "-50%",
              translateY: "-100%",
              filter: getColorFilter(),
            }}
            animate={{
              scaleY: getPetalScale(),
              scaleX: getPetalScale() * 0.95,
            }}
            transition={{ type: "spring", stiffness: 80, damping: 15, delay: i * 0.015 }}
          >
            <svg width="75" height="110" viewBox="0 0 75 110">
              <defs>
                <radialGradient id={`roseOuter${i}`} cx="40%" cy="25%" r="75%">
                  <stop offset="0%" stopColor="#ffd4dc" />
                  <stop offset="40%" stopColor="#ffb0bc" />
                  <stop offset="70%" stopColor="#ff8fa0" />
                  <stop offset="100%" stopColor="#e67080" />
                </radialGradient>
                <linearGradient id={`petalEdge${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(180,80,100,0.3)" />
                  <stop offset="50%" stopColor="transparent" />
                  <stop offset="100%" stopColor="rgba(180,80,100,0.3)" />
                </linearGradient>
              </defs>
              <path 
                d="M37 105 Q6 85 3 50 Q1 18 37 2 Q73 18 71 50 Q68 85 37 105"
                fill={`url(#roseOuter${i})`}
              />
              <ellipse cx="37" cy="35" rx="16" ry="24" fill="rgba(255,255,255,0.15)" />
              <path 
                d="M37 105 Q6 85 3 50 Q1 18 37 2 Q73 18 71 50 Q68 85 37 105"
                fill="none"
                stroke={`url(#petalEdge${i})`}
                strokeWidth="1"
              />
              <path d="M37 98 Q34 70 37 42" stroke="rgba(200,100,120,0.12)" strokeWidth="0.5" fill="none" />
            </svg>
          </motion.div>
        ))}

        {/* Middle Petals Layer - Bigger, more curled */}
        {[18, 54, 90, 126, 162, 198, 234, 270, 306, 342].map((angle, i) => (
          <motion.div
            key={`mid-${i}`}
            className="absolute top-1/2 left-1/2 origin-bottom"
            style={{
              rotate: angle,
              translateX: "-50%",
              translateY: "-100%",
              filter: getColorFilter(),
            }}
            animate={{
              scaleY: getPetalScale() * 0.78,
              scaleX: getPetalScale() * 0.75,
            }}
            transition={{ type: "spring", stiffness: 80, damping: 15, delay: i * 0.015 }}
          >
            <svg width="58" height="85" viewBox="0 0 58 85">
              <defs>
                <radialGradient id={`roseMid${i}`} cx="45%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#ffe0e8" />
                  <stop offset="50%" stopColor="#ffc8d4" />
                  <stop offset="100%" stopColor="#ffaab8" />
                </radialGradient>
              </defs>
              <path 
                d="M29 82 Q5 65 3 40 Q1 16 29 3 Q57 16 55 40 Q53 65 29 82"
                fill={`url(#roseMid${i})`}
              />
              <ellipse cx="29" cy="28" rx="12" ry="18" fill="rgba(255,255,255,0.18)" />
            </svg>
          </motion.div>
        ))}

        {/* Inner Petals Layer - Tightly curled center */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <motion.div
            key={`inner-${i}`}
            className="absolute top-1/2 left-1/2 origin-bottom"
            style={{
              rotate: angle + 10,
              translateX: "-50%",
              translateY: "-100%",
              filter: getColorFilter(),
            }}
            animate={{
              scaleY: getPetalScale() * 0.52,
              scaleX: getPetalScale() * 0.48,
            }}
            transition={{ type: "spring", stiffness: 80, damping: 15, delay: i * 0.02 }}
          >
            <svg width="44" height="62" viewBox="0 0 44 62">
              <defs>
                <radialGradient id={`roseInner${i}`} cx="50%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#fff0f3" />
                  <stop offset="100%" stopColor="#ffd8e0" />
                </radialGradient>
              </defs>
              <ellipse cx="22" cy="30" rx="20" ry="28" fill={`url(#roseInner${i})`} />
            </svg>
          </motion.div>
        ))}

        {/* Center Face Area - Larger circular with realistic shading */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center z-10"
          style={{
            width: "100px",
            height: "100px",
            background: "radial-gradient(circle at 35% 35%, #fff5f7, #ffe8ec 40%, #ffd8e0 70%, #ffc8d0)",
            boxShadow: state === "bloom" 
              ? "0 0 40px rgba(255,182,193,0.7), inset 0 2px 10px rgba(255,255,255,0.5)" 
              : "inset 0 2px 10px rgba(255,255,255,0.5), inset 0 -2px 8px rgba(200,150,160,0.2)",
          }}
          animate={{
            scale: state === "bloom" ? 1.1 : 1,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 12 }}
        >
          {/* Face with gentle smile expression by default */}
          <FlowerFace state={state} cursorAngle={cursorAngle} size={1.1} />
        </motion.div>

        {/* Bloom glow effect */}
        {state === "bloom" && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(255,182,193,0.4) 0%, transparent 70%)",
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Rose;


import {motion} from "framer-motion"

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#EDE8E0]">
      {/* Soft background texture */}
      <div className="absolute inset-0 bg-[#f8f7ed]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[15px] uppercase tracking-[0.25em] text-[#5e6043bd]  mb-4 font-normal"
          >
            Every Bloom Tells a Story
          </motion.p>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl text-gray-800 leading-tight mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            <span className="font-normal text-[#3e4026]">Flowers for </span>
            <span className="italic font-normal text-[#5e6043]">Every</span>
            <br/>
            <span className="italic font-normal text-[#5e6043]">Emotion</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-gray-600 max-w-xl  mx-auto leading-relaxed"
          >
            From love to celebration, apology to hope — discover bouquets that 
            speak the language of your heart.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex flex-col items-center gap-2 text-gray-500"
            >
              <span className="text-[11px] tracking-[0.2em] uppercase font-medium">Explore</span>
              <div className="w-px h-12 bg-gradient-to-b from-gray-400 to-transparent opacity-40" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

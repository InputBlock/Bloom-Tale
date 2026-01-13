export default function Hero() {
  return (
    <section
      className="relative h-96 md:h-125 bg-cover bg-center"
      style={{
        backgroundImage: "url(/placeholder.svg?height=500&width=1280&query=anniversary-special-flowers-arrangement)",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-start px-6 md:px-12 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-3">Anniversary Special</h1>
        <p className="text-base md:text-lg text-gray-100 mb-6 leading-relaxed">
          Fresh blooms for milestones, yours or someone special's
        </p>
        <button className="bg-black text-white px-8 py-3 text-sm font-semibold hover:bg-gray-900 transition">
          ORDER NOW
        </button>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        <div className="w-2 h-2 bg-white rounded-full"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
      </div>
    </section>
  )
}

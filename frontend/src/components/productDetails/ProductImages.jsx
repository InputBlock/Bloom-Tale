import { useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

export default function ProductImages({ product }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  
  const images = product?.images_uri?.length > 0 
    ? product.images_uri 
    : []
  
  const hasImages = images.length > 0

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="w-full px-4 sm:px-0">
      <div className="flex gap-0">
        {/* Thumbnails - Left Side (Desktop) */}
        {hasImages && images.length > 1 && (
          <div className="hidden md:flex flex-col gap-2 w-[80px] md:w-[100px] flex-shrink-0 pr-2 md:pr-3">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`w-[75px] md:w-[95px] h-[75px] md:h-[95px] overflow-hidden transition-all rounded-sm ${
                  selectedIndex === index 
                    ? "opacity-100 ring-2 ring-[#3e4026]/30" 
                    : "opacity-50 hover:opacity-100"
                }`}
              >
                <img
                  src={image}
                  alt={`${product?.name || "Product"} ${index + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main Image */}
        <div className="relative group flex-1">
          <div 
            className="relative w-full aspect-[3/4] md:aspect-square bg-[#f9f8f6] overflow-hidden cursor-pointer rounded-sm"
            onClick={() => hasImages && setIsZoomed(true)}
          >
            {hasImages ? (
              <>
                <img
                  src={images[selectedIndex]}
                  alt={product?.name || "Product"}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePrev() }}
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white/95 backdrop-blur-sm rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 md:transition-opacity md:duration-300 hover:bg-[#3e4026] hover:text-white active:scale-95 shadow-lg"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleNext() }}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white/95 backdrop-blur-sm rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 md:transition-opacity md:duration-300 hover:bg-[#3e4026] hover:text-white active:scale-95 shadow-lg"
                      aria-label="Next image"
                    >
                      <ChevronRight size={18} className="sm:w-5 sm:h-5" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase bg-white/95 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[#3e4026] shadow-md rounded-sm backdrop-blur-sm">
                    {selectedIndex + 1} / {images.length}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-300">No Image</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnails - Mobile (Bottom) */}
      {hasImages && images.length > 1 && (
        <div className="flex md:hidden gap-2 sm:gap-2.5 mt-3 sm:mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`w-[70px] h-[70px] sm:w-20 sm:h-20 overflow-hidden transition-all border-2 rounded-sm flex-shrink-0 ${
                selectedIndex === index 
                  ? "border-[#3e4026] opacity-100 ring-1 ring-[#3e4026]/20" 
                  : "border-gray-200 opacity-70 hover:opacity-100 hover:border-[#3e4026]/50"
              }`}
            >
              <img
                src={image}
                alt={`${product?.name || "Product"} ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isZoomed && hasImages && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-sm flex items-center justify-center hover:bg-[#3e4026] hover:text-white active:scale-95 transition-all"
            aria-label="Close"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev() }}
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-sm flex items-center justify-center hover:bg-[#3e4026] hover:text-white active:scale-95 transition-all"
                aria-label="Previous"
              >
                <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext() }}
                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-sm flex items-center justify-center hover:bg-[#3e4026] hover:text-white active:scale-95 transition-all"
                aria-label="Next"
              >
                <ChevronRight size={20} className="sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          <img
            src={images[selectedIndex]}
            alt={product?.name || "Product"}
            className="max-w-[90vw] max-h-[90vh] object-contain object-center"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-white text-xs sm:text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

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
    <div className="w-full space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div 
          className="relative w-full aspect-square bg-[#f9f8f6] rounded-lg overflow-hidden cursor-pointer"
          onClick={() => hasImages && setIsZoomed(true)}
        >
          {hasImages ? (
            <>
              <img
                src={images[selectedIndex]}
                alt={product?.name || "Product"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePrev() }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#3e4026] hover:text-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleNext() }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#3e4026] hover:text-white"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-4 text-[10px] tracking-widest uppercase bg-white rounded-full px-3 py-1.5 text-[#3e4026]">
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

      {/* Thumbnails */}
      {hasImages && images.length > 1 && (
        <div className="flex gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`w-20 h-20 rounded-md overflow-hidden transition-all ${
                selectedIndex === index 
                  ? "ring-2 ring-[#3e4026]" 
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={image}
                alt={`${product?.name || "Product"} ${index + 1}`}
                className="w-full h-full object-cover"
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
            className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-[#3e4026] hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev() }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-[#3e4026] hover:text-white transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext() }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-[#3e4026] hover:text-white transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <img
            src={images[selectedIndex]}
            alt={product?.name || "Product"}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

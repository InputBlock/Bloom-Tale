import { Upload, X, Star } from "lucide-react"

export default function UploadImages({ images, setImages }) {

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: reader.result,
          file: file
        }])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  // Move image to first position (make it main)
  const setAsMain = (id) => {
    setImages(prev => {
      const index = prev.findIndex(img => img.id === id)
      if (index <= 0) return prev
      const newImages = [...prev]
      const [image] = newImages.splice(index, 1)
      newImages.unshift(image)
      return newImages
    })
  }

  return (
    <div>
      <label className="block text-gray-900 font-medium mb-2 sm:mb-3 text-sm sm:text-base">Upload Images</label>
      <p className="text-xs text-gray-500 mb-2">First image will be the main display image</p>
      
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 lg:p-8 text-center hover:border-gray-400 transition cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
          multiple
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <Upload className="mx-auto text-gray-400 mb-2" size={28} />
          <p className="text-gray-500 text-xs sm:text-sm">Click to upload or drag and drop</p>
          <p className="text-gray-400 text-[10px] sm:text-xs mt-1">PNG, JPG, WEBP (max. 5 images)</p>
        </label>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mt-3 sm:mt-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <img 
                src={image.url} 
                alt="Product" 
                className={`w-full h-24 sm:h-28 lg:h-32 object-cover rounded-lg border-2 ${
                  index === 0 ? 'border-green-500' : 'border-gray-200'
                }`}
              />
              {/* Main image badge */}
              {index === 0 && (
                <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-green-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1">
                  <Star size={10} fill="white" className="sm:hidden" />
                  <Star size={12} fill="white" className="hidden sm:block" />
                  <span className="hidden sm:inline">Main</span>
                </div>
              )}
              {/* Set as main button (for non-main images) */}
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => setAsMain(image.id)}
                  className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-white text-gray-700 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow hover:bg-gray-100"
                >
                  <span className="hidden sm:inline">Set as main</span>
                  <span className="sm:hidden">Main</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-0.5 sm:p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
              >
                <X size={12} className="sm:hidden" />
                <X size={16} className="hidden sm:block" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Image Count */}
      {images.length > 0 && (
        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          {images.length} image{images.length !== 1 ? 's' : ''} selected (max 5)
        </p>
      )}
    </div>
  )
}

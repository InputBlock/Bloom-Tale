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
      <label className="block text-gray-900 font-medium mb-3">Upload Images</label>
      <p className="text-xs text-gray-500 mb-2">First image will be the main display image</p>
      
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
          multiple
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <Upload className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-gray-500 text-sm">Click to upload or drag and drop</p>
          <p className="text-gray-400 text-xs mt-1">PNG, JPG, WEBP (max. 5 images)</p>
        </label>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <img 
                src={image.url} 
                alt="Product" 
                className={`w-full h-32 object-cover rounded-lg border-2 ${
                  index === 0 ? 'border-green-500' : 'border-gray-200'
                }`}
              />
              {/* Main image badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Star size={12} fill="white" /> Main
                </div>
              )}
              {/* Set as main button (for non-main images) */}
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => setAsMain(image.id)}
                  className="absolute top-2 left-2 bg-white text-gray-700 text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow hover:bg-gray-100"
                >
                  Set as main
                </button>
              )}
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Image Count */}
      {images.length > 0 && (
        <p className="text-sm text-gray-600 mt-2">
          {images.length} image{images.length !== 1 ? 's' : ''} selected (max 5)
        </p>
      )}
    </div>
  )
}

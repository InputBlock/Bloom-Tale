import { Upload } from "lucide-react"
import { useState } from "react"

export default function UploadImages() {
  const [image, setImage] = useState(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      <label className="block text-gray-900 font-medium mb-3">Upload Images</label>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          {image ? (
            <img src={image} alt="Uploaded" className="max-h-32 mx-auto rounded-lg" />
          ) : (
            <>
              <Upload className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-500 text-sm">Add photo</p>
            </>
          )}
        </label>
      </div>
    </div>
  )
}

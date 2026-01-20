import { useState, useEffect } from "react"
import { heroAPI } from "../../api"

export default function HeroSectionForm({ editingSection, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    surprise_text: "",
    sub_text: "",
    description: "",
  })
  const [media, setMedia] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (editingSection) {
      setFormData({
        surprise_text: editingSection.surprise_text || "",
        sub_text: editingSection.sub_text || "",
        description: editingSection.description || "",
      })
      setPreview(editingSection.media_uri)
    } else {
      resetForm()
    }
  }, [editingSection])

  const resetForm = () => {
    setFormData({
      surprise_text: "",
      sub_text: "",
      description: "",
    })
    setMedia(null)
    setPreview(null)
    setError("")
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMediaChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setMedia(file)
      const url = URL.createObjectURL(file)
      setPreview(url)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("surprise_text", formData.surprise_text)
      formDataToSend.append("sub_text", formData.sub_text)
      formDataToSend.append("description", formData.description)
      
      if (media) {
        formDataToSend.append("media", media)
      }

      if (editingSection) {
        await heroAPI.update(editingSection._id, formDataToSend)
      } else {
        await heroAPI.add(formDataToSend)
      }

      resetForm()
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save hero section")
    } finally {
      setLoading(false)
    }
  }

  const isVideo = (url) => {
    if (!url) return false
    return url.match(/\.(mp4|webm|mov|avi)$/i) || media?.type?.startsWith("video/")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Media Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Media (Image or Video) {!editingSection && <span className="text-red-500">*</span>}
        </label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleMediaChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required={!editingSection}
        />
        {preview && (
          <div className="mt-3">
            {isVideo(preview) ? (
              <video
                src={preview}
                controls
                className="w-full h-40 object-cover rounded-lg"
              />
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg"
              />
            )}
          </div>
        )}
      </div>

      {/* Surprise Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Surprise Text <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="surprise_text"
          value={formData.surprise_text}
          onChange={handleInputChange}
          placeholder="e.g., Surprise Your Valentine!"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>

      {/* Sub Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sub Text <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="sub_text"
          value={formData.sub_text}
          onChange={handleInputChange}
          placeholder="e.g., Let us arrange a smile."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter description..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? "Saving..." : editingSection ? "Update" : "Add Hero Section"}
        </button>
        {editingSection && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

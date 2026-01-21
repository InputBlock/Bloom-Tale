import { useState } from "react"
import { heroAPI } from "../../api"

export default function HeroSectionList({ sections, loading, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(null)

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this hero section?")) return

    setDeleting(id)
    try {
      await heroAPI.delete(id)
      onDelete()
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Failed to delete hero section")
    } finally {
      setDeleting(null)
    }
  }

  const isVideo = (url) => {
    if (!url) return false
    return url.match(/\.(mp4|webm|mov|avi)$/i)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (sections.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No hero sections yet. Add one to get started!
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[600px] overflow-y-auto">
      {sections.map((section) => (
        <div
          key={section._id}
          className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
        >
          {/* Media Preview */}
          <div className="mb-2 sm:mb-3">
            {isVideo(section.media_uri) ? (
              <video
                src={section.media_uri}
                className="w-full h-24 sm:h-32 object-cover rounded-lg"
                muted
              />
            ) : (
              <img
                src={section.media_uri}
                alt={section.surprise_text}
                className="w-full h-24 sm:h-32 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Content */}
          <div className="space-y-0.5 sm:space-y-1">
            <h3 className="font-semibold text-sm sm:text-base text-gray-800 truncate">
              {section.surprise_text}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 truncate">{section.sub_text}</p>
            <p className="text-xs text-gray-500 line-clamp-2">
              {section.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-3 sm:mt-4">
            <button
              onClick={() => onEdit(section)}
              className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(section._id)}
              disabled={deleting === section._id}
              className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              {deleting === section._id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Save, X, Image as ImageIcon } from 'lucide-react'
import { aboutAPI } from '../../api'

const ICON_OPTIONS = ['Leaf', 'Heart', 'Award', 'Star', 'Check', 'Flower']

export default function AboutSectionForm() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [section, setSection] = useState(null)
  const [formData, setFormData] = useState({
    badge_number: '7+',
    badge_text: 'Years of Excellence',
    title_line1: 'We Create Beautiful',
    title_line2: 'Floral Experiences',
    description: '',
    features: [
      { icon: 'Leaf', text: 'Farm Fresh' },
      { icon: 'Heart', text: 'Handcrafted' },
      { icon: 'Award', text: 'Premium Quality' }
    ]
  })
  const [images, setImages] = useState([null, null, null])
  const [previews, setPreviews] = useState([null, null, null])
  const [existingImages, setExistingImages] = useState([])
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchAboutSection()
  }, [])

  const fetchAboutSection = async () => {
    setLoading(true)
    try {
      const response = await aboutAPI.getAll()
      if (response.data.success && response.data.data.length > 0) {
        const activeSection = response.data.data.find(s => s.isActive) || response.data.data[0]
        setSection(activeSection)
        setFormData({
          badge_number: activeSection.badge_number || '7+',
          badge_text: activeSection.badge_text || 'Years of Excellence',
          title_line1: activeSection.title_line1 || 'We Create Beautiful',
          title_line2: activeSection.title_line2 || 'Floral Experiences',
          description: activeSection.description || '',
          features: activeSection.features?.length > 0 ? activeSection.features : [
            { icon: 'Leaf', text: 'Farm Fresh' },
            { icon: 'Heart', text: 'Handcrafted' },
            { icon: 'Award', text: 'Premium Quality' }
          ]
        })
        setExistingImages(activeSection.images || [])
        setPreviews(activeSection.images?.map(img => img.url) || [null, null, null])
      }
    } catch (error) {
      console.error('Failed to fetch about section:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = { ...newFeatures[index], [field]: value }
    setFormData(prev => ({ ...prev, features: newFeatures }))
  }

  const handleImageChange = (index, e) => {
    const file = e.target.files[0]
    if (file) {
      const newImages = [...images]
      newImages[index] = file
      setImages(newImages)

      const reader = new FileReader()
      reader.onloadend = () => {
        const newPreviews = [...previews]
        newPreviews[index] = reader.result
        setPreviews(newPreviews)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (index) => {
    const newImages = [...images]
    newImages[index] = null
    setImages(newImages)

    const newPreviews = [...previews]
    newPreviews[index] = existingImages[index]?.url || null
    setPreviews(newPreviews)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const formDataToSend = new FormData()
      
      // Add text fields
      formDataToSend.append('badge_number', formData.badge_number)
      formDataToSend.append('badge_text', formData.badge_text)
      formDataToSend.append('title_line1', formData.title_line1)
      formDataToSend.append('title_line2', formData.title_line2)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('features', JSON.stringify(formData.features))

      // Add new images
      images.forEach((img) => {
        if (img) {
          formDataToSend.append('images', img)
        }
      })

      let response
      if (section) {
        // Update existing
        response = await aboutAPI.update(section._id, formDataToSend)
      } else {
        // Create new
        response = await aboutAPI.create(formDataToSend)
      }

      if (response.data.success) {
        setMessage({ type: 'success', text: 'About section saved successfully!' })
        fetchAboutSection()
        setImages([null, null, null])
      }
    } catch (error) {
      console.error('Failed to save about section:', error)
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save about section' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3e4026]"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">About Section</h2>

      {message.text && (
        <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Images (3 images for the grid)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((index) => (
              <div key={index} className="relative">
                <div className={`aspect-square border-2 border-dashed rounded-lg overflow-hidden ${previews[index] ? 'border-[#3e4026]' : 'border-gray-300'} flex items-center justify-center bg-gray-50`}>
                  {previews[index] ? (
                    <>
                      <img
                        src={previews[index]}
                        alt={`About image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {images[index] && (
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">Image {index + 1}</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(index, e)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Badge */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Badge Number</label>
            <input
              type="text"
              name="badge_number"
              value={formData.badge_number}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4026]/20 focus:border-[#3e4026]"
              placeholder="7+"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
            <input
              type="text"
              name="badge_text"
              value={formData.badge_text}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4026]/20 focus:border-[#3e4026]"
              placeholder="Years of Excellence"
            />
          </div>
        </div>

        {/* Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title Line 1</label>
            <input
              type="text"
              name="title_line1"
              value={formData.title_line1}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4026]/20 focus:border-[#3e4026]"
              placeholder="We Create Beautiful"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title Line 2 (Italic)</label>
            <input
              type="text"
              name="title_line2"
              value={formData.title_line2}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4026]/20 focus:border-[#3e4026]"
              placeholder="Floral Experiences"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4026]/20 focus:border-[#3e4026]"
            placeholder="At Bloom Tale, every bouquet tells a story..."
          />
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Features (3 items)</label>
          <div className="space-y-3">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-3">
                <select
                  value={feature.icon}
                  onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                  className="w-full sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4026]/20 focus:border-[#3e4026]"
                >
                  {ICON_OPTIONS.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={feature.text}
                  onChange={(e) => handleFeatureChange(index, 'text', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4026]/20 focus:border-[#3e4026]"
                  placeholder="Feature text"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#3e4026] text-white py-3 rounded-lg font-medium hover:bg-[#2d2f1c] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save About Section
            </>
          )}
        </button>
      </form>
    </div>
  )
}

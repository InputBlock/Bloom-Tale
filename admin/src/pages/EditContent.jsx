import { useState, useEffect } from "react"
import { heroAPI } from "../api"
import HeroSectionForm from "../components/EditContent/HeroSectionForm"
import HeroSectionList from "../components/EditContent/HeroSectionList"

export default function EditContent() {
  const [heroSections, setHeroSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState(null)

  const fetchHeroSections = async () => {
    try {
      setLoading(true)
      const response = await heroAPI.getAll()
      // Handle ApiResponse format: { statusCode, data, message }
      const sections = response.data?.data || response.data || []
      setHeroSections(Array.isArray(sections) ? sections : [])
    } catch (error) {
      console.error("Failed to fetch hero sections:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHeroSections()
  }, [])

  const handleEdit = (section) => {
    setEditingSection(section)
  }

  const handleCancelEdit = () => {
    setEditingSection(null)
  }

  const handleSuccess = () => {
    setEditingSection(null)
    fetchHeroSections()
  }

  return (
    <div className="max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
            {editingSection ? "Edit Hero Section" : "Add Hero Section"}
          </h2>
          <HeroSectionForm
            editingSection={editingSection}
            onSuccess={handleSuccess}
            onCancel={handleCancelEdit}
          />
        </div>

        {/* List Section */}
        <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Hero Sections</h2>
          <HeroSectionList
            sections={heroSections}
            loading={loading}
            onEdit={handleEdit}
            onDelete={fetchHeroSections}
          />
        </div>
      </div>
    </div>
  )
}

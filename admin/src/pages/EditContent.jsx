import { useState, useEffect } from "react"
import { API_ENDPOINTS } from "../config/api"
import HeroSectionForm from "../components/EditContent/HeroSectionForm"
import HeroSectionList from "../components/EditContent/HeroSectionList"

export default function EditContent() {
  const [heroSections, setHeroSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState(null)

  const fetchHeroSections = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_ENDPOINTS.GET_HERO_SECTIONS, {
        credentials: "include",
      })
      const data = await response.json()
      setHeroSections(data)
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6">
            {editingSection ? "Edit Hero Section" : "Add Hero Section"}
          </h2>
          <HeroSectionForm
            editingSection={editingSection}
            onSuccess={handleSuccess}
            onCancel={handleCancelEdit}
          />
        </div>

        {/* List Section */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6">Hero Sections</h2>
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

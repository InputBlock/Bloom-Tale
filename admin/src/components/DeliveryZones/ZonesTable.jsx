import { useState, useEffect } from "react"
import { Plus, Loader2, MapPin } from "lucide-react"
import axios from "axios"
import ZoneCard from "./ZoneCard"
import ZoneModal from "./ZoneModal"
import AddPincodesModal from "./AddPincodesModal"

const API_URL = "/api/v1/delivery"

export default function ZonesTable() {
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  
  const [expandedZone, setExpandedZone] = useState(null)
  const [expandedData, setExpandedData] = useState(null)
  
  const [showModal, setShowModal] = useState(false)
  const [editingZone, setEditingZone] = useState(null)
  const [addPincodesZone, setAddPincodesZone] = useState(null)

  useEffect(() => {
    fetchZones()
  }, [])

  const fetchZones = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/zones`)
      if (res.data?.data?.zones) {
        setZones(res.data.data.zones)
      }
    } catch (err) {
      setError("Failed to load zones")
    } finally {
      setLoading(false)
    }
  }

  const fetchZoneDetails = async (zoneId) => {
    try {
      const res = await axios.get(`${API_URL}/zones/${zoneId}`)
      return res.data?.data
    } catch (err) {
      return null
    }
  }

  const handleExpand = async (zoneId) => {
    if (expandedZone === zoneId) {
      setExpandedZone(null)
      setExpandedData(null)
    } else {
      const data = await fetchZoneDetails(zoneId)
      setExpandedZone(zoneId)
      setExpandedData(data)
    }
  }

  const handleSaveZone = async (data, isEdit) => {
    setSaving(true)
    try {
      if (isEdit) {
        await axios.put(`${API_URL}/zones/${data.zone_id}`, data)
      } else {
        await axios.post(`${API_URL}/zones`, data)
      }
      setShowModal(false)
      setEditingZone(null)
      fetchZones()
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save zone")
    } finally {
      setSaving(false)
    }
  }

  const handleAddPincodes = async (zoneId, pincodes) => {
    setSaving(true)
    try {
      await axios.post(`${API_URL}/zones/${zoneId}/pincodes`, { pincodes })
      setAddPincodesZone(null)
      fetchZones()
      if (expandedZone === zoneId) {
        const data = await fetchZoneDetails(zoneId)
        setExpandedData(data)
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add pincodes")
    } finally {
      setSaving(false)
    }
  }

  const handleRemovePincode = async (zoneId, pincode) => {
    if (!confirm(`Remove ${pincode}?`)) return
    try {
      await axios.delete(`${API_URL}/zones/${zoneId}/pincodes`, { 
        data: { pincodes: [pincode] }
      })
      fetchZones()
      if (expandedZone === zoneId) {
        const data = await fetchZoneDetails(zoneId)
        setExpandedData(data)
      }
    } catch (err) {
      alert("Failed to remove pincode")
    }
  }

  const handleDelete = async (zoneId) => {
    if (!confirm(`Delete zone ${zoneId}?`)) return
    try {
      await axios.delete(`${API_URL}/zones/${zoneId}`)
      fetchZones()
    } catch (err) {
      alert("Failed to delete zone")
    }
  }

  const handleToggleActive = async (zone) => {
    try {
      await axios.put(`${API_URL}/zones/${zone.id}`, { isActive: !zone.isActive })
      fetchZones()
    } catch (err) {
      alert("Failed to update status")
    }
  }

  const handleEdit = (zone) => {
    setEditingZone({
      zone_id: zone.id,
      name: zone.name,
      description: zone.description,
      pricing: zone.pricing,
      isActive: zone.isActive
    })
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={fetchZones} className="px-4 py-2 bg-black text-white rounded">
          Retry
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-500">{zones.length} zones configured</p>
        </div>
        <button
          onClick={() => { setEditingZone(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          <Plus size={18} />
          Add Zone
        </button>
      </div>

      {/* Zones List */}
      <div className="space-y-3">
        {zones.map((zone) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            isExpanded={expandedZone === zone.id}
            expandedData={expandedData}
            onExpand={handleExpand}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            onAddPincodes={(id) => setAddPincodesZone({ id, name: zone.name })}
            onRemovePincode={handleRemovePincode}
          />
        ))}
      </div>

      {zones.length === 0 && (
        <div className="text-center py-16 bg-white rounded-lg border">
          <MapPin size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No delivery zones yet</p>
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <ZoneModal
          zone={editingZone}
          onClose={() => { setShowModal(false); setEditingZone(null); }}
          onSave={handleSaveZone}
          saving={saving}
        />
      )}

      {addPincodesZone && (
        <AddPincodesModal
          zoneId={addPincodesZone.id}
          zoneName={addPincodesZone.name}
          onClose={() => setAddPincodesZone(null)}
          onSave={handleAddPincodes}
          saving={saving}
        />
      )}
    </>
  )
}

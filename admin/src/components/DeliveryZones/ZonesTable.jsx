import { useState, useEffect } from "react"
import { Plus, Loader2, MapPin } from "lucide-react"
import { deliveryAPI } from "../../api"
import ZoneCard from "./ZoneCard"
import ZoneModal from "./ZoneModal"
import AddPincodesModal from "./AddPincodesModal"

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
      const res = await deliveryAPI.getAllZones()
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
      const res = await deliveryAPI.getZoneById(zoneId)
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
        await deliveryAPI.updateZone(data.zone_id, data)
      } else {
        await deliveryAPI.createZone(data)
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
      await deliveryAPI.addPincodes(zoneId, pincodes)
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
      await deliveryAPI.removePincodes(zoneId, [pincode])
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
      await deliveryAPI.deleteZone(zoneId)
      fetchZones()
    } catch (err) {
      alert("Failed to delete zone")
    }
  }

  const handleToggleActive = async (zone) => {
    try {
      await deliveryAPI.updateZone(zone.id, { isActive: !zone.isActive })
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
      <div className="flex items-center justify-center py-12 sm:py-20">
        <Loader2 className="w-6 sm:w-8 h-6 sm:h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 sm:py-20">
        <p className="text-red-500 mb-4 text-sm sm:text-base">{error}</p>
        <button onClick={fetchZones} className="px-3 sm:px-4 py-2 bg-black text-white rounded text-sm sm:text-base">
          Retry
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div>
          <p className="text-gray-500 text-sm sm:text-base">{zones.length} zones configured</p>
        </div>
        <button
          onClick={() => { setEditingZone(null); setShowModal(true); }}
          className="flex items-center justify-center gap-2 bg-black text-white px-3 sm:px-4 py-2 rounded hover:bg-gray-800 text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus size={16} />
          Add Zone
        </button>
      </div>

      {/* Zones List */}
      <div className="space-y-2 sm:space-y-3">
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
        <div className="text-center py-12 sm:py-16 bg-white rounded-lg border">
          <MapPin size={32} className="mx-auto text-gray-300 mb-2 sm:mb-3" />
          <p className="text-gray-500 text-sm sm:text-base">No delivery zones yet</p>
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

import { useState } from "react"
import { X, Loader2 } from "lucide-react"

export default function ZoneModal({ zone, onClose, onSave, saving }) {
  const isEdit = !!zone?.zone_id
  
  const [form, setForm] = useState({
    zone_id: zone?.zone_id || "",
    name: zone?.name || "",
    description: zone?.description || "",
    pincodes: "",
    pricing: zone?.pricing || { fixed_time: 0, midnight: 0, express: 0 },
    isActive: zone?.isActive ?? true
  })

  const handleSubmit = () => {
    if (!form.zone_id || !form.name) return
    
    const data = {
      zone_id: form.zone_id,
      name: form.name,
      description: form.description,
      pricing: form.pricing,
      isActive: form.isActive
    }
    
    // Only add pincodes for new zones
    if (!isEdit && form.pincodes) {
      data.pincodes = form.pincodes
        .split(/[,\n]/)
        .map(p => p.trim())
        .filter(p => p.length === 6)
    }
    
    onSave(data, isEdit)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex justify-between items-center p-3 sm:p-4 border-b z-10">
          <h3 className="font-semibold text-base sm:text-lg">{isEdit ? 'Edit Zone' : 'Add Zone'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={18} />
          </button>
        </div>

        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Zone ID</label>
              <input
                type="text"
                placeholder="ZONE9"
                value={form.zone_id}
                onChange={(e) => setForm({ ...form, zone_id: e.target.value.toUpperCase() })}
                disabled={isEdit}
                className="w-full border rounded px-2 sm:px-3 py-2 text-xs sm:text-sm disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="Zone Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded px-2 sm:px-3 py-2 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              placeholder="Areas covered"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded px-2 sm:px-3 py-2 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Pricing (₹)</label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              <div>
                <label className="text-[10px] sm:text-xs text-gray-500">Fixed Time</label>
                <input
                  type="number"
                  value={form.pricing.fixed_time}
                  onChange={(e) => setForm({
                    ...form,
                    pricing: { ...form.pricing, fixed_time: Number(e.target.value) }
                  })}
                  className="w-full border rounded px-2 sm:px-3 py-2 text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] sm:text-xs text-gray-500">Midnight</label>
                <input
                  type="number"
                  value={form.pricing.midnight}
                  onChange={(e) => setForm({
                    ...form,
                    pricing: { ...form.pricing, midnight: Number(e.target.value) }
                  })}
                  className="w-full border rounded px-2 sm:px-3 py-2 text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] sm:text-xs text-gray-500">Express</label>
                <input
                  type="number"
                  value={form.pricing.express}
                  onChange={(e) => setForm({
                    ...form,
                    pricing: { ...form.pricing, express: Number(e.target.value) }
                  })}
                  className="w-full border rounded px-2 sm:px-3 py-2 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {!isEdit && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Pincodes</label>
              <textarea
                placeholder="400001, 400002, 400003..."
                value={form.pincodes}
                onChange={(e) => setForm({ ...form, pincodes: e.target.value })}
                rows={3}
                className="w-full border rounded px-2 sm:px-3 py-2 text-xs sm:text-sm"
              />
            </div>
          )}

          {isEdit && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="rounded w-4 h-4"
              />
              <span className="text-xs sm:text-sm text-gray-700">Zone Active</span>
            </label>
          )}
        </div>

        <div className="sticky bottom-0 p-3 sm:p-4 border-t bg-gray-50 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-3 sm:px-4 py-2 border rounded text-xs sm:text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !form.zone_id || !form.name}
            className="flex-1 px-3 sm:px-4 py-2 bg-black text-white rounded text-xs sm:text-sm hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {isEdit ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

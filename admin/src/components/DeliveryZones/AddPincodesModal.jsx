import { useState } from "react"
import { X, Loader2 } from "lucide-react"

export default function AddPincodesModal({ zoneId, zoneName, onClose, onSave, saving }) {
  const [pincodes, setPincodes] = useState("")

  const handleSubmit = () => {
    const pincodeArray = pincodes
      .split(/[,\n]/)
      .map(p => p.trim())
      .filter(p => p.length === 6)

    if (pincodeArray.length === 0) return
    onSave(zoneId, pincodeArray)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold">Add Pincodes to {zoneName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter pincodes (comma or line separated)
          </label>
          <textarea
            placeholder="400001, 400002, 400003..."
            value={pincodes}
            onChange={(e) => setPincodes(e.target.value)}
            rows={5}
            className="w-full border rounded px-3 py-2 text-sm"
            autoFocus
          />
        </div>

        <div className="p-4 border-t bg-gray-50 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border rounded text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !pincodes.trim()}
            className="flex-1 px-4 py-2 bg-black text-white rounded text-sm hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Add Pincodes
          </button>
        </div>
      </div>
    </div>
  )
}

import { Edit2, Trash2, ChevronDown, ChevronUp, MapPin } from "lucide-react"

export default function ZoneCard({ 
  zone, 
  isExpanded, 
  onExpand, 
  onEdit, 
  onDelete, 
  onToggleActive,
  expandedData,
  onAddPincodes,
  onRemovePincode
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Zone Row */}
      <div className="p-4 flex items-center justify-between hover:bg-gray-50">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${zone.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
          <div>
            <h3 className="font-semibold text-gray-900">{zone.name}</h3>
            <p className="text-sm text-gray-500">{zone.id} • {zone.pincodeCount} pincodes</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Pricing */}
          <div className="hidden md:flex gap-4 text-sm">
            <div className="text-center px-3">
              <p className="text-xs text-gray-500">Fixed</p>
              <p className="font-semibold">₹{zone.pricing.fixed_time}</p>
            </div>
            <div className="text-center px-3">
              <p className="text-xs text-gray-500">Midnight</p>
              <p className="font-semibold">₹{zone.pricing.midnight}</p>
            </div>
            <div className="text-center px-3">
              <p className="text-xs text-gray-500">Express</p>
              <p className="font-semibold">{zone.pricing.express > 0 ? `₹${zone.pricing.express}` : 'N/A'}</p>
            </div>
          </div>

          {/* Status Toggle */}
          <button
            onClick={() => onToggleActive(zone)}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              zone.isActive 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {zone.isActive ? 'Active' : 'Inactive'}
          </button>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(zone)} className="p-2 hover:bg-gray-100 rounded">
              <Edit2 size={16} className="text-gray-600" />
            </button>
            <button onClick={() => onDelete(zone.id)} className="p-2 hover:bg-red-50 rounded">
              <Trash2 size={16} className="text-red-500" />
            </button>
            <button onClick={() => onExpand(zone.id)} className="p-2 hover:bg-gray-100 rounded">
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Pincodes */}
      {isExpanded && expandedData && (
        <div className="border-t bg-gray-50 p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-600 font-medium">
              Pincodes ({expandedData.pincodes?.length || 0})
            </p>
            <button
              onClick={() => onAddPincodes(zone.id)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + Add Pincodes
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {expandedData.pincodes?.map((pin) => (
              <span
                key={pin}
                className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full border text-sm group"
              >
                <MapPin size={12} className="text-gray-400" />
                {pin}
                <button
                  onClick={() => onRemovePincode(zone.id, pin)}
                  className="ml-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

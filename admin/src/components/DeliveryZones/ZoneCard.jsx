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
      <div className="p-3 sm:p-4">
        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${zone.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{zone.name}</h3>
                <p className="text-xs text-gray-500">{zone.id} • {zone.pincodeCount} pincodes</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => onEdit(zone)} className="p-1.5 hover:bg-gray-100 rounded">
                <Edit2 size={14} className="text-gray-600" />
              </button>
              <button onClick={() => onDelete(zone.id)} className="p-1.5 hover:bg-red-50 rounded">
                <Trash2 size={14} className="text-red-500" />
              </button>
              <button onClick={() => onExpand(zone.id)} className="p-1.5 hover:bg-gray-100 rounded">
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>

          {/* Mobile Pricing */}
          <div className="flex items-center justify-between">
            <div className="grid grid-cols-4 gap-2 text-xs flex-1">
              <div className="text-center bg-gray-50 rounded p-1.5">
                <p className="text-[10px] text-gray-500">Fixed</p>
                <p className="font-semibold">₹{zone.pricing.fixed_time}</p>
              </div>
              <div className="text-center bg-gray-50 rounded p-1.5">
                <p className="text-[10px] text-gray-500">Midnight</p>
                <p className="font-semibold">₹{zone.pricing.midnight}</p>
              </div>
              <div className="text-center bg-gray-50 rounded p-1.5">
                <p className="text-[10px] text-gray-500">Express</p>
                <p className="font-semibold">{zone.pricing.express > 0 ? `₹${zone.pricing.express}` : 'N/A'}</p>
              </div>
              <div className="text-center bg-blue-50 rounded p-1.5">
                <p className="text-[10px] text-gray-500">Standard</p>
                <p className="font-semibold">{zone.pricing.standard > 0 ? `₹${zone.pricing.standard}` : 'Free'}</p>
              </div>
            </div>
            <button
              onClick={() => onToggleActive(zone)}
              className={`ml-3 px-2 py-1 rounded-full text-[10px] font-medium flex-shrink-0 ${
                zone.isActive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {zone.isActive ? 'Active' : 'Inactive'}
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between hover:bg-gray-50 -m-3 sm:-m-4 p-3 sm:p-4">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className={`w-3 h-3 rounded-full ${zone.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
            <div>
              <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{zone.name}</h3>
              <p className="text-xs lg:text-sm text-gray-500">{zone.id} • {zone.pincodeCount} pincodes</p>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            {/* Pricing */}
            <div className="flex gap-3 lg:gap-4 text-xs lg:text-sm">
              <div className="text-center px-2 lg:px-3">
                <p className="text-[10px] lg:text-xs text-gray-500">Fixed</p>
                <p className="font-semibold">₹{zone.pricing.fixed_time}</p>
              </div>
              <div className="text-center px-2 lg:px-3">
                <p className="text-[10px] lg:text-xs text-gray-500">Midnight</p>
                <p className="font-semibold">₹{zone.pricing.midnight}</p>
              </div>
              <div className="text-center px-2 lg:px-3">
                <p className="text-[10px] lg:text-xs text-gray-500">Express</p>
                <p className="font-semibold">{zone.pricing.express > 0 ? `₹${zone.pricing.express}` : 'N/A'}</p>
              </div>
              <div className="text-center px-2 lg:px-3 bg-blue-50 rounded">
                <p className="text-[10px] lg:text-xs text-gray-500">Standard</p>
                <p className="font-semibold">{zone.pricing.standard > 0 ? `₹${zone.pricing.standard}` : 'Free'}</p>
              </div>
            </div>

            {/* Status Toggle */}
            <button
              onClick={() => onToggleActive(zone)}
              className={`px-2 lg:px-3 py-1 rounded-full text-[10px] lg:text-xs font-medium ${
                zone.isActive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {zone.isActive ? 'Active' : 'Inactive'}
            </button>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button onClick={() => onEdit(zone)} className="p-1.5 lg:p-2 hover:bg-gray-100 rounded">
                <Edit2 size={15} className="text-gray-600" />
              </button>
              <button onClick={() => onDelete(zone.id)} className="p-1.5 lg:p-2 hover:bg-red-50 rounded">
                <Trash2 size={15} className="text-red-500" />
              </button>
              <button onClick={() => onExpand(zone.id)} className="p-1.5 lg:p-2 hover:bg-gray-100 rounded">
                {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Pincodes */}
      {isExpanded && expandedData && (
        <div className="border-t bg-gray-50 p-3 sm:p-4">
          <div className="flex justify-between items-center mb-2 sm:mb-3">
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              Pincodes ({expandedData.pincodes?.length || 0})
            </p>
            <button
              onClick={() => onAddPincodes(zone.id)}
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-700"
            >
              + Add Pincodes
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {expandedData.pincodes?.map((pin) => (
              <span
                key={pin}
                className="inline-flex items-center gap-1 bg-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border text-xs sm:text-sm group"
              >
                <MapPin size={10} className="text-gray-400" />
                {pin}
                <button
                  onClick={() => onRemovePincode(zone.id, pin)}
                  className="ml-0.5 sm:ml-1 text-gray-400 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100"
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

import { ChevronDown, ChevronUp, Package, Trash2 } from "lucide-react"

export default function ComboCartItem({ 
  item, 
  comboNumber,
  isExpanded, 
  onToggleDetails, 
  onRemove 
}) {
  const comboImages = item.combo_items?.map(ci => ci.image).filter(Boolean) || []

  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Combo Image Collage */}
            <ComboImageCollage images={comboImages} />

            {/* Combo Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <h3 className="text-base sm:text-xl md:text-2xl font-bold text-[#3e4026]">
                  Combo {comboNumber}
                </h3>
                <span className="bg-green-100 text-green-700 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold">
                  {item.discount_percentage}% OFF
                </span>
              </div>
              
              <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                {item.combo_items?.length || 0} items • Delivery: ₹{item.delivery_charge}
              </p>

              <button
                onClick={onToggleDetails}
                className="inline-flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold text-[#3e4026] hover:text-[#2d2f1c] transition-colors border-b-2 border-transparent hover:border-[#3e4026] pb-0.5"
              >
                {isExpanded ? 'Hide Details' : 'View Details'}
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {/* Price & Delete */}
            <div className="flex flex-col items-end gap-2 sm:gap-3">
              <div className="text-right">
                <p className="text-[10px] sm:text-sm text-gray-500 line-through">
                  ₹{item.subtotal?.toLocaleString()}
                </p>
                <p className="text-base sm:text-xl md:text-2xl font-bold text-[#3e4026]">
                  ₹{item.price?.toLocaleString()}
                </p>
                <p className="text-[10px] sm:text-xs text-green-600 font-semibold">
                  Saved ₹{item.discount?.toLocaleString()}
                </p>
              </div>

              <button
                onClick={onRemove}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition p-2 sm:p-2.5 rounded-lg border border-gray-300 hover:border-red-300"
                aria-label="Remove combo"
              >
                <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && item.combo_items && (
          <ComboExpandedDetails item={item} />
        )}
      </div>
    </div>
  )
}

// Combo Image Collage Component
function ComboImageCollage({ images }) {
  if (images.length === 0) {
    return (
      <div className="flex-shrink-0">
        <div className="w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center bg-gradient-to-br from-[#3e4026]/10 to-[#3e4026]/5 rounded-xl border-2 border-[#3e4026]/20">
          <Package className="w-8 h-8 sm:w-10 sm:h-10 text-[#3e4026]/40" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-shrink-0">
      <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-[#3e4026]/20 shadow-md">
        {images.length === 1 ? (
          <img src={images[0]} alt="Combo item" className="w-full h-full object-cover" />
        ) : images.length === 2 ? (
          <div className="grid grid-cols-2 w-full h-full">
            <img src={images[0]} alt="Item 1" className="w-full h-full object-cover" />
            <img src={images[1]} alt="Item 2" className="w-full h-full object-cover" />
          </div>
        ) : images.length === 3 ? (
          <>
            <img src={images[0]} alt="Item 1" className="absolute top-0 left-0 w-1/2 h-full object-cover" />
            <img src={images[1]} alt="Item 2" className="absolute top-0 right-0 w-1/2 h-1/2 object-cover" />
            <img src={images[2]} alt="Item 3" className="absolute bottom-0 right-0 w-1/2 h-1/2 object-cover" />
          </>
        ) : (
          <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
            {images.slice(0, 4).map((img, idx) => (
              <img key={idx} src={img} alt={`Item ${idx + 1}`} className="w-full h-full object-cover" />
            ))}
          </div>
        )}
        <div className="absolute top-1 left-1 bg-[#3e4026] text-white px-1.5 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold shadow-lg">
          {images.length} Items
        </div>
      </div>
    </div>
  )
}

// Combo Expanded Details Component
function ComboExpandedDetails({ item }) {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Items in this Combo</h4>
      <div className="space-y-3">
        {item.combo_items.map((comboItem, idx) => (
          <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0">
              {comboItem.image ? (
                <img
                  src={comboItem.image}
                  alt={comboItem.name}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-lg">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                {comboItem.name}
              </h5>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                {comboItem.size && (
                  <span className="px-2 py-0.5 bg-white border border-gray-300 rounded-full font-medium">
                    {comboItem.size}
                  </span>
                )}
                {comboItem.color && (
                  <span className="flex items-center gap-1">
                    <div 
                      className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: comboItem.color.hex }}
                    />
                    <span>{comboItem.color.name}</span>
                  </span>
                )}
                <span className="font-semibold">Qty: {comboItem.quantity}</span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">
                ₹{(comboItem.price * comboItem.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Summary */}
      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">₹{item.subtotal?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery</span>
            <span className="font-semibold">₹{item.delivery_charge?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-green-700">
            <span className="font-semibold">Discount ({item.discount_percentage}%)</span>
            <span className="font-bold">-₹{item.discount?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-green-300">
            <span className="font-bold text-[#3e4026]">Total</span>
            <span className="font-bold text-[#3e4026] text-lg">₹{item.price?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

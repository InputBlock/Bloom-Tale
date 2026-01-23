import { ChevronDown, ChevronUp, Package, Trash2 } from "lucide-react"

export default function ComboCartItem({ 
  item, 
  comboNumber,
  isExpanded, 
  onToggleDetails, 
  onRemove,
  isFreeDelivery = false
}) {
  // Get images from populated product data or fallback to direct image field
  const comboImages = item.combo_items?.map(ci => {
    // First try to get from populated product
    if (ci.product?.images_uri && ci.product.images_uri.length > 0) {
      return ci.product.images_uri[0];
    }
    // Fallback to image field if it exists
    return ci.image;
  }).filter(Boolean) || []

  return (
    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden">
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Left Section: Image + Basic Info */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {/* Combo Image Collage */}
            <ComboImageCollage images={comboImages} />

            {/* Combo Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="text-sm sm:text-lg font-bold text-[#3e4026]">
                  Combo {comboNumber}
                </h3>
                <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold">
                  {item.discount_percentage}% OFF
                </span>
              </div>

              <button
                onClick={onToggleDetails}
                className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-gray-600 hover:text-[#3e4026] transition-colors"
              >
                {isExpanded ? 'Hide Details' : 'View Details'}
                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>
          </div>

          {/* Right Section: Pricing Info, Items Count, Delivery */}
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
            {/* Items & Delivery Info */}
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-gray-700">
                {item.combo_items?.length || 0} Items
              </p>
              <p className="text-[10px] text-gray-500">
                Delivery: {isFreeDelivery ? (
                  <span className="text-green-600 font-medium">FREE</span>
                ) : (
                  `₹${item.delivery_charge}`
                )}
              </p>
            </div>

            {/* Price Info */}
            <div className="text-right">
              <p className="text-[9px] sm:text-[10px] text-gray-400 line-through leading-tight">
                ₹{item.subtotal?.toLocaleString()}
              </p>
              <p className="text-base sm:text-xl font-bold text-[#3e4026] leading-tight">
                ₹{item.price?.toLocaleString()}
              </p>
              <p className="text-[9px] sm:text-[10px] text-green-600 font-semibold leading-tight">
                Saved ₹{item.discount?.toLocaleString()}
              </p>
            </div>

            {/* Delete Button */}
            <button
              onClick={onRemove}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition p-1.5 sm:p-2 rounded-lg border border-gray-200 hover:border-red-300"
              aria-label="Remove combo"
            >
              <Trash2 size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && item.combo_items && (
          <ComboExpandedDetails item={item} isFreeDelivery={isFreeDelivery} />
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
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-gradient-to-br from-[#3e4026]/10 to-[#3e4026]/5 rounded-lg border border-[#3e4026]/20">
          <Package className="w-6 h-6 sm:w-8 sm:h-8 text-[#3e4026]/40" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-shrink-0">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-[#3e4026]/20 shadow-sm">
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
        <div className="absolute top-0.5 left-0.5 bg-[#3e4026] text-white px-1 py-0.5 rounded-full text-[7px] sm:text-[8px] font-bold shadow-sm">
          {images.length} Items
        </div>
      </div>
    </div>
  )
}

// Combo Expanded Details Component
function ComboExpandedDetails({ item, isFreeDelivery }) {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Items in this Combo</h4>
      <div className="space-y-3">
        {item.combo_items.map((comboItem, idx) => {
          // Get image from populated product or fallback to direct image field
          const itemImage = comboItem.product?.images_uri?.[0] || comboItem.image;
          
          return (
          <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0">
              {itemImage ? (
                <img
                  src={itemImage}
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
        )})}
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
            {isFreeDelivery ? (
              <span className="font-semibold text-green-600">FREE</span>
            ) : (
              <span className="font-semibold">₹{item.delivery_charge?.toLocaleString()}</span>
            )}
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

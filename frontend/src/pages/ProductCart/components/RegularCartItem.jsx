import { Minus, Plus, Trash2 } from "lucide-react"

export default function RegularCartItem({ 
  item, 
  isFreeDelivery,
  baseDeliveryCharge,
  onQuantityChange, 
  onRemove 
}) {
  const productInfo = item.product || {}
  const productImage = productInfo.images_uri?.[0] || null

  return (
    <div className="relative bg-white rounded-sm shadow-sm p-3 sm:p-4 md:p-5 border border-gray-200 hover:shadow-md transition-all">
      <div className="flex items-start gap-3 sm:gap-4 md:gap-6">
        {/* Product Image */}
        <div className="flex-shrink-0">
          {productImage ? (
            <img
              src={productImage}
              alt={productInfo.name || "Product"}
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover object-center rounded-sm"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center bg-gradient-to-br from-[#EDE8E0] to-[#5e6043]/10 rounded-lg">
              <span className="text-2xl sm:text-4xl">🌸</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-serif text-gray-900 mb-1 leading-tight line-clamp-2">
            {productInfo.name || "Product"}
          </h3>
          
          {/* Only show delivery info for standard and fixed delivery, not midnight/express */}
          {item.deliveryType !== 'midnight' && item.deliveryType !== 'express' && (
            <p className="text-[10px] sm:text-xs text-gray-500 font-['Poppins']">
              Delivery - {isFreeDelivery ? (
                <span className="text-green-600 font-medium">FREE</span>
              ) : (
                <span>₹{baseDeliveryCharge}</span>
              )}
            </p>
          )}
          
          {/* Mobile: Price below title */}
          <p className="sm:hidden text-base font-bold text-gray-900 font-['Poppins'] mt-1">
            ₹{(item.price * item.quantity).toLocaleString()}
          </p>
        </div>

        {/* Right Side - Price & Controls */}
        <div className="flex flex-col items-end gap-2 sm:gap-3">
          {/* Price - Hidden on mobile */}
          <p className="hidden sm:block text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 font-['Poppins']">
            ₹{(item.price * item.quantity).toLocaleString()}
          </p>

          {/* Controls Row */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-300 rounded-sm">
              <button
                onClick={() => onQuantityChange(item.product_id, item.quantity, "decrement")}
                className="p-1.5 sm:p-2 hover:bg-gray-100 transition-all active:scale-95"
              >
                <Minus size={12} className="sm:w-4 sm:h-4" />
              </button>
              <span className="text-xs sm:text-sm font-medium w-6 sm:w-8 text-center font-['Poppins']">
                {item.quantity}
              </span>
              <button
                onClick={() => onQuantityChange(item.product_id, item.quantity, "increment")}
                className="p-1.5 sm:p-2 hover:bg-gray-100 transition-all active:scale-95"
              >
                <Plus size={12} className="sm:w-4 sm:h-4" />
              </button>
            </div>
            
            {/* Delete Button */}
            <button
              onClick={() => onRemove(item.product_id)}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95 p-1.5 sm:p-2 rounded-sm border border-gray-300 hover:border-red-300"
              aria-label="Remove from cart"
            >
              <Trash2 size={14} className="sm:w-[16px] sm:h-[16px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { motion } from "framer-motion"
import { ChevronLeft, MapPin, Phone, User } from "lucide-react"

export default function OrderSummary({ formData, orderDetails, onBack, onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {/* Delivery Summary Card */}
      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-medium text-gray-900">Delivery Details</h3>
          <button
            type="button"
            onClick={onBack}
            className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 active:scale-95 transition-all"
          >
            Edit
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-3">
          {/* Recipient */}
          <div className="flex items-start gap-2 sm:gap-3">
            <User size={14} className="sm:w-4 sm:h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-900">{formData.title} {formData.recipientName}</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 sm:gap-3">
            <MapPin size={14} className="sm:w-4 sm:h-4 text-gray-400 mt-0.5" />
            <div className="text-xs sm:text-sm text-gray-600">
              <p>{formData.apartment}</p>
              <p>{formData.streetAddress}</p>
              <p>{formData.city}, {formData.state} - {formData.pincode}</p>
              <p>{formData.country}</p>
            </div>
          </div>

          {/* Contact */}
          <div className="flex items-start gap-2 sm:gap-3">
            <Phone size={14} className="sm:w-4 sm:h-4 text-gray-400 mt-0.5" />
            <p className="text-xs sm:text-sm text-gray-600">+91 {formData.mobileNumber}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      {orderDetails && orderDetails.items && orderDetails.items.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="p-4 sm:p-5 border-b border-gray-200">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">Order Items ({orderDetails.items.length})</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                  {item.productImage || item.product?.images_uri?.[0] ? (
                    <img 
                      src={item.productImage || item.product?.images_uri?.[0]} 
                      alt={item.productName || item.product?.name}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{item.productName || item.product?.name}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 flex-shrink-0">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proceed Button */}
      <button
        type="button"
        onClick={onNext}
        className="w-full py-3 bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-all active:scale-95 rounded-sm"
      >
        PROCEED TO PAYMENT
      </button>
    </motion.div>
  )
}

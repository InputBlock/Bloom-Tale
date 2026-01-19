import { motion } from "framer-motion"
import { ChevronLeft, MapPin, Phone, User, ChevronRight, Edit3 } from "lucide-react"

export default function OrderSummary({ formData, orderDetails, onBack, onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-5"
    >
      {/* Delivery Summary Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE8E0] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#EDE8E0] flex items-center justify-between">
          <div>
            <h3 className="font-medium text-[#3e4026]">Delivery Address</h3>
            <p className="text-sm text-[#5e6043] mt-0.5">Review your delivery details</p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-[#5e6043] hover:text-[#3e4026] transition-colors group"
          >
            <Edit3 size={14} />
            <span>Edit</span>
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#EDE8E0] flex items-center justify-center shrink-0">
              <MapPin size={20} className="text-[#3e4026]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-[#3e4026]">{formData.title} {formData.recipientName}</span>
                {formData.addressTag && (
                  <span className="px-2 py-0.5 bg-[#3e4026] text-white text-[10px] font-medium rounded-full uppercase tracking-wide">
                    {formData.addressTag}
                  </span>
                )}
              </div>
              <div className="text-sm text-[#5e6043] space-y-1">
                <p>{formData.apartment}</p>
                <p>{formData.streetAddress}</p>
                <p>{formData.city}, {formData.state} - {formData.pincode}</p>
                <p>{formData.country}</p>
              </div>
              <div className="flex items-center gap-1.5 mt-3 text-sm text-[#5e6043]">
                <Phone size={14} />
                <span>+91 {formData.mobileNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      {orderDetails && orderDetails.items && orderDetails.items.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#EDE8E0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#EDE8E0]">
            <h3 className="font-medium text-[#3e4026]">Order Items</h3>
            <p className="text-sm text-[#5e6043] mt-0.5">{orderDetails.items.length} item(s) in your order</p>
          </div>
          <div className="divide-y divide-[#EDE8E0]">
            {orderDetails.items.map((item, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-5 flex items-center gap-4"
              >
                <div className="w-20 h-20 bg-[#EDE8E0] rounded-xl overflow-hidden shrink-0">
                  {item.productImage || item.product?.images_uri?.[0] ? (
                    <img 
                      src={item.productImage || item.product?.images_uri?.[0]} 
                      alt={item.productName || item.product?.name}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#EDE8E0]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#3e4026] line-clamp-2">{item.productName || item.product?.name}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-[#5e6043] bg-[#EDE8E0] px-2 py-0.5 rounded">Qty: {item.quantity}</span>
                  </div>
                </div>
                <p className="text-base font-semibold text-[#3e4026]">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Proceed Button */}
      <motion.button
        type="button"
        onClick={onNext}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full py-4 bg-[#3e4026] text-white font-medium rounded-xl hover:bg-[#5e6043] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#3e4026]/20"
      >
        <span>Proceed to Payment</span>
        <ChevronRight size={18} />
      </motion.button>
    </motion.div>
  )
}

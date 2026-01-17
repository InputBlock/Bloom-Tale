import { motion } from "framer-motion"

export default function OrderSummary({ formData, orderDetails, onBack, onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      {/* Previous Button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-[#3e4026] hover:text-[#5e6043] font-medium transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Back to Delivery Details
      </button>

      {/* Delivery Details Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Delivery Details Summary</h3>
          <button
            type="button"
            onClick={onBack}
            className="text-[#3e4026] hover:text-[#5e6043] text-sm font-medium underline"
          >
            Edit
          </button>
        </div>

        <div className="space-y-4 text-gray-700">
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Recipient Name</p>
            <p className="font-semibold">{formData.title} {formData.recipientName}</p>
          </div>

          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
            <p>{formData.apartment}</p>
            <p>{formData.streetAddress}</p>
            <p>{formData.city}, {formData.state} - {formData.pincode}</p>
            <p>{formData.country}</p>
          </div>

          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Contact Number</p>
            <p className="font-medium">+91 {formData.mobileNumber}</p>
            {formData.alternateMobile && (
              <p className="text-sm text-gray-600">Alt: +91 {formData.alternateMobile}</p>
            )}
          </div>

          {formData.email && (
            <div className="border-b pb-3">
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p>{formData.email}</p>
            </div>
          )}

          {formData.what3words && (
            <div className="border-b pb-3">
              <p className="text-sm text-gray-500 mb-1">What3words</p>
              <p className="text-sm">{formData.what3words}</p>
            </div>
          )}

          {formData.addressTag && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Address Tag</p>
              <p className="font-medium">{formData.addressTag}</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Items Summary */}
      {orderDetails && orderDetails.items && orderDetails.items.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Order Items</h3>
          <div className="space-y-3">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-semibold text-gray-900">{item.product?.name || 'Product'}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900">₹ {(item.price * item.quantity).toLocaleString('en-IN')}</p>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2">
              <p className="text-lg font-bold text-gray-900">Total Amount</p>
              <p className="text-xl font-bold text-[#3e4026]">₹ {orderDetails.totalAmount.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Button */}
      <motion.button
        type="button"
        onClick={onNext}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-[#3e4026] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#5e6043] transition-colors"
      >
        MAKE PAYMENT
      </motion.button>
    </motion.div>
  )
}

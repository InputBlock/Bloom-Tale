import { useState } from "react"
import { X, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function StatusToggleModal({ product, isOpen, onClose, onConfirm }) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen || !product) return null

  const isActivating = !product.isListed
  const actionText = isActivating ? "Activate" : "Deactivate"
  const statusText = isActivating ? "active" : "inactive"

  const handleConfirm = async () => {
    setIsProcessing(true)
    await onConfirm()
    setShowSuccess(true)
    
    setTimeout(() => {
      setShowSuccess(false)
      setIsProcessing(false)
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <AnimatePresence mode="wait">
        {!showSuccess ? (
          <motion.div
            key="confirm"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative"
          >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {actionText} Product
        </h2>
        <p className="text-gray-500 mb-6">
          Confirm the status change for this product
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Product Name</label>
              <p className="text-gray-900 font-semibold">{product.name}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Category</label>
                <p className="text-gray-900">{product.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Stock</label>
                <p className="text-gray-900">{product.stock} items</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">New Status</label>
              <p className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                isActivating
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-600 border border-red-200"
              }`}>
                {isActivating ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>

        {isActivating && product.stock === 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">
              ⚠️ Cannot activate product with 0 stock. Please add stock first.
            </p>
          </div>
        )}

        <p className="text-gray-600 text-sm mb-6">
          Are you sure you want to make this product <span className="font-semibold">{statusText}</span>? 
          {isActivating 
            ? " It will be visible to customers." 
            : " It will be hidden from customers."}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isActivating && product.stock === 0 || isProcessing}
            className={`flex-1 px-4 py-3 font-medium rounded-lg transition-colors duration-200 ${
              isActivating && product.stock === 0 || isProcessing
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isActivating
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {isProcessing ? "Processing..." : actionText}
          </button>
        </div>
      </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative"
          >
            <div className="flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className={`mb-4 ${isActivating ? "text-green-500" : "text-red-500"}`}
              >
                <CheckCircle2 size={80} />
              </motion.div>
              
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`text-2xl font-bold mb-2 ${
                  isActivating ? "text-green-700" : "text-red-700"
                }`}
              >
                Success!
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 text-center text-lg"
              >
                Product {isActivating ? "activated" : "deactivated"} successfully!
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

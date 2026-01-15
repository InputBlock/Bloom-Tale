import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, X } from "lucide-react"

export default function SuccessModal({ isOpen, message, type = "success", onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className={`relative bg-white rounded-2xl shadow-2xl p-8 ${
              type === "success" ? "border-2 border-green-500" : "border-2 border-red-500"
            }`}>
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                {type === "success" ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle2 size={64} className="text-green-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <XCircle size={64} className="text-red-500" />
                  </motion.div>
                )}
              </div>

              {/* Message */}
              <h3 className={`text-2xl font-bold text-center mb-2 ${
                type === "success" ? "text-green-700" : "text-red-700"
              }`}>
                {type === "success" ? "Success!" : "Error"}
              </h3>
              <p className="text-gray-600 text-center text-lg">
                {message}
              </p>

              {/* Auto-dismiss progress bar */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
                className={`h-1 mt-6 rounded-full ${
                  type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

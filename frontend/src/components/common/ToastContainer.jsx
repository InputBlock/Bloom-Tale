import { useState } from "react"
import Toast from "./Toast"

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  const addToast = (toast) => {
    const id = Date.now()
    setToasts(prev => [...prev, { ...toast, id }])
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Expose addToast globally
  if (typeof window !== 'undefined') {
    window.__addToast = addToast
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

// Helper function to show toasts
export const showToast = (message, type = 'success') => {
  if (typeof window !== 'undefined' && window.__addToast) {
    window.__addToast({ message, type })
  }
}

import { useEffect } from "react"
import { CheckCircle, XCircle, Info, Loader2 } from "lucide-react"

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const configs = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-white",
      borderColor: "border-[#6B7C59]",
      iconColor: "text-[#6B7C59]",
      iconBg: "bg-[#6B7C59]/10",
      textColor: "text-gray-800",
      progressBar: "bg-[#6B7C59]"
    },
    error: {
      icon: XCircle,
      bgColor: "bg-white",
      borderColor: "border-rose-500",
      iconColor: "text-rose-600",
      iconBg: "bg-rose-50",
      textColor: "text-gray-800",
      progressBar: "bg-rose-500"
    },
    info: {
      icon: Info,
      bgColor: "bg-white",
      borderColor: "border-blue-500",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      textColor: "text-gray-800",
      progressBar: "bg-blue-500"
    },
    loading: {
      icon: Loader2,
      bgColor: "bg-white",
      borderColor: "border-gray-400",
      iconColor: "text-gray-600",
      iconBg: "bg-gray-50",
      textColor: "text-gray-800",
      progressBar: "bg-gray-400"
    }
  }

  const config = configs[type] || configs.success
  const Icon = config.icon

  return (
    <div className="animate-slide-in-right">
      <div className={`${config.bgColor} ${config.borderColor} border shadow-lg p-4 min-w-[340px] rounded-md`}>
        <div className="flex items-start gap-3">
          <div className={`${config.iconBg} ${config.iconColor} flex-shrink-0 rounded p-2 ${type === 'loading' ? 'animate-spin' : ''}`}>
            <Icon size={20} strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`${config.textColor} font-medium text-sm leading-relaxed`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2"
            aria-label="Close notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-3 h-1 bg-gray-100 rounded-sm overflow-hidden">
          <div className={`h-full ${config.progressBar} animate-progress`} style={{ animationDuration: `${duration}ms` }}></div>
        </div>
      </div>
    </div>
  )
}

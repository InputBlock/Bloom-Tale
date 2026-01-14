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
      bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      iconColor: "text-green-500",
      textColor: "text-green-800",
      emoji: "🌸"
    },
    error: {
      icon: XCircle,
      bgColor: "bg-gradient-to-r from-red-50 to-rose-50",
      borderColor: "border-red-200",
      iconColor: "text-red-500",
      textColor: "text-red-800",
      emoji: "🥀"
    },
    info: {
      icon: Info,
      bgColor: "bg-gradient-to-r from-blue-50 to-sky-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-500",
      textColor: "text-blue-800",
      emoji: "🌼"
    },
    loading: {
      icon: Loader2,
      bgColor: "bg-gradient-to-r from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      iconColor: "text-purple-500",
      textColor: "text-purple-800",
      emoji: "🌺"
    }
  }

  const config = configs[type] || configs.success
  const Icon = config.icon

  return (
    <div className="animate-slide-in-right">
      <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-2xl shadow-2xl p-4 min-w-[320px] max-w-md backdrop-blur-sm`}>
        <div className="flex items-start gap-3">
          <div className={`${config.iconColor} flex-shrink-0 ${type === 'loading' ? 'animate-spin' : 'animate-bounce'}`}>
            <Icon size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{config.emoji}</span>
              <p className={`${config.textColor} font-medium text-sm leading-relaxed`}>
                {message}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`${config.textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-2 h-1 bg-white/30 rounded-full overflow-hidden">
          <div className={`h-full ${config.iconColor} bg-current animate-progress`} style={{ animationDuration: `${duration}ms` }}></div>
        </div>
      </div>
    </div>
  )
}

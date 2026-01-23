import { Menu } from "lucide-react"

export default function Header({ title, subtitle, setIsOpen, isSidebarOpen, isMobile }) {
  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile menu button */}
        {isMobile && (
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">{title}</h1>
          <p className="text-xs sm:text-sm text-gray-500 truncate hidden sm:block">{subtitle}</p>
        </div>
      </div>
    </header>
  )
}

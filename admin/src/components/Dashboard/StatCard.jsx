export default function StatCard({ title, value, change, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-gray-500 text-xs sm:text-sm mb-1">{title}</p>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{value}</h3>
          {change && (
            <p className="text-xs sm:text-sm text-green-600 mt-1 sm:mt-2">
              {change} <span className="text-gray-400 hidden sm:inline">this month</span>
            </p>
          )}
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
          {Icon && <Icon size={20} className="text-gray-400 sm:hidden" />}
          {Icon && <Icon size={24} className="text-gray-400 hidden sm:block" />}
        </div>
      </div>
    </div>
  )
}
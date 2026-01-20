export default function StatCard({ title, value, change, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          {change && (
            <p className="text-sm text-green-600 mt-2">
              {change} <span className="text-gray-400">this month</span>
            </p>
          )}
        </div>
        <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
          {Icon && <Icon size={24} className="text-gray-400" />}
        </div>
      </div>
    </div>
  )
}
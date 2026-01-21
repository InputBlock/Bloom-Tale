export default function EnquiryStats({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
        <p className="text-xs sm:text-sm text-gray-500">Total</p>
        <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalEnquiries}</p>
      </div>
      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
        <p className="text-xs sm:text-sm text-gray-500">Pending</p>
        <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pendingEnquiries}</p>
      </div>
      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
        <p className="text-xs sm:text-sm text-gray-500">Resolved</p>
        <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.resolvedEnquiries}</p>
      </div>
    </div>
  )
}

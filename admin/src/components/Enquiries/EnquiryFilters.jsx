export default function EnquiryFilters({ filter, onFilterChange }) {
  const filters = ["all", "pending", "resolved"]

  return (
    <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto">
      {filters.map((status) => (
        <button
          key={status}
          onClick={() => onFilterChange(status)}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
            filter === status
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      ))}
    </div>
  )
}

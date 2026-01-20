export default function SalesChart() {
  const data = [
    { month: "Jan", value: 4000 },
    { month: "Feb", value: 3000 },
    { month: "Mar", value: 2000 },
    { month: "Apr", value: 2780 },
    { month: "May", value: 1890 },
    { month: "Jun", value: 2390 },
  ]

  const maxValue = 4000
  const yAxisLabels = [4000, 3000, 2000, 1000, 0]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales Overview</h3>
      <div className="flex h-64">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between text-xs text-gray-500 pr-4 py-1">
          {yAxisLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        
        {/* Chart Bars */}
        <div className="flex-1 flex items-end justify-between gap-3">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-3">
              <div className="w-full flex items-end justify-center h-48">
                <div
                  className="w-full max-w-12 bg-black rounded-t-lg transition-all hover:bg-gray-800 cursor-pointer"
                  style={{ height: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-black rounded-sm" />
          <span className="text-sm text-gray-600">sales</span>
        </div>
      </div>
    </div>
  )
}
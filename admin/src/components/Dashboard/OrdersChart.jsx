export default function OrdersChart() {
  const data = [
    { month: "Jan", value: 240 },
    { month: "Feb", value: 0 },
    { month: "Mar", value: 220 },
    { month: "Apr", value: 230 },
    { month: "May", value: 210 },
    { month: "Jun", value: 200 },
  ]

  const maxValue = 240
  const yAxisLabels = [240, 180, 120, 60, 0]

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Orders Trend</h3>
      <div className="flex h-48 sm:h-56 lg:h-64">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between text-[10px] sm:text-xs text-gray-500 pr-2 sm:pr-4 py-1">
          {yAxisLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        
        {/* Chart Area */}
        <div className="flex-1 flex items-end justify-between gap-3 sm:gap-4 lg:gap-6">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 sm:gap-3">
              <div className="w-full relative h-36 sm:h-40 lg:h-48 flex items-end justify-center">
                {item.value > 0 && (
                  <div
                    className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-black rounded-full hover:scale-125 transition-transform cursor-pointer"
                    style={{ bottom: `${(item.value / maxValue) * 100}%` }}
                    title={`${item.value} orders`}
                  />
                )}
              </div>
              <span className="text-[10px] sm:text-xs lg:text-sm text-gray-600">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 sm:mt-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-black rounded-full" />
          <span className="text-xs sm:text-sm text-gray-600">orders</span>
        </div>
      </div>
    </div>
  )
}
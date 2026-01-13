export default function SalesChart() {
  const data = [
    { month: "Jan", value: 4000 },
    { month: "Feb", value: 3000 },
    { month: "Mar", value: 2000 },
    { month: "Apr", value: 2780 },
    { month: "May", value: 1890 },
    { month: "Jun", value: 2390 },
  ]

  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales Overview</h3>
      <div className="flex items-end justify-between gap-4 h-64">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-3">
            <div className="w-full flex items-end justify-center h-48">
              <div
                className="w-full bg-black rounded-t-lg transition-all hover:bg-gray-800"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-600">{item.month}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-black rounded-full" />
          <span className="text-sm text-gray-600">Sales</span>
        </div>
      </div>
    </div>
  )
}

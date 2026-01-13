export default function OrdersChart() {
  const data = [
    { month: "Jan", value: 240 },
    { month: "Feb", value: 210 },
    { month: "Mar", value: 230 },
    { month: "Apr", value: 200 },
    { month: "May", value: 220 },
    { month: "Jun", value: 235 },
  ]

  const maxValue = 240

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Orders Trend</h3>
      <div className="relative h-64">
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500">
          <span>240</span>
          <span>180</span>
          <span>120</span>
          <span>60</span>
          <span>0</span>
        </div>
        <div className="ml-8 h-full flex items-end justify-between gap-8">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full relative h-48">
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center">
                  <div
                    className="w-3 h-3 bg-black rounded-full relative"
                    style={{ bottom: `${(item.value / maxValue) * 100}%` }}
                  >
                    {index < data.length - 1 && (
                      <div
                        className="absolute left-1/2 top-1/2 w-16 h-0.5 bg-black origin-left"
                        style={{
                          transform: `rotate(${
                            Math.atan2(
                              ((data[index + 1].value - item.value) / maxValue) * 192,
                              64
                            ) * (180 / Math.PI)
                          }deg)`,
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-600">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-black rounded-full" />
          <span className="text-sm text-gray-600">Orders</span>
        </div>
      </div>
    </div>
  )
}

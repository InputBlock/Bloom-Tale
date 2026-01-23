import { useState, useEffect } from "react"
import { ordersAPI } from "../../api"

export default function SalesChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [maxValue, setMaxValue] = useState(4000)

  useEffect(() => {
    fetchSalesData()
  }, [])

  const fetchSalesData = async () => {
    try {
      const response = await ordersAPI.getMonthlyStats()
      if (response.data?.success && response.data?.data?.salesData) {
        const salesData = response.data.data.salesData
        setData(salesData)
        const max = Math.max(...salesData.map(d => d.value), 1000)
        setMaxValue(Math.ceil(max / 1000) * 1000)
      }
    } catch (error) {
      console.error("Error fetching sales data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getYAxisLabels = () => {
    const step = maxValue / 4
    return [maxValue, step * 3, step * 2, step, 0]
  }

  const formatValue = (val) => {
    if (val >= 1000) return `${val / 1000}k`
    return val
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Sales Overview</h3>
        <div className="flex items-center justify-center h-48 sm:h-56 lg:h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  const yAxisLabels = getYAxisLabels()

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Sales Overview</h3>
      <div className="flex h-48 sm:h-56 lg:h-64">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between text-[10px] sm:text-xs text-gray-500 pr-2 sm:pr-4 py-1">
          {yAxisLabels.map((label, idx) => (
            <span key={idx} className="hidden sm:block">{label}</span>
          ))}
          {/* Simplified labels for mobile */}
          {yAxisLabels.map((label, idx) => (
            <span key={`m-${idx}`} className="sm:hidden">{formatValue(label)}</span>
          ))}
        </div>
        
        {/* Chart Bars */}
        <div className="flex-1 flex items-end justify-between gap-1 sm:gap-2 lg:gap-3">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 sm:gap-3">
              <div className="w-full flex items-end justify-center h-36 sm:h-40 lg:h-48">
                <div
                  className="w-full max-w-6 sm:max-w-8 lg:max-w-12 bg-black rounded-t-md sm:rounded-t-lg transition-all hover:bg-gray-800 cursor-pointer"
                  style={{ height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
                  title={`₹${item.value.toLocaleString()}`}
                />
              </div>
              <span className="text-[10px] sm:text-xs lg:text-sm text-gray-600">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 sm:mt-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-black rounded-sm" />
          <span className="text-xs sm:text-sm text-gray-600">sales</span>
        </div>
      </div>
    </div>
  )
}
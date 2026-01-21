import { useState, useEffect } from "react"
import { ordersAPI } from "../../api"

export default function RecentOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentOrders()
  }, [])

  const fetchRecentOrders = async () => {
    try {
      const response = await ordersAPI.getRecent(5)
      const data = response.data

      if (data.success && data.data.orders) {
        setOrders(data.data.orders)
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching recent orders:", error)
      setLoading(false)
    }
  }

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
      case "PAID":
        return "bg-gray-900 text-white"
      case "PENDING":
      case "CREATED":
        return "bg-gray-100 text-gray-800 border border-gray-300"
      case "SHIPPED":
      case "PROCESSING":
        return "bg-gray-200 text-gray-700"
      case "CANCELLED":
      case "RETURNED":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatOrderId = (id) => {
    return `#${id.slice(-6).toUpperCase()}`
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Recent Orders</h3>
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Recent Orders</h3>
      
      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-3">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No orders found</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{formatOrderId(order._id)}</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.order_status || order.status)}`}>
                  {(order.order_status || order.status || "PENDING").toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 truncate flex-1 mr-2">{order.user?.email || "Guest"}</span>
                <span className="font-medium text-gray-900">{formatCurrency(order.totalAmount || 0)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 lg:py-4 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-600">
                Order ID
              </th>
              <th className="text-left py-3 lg:py-4 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-600">
                Customer
              </th>
              <th className="text-left py-3 lg:py-4 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-600">
                Amount
              </th>
              <th className="text-left py-3 lg:py-4 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr
                  key={order._id}
                  className={`${
                    index !== orders.length - 1 ? "border-b border-gray-50" : ""
                  } hover:bg-gray-50 transition-colors`}
                >
                  <td className="py-3 lg:py-4 px-2 lg:px-4 text-xs lg:text-sm text-gray-900 font-medium">
                    {formatOrderId(order._id)}
                  </td>
                  <td className="py-3 lg:py-4 px-2 lg:px-4 text-xs lg:text-sm text-blue-600 hover:text-blue-800 cursor-pointer truncate max-w-[120px] lg:max-w-none">
                    {order.user?.fullName || order.user?.email || "Guest"}
                  </td>
                  <td className="py-3 lg:py-4 px-2 lg:px-4 text-xs lg:text-sm text-gray-900 font-medium">
                    {formatCurrency(order.totalAmount || 0)}
                  </td>
                  <td className="py-3 lg:py-4 px-2 lg:px-4">
                    <span
                      className={`inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-[10px] lg:text-xs font-medium ${getStatusStyle(
                        order.order_status || order.status
                      )}`}
                    >
                      {(order.order_status || order.status || "PENDING").toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
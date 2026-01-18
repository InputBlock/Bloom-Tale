import { useState, useEffect } from "react"
import { Eye, MoreHorizontal, Loader2 } from "lucide-react"
import axios from "axios"
import OrderStatusBadge from "./OrderStatusBadge"
import OrderDetailsModal from "./OrderDetailsModal"

const API_URL = "/api/v1/admin"

export default function OrdersTable() {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [actionMenu, setActionMenu] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/orders`, {
        withCredentials: true
      })
      if (response.data?.data?.orders) {
        setOrders(response.data.data.orders)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders")
      console.error("Error fetching orders:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Map order_status to color
  const getOrderStatusColor = (status) => {
    const colors = {
      CREATED: "bg-gray-100 text-gray-800",
      PLACED: "bg-yellow-100 text-yellow-800",
      SHIPPED: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      RETURNED: "bg-orange-100 text-orange-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  // Map payment status to color
  const getPaymentStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PAID: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      PAYMENT_FAILED: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.patch(`${API_URL}/orders/${orderId}/status`, { status }, {
        withCredentials: true
      })
      fetchOrders() // Refresh orders
    } catch (err) {
      console.error("Error updating order:", err)
      alert(err.response?.data?.message || "Failed to update order")
    }
  }

  const handleAction = (action, order) => {
    setActionMenu(null)
    if (action === "view") {
      setSelectedOrder(order)
    } else if (action === "placed") {
      updateOrderStatus(order._id, "PLACED")
    } else if (action === "shipped") {
      updateOrderStatus(order._id, "SHIPPED")
    } else if (action === "delivered") {
      updateOrderStatus(order._id, "DELIVERED")
    } else if (action === "cancelled") {
      updateOrderStatus(order._id, "CANCELLED")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Loading orders...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchOrders}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Order ID</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Customer</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Payment Method</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Created</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Order Status</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-green-600">
                        {order.order_id || order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.customerName || order.user?.fullName || order.deliveryAddress?.[0]?.fullName || "N/A"}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {order.customerEmail || order.user?.email || order.deliveryAddress?.[0]?.email || "N/A"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{order.paymentMethod || "N/A"}</td>
                      <td className="px-6 py-4 text-gray-600">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4">
                        <OrderStatusBadge status={order.order_status || "CREATED"} color={getOrderStatusColor(order.order_status || "CREATED")} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2 relative">
                          <button
                            onClick={() => {
                              const addr = order.deliveryAddress?.[0]
                              const addressParts = []
                              if (addr?.house) addressParts.push(addr.house)
                              if (addr?.streetAddress || addr?.street) addressParts.push(addr.streetAddress || addr.street)
                              if (addr?.city) addressParts.push(addr.city)
                              if (addr?.state) addressParts.push(addr.state)
                              const addressMain = addressParts.join(", ")
                              const addressStr = addr?.pincode 
                                ? `${addressMain} - ${addr.pincode}${addr?.country ? `, ${addr.country}` : ""}`
                                : `${addressMain}${addr?.country ? `, ${addr.country}` : ""}`
                              
                              setSelectedOrder({
                                ...order,
                                id: order.order_id || order._id.slice(-8).toUpperCase(),
                                customerName: order.customerName || order.user?.username || addr?.fullName || "N/A",
                                email: order.customerEmail || order.user?.email || addr?.email || "N/A",
                                phone: addr?.mobile || order.user?.mobile || "N/A",
                                created: formatDate(order.createdAt),
                                order_status: order.order_status || "CREATED",
                                orderStatusColor: getOrderStatusColor(order.order_status || "CREATED"),
                                paymentStatusColor: getPaymentStatusColor(order.status),
                                deliveryAddress: addressStr || "N/A",
                                items: order.items?.map(item => ({
                                  name: item.productName || item.product?.name || "Product",
                                  quantity: item.quantity || 1,
                                  price: item.price || 0
                                })) || [],
                                subtotal: order.totalAmount || 0,
                                tax: 0,
                                deliveryFee: 0,
                                total: order.totalAmount || 0,
                                paymentStatus: order.status === "PAID" ? "Paid" : "Unpaid"
                              })
                            }}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-gray-100 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => setActionMenu(actionMenu === order._id ? null : order._id)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                          >
                            <MoreHorizontal size={18} />
                          </button>
                          {actionMenu === order._id && (
                            <div className="absolute right-0 top-10 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <button
                                onClick={() => handleAction("placed", order)}
                                className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-gray-50"
                              >
                                Mark Placed
                              </button>
                              <button
                                onClick={() => handleAction("shipped", order)}
                                className="w-full px-4 py-2 text-left text-sm text-purple-600 hover:bg-gray-50"
                              >
                                Mark Shipped
                              </button>
                              <button
                                onClick={() => handleAction("delivered", order)}
                                className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-gray-50"
                              >
                                Mark Delivered
                              </button>
                              <button
                                onClick={() => handleAction("cancelled", order)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                              >
                                Cancel Order
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          onStatusUpdate={fetchOrders}
        />
      )}
    </>
  )
}

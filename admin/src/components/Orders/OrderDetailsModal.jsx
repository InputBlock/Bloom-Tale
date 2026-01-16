import { X, ArrowLeft, Package, MapPin, CreditCard, User } from "lucide-react"
import axios from "axios"
import OrderStatusBadge from "./OrderStatusBadge"

const API_URL = "/api/v1/admin"

export default function OrderDetailsModal({ order, onClose, onStatusUpdate }) {
  
  const handleStatusUpdate = async (status) => {
    try {
      await axios.patch(`${API_URL}/orders/${order._id}/status`, { status }, {
        withCredentials: true
      })
      if (onStatusUpdate) onStatusUpdate()
      onClose()
    } catch (err) {
      console.error("Error updating order:", err)
      alert(err.response?.data?.message || "Failed to update order")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <button onClick={onClose} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Orders</span>
          </button>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Header */}
          <div className="flex items-start justify-between pb-6 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Details</h1>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-semibold text-gray-900">Order ID:</span>{" "}
                  <span className="text-green-600 font-mono font-semibold">{order.id}</span>
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Created:</span> {order.created}
                </p>
              </div>
            </div>
            <OrderStatusBadge status={order.status} color={order.statusColor} />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Customer & Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={18} />
                  Customer Information
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Name</p>
                    <p className="text-gray-900 font-medium">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Email</p>
                    <p className="text-gray-900 font-medium text-sm">{order.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Phone</p>
                    <p className="text-gray-900 font-medium">{order.phone}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="border border-gray-200 rounded-lg p-6 bg-green-50">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin size={18} className="text-green-600" />
                    Delivery Address
                  </h2>
                </div>
                <p className="text-gray-700">{order.deliveryAddress}</p>
              </div>

              {/* Order Items */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package size={18} />
                  Order Items
                </h2>
                <div className="space-y-4">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <p className="font-semibold text-gray-900">₹{item.price?.toFixed(2) || "0.00"}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Payment Summary */}
            <div className="space-y-6">
              {/* Payment Summary */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard size={18} />
                  Payment Summary
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">₹{order.subtotal?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium text-gray-900">₹{order.tax?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span className="font-medium text-gray-900">₹{order.deliveryFee?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-lg text-green-600">₹{order.total?.toFixed(2) || "0.00"}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Payment Details</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                    <p className="font-semibold text-gray-900">{order.paymentMethod || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payment Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      order.paymentStatus === "Paid" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {order.paymentStatus || "Unpaid"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Actions</h2>
                <div className="space-y-2">
                  <button 
                    onClick={() => handleStatusUpdate("ACCEPTED")}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                  >
                    Accept Order
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate("CANCELLED")}
                    className="w-full px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-100 transition"
                  >
                    Reject Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

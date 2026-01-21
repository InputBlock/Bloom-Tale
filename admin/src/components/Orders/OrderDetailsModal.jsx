import { X, ArrowLeft, Package, MapPin, CreditCard, User } from "lucide-react"
import { ordersAPI } from "../../api"
import OrderStatusBadge from "./OrderStatusBadge"

export default function OrderDetailsModal({ order, onClose, onStatusUpdate }) {
  
  const handleStatusUpdate = async (status) => {
    try {
      await ordersAPI.updateStatus(order._id, status)
      if (onStatusUpdate) onStatusUpdate()
      onClose()
    } catch (err) {
      console.error("Error updating order:", err)
      alert(err.response?.data?.message || "Failed to update order")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <button onClick={onClose} className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={18} />
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">Back to Orders</span>
          </button>
          <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 sm:pb-6 border-b border-gray-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Order Details</h1>
              <div className="space-y-0.5 sm:space-y-1 text-xs sm:text-sm text-gray-600">
                <p>
                  <span className="font-semibold text-gray-900">Order ID:</span>{" "}
                  <span className="text-green-600 font-mono font-semibold">{order.id}</span>
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Created:</span> {order.created}
                </p>
              </div>
            </div>
            <OrderStatusBadge status={order.order_status || "CREATED"} color={order.orderStatusColor} />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Customer & Items */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Customer Information */}
              <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <User size={16} />
                  Customer Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase mb-0.5 sm:mb-1">Name</p>
                    <p className="text-gray-900 font-medium text-sm sm:text-base truncate">{order.customerName}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase mb-0.5 sm:mb-1">Email</p>
                    <p className="text-gray-900 font-medium text-xs sm:text-sm break-all">{order.email}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase mb-0.5 sm:mb-1">Phone</p>
                    <p className="text-gray-900 font-medium text-sm sm:text-base">{order.phone}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-green-50">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3 sm:mb-4">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin size={16} className="text-green-600" />
                    Delivery Address
                  </h2>
                  {order.deliveryType && order.deliveryType !== "standard" && (
                    <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] sm:text-xs font-medium capitalize self-start">
                      {order.deliveryType === "fixed" ? "Fixed Time" : order.deliveryType} Delivery
                    </span>
                  )}
                </div>
                <p className="text-gray-700 text-sm sm:text-base">{order.deliveryAddress}</p>
                {order.deliverySlot && (
                  <p className="text-gray-600 mt-2 text-xs sm:text-sm">
                    <span className="font-medium">Time Slot:</span> {order.deliverySlot}
                  </p>
                )}
              </div>

              {/* Order Items */}
              <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <Package size={16} />
                  Order Items
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="pb-3 sm:pb-4 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-gray-900 text-sm sm:text-base">{item.name}</p>
                            {item.isCombo && (
                              <span className="px-1.5 sm:px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[10px] sm:text-xs font-medium">
                                Combo
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs sm:text-sm text-gray-500">{item.description}</p>
                          )}
                          <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base ml-2">₹{item.price?.toFixed(2) || "0.00"}</p>
                      </div>
                      
                      {/* Combo Sub-items */}
                      {item.isCombo && item.comboItems && item.comboItems.length > 0 && (
                        <div className="mt-3 ml-4 space-y-2 bg-purple-50 p-3 rounded-lg">
                          <p className="text-[10px] sm:text-xs font-semibold text-purple-700 uppercase tracking-wider">Combo Contents:</p>
                          {item.comboItems.map((subItem, subIdx) => (
                            <div key={subIdx} className="flex justify-between items-center text-xs sm:text-sm">
                              <div>
                                <span className="text-gray-700">{subItem.name}</span>
                                <span className="text-gray-500 ml-2">
                                  {[
                                    subItem.size ? `Size: ${subItem.size}` : "",
                                    subItem.color ? `Color: ${subItem.color}` : ""
                                  ].filter(Boolean).join(", ") || ""}
                                </span>
                                <span className="text-gray-400 ml-2">× {subItem.quantity}</span>
                              </div>
                              <span className="text-gray-600">₹{subItem.price?.toFixed(2) || "0.00"}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Payment Summary */}
            <div className="space-y-4 sm:space-y-6">
              {/* Payment Summary */}
              <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <CreditCard size={16} />
                  Payment Summary
                </h2>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
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
                  <div className="border-t border-gray-200 pt-2 sm:pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-base sm:text-lg text-green-600">₹{order.total?.toFixed(2) || "0.00"}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                <h2 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4">Payment Details</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Payment Method</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{order.paymentMethod || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Payment Status</p>
                    <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
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
              <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                <h2 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4">Update Order Status</h2>
                <div className="space-y-2 grid grid-cols-2 sm:grid-cols-1 gap-2">
                  <button 
                    onClick={() => handleStatusUpdate("PLACED")}
                    className="px-3 sm:px-4 py-2 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-lg font-medium hover:bg-yellow-200 transition text-xs sm:text-sm"
                  >
                    Mark Placed
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate("SHIPPED")}
                    className="px-3 sm:px-4 py-2 bg-purple-100 text-purple-800 border border-purple-200 rounded-lg font-medium hover:bg-purple-200 transition text-xs sm:text-sm"
                  >
                    Mark Shipped
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate("DELIVERED")}
                    className="col-span-2 sm:col-span-1 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition text-xs sm:text-sm"
                  >
                    Mark Delivered
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate("CANCELLED")}
                    className="px-3 sm:px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-100 transition text-xs sm:text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate("RETURNED")}
                    className="px-3 sm:px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 rounded-lg font-medium hover:bg-orange-100 transition text-xs sm:text-sm"
                  >
                    Returned
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

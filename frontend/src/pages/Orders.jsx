import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Package, Loader2, ChevronRight, ChevronDown, ChevronUp, MapPin, Calendar, IndianRupee, ShoppingBag, CheckCircle2, Circle } from "lucide-react"
import Header from "../components/common/Header"
import Footer from "../components/common/Footer"
import { orderAPI } from "../api"

export default function Orders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { response, data } = await orderAPI.getMyOrders()

      if (response.ok) {
        // Handle different response structures
        const ordersData = data.data || data.orders || data || []
        setOrders(Array.isArray(ordersData) ? ordersData : [])
      } else {
        setError(data.message || "Failed to fetch orders")
      }
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError("Failed to load orders. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      processing: "bg-indigo-100 text-indigo-800 border-indigo-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    }
    return statusColors[status?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  // Get order status steps for timeline - clean minimal design
  const getOrderStatusSteps = (currentStatus) => {
    const allSteps = [
      { key: "CREATED", label: "Created" },
      { key: "PLACED", label: "Confirmed" },
      { key: "SHIPPED", label: "Shipped" },
      { key: "DELIVERED", label: "Delivered" },
    ]
    
    const statusOrder = ["CREATED", "PLACED", "SHIPPED", "DELIVERED"]
    const currentIndex = statusOrder.indexOf(currentStatus?.toUpperCase())
    
    if (currentStatus?.toUpperCase() === "CANCELLED") {
      const steps = allSteps.slice(0, Math.max(currentIndex, 1))
      steps.push({ key: "CANCELLED", label: "Cancelled", isCancelled: true })
      return steps.map((step, index) => ({
        ...step,
        isCompleted: index < steps.length - 1 || step.isCancelled,
      }))
    }
    if (currentStatus?.toUpperCase() === "RETURNED") {
      return [...allSteps, { key: "RETURNED", label: "Returned", isReturned: true }].map((step, index, arr) => ({
        ...step,
        isCompleted: true,
      }))
    }
    
    return allSteps.map((step, index) => ({
      ...step,
      isCompleted: index <= currentIndex,
      isCurrent: index === currentIndex,
    }))
  }

  const getStatusLabel = (status) => {
    const labels = {
      CREATED: "Created",
      PLACED: "Confirmed", 
      SHIPPED: "Shipped",
      DELIVERED: "Delivered",
      CANCELLED: "Cancelled",
      RETURNED: "Returned",
    }
    return labels[status?.toUpperCase()] || status || "Created"
  }

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  // Get delivery address from order (handles both array and object)
  const getDeliveryAddress = (order) => {
    if (order.deliveryAddress && order.deliveryAddress.length > 0) {
      return order.deliveryAddress[0]
    }
    if (order.address) {
      return order.address
    }
    return null
  }

  const getPaymentStatusLabel = (status) => {
    const labels = {
      PENDING: "Payment Pending",
      PAID: "Paid",
      PAYMENT_FAILED: "Payment Failed",
      CANCELLED: "Cancelled",
    }
    return labels[status?.toUpperCase()] || status || "Pending"
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-white to-[#f5f5f5]">
        <Header />
        <div className="pt-32 pb-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-4 text-[#3e4026]" size={48} />
            <p className="text-gray-600 text-lg">Loading your orders...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-white to-[#f5f5f5]">
      <Header />
      
      <section className="pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-10 md:mb-12"
          >
            <h1 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#3e4026] mb-2 font-bold"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              My Orders
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Track and manage your orders</p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-sm"
            >
              <p className="text-sm sm:text-base text-red-600 font-medium">{error}</p>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && orders.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-sm shadow-lg p-8 sm:p-10 md:p-12 text-center"
            >
              <Package className="mx-auto mb-4 text-gray-300" size={48} />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">No Orders Yet</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">Start shopping to see your orders here</p>
              <a
                href="/shop"
                className="inline-block px-6 sm:px-8 py-3 sm:py-3.5 bg-[#3e4026] text-white text-sm sm:text-base font-semibold rounded-sm hover:bg-[#5e6043] transition-all active:scale-95"
              >
                Start Shopping
              </a>
            </motion.div>
          )}

          {/* Orders List */}
          {orders.length > 0 && (
            <div className="space-y-4 md:space-y-6">
              <AnimatePresence>
                {orders.map((order, index) => (
                  <motion.div
                    key={order._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white rounded-sm shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="bg-gradient-to-r from-[#3e4026]/5 to-[#c4a574]/5 p-4 sm:p-5 md:p-6 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#3e4026]">
                              #{order.order_id || order._id?.slice(-8).toUpperCase() || 'N/A'}
                            </h3>
                            <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                              {getStatusLabel(order.order_status)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                            <Calendar size={14} className="sm:w-4 sm:h-4" />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xs sm:text-sm text-gray-600">Total Amount</p>
                          <p className="text-xl sm:text-2xl font-bold text-[#3e4026] flex items-center sm:justify-end gap-1">
                            <IndianRupee size={18} className="sm:w-5 sm:h-5" />
                            {formatPrice(order.totalAmount || 0).replace('₹', '')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Content */}
                    <div className="p-4 sm:p-5 md:p-6">
                      {/* Order Items */}
                      {order.items && order.items.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3 sm:mb-4">
                            <ShoppingBag className="text-[#3e4026]" size={18} />
                            <h4 className="text-sm sm:text-base font-semibold text-gray-800">
                              Items ({order.items.length})
                            </h4>
                          </div>
                          <div className="space-y-3">
                            {order.items.map((item, itemIndex) => {
                              // Try multiple possible image sources
                              const imageUrl = item.productImage || 
                                             item.product?.images_uri?.[0] ||
                                             item.product?.image || 
                                             item.product?.images?.[0] ||
                                             item.image ||
                                             item.images?.[0];
                              
                              return (
                              <div
                                key={itemIndex}
                                className="flex items-center gap-3 sm:gap-4 p-3 bg-gray-50 rounded-sm"
                              >
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-sm flex-shrink-0 overflow-hidden">
                                  {imageUrl ? (
                                    <img 
                                      src={imageUrl} 
                                      alt={item.productName || item.product?.name || 'Product'}
                                      className="w-full h-full object-cover object-center"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Package className="text-gray-400" size={24} />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm sm:text-base font-medium text-gray-800 truncate">
                                    {item.productName || item.product?.name || 'Product'}
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-600">
                                    Quantity: {item.quantity || 1}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm sm:text-base font-semibold text-[#3e4026] flex items-center gap-0.5 sm:gap-1">
                                    <IndianRupee size={14} className="sm:w-4 sm:h-4" />
                                    {formatPrice(item.price || 0).replace('₹', '')}
                                  </p>
                                </div>
                              </div>
                            )})}
                          </div>
                        </div>
                      )}

                      {/* Payment Info */}
                      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Payment:</span>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="font-medium text-gray-800">
                              {order.paymentMethod || 'N/A'}
                            </span>
                            <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded ${
                              order.status === 'PAID' 
                                ? 'bg-green-100 text-green-700' 
                                : order.status === 'PAYMENT_FAILED'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {getPaymentStatusLabel(order.status)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Status Toggle Button */}
                      <button
                        onClick={() => toggleOrderExpand(order._id)}
                        className="mt-4 w-full flex items-center justify-between px-3 sm:px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-sm transition-all active:scale-95"
                      >
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Order Status</span>
                        {expandedOrder === order._id ? (
                          <ChevronUp size={18} className="sm:w-5 sm:h-5 text-gray-500" />
                        ) : (
                          <ChevronDown size={18} className="sm:w-5 sm:h-5 text-gray-500" />
                        )}
                      </button>

                      {/* Order Status Timeline - Expandable at Bottom */}
                      <AnimatePresence>
                        {expandedOrder === order._id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 sm:pt-4 pb-2">
                              <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 sm:mb-4">ORDER PROGRESS</p>
                              <div className="flex items-center justify-between">
                                {getOrderStatusSteps(order.order_status).map((step, stepIndex, arr) => (
                                  <div key={step.key} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center">
                                      <div
                                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                                          step.isCompleted
                                            ? "bg-[#3e4026] text-white"
                                            : "bg-gray-200 text-gray-400"
                                        }`}
                                      >
                                        {step.isCompleted ? (
                                          <CheckCircle2 size={14} className="sm:w-4 sm:h-4" />
                                        ) : (
                                          <Circle size={14} className="sm:w-4 sm:h-4" />
                                        )}
                                      </div>
                                      <span className={`text-[9px] sm:text-xs mt-1.5 sm:mt-2 font-medium text-center ${
                                        step.isCompleted
                                          ? "text-[#3e4026]"
                                          : "text-gray-400"
                                      }`}>
                                        {step.label}
                                      </span>
                                    </div>
                                    {stepIndex < arr.length - 1 && (
                                      <div className={`flex-1 h-0.5 mx-1 sm:mx-2 ${
                                        step.isCompleted && arr[stepIndex + 1]?.isCompleted
                                          ? "bg-[#3e4026]"
                                          : "bg-gray-200"
                                      }`} />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Package, MapPin, Calendar, IndianRupee, ShoppingBag, Loader2, Truck, CheckCircle } from "lucide-react"
import Header from "../components/common/Header"
import Footer from "../components/common/Footer"
import { orderAPI } from "../api"

export default function OrderDetails() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchOrderDetails()
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      const { response, data } = await orderAPI.getMyOrders()

      if (response.ok) {
        const ordersData = data.data || data.orders || data || []
        // Find the specific order
        const foundOrder = ordersData.find(o => o._id === orderId)
        if (foundOrder) {
          setOrder(foundOrder)
        } else {
          setError("Order not found")
        }
      } else {
        setError(data.message || "Failed to fetch order details")
      }
    } catch (err) {
      console.error("Error fetching order details:", err)
      setError("Failed to load order details. Please try again.")
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
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
            <p className="text-gray-600 text-lg">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-white to-[#f5f5f5]">
        <Header />
        <div className="pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12">
            <div className="bg-white rounded-sm shadow-lg p-8 sm:p-10 md:p-12 text-center">
              <Package className="mx-auto mb-4 text-gray-300" size={48} />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">Order Not Found</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">{error || "The order you're looking for doesn't exist."}</p>
              <button
                onClick={() => navigate("/orders")}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-[#3e4026] text-white text-sm sm:text-base font-semibold rounded-sm hover:bg-[#5e6043] transition-all active:scale-95"
              >
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                Back to Orders
              </button>
            </div>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 text-sm sm:text-base text-[#3e4026] hover:text-[#5e6043] font-medium mb-6 transition-all active:scale-95"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            <span>Back to Orders</span>
          </motion.button>

          {/* Order Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-sm shadow-lg overflow-hidden mb-6"
          >
            <div className="bg-gradient-to-r from-[#3e4026]/5 to-[#c4a574]/5 p-4 sm:p-6 md:p-8 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-4">
                <div>
                  <h1 
                    className="text-2xl sm:text-3xl md:text-4xl text-[#3e4026] mb-2 font-bold"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    Order Details
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">Order #{order._id?.slice(-8) || 'N/A'}</p>
                </div>
                <span className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full border w-fit ${getStatusColor(order.status)}`}>
                  {order.status || 'Pending'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Calendar className="text-[#3e4026]" size={18} />
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500">Order Date</p>
                    <p className="text-xs sm:text-sm font-medium text-gray-800">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <IndianRupee className="text-[#3e4026]" size={18} />
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500">Total Amount</p>
                    <p className="text-base sm:text-lg font-bold text-[#3e4026]">{formatPrice(order.totalAmount || 0)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Truck className="text-[#3e4026]" size={18} />
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500">Payment Method</p>
                    <p className="text-xs sm:text-sm font-medium text-gray-800 capitalize">{order.paymentMethod || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Items & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-sm shadow-lg p-5 sm:p-6 md:p-8 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <ShoppingBag className="text-[#3e4026]" size={20} className="sm:w-6 sm:h-6" />
                  <h2 
                    className="text-lg sm:text-xl text-[#3e4026] font-semibold"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    Order Items ({order.items?.length || 0})
                  </h2>
                </div>

                <div className="space-y-3 sm:space-y-4 flex-1">
                  {order.items && order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-sm hover:border-[#3e4026]/30 transition-colors"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-sm flex-shrink-0 overflow-hidden">
                        {item.productImage || item.product?.images_uri?.[0] ? (
                          <img 
                            src={item.productImage || item.product?.images_uri?.[0]} 
                            alt={item.productName || item.product?.name || 'Product'}
                            className="w-full h-full object-cover object-center"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="text-gray-400" size={32} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                          {item.productName || item.product?.name || 'Product'}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">
                          Quantity: <span className="font-medium">{item.quantity || 1}</span>
                        </p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-base sm:text-lg font-bold text-[#3e4026] flex items-center gap-0.5 sm:gap-1">
                            <IndianRupee size={14} className="sm:w-4 sm:h-4" />
                            {formatPrice(item.price || 0).replace('₹', '')}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-[10px] sm:text-xs text-gray-500">
                              ({formatPrice(item.price / item.quantity)} each)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-auto pt-4 sm:pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between text-base sm:text-lg font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span className="flex items-center gap-0.5 sm:gap-1">
                      <IndianRupee size={18} className="sm:w-5 sm:h-5" />
                      {formatPrice(order.totalAmount || 0).replace('₹', '')}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Payment Information */}
              {order.paymentInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white rounded-sm shadow-lg p-5 sm:p-6"
                >
                  <h2 
                    className="text-lg sm:text-xl text-[#3e4026] font-semibold mb-3 sm:mb-4"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    Payment Information
                  </h2>
                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    {order.paymentInfo.paymentId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment ID:</span>
                        <span className="font-medium text-gray-800">{order.paymentInfo.paymentId}</span>
                      </div>
                    )}
                    {order.paymentInfo.orderId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-medium text-gray-800">{order.paymentInfo.orderId}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column - Delivery Address */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-sm shadow-lg p-5 sm:p-6 md:p-8 lg:sticky lg:top-24 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <MapPin className="text-[#3e4026]" size={20} className="sm:w-6 sm:h-6" />
                  <h2 
                    className="text-lg sm:text-xl text-[#3e4026] font-semibold"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    Delivery Address
                  </h2>
                </div>

                {(order.deliveryAddress?.[0] || order.address) ? (
                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm flex-1">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      {(order.deliveryAddress?.[0] || order.address)?.fullName}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {(order.deliveryAddress?.[0] || order.address)?.house}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {(order.deliveryAddress?.[0] || order.address)?.street || (order.deliveryAddress?.[0] || order.address)?.streetAddress}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {(order.deliveryAddress?.[0] || order.address)?.city}, {(order.deliveryAddress?.[0] || order.address)?.state}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      PIN: {(order.deliveryAddress?.[0] || order.address)?.pincode}
                    </p>
                    <div className="pt-3 border-t border-gray-200 space-y-2 mt-auto">
                      <p className="text-gray-700">
                        Mobile: +91 {(order.deliveryAddress?.[0] || order.address)?.mobile}
                      </p>
                      {(order.deliveryAddress?.[0] || order.address)?.alternateMobile && (
                        <p className="text-gray-700">
                          Alternate: +91 {(order.deliveryAddress?.[0] || order.address)?.alternateMobile}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No delivery address available</p>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

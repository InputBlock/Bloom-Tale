import { MapPin, Package } from "lucide-react"
import OrderStatusBadge from "./OrderStatusBadge"

export default function OrderDetailsCard() {
  const order = {
    orderId: "05qyy5",
    storeName: "Monas Food",
    status: "New Order",
    createdAt: "11 Jul 2023 at 08:37 PM",
    customerName: "Thomas wos",
    customerEmail: "Thomas.wos@web.de",
    customerPhone: "02161 5639516",
    deliveryAddress: {
      street: "Beethovenstraße 44, 41061",
      city: "Mönchengladbach, Germany",
    },
    items: [{ name: "Food Product", price: "€6.00" }],
    vat: "€0.39",
    subtotal: "€6.00",
    delivery: "€0.00",
    paymentMethod: "CARD",
    paymentStatus: "Unpaid",
    shippingMethod: "Pickup",
    timeframe: "Immediately",
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Order Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Orders Details</h1>
              <p className="text-sm text-gray-600">
                Order ID: <span className="font-mono text-green-700 font-semibold">{order.orderId}</span>
              </p>
            </div>
            <button className="text-gray-600 hover:text-gray-900">← Back</button>
          </div>
        </div>

        {/* Order & Customer Info */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Store</h3>
              <p className="text-lg font-bold text-gray-900">{order.storeName}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Order Status</h3>
              <OrderStatusBadge status={order.status} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Created</h3>
              <p className="text-sm text-gray-600">{order.createdAt}</p>
            </div>
          </div>

          <hr className="my-4" />

          {/* Customer Information */}
          <h3 className="font-semibold text-gray-900 mb-4">Customer Information</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Name</p>
              <p className="text-gray-900 font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
              <p className="text-gray-900 font-medium text-sm">{order.customerEmail}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Contact No</p>
              <p className="text-gray-900 font-medium">{order.customerPhone}</p>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-pink-50 rounded-lg p-6 border border-pink-200">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <MapPin size={18} className="text-pink-600" />
              Delivery Address
            </h3>
            <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">Edit</button>
          </div>
          <p className="text-gray-700">
            <span className="font-medium">Name:</span> {order.customerName}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">{order.deliveryAddress.street}</span>
          </p>
          <p className="text-gray-700">{order.deliveryAddress.city}</p>
          <p className="text-gray-700 mt-2">
            <span className="font-medium">Call:</span> {order.customerPhone}
          </p>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package size={18} />
            Order
          </h3>
          <table className="w-full mb-4">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-sm font-medium text-gray-700">Product</th>
                <th className="text-right py-2 text-sm font-medium text-gray-700">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-3 text-gray-900">{item.name}</td>
                  <td className="text-right py-3 text-gray-900 font-medium">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Vat :</span>
              <span>{order.vat}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Sub Total :</span>
              <span>{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery :</span>
              <span>{order.delivery}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200">
              <span>Total :</span>
              <span>{order.subtotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Summary & Map */}
      <div className="space-y-6">
        {/* Quick Info */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Payment Method</p>
              <p className="text-gray-900 font-medium">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Payment Status</p>
              <OrderStatusBadge status={order.paymentStatus} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Shipping Method</p>
              <p className="text-gray-900 font-medium">{order.shippingMethod}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Timeframe</p>
              <p className="text-gray-900 font-medium">{order.timeframe}</p>
            </div>
          </div>
        </div>

        {/* Tracking Map Placeholder */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Order Tracking</h3>
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MapPin size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Map will appear here</p>
            </div>
          </div>
        </div>

        {/* Status History */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Status History</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Just Created</p>
                <p className="text-xs text-gray-500">Status of: {order.customerName}</p>
                <p className="text-xs text-gray-500 mt-1">{order.createdAt}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { X, ArrowLeft } from "lucide-react"
import OrderStatusBadge from "./OrderStatusBadge"

export default function OrderDetailsModal({ order, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <button onClick={onClose} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-semibold text-gray-900">Order No:</span> {order.id}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Flower Shop:</span>{" "}
                  <span className="text-pink-600 font-semibold">{order.store}</span>
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Order Created at:</span> {order.created}
                </p>
              </div>
            </div>
            <OrderStatusBadge status={order.status} color={order.statusColor} />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Customer & Delivery Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Name</p>
                    <p className="text-gray-900 font-medium">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Email</p>
                    <p className="text-gray-900 font-medium">{order.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Contact No</p>
                    <p className="text-gray-900 font-medium">{order.phone}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="border border-gray-200 rounded-lg p-6 bg-pink-50">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
                  <button className="text-pink-600 font-semibold text-sm hover:text-pink-700">Edit</button>
                </div>
                <div className="text-gray-700 space-y-2">
                  <p className="font-medium">Name: {order.deliveryName}</p>
                  <p>{order.deliveryAddress}</p>
                  <p>Call: {order.deliveryPhone}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Flower Arrangements</h2>
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Payment & Status */}
            <div className="space-y-6">
              {/* Payment Summary */}
              <div className="border border-gray-200 rounded-lg p-6 space-y-3">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium text-gray-900">${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span className="font-medium text-gray-900">${order.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-lg text-gray-900">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                    <p className="font-semibold text-gray-900">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payment Status</p>
                    <p className="font-semibold text-gray-900">{order.paymentStatus}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="border border-gray-200 rounded-lg p-6 space-y-3">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Delivery Details</h2>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Shipping Method</p>
                    <p className="font-semibold text-gray-900">{order.method}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Time Slot</p>
                    <p className="font-semibold text-gray-900">{order.timeSlot}</p>
                  </div>
                </div>
              </div>

              {/* Status History */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Status History</h2>
                <div className="space-y-4">
                  {order.statusHistory.map((history, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-gray-200">
                          <div className="h-2 w-2 rounded-full bg-gray-600"></div>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{history.title}</p>
                        <p className="text-gray-500 text-xs">{history.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

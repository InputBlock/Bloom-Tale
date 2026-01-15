"use client"

import { useState } from "react"
import { ChevronDown, Download, Filter } from "lucide-react"
import OrderStatusBadge from "./OrderStatusBadge"
import OrdersFilterModal from "./OrdersFilterModal"
import OrderDetailsModal from "./OrderDetailsModal"

export default function OrdersTable() {
  const [showFilter, setShowFilter] = useState(false)
  const [showColumnMenu, setShowColumnMenu] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [columns, setColumns] = useState({
    orderId: true,
    store: true,
    method: true,
    timeSlot: true,
    created: true,
    lastStatus: true,
  })

  const orders = [
    {
      id: "05qyy5",
      store: "Petals & Blooms",
      method: "Delivery",
      timeSlot: "10:00 AM - 12:00 PM",
      created: "Date: 11 Jul 2023, Time: 08:37 PM",
      status: "New Order",
      statusColor: "bg-yellow-100 text-yellow-800",
      customerName: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "555-0102",
      deliveryName: "Sarah Johnson",
      deliveryAddress: "123 Main Street, Apt 4B, New York, NY 10001",
      deliveryPhone: "555-0102",
      items: [
        { name: "Premium Rose Bouquet", description: "12 red roses with greenery", price: 65.0 },
        { name: "Sunflower Arrangement", description: "Bright sunflowers in vase", price: 45.0 },
      ],
      subtotal: 110.0,
      tax: 9.9,
      deliveryFee: 10.0,
      total: 129.9,
      paymentMethod: "Credit Card",
      paymentStatus: "Unpaid",
      statusHistory: [{ title: "Order Created", timestamp: "11 Jul 2023 08:37 PM" }],
    },
    {
      id: "mwvjmw",
      store: "Bloom Beauty Flowers",
      method: "Pickup",
      timeSlot: "3:00 PM",
      created: "Date: 12 Jun 2023, Time: 06:23 PM",
      status: "Accepted",
      statusColor: "bg-blue-100 text-blue-800",
      customerName: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "555-0103",
      deliveryName: "Michael Chen",
      deliveryAddress: "456 Oak Avenue, Suite 200, Los Angeles, CA 90001",
      deliveryPhone: "555-0103",
      items: [
        { name: "Wedding Centerpiece", description: "Elegant mixed flowers", price: 85.0 },
        { name: "Baby Breath Filler", description: "White baby breath bundle", price: 15.0 },
      ],
      subtotal: 100.0,
      tax: 9.0,
      deliveryFee: 0.0,
      total: 109.0,
      paymentMethod: "Cash",
      paymentStatus: "Unpaid",
      statusHistory: [
        { title: "Order Created", timestamp: "12 Jun 2023 06:23 PM" },
        { title: "Accepted by Flower Shop", timestamp: "12 Jun 2023 06:45 PM" },
      ],
    },
    {
      id: "g97rx5",
      store: "Garden Fresh Flowers",
      method: "Delivery",
      timeSlot: "2:00 PM - 4:00 PM",
      created: "Date: 09 Jun 2023, Time: 03:02 PM",
      status: "New Order",
      statusColor: "bg-yellow-100 text-yellow-800",
      customerName: "Emily Rodriguez",
      email: "emily.r@email.com",
      phone: "555-0104",
      deliveryName: "Emily Rodriguez",
      deliveryAddress: "789 Pine Road, Chicago, IL 60601",
      deliveryPhone: "555-0104",
      items: [{ name: "Tulip Spring Mix", description: "Colorful tulip arrangement", price: 55.0 }],
      subtotal: 55.0,
      tax: 4.95,
      deliveryFee: 10.0,
      total: 69.95,
      paymentMethod: "Debit Card",
      paymentStatus: "Paid",
      statusHistory: [{ title: "Order Created", timestamp: "09 Jun 2023 03:02 PM" }],
    },
    {
      id: "nwl4n5",
      store: "The Flower Cottage",
      method: "Delivery",
      timeSlot: "1:00 PM - 3:00 PM",
      created: "Date: 31 May 2023, Time: 11:53 AM",
      status: "Accepted",
      statusColor: "bg-green-100 text-green-800",
      customerName: "David Martinez",
      email: "david.m@email.com",
      phone: "555-0105",
      deliveryName: "David Martinez",
      deliveryAddress: "321 Elm Street, Houston, TX 77001",
      deliveryPhone: "555-0105",
      items: [
        { name: "Orchid Paradise", description: "Purple orchids with fern", price: 75.0 },
        { name: "Lily Surprise", description: "White lilies and eucalyptus", price: 55.0 },
      ],
      subtotal: 130.0,
      tax: 11.7,
      deliveryFee: 10.0,
      total: 151.7,
      paymentMethod: "Credit Card",
      paymentStatus: "Paid",
      statusHistory: [
        { title: "Order Created", timestamp: "31 May 2023 11:53 AM" },
        { title: "Accepted by Flower Shop", timestamp: "31 May 2023 12:10 PM" },
      ],
    },
    {
      id: "ywm875",
      store: "Blossom & Vine",
      method: "Delivery",
      timeSlot: "11:00 AM - 1:00 PM",
      created: "Date: 20 May 2023, Time: 08:53 AM",
      status: "Prepared",
      statusColor: "bg-orange-100 text-orange-800",
      customerName: "Jessica Thompson",
      email: "jessica.t@email.com",
      phone: "555-0106",
      deliveryName: "Jessica Thompson",
      deliveryAddress: "654 Maple Drive, Phoenix, AZ 85001",
      deliveryPhone: "555-0106",
      items: [{ name: "Romantic Red Roses", description: "24 red roses with baby breath", price: 125.0 }],
      subtotal: 125.0,
      tax: 11.25,
      deliveryFee: 15.0,
      total: 151.25,
      paymentMethod: "Credit Card",
      paymentStatus: "Paid",
      statusHistory: [
        { title: "Order Created", timestamp: "20 May 2023 08:53 AM" },
        { title: "Accepted by Flower Shop", timestamp: "20 May 2023 09:15 AM" },
        { title: "Being Prepared", timestamp: "20 May 2023 09:45 AM" },
      ],
    },
  ]

  const toggleColumn = (column) => {
    setColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }))
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header and Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <Download size={18} />
              <span className="text-sm font-medium">Download</span>
            </button>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Filter size={18} />
              <span className="text-sm font-medium">Filter</span>
            </button>
          </div>
        </div>

        {/* Filter Modal */}
        {showFilter && <OrdersFilterModal onClose={() => setShowFilter(false)} />}

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {columns.orderId && <th className="px-6 py-4 text-left font-semibold text-gray-900">Order ID</th>}
                  {columns.store && <th className="px-6 py-4 text-left font-semibold text-gray-900">Flower Shop</th>}
                  {columns.method && <th className="px-6 py-4 text-left font-semibold text-gray-900">Method</th>}
                  {columns.timeSlot && <th className="px-6 py-4 text-left font-semibold text-gray-900">Time Slot</th>}
                  {columns.created && <th className="px-6 py-4 text-left font-semibold text-gray-900">Created</th>}
                  {columns.lastStatus && (
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Last Status</th>
                  )}
                  <th className="px-6 py-4 text-right font-semibold text-gray-900 relative">
                    <button
                      onClick={() => setShowColumnMenu(!showColumnMenu)}
                      className="ml-auto hover:bg-gray-200 p-1 rounded"
                    >
                      ⋮
                    </button>
                    {showColumnMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <div className="p-4 space-y-3">
                          <h3 className="font-semibold text-gray-900 mb-3">Edit Column</h3>
                          {Object.entries({
                            orderId: "Order ID",
                            store: "Flower Shop",
                            method: "Method",
                            timeSlot: "Time Slot",
                            created: "Created",
                            lastStatus: "Last Status",
                          }).map(([key, label]) => (
                            <label key={key} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={columns[key]}
                                onChange={() => toggleColumn(key)}
                                className="w-4 h-4 accent-green-500"
                              />
                              <span className="text-sm text-gray-700">{label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition"
                  >
                    {columns.orderId && (
                      <td className="px-6 py-4 font-medium text-gray-900 text-green-700">{order.id}</td>
                    )}
                    {columns.store && <td className="px-6 py-4 text-gray-700">{order.store}</td>}
                    {columns.method && <td className="px-6 py-4 text-gray-700">{order.method}</td>}
                    {columns.timeSlot && <td className="px-6 py-4 text-gray-700">{order.timeSlot}</td>}
                    {columns.created && <td className="px-6 py-4 text-gray-600 text-xs">{order.created}</td>}
                    {columns.lastStatus && (
                      <td className="px-6 py-4">
                        <OrderStatusBadge status={order.status} color={order.statusColor} />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </>
  )
}

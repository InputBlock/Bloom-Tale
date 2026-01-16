"use client"

import { X } from "lucide-react"
import { useState } from "react"

export default function OrdersFilterModal({ onClose }) {
  const [customerName, setCustomerName] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedMethods, setSelectedMethods] = useState(["Delivery"])

  const toggleMethod = (method) => {
    setSelectedMethods((prev) => (prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]))
  }

  const handleFilter = () => {
    // Add your filter logic here
    console.log({
      customerName,
      dateFrom,
      dateTo,
      selectedMethods,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Filter Orders</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Customer Name</label>
            <input
              type="text"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Date from</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Date to</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Order Methods */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Order Methods</label>
            <div className="flex gap-3">
              {["Delivery", "Pickup"].map((method) => (
                <button
                  key={method}
                  onClick={() => toggleMethod(method)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    selectedMethods.includes(method)
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleFilter}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800"
            >
              Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RecentOrders() {
  const orders = [
    { id: "#12485", customer: "John Doe", amount: "$450", status: "Completed" },
    { id: "#12486", customer: "Jane Smith", amount: "$320", status: "Pending" },
    { id: "#12487", customer: "Mike Johnson", amount: "$680", status: "Processing" },
    { id: "#12488", customer: "Sarah Wilson", amount: "$890", status: "Completed" },
    { id: "#12489", customer: "Tom Brown", amount: "$245", status: "Pending" },
  ]

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-gray-900 text-white"
      case "Pending":
        return "bg-gray-100 text-gray-800 border border-gray-300"
      case "Processing":
        return "bg-gray-200 text-gray-700"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Orders</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                Order ID
              </th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                Customer
              </th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                Amount
              </th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className={`${
                  index !== orders.length - 1 ? "border-b border-gray-50" : ""
                } hover:bg-gray-50 transition-colors`}
              >
                <td className="py-4 px-4 text-sm text-gray-900 font-medium">
                  {order.id}
                </td>
                <td className="py-4 px-4 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                  {order.customer}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 font-medium">
                  {order.amount}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function OrderStatusBadge({ status, color }) {
  const statusColors = {
    CREATED: "bg-gray-100 text-gray-800",
    PLACED: "bg-yellow-100 text-yellow-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    RETURNED: "bg-orange-100 text-orange-800",
    // Payment statuses
    PENDING: "bg-yellow-100 text-yellow-800",
    PAID: "bg-green-100 text-green-800",
    PAYMENT_FAILED: "bg-red-100 text-red-800",
  }

  const badgeColor = color || statusColors[status] || "bg-gray-100 text-gray-800"

  return <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`}>{status}</span>
}

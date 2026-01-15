export default function OrderStatusBadge({ status, color }) {
  const statusColors = {
    "New Order": "bg-yellow-100 text-yellow-800",
    Accepted: "bg-green-100 text-green-800",
    "Accepted by Restaurant": "bg-green-100 text-green-800",
    Prepared: "bg-orange-100 text-orange-800",
    Rejected: "bg-red-100 text-red-800",
    "Rejected by Store": "bg-red-100 text-red-800",
  }

  const badgeColor = color || statusColors[status] || "bg-gray-100 text-gray-800"

  return <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`}>{status}</span>
}

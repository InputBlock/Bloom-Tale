import { Phone, Mail, Calendar, CheckCircle, Clock, X } from "lucide-react"

export default function EnquiryDetailsModal({
  enquiry,
  onClose,
  onStatusChange,
  onDelete,
  actionLoading
}) {
  if (!enquiry) return null

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    if (status === "resolved") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3" /> Resolved
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
        <Clock className="w-3 h-3" /> Pending
      </span>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Enquiry Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold text-gray-900">{enquiry.name}</h4>
            {getStatusBadge(enquiry.status)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <Phone className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <a href={`tel:${enquiry.phone}`} className="font-medium text-green-700 hover:underline">
                  {enquiry.phone || "N/A"}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <a href={`mailto:${enquiry.email}`} className="font-medium text-blue-700 hover:underline truncate block">
                  {enquiry.email}
                </a>
              </div>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Service</p>
            <p className="font-medium text-gray-900">{enquiry.service}</p>
          </div>

          {enquiry.subject && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Subject</p>
              <p className="font-medium text-gray-900">{enquiry.subject}</p>
            </div>
          )}

          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Message</p>
            <p className="text-gray-700 whitespace-pre-wrap">{enquiry.message}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            Submitted on {formatDate(enquiry.createdAt)}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => onStatusChange(enquiry._id, enquiry.status === "pending" ? "resolved" : "pending")}
              disabled={actionLoading === enquiry._id}
              className={`flex-1 py-2.5 rounded-lg font-medium text-sm ${
                enquiry.status === "pending"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-yellow-500 text-white hover:bg-yellow-600"
              }`}
            >
              {enquiry.status === "pending" ? "Mark as Resolved" : "Mark as Pending"}
            </button>
            <button
              onClick={() => onDelete(enquiry._id)}
              disabled={actionLoading === enquiry._id}
              className="px-4 py-2.5 bg-red-100 text-red-600 rounded-lg font-medium text-sm hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

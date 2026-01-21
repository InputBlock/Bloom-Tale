import { Phone, Mail, Calendar, MessageSquare, CheckCircle, Clock, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react"

export default function EnquiriesTable({
  enquiries,
  loading,
  pagination,
  onPageChange,
  onView,
  onStatusChange,
  onDelete,
  actionLoading
}) {
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

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (enquiries.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="text-center py-12 text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No enquiries found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Mobile Card View */}
      <div className="block lg:hidden divide-y divide-gray-100">
        {enquiries.map((enquiry) => (
          <div key={enquiry._id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{enquiry.name}</h3>
                <p className="text-sm text-gray-500">{enquiry.service}</p>
              </div>
              {getStatusBadge(enquiry.status)}
            </div>
            
            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-3.5 h-3.5 text-green-600" />
                <a href={`tel:${enquiry.phone}`} className="hover:text-green-600 font-medium">
                  {enquiry.phone || "N/A"}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{enquiry.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(enquiry.createdAt)}
              </div>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{enquiry.message}</p>

            <div className="flex gap-2">
              <button
                onClick={() => onView(enquiry)}
                className="flex-1 px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <Eye className="w-3.5 h-3.5 inline mr-1" /> View
              </button>
              <button
                onClick={() => onStatusChange(enquiry._id, enquiry.status === "pending" ? "resolved" : "pending")}
                disabled={actionLoading === enquiry._id}
                className={`flex-1 px-3 py-2 text-xs rounded-lg ${
                  enquiry.status === "pending"
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                }`}
              >
                {enquiry.status === "pending" ? "Mark Resolved" : "Mark Pending"}
              </button>
              <button
                onClick={() => onDelete(enquiry._id)}
                disabled={actionLoading === enquiry._id}
                className="px-3 py-2 text-xs bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Customer</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Phone</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Service</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Message</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Date</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {enquiries.map((enquiry) => (
              <tr key={enquiry._id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-gray-900">{enquiry.name}</p>
                    <p className="text-sm text-gray-500">{enquiry.email}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <a 
                    href={`tel:${enquiry.phone}`} 
                    className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-700 font-medium"
                  >
                    <Phone className="w-4 h-4" />
                    {enquiry.phone || "N/A"}
                  </a>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">{enquiry.service}</td>
                <td className="py-4 px-4">
                  <p className="text-sm text-gray-600 max-w-xs truncate">{enquiry.message}</p>
                </td>
                <td className="py-4 px-4 text-sm text-gray-500">{formatDate(enquiry.createdAt)}</td>
                <td className="py-4 px-4">{getStatusBadge(enquiry.status)}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(enquiry)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onStatusChange(enquiry._id, enquiry.status === "pending" ? "resolved" : "pending")}
                      disabled={actionLoading === enquiry._id}
                      className={`p-2 rounded-lg ${
                        enquiry.status === "pending"
                          ? "text-green-600 hover:bg-green-100"
                          : "text-yellow-600 hover:bg-yellow-100"
                      }`}
                      title={enquiry.status === "pending" ? "Mark Resolved" : "Mark Pending"}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(enquiry._id)}
                      disabled={actionLoading === enquiry._id}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100">
          <button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}

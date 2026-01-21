import { useState, useEffect } from "react"
import { enquiriesAPI } from "../api"
import EnquiryStats from "../components/Enquiries/EnquiryStats"
import EnquiryFilters from "../components/Enquiries/EnquiryFilters"
import EnquiriesTable from "../components/Enquiries/EnquiriesTable"
import EnquiryDetailsModal from "../components/Enquiries/EnquiryDetailsModal"

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalEnquiries: 0, pendingEnquiries: 0, resolvedEnquiries: 0 })
  const [filter, setFilter] = useState("all")
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 })
  const [selectedEnquiry, setSelectedEnquiry] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    fetchEnquiries()
    fetchStats()
  }, [filter, pagination.currentPage])

  const fetchEnquiries = async () => {
    try {
      setLoading(true)
      const params = { page: pagination.currentPage, limit: 10 }
      if (filter !== "all") params.status = filter
      
      const response = await enquiriesAPI.getAll(params)
      if (response.data.success) {
        setEnquiries(response.data.data.enquiries)
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.data.pagination.totalPages
        }))
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await enquiriesAPI.getStats()
      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }))
  }

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      setActionLoading(enquiryId)
      await enquiriesAPI.updateStatus(enquiryId, newStatus)
      fetchEnquiries()
      fetchStats()
      if (selectedEnquiry?._id === enquiryId) {
        setSelectedEnquiry(prev => ({ ...prev, status: newStatus }))
      }
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (enquiryId) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return
    
    try {
      setActionLoading(enquiryId)
      await enquiriesAPI.delete(enquiryId)
      fetchEnquiries()
      fetchStats()
      if (selectedEnquiry?._id === enquiryId) {
        setSelectedEnquiry(null)
      }
    } catch (error) {
      console.error("Error deleting enquiry:", error)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <EnquiryStats stats={stats} />
      
      <EnquiryFilters 
        filter={filter} 
        onFilterChange={handleFilterChange} 
      />

      <EnquiriesTable
        enquiries={enquiries}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onView={setSelectedEnquiry}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        actionLoading={actionLoading}
      />

      <EnquiryDetailsModal
        enquiry={selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        actionLoading={actionLoading}
      />
    </div>
  )
}

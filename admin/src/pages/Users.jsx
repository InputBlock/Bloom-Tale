import { useState, useEffect } from "react"
import { usersAPI } from "../api"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Mail, 
  Calendar, 
  MapPin, 
  ShoppingBag, 
  BadgeCheck, 
  AlertCircle,
  Search,
  Trash2,
  Eye,
  X,
  RefreshCw
} from "lucide-react"

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll()
      setUsers(response.data.data.users || [])
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDetails = async (userId) => {
    setModalLoading(true)
    setShowModal(true)
    try {
      const response = await usersAPI.getById(userId)
      setSelectedUser(response.data.data)
    } catch (error) {
      console.error("Error fetching user details:", error)
    } finally {
      setModalLoading(false)
    }
  }

  const deleteUser = async (userId) => {
    try {
      await usersAPI.delete(userId)
      setUsers(users.filter(u => u._id !== userId))
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 sm:w-8 h-6 sm:h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Search Bar */}
      <div className="p-3 sm:p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm sm:text-base"
          />
        </div>
        <span className="text-xs sm:text-sm text-gray-500">{users.length} users</span>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-100">
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No users found
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user._id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{user.username || "No name"}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => fetchUserDetails(user._id)}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(user._id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 pl-12">
                {user.isEmailVerified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-medium rounded-full">
                    <BadgeCheck className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-medium rounded-full">
                    <AlertCircle className="w-3 h-3" /> Pending
                  </span>
                )}
                <span className="text-[10px] text-gray-500">{formatDate(user.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-[10px] lg:text-xs font-semibold text-gray-500 uppercase">User</th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-[10px] lg:text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-[10px] lg:text-xs font-semibold text-gray-500 uppercase">Joined</th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-right text-[10px] lg:text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-sm">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <div className="flex items-center gap-2 lg:gap-3">
                      <div className="w-8 lg:w-10 h-8 lg:h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-sm lg:text-base">
                        {user.email?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm lg:text-base truncate">{user.username || "No name"}</p>
                        <p className="text-xs lg:text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    {user.isEmailVerified ? (
                      <span className="inline-flex items-center gap-1 px-1.5 lg:px-2 py-0.5 lg:py-1 bg-green-100 text-green-700 text-[10px] lg:text-xs font-medium rounded-full">
                        <BadgeCheck className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 lg:px-2 py-0.5 lg:py-1 bg-yellow-100 text-yellow-700 text-[10px] lg:text-xs font-medium rounded-full">
                        <AlertCircle className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-600 text-xs lg:text-sm">{formatDate(user.createdAt)}</td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <div className="flex items-center justify-end gap-1 lg:gap-2">
                      <button
                        onClick={() => fetchUserDetails(user._id)}
                        className="p-1.5 lg:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(user._id)}
                        className="p-1.5 lg:p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => { setShowModal(false); setSelectedUser(null); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
            >
              <div className="bg-white rounded-xl shadow-xl m-2 sm:m-4">
                <div className="flex items-center justify-between p-4 sm:p-5 border-b">
                  <h3 className="text-base sm:text-lg font-bold">User Details</h3>
                  <button onClick={() => { setShowModal(false); setSelectedUser(null); }} className="p-1 hover:bg-gray-100 rounded">
                    <X className="w-4 sm:w-5 h-4 sm:h-5" />
                  </button>
                </div>

                <div className="p-4 sm:p-5">
                  {modalLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="w-5 sm:w-6 h-5 sm:h-6 animate-spin text-gray-400" />
                    </div>
                  ) : selectedUser ? (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gray-900 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold">
                          {selectedUser.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm sm:text-base">{selectedUser.username || "No username"}</p>
                          <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 truncate">
                            <Mail className="w-3 h-3 flex-shrink-0" /> {selectedUser.email}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-3 text-sm">
                        <div className="bg-gray-50 p-2.5 sm:p-3 rounded-lg">
                          <p className="text-gray-500 text-xs sm:text-sm">Orders</p>
                          <p className="font-semibold text-base sm:text-lg">{selectedUser.stats?.totalOrders || 0}</p>
                        </div>
                        <div className="bg-gray-50 p-2.5 sm:p-3 rounded-lg">
                          <p className="text-gray-500 text-xs sm:text-sm">Spent</p>
                          <p className="font-semibold text-base sm:text-lg">₹{selectedUser.stats?.totalSpent || 0}</p>
                        </div>
                      </div>

                      <div className="text-xs sm:text-sm text-gray-500 flex flex-wrap items-center gap-3 sm:gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 sm:w-4 h-3 sm:h-4" /> Joined {formatDate(selectedUser.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 sm:w-4 h-3 sm:h-4" /> {selectedUser.addresses?.length || 0} addresses
                        </span>
                      </div>

                      {selectedUser.addresses?.length > 0 && (
                        <div className="border-t pt-3 sm:pt-4">
                          <p className="font-medium mb-2 text-sm sm:text-base">Addresses</p>
                          <div className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
                            {selectedUser.addresses.map((addr, idx) => (
                              <div key={idx} className="bg-gray-50 p-2.5 sm:p-3 rounded-lg text-xs sm:text-sm">
                                <p className="font-medium">{addr.fullName}</p>
                                <p className="text-gray-500">
                                  {[addr.streetAddress, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")}
                                </p>
                                {addr.mobile && <p className="text-gray-500">📞 {addr.mobile}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowDeleteConfirm(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm"
            >
              <div className="bg-white rounded-xl shadow-xl m-2 sm:m-4 p-4 sm:p-6 text-center">
                <Trash2 className="w-8 sm:w-10 h-8 sm:h-10 text-red-500 mx-auto mb-2 sm:mb-3" />
                <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">Delete User?</h3>
                <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">This action cannot be undone.</p>
                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteUser(showDeleteConfirm)}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

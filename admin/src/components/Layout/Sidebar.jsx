import { Link, useLocation, useNavigate } from "react-router-dom"
import { LayoutDashboard, Plus, List, Package, Users, LogOut, X, Menu, FileEdit, MapPin, MessageSquare } from "lucide-react"
import { authAPI } from "../../api"

export default function Sidebar({ isOpen, setIsOpen, isMobile }) {
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Plus, label: "Add Items", path: "/add-items" },
    { icon: List, label: "List Items", path: "/list-items" },
    { icon: Package, label: "Orders", path: "/orders" },
    { icon: Users, label: "Users", path: "/users" },
    { icon: MessageSquare, label: "Enquiries", path: "/enquiries" },
    { icon: MapPin, label: "Delivery Zones", path: "/delivery-zones" },
    { icon: FileEdit, label: "Edit Content", path: "/edit-content" },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    try {
      // Call backend to clear httpOnly cookie
      await authAPI.logout()
    } catch {
      // Ignore errors, redirect anyway
    }
    navigate("/login")
  }

  const handleNavClick = () => {
    // Close sidebar on mobile after clicking a nav item
    if (isMobile) {
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-black text-white z-50 transition-all duration-300 ${
          isMobile 
            ? (isOpen ? "w-64 translate-x-0" : "-translate-x-full w-64")
            : (isOpen ? "w-64" : "w-16")
        }`}
      >
        {/* Header */}
        <div className={`p-4 flex items-center border-b border-gray-800 ${isOpen ? "justify-between" : "justify-center"}`}>
          {isOpen ? (
            <>
              <div>
                <h1 className="text-2xl font-bold text-white">FOREVER</h1>
                <p className="text-gray-400 text-sm">Admin Panel</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsOpen(true)}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all duration-200 ${
                  isOpen ? "" : "justify-center"
                } ${
                  isActive(item.path)
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                }`}
                title={!isOpen ? item.label : ""}
              >
                <Icon size={20} />
                {isOpen && <span className="text-sm">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-gray-800 absolute bottom-0 left-0 right-0">
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-lg w-full transition-all duration-200 ${
              isOpen ? "" : "justify-center"
            }`}
            title={!isOpen ? "Logout" : ""}
          >
            <LogOut size={20} />
            {isOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

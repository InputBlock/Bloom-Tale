import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"

export default function Layout({ title, subtitle }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      // Auto-close sidebar on mobile, auto-open on desktop
      if (mobile) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} isMobile={isMobile} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isMobile ? "ml-0" : (isSidebarOpen ? "ml-64" : "ml-16")
      }`}>
        <Header 
          title={title} 
          subtitle={subtitle} 
          setIsOpen={setIsSidebarOpen} 
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
        />
        
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

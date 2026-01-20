import { useState, useEffect } from "react"
import StatCard from "../components/Dashboard/StatCard"
import SalesChart from "../components/Dashboard/SalesChart"
import OrdersChart from "../components/Dashboard/OrdersChart"
import RecentOrders from "../components/Dashboard/RecentOrders"
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react"
import { API_ENDPOINTS } from "../config/api"

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    growth: 0,
    loading: true
  })

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Fetch order stats
      const orderResponse = await fetch(API_ENDPOINTS.GET_ORDER_STATS, {
        credentials: 'include'
      })
      const orderData = await orderResponse.json()

      // Fetch user stats
      const userResponse = await fetch(API_ENDPOINTS.GET_USER_STATS, {
        credentials: 'include'
      })
      const userData = await userResponse.json()

      if (orderData.success && userData.success) {
        const totalRevenue = orderData.data.totalRevenue || 0
        const totalOrders = orderData.data.totalOrders || 0
        const totalUsers = userData.data.totalUsers || 0
        
        // Calculate growth (you can adjust this logic based on your needs)
        const growth = totalOrders > 0 ? ((totalRevenue / totalOrders) * 0.1).toFixed(1) : 0

        setStats({
          totalSales: totalRevenue,
          totalOrders,
          totalUsers,
          growth,
          loading: false
        })
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      setStats(prev => ({ ...prev, loading: false }))
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={formatCurrency(stats.totalSales)}
          change="this month"
          icon={DollarSign}
        />
        <StatCard
          title="Total Orders"
          value={formatNumber(stats.totalOrders)}
          change="this month"
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Users"
          value={formatNumber(stats.totalUsers)}
          change="this month"
          icon={Users}
        />
        <StatCard
          title="Growth"
          value={`${stats.growth}%`}
          change="this month"
          icon={TrendingUp}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <OrdersChart />
      </div>

      {/* Recent Orders Table */}
      <RecentOrders />
    </div>
  )
}

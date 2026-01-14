import StatCard from "../components/Dashboard/StatCard"
import SalesChart from "../components/Dashboard/SalesChart"
import OrdersChart from "../components/Dashboard/OrdersChart"
import RecentOrders from "../components/Dashboard/RecentOrders"
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value="$24,500"
          change="+12.5%"
          icon={DollarSign}
        />
        <StatCard
          title="Total Orders"
          value="1,294"
          change="+8.2%"
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Users"
          value="3,842"
          change="+5.1%"
          icon={Users}
        />
        <StatCard
          title="Growth"
          value="24%"
          change="+2.3%"
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

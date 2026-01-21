import OrdersTable from "../components/Orders/OrdersTable";

export default function Orders() {
  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <OrdersTable />
      </div>
    </div>
  )
}

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import AddItems from './pages/AddItems'
import ListItems from './pages/ListItems'
import Orders from './pages/Orders'
import Users from './pages/Users'
import Login from './pages/Login'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout title="Dashboard" subtitle="Manage your business with ease" />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/add-items" element={<Layout title="Add Items" subtitle="Manage your business with ease" />}>
          <Route index element={<AddItems />} />
        </Route>
        <Route path="/list-items" element={<Layout title="List Items" subtitle="Manage your business with ease" />}>
          <Route index element={<ListItems />} />
        </Route>
        <Route path="/orders" element={<Layout title="Orders" subtitle="Manage your business with ease" />}>
          <Route index element={<Orders />} />
        </Route>
        <Route path="/users" element={<Layout title="Users" subtitle="Manage your business with ease" />}>
          <Route index element={<Users />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

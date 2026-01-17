import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import AddItems from './pages/AddItems'
import ListItems from './pages/ListItems'
import Orders from './pages/Orders'
import Users from './pages/Users'
import EditContent from './pages/EditContent'
import Login from './pages/Login'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout title="Dashboard" subtitle="Manage your business with ease" />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/add-items" element={
          <ProtectedRoute>
            <Layout title="Add Items" subtitle="Manage your business with ease" />
          </ProtectedRoute>
        }>
          <Route index element={<AddItems />} />
        </Route>
        <Route path="/list-items" element={
          <ProtectedRoute>
            <Layout title="List Items" subtitle="Manage your business with ease" />
          </ProtectedRoute>
        }>
          <Route index element={<ListItems />} />
        </Route>
        <Route path="/orders" element={
          <ProtectedRoute>
            <Layout title="Orders" subtitle="Manage your business with ease" />
          </ProtectedRoute>
        }>
          <Route index element={<Orders />} />
        </Route>
        <Route path="/users" element={
          <ProtectedRoute>
            <Layout title="Users" subtitle="Manage your business with ease" />
          </ProtectedRoute>
        }>
          <Route index element={<Users />} />
        </Route>
        <Route path="/edit-content" element={
          <ProtectedRoute>
            <Layout title="Edit Content" subtitle="Manage hero sections and landing page" />
          </ProtectedRoute>
        }>
          <Route index element={<EditContent />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

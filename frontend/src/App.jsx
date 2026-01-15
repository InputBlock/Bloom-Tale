import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Register from './pages/Register'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ProductDetailsPage from './pages/productDetails'
import Landing from './pages/Landing'
import ProductCart from './pages/ProductCart/productCart'
import Checkout from './pages/Checkout'
import { CartProvider } from './context/CartContext'
import ToastContainer from './components/common/ToastContainer'

import './App.css'

function App() {
  return (
    <CartProvider>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/productDetails" element={<ProductDetailsPage />} />
          <Route path="/product/:productId" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<ProductCart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Router>
    </CartProvider>
  )
}

export default App

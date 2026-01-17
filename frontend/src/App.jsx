import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Services from './pages/Services/Services'
import WeddingServicesPage from './pages/Services/WeddingServicesPage'
import Register from './pages/Register'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ProductDetailsPage from './pages/productDetails'
import Landing from './pages/Landing'
import ProductCart from './pages/ProductCart/productCart'
import Checkout from './pages/Checkout'
import Shop from './pages/Shop'
import RazorpayPayment from './pages/RazorpayPayment'
import Orders from './pages/Orders'
import OrderDetails from './pages/OrderDetails'
import { CartProvider } from './context/CartContext'
import ToastContainer from './components/common/ToastContainer'
import AuthCallback from './pages/AuthCallback'

import './App.css'

function App() {
  return (
    <CartProvider>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/wedding" element={<WeddingServicesPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/productDetails" element={<ProductDetailsPage />} />
          <Route path="/product/:productId" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<ProductCart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/razorpay-payment" element={<RazorpayPayment />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </Router>
    </CartProvider>
  )
}

export default App

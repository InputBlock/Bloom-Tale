import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import ProductDetailsPage from './pages/productDetails'
import Landing from './pages/Landing'

import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/productDetails" element={<ProductDetailsPage />} />
      </Routes>
    </Router>
  )
}

export default App

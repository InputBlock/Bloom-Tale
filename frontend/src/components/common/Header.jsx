"use client"

import { useState } from "react"
import { Search, User, ShoppingCart, Menu, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import { showToast } from "./ToastContainer"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { getCartCount } = useCart()

  const categories = [
    "Same Day Delivery",
    "Birthday Flowers",
    "Anniversary Flowers",
    "Grand Openings",
    "Condolences & Fragrances",
    "Potted Plants",
    "Gift Combos",
    "Services",
  ]

  return (
    <header className="sticky top-0 z-50">
      {/* Top Search Bar */}
      <div className="bg-[#3e4026] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex-1 max-w-md mx-auto w-full">
          <div className="flex items-center bg-[#2a2d1a] rounded px-3 py-2">
            <input
              type="text"
              placeholder="Search for Flowers"
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-300 outline-none"
            />
            <Search size={18} className="text-gray-300" />
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button 
            onClick={() => navigate("/cart")}
            className="relative p-2 hover:bg-[#5e6043] rounded-full transition-colors duration-300"
          >
            <ShoppingCart size={20} />
            <span className="absolute top-0 right-0 bg-[#5e6043] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {getCartCount()}
            </span>
          </button>
          <button className="p-2 hover:bg-gray-800 rounded-full">
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}

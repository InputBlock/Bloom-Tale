"use client"

import { useState } from "react"
import { Search, User, ShoppingCart, Menu, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../../context/CartContext"

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
    "Same Day Gifting",
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Top Search Bar */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex-1 max-w-md mx-auto w-full">
          <div className="flex items-center bg-gray-800 rounded px-3 py-2">
            <input
              type="text"
              placeholder="Search for Flowers"
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-400 outline-none"
            />
            <Search size={18} className="text-gray-400" />
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button 
            onClick={() => navigate("/cart")}
            className="relative p-2 hover:bg-gray-800 rounded-full"
          >
            <ShoppingCart size={20} />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {getCartCount()}
            </span>
          </button>
          <button className="p-2 hover:bg-gray-800 rounded-full">
            <User size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between md:justify-start gap-4 overflow-x-auto pb-2 md:pb-0">
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {categories.map((category, index) => (
            <button
              key={index}
              className="text-xs md:text-sm whitespace-nowrap text-gray-700 hover:text-gray-900 px-2 py-1 md:px-3"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            {categories.map((category, index) => (
              <button
                key={index}
                className="block w-full text-left text-sm text-gray-700 hover:text-gray-900 px-3 py-2"
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}

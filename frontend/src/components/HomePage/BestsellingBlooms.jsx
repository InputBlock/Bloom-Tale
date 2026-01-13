"use client"

import { Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

export default function BestsellingBlooms() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const products = [
    {
      id: 1,
      name: "Blooming Elegance",
      price: "₹ 2245",
      rating: 4.8,
      reviews: 320,
      sameDayDelivery: true,
      image: "/white-flowers-arrangement.jpg",
    },
    {
      id: 2,
      name: "Happy Birthday",
      price: "₹ 2795",
      rating: 4.9,
      reviews: 250,
      sameDayDelivery: true,
      image: "/purple-flowers-birthday.jpg",
    },
    {
      id: 3,
      name: "Love Romance",
      price: "₹ 1195",
      rating: 4.7,
      reviews: 410,
      sameDayDelivery: true,
      image: "/red-roses-bouquet.png",
    },
    {
      id: 4,
      name: "Bright Wishes",
      price: "₹ 4095",
      rating: 5.0,
      reviews: 180,
      sameDayDelivery: true,
      image: "/colorful-flowers-arrangement.jpg",
    },
  ]

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  return (
    <section className="py-12 md:py-20 bg-gray-50 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-2">Bestselling Blooms</h2>
          <p className="text-gray-600 text-sm md:text-base">Floral arrangements that get the most love</p>
        </div>

        {/* Products Grid with Controls */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition"
              >
                {/* Product Image */}
                <div className="relative h-64 md:h-72 bg-gray-200 overflow-hidden group">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  {/* Wishlist Button */}
                  <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition">
                    <Heart size={18} className="text-gray-600" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-base mb-2">{product.name}</h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-400 text-sm">{"★".repeat(5)}</div>
                    <span className="text-xs text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <p className="text-xl font-bold text-gray-900 mb-2">{product.price}</p>

                  {/* Same Day Delivery */}
                  {product.sameDayDelivery && (
                    <p className="text-xs text-blue-600 font-semibold mb-4">Same Day Delivery</p>
                  )}

                  {/* Add to Cart Button */}
                  <button className="w-full bg-black text-white py-2 rounded text-sm font-semibold hover:bg-gray-900 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="hidden lg:flex absolute left-0 top-1/3 -translate-x-6 bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="hidden lg:flex absolute right-0 top-1/3 translate-x-6 bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { useCart } from "../../context/CartContext"
import { useNavigate } from "react-router-dom"

export default function ProductInfo() {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [pincode, setPincode] = useState("")
  const { addToCart } = useCart()
  const navigate = useNavigate()
  
  const description = `This exquisite handcrafted rose gold crochet flower set brings timeless elegance to any space. 
  Each piece is carefully crafted with premium metal thread, showcasing intricate details and superior craftsmanship. 
  Perfect for home decor, these flowers add a touch of sophistication and charm to your living space.`

  const product = {
    id: 1,
    name: "rose gold crochet flower- set of 3",
    price: 1990,
    image: "/white-flowers-arrangement.jpg",
  }

  const variants = [
    { id: 0, image: "/white-flowers-arrangement.jpg", name: "White Arrangement" },
    { id: 1, image: "/purple-flowers-birthday.jpg", name: "Purple Birthday" },
  ]

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1)
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: variants[selectedVariant].image,
      variantId: selectedVariant,
      variantName: variants[selectedVariant].name,
      quantity: quantity,
    }
    addToCart(cartItem)
    navigate("/cart")
  }

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-3xl font-serif text-gray-900 mb-2">
          rose gold crochet flower- set of 3
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex text-yellow-400">{"★".repeat(5)}</div>
          <span className="text-sm text-gray-600">5 reviews</span>
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-2xl font-bold text-gray-900">Rs. 1,990.00</p>
        <p className="text-sm text-yellow-600 mt-1">GST Benefit Applied</p>
      </div>

      {/* Select Variant */}
      <div>
        <p className="text-sm font-medium text-gray-900 mb-3">Select Variant</p>
        <div className="flex gap-3">
          {variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => setSelectedVariant(variant.id)}
              className={`w-16 h-16 border-2 rounded-lg overflow-hidden ${
                selectedVariant === variant.id ? "border-gray-900" : "border-gray-300"
              }`}
            >
              <img
                src={variant.image}
                alt={variant.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4 border border-gray-300 rounded-md w-fit">
        <button
          onClick={() => handleQuantityChange("decrement")}
          className="p-3 hover:bg-gray-100"
        >
          <Minus size={16} />
        </button>
        <span className="text-lg font-medium w-8 text-center">{quantity}</span>
        <button
          onClick={() => handleQuantityChange("increment")}
          className="p-3 hover:bg-gray-100"
        >
          <Plus size={16} />
        </button>
      </div>
            <div>
        <h2 className="text-2xl font-serif text-gray-900 mb-4 border-b pb-2">
          Description:
        </h2>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={handleAddToCart}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-md transition"
        >
          ADD TO CART
        </button>
        <button 
          className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-md transition"
        >
          BUY IT NOW
        </button>
      </div>
    </div>
  )
}

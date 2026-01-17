import { useCart } from "../context/CartContext"
import { Minus, Plus, Trash2, MapPin, ChevronRight, ShoppingBag } from "lucide-react"
import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import Header from "../components/common/Header"
import Footer from "../components/common/Footer"

export default function ProductCart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, isLoggedIn, fetchCart } = useCart()
  const navigate = useNavigate()

  // Protect cart page - require login
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login", { state: { from: "/cart" } })
    } else {
      // Fetch cart from DB when page loads
      fetchCart()
    }
  }, [isLoggedIn, navigate, fetchCart])

  const deliveryCharge = 25
  const totalAmount = getCartTotal() + deliveryCharge

  const handleQuantityChange = (cartId, currentQuantity, type) => {
    if (type === "increment") {
      updateQuantity(cartId, currentQuantity + 1)
    } else if (type === "decrement" && currentQuantity > 1) {
      updateQuantity(cartId, currentQuantity - 1)
    }
  }

  const formatDate = () => {
    const date = new Date()
    const day = date.getDate()
    const month = date.toLocaleString("default", { month: "short" })
    const year = date.getFullYear()
    const ordinal = (n) => {
      const s = ["th", "st", "nd", "rd"]
      const v = n % 100
      return n + (s[(v - 20) % 10] || s[v] || s[0])
    }
    return `${ordinal(day)} ${month} ${year} between 5pm - 9pm`
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf9f7]">
        <Header />
        <main className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[11px] tracking-[0.12em] text-[#9a9a9a] mb-12">
              <Link to="/home" className="hover:text-[#3e4026] transition-colors">HOME</Link>
              <ChevronRight size={10} className="text-[#c4c4c4]" />
              <span className="text-[#3e4026]">CART</span>
            </nav>

            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-8 bg-[#f5f4f0] rounded-full flex items-center justify-center">
                <ShoppingBag size={40} className="text-[#3e4026]/40" />
              </div>
              <h2 
                className="text-3xl text-[#3e4026] mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Your Cart is Empty
              </h2>
              <p className="text-[#7a7a7a] mb-8 max-w-md mx-auto">
                Looks like you haven't added any beautiful blooms to your cart yet. 
                Explore our collection and find the perfect arrangement.
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="bg-[#3e4026] hover:bg-[#2d2f1c] text-white font-medium py-4 px-12 transition-all duration-300"
              >
                Explore Collection
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Header />
      
      <main className="pt-28 pb-40">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[11px] tracking-[0.12em] text-[#9a9a9a] mb-8">
            <Link to="/home" className="hover:text-[#3e4026] transition-colors">HOME</Link>
            <ChevronRight size={10} className="text-[#c4c4c4]" />
            <span className="text-[#3e4026]">SHOPPING CART</span>
          </nav>

          {/* Page Title */}
          <div className="mb-10">
            <h1 
              className="text-3xl md:text-4xl text-[#3e4026] mb-3"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Shopping Cart
            </h1>
            <p className="text-[#7a7a7a] text-sm">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {/* Cart Items */}
          <div className="space-y-4 mb-8">
            {cartItems.map((item) => (
              <div
                key={item.cartId}
                className="bg-white rounded-xl border border-[#e8e4dd] shadow-sm transition-all duration-300 overflow-hidden hover:shadow-md"
              >
                <div className="p-6 flex flex-col lg:flex-row gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-40 h-40 object-cover rounded-lg bg-[#f5f4f0]"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 
                        className="text-xl text-[#3e4026] mb-3"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                      >
                        {item.name}
                      </h3>
                      
                      {/* Size Badge */}
                      {item.size && (
                        <span className="inline-block px-3 py-1 bg-[#f5f4f0] text-[#3e4026] text-xs font-medium rounded-full mb-3 capitalize">
                          {item.size}
                        </span>
                      )}
                      
                      {/* Delivery Info */}
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-[#3e4026]">
                          <span className="underline underline-offset-2">Standard Delivery</span> - ₹{deliveryCharge}
                        </p>
                        <p className="text-sm text-[#7a7a7a]">
                          On {formatDate()}
                        </p>
                        <p className="text-sm text-[#7a7a7a] flex items-center gap-1">
                          <MapPin size={12} />
                          Pincode - {pincode}
                        </p>
                      </div>
                    </div>

                    {/* Price on mobile */}
                    <p 
                      className="text-2xl text-[#3e4026] mt-4 lg:hidden"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      ₹ {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-between gap-4">
                    {/* Price on desktop */}
                    <p 
                      className="hidden lg:block text-2xl text-[#3e4026]"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      ₹ {(item.price * item.quantity).toLocaleString()}
                    </p>

                    {/* Quantity Selector */}
                    <div className="flex items-center">
                      <div className="flex items-center border border-[#e8e4dd] rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(item.cartId, item.quantity, "decrement")}
                          className="p-3 hover:bg-[#f5f4f0] transition-colors text-[#3e4026]"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-base font-medium w-10 text-center text-[#3e4026]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.cartId, item.quantity, "increment")}
                          className="p-3 hover:bg-[#f5f4f0] transition-colors text-[#3e4026]"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="ml-3 p-3 text-[#c4c4c4] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                        aria-label="Remove from cart"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-[#e8e4dd] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-5">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-sm text-[#7a7a7a] mb-1">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} • Delivery ₹{deliveryCharge}
              </p>
              <p className="text-xl md:text-2xl text-[#3e4026]">
                Total Amount : 
                <span 
                  className="font-semibold ml-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  ₹ {totalAmount.toLocaleString()}
                </span>
              </p>
            </div>
            <button 
              onClick={() => navigate("/checkout")}
              className="bg-[#3e4026] hover:bg-[#2d2f1c] text-white font-medium py-4 px-8 md:px-16 text-sm tracking-wide transition-all duration-300"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

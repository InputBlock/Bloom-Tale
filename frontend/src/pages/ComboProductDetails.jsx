import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ChevronRight, ShoppingBag, Check, Minus, Plus, Package } from "lucide-react"
import Header from "../components/common/Header"
import Footer from "../components/common/Footer"
import ComboSidebar from "../components/combo/ComboSidebar"
import { useCombo } from "../context/ComboContext"

export default function ComboProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCombo, comboItems } = useCombo()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('Medium')
  const [selectedColor, setSelectedColor] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showComboSidebar, setShowComboSidebar] = useState(true)

  // Color options for balloons/candles
  const colors = [
    { id: 'red', name: 'Red', hex: '#EF4444' },
    { id: 'pink', name: 'Pink', hex: '#EC4899' },
    { id: 'blue', name: 'Blue', hex: '#3B82F6' },
    { id: 'purple', name: 'Purple', hex: '#A855F7' },
    { id: 'yellow', name: 'Yellow', hex: '#EAB308' },
    { id: 'gold', name: 'Gold', hex: '#F59E0B' },
    { id: 'silver', name: 'Silver', hex: '#94A3B8' },
    { id: 'white', name: 'White', hex: '#F8FAFC' },
  ]

  useEffect(() => {
    fetchProduct()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/v1/getProductDetail/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      
      if (data.success && data.data) {
        setProduct(data.data)
        
        // Set default selections
        const isFlower = data.data.category?.toLowerCase().includes('flower')
        
        if (isFlower && data.data.pricing) {
          const mediumSize = 'Medium'
          const mediumPrice = data.data.pricing?.medium || 0
          setSelectedSize(mediumSize)
          setCurrentPrice(mediumPrice)
        } else {
          // For balloons/candles, default to first color
          setSelectedColor(colors[0])
          setCurrentPrice(data.data.price || 0)
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  // Update price when size changes
  useEffect(() => {
    if (product?.pricing && selectedSize) {
      const sizeKey = selectedSize.toLowerCase()
      const newPrice = product.pricing[sizeKey] || 0
      setCurrentPrice(newPrice)
    }
  }, [selectedSize, product])

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1)
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleAddToCombo = () => {
    const isFlower = product.category?.toLowerCase().includes('flower')
    
    addToCombo({
      product_id: product.product_id,
      name: product.name,
      images_uri: product.images_uri?.[0] || '',
      price: currentPrice,
      quantity: quantity,
      selectedSize: isFlower ? selectedSize : undefined,
      selectedColor: !isFlower && selectedColor ? selectedColor : undefined,
      category: product.category
    })

    // Navigate back to combo page
    navigate('/shop?category=combos')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-6 md:px-12 py-24">
          <div className="h-4 bg-gray-100 w-48 mb-12 animate-pulse"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-[#f9f8f6] animate-pulse"></div>
            
            <div className="space-y-6">
              <div className="h-4 bg-gray-100 w-24 animate-pulse"></div>
              <div className="h-10 bg-gray-100 w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-100 w-1/3 animate-pulse"></div>
              <div className="h-4 bg-gray-100 w-full animate-pulse"></div>
              <div className="h-4 bg-gray-100 w-5/6 animate-pulse"></div>
              <div className="flex gap-3 pt-4">
                <div className="h-12 bg-gray-100 w-24 animate-pulse"></div>
                <div className="h-12 bg-gray-100 w-24 animate-pulse"></div>
                <div className="h-12 bg-gray-100 w-24 animate-pulse"></div>
              </div>
              <div className="h-14 bg-gray-100 w-full animate-pulse"></div>
            </div>
          </div>
        </main>
        <Footer isComboSidebarOpen={true} />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="text-center">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#3e4026]/60 mb-4">
              Error
            </p>
            <h2 
              className="text-3xl md:text-4xl text-[#3e4026] mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Product not found
            </h2>
            <p className="text-[#3e4026]/60 mb-8">
              We couldn't find the product you're looking for.
            </p>
            <Link 
              to="/shop?category=combos" 
              className="inline-block bg-[#3e4026] text-white py-4 px-8 hover:bg-[#2d2f1c] transition-colors"
            >
              Back to Combos
            </Link>
          </div>
        </main>
        <Footer isComboSidebarOpen={true} />
      </div>
    )
  }

  const isFlower = product.category?.toLowerCase().includes('flower')
  const sizes = ['Small', 'Medium', 'Large']

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className={`transition-all duration-300 pt-24 pb-12 ${
        showComboSidebar 
          ? 'max-w-7xl mx-auto pl-0 pr-6 md:pl-0 md:pr-[350px]'
          : 'max-w-7xl mx-auto pl-0 pr-6 md:pl-0 md:pr-12'
      }`}>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] tracking-[0.12em] text-[#9a9a9a] mb-8 md:mb-12 pl-6 md:pl-12">
          <Link to="/home" className="hover:text-[#3e4026] transition-colors">HOME</Link>
          <ChevronRight size={10} className="text-[#c4c4c4]" />
          <Link to="/shop?category=combos" className="hover:text-[#3e4026] transition-colors">COMBOS</Link>
          <ChevronRight size={10} className="text-[#c4c4c4]" />
          <span className="text-[#3e4026]">{product.name.toUpperCase()}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left - Product Images */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex gap-4">
              {/* Thumbnails */}
              {product.images_uri && product.images_uri.length > 1 && (
                <div className="flex flex-col gap-3 order-1">
                  {product.images_uri.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 md:w-24 md:h-24 border-2 transition-all overflow-hidden bg-[#f9f8f6] ${
                        currentImageIndex === index
                          ? 'border-[#3e4026]'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="flex-1 order-2">
                <div className="relative aspect-[3/4] bg-[#f9f8f6] overflow-hidden">
                  {product.images_uri?.[currentImageIndex] ? (
                    <img
                      src={product.images_uri[currentImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-gray-400">No image available</p>
                    </div>
                  )}

                  {/* Image Counter */}
                  {product.images_uri && product.images_uri.length > 1 && (
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs">
                      {currentImageIndex + 1} / {product.images_uri.length}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6 px-6 md:pl-4 lg:px-6">
            {/* Category */}
            {product.category && (
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#3e4026]/70 font-medium">
                {product.category}
              </p>
            )}

            {/* Product Title */}
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl text-[#3e4026] leading-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {product.name}
            </h1>

            {/* Price and Quantity Section */}
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1">
                <div className="text-3xl md:text-4xl font-light text-[#3e4026]">
                  ₹ {currentPrice?.toLocaleString()}
                </div>
              </div>
              
              {/* Quantity on the right */}
              <div className="flex flex-col items-end">
                <div className="inline-flex items-center border border-gray-300 bg-white">
                  <button
                    onClick={() => handleQuantityChange("decrement")}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} className="text-[#3e4026]" />
                  </button>
                  <span className="w-16 text-center text-[#3e4026] font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("increment")}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={16} className="text-[#3e4026]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Size Selection for Flowers */}
            {isFlower && product.pricing && (
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#3e4026]/60 mb-3 font-medium">Size</p>
                <div className="grid grid-cols-3 gap-3 w-full">
                  {sizes.map((size) => {
                    const price = product.pricing[size.toLowerCase()]
                    if (!price) return null
                    
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 px-4 text-sm font-medium transition-all border ${
                          selectedSize === size
                            ? 'bg-[#3e4026] text-white border-[#3e4026]'
                            : 'bg-white text-[#3e4026] border-gray-300 hover:border-[#3e4026]'
                        }`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Color Selection for Balloons/Candles */}
            {!isFlower && (
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#3e4026]/60 mb-3 font-medium">Select Color</p>
                <div className="flex gap-3 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all relative ${
                        selectedColor?.id === color.id
                          ? 'border-[#3e4026] scale-110'
                          : 'border-gray-300 hover:border-[#3e4026]'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor?.id === color.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white drop-shadow-lg" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xs tracking-[0.2em] uppercase text-[#3e4026]/60 mb-3 font-medium">
                  Description
                </h3>
                <p className="text-sm text-[#3e4026]/70 leading-relaxed break-words overflow-wrap-anywhere max-w-full">
                  {product.description}
                </p>
              </div>
            )}

            {/* Add to Combo Button */}
            <div className="space-y-4 pt-4">
              <button
                onClick={handleAddToCombo}
                className="w-full bg-[#3e4026] text-white py-4 text-sm font-medium tracking-wider uppercase hover:bg-[#2d2f1c] transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Combo
              </button>

              {/* Combo Info */}
              <div className="bg-[#f9f8f6] border border-[#3e4026]/10 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#3e4026] font-medium mb-1">
                      🎉 Get 20% OFF on your complete combo!
                    </p>
                    <p className="text-xs text-[#3e4026]/60">
                      Add more items to maximize your savings
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Combo Items Count */}
              {comboItems.length > 0 && (
                <div className="text-center">
                  <p className="text-xs text-[#3e4026]/60">
                    {comboItems.length} {comboItems.length === 1 ? 'item' : 'items'} in your combo
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer isComboSidebarOpen={true} />

      {/* Combo Sidebar - Desktop */}
      <div className="hidden md:block">
        <ComboSidebar />
      </div>

      {/* Mobile: Floating Combo Button */}
      {!showComboSidebar && (
        <button
          onClick={() => setShowComboSidebar(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-[#3e4026] to-[#5a5c3d] text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all z-40 md:hidden"
        >
          <div className="relative">
            <Package className="w-6 h-6" />
            {comboItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {comboItems.length}
              </span>
            )}
          </div>
        </button>
      )}

      {/* Mobile: Combo Sidebar Overlay */}
      {showComboSidebar && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setShowComboSidebar(false)}
          />
          
          {/* Sidebar */}
          <div className="md:hidden fixed right-0 top-0 h-full w-full sm:w-[380px] z-50">
            <div className="relative h-full">
              {/* Close Button */}
              <button
                onClick={() => setShowComboSidebar(false)}
                className="absolute top-4 left-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-[#3e4026]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <ComboSidebar />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

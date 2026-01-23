import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ChevronRight, ShoppingBag, Check, Minus, Plus, Package } from "lucide-react"
import Header from "../components/common/Header"
import Footer from "../components/common/Footer"
import ComboSidebar from "../components/combo/ComboSidebar"
import { useCombo } from "../context/ComboContext"
import { productsAPI } from "../api"

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
  const [showComboSidebar, setShowComboSidebar] = useState(false)

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
      const { response, data } = await productsAPI.getDetails(id)
      
      if (data.success && data.data) {
        setProduct(data.data)
        
        // Set default selections - check both category AND product name
        const productName = data.data.name?.toLowerCase() || ''
        const productCategory = data.data.category?.toLowerCase() || ''
        
        const isFlower = productCategory.includes('flower') || productName.includes('flower')
        const isBalloon = productCategory.includes('balloon') || productName.includes('balloon')
        const isCandle = productCategory.includes('candle') || productName.includes('candle')
        
        if (isFlower && data.data.pricing) {
          const mediumSize = 'Medium'
          const mediumPrice = data.data.pricing?.medium || data.data.pricing?.small || data.data.price || 0
          setSelectedSize(mediumSize)
          setCurrentPrice(mediumPrice)
        } else if (isBalloon) {
          // For balloons, default to first color
          setSelectedColor(colors[0])
          const productPrice = data.data.price || data.data.pricing?.medium || data.data.pricing?.small || 0
          setCurrentPrice(productPrice)
        } else if (isCandle) {
          // For candles, use direct price (no size/color selection)
          const productPrice = data.data.price || 0
          setCurrentPrice(productPrice)
        } else {
          // For other categories
          const productPrice = data.data.price || data.data.pricing?.medium || data.data.pricing?.small || 0
          setCurrentPrice(productPrice)
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  // Update price when size changes (only for flowers with size selection)
  useEffect(() => {
    if (!product) return
    const isFlower = product.category?.toLowerCase().includes('flower')
    
    // Only update price based on size for flowers
    if (isFlower && product.pricing && selectedSize) {
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
    // Check both category and product name for type detection
    const pName = product.name?.toLowerCase() || ''
    const pCategory = product.category?.toLowerCase() || ''
    
    const isFlowerItem = pCategory.includes('flower') || pName.includes('flower')
    const isBalloonItem = pCategory.includes('balloon') || pName.includes('balloon')
    
    addToCombo({
      product_id: product.product_id,
      name: product.name,
      images_uri: product.images_uri?.[0] || '',
      price: currentPrice,
      quantity: quantity,
      selectedSize: isFlowerItem ? selectedSize : undefined,
      selectedColor: isBalloonItem && selectedColor ? selectedColor : undefined,
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

  // Check both category AND product name for type detection
  const productName = product.name?.toLowerCase() || ''
  const productCategory = product.category?.toLowerCase() || ''
  
  const isFlower = productCategory.includes('flower') || productName.includes('flower')
  const isBalloon = productCategory.includes('balloon') || productName.includes('balloon')
  const isCandle = productCategory.includes('candle') || productName.includes('candle')
  const sizes = ['Small', 'Medium', 'Large']

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="transition-all duration-300 pt-24 pb-12 max-w-7xl mx-auto px-6 md:px-12 md:pr-[340px]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] tracking-[0.12em] text-[#9a9a9a] mb-8 md:mb-12">
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
            {/* Desktop: Side-by-side layout */}
            <div className="hidden lg:flex gap-4">
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

            {/* Mobile: Stacked layout with main image on top, thumbnails below */}
            <div className="lg:hidden space-y-3">
              {/* Main Image */}
              <div className="relative aspect-[3/4] bg-[#f9f8f6] overflow-hidden rounded-lg">
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
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-md text-xs font-medium">
                    {currentImageIndex + 1} / {product.images_uri.length}
                  </div>
                )}
              </div>

              {/* Thumbnails - Horizontal Scroll */}
              {product.images_uri && product.images_uri.length > 1 && (
                <div className="overflow-x-auto scrollbar-hide pb-2">
                  <div className="flex gap-2">
                    {product.images_uri.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 border-2 transition-all overflow-hidden bg-[#f9f8f6] rounded-lg ${
                          currentImageIndex === index
                            ? 'border-[#3e4026] ring-2 ring-[#3e4026]/30'
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
                </div>
              )}
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
                {/* Price Display with Discount */}
                {product.discount_percentage > 0 && currentPrice > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <div className="text-xl md:text-2xl text-gray-400 line-through">
                        ₹ {Math.round(currentPrice / (1 - product.discount_percentage / 100)).toLocaleString()}
                      </div>
                      <div className="text-3xl md:text-4xl font-semibold text-[#3e4026]">
                        ₹ {currentPrice?.toLocaleString()}
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-semibold text-green-700">
                        {product.discount_percentage}% OFF
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-3xl md:text-4xl font-light text-[#3e4026]">
                    ₹ {currentPrice?.toLocaleString()}
                  </div>
                )}
              </div>
              
              {/* Quantity Selector */}
              <div className="inline-flex items-center border border-gray-300 bg-white">
                <button
                  onClick={() => handleQuantityChange("decrement")}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} className="text-gray-600" />
                </button>
                <span className="w-12 text-center text-[#3e4026] font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("increment")}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Plus size={16} className="text-gray-600" />
                </button>
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

            {/* Color Selection for Balloons only */}
            {isBalloon && (
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-3 font-medium">Select Color</p>
                <div className="flex gap-3 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`w-11 h-11 rounded-full border-2 transition-all relative ${
                        selectedColor?.id === color.id
                          ? 'border-[#3e4026] scale-105 shadow-md'
                          : 'border-gray-300 hover:border-gray-400'
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
              <div className="pt-6">
                <h3 className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-3 font-medium">
                  Description
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed break-words overflow-wrap-anywhere max-w-full">
                  {product.description}
                </p>
              </div>
            )}

            {/* Add to Combo Button */}
            <div className="space-y-3 pt-6">
              <button
                onClick={handleAddToCombo}
                className="w-full bg-[#4a4d2e] text-white py-4 text-sm font-semibold tracking-wide uppercase hover:bg-[#3e4026] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Package className="w-4 h-4" />
                Add to Combo
              </button>

              {/* Combo Info */}
              <div className="bg-[#f0fdf4] border border-green-200 p-3 rounded-sm">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 font-medium">
                      🎉 Get 20% OFF on your complete combo!
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Add more items to maximize your savings
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Combo Items Count */}
              {comboItems.length > 0 && (
                <div className="text-center">
                  <p className="text-xs text-gray-500">
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

      {/* Mobile: Floating Combo Button - Premium Design */}
      {!showComboSidebar && (
        <div className="fixed bottom-6 left-4 right-4 md:hidden z-40">
          <button
            onClick={() => setShowComboSidebar(true)}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl shadow-2xl transition-all active:scale-[0.98] ${
              comboItems.length > 0
                ? 'bg-gradient-to-r from-[#3e4026] via-[#4a4c2d] to-[#3e4026] text-white'
                : 'bg-white border-2 border-dashed border-[#3e4026]/30 text-[#3e4026]'
            }`}
            style={{
              boxShadow: comboItems.length > 0 
                ? '0 10px 40px -10px rgba(62, 64, 38, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.1)' 
                : '0 4px 20px -5px rgba(0, 0, 0, 0.15)'
            }}
          >
            <div className="flex items-center gap-3">
              <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center ${
                comboItems.length > 0 ? 'bg-white/20' : 'bg-[#3e4026]/10'
              }`}>
                <ShoppingBag className="w-6 h-6" />
                {comboItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center shadow-lg">
                    {comboItems.length}
                  </span>
                )}
              </div>
              <div className="text-left">
                <p className={`font-semibold text-base ${
                  comboItems.length > 0 ? 'text-white' : 'text-[#3e4026]'
                }`}>
                  {comboItems.length > 0 ? 'Your Combo Cart' : 'Start Your Combo'}
                </p>
                <p className={`text-xs ${
                  comboItems.length > 0 ? 'text-white/70' : 'text-[#3e4026]/60'
                }`}>
                  {comboItems.length > 0 
                    ? `${comboItems.length} item${comboItems.length !== 1 ? 's' : ''} • Save 20%` 
                    : 'Add items to get 20% off'
                  }
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm ${
              comboItems.length > 0 
                ? 'bg-white text-[#3e4026]' 
                : 'bg-[#3e4026] text-white'
            }`}>
              <span>{comboItems.length > 0 ? 'View' : 'Browse'}</span>
              <Package className="w-4 h-4" />
            </div>
          </button>
        </div>
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
            <ComboSidebar 
              isOpen={showComboSidebar} 
              onClose={() => setShowComboSidebar(false)} 
            />
          </div>
        </>
      )}
    </div>
  )
}

import { X, Plus, Minus, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { useCombo } from "../../context/ComboContext"

export default function ComboProductDetail({ product, onClose }) {
  const { addToCombo, pincodeVerified, verifyPincode } = useCombo()
  
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [showPincodeModal, setShowPincodeModal] = useState(false)
  const [pincodeInput, setPincodeInput] = useState("")
  const [pincodeChecking, setPincodeChecking] = useState(false)
  const [pincodeMessage, setPincodeMessage] = useState(null)

  // Available sizes for flowers
  const flowerSizes = [
    { id: 'small', name: 'Small', key: 'small' },
    { id: 'medium', name: 'Medium', key: 'medium' },
    { id: 'large', name: 'Large', key: 'large' },
  ]

  // Color options for balloons and other products
  const colors = [
    { id: 'red', name: 'Red', hex: '#EF4444' },
    { id: 'pink', name: 'Pink', hex: '#EC4899' },
    { id: 'blue', name: 'Blue', hex: '#3B82F6' },
    { id: 'purple', name: 'Purple', hex: '#A855F7' },
    { id: 'yellow', name: 'Yellow', hex: '#EAB308' },
    { id: 'gold', name: 'Gold', hex: '#F59E0B' },
    { id: 'silver', name: 'Silver', hex: '#94A3B8' },
    { id: 'white', name: 'White', hex: '#FFFFFF' },
  ]

  // Initialize selections based on product category
  useEffect(() => {
    if (product) {
      // For flowers, default to medium size
      if (product.category?.toLowerCase().includes('flower') || 
          product.name?.toLowerCase().includes('rose') || 
          product.name?.toLowerCase().includes('bouquet')) {
        const mediumSize = 'medium'
        const mediumPrice = product.pricing?.medium || 0
        
        setSelectedSize(mediumSize)
        setCurrentPrice(mediumPrice)
      } else {
        // For other products (balloons, candles), default to first color
        const defaultColor = colors[0].id
        const defaultPrice = product.pricing?.default || product.price || 0
        
        setSelectedColor(defaultColor)
        setCurrentPrice(defaultPrice)
      }
    }
  }, [product, colors])

  // Update price when size changes (for flowers)
  useEffect(() => {
    if (selectedSize && product?.pricing) {
      const sizeKey = selectedSize.toLowerCase()
      const newPrice = product.pricing[sizeKey] || 0
      setCurrentPrice(newPrice)
    }
  }, [selectedSize, product])

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity(prev => prev + 1)
    } else if (type === "decrement" && quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const handlePincodeCheck = async () => {
    if (pincodeInput.length !== 6) {
      setPincodeMessage({ type: "error", text: "Please enter a valid 6-digit pincode" })
      return
    }

    setPincodeChecking(true)
    setPincodeMessage(null)

    const result = await verifyPincode(pincodeInput)
    
    setPincodeChecking(false)
    setPincodeMessage({ 
      type: result.success ? "success" : "error", 
      text: result.message 
    })

    if (result.success) {
      setTimeout(() => {
        setShowPincodeModal(false)
        handleAddToCombo()
      }, 1000)
    }
  }

  const handleAddToCombo = () => {
    if (!pincodeVerified) {
      setShowPincodeModal(true)
      return
    }

    // Validate selections
    const isFlower = product.category?.toLowerCase().includes('flower') || 
                     product.name?.toLowerCase().includes('rose') || 
                     product.name?.toLowerCase().includes('bouquet')

    if (isFlower && !selectedSize) {
      alert("Please select a size")
      return
    }

    if (!isFlower && !selectedColor) {
      alert("Please select a color")
      return
    }

    // Create combo item
    const comboItem = {
      product_id: product._id || product.product_id,
      name: product.name,
      image: product.image?.[0] || product.image,
      category: product.category,
      selectedSize: isFlower ? selectedSize : null,
      selectedColor: !isFlower ? selectedColor : null,
      price: currentPrice,
      quantity: quantity,
    }

    addToCombo(comboItem)
    
    // Reset and close
    setQuantity(1)
    onClose()
  }

  if (!product) return null

  const isFlower = product.category?.toLowerCase().includes('flower') || 
                   product.name?.toLowerCase().includes('rose') || 
                   product.name?.toLowerCase().includes('bouquet')

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8 animate-fadeIn">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-[#3e4026] to-[#5a5c3d] text-white p-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>
              {product.name}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Product Image */}
            <div className="aspect-[4/3] bg-[#f9f8f6] rounded-xl overflow-hidden">
              {product.image?.[0] || product.image ? (
                <img
                  src={product.image?.[0] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#3e4026]/30">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🌸</div>
                    <p className="text-sm">No image available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Product Category Badge */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#3e4026]/10 text-[#3e4026] rounded-full text-sm font-medium">
                {product.category || 'Product'}
              </span>
              {product.stock && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  In Stock
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold text-[#3e4026] mb-2">Description</h3>
                <p className="text-[#3e4026]/70 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Size Selection (for flowers) */}
            {isFlower && product.pricing && (
              <div>
                <h3 className="font-semibold text-[#3e4026] mb-3">Select Size</h3>
                <div className="grid grid-cols-3 gap-3">
                  {flowerSizes.map((size) => {
                    const price = product.pricing[size.key]
                    if (!price) return null
                    
                    return (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${
                          selectedSize === size.id
                            ? 'border-[#3e4026] bg-[#3e4026] text-white'
                            : 'border-[#3e4026]/20 hover:border-[#3e4026]/40'
                        }`}
                      >
                        <div className="font-semibold mb-1">{size.name}</div>
                        <div className={`text-sm ${selectedSize === size.id ? 'text-white/80' : 'text-[#3e4026]/60'}`}>
                          ₹{price}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Color Selection (for balloons and other products) */}
            {!isFlower && (
              <div>
                <h3 className="font-semibold text-[#3e4026] mb-3">Select Color</h3>
                <div className="grid grid-cols-4 gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        selectedColor === color.id
                          ? 'border-[#3e4026] ring-2 ring-[#3e4026]/30'
                          : 'border-[#3e4026]/20 hover:border-[#3e4026]/40'
                      }`}
                    >
                      <div
                        className="w-full h-10 rounded-lg mb-2 border border-[#3e4026]/10"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="text-xs text-center font-medium text-[#3e4026]">
                        {color.name}
                      </div>
                      {selectedColor === color.id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#3e4026] rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div>
              <h3 className="font-semibold text-[#3e4026] mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-[#f9f8f6] rounded-xl p-2">
                  <button
                    onClick={() => handleQuantityChange("decrement")}
                    className="w-10 h-10 flex items-center justify-center bg-white hover:bg-[#3e4026] hover:text-white rounded-lg transition-all"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg text-[#3e4026]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("increment")}
                    className="w-10 h-10 flex items-center justify-center bg-white hover:bg-[#3e4026] hover:text-white rounded-lg transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 text-right">
                  <div className="text-sm text-[#3e4026]/60">Total Price</div>
                  <div className="text-3xl font-bold text-[#3e4026]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    ₹{(currentPrice * quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Combo Button */}
            <button
              onClick={handleAddToCombo}
              className="w-full bg-gradient-to-r from-[#3e4026] to-[#5a5c3d] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all"
            >
              Add to Your Combo
            </button>

            {/* Info Text */}
            <p className="text-center text-sm text-[#3e4026]/60">
              Build your perfect combo and get 20% off on final bill!
            </p>
          </div>
        </div>
      </div>

      {/* Pincode Verification Modal */}
      {showPincodeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slideUp">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#3e4026]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📍</span>
              </div>
              <h3 className="text-2xl font-semibold text-[#3e4026] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Verify Your Pincode
              </h3>
              <p className="text-[#3e4026]/60">
                Please enter your delivery pincode to continue
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={pincodeInput}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "")
                    if (value.length <= 6) setPincodeInput(value)
                  }}
                  placeholder="Enter 6-digit pincode"
                  className="w-full px-4 py-3 border-2 border-[#3e4026]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3e4026]/30 transition-all text-center text-lg font-semibold"
                  maxLength={6}
                  autoFocus
                />
              </div>

              {pincodeMessage && (
                <div className={`text-sm p-4 rounded-xl ${
                  pincodeMessage.type === "success" 
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {pincodeMessage.text}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPincodeModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-[#3e4026]/20 rounded-xl font-semibold hover:bg-[#f9f8f6] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePincodeCheck}
                  disabled={pincodeChecking || pincodeInput.length !== 6}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#3e4026] to-[#5a5c3d] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed"
                >
                  {pincodeChecking ? "Checking..." : "Verify"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

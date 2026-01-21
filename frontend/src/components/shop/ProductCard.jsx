import { motion } from "framer-motion"
import { Heart } from "lucide-react"

export default function ProductCard({ 
  product, 
  index = 0,
  isInView = true,
  hoveredId,
  onHover,
  onLeave,
  onClick,
  onAddToCart,
  isComboMode = false
}) {
  const isHovered = hoveredId === product._id

  const handleClick = (e) => {
    // Ensure click works on both desktop and mobile
    e.preventDefault()
    onClick?.(product.product_id, product)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => onHover?.(product._id)}
      onMouseLeave={() => onLeave?.()}
      onClick={handleClick}
      onTouchEnd={(e) => {
        // Handle touch events for mobile
        if (e.cancelable) {
          e.preventDefault()
        }
        handleClick(e)
      }}
      className="group cursor-pointer touch-manipulation"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden mb-3 sm:mb-4 aspect-[3/4] bg-[#f9f8f6] rounded-sm">
        {product.images_uri?.[0] ? (
          <motion.img
            src={product.images_uri[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center"
            animate={{
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.6 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-300">No Image</div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Quick Add Button */}
        {!isComboMode && onAddToCart && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10,
            }}
            transition={{ duration: 0.3 }}
            onClick={(e) => {
              e.stopPropagation()
              onAddToCart?.(e, product)
            }}
            className="absolute bottom-4 left-4 right-4 bg-white py-3 text-sm font-medium text-[#3e4026] hover:bg-[#3e4026] hover:text-white transition-colors duration-300"
          >
            Add to Cart
          </motion.button>
        )}
        
        {/* Combo Mode - Customize Button */}
        {isComboMode && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10,
            }}
            transition={{ duration: 0.3 }}
            onClick={(e) => {
              e.stopPropagation()
              onClick?.(product.product_id, product)
            }}
            className="absolute bottom-4 left-4 right-4 bg-[#3e4026] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#2d2f1c] transition-colors duration-300"
          >
            Customize & Add to Combo
          </motion.button>
        )}

        {/* Wishlist Icon */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Heart size={16} className="sm:w-[18px] sm:h-[18px] text-[#3e4026]" />
        </div>

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
            <span className="text-[9px] sm:text-[10px] tracking-widest uppercase bg-white px-2 sm:px-3 py-1 sm:py-1.5 text-[#3e4026]">
              {product.category}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        <h3 
          className="text-sm sm:text-base md:text-lg text-[#3e4026] mb-1 group-hover:underline line-clamp-2"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {product.name}
        </h3>
        
        {/* Price Display with Discount */}
        <div className="flex items-center gap-2 flex-wrap">
          {product.discount_percentage > 0 ? (
            <>
              <p className="text-xs sm:text-sm text-gray-400 line-through">
                ₹{(
                  (product.pricing?.medium || product.pricing?.small || product.pricing?.large || product.price || 0) * 
                  (1 + product.discount_percentage / 100)
                ).toFixed(0)}
              </p>
              <p className="text-base sm:text-lg font-semibold text-[#3e4026]">
                ₹{(product.pricing?.medium || product.pricing?.small || product.pricing?.large || product.price || 0).toLocaleString()}
              </p>
              <span className="text-[9px] sm:text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                {product.discount_percentage}% OFF
              </span>
            </>
          ) : (
            <p className="text-base sm:text-lg font-light text-[#3e4026]">
              ₹{(product.pricing?.medium || product.pricing?.small || product.pricing?.large || product.price || 0).toLocaleString()}
            </p>
          )}
        </div>
        
        {/* Stock Status */}
        {product.stock && product.stock > 0 ? (
          <p className="text-[10px] sm:text-xs text-green-600 mt-1.5 sm:mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-600"></span>
            In Stock
          </p>
        ) : (
          <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2">Out of Stock</p>
        )}
      </div>
    </motion.div>
  )
}

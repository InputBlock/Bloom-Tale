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
  onAddToCart 
}) {
  const isHovered = hoveredId === product._id

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => onHover?.(product._id)}
      onMouseLeave={() => onLeave?.()}
      onClick={() => onClick?.(product.product_id)}
      className="group cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden mb-4 aspect-[3/4] bg-[#f9f8f6]">
        {product.images_uri?.[0] ? (
          <motion.img
            src={product.images_uri[0]}
            alt={product.name}
            className="w-full h-full object-cover"
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

        {/* Wishlist Icon */}
        <div className="absolute top-4 right-4 w-10 h-10 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Heart size={18} className="text-[#3e4026]" />
        </div>

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-4 left-4">
            <span className="text-[10px] tracking-widest uppercase bg-white px-3 py-1.5 text-[#3e4026]">
              {product.category}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        <h3 
          className="text-lg text-[#3e4026] mb-1 group-hover:underline"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {product.name}
        </h3>
        <p className="text-lg font-light text-[#3e4026]">
          ₹{(product.pricing?.small || product.pricing?.medium || product.pricing?.large || product.price || 0).toLocaleString()}
        </p>
        
        {/* Stock Status */}
        {product.stock && product.stock > 0 ? (
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-600"></span>
            In Stock
          </p>
        ) : (
          <p className="text-xs text-gray-400 mt-2">Out of Stock</p>
        )}
      </div>
    </motion.div>
  )
}

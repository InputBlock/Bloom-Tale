import { useState, useEffect } from "react"
import { ArrowUpRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

export default function ProductDetails({ product, relatedProducts = [] }) {
  const [fetchedRelated, setFetchedRelated] = useState([])
  const [hoveredId, setHoveredId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (relatedProducts.length === 0 && product?.category) {
        try {
          const response = await fetch('/api/v1/getProduct/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          })
          const data = await response.json()
          if (data.success && data.data) {
            const related = data.data
              .filter(p => p.product_id !== product.product_id)
              .slice(0, 4)
            setFetchedRelated(related)
          }
        } catch (error) {
          console.error('Error fetching related products:', error)
        }
      }
    }
    fetchRelatedProducts()
  }, [product, relatedProducts])

  const displayRelated = relatedProducts.length > 0 ? relatedProducts : fetchedRelated

  if (!product) return null

  return (
    <div className="mt-20 md:mt-32">
      {/* Related Products */}
      {displayRelated.length > 0 && (
        <section>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#3e4026]/60 mb-4">
                You May Also Like
              </p>
              <h2 
                className="text-3xl md:text-4xl text-[#3e4026]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Related <span className="italic">Products</span>
              </h2>
            </div>
            <button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center gap-2 text-[#3e4026] font-medium border-b border-[#3e4026] pb-1 hover:gap-3 transition-all duration-300 mt-6 md:mt-0"
            >
              View All
              <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {displayRelated.map((item) => (
              <div 
                key={item.product_id}
                onMouseEnter={() => setHoveredId(item.product_id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => navigate(`/product/${item.product_id}`)}
                className="group cursor-pointer"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden mb-4 aspect-[3/4] bg-[#f9f8f6]">
                  {item.images_uri && item.images_uri.length > 0 ? (
                    <motion.img
                      src={item.images_uri[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      animate={{
                        scale: hoveredId === item.product_id ? 1.05 : 1,
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
                  
                  {/* Arrow Icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight size={18} className="text-[#3e4026]" />
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] tracking-widest uppercase bg-white rounded-sm px-3 py-1.5 text-[#3e4026]">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div>
                  <h3 
                    className="text-lg text-[#3e4026] mb-1 group-hover:underline"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {item.name}
                  </h3>
                  <p className="text-lg font-light text-[#3e4026]">₹{item.pricing?.medium?.toLocaleString() || 0}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

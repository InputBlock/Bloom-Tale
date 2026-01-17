import ProductCard from "./ProductCard"

export default function ProductGrid({ 
  products, 
  loading,
  isInView,
  hoveredId,
  onHover,
  onLeave,
  onProductClick,
  onAddToCart,
  onViewAll
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-[#f9f8f6] mb-4"></div>
            <div className="h-5 bg-[#eceae7] w-3/4 mb-2"></div>
            <div className="h-5 bg-[#eceae7] w-1/3 mb-2"></div>
            <div className="h-3 bg-[#eceae7] w-1/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[#3e4026]/40 mb-4 text-sm">No products found</p>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-[#3e4026] text-sm underline underline-offset-4 hover:no-underline"
          >
            View all flowers
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <ProductCard
          key={product._id}
          product={product}
          index={index}
          isInView={isInView}
          hoveredId={hoveredId}
          onHover={onHover}
          onLeave={onLeave}
          onClick={onProductClick}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}

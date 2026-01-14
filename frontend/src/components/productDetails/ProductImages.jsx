export default function ProductImages({ product }) {
  const imageUrl = product?.images_uri && product.images_uri.length > 0 
    ? product.images_uri[0] 
    : null

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product?.name || "Product"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EDE8E0] to-[#5e6043]/10">
            <span className="text-9xl">🌸</span>
          </div>
        )}
      </div>
    </div>
  )
}

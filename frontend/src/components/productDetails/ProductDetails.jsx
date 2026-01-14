export default function ProductDetails({ product }) {
  if (!product) return null

  return (
    <div className="mt-8 space-y-6">
      {/* Product Information */}
      <div>
        <h2 className="text-2xl font-serif text-gray-900 mb-4 border-b pb-2">
          Product Information:
        </h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div>
            <p className="font-semibold">Category:</p>
            <p>{product.category}</p>
          </div>
          {product.subcategory && (
            <div>
              <p className="font-semibold">Subcategory:</p>
              <p>{product.subcategory}</p>
            </div>
          )}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <p className="font-semibold">Available Sizes:</p>
              <p>{product.sizes.join(', ')}</p>
            </div>
          )}
          <div>
            <p className="font-semibold">Product ID:</p>
            <p>{product.product_id}</p>
          </div>
        </div>
      </div>

      {/* Care Instructions */}
      <div>
        <h2 className="text-2xl font-serif text-gray-900 mb-4 border-b pb-2">
          CARE INSTRUCTIONS:
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Keep flowers in fresh water and change water daily</li>
          <li>Trim stems at an angle every 2-3 days</li>
          <li>Keep away from direct sunlight and heat</li>
          <li>Remove any wilted leaves or petals</li>
          <li>Store in a cool place for maximum freshness</li>
        </ul>
      </div>
    </div>
  )
}

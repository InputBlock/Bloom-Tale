import { useState, useEffect } from "react"
import { X } from "lucide-react"

export default function EditProductModal({ product, isOpen, onClose, onSave }) {
  const [editProduct, setEditProduct] = useState(null)

  useEffect(() => {
    if (product) {
      setEditProduct({ ...product })
    }
  }, [product])

  if (!isOpen || !editProduct) return null

  const handleSave = () => {
    // If stock is 0, automatically unlist
    const updatedProduct = {
      ...editProduct,
      isListed: editProduct.stock > 0 ? editProduct.isListed : false
    }
    onSave(updatedProduct)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              value={editProduct.name}
              onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              value={editProduct.category}
              onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              type="text"
              value={editProduct.price}
              onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              value={editProduct.stock}
              onChange={(e) => setEditProduct({ ...editProduct, stock: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* Same Day Delivery Toggle */}
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Same Day Delivery</p>
              <p className="text-sm text-gray-500">Enable same day delivery for this product</p>
            </div>
            <button
              onClick={() => setEditProduct({ ...editProduct, sameDayDelivery: !editProduct.sameDayDelivery })}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                editProduct.sameDayDelivery ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  editProduct.sameDayDelivery ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* List Toggle */}
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">List this product</p>
              <p className="text-sm text-gray-500">
                {editProduct.stock === 0 
                  ? "Cannot list - Out of stock" 
                  : "Show this product to customers"}
              </p>
            </div>
            <button
              onClick={() => editProduct.stock > 0 && setEditProduct({ ...editProduct, isListed: !editProduct.isListed })}
              disabled={editProduct.stock === 0}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                editProduct.stock === 0 
                  ? "bg-gray-200 cursor-not-allowed" 
                  : editProduct.isListed 
                    ? "bg-green-500" 
                    : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  editProduct.isListed && editProduct.stock > 0 ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Status Badge */}
          {editProduct.stock === 0 && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-sm text-red-600 font-medium">This product is out of stock and will not be listed</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

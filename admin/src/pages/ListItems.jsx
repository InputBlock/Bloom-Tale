import { useState } from "react"
import { Search, Edit2, Trash2, Plus, X } from "lucide-react"

export default function ListItems() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState([
    { id: "10001", name: "Red Rose Bouquet", category: "Roses", price: "25", stock: 142, isListed: true },
    { id: "10002", name: "Sunflower Delight", category: "Sunflowers", price: "45", stock: 87, isListed: true },
    { id: "10003", name: "Tulip Garden", category: "Tulips", price: "65", stock: 0, isListed: false },
    { id: "10004", name: "Lily Elegance", category: "Lilies", price: "89", stock: 23, isListed: true },
    { id: "10005", name: "Mixed Bouquet", category: "Mixed", price: "120", stock: 45, isListed: true },
  ])
  const [editModal, setEditModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.includes(searchTerm)
  )

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  const handleUpdateStock = (id) => {
    const newStock = prompt("Enter new stock quantity:")
    if (newStock !== null && !isNaN(newStock)) {
      const stockValue = parseInt(newStock)
      setProducts(products.map((p) => 
        p.id === id ? { ...p, stock: stockValue, isListed: stockValue > 0 ? p.isListed : false } : p
      ))
    }
  }

  const handleEdit = (product) => {
    setEditProduct({ ...product })
    setEditModal(true)
  }

  const handleSaveEdit = () => {
    if (editProduct) {
      // If stock is 0, automatically unlist
      const updatedProduct = {
        ...editProduct,
        isListed: editProduct.stock > 0 ? editProduct.isListed : false
      }
      setProducts(products.map((p) => 
        p.id === updatedProduct.id ? updatedProduct : p
      ))
      setEditModal(false)
      setEditProduct(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all duration-200"
        />
      </div>

      {/* Products Table */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Product</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Category</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Price</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Stock</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-900 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-4 px-6">
                    <span className="text-gray-900 font-medium">{product.name}</span>
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm">{product.category}</td>
                  <td className="py-4 px-6 text-gray-900 font-semibold">${product.price}</td>
                  <td className="py-4 px-6">
                    {product.stock > 0 ? (
                      <button
                        onClick={() => handleUpdateStock(product.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors duration-200"
                      >
                        {product.stock} items
                        <Plus size={12} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStock(product.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-600 border border-red-200 hover:bg-red-200 transition-colors duration-200"
                      >
                        Out of Stock
                        <Plus size={12} />
                      </button>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="p-12 text-center bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-500 font-medium">No products found matching "{searchTerm}"</p>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && editProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
              <button
                onClick={() => { setEditModal(false); setEditProduct(null); }}
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
                onClick={() => { setEditModal(false); setEditProduct(null); }}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

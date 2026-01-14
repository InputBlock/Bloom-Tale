import { useState } from "react"
import { Search, Edit2, Trash2, Plus } from "lucide-react"
import EditProductModal from "../components/ListItems/EditProductModal"

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

  const toggleListing = (id) => {
    setProducts(products.map((p) => {
      if (p.id === id) {
        if (p.stock === 0) {
          alert("Cannot activate product with 0 stock. Please add stock first.")
          return p
        }
        return { ...p, isListed: !p.isListed }
      }
      return p
    }))
  }

  const handleEdit = (product) => {
    setEditProduct({ ...product })
    setEditModal(true)
  }

  const handleSaveEdit = (updatedProduct) => {
    setProducts(products.map((p) => 
      p.id === updatedProduct.id ? updatedProduct : p
    ))
    setEditModal(false)
    setEditProduct(null)
  }

  const handleCloseModal = () => {
    setEditModal(false)
    setEditProduct(null)
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStock(product.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors duration-200"
                      >
                        {product.stock} items
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => toggleListing(product.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors duration-200 ${
                          product.isListed
                            ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                            : "bg-red-100 text-red-600 border-red-200 hover:bg-red-200"
                        }`}
                      >
                        {product.isListed ? "Active" : "Inactive"}
                      </button>
                    </div>
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
      <EditProductModal
        product={editProduct}
        isOpen={editModal}
        onClose={handleCloseModal}
        onSave={handleSaveEdit}
      />
    </div>
  )
}

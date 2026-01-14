import { useState, useEffect } from "react"
import { Search, Edit2, Trash2, Plus } from "lucide-react"
import EditProductModal from "../components/ListItems/EditProductModal"
import axios from "axios"

const API_URL = "http://localhost:8000/api/v1/admin"

export default function ListItems() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editModal, setEditModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data } = await axios.post(`${API_URL}/showlist`)
      setProducts(data.flowers.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        stock: item.stock,
        isListed: item.isActive
      })))
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.includes(searchTerm)
  )

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return
    try {
      await axios.post(`${API_URL}/delete`, { id })
      setProducts(products.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Error deleting:", error)
    }
  }

  const toggleListing = async (product) => {
    if (!product.isListed && product.stock === 0) {
      alert("Cannot activate product with 0 stock")
      return
    }
    try {
      const endpoint = product.isListed ? "/unlist" : "/list"
      await axios.post(`${API_URL}${endpoint}`, { id: product.id })
      setProducts(products.map((p) =>
        p.id === product.id ? { ...p, isListed: !p.isListed } : p
      ))
    } catch (error) {
      console.error("Error toggling:", error)
    }
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

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3 text-gray-600">Loading products...</span>
        </div>
      ) : (
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Product</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Category</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Price</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Stock</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Status</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                    <td className="py-4 px-6">
                      <span className="text-gray-900 font-medium">{product.name}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm">{product.category}</td>
                    <td className="py-4 px-6 text-gray-900 font-semibold">${product.price}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {product.stock} items
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => toggleListing(product)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors duration-200 ${
                          product.isListed
                            ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                            : "bg-red-100 text-red-600 border-red-200 hover:bg-red-200"
                        }`}
                      >
                        {product.isListed ? "Active" : "Inactive"}
                      </button>
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
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
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
      )}

      {/* No Results */}
      {!loading && filteredProducts.length === 0 && (
        <div className="p-12 text-center bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-500 font-medium">No products found matching "{searchTerm}"</p>
        </div>
      )}

      {/* Edit Modal */}
      <EditProductModal
        product={editProduct}
        isOpen={editModal}
        onClose={() => { setEditModal(false); setEditProduct(null) }}
        onSave={handleSaveEdit}
      />
    </div>
  )
}

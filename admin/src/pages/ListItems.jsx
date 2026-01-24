import { useState, useEffect } from "react"
import { Search, Edit2, Trash2 } from "lucide-react"
import EditProductModal from "../components/ListItems/EditProductModal"
import { productsAPI } from "../api"

export default function ListItems() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editModal, setEditModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)

  // Fetch products from backend
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productsAPI.getAll()

      // Backend returns ApiResponse with data wrapped in response.data.data
      const productsData = response.data?.data?.flowers || response.data?.flowers || []
      
      // Transform backend data to match frontend format
      const transformedProducts = productsData.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        pricing: product.pricing || { small: 0, medium: 0, large: 0 },
        price: product.price,
        pricing_type: product.pricing_type || 'sized',
        stock: product.stock,
        isListed: product.isActive,
        isBestSeller: product.isBestSeller || false,
        isCombo: product.isCombo || false,
        sameDayDelivery: product.sameDayDelivery || false
      }))

      setProducts(transformedProducts)
    } catch (error) {
      console.error("Error fetching products:", error)
      alert("Failed to fetch products. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.includes(searchTerm)
  )

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await productsAPI.delete(id)
        setProducts(products.filter((p) => p.id !== id))
      } catch (error) {
        console.error("Error deleting product:", error)
        alert("Failed to delete product. Please try again.")
      }
    }
  }
  const handleUpdateStock = async (id) => {
    const newStock = prompt("Enter new stock quantity:")
    if (newStock !== null && !isNaN(newStock)) {
      const stockValue = parseInt(newStock)
      try {
        await productsAPI.update({ id, stock: stockValue })
        setProducts(products.map((p) => 
          p.id === id ? { ...p, stock: stockValue, isListed: stockValue > 0 ? p.isListed : false } : p
        ))
      } catch (error) {
        console.error("Error updating stock:", error)
      }
    }
  }
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      if (currentStatus) {
        await productsAPI.unlist(id)
      } else {
        await productsAPI.list(id)
      }

      setProducts(products.map((p) =>
        p.id === id ? { ...p, isListed: !currentStatus } : p
      ))
    } catch (error) {
      console.error("Error toggling status:", error)
    }
  }

  const handleEdit = (product) => {
    setEditProduct({ ...product })
    setEditModal(true)
  }

  const handleSaveEdit = async (updatedProduct) => {
    try {
      await productsAPI.update({
        id: updatedProduct.id,
        name: updatedProduct.name,
        category: updatedProduct.category,
        pricing: updatedProduct.pricing,
        price: updatedProduct.price,
        pricing_type: updatedProduct.pricing_type,
        same_day_delivery: updatedProduct.sameDayDelivery,
        bestSeller: updatedProduct.isBestSeller,
        combo: updatedProduct.isCombo
      })

      setProducts(products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      ))
      setEditModal(false)
      setEditProduct(null)
    } catch (error) {
      console.error("Error updating product:", error)
    }
    setEditModal(false)
    setEditProduct(null)
  }

  const handleCloseModal = () => {
    setEditModal(false)
    setEditProduct(null)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 sm:left-4 top-3 sm:top-3.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all duration-200 text-sm sm:text-base"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="p-8 sm:p-12 text-center bg-white border border-gray-200 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 sm:w-8 h-6 sm:h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium text-sm sm:text-base">Loading products...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {product.pricing_type === 'fixed' || product.price ? (
                  <div className="mb-3">
                    <div className="text-center bg-gray-50 rounded p-2">
                      <p className="text-[10px] text-gray-500 mb-0.5">Price</p>
                      <p className="text-sm font-semibold">₹{product.price || 0}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center bg-gray-50 rounded p-2">
                      <p className="text-[10px] text-gray-500 mb-0.5">Small</p>
                      <p className="text-sm font-semibold">₹{product.pricing?.small || 0}</p>
                    </div>
                    <div className="text-center bg-gray-50 rounded p-2">
                      <p className="text-[10px] text-gray-500 mb-0.5">Medium</p>
                      <p className="text-sm font-semibold">₹{product.pricing?.medium || 0}</p>
                    </div>
                    <div className="text-center bg-gray-50 rounded p-2">
                      <p className="text-[10px] text-gray-500 mb-0.5">Large</p>
                      <p className="text-sm font-semibold">₹{product.pricing?.large || 0}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${product.sameDayDelivery
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}>
                      {product.sameDayDelivery ? "Same Day" : "Standard"}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={product.isListed}
                      onChange={() => handleToggleStatus(product.id, product.isListed)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                    <span className="ml-2 text-xs text-gray-600">{product.isListed ? "Active" : "Inactive"}</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 lg:py-4 px-4 lg:px-6 font-semibold text-gray-900 text-xs lg:text-sm">Product</th>
                    <th className="text-left py-3 lg:py-4 px-4 lg:px-6 font-semibold text-gray-900 text-xs lg:text-sm">Category</th>
                    <th className="text-center py-3 lg:py-4 px-2 lg:px-4 font-semibold text-gray-900 text-xs lg:text-sm">S</th>
                    <th className="text-center py-3 lg:py-4 px-2 lg:px-4 font-semibold text-gray-900 text-xs lg:text-sm">M</th>
                    <th className="text-center py-3 lg:py-4 px-2 lg:px-4 font-semibold text-gray-900 text-xs lg:text-sm">L</th>
                    <th className="text-left py-3 lg:py-4 px-4 lg:px-6 font-semibold text-gray-900 text-xs lg:text-sm">Same Day</th>
                    <th className="text-left py-3 lg:py-4 px-4 lg:px-6 font-semibold text-gray-900 text-xs lg:text-sm">Status</th>
                    <th className="text-center py-3 lg:py-4 px-4 lg:px-6 font-semibold text-gray-900 text-xs lg:text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-3 lg:py-4 px-4 lg:px-6">
                        <span className="text-gray-900 font-medium text-sm lg:text-base">{product.name}</span>
                      </td>
                      <td className="py-3 lg:py-4 px-4 lg:px-6 text-gray-600 text-xs lg:text-sm">{product.category}</td>
                      {product.pricing_type === 'fixed' || product.price ? (
                        <td colSpan="3" className="py-3 lg:py-4 px-2 lg:px-4 text-center text-gray-900 font-semibold text-xs lg:text-sm">₹{product.price || 0}</td>
                      ) : (
                        <>
                          <td className="py-3 lg:py-4 px-2 lg:px-4 text-center text-gray-900 font-semibold text-xs lg:text-sm">₹{product.pricing?.small || 0}</td>
                          <td className="py-3 lg:py-4 px-2 lg:px-4 text-center text-gray-900 font-semibold text-xs lg:text-sm">₹{product.pricing?.medium || 0}</td>
                          <td className="py-3 lg:py-4 px-2 lg:px-4 text-center text-gray-900 font-semibold text-xs lg:text-sm">₹{product.pricing?.large || 0}</td>
                        </>
                      )}
                      <td className="py-3 lg:py-4 px-4 lg:px-6">
                        <span className={`px-2 lg:px-3 py-1 lg:py-1.5 rounded-full text-[10px] lg:text-xs font-medium ${product.sameDayDelivery
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                          }`}>
                          {product.sameDayDelivery ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-3 lg:py-4 px-4 lg:px-6">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={product.isListed}
                            onChange={() => handleToggleStatus(product.id, product.isListed)}
                            className="sr-only peer"
                          />
                          <div className="w-9 lg:w-11 h-5 lg:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 lg:after:h-5 after:w-4 lg:after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </td>
                      <td className="py-3 lg:py-4 px-4 lg:px-6">
                        <div className="flex items-center justify-center gap-2 lg:gap-3">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-1.5 lg:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="p-1.5 lg:p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 size={16} />
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
          {!loading && filteredProducts.length === 0 && (
            <div className="p-8 sm:p-12 text-center bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-gray-500 font-medium text-sm sm:text-base">
                {searchTerm ? `No products found matching "${searchTerm}"` : "No products available"}
              </p>
            </div>
          )}
        </>
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

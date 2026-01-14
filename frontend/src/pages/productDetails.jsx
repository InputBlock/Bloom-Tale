import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Header from "../components/common/Header"
import Footer from "../components/common/Footer"
import ProductImages from "../components/productDetails/ProductImages"
import ProductInfo from "../components/productDetails/ProductInfo"
import ProductDetails from "../components/productDetails/ProductDetails"

export default function ProductDetailsPage() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:8000/api/v1/getProductDetail/${productId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        const data = await response.json()
        
        if (data.success && data.data) {
          setProduct(data.data)
        } else {
          setError('Product not found')
        }
      } catch (error) {
        console.error('Error fetching product details:', error)
        setError('Failed to load product details')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProductDetails()
    }
  }, [productId])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3e4026]"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {error || 'Product not found'}
          </h2>
          <a href="/home" className="text-[#3e4026] hover:underline">
            Return to Home
          </a>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Product Images */}
          <ProductImages product={product} />

          {/* Right: Product Info */}
          <ProductInfo product={product} />
        </div>

        {/* Product Details & Description */}
        <ProductDetails product={product} />
      </div>

      <Footer />
    </div>
  )
}
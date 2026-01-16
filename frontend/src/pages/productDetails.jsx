import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
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
        setError(null)
        
        const response = await fetch(`/api/v1/getProductDetail/${productId}`, {
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

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [productId])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-4 bg-gray-100 rounded w-48 mb-8"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-100 rounded-lg animate-pulse"></div>
            
            <div className="space-y-6">
              <div className="h-8 bg-gray-100 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-100 rounded w-1/3 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse"></div>
              <div className="flex gap-3 pt-4">
                <div className="h-12 bg-gray-100 rounded w-24 animate-pulse"></div>
                <div className="h-12 bg-gray-100 rounded w-24 animate-pulse"></div>
                <div className="h-12 bg-gray-100 rounded w-24 animate-pulse"></div>
              </div>
              <div className="h-12 bg-gray-100 rounded-md w-full animate-pulse"></div>
              <div className="h-12 bg-gray-100 rounded-md w-full animate-pulse"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              {error || 'Product not found'}
            </h2>
            <p className="text-gray-500 mb-6">
              We couldn't find the product you're looking for.
            </p>
            <Link 
              to="/home" 
              className="inline-block bg-gray-900 text-white font-medium py-3 px-8 rounded-md hover:bg-gray-800 transition-colors"
            >
              Back to Shop
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/home" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          {product.category && (
            <>
              <Link 
                to={`/home?category=${product.category}`}
                className="hover:text-gray-900 transition-colors"
              >
                {product.category}
              </Link>
              <ChevronRight size={14} />
            </>
          )}
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductImages product={product} />
          </div>

          <div>
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Related Products */}
        <ProductDetails product={product} />
      </main>

      <Footer />
    </div>
  )
}
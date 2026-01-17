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
        <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="h-4 bg-gray-100 w-48 mb-12"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-[#f9f8f6] animate-pulse"></div>
            
            <div className="space-y-6">
              <div className="h-4 bg-gray-100 w-24"></div>
              <div className="h-10 bg-gray-100 w-3/4"></div>
              <div className="h-6 bg-gray-100 w-1/3"></div>
              <div className="h-4 bg-gray-100 w-full"></div>
              <div className="h-4 bg-gray-100 w-5/6"></div>
              <div className="flex gap-3 pt-4">
                <div className="h-12 bg-gray-100 w-24"></div>
                <div className="h-12 bg-gray-100 w-24"></div>
                <div className="h-12 bg-gray-100 w-24"></div>
              </div>
              <div className="h-14 bg-gray-100 w-full"></div>
              <div className="h-14 bg-gray-100 w-full"></div>
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
        <main className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="text-center">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#3e4026]/60 mb-4">
              Error
            </p>
            <h2 
              className="text-3xl md:text-4xl text-[#3e4026] mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {error || 'Product not found'}
            </h2>
            <p className="text-[#3e4026]/60 mb-8">
              We couldn't find the product you're looking for.
            </p>
            <Link 
              to="/home" 
              className="inline-block bg-[#3e4026] text-white py-4 px-8 hover:bg-[#2d2f1c] transition-colors"
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

      <main className="max-w-7xl mx-auto pl-0 pr-6 md:pl-0 md:pr-12 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#3e4026]/60 mb-8 md:mb-12 pl-6 md:pl-12">
          <Link to="/home" className="hover:text-[#3e4026] transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          {product.category && (
            <>
              <Link 
                to={`/shop?category=${product.category}`}
                className="hover:text-[#3e4026] transition-colors"
              >
                {product.category}
              </Link>
              <ChevronRight size={14} />
            </>
          )}
          <span className="text-[#3e4026]">{product.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
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
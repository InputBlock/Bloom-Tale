import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import Header from "../components/common/Header"
import Footer from "../components/common/Footer"
import ProductImages from "../components/productDetails/ProductImages"
import ProductInfo from "../components/productDetails/ProductInfo"
import ProductDetails from "../components/productDetails/ProductDetails"
import { productsAPI } from "../api"

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
        
        const { response, data } = await productsAPI.getDetails(productId)
        
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12">
          <div className="h-3 sm:h-4 bg-gray-100 w-32 sm:w-48 mb-8 sm:mb-12"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            <div className="aspect-[3/4] bg-[#f9f8f6] animate-pulse"></div>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="h-3 sm:h-4 bg-gray-100 w-20 sm:w-24"></div>
              <div className="h-8 sm:h-10 bg-gray-100 w-3/4"></div>
              <div className="h-5 sm:h-6 bg-gray-100 w-1/3"></div>
              <div className="h-3 sm:h-4 bg-gray-100 w-full"></div>
              <div className="h-3 sm:h-4 bg-gray-100 w-5/6"></div>
              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                <div className="h-10 sm:h-12 bg-gray-100 w-20 sm:w-24"></div>
                <div className="h-10 sm:h-12 bg-gray-100 w-20 sm:w-24"></div>
                <div className="h-10 sm:h-12 bg-gray-100 w-20 sm:w-24"></div>
              </div>
              <div className="h-12 sm:h-14 bg-gray-100 w-full"></div>
              <div className="h-12 sm:h-14 bg-gray-100 w-full"></div>
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20">
          <div className="text-center">
            <p className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#3e4026]/60 mb-3 sm:mb-4">
              Error
            </p>
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl text-[#3e4026] mb-3 sm:mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {error || 'Product not found'}
            </h2>
            <p className="text-sm sm:text-base text-[#3e4026]/60 mb-6 sm:mb-8">
              We couldn't find the product you're looking for.
            </p>
            <Link 
              to="/home" 
              className="inline-block bg-[#3e4026] text-white py-3 sm:py-4 px-6 sm:px-8 text-sm sm:text-base hover:bg-[#2d2f1c] active:scale-95 transition-all"
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

      <main className="max-w-7xl mx-auto pl-0 pr-0 md:pr-12 pt-24 pb-8 sm:pb-12">        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] sm:text-[11px] tracking-[0.12em] text-[#9a9a9a] mb-6 sm:mb-8 md:mb-12 px-4 sm:px-6 md:pl-12 md:pr-0">
          <Link to="/home" className="hover:text-[#3e4026] transition-colors">
            HOME
          </Link>
          <ChevronRight size={10} className="text-[#c4c4c4]" />
          <Link to="/shop" className="hover:text-[#3e4026] transition-colors">
            CATEGORIES
          </Link>
          <ChevronRight size={10} className="text-[#c4c4c4]" />
          <span className="text-[#3e4026]">{product.name?.toUpperCase()}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 md:px-12">
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
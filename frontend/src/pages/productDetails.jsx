import Header from "../components/common/Header"
import Footer from "../components/common/Footer"
import ProductImages from "../components/productDetails/ProductImages"
import ProductInfo from "../components/productDetails/ProductInfo"
import ProductDetails from "../components/productDetails/ProductDetails"

export default function ProductDetailsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Product Images */}
          <ProductImages />

          {/* Right: Product Info */}
          <ProductInfo />
        </div>

        {/* Product Details & Description */}
        <ProductDetails />
      </div>

      <Footer />
    </div>
  )
}
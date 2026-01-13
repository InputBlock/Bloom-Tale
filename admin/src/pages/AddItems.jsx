import UploadImages from "../components/AddItems/UploadImages"
import ProductForm from "../components/AddItems/ProductForm"

export default function AddItems() {
  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="space-y-8">
          <UploadImages />
          <ProductForm />
        </div>
      </div>
    </div>
  )
}

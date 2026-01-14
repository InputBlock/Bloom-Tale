import UploadImages from "../components/AddItems/UploadImages"
import ProductForm from "../components/AddItems/ProductForm"
import { useState } from "react"

export default function AddItems() {
  const [images, setImages] = useState([])

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="space-y-8">
          <UploadImages images={images} setImages={setImages} />
          <ProductForm images={images} setImages={setImages} />
        </div>
      </div>
    </div>
  )
}

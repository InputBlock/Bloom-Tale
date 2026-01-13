export default function ProductImages() {
  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
        <img
          src="/white-flowers-arrangement.jpg"
          alt="Product main view"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}

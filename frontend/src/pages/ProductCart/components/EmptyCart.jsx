export default function EmptyCart({ onContinueShopping }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-serif text-gray-900 mb-3 sm:mb-4">
          Your Cart is Empty
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 font-['Poppins']">
          Add some beautiful blooms to your cart!
        </p>
        <button
          onClick={onContinueShopping}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 sm:px-8 text-sm sm:text-base rounded-sm transition-all active:scale-95 font-['Poppins']"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}

export default function CartFooter({ 
  itemCount, 
  totalAmount, 
  onCheckout 
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm text-gray-600 mb-1 font-['Poppins']">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
            <p className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 font-['Poppins']">
              Total Amount : <span className="font-bold">₹ {totalAmount.toLocaleString()}</span>
            </p>
          </div>
          <button 
            onClick={onCheckout}
            className="w-full sm:w-auto font-semibold py-2.5 sm:py-3 px-6 sm:px-12 lg:px-16 text-sm sm:text-base transition-all active:scale-95 whitespace-nowrap rounded-sm shadow-md bg-[#5d6c4e] hover:bg-[#4a5840] text-white hover:shadow-lg font-['Poppins']"
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  )
}

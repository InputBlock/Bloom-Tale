export default function FreeDeliveryBanner({ 
  isFreeDelivery, 
  cartTotal, 
  remainingForFree, 
  threshold 
}) {
  if (isFreeDelivery) {
    return (
      <div className="mb-4 sm:mb-6 bg-[#3e4026] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium text-white">Free delivery unlocked</span>
          </div>
          <span className="text-xs text-white/70">Order above ₹{threshold.toLocaleString()}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-4 sm:mb-6 bg-[#f9f8f6] border border-[#3e4026]/10 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs tracking-[0.15em] uppercase text-[#3e4026]/60 font-medium">
          Free Delivery Progress
        </span>
        <span className="text-xs text-[#3e4026]/60">
          ₹{cartTotal.toLocaleString()} / ₹{threshold.toLocaleString()}
        </span>
      </div>
      <div className="h-1 bg-[#3e4026]/10 overflow-hidden">
        <div 
          className="h-full bg-[#3e4026] transition-all duration-500"
          style={{ width: `${Math.min((cartTotal / threshold) * 100, 100)}%` }}
        />
      </div>
      <p className="text-sm text-[#3e4026] mt-2">
        Add <span className="font-semibold">₹{remainingForFree.toLocaleString()}</span> more to unlock free delivery
      </p>
    </div>
  )
}

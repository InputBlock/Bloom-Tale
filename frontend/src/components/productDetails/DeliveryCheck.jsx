import { useState, useEffect, useCallback, useRef } from "react"
import { deliveryAPI } from "../../api"

export default function DeliveryCheck({ 
  onDeliveryStatusChange, 
  sameDayDelivery = false 
}) {
  const [pincode, setPincode] = useState("")
  const [status, setStatus] = useState(null) // null, 'checking', 'available', 'unavailable'
  const [zone, setZone] = useState(null)
  const [selectedDeliveryType, setSelectedDeliveryType] = useState("fixed")
  const [selectedSlot, setSelectedSlot] = useState("")
  const [showWarning, setShowWarning] = useState(false)
  
  // Track previous values to prevent infinite loops
  const prevValuesRef = useRef({ selectedDeliveryType: "", selectedSlot: "", zoneId: null, pincode: "" })

  // Calculate delivery fee based on selected type
  const getDeliveryFee = useCallback((zoneData, deliveryType) => {
    if (!zoneData?.pricing) return 0
    if (!sameDayDelivery) return 0 // Standard delivery - free or fixed rate
    
    switch (deliveryType) {
      case "fixed": return zoneData.pricing.fixed_time || 0
      case "midnight": return zoneData.pricing.midnight || 0
      case "express": return zoneData.pricing.express || 0
      default: return 0
    }
  }, [sameDayDelivery])

  // Notify parent when delivery options change - only if values actually changed
  useEffect(() => {
    if (status === 'available' && zone) {
      const zoneId = zone._id || zone.zone_name
      const prev = prevValuesRef.current
      
      // Check if anything actually changed
      if (
        prev.selectedDeliveryType === selectedDeliveryType &&
        prev.selectedSlot === selectedSlot &&
        prev.zoneId === zoneId &&
        prev.pincode === pincode
      ) {
        return // Nothing changed, skip callback
      }
      
      // Update ref with current values
      prevValuesRef.current = { selectedDeliveryType, selectedSlot, zoneId, pincode }
      
      const deliveryType = sameDayDelivery ? selectedDeliveryType : "standard"
      const deliveryFee = getDeliveryFee(zone, selectedDeliveryType)
      onDeliveryStatusChange?.('available', {
        zone,
        pincode,
        deliveryType,
        deliveryFee,
        deliverySlot: selectedDeliveryType === "fixed" ? selectedSlot : null
      })
    }
  }, [selectedDeliveryType, selectedSlot, zone, status, sameDayDelivery, pincode, onDeliveryStatusChange, getDeliveryFee])

  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 6) {
      setPincode(value)
      setStatus(null)
      setZone(null)
      setShowWarning(false)
      onDeliveryStatusChange?.(null, null)
    }
  }

  const checkPincode = async () => {
    if (pincode.length !== 6) {
      setStatus('unavailable')
      onDeliveryStatusChange?.('unavailable', null)
      return
    }

    setStatus('checking')

    try {
      const { response, data } = await deliveryAPI.check(pincode)

      if (data.success && data.data.available) {
        setStatus('available')
        setZone(data.data.zone)
        // Initial callback with zone info
        const deliveryType = sameDayDelivery ? selectedDeliveryType : "standard"
        const deliveryFee = sameDayDelivery ? (data.data.zone?.pricing?.fixed_time || 0) : 0
        onDeliveryStatusChange?.('available', {
          zone: data.data.zone,
          pincode,
          deliveryType,
          deliveryFee,
          deliverySlot: null
        })
      } else {
        setStatus('unavailable')
        setZone(null)
        onDeliveryStatusChange?.('unavailable', null)
      }
    } catch (err) {
      console.error("Pincode check failed:", err)
      setStatus('unavailable')
      setZone(null)
      onDeliveryStatusChange?.('unavailable', null)
    }
  }

  const resetPincode = () => {
    setPincode("")
    setStatus(null)
    setZone(null)
    setSelectedSlot("")
    setShowWarning(false)
    onDeliveryStatusChange?.(null, null)
  }

  const handleDeliveryTypeChange = (type) => {
    setSelectedDeliveryType(type)
    if (type !== "fixed") {
      setSelectedSlot("")
    }
  }

  const handleSlotChange = (e) => {
    setSelectedSlot(e.target.value)
  }

  // Get today's date formatted
  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  return (
    <div className="space-y-4">
      {/* Pincode Input */}
      <div>
        <p className="text-xs tracking-[0.2em] uppercase text-[#3e4026]/60 mb-3 font-medium">
          Check Delivery Availability
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={pincode}
            onChange={handlePincodeChange}
            placeholder="Enter Pincode"
            maxLength="6"
            className={`flex-1 border px-4 py-3 text-sm focus:outline-none transition-colors ${
              showWarning && status !== 'available'
                ? 'border-amber-500 focus:border-amber-600'
                : 'border-gray-300 focus:border-[#3e4026]'
            }`}
          />
          <button
            onClick={checkPincode}
            disabled={pincode.length !== 6 || status === 'checking'}
            className="bg-[#3e4026] text-white px-6 py-3 text-sm font-medium hover:bg-[#2d2f1c] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {status === 'checking' ? 'Checking...' : 'Check'}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {showWarning && status !== 'available' && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-300 rounded">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm font-medium text-amber-800">
            Please enter your pincode and check delivery availability
          </p>
        </div>
      )}

      {status === 'available' && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-green-800">Delivery Available</p>
            <p className="text-xs text-green-600 mt-0.5">
              {zone?.name ? `Zone: ${zone.name}` : 'We deliver to your location'}
            </p>
          </div>
        </div>
      )}

      {status === 'unavailable' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800 mb-1">Delivery Not Available</p>
              <p className="text-xs text-red-600 leading-relaxed">
                We currently don't deliver to pincode {pincode}. We're expanding our network.
              </p>
              <button onClick={resetPincode} className="mt-2 text-xs font-medium text-red-700 hover:text-red-800 underline">
                Try another pincode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Options - Only show when available and same_day_delivery */}
      {status === 'available' && sameDayDelivery && zone?.pricing && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#3e4026]">
              Pick the Best Time and Way to Deliver!
            </h3>
            <div className="inline-flex items-center gap-2 bg-[#f9f8f6] px-3 py-1.5 border border-[#3e4026]/20 rounded">
              <svg className="w-4 h-4 text-[#3e4026]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span className="text-xs font-semibold text-[#3e4026] tracking-wider">
                Today, {getFormattedDate()}
              </span>
            </div>
          </div>

          {/* Delivery Options Grid */}
          <div className={`grid ${zone.pricing.express > 0 ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
            {/* Fixed Time */}
            <button
              onClick={() => handleDeliveryTypeChange("fixed")}
              className={`p-4 text-left border transition-all ${
                selectedDeliveryType === "fixed"
                  ? "border-[#3e4026] bg-[#f9f8f6]"
                  : "border-gray-200 bg-white hover:border-[#3e4026]"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-semibold text-[#3e4026]">Fixed Time</h4>
                <span className="text-sm font-medium text-[#3e4026]">₹{zone.pricing.fixed_time}</span>
              </div>
              <p className="text-xs text-[#3e4026]/70">Delivery during selected 2hr slot</p>
            </button>

            {/* Midnight */}
            <button
              onClick={() => handleDeliveryTypeChange("midnight")}
              className={`p-4 text-left border transition-all ${
                selectedDeliveryType === "midnight"
                  ? "border-[#3e4026] bg-[#f9f8f6]"
                  : "border-gray-200 bg-white hover:border-[#3e4026]"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-semibold text-[#3e4026]">Midnight</h4>
                <span className="text-sm font-medium text-[#3e4026]">₹{zone.pricing.midnight}</span>
              </div>
              <p className="text-xs text-[#3e4026]/70">Delivery 11PM - 2AM</p>
            </button>

            {/* Express - Only if available */}
            {zone.pricing.express > 0 && (
              <button
                onClick={() => handleDeliveryTypeChange("express")}
                className={`p-4 text-left border transition-all ${
                  selectedDeliveryType === "express"
                    ? "border-[#3e4026] bg-[#f9f8f6]"
                    : "border-gray-200 bg-white hover:border-[#3e4026]"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-semibold text-[#3e4026]">Express</h4>
                  <span className="text-sm font-medium text-[#3e4026]">₹{zone.pricing.express}</span>
                </div>
                <p className="text-xs text-[#3e4026]/70">Within 2-3 hours</p>
              </button>
            )}
          </div>

          {/* Time Slot for Fixed Time */}
          {selectedDeliveryType === "fixed" && (
            <select 
              value={selectedSlot}
              onChange={handleSlotChange}
              className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#3e4026]"
            >
              <option value="">Select Time Slot</option>
              <option value="9:00 AM - 11:00 AM">9:00 AM - 11:00 AM</option>
              <option value="11:00 AM - 1:00 PM">11:00 AM - 1:00 PM</option>
              <option value="1:00 PM - 3:00 PM">1:00 PM - 3:00 PM</option>
              <option value="3:00 PM - 5:00 PM">3:00 PM - 5:00 PM</option>
              <option value="5:00 PM - 7:00 PM">5:00 PM - 7:00 PM</option>
              <option value="7:00 PM - 9:00 PM">7:00 PM - 9:00 PM</option>
            </select>
          )}
        </div>
      )}

      {/* Standard Delivery for non same-day products */}
      {status === 'available' && !sameDayDelivery && (
        <div className="bg-[#f9f8f6] border border-[#3e4026]/20 rounded-sm p-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#3e4026]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-[#3e4026]">Standard Delivery</p>
              <p className="text-xs text-[#3e4026]/70">Expected delivery in 2-3 business days</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

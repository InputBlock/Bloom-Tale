import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { deliveryAPI } from "../api"

const PincodeContext = createContext()

// Session storage key
const PINCODE_SESSION_KEY = 'bloomtale_pincode_session'

// Helper to load pincode data from sessionStorage
const loadFromSession = () => {
  try {
    const stored = sessionStorage.getItem(PINCODE_SESSION_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading pincode from session:', error)
  }
  return {
    pincode: "",
    status: null, // null, 'checking', 'available', 'unavailable'
    zone: null
  }
}

// Helper to save pincode data to sessionStorage
const saveToSession = (data) => {
  try {
    sessionStorage.setItem(PINCODE_SESSION_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving pincode to session:', error)
  }
}

export const useGlobalPincode = () => {
  const context = useContext(PincodeContext)
  if (!context) {
    throw new Error("useGlobalPincode must be used within a PincodeProvider")
  }
  return context
}

export const PincodeProvider = ({ children }) => {
  // Initialize state from sessionStorage
  const initialData = loadFromSession()
  
  const [pincode, setPincodeState] = useState(initialData.pincode)
  const [status, setStatus] = useState(initialData.status)
  const [zone, setZone] = useState(initialData.zone)
  const [isChecking, setIsChecking] = useState(false)

  // Save to sessionStorage whenever state changes
  useEffect(() => {
    saveToSession({ pincode, status, zone })
  }, [pincode, status, zone])

  // Set pincode without checking
  const setPincode = useCallback((value) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 6)
    setPincodeState(cleanValue)
    // Reset status when pincode changes
    if (cleanValue !== pincode) {
      setStatus(null)
      setZone(null)
    }
  }, [pincode])

  // Check pincode availability
  const checkPincode = useCallback(async (pincodeToCheck = pincode) => {
    const code = pincodeToCheck || pincode
    
    if (code.length !== 6) {
      setStatus('unavailable')
      setZone(null)
      return { success: false, message: "Invalid pincode" }
    }

    setIsChecking(true)
    setStatus('checking')

    try {
      const { response, data } = await deliveryAPI.check(code)

      if (data.success && data.data.available) {
        setStatus('available')
        setZone(data.data.zone)
        setPincodeState(code)
        return { 
          success: true, 
          zone: data.data.zone,
          message: "Delivery available!" 
        }
      } else {
        setStatus('unavailable')
        setZone(null)
        return { 
          success: false, 
          message: data.message || "Delivery not available for this pincode" 
        }
      }
    } catch (err) {
      console.error("Pincode check failed:", err)
      setStatus('unavailable')
      setZone(null)
      return { 
        success: false, 
        message: "Failed to check pincode. Please try again." 
      }
    } finally {
      setIsChecking(false)
    }
  }, [pincode])

  // Reset pincode and clear session
  const resetPincode = useCallback(() => {
    setPincodeState("")
    setStatus(null)
    setZone(null)
    sessionStorage.removeItem(PINCODE_SESSION_KEY)
  }, [])

  // Check if pincode is verified and available
  const isPincodeVerified = status === 'available' && pincode.length === 6

  const value = {
    pincode,
    setPincode,
    status,
    zone,
    isChecking,
    checkPincode,
    resetPincode,
    isPincodeVerified,
    // Convenience getters
    isAvailable: status === 'available',
    isUnavailable: status === 'unavailable',
  }

  return (
    <PincodeContext.Provider value={value}>
      {children}
    </PincodeContext.Provider>
  )
}

export default PincodeContext

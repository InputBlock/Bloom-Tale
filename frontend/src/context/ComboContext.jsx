import { createContext, useContext, useState, useEffect } from "react"

const ComboContext = createContext()

/**
 * CHANGE BY FARAAZ - Added localStorage persistence for combo items
 * This ensures combo cart survives page refresh
 */
const COMBO_STORAGE_KEY = 'bloomtale_combo_cart'

// Helper to load combo data from localStorage
const loadComboFromStorage = () => {
  try {
    const stored = localStorage.getItem(COMBO_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading combo from localStorage:', error)
  }
  return {
    comboItems: [],
    pincode: "",
    pincodeVerified: false,
    deliveryOption: null,
    deliveryCategory: null,
    deliveryCharges: 0
  }
}

// Helper to save combo data to localStorage
const saveComboToStorage = (data) => {
  try {
    localStorage.setItem(COMBO_STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving combo to localStorage:', error)
  }
}

const useCombo = () => {
  const context = useContext(ComboContext)
  if (!context) {
    throw new Error("useCombo must be used within a ComboProvider")
  }
  return context
}

const ComboProvider = ({ children }) => {
  // CHANGE BY FARAAZ - Initialize state from localStorage
  const initialData = loadComboFromStorage()
  
  const [comboItems, setComboItems] = useState(initialData.comboItems)
  const [pincode, setPincode] = useState(initialData.pincode)
  const [pincodeVerified, setPincodeVerified] = useState(initialData.pincodeVerified)
  const [deliveryOption, setDeliveryOption] = useState(initialData.deliveryOption)
  const [deliveryCategory, setDeliveryCategory] = useState(initialData.deliveryCategory)
  const [deliveryCharges, setDeliveryCharges] = useState(initialData.deliveryCharges)

  // CHANGE BY FARAAZ - Save to localStorage whenever state changes
  useEffect(() => {
    saveComboToStorage({
      comboItems,
      pincode,
      pincodeVerified,
      deliveryOption,
      deliveryCategory,
      deliveryCharges
    })
  }, [comboItems, pincode, pincodeVerified, deliveryOption, deliveryCategory, deliveryCharges])

  // Calculate total price
  const calculateTotal = () => {
    const subtotal = comboItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    return subtotal
  }

  // Calculate discount (20%)
  const calculateDiscount = () => {
    const subtotal = calculateTotal()
    return subtotal * 0.20
  }

  // Calculate final total with discount and delivery
  const calculateFinalTotal = () => {
    const subtotal = calculateTotal()
    const discount = calculateDiscount()
    return (subtotal - discount) + deliveryCharges
  }

  // Add item to combo
  const addToCombo = (product) => {
    setComboItems(prev => {
      const existingIndex = prev.findIndex(item => 
        item.product_id === product.product_id && 
        item.selectedSize === product.selectedSize &&
        item.selectedColor === product.selectedColor
      )

      if (existingIndex >= 0) {
        // Update quantity if item already exists
        const updated = [...prev]
        updated[existingIndex].quantity += product.quantity
        return updated
      } else {
        // Add new item
        return [...prev, product]
      }
    })
  }

  // Remove item from combo
  const removeFromCombo = (productId, selectedSize, selectedColor) => {
    setComboItems(prev => prev.filter(item => 
      !(item.product_id === productId && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor)
    ))
  }

  // Update item quantity
  const updateQuantity = (productId, selectedSize, selectedColor, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCombo(productId, selectedSize, selectedColor)
      return
    }

    setComboItems(prev => prev.map(item => 
      item.product_id === productId && 
      item.selectedSize === selectedSize && 
      item.selectedColor === selectedColor
        ? { ...item, quantity: newQuantity }
        : item
    ))
  }

  // Verify pincode
  const verifyPincode = async (code) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const pincodeNum = parseInt(code)
        if (code.length === 6 && pincodeNum < 500000) {
          setPincode(code)
          setPincodeVerified(true)
          resolve({ success: true, message: "Delivery available to this pincode" })
        } else {
          setPincodeVerified(false)
          resolve({ success: false, message: "Sorry, we don't deliver to this pincode yet. Please try a different pincode." })
        }
      }, 500)
    })
  }

  // Set delivery option
  const selectDeliveryOption = (option, category = null) => {
    setDeliveryOption(option)
    setDeliveryCategory(category)
    
    // Standard delivery charge of ₹199
    if (option === 'standard') {
      setDeliveryCharges(199)
    } else {
      setDeliveryCharges(0)
    }
  }

  // Clear combo - CHANGE BY FARAAZ: Also clears localStorage
  const clearCombo = () => {
    setComboItems([])
    setPincode("")
    setPincodeVerified(false)
    setDeliveryOption(null)
    setDeliveryCategory(null)
    setDeliveryCharges(0)
    // Clear from localStorage as well
    localStorage.removeItem(COMBO_STORAGE_KEY)
  }

  // Reset pincode (for changing pincode)
  const resetPincode = () => {
    setPincode("")
    setPincodeVerified(false)
    setDeliveryOption(null)
    setDeliveryCategory(null)
    setDeliveryCharges(0)
  }

  const value = {
    comboItems,
    pincode,
    pincodeVerified,
    isPincodeVerified: pincodeVerified,
    deliveryOption,
    selectedDeliveryOption: deliveryOption,
    deliveryCategory,
    deliveryCharges,
    addToCombo,
    removeFromCombo,
    updateQuantity,
    verifyPincode,
    selectDeliveryOption,
    clearCombo,
    resetPincode,
    calculateTotal,
    calculateDiscount,
    calculateFinalTotal,
  }

  return <ComboContext.Provider value={value}>{children}</ComboContext.Provider>
}

export { useCombo, ComboProvider }

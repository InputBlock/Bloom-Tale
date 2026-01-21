import { createContext, useContext, useState } from "react"

const ComboContext = createContext()

const useCombo = () => {
  const context = useContext(ComboContext)
  if (!context) {
    throw new Error("useCombo must be used within a ComboProvider")
  }
  return context
}

const ComboProvider = ({ children }) => {
  const [comboItems, setComboItems] = useState([])
  const [pincode, setPincode] = useState("")
  const [pincodeVerified, setPincodeVerified] = useState(false)
  const [deliveryOption, setDeliveryOption] = useState(null) // 'today' or 'tomorrow'
  const [deliveryCategory, setDeliveryCategory] = useState(null) // 'schedule', 'midnight', 'express' for today
  const [deliveryCharges, setDeliveryCharges] = useState(0)

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
        item.selectedColor?.id === product.selectedColor?.id
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
  const removeFromCombo = (productId, selectedSize, selectedColorId) => {
    setComboItems(prev => prev.filter(item => 
      !(item.product_id === productId && 
        item.selectedSize === selectedSize && 
        item.selectedColor?.id === selectedColorId)
    ))
  }

  // Update item quantity
  const updateQuantity = (productId, selectedSize, selectedColorId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCombo(productId, selectedSize, selectedColorId)
      return
    }

    setComboItems(prev => prev.map(item => 
      item.product_id === productId && 
      item.selectedSize === selectedSize && 
      item.selectedColor?.id === selectedColorId
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

  // Clear combo
  const clearCombo = () => {
    setComboItems([])
    setPincode("")
    setPincodeVerified(false)
    setDeliveryOption(null)
    setDeliveryCategory(null)
    setDeliveryCharges(0)
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

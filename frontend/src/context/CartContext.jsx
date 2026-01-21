import { createContext, useContext, useState } from "react"
import { cartAPI, authAPI } from "../api"

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)

  // Check if user is logged in
  const isLoggedIn = () => {
    return authAPI.isAuthenticated()
  }

  // Fetch cart from backend
  const fetchCart = async () => {
    if (!isLoggedIn()) {
      setCartItems([])
      setTotalAmount(0)
      return
    }

    try {
      setLoading(true)
      const { response, data } = await cartAPI.get()

      // Check if response is 401/403 (token expired) - auto-handled by api utility
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Token expired - user will be redirected automatically
          return
        }
        throw new Error(data.message || 'Failed to fetch cart')
      }

      if (data.success && data.data.cart) {
        setCartItems(data.data.cart.items || [])
        setTotalAmount(data.data.totalAmount || 0)
      } else {
        setCartItems([])
        setTotalAmount(0)
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
      setCartItems([])
      setTotalAmount(0)
    } finally {
      setLoading(false)
    }
  }

  // Don't load cart automatically on mount - only when user accesses cart page or adds to cart

  const addToCart = async (product) => {
    if (!isLoggedIn()) {
      // Redirect to login with return URL to come back after login
      const currentPath = window.location.pathname + window.location.search
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
      return { success: false, message: "Please login to add items to cart" }
    }

    try {
      // Check if this is a combo product
      const isCombo = product.isCombo || product.combo_items

      let response, data

      if (isCombo) {
        /**
         * CHANGE BY FARAAZ - Use dedicated combo endpoint for combo products
         * Backend endpoint: /api/v1/cart/addComboToCart
         */
        const comboRequestBody = {
          combo_items: product.combo_items.map(item => ({
            product_id: item.product_id,
            name: item.name,
            size: item.size || item.selectedSize || null,
            quantity: item.quantity,
            price: item.price
          })),
          delivery_pincode: product.delivery_pincode
        }

        const result = await cartAPI.addCombo(comboRequestBody)
        response = result.response
        data = result.data
      } else {
        // Regular product - use standard addToCart endpoint
        const requestBody = {
          product_id: product.product_id,
          quantity: product.quantity || 1,
          size: product.size || null,
          color: product.color || null,
          // Delivery info
          deliveryType: product.deliveryType || 'standard',
          deliveryFee: product.deliveryFee || 0,
          deliverySlot: product.deliverySlot || null,
          pincode: product.pincode || null,
        }

        const result = await cartAPI.add(requestBody)
        response = result.response
        data = result.data
      }

      // Check for auth errors (auto-handled by api utility)
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Token expired - user will be redirected automatically
          return { success: false, message: "Session expired. Please login again." }
        }
        return { success: false, message: data.message || "Failed to add to cart" }
      }

      if (data.success) {
        // Refresh cart after adding
        await fetchCart()
        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      return { success: false, message: "Failed to add to cart" }
    }
  }

  const removeFromCart = async (product_id) => {
    if (!isLoggedIn()) {
      return
    }

    try {
      // CHANGE BY FARAAZ - Now properly calling backend API to remove item from cart
      const { response, data } = await cartAPI.remove(product_id)
      
      if (response.ok && data.success) {
        // Update local state after successful backend deletion
        setCartItems((prevItems) => 
          prevItems.filter((item) => item.product_id !== product_id)
        )
        // Refresh cart to get updated total
        await fetchCart()
      } else {
        console.error("Failed to remove item from cart:", data.message)
      }
    } catch (error) {
      console.error("Error removing from cart:", error)
    }
  }

  const updateQuantity = async (product_id, newQuantity) => {
    if (newQuantity < 1 || !isLoggedIn()) return

    try {
      // Update locally first for immediate feedback
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === product_id ? { ...item, quantity: newQuantity } : item
        )
      )
      
      // Then sync with backend
      // Note: You'll need to implement updateQuantity endpoint in backend
    } catch (error) {
      console.error("Error updating quantity:", error)
    }
  }

  const clearCart = () => {
    setCartItems([])
    setTotalAmount(0)
  }

  const getCartTotal = () => {
    return totalAmount
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        fetchCart,
        loading,
        isLoggedIn,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

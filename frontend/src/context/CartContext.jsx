import { createContext, useContext, useState } from "react"
import { cartAPI, authAPI } from "../api"

const CartContext = createContext()

// Storage keys
const CART_STORAGE_KEY = 'bloomtale_cart'
const CART_TOTAL_KEY = 'bloomtale_cart_total'

// Helper to get cached cart from storage
const getCachedCart = () => {
  try {
    const cached = sessionStorage.getItem(CART_STORAGE_KEY)
    return cached ? JSON.parse(cached) : []
  } catch {
    return []
  }
}

const getCachedTotal = () => {
  try {
    const cached = sessionStorage.getItem(CART_TOTAL_KEY)
    return cached ? parseFloat(cached) : 0
  } catch {
    return 0
  }
}

// Save cart to storage
const saveCartToStorage = (items, total) => {
  try {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    sessionStorage.setItem(CART_TOTAL_KEY, total.toString())
  } catch (e) {
    console.error('Failed to save cart to storage:', e)
  }
}

// Clear cart from storage
const clearCartStorage = () => {
  try {
    sessionStorage.removeItem(CART_STORAGE_KEY)
    sessionStorage.removeItem(CART_TOTAL_KEY)
  } catch {}
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider = ({ children }) => {
  // Initialize from cache - instant data on refresh!
  const [cartItems, setCartItems] = useState(() => getCachedCart())
  const [totalAmount, setTotalAmount] = useState(() => getCachedTotal())
  const [loading, setLoading] = useState(false)

  // Check if user is logged in
  const isLoggedIn = () => {
    return authAPI.isAuthenticated()
  }

  // Update cart state and cache
  const updateCartState = (items, total) => {
    setCartItems(items)
    setTotalAmount(total)
    saveCartToStorage(items, total)
  }

  // Fetch cart from backend and sync with cache
  const fetchCart = async () => {
    if (!isLoggedIn()) {
      updateCartState([], 0)
      return
    }

    try {
      setLoading(true)
      const { response, data } = await cartAPI.get()

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          clearCartStorage()
          return
        }
        throw new Error(data.message || 'Failed to fetch cart')
      }

      if (data.success && data.data.cart) {
        const items = data.data.cart.items || []
        const total = data.data.totalAmount || 0
        updateCartState(items, total)
      } else {
        updateCartState([], 0)
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
      // Keep cached data on error - don't clear
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (product) => {
    if (!isLoggedIn()) {
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
            color: item.color || item.selectedColor || null, // Add color for balloons/candles
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
        // Update local state AND cache after successful backend deletion
        const updatedItems = cartItems.filter((item) => item.product_id !== product_id)
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        updateCartState(updatedItems, newTotal)
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
      const updatedItems = cartItems.map((item) =>
        item.product_id === product_id ? { ...item, quantity: newQuantity } : item
      )
      // Calculate new total
      const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      // Update state AND cache together
      updateCartState(updatedItems, newTotal)
      
      // Then sync with backend
      // Note: You'll need to implement updateQuantity endpoint in backend
    } catch (error) {
      console.error("Error updating quantity:", error)
    }
  }

  const clearCart = () => {
    updateCartState([], 0)
    clearCartStorage()
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

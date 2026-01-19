import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

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

  // Get auth headers (token from localStorage for Google auth, cookies for normal login)
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token")
    const headers = {
      "Content-Type": "application/json",
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
    return headers
  }

  // Check if user is logged in
  const isLoggedIn = () => {
    const user = localStorage.getItem("user")
    return !!user
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
      const response = await fetch("/api/v1/cart/getCart", {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include", // Important for cookies
      })

      const data = await response.json()

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
      // Redirect to login if not logged in
      window.location.href = "/login"
      return { success: false, message: "Please login to add items to cart" }
    }

    try {
      // Check if this is a combo product
      const isCombo = product.isCombo || product.combo_items

      const requestBody = isCombo ? {
        // Combo product structure
        product_id: product.product_id,
        quantity: product.quantity || 1,
        isCombo: true,
        combo_items: product.combo_items,
        price: product.price,
        name: product.name || 'Custom Combo Package',
        delivery_pincode: product.delivery_pincode,
        delivery_charge: product.delivery_charge,
        subtotal: product.subtotal,
        discount: product.discount,
        discount_percentage: product.discount_percentage
      } : {
        // Regular product structure
        product_id: product.product_id,
        quantity: product.quantity || 1,
        size: product.size || "medium",
        // Delivery info
        deliveryType: product.deliveryType || 'standard',
        deliveryFee: product.deliveryFee || 0,
        deliverySlot: product.deliverySlot || null,
        pincode: product.pincode || null,
      }

      const response = await fetch("/api/v1/cart/addToCart", {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

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
      // Note: You'll need to implement removeFromCart endpoint in backend
      // For now, we'll handle it on the frontend
      setCartItems((prevItems) => 
        prevItems.filter((item) => item.product_id !== product_id)
      )
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

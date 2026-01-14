import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("bloomtale-cart")
    return savedCart ? JSON.parse(savedCart) : []
  })

  useEffect(() => {
    localStorage.setItem("bloomtale-cart", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id && item.variantId === product.variantId
      )

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id && item.variantId === product.variantId
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        )
      }

      return [...prevItems, { ...product, cartId: Date.now() }]
    })
  }

  const removeFromCart = (cartId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId))
  }

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) return

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
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
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

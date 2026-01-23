// Delivery Constants - Single source of truth
export const DELIVERY_CONSTANTS = {
  // Free delivery threshold for standard (non-same-day) delivery
  FREE_DELIVERY_THRESHOLD: 1500,
  
  // Free delivery threshold for same-day delivery (fixed time only)
  SAME_DAY_FREE_DELIVERY_THRESHOLD: 2000,
  
  // Standard delivery charge when cart < threshold
  STANDARD_DELIVERY_CHARGE: 150,
  
  // Default delivery charge if not specified in product
  DEFAULT_DELIVERY_CHARGE: 99,
}

// Helper function to calculate delivery charge
export const calculateDeliveryCharge = (cartTotal, baseCharge = DELIVERY_CONSTANTS.STANDARD_DELIVERY_CHARGE) => {
  if (cartTotal >= DELIVERY_CONSTANTS.FREE_DELIVERY_THRESHOLD) {
    return 0
  }
  return baseCharge
}

// Helper to get remaining amount for free delivery
export const getRemainingForFreeDelivery = (cartTotal) => {
  const remaining = DELIVERY_CONSTANTS.FREE_DELIVERY_THRESHOLD - cartTotal
  return remaining > 0 ? remaining : 0
}

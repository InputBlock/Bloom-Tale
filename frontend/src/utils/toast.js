// Toast utility functions
let toastCallback = null

export const setToastCallback = (callback) => {
  toastCallback = callback
}

export const toast = {
  success: (message) => {
    if (toastCallback) toastCallback({ message, type: 'success' })
  },
  error: (message) => {
    if (toastCallback) toastCallback({ message, type: 'error' })
  },
  info: (message) => {
    if (toastCallback) toastCallback({ message, type: 'info' })
  },
  loading: (message) => {
    if (toastCallback) toastCallback({ message, type: 'loading' })
  }
}

// Flower-themed messages
export const flowerMessages = {
  success: {
    login: "Welcome back, bloom lover! 🌸",
    register: "Your garden account is blooming! 🌺",
    logout: "See you soon, petal friend! 🌼",
    passwordReset: "Your password is fresh as morning dew! 💐",
    otpSent: "A secret bloomed in your inbox! 🌷",
    otpVerified: "Perfect! Your garden gate is open! 🌻",
  },
  error: {
    login: "Oops! Wrong garden path! 🥀",
    register: "This email already has a garden! 🌿",
    invalidOtp: "This key doesn't fit our garden! 🔑",
    expired: "Your flower wilted, try again! ⏰",
    network: "Our garden is taking a nap! 💤",
    passwordMismatch: "These petals don't match! 🌹",
    emailRequired: "We need your email to bloom! 📧",
  },
  loading: {
    sending: "Planting your request... 🌱",
    verifying: "Checking the flower bed... 🔍",
    processing: "Sprinkling magic dust... ✨",
  }
}

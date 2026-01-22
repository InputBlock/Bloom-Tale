/**
 * Centralized E-commerce Frontend API System
 * - Uses httpOnly cookies for secure authentication (primary)
 * - Falls back to Bearer token in header for compatibility
 * - Automatic token refresh handling
 * - Centralized error handling with auto-redirect on 401/403
 * - All endpoints organized in modules
 */

// API Base URL - uses Vite proxy in dev, direct URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

let isLoggingOut = false; // Prevent multiple logout attempts

/**
 * Handle authentication errors - logout and redirect
 */
const handleAuthError = async () => {
  if (isLoggingOut) return;
  
  isLoggingOut = true;
  
  try {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Store current location for redirect after re-login
    const currentPath = window.location.pathname + window.location.search;
    
    // Store message in sessionStorage
    sessionStorage.setItem('loginMessage', JSON.stringify({
      title: 'Session Expired',
      message: 'Your session has expired. Please log in again to continue.',
      type: 'session-expired'
    }));
    
    // Redirect to login with return URL
    if (currentPath !== '/login' && currentPath !== '/register') {
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    }
  } finally {
    setTimeout(() => { isLoggingOut = false; }, 1000);
  }
};

/**
 * Core fetch wrapper with automatic token handling
 * Uses httpOnly cookies (primary) with Bearer token fallback
 */
const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get token from localStorage for fallback
  const token = localStorage.getItem('token');
  
  // Default headers
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };
  
  // Add Authorization header if token exists (fallback for cookies)
  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Required for httpOnly cookies
    });
    
    // Handle authentication errors
    if ((response.status === 401 || response.status === 403) && !options.skipAuth) {
      await handleAuthError();
      return response;
    }
    
    return response;
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
};

/**
 * Parse JSON response with error handling
 */
const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return { message: await response.text() };
};

// ============================================
// AUTH API - Login, Register, Password Reset
// ============================================
export const authAPI = {
  login: async (email, password) => {
    const response = await apiFetch('/api/v1/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await parseResponse(response);
    
    if (response.ok && data.data) {
      // Store user and token locally
      localStorage.setItem('user', JSON.stringify(data.data.user));
      if (data.data.accessToken) {
        localStorage.setItem('token', data.data.accessToken);
      }
    }
    
    return { response, data };
  },
  
  register: async (email, password) => {
    const response = await apiFetch('/api/v1/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return { response, data: await parseResponse(response) };
  },
  
  verifyOtp: async (otp) => {
    const response = await apiFetch('/api/v1/verifyOtp', {
      method: 'POST',
      body: JSON.stringify({ otp }),
    });
    return { response, data: await parseResponse(response) };
  },
  
  resendOtp: async (email, password) => {
    // Resend OTP by calling register again with same credentials
    const response = await apiFetch('/api/v1/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return { response, data: await parseResponse(response) };
  },
  
  logout: async () => {
    try {
      await apiFetch('/api/v1/logout', { method: 'POST', skipAuth: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },
  
  forgotPassword: async (email) => {
    const response = await apiFetch('/api/v1/forgotPassword', {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true,
    });
    return { response, data: await parseResponse(response) };
  },
  
  resetPassword: async (otp, newPassword) => {
    const response = await apiFetch('/api/v1/resetPassword', {
      method: 'POST',
      body: JSON.stringify({ otp, newPassword }),
    });
    return { response, data: await parseResponse(response) };
  },
  
  googleLogin: (redirectUrl = '/home') => {
    // Store redirect URL for after OAuth callback
    localStorage.setItem('authRedirect', redirectUrl);
    window.location.href = '/api/v1/google';
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },
  
  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
};

// ============================================
// PRODUCTS API - Get Products, Details
// ============================================
export const productsAPI = {
  getList: async (params = {}) => {
    const response = await apiFetch('/api/v1/getProduct/list', { 
      method: 'POST',
      body: JSON.stringify(params),
      skipAuth: true,
    });
    return { response, data: await parseResponse(response) };
  },
  
  getBestsellers: async () => {
    const response = await apiFetch('/api/v1/getProduct/bestseller', {
      method: 'POST',
      skipAuth: true,
    });
    return { response, data: await parseResponse(response) };
  },
  
  getDetails: async (productId) => {
    const response = await apiFetch(`/api/v1/getProductDetail/${productId}`, {
      method: 'POST',
      skipAuth: true,
    });
    return { response, data: await parseResponse(response) };
  },
  
  search: async (query) => {
    const response = await apiFetch('/api/v1/getProduct/list', {
      method: 'POST',
      body: JSON.stringify({ search: query }),
      skipAuth: true,
    });
    return { response, data: await parseResponse(response) };
  },
};

// ============================================
// CART API - Add, Get, Update, Remove
// ============================================
export const cartAPI = {
  get: async () => {
    const response = await apiFetch('/api/v1/cart/getCart', {
      method: 'POST',
    });
    return { response, data: await parseResponse(response) };
  },
  
  add: async (item) => {
    const response = await apiFetch('/api/v1/cart/addToCart', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return { response, data: await parseResponse(response) };
  },

  /**
   * CHANGE BY FARAAZ - Add combo to cart endpoint
   * Connects to backend: http://localhost:8000/api/v1/cart/addComboToCart
   * @param {Object} comboData - Combo data with combo_items array and delivery_pincode
   * @returns {Promise} - API response
   */
  addCombo: async (comboData) => {
    const response = await apiFetch('/api/v1/cart/addComboToCart', {
      method: 'POST',
      body: JSON.stringify(comboData),
    });
    return { response, data: await parseResponse(response) };
  },
  
  update: async (productId, quantity) => {
    const response = await apiFetch('/api/v1/cart/updateQuantity', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
    return { response, data: await parseResponse(response) };
  },
  
  remove: async (productId) => {
    const response = await apiFetch('/api/v1/cart/removeFromCart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
    return { response, data: await parseResponse(response) };
  },
  
  clear: async () => {
    const response = await apiFetch('/api/v1/cart/clearCart', {
      method: 'POST',
    });
    return { response, data: await parseResponse(response) };
  },
};

// ============================================
// ORDER API - Checkout, Payment, Orders
// ============================================
export const orderAPI = {
  checkout: async (checkoutData) => {
    const response = await apiFetch('/api/v1/order/checkout', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
    });
    return { response, data: await parseResponse(response) };
  },
  
  getSummary: async (orderId) => {
    const response = await apiFetch(`/api/v1/order/${orderId}/orderSummary`, {
      method: 'GET',
    });
    return { response, data: await parseResponse(response) };
  },
  
  setPaymentMethod: async (orderId, paymentMethod) => {
    const response = await apiFetch(`/api/v1/order/${orderId}/payment-method`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentMethod }),
    });
    return { response, data: await parseResponse(response) };
  },
  
  confirmCOD: async (orderId) => {
    const response = await apiFetch(`/api/v1/order/${orderId}/confirm-cod`, {
      method: 'POST',
    });
    return { response, data: await parseResponse(response) };
  },
  
  createPayment: async (orderId) => {
    const response = await apiFetch('/api/v1/order/payment', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
    return { response, data: await parseResponse(response) };
  },
  
  verifyPayment: async (paymentData) => {
    const response = await apiFetch('/api/v1/order/verify-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
    return { response, data: await parseResponse(response) };
  },
  
  markPaymentFailed: async (orderId) => {
    const response = await apiFetch('/api/v1/order/markPaymentFailed', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
    return { response, data: await parseResponse(response) };
  },
  
  getMyOrders: async () => {
    const response = await apiFetch('/api/v1/order/myOrder', {
      method: 'GET',
    });
    return { response, data: await parseResponse(response) };
  },
  
  getAddress: async () => {
    const response = await apiFetch('/api/v1/order/getaddress', {
      method: 'POST',
    });
    return { response, data: await parseResponse(response) };
  },
};

// ============================================
// DELIVERY API - Check Delivery, Zones
// ============================================
export const deliveryAPI = {
  check: async (pincode) => {
    const response = await apiFetch(`/api/v1/delivery/check?pincode=${pincode}`, {
      method: 'GET',
      skipAuth: true,
    });
    return { response, data: await parseResponse(response) };
  },
  
  getZones: async () => {
    const response = await apiFetch('/api/v1/delivery/zones', {
      method: 'GET',
      skipAuth: true,
    });
    return { response, data: await parseResponse(response) };
  },
};

// ============================================
// CONTENT API - Hero Sections, Testimonials
// ============================================
export const contentAPI = {
  getHeroSections: async () => {
    const response = await apiFetch('/api/v1/admin/hero', {
      method: 'GET',
      skipAuth: true,
    });
    return { response, data: await parseResponse(response) };
  },
  
  getTestimonials: async () => {
    const response = await apiFetch('/api/v1/testimonial', {
      method: 'GET',
      skipAuth: true,
    });
    return { response, data: await parseResponse(response) };
  },
};

// ============================================
// ABOUT SECTION API
// ============================================
export const aboutAPI = {
  get: async () => {
    const response = await apiFetch('/api/v1/admin/about', {
      method: 'GET',
      skipAuth: true,
    });
    return { response, data: await parseResponse(response) };
  },
};

// ============================================
// ENQUIRY API - Contact Form
// ============================================
export const enquiryAPI = {
  submit: async (formData) => {
    const response = await apiFetch('/api/v1/enquiry/createEnquiry', {
      method: 'POST',
      body: JSON.stringify(formData),
      skipAuth: true,
    });
    return { response, data: await parseResponse(response) };
  },
};

// ============================================
// LEGACY SUPPORT - For gradual migration
// ============================================
export const api = {
  get: (url, options = {}) => apiFetch(url, { ...options, method: 'GET' }),
  post: (url, data, options = {}) => apiFetch(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (url, data, options = {}) => apiFetch(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  patch: (url, data, options = {}) => apiFetch(url, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (url, options = {}) => apiFetch(url, { ...options, method: 'DELETE' }),
};

// Export helpers
export const isAuthenticated = authAPI.isAuthenticated;
export const getCurrentUser = authAPI.getCurrentUser;
export const logout = authAPI.logout;

export default api;

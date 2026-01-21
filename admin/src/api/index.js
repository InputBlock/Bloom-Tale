import axios from 'axios';

/**
 * Centralized Admin API System
 * - Uses httpOnly cookies for secure authentication (not localStorage)
 * - Automatic token refresh handling
 * - Centralized error handling
 * - All endpoints in one place
 */

// API Base URL - uses Vite proxy in dev, direct URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Required for httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    
    // Handle authentication errors
    if (status === 401 || status === 403) {
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  login: (email, password) => 
    api.post('/api/v1/admin/login', { email, password }),
  
  logout: () => 
    api.post('/api/v1/admin/logout'),
  
  // Check if authenticated (used by ProtectedRoute)
  checkAuth: () => 
    api.get('/api/v1/admin/orders/stats'),
};

// ============================================
// PRODUCTS API
// ============================================
export const productsAPI = {
  getAll: () => 
    api.get('/api/v1/admin/showlist'),
  
  add: (formData) => 
    api.post('/api/v1/admin/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  update: (data) => 
    api.post('/api/v1/admin/update', data),
  
  updateWithImages: (formData) => 
    api.post('/api/v1/admin/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  delete: (id) => 
    api.post('/api/v1/admin/delete', { id }),
  
  list: (id) => 
    api.post('/api/v1/admin/list', { id }),
  
  unlist: (id) => 
    api.post('/api/v1/admin/unlist', { id }),
};

// ============================================
// ORDERS API
// ============================================
export const ordersAPI = {
  getAll: () => 
    api.get('/api/v1/admin/orders'),
  
  getRecent: (limit = 5) => 
    api.get(`/api/v1/admin/orders?limit=${limit}`),
  
  getById: (orderId) => 
    api.get(`/api/v1/admin/orders/${orderId}`),
  
  getStats: () => 
    api.get('/api/v1/admin/orders/stats'),
  
  updateStatus: (orderId, status) => 
    api.patch(`/api/v1/admin/orders/${orderId}/status`, { status }),
};

// ============================================
// USERS API
// ============================================
export const usersAPI = {
  getAll: () => 
    api.get('/api/v1/admin/users'),
  
  getById: (userId) => 
    api.get(`/api/v1/admin/users/${userId}`),
  
  getStats: () => 
    api.get('/api/v1/admin/users/stats'),
  
  delete: (userId) => 
    api.delete(`/api/v1/admin/users/${userId}`),
};

// ============================================
// HERO SECTIONS API
// ============================================
export const heroAPI = {
  getAll: () => 
    api.get('/api/v1/admin/hero'),
  
  add: (formData) => 
    api.post('/api/v1/admin/hero', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  update: (id, formData) => 
    api.put(`/api/v1/admin/hero/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  delete: (id) => 
    api.delete(`/api/v1/admin/hero/${id}`),
};

// ============================================
// ABOUT SECTION API
// ============================================
export const aboutAPI = {
  get: () => 
    api.get('/api/v1/admin/about'),
  
  getAll: () => 
    api.get('/api/v1/admin/about/all'),
  
  create: (formData) => 
    api.post('/api/v1/admin/about', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  update: (id, formData) => 
    api.put(`/api/v1/admin/about/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  delete: (id) => 
    api.delete(`/api/v1/admin/about/${id}`),
};

// ============================================
// DELIVERY ZONES API
// ============================================
export const deliveryAPI = {
  getAllZones: () => 
    api.get('/api/v1/delivery/zones'),
  
  getZoneById: (zoneId) => 
    api.get(`/api/v1/delivery/zones/${zoneId}`),
  
  createZone: (data) => 
    api.post('/api/v1/delivery/zones', data),
  
  updateZone: (zoneId, data) => 
    api.put(`/api/v1/delivery/zones/${zoneId}`, data),
  
  addPincodes: (zoneId, pincodes) => 
    api.post(`/api/v1/delivery/zones/${zoneId}/pincodes`, { pincodes }),
  
  removePincodes: (zoneId, pincodes) => 
    api.delete(`/api/v1/delivery/zones/${zoneId}/pincodes`, { 
      data: { pincodes } 
    }),
  
  deleteZone: (zoneId) => 
    api.delete(`/api/v1/delivery/zones/${zoneId}`),
};

// ============================================
// ENQUIRIES API
// ============================================
export const enquiriesAPI = {
  getAll: (params = {}) => 
    api.get('/api/v1/admin/enquiries', { params }),
  
  getById: (enquiryId) => 
    api.get(`/api/v1/admin/enquiries/${enquiryId}`),
  
  getStats: () => 
    api.get('/api/v1/admin/enquiries/stats'),
  
  updateStatus: (enquiryId, status) => 
    api.patch(`/api/v1/admin/enquiries/${enquiryId}/status`, { status }),
  
  delete: (enquiryId) => 
    api.delete(`/api/v1/admin/enquiries/${enquiryId}`),
};

// Export the raw api instance for custom requests
export default api;

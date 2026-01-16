// API Configuration for production deployment
// In development, Vite proxy handles /api requests
// In production, this should point to your backend URL

export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Admin API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/v1/admin/login`,
  
  // Products
  ADD_PRODUCT: `${API_BASE_URL}/api/v1/admin/add`,
  LIST_PRODUCTS: `${API_BASE_URL}/api/v1/admin/showlist`,
  UPDATE_PRODUCT: `${API_BASE_URL}/api/v1/admin/update`,
  DELETE_PRODUCT: `${API_BASE_URL}/api/v1/admin/delete`,
  LIST_PRODUCT: `${API_BASE_URL}/api/v1/admin/list`,
  UNLIST_PRODUCT: `${API_BASE_URL}/api/v1/admin/unlist`,
  
  // Orders
  GET_ORDERS: `${API_BASE_URL}/api/v1/admin/orders`,
  GET_ORDER_STATS: `${API_BASE_URL}/api/v1/admin/orders/stats`,
  GET_ORDER_BY_ID: (id) => `${API_BASE_URL}/api/v1/admin/orders/${id}`,
  UPDATE_ORDER_STATUS: (id) => `${API_BASE_URL}/api/v1/admin/orders/${id}/status`,
  
  // Users
  GET_USERS: `${API_BASE_URL}/api/v1/admin/user_list`,
};

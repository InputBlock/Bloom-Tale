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
  GET_USERS: `${API_BASE_URL}/api/v1/admin/users`,
  GET_USER_STATS: `${API_BASE_URL}/api/v1/admin/users/stats`,
  GET_USER_BY_ID: (id) => `${API_BASE_URL}/api/v1/admin/users/${id}`,
  DELETE_USER: (id) => `${API_BASE_URL}/api/v1/admin/users/${id}`,
  
  // Hero Sections
  GET_HERO_SECTIONS: `${API_BASE_URL}/api/v1/admin/hero`,
  ADD_HERO_SECTION: `${API_BASE_URL}/api/v1/admin/hero`,
  UPDATE_HERO_SECTION: (id) => `${API_BASE_URL}/api/v1/admin/hero/${id}`,
  DELETE_HERO_SECTION: (id) => `${API_BASE_URL}/api/v1/admin/hero/${id}`,

  // Delivery Zones
  GET_DELIVERY_ZONES: `${API_BASE_URL}/api/v1/delivery/zones`,
  GET_ZONE_BY_ID: (id) => `${API_BASE_URL}/api/v1/delivery/zones/${id}`,
  CREATE_ZONE: `${API_BASE_URL}/api/v1/delivery/zones`,
  UPDATE_ZONE: (id) => `${API_BASE_URL}/api/v1/delivery/zones/${id}`,
  ADD_PINCODES: (id) => `${API_BASE_URL}/api/v1/delivery/zones/${id}/pincodes`,
  REMOVE_PINCODES: (id) => `${API_BASE_URL}/api/v1/delivery/zones/${id}/pincodes`,
  DELETE_ZONE: (id) => `${API_BASE_URL}/api/v1/delivery/zones/${id}`,
};

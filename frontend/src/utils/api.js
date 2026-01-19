/**
 * Centralized API utility with automatic token expiry handling
 * Wraps fetch API to intercept responses and handle authentication errors
 */

let isLoggingOut = false; // Prevent multiple logout attempts

/**
 * Enhanced fetch wrapper with automatic logout on token expiry
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<Response>} - Fetch response
 */
export const apiFetch = async (url, options = {}) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Add authorization header if token exists
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Make the request
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: options.credentials || 'include',
    });
    
    // Check for authentication errors (401 Unauthorized, 403 Forbidden)
    if ((response.status === 401 || response.status === 403) && !isLoggingOut) {
      await handleTokenExpiry();
      return response; // Return the response so calling code can handle it
    }
    
    return response;
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
};

/**
 * Handle token expiry - logout and redirect to login
 */
const handleTokenExpiry = async () => {
  if (isLoggingOut) return; // Prevent multiple simultaneous logout attempts
  
  isLoggingOut = true;
  
  try {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Store current location for redirect after re-login
    const currentPath = window.location.pathname + window.location.search;
    
    // Show session expired message
    const sessionExpiredMessage = {
      title: 'Session Expired',
      message: 'Your session has expired. Please log in again to continue.',
      type: 'session-expired'
    };
    
    // Store message in sessionStorage (temporary, cleared after reading)
    sessionStorage.setItem('loginMessage', JSON.stringify(sessionExpiredMessage));
    
    // Redirect to login with return URL
    if (currentPath !== '/login' && currentPath !== '/register') {
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    } else {
      window.location.href = '/login';
    }
  } finally {
    // Reset flag after a delay
    setTimeout(() => {
      isLoggingOut = false;
    }, 1000);
  }
};

/**
 * Logout user manually
 */
export const logout = async () => {
  try {
    // Call logout API
    await fetch('/api/v1/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login
    window.location.href = '/login';
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

/**
 * API helper methods for common HTTP methods
 */
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
  
  delete: (url, options = {}) => apiFetch(url, {
    ...options,
    method: 'DELETE',
  }),
};

export default api;

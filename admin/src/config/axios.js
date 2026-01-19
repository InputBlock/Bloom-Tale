import axios from 'axios';

/**
 * Configured Axios instance for admin API requests
 * Uses httpOnly cookies for secure authentication
 * Cookies are automatically sent with withCredentials: true
 */
const adminAxios = axios.create({
  withCredentials: true, // This sends cookies automatically
});

// Response interceptor to handle auth errors
adminAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Redirect to login on auth failure
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default adminAxios;

import axios from 'axios';
import constants from '../utils/constants';
const { AUTH_CONFIG } = constants; 

// Use configurable API URL from constants
const API_URL = constants.API_CONFIG.BASE_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: constants.API_CONFIG.TIMEOUT,
});

// Add request interceptor to attach token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY); 
    
    console.log('=== API REQUEST DEBUG ===');
    console.log('URL:', `${config.baseURL}${config.url}`);
    console.log('Method:', config.method?.toUpperCase());
    console.log('Headers:', config.headers);
    console.log('Token exists:', !!token);
    console.log('Token preview:', token ? `${token.substring(0, 20)}...` : 'null');
    console.log('Request data:', config.data);
    console.log('========================');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set:', config.headers.Authorization?.substring(0, 30) + '...');
    } else {
      console.log('No token available - request will be unauthenticated');
    }
    
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with better error handling
api.interceptors.response.use(
  response => {
    console.log('=== API RESPONSE SUCCESS ===');
    console.log('URL:', response.config.url);
    console.log('Status:', response.status);
    console.log('Method:', response.config.method?.toUpperCase());
    console.log('Response data keys:', response.data ? Object.keys(response.data) : 'no data');
    console.log('============================');
    
    return response;
  },
  error => {
    console.log('=== API RESPONSE ERROR ===');
    console.log('URL:', error.config?.url);
    console.log('Method:', error.config?.method?.toUpperCase());
    console.log('Status:', error.response?.status);
    console.log('Status Text:', error.response?.statusText);
    console.log('Error Message:', error.message);
    console.log('Response Data:', error.response?.data);
    console.log('Request Headers:', error.config?.headers);
    
    // Check if Authorization header was sent
    const authHeader = error.config?.headers?.Authorization;
    console.log('Had Authorization header:', !!authHeader);
    console.log('Auth header preview:', authHeader ? authHeader.substring(0, 30) + '...' : 'none');
    console.log('==========================');
    
    // Handle different error scenarios
    if (error.response?.status === 401) {
      console.log('=== 401 UNAUTHORIZED HANDLING ===');
      console.log('Clearing auth state due to 401');
      
      // Check if this was an auth-related request
      const isAuthRequest = error.config?.url?.includes('/auth/');
      console.log('Was auth request:', isAuthRequest);
      
      localStorage.removeItem(constants.AUTH_CONFIG.TOKEN_KEY);
      
      const currentPath = window.location.pathname;
      console.log('Current path:', currentPath);
      
      // Prevent redirect loops during OAuth2 flow and auth pages
      const authPaths = ['/login', '/register', '/oauth2/redirect', '/forgot-password', '/reset-password'];
      const isAuthPath = authPaths.some(path => currentPath.startsWith(path));
      
      console.log('Is on auth path:', isAuthPath);
      
      if (!isAuthPath) {
        console.log('Redirecting to login due to 401 error');
        sessionStorage.setItem('oauth2_redirect_path', currentPath);
        window.location.href = '/login';
      } else {
        console.log('Already on auth path, not redirecting');
      }
      console.log('=================================');
    } else if (error.response?.status === 403) {
      console.error('Forbidden request - insufficient permissions');
    } else if (error.response?.status >= 500) {
      console.error('Server error - please try again later');
    } else if (!error.response) {
      console.error('Network error - please check your connection');
    }

    // Enhance error object with user-friendly messages
    if (error.response?.status === 401) {
      error.userMessage = constants.ERROR_MESSAGES.UNAUTHORIZED;
    } else if (error.response?.status === 404) {
      error.userMessage = constants.ERROR_MESSAGES.NOT_FOUND;
    } else if (error.response?.status >= 500) {
      error.userMessage = 'Server error. Please try again later.';
    } else if (!error.response) {
      error.userMessage = constants.ERROR_MESSAGES.NETWORK;
    } else {
      error.userMessage = error.response?.data?.message || constants.ERROR_MESSAGES.GENERIC; 
    }

    return Promise.reject(error);
  }
);

export default api;
/**
 * Application Constants for WarrantyHub React Frontend
 * Includes OAuth2 configuration, API settings, error messages, and more
 */

// =============================================================================
// AUTHENTICATION CONFIGURATION
// =============================================================================
export const AUTH_CONFIG = {
  // Token storage keys
  TOKEN_KEY: 'accessToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  USER_KEY: 'user',
  
  // Token expiration buffer (refresh token 5 minutes before actual expiry)
  TOKEN_REFRESH_BUFFER: 5 * 60 * 1000, // 5 minutes in milliseconds
  
  // Authentication endpoints
  ENDPOINTS: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    PROFILE: '/api/auth/profile',
    USER_PROFILE_UPDATE: '/api/users/profile',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  }
};

// =============================================================================
// API CONFIGURATION
// =============================================================================
export const API_CONFIG = {
  // Base URL for API calls
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  
  // Request timeout
  TIMEOUT: 30000, // 30 seconds
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  
  // Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// =============================================================================
// OAUTH2 CONFIGURATION
// =============================================================================
export const OAUTH2_CONFIG = {
  // Google OAuth2 settings
  GOOGLE: {
    CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    AUTHORIZATION_URL: `${API_CONFIG.BASE_URL}/oauth2/authorization/google`,
    SCOPES: ['openid', 'profile', 'email'],
  },
  
  // OAuth2 flow settings
  CALLBACK_PATH: '/oauth2/redirect',
  REDIRECT_PATH_KEY: 'oauth2_redirect_path',
  
  // URL parameters for OAuth2 callback
  URL_PARAMS: {
    TOKEN: 'token',
    REFRESH_TOKEN: 'refreshToken',
    SUCCESS: 'success',
    ERROR: 'error',
    MESSAGE: 'message',
  },
  
  // OAuth2 timeout settings
  CALLBACK_TIMEOUT: 10000, // 10 seconds
  AUTH_STATE_CHECK_INTERVAL: 100, // 100ms
  MAX_AUTH_STATE_ATTEMPTS: 50, // 5 seconds total wait
};

// =============================================================================
// ERROR MESSAGES
// =============================================================================
export const ERROR_MESSAGES = {
  // Authentication errors
  UNAUTHORIZED: 'Your session has expired. Please sign in again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  ACCOUNT_LOCKED: 'Your account has been locked. Please contact support.',
  
  // Network errors
  NETWORK: 'Network error. Please check your connection and try again.',
  TIMEOUT: 'Request timed out. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  
  // Validation errors
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
  
  // Resource errors
  NOT_FOUND: 'The requested resource was not found.',
  ALREADY_EXISTS: 'An account with this email already exists.',
  
  // OAuth2 specific errors
  OAUTH2_FAILED: 'Google authentication failed. Please try again.',
  OAUTH2_TOKEN_MISSING: 'Authentication failed - no token received from Google.',
  OAUTH2_STATE_TIMEOUT: 'Authentication process took too long. Please try again.',
  OAUTH2_CANCELLED: 'Authentication was cancelled. Please try again.',
  OAUTH2_POPUP_BLOCKED: 'Popup was blocked. Please allow popups and try again.',
  
  // Generic fallback
  GENERIC: 'An unexpected error occurred. Please try again.',
};

// =============================================================================
// SUCCESS MESSAGES
// =============================================================================
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully signed in!',
  LOGOUT_SUCCESS: 'Successfully signed out!',
  REGISTER_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_RESET_SENT: 'Password reset link sent to your email!',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully!',
  OAUTH2_SUCCESS: 'Successfully signed in with Google!',
  OAUTH2_REGISTER_SUCCESS: 'Account created successfully with Google!',
};

// =============================================================================
// APPLICATION ROUTES
// =============================================================================
export const ROUTES = {
  // Authentication routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  OAUTH2_REDIRECT: '/oauth2/redirect',
  
  // Main application routes
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  UPDATE_PROFILE: '/profile/edit',
  
  // Device management routes
  DEVICES: '/devices',
  ADD_DEVICE: '/devices/new',
  DEVICE_DETAIL: '/devices/:id',
  EDIT_DEVICE: '/devices/:id/edit',
  
  // Other routes
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
  SERVER_ERROR: '/500',
};

// =============================================================================
// UI CONFIGURATION
// =============================================================================
export const UI_CONFIG = {
  // Loading states
  LOADING_DELAY: 200, // Show loading spinner after 200ms
  
  // Toast notification settings
  TOAST: {
    DURATION: 4000, // 4 seconds
    POSITION: 'top-right',
    SUCCESS_ICON: '✅',
    ERROR_ICON: '❌',
    WARNING_ICON: '⚠️',
    INFO_ICON: 'ℹ️',
  },
  
  // Modal settings
  MODAL: {
    OVERLAY_CLOSE: true,
    ESCAPE_CLOSE: true,
  },
  
  
  // Form settings
  FORM: {
    DEBOUNCE_DELAY: 300, // 300ms debounce for input validation
    AUTO_SAVE_DELAY: 2000, // Auto-save after 2 seconds of inactivity
  },
};

// =============================================================================
// PAGINATION CONFIGURATION
// =============================================================================
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100,
  SHOW_PAGE_SIZE_SELECTOR: true,
  SHOW_QUICK_JUMPER: true,
};


// =============================================================================
// FILE UPLOAD CONFIGURATION
// =============================================================================
export const FILE_CONFIG = {
  // Allowed file types
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ALL: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },

  
  
  // File size limits (in bytes)
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  
  // Upload configuration
  CHUNK_SIZE: 1024 * 1024, // 1MB chunks for large file uploads
  MAX_CONCURRENT_UPLOADS: 3,
};

// =============================================================================
// DEVICE RELATED CONSTANTS
// =============================================================================
export const DEVICE_CONFIG = {
  // Device categories
  CATEGORIES: [
    'Electronics',
    'Appliances', 
    'Automotive',
    'Home & Garden',
    'Sports & Outdoors',
    'Other',
  ],
  
  // Warranty status
  WARRANTY_STATUS: {
    ACTIVE: 'active',
    EXPIRED: 'expired',
    EXPIRING_SOON: 'expiring_soon',
  },
  
  // Notification settings
  NOTIFICATION_DAYS: [7, 14, 30, 60, 90], // Days before warranty expiration
};

// =============================================================================
// DEBUG CONFIGURATION
// =============================================================================
export const DEBUG_CONFIG = {
  // Enable debug mode based on environment
  ENABLED: import.meta.env.VITE_DEBUG_AUTH === 'true' || 
           import.meta.env.NODE_ENV === 'development' || 
           import.meta.env.DEV === true,
  
  // Debug categories
  LOG_API_REQUESTS: true,
  LOG_API_RESPONSES: true,
  LOG_AUTH_STATE: true,
  LOG_OAUTH2_FLOW: true,
  LOG_NAVIGATION: false,
  LOG_COMPONENT_RENDERS: false,
  
  // Console styling
  STYLES: {
    SUCCESS: 'color: #22c55e; font-weight: bold',
    ERROR: 'color: #ef4444; font-weight: bold',
    WARNING: 'color: #f59e0b; font-weight: bold',
    INFO: 'color: #3b82f6; font-weight: bold',
    DEBUG: 'color: #6b7280; font-style: italic',
  },
};

// =============================================================================
// VALIDATION RULES
// =============================================================================
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MAX_LENGTH: 255,
  },
  
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: false,
    REQUIRE_LOWERCASE: false,
    REQUIRE_NUMBERS: false,
    REQUIRE_SPECIAL_CHARS: false,
  },
  
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
    PATTERN: /^[a-zA-Z\s'-]+$/,
  },
  
  DEVICE_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  
  SERIAL_NUMBER: {
    MAX_LENGTH: 50,
  },
};

// =============================================================================
// LOCAL STORAGE KEYS
// =============================================================================
export const STORAGE_KEYS = {
  // Authentication
  ACCESS_TOKEN: AUTH_CONFIG.TOKEN_KEY,
  REFRESH_TOKEN: AUTH_CONFIG.REFRESH_TOKEN_KEY,
  USER_PROFILE: AUTH_CONFIG.USER_KEY,
  
  // OAuth2
  OAUTH2_REDIRECT_PATH: OAUTH2_CONFIG.REDIRECT_PATH_KEY,
  
  // User preferences
  THEME: 'theme',
  LANGUAGE: 'language',
  DASHBOARD_LAYOUT: 'dashboard_layout',
  
  // Application state
  LAST_ACTIVE_TAB: 'last_active_tab',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
};

// =============================================================================
// HTTP STATUS CODES
// =============================================================================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

// =============================================================================
// ENVIRONMENT HELPERS
// =============================================================================
export const ENV = {
  IS_DEVELOPMENT: import.meta.env.NODE_ENV === 'development' || import.meta.env.DEV === true,
  IS_PRODUCTION: import.meta.env.NODE_ENV === 'production' || import.meta.env.PROD === true,
  IS_TEST: import.meta.env.NODE_ENV === 'test',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
export const UTILS = {
  // Format error message for display
  formatErrorMessage: (error) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.message) return error.response.data.message;
    return ERROR_MESSAGES.GENERIC;
  },
  
  // Check if token is expired
  isTokenExpired: (token) => {
    try {
      if (!token) return true;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp && payload.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  },
  
  // Get time until token expires
  getTokenExpiryTime: (token) => {
    try {
      if (!token) return 0;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? payload.exp * 1000 - Date.now() : 0;
    } catch {
      return 0;
    }
  },
  
  // Debug logger
  log: (level, message, ...args) => {
    if (!DEBUG_CONFIG.ENABLED) return;
    
    const style = DEBUG_CONFIG.STYLES[level.toUpperCase()] || '';
    const timestamp = new Date().toLocaleTimeString();
    
    console.log(
      `%c[${timestamp}] ${level.toUpperCase()}: ${message}`,
      style,
      ...args
    );
  },
};

// Export default object containing all constants
export default {
  AUTH_CONFIG,
  API_CONFIG,
  OAUTH2_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROUTES,
  UI_CONFIG,
  PAGINATION_CONFIG,
  FILE_CONFIG,
  DEVICE_CONFIG,
  DEBUG_CONFIG,
  VALIDATION_RULES,
  STORAGE_KEYS,
  HTTP_STATUS,
  ENV,
  UTILS,
};
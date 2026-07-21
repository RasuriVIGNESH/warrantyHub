import axios from 'axios';
import constants from '../utils/constants';
const { AUTH_CONFIG } = constants;

// Use configurable API URL from constants
const API_URL = constants.API_CONFIG.BASE_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: constants.API_CONFIG.TIMEOUT,
});

// Attach the JWT (if present) to every outgoing request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

function clearSession() {
  localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
  localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
}

// A single in-flight refresh call is shared by every request that hits a 401
// at the same time (e.g. a page firing several API calls at once), so we
// never send multiple concurrent refresh-token requests to the backend.
let refreshPromise = null;

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  // Plain axios (not the `api` instance) so this call never carries a stale
  // Authorization header and never re-enters this same response interceptor.
  const response = await axios.post(
    `${API_URL}${AUTH_CONFIG.ENDPOINTS.REFRESH_TOKEN}`,
    { refreshToken }
  );

  const { token, refreshToken: newRefreshToken } = response.data;
  localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
  // The refresh endpoint reissues the access token only - the refresh token
  // itself is normally unchanged - but store it if the backend ever does rotate it.
  if (newRefreshToken) {
    localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, newRefreshToken);
  }
  return token;
}

// Response interceptor:
// - On 401 from a protected endpoint, silently try to refresh the access
//   token and retry the original request exactly once.
// - If refresh also fails, clear the session and let the error propagate.
//   Routing (redirect to /login) is left entirely to AuthContext + React
//   Router (ProtectedRoute / PublicRoute) reacting to isAuthenticated
//   becoming false - never a manual window.location redirect here.
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest?.url?.includes('/api/auth/');

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        refreshPromise = refreshPromise || refreshAccessToken();
        const newToken = await refreshPromise;
        refreshPromise = null;

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        refreshPromise = null;
        clearSession();
        return Promise.reject(error);
      }
    }

    if (error.response?.status === 401) {
      // Either this *was* the refresh/login/logout call itself, or we already
      // retried once and it still failed - the session is no longer valid.
      clearSession();
    }

    // Attach a user-friendly message for UI components to display
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
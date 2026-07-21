import api from './api';

// Endpoints exactly as documented in the WarrantyHub swagger doc (Authentication tag)
const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',                   // POST
  REGISTER: '/api/auth/register',             // POST
  LOGOUT: '/api/auth/logout',                 // POST
  REFRESH_TOKEN: '/api/auth/refresh-token',   // POST
  PROFILE: '/api/auth/profile',               // GET  (AuthController)
  USER_PROFILE_UPDATE: '/api/users/profile',  // PUT  (UserController)
  FORGOT_PASSWORD: '/api/auth/forgot-password', // POST
  RESET_PASSWORD: '/api/auth/reset-password',   // POST
};

class AuthService {
  // POST /api/auth/login
  async login(email, password) {
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, { email, password });
    if (!response.data.token) {
      throw new Error('No authentication token received from server');
    }
    return response.data; // { success, user, token, refreshToken }
  }

  // POST /api/auth/register
  async register(userData) {
    // userData: { name, email, password }
    const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
    return response.data; // { success, user, token, refreshToken }
  }

  // POST /api/auth/logout
  async logout() {
    try {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Continue with local logout even if the server request fails
      console.warn('Server logout failed, clearing local session anyway:', error.message);
    }
  }

  // POST /api/auth/refresh-token
  async refreshToken(refreshToken) {
    const response = await api.post(AUTH_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
    return response.data; // { success, token, refreshToken }
  }

  // GET /api/auth/profile
  async getProfile() {
    const response = await api.get(AUTH_ENDPOINTS.PROFILE);
    return response.data; // UserProfileDTO
  }

  // PUT /api/users/profile
  async updateProfile(profileData) {
    // profileData: { name, emailNotifications, warrantyExpirationReminders }
    const response = await api.put(AUTH_ENDPOINTS.USER_PROFILE_UPDATE, profileData);
    return response.data; // UserProfileDTO
  }

  // POST /api/auth/forgot-password
  async forgotPassword(email) {
    const response = await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
    return response.data; // ApiResponse
  }

  // POST /api/auth/reset-password
  async resetPassword(token, password) {
    const response = await api.post(AUTH_ENDPOINTS.RESET_PASSWORD, { token, password });
    return response.data; // ApiResponse
  }
}

export default new AuthService();
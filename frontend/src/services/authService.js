import api from './api';
import { AUTH_CONFIG } from '../utils/constants';

const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  REFRESH_TOKEN: '/api/auth/refresh-token',
  PROFILE: '/api/auth/profile',              // GET profile - AuthController
  USER_PROFILE_UPDATE: '/api/users/profile', // PUT profile - UserController  
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
}

class AuthService {
  async login(email, password) {
    console.log('AuthService.login() - Attempting login with:', { email });
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, { email, password });
    console.log('AuthService.login() - Response received:', {
      hasToken: !!response.data.token,
      dataKeys: Object.keys(response.data)
    });
    
    if (response.data.token) {
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, response.data.token);
      console.log('AuthService.login() - Token stored successfully');
    } else {
      console.error('AuthService.login() - No token in response:', response.data);
      throw new Error('No authentication token received from server');
    }
    
    return response.data;
  }

  async logout() {
    try {
      console.log('AuthService.logout() - Sending logout request');
      await api.post(AUTH_ENDPOINTS.LOGOUT);
      console.log('AuthService.logout() - Server logout successful');
    } catch (error) {
      console.warn('AuthService.logout() - Server logout failed:', error.message);
      // Continue with local logout even if server request fails
    } finally {
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      console.log('AuthService.logout() - Local token cleared');
    }
  } 
  
  async register(userData) {
    console.log('AuthService.register() - Attempting registration');
    const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
    console.log('AuthService.register() - Registration successful');
    return response.data;
  }

  async getProfile() {
    console.log('AuthService.getProfile() - Making request to:', AUTH_ENDPOINTS.PROFILE);
    console.log('AuthService.getProfile() - Full URL will be:', api.defaults.baseURL + AUTH_ENDPOINTS.PROFILE);
    
    const token = this.getToken();
    console.log('AuthService.getProfile() - Token exists:', !!token);
    console.log('AuthService.getProfile() - Token preview:', token ? token.substring(0, 20) + '...' : 'null');
    
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    try {
      const response = await api.get(AUTH_ENDPOINTS.PROFILE);
      console.log('AuthService.getProfile() - Response received:', {
        status: response.status,
        dataKeys: response.data ? Object.keys(response.data) : 'null',
        userEmail: response.data?.email || 'no email'
      });
      return response.data;
    } catch (error) {
      console.error('AuthService.getProfile() - Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        hasToken: !!token
      });
      throw error;
    }
  }

  async updateProfile(profileData) {
    console.log('AuthService.updateProfile() - Updating profile with:', Object.keys(profileData));
    const response = await api.put(AUTH_ENDPOINTS.USER_PROFILE_UPDATE, profileData);
    console.log('AuthService.updateProfile() - Profile updated successfully');
    return response.data;
  }

  async forgotPassword(email) {
    console.log('AuthService.forgotPassword() - Requesting password reset for:', email);
    const response = await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
    console.log('AuthService.forgotPassword() - Password reset email sent');
    return response.data;
  }

  async resetPassword(token, password) {
    console.log('AuthService.resetPassword() - Resetting password with token');
    const response = await api.post(AUTH_ENDPOINTS.RESET_PASSWORD, { token, password });
    console.log('AuthService.resetPassword() - Password reset successful');
    return response.data;
  }

  getToken() {
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  }

  isAuthenticated() {
    const token = this.getToken();
    if (!token) {
      console.log('AuthService.isAuthenticated() - No token found');
      return false;
    }
    
    try {
      // Basic JWT validation - check if token is expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        console.log('AuthService.isAuthenticated() - Token is expired');
        localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
        return false;
      }
      
      console.log('AuthService.isAuthenticated() - Token is valid');
      return true;
    } catch (error) {
      console.error('AuthService.isAuthenticated() - Invalid token format:', error);
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      return false;
    }
  }

  // Debug method to inspect token
  inspectToken() {
    const token = this.getToken();
    if (!token) {
      console.log('No token to inspect');
      return null;
    }
    
    try {
      const parts = token.split('.');
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      
      console.log('Token inspection:', {
        header,
        payload: {
          ...payload,
          exp: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'no expiry',
          iat: payload.iat ? new Date(payload.iat * 1000).toISOString() : 'no issued time'
        },
        isExpired: payload.exp ? payload.exp < Date.now() / 1000 : false
      });
      
      return { header, payload };
    } catch (error) {
      console.error('Failed to inspect token:', error);
      return null;
    }
  }
}

export default new AuthService();
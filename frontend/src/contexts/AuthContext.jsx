import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { AUTH_CONFIG } from '../utils/constants';
import AuthService from '../services/authService';

// Create and export the AuthContext
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear authentication state
  const clearAuthState = useCallback(() => {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    setUser(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // Load user profile from token
  const loadUserFromToken = useCallback(async (retryCount = 0) => {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);
      const userProfile = await AuthService.getProfile();
      setUser(userProfile);
      setError(null);
      return true;
    } catch (err) {
      if (err.response?.status === 401) {
        clearAuthState();
        return false;
      }
      if (retryCount === 0 && (!err.response || err.response.status >= 500)) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return loadUserFromToken(1);
      }
      setError(err.message || 'Failed to load user profile');
      clearAuthState();
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthState]);

  // Login with email and password
  const login = useCallback(async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await AuthService.login(email, password);
      if (data.token) {
        localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, data.token);
        const success = await loadUserFromToken();
        if (!success) {
          throw new Error('Failed to load user profile after login');
        }
      }
      return data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadUserFromToken]);

  // Logout
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await AuthService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuthState();
    }
  }, [clearAuthState]);

  // Login with OAuth2 token
  const loginWithToken = useCallback(async (token) => {
    try {
      setIsLoading(true);
      setError(null);
      if (!token || token.trim() === '') {
        throw new Error('Invalid token provided');
      }
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
      const success = await loadUserFromToken();
      if (!success) {
        throw new Error('Failed to authenticate with provided token');
      }
      return true;
    } catch (err) {
      setError(err.message || 'OAuth2 authentication failed');
      clearAuthState();
      throw err;
    }
  }, [loadUserFromToken, clearAuthState]);

  // Register a new user
  const registerUser = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      const responseData = await AuthService.register(userData);
      return responseData;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh user profile
  const refreshUser = useCallback(async () => {
    return loadUserFromToken();
  }, [loadUserFromToken]);

  // Initialize authentication state on mount
  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  // ✨ FIX: This value object is now memoized to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    isLoading,
    error,
    login,
    logout,
    loginWithToken,
    refreshUser,
    isAuthenticated: !!user && !error,
    clearError: () => setError(null),
    registerUser,
    // ✨ FIX: The dependency array includes all values used to create the object
  }), [user, isLoading, error, login, logout, loginWithToken, refreshUser, registerUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
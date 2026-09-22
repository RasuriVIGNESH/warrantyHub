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

  // Store both tokens the same way everywhere they're received: from
  // email/password login, from register (which now auto-logs-in, since the
  // backend returns the same {token, refreshToken} shape as login), and
  // from the Google OAuth2 callback.
  const storeTokens = useCallback(({ token, refreshToken }) => {
    if (token) localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
    if (refreshToken) localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, refreshToken);
  }, []);

  // Clear authentication state (both tokens - a stale refresh token left
  // behind after logout would let a "logged out" tab silently get a new
  // access token on its next 401).
  const clearAuthState = useCallback(() => {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
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
      storeTokens(data); // stores both token + refreshToken
      const success = await loadUserFromToken();
      if (!success) {
        throw new Error('Failed to load user profile after login');
      }
      return data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadUserFromToken, storeTokens]);

  // Logout
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      // Server-side this only deletes the refresh token; the access token
      // just expires naturally. We still clear both locally regardless of
      // whether the request succeeds.
      await AuthService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuthState();
    }
  }, [clearAuthState]);

  // Login with an already-issued token pair (used by the Google OAuth2 callback)
  const loginWithToken = useCallback(async (token, refreshToken) => {
    try {
      setIsLoading(true);
      setError(null);
      if (!token || token.trim() === '') {
        throw new Error('Invalid token provided');
      }
      storeTokens({ token, refreshToken });
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
  }, [loadUserFromToken, clearAuthState, storeTokens]);

  // Register a new user.
  // The backend now returns the same { success, user, token, refreshToken }
  // shape as login - registration auto-logs the user in, no separate login
  // step required.
  const registerUser = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await AuthService.register(userData);
      storeTokens(data);
      const success = await loadUserFromToken();
      if (!success) {
        throw new Error('Failed to load user profile after registration');
      }
      return data;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadUserFromToken, storeTokens]);

  // Refresh user profile
  const refreshUser = useCallback(async () => {
    return loadUserFromToken();
  }, [loadUserFromToken]);

  // Forgot / reset password - thin wrappers around AuthService so the pages
  // can call these through the same useAuth() surface as everything else.
  const forgotPassword = useCallback(async (email) => {
    const data = await AuthService.forgotPassword(email);
    return data?.success ?? true;
  }, []);

  const resetPassword = useCallback(async (token, password) => {
    const data = await AuthService.resetPassword(token, password);
    return data?.success ?? true;
  }, []);

  // Initialize authentication state on mount
  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

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
    forgotPassword,
    resetPassword,
  }), [user, isLoading, error, login, logout, loginWithToken, refreshUser, registerUser, forgotPassword, resetPassword]);

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
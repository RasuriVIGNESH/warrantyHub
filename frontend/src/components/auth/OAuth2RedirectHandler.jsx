import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Simplified OAuth2 Redirect Handler
 * Handles the callback from Google OAuth2 and processes the JWT token
 * Matches the Spring Boot OAuth2AuthenticationSuccessHandler implementation
 */
export function OAuth2RedirectHandler() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [message, setMessage] = useState('Processing your authentication...');

  useEffect(() => {
    const handleOAuth2Callback = async () => {
      try {
        // Extract parameters from URL
        const token = searchParams.get('token');
        const refreshToken = searchParams.get('refreshToken');
        const success = searchParams.get('success');
        const error = searchParams.get('error');
        const errorMessage = searchParams.get('message');

        console.log('OAuth2 callback received:', {
          hasToken: !!token,
          hasRefreshToken: !!refreshToken,
          success,
          error,
          errorMessage
        });

        // Handle OAuth2 errors
        if (error) {
          const displayMessage = errorMessage || 'Google authentication failed. Please try again.';
          console.error('OAuth2 Error:', error, errorMessage);
          
          setStatus('error');
          setMessage(displayMessage);
          toast.error(displayMessage);
          
          // Redirect to login after showing error
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 3000);
          return;
        }

        // Handle missing token
        if (!token || success !== 'true') {
          const msg = 'Authentication failed - no valid token received from Google.';
          console.error('OAuth2 Error: Missing or invalid token');
          
          setStatus('error');
          setMessage(msg);
          toast.error(msg);
          
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 3000);
          return;
        }

        console.log('Valid OAuth2 token received, processing...');
        setMessage('Authentication successful! Setting up your account...');

        // Store refresh token if provided
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
          console.log('Refresh token stored');
        }

        // Use the loginWithToken method from AuthContext
        await loginWithToken(token);

        setStatus('success');
        setMessage('Successfully signed in! Redirecting to dashboard...');
        toast.success('Successfully signed in with Google!');

        // Get the stored redirect path or default to dashboard
        const redirectPath = sessionStorage.getItem('oauth2_redirect_path') || '/dashboard';
        sessionStorage.removeItem('oauth2_redirect_path');

        console.log('OAuth2 authentication complete, redirecting to:', redirectPath);

        // Short delay to show success message
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 1500);

      } catch (error) {
        console.error('OAuth2 callback processing error:', error);
        
        let errorMessage = 'Authentication failed. Please try again.';
        if (error.message?.includes('401')) {
          errorMessage = 'Invalid authentication token. Please try signing in again.';
        } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        }

        setStatus('error');
        setMessage(errorMessage);
        toast.error(errorMessage);

        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    handleOAuth2Callback();
  }, [searchParams, navigate, loginWithToken]);

  // Render different states
  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Authentication Successful!
            </h3>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Authentication Failed
            </h3>
            <p className="text-sm text-gray-600 mb-4">{message}</p>
            <p className="text-xs text-gray-500">
              Redirecting to login page...
            </p>
          </div>
        );

      default: // processing
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <svg
                className="animate-spin h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Completing Authentication
            </h3>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white shadow rounded-lg px-6 py-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Layout } from './components/layout/Layout';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './components/ErrorFallback';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Devices = lazy(() => import('./pages/Devices').then(m => ({ default: m.Devices })));
const AddDevice = lazy(() => import('./pages/AddDevice').then(m => ({ default: m.AddDevice })));
const DeviceDetail = lazy(() => import('./pages/DeviceDetail').then(m => ({ default: m.DeviceDetail })));
const Login = lazy(() => import('./pages/auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/auth/Register').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword').then(m => ({ default: m.ResetPassword })));
const OAuth2RedirectHandler = lazy(() => import('./pages/auth/OAuth2RedirectHandler').then(m => ({ default: m.OAuth2RedirectHandler })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));
const UpdateProfile = lazy(() => import('./pages/UpdateProfile').then(m => ({ default: m.UpdateProfile })));
const Claims = lazy(() => import('./pages/Claims').then(m => ({ default: m.Claims })));
const Reports = lazy(() => import('./pages/Reports').then(m => ({ default: m.Reports })));
const Household = lazy(() => import('./pages/Household').then(m => ({ default: m.Household })));

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60 * 1000,       // data is fresh for 60s - avoids refetching on every nav
      gcTime: 5 * 60 * 1000,      // keep cache around for 5 min
    },
  },
});

// 🔽 Route guards. Both are only ever used here in App.jsx (single use each),
// so - consistent with the "one file per page/usage" cleanup - they live
// here instead of as separate files under components/auth/.

// Gate for pages that require login (Dashboard, Devices, etc.)
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Gate for pages that should only be visible when logged OUT
// (Landing page, Login, Register, etc.) - bounces straight to /dashboard
// if a valid session already exists.
function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page (public marketing page at root) */}
        <Route path="/" element={
          <PublicRoute>
            <Suspense fallback={<LoadingScreen />}>
              <LandingPage />
            </Suspense>
          </PublicRoute>
        } />

        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Suspense fallback={<LoadingScreen />}>
              <Login />
            </Suspense>
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Suspense fallback={<LoadingScreen />}>
              <Register />
            </Suspense>
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <Suspense fallback={<LoadingScreen />}>
              <ForgotPassword />
            </Suspense>
          </PublicRoute>
        } />
        <Route path="/reset-password" element={
          <PublicRoute>
            <Suspense fallback={<LoadingScreen />}>
              <ResetPassword />
            </Suspense>
          </PublicRoute>
        } />

        {/* OAuth2 Redirect Route - This handles the redirect from Google */}
        <Route path="/oauth2/redirect" element={
          <Suspense fallback={<LoadingScreen />}>
            <OAuth2RedirectHandler />
          </Suspense>
        } />
        {/* Protected Routes */}
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={
            <Suspense fallback={<LoadingScreen />}>
              <Dashboard />
            </Suspense>
          } />
          <Route path="/devices" element={
            <Suspense fallback={<LoadingScreen />}>
              <Devices />
            </Suspense>
          } />
          <Route path="/devices/new" element={
            <Suspense fallback={<LoadingScreen />}>
              <AddDevice />
            </Suspense>
          } />
          <Route path="/devices/:id" element={
            <Suspense fallback={<LoadingScreen />}>
              <DeviceDetail />
            </Suspense>
          } />
          <Route path="/profile" element={
            <Suspense fallback={<LoadingScreen />}>
              <Profile />
            </Suspense>
          } />
          <Route path="/profile/edit" element={
            <Suspense fallback={<LoadingScreen />}>
              <UpdateProfile />
            </Suspense>
          } />
          <Route path="/claims" element={
            <Suspense fallback={<LoadingScreen />}>
              <Claims />
            </Suspense>
          } />
          <Route path="/reports" element={
            <Suspense fallback={<LoadingScreen />}>
              <Reports />
            </Suspense>
          } />
          <Route path="/household" element={
            <Suspense fallback={<LoadingScreen />}>
              <Household />
            </Suspense>
          } />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={
          <Suspense fallback={<LoadingScreen />}>
            <NotFound />
          </Suspense>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <AppRoutes />
            <Toaster position="top-right" />
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

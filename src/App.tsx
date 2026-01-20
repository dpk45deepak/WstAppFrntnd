// src/App.tsx
import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { useAuth } from './hooks/useAuth';
// import { useToast } from './hooks/useToast';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import PageNotFound from './pages/public/PageNotFound';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/public/LandingPage'));
const LoginPage = lazy(() => import('./pages/public/Login'));
const RegisterPage = lazy(() => import('./pages/public/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/public/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/public/ResetPasswordPage'));

const DashboardPage = lazy(() => import('./pages/protected/Dashboard'));
const SchedulePickupPage = lazy(() => import('./pages/protected/SchedulePickupPage'));
const PickupListPage = lazy(() => import('./pages/protected/SchedulePickupPage'));
const PickupDetailsPage = lazy(() => import('./pages/protected/SchedulePickupPage'));
const ProfilePage = lazy(() => import('./pages/protected/SchedulePickupPage'));
const SettingsPage = lazy(() => import('./pages/protected/SchedulePickupPage'));
const NotificationsPage = lazy(() => import('./pages/protected/SchedulePickupPage'));
const PaymentPage = lazy(() => import('./pages/protected/SchedulePickupPage'));

// Driver-specific pages
const DriverDashboardPage = lazy(() => import('./pages/driver/DriverDashboardPage'));
const AvailablePickupsPage = lazy(() => import('./pages/driver/AvailablePickupsPage'));
const DriverPickupsPage = lazy(() => import('./pages/driver/DriverPickupsPage'));
const DriverProfilePage = lazy(() => import('./pages/driver/DriverProfilePage'));
const EarningsPage = lazy(() => import('./pages/driver/EarningsPage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboard'));
const UsersManagementPage = lazy(() => import('./pages/admin/UsersManagementPage'));
const PickupsManagementPage = lazy(() => import('./pages/admin/PickupsManagementPage'));
const DriversManagementPage = lazy(() => import('./pages/admin/DriversManagementPage'));
const ReportsPage = lazy(() => import('./pages/admin/ReportPage'));


// import the css for app file
import "./App.css";

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

// Route wrapper for authentication
const AppRoutes = () => {
  const { user, isLoading } = useAuth();
  // const { showToast } = useToast();
  // Log user info for debugging
  // console.log('User in AppRoutes:', user);
  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={
        user ? <Navigate to="/dashboard" replace /> : <LoginPage />
      } />
      <Route path="/register" element={
        user ? <Navigate to="/dashboard" replace /> : <RegisterPage />
      } />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Protected Routes - Regular Users */}
      <Route element={<ProtectedRoute allowedRoles={['user', 'driver', 'admin']} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      {/* User-specific Pickup Routes */}
      <Route element={<ProtectedRoute allowedRoles={['user']} />}>
        <Route path="/schedule-pickup" element={<SchedulePickupPage />} />
        <Route path="/pickups" element={<PickupListPage />} />
        <Route path="/pickups/:id" element={<PickupDetailsPage />} />
        <Route path="/payment/:pickupId" element={<PaymentPage />} />
      </Route>

      {/* Driver Routes */}
      <Route element={<ProtectedRoute allowedRoles={['driver']} />}>
        <Route path="/driver" element={<DriverDashboardPage />} />
        <Route path="/driver/pickups" element={<DriverPickupsPage />} />
        <Route path="/driver/available" element={<AvailablePickupsPage />} />
        <Route path="/driver/profile" element={<DriverProfilePage />} />
        <Route path="/driver/earnings" element={<EarningsPage />} />
        <Route path="/driver/pickup/:id" element={<PickupDetailsPage />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<UsersManagementPage />} />
        <Route path="/admin/pickups" element={<PickupsManagementPage />} />
        <Route path="/admin/drivers" element={<DriversManagementPage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
      </Route>

      {/* Catch-all route for authenticated users */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

// Initialize analytics and error tracking
const AppInitializer = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Initialize analytics
    if (import.meta.env.REACT_APP_GA_MEASUREMENT_ID) {
      import('./utils/analytics').then(({ initAnalytics, trackPageView }) => {
        initAnalytics();

        // Track page views
        const path = window.location.pathname + window.location.search;
        trackPageView(path);
      });
    }

    // Initialize error tracking
    // if (import.meta.env.REACT_APP_SENTRY_DSN) {
    //   import('./utils/errorTracking').then(({ initErrorTracking }) => {
    //     initErrorTracking();
    //   });
    // }

    // Initialize socket connection if user is authenticated
    if (user) {
      import('./services/socket').then(({ default: socketService }) => {
        const token = localStorage.getItem('wstapp_token');
        if (token) {
          socketService.connect(token);
        }
      });
    }

    // Check for service worker (PWA support)
    if ('serviceWorker' in navigator && import.meta.env.MODE === 'production') {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, [user]);

  return null;
};

// Main App Component
const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <AppInitializer />
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <AppRoutes />
            </Suspense>
          </Layout>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
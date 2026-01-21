// src/components/common/PublicRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

interface PublicRouteProps {
  restrictAuthenticated?: boolean; // If true, authenticated users are redirected
}

const PublicRoute = ({ restrictAuthenticated = false }: PublicRouteProps) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If route should be restricted to non-authenticated users and user is logged in
  if (restrictAuthenticated && isAuthenticated && user) {
    // Redirect based on user role
    if (user.role === 'driver') {
      return <Navigate to="/driver" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;

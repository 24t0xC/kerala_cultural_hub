import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  allowedRoles = [],
  redirectTo = '/login',
  loadingComponent = null 
}) => {
  const { user, userProfile, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return loadingComponent || (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    const currentUrl = window.location.pathname + window.location.search;
    return <Navigate to={`/login-register?redirect=${encodeURIComponent(currentUrl)}`} replace />;
  }

  // Get user role from profile or user metadata
  const userRole = userProfile?.role || user?.user_metadata?.role || 'user';

  // Check role-based access
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
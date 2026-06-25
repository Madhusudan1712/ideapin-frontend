import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../common/loading/Loading';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    // Redirect to login page and save the current location they were trying to access 
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If children exists, render it; otherwise render nested Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;

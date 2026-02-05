import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUserAddress } from '../../services/addressService';
import LoadingSpinner from '../UI/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAddress?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresAddress = false,
  redirectTo = '/login' 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [addressLoading, setAddressLoading] = React.useState(false);
  const [hasAddress, setHasAddress] = React.useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if address is required and exists
  React.useEffect(() => {
    if (requiresAddress && user) {
      setAddressLoading(true);
      getUserAddress(user.id).then(address => {
        setHasAddress(!!address);
        setAddressLoading(false);
      });
    }
  }, [requiresAddress, user]);

  if (requiresAddress) {
    if (addressLoading) {
      return <LoadingSpinner />;
    }
    
    if (!hasAddress) {
      return <Navigate to="/address" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
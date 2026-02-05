import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import OTPLogin from './components/Auth/OTPLogin';
import AddressSelector from './components/Address/AddressSelector';
import ProductsHome from './components/Customer/ProductsHome';
import Cart from './components/Customer/Cart';
import TrackOrders from './components/Customer/TrackOrders';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, show login
  if (!user) {
    return <OTPLogin />;
  }

  return (
    <Routes>
      <Route path="/address" element={<AddressSelector />} />
      <Route 
        path="/home" 
        element={
          <ProtectedRoute requiresAddress={true}>
            <ProductsHome />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cart" 
        element={
          <ProtectedRoute requiresAddress={true}>
            <Cart />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/track" 
        element={
          <ProtectedRoute requiresAddress={true}>
            <TrackOrders />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<AddressSelector />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

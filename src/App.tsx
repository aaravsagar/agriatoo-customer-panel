import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import GoogleLogin from './components/Auth/GoogleLogin';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import MobileBottomNav from './components/Layout/MobileBottomNav';
import LoadingSpinner from './components/UI/LoadingSpinner';
import HomePage from './components/Customer/HomePage';
import ProductDetailsPage from './components/Customer/ProductDetailsPage';
import Cart from './components/Customer/Cart';
import MyOrders from './components/Customer/MyOrders';
import Profile from './components/Customer/Profile';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ReturnPolicy from './pages/ReturnPolicy';
import RefundPolicy from './pages/RefundPolicy';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <GoogleLogin />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:productId" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      <MobileBottomNav />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        
        {/* Protected routes */}
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

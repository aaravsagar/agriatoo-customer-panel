import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-green-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-green-800 font-bold text-xl">A</span>
              </div>
              <span className="text-xl font-bold">AGRIATOO</span>
            </div>
            <p className="text-green-200 mb-4">
              Your trusted partner for agricultural products. Connecting farmers with quality fertilizers, 
              pesticides, seeds, and tools from verified sellers across India.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Pan India Delivery</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-green-200 hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/orders" className="text-green-200 hover:text-white transition-colors">My Orders</Link></li>
              <li><Link to="/cart" className="text-green-200 hover:text-white transition-colors">Shopping Cart</Link></li>
              <li><Link to="/profile" className="text-green-200 hover:text-white transition-colors">My Profile</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Policies</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-green-200 hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-green-200 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/return-policy" className="text-green-200 hover:text-white transition-colors">Return Policy</Link></li>
              <li><Link to="/refund-policy" className="text-green-200 hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-green-700">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+91-9999-AGRI-TOO</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">support@agriatoo.com</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Service Areas</h3>
            <p className="text-green-200 text-sm">
              Currently serving Gujarat with plans to expand across India. 
              Quality agricultural products delivered to your doorstep.
            </p>
          </div>
        </div>

        <div className="border-t border-green-700 pt-8 mt-8 text-center">
          <p className="text-green-200">
            &copy; 2024 AGRIATOO. All rights reserved. Empowering Indian Agriculture.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '../components/UI/Logo';

const RefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center text-green-600 hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <Logo size="md" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund Policy</h1>
            <p className="text-gray-600">Last updated: December 2024</p>
          </div>

          <div className="prose prose-green max-w-none">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Refund Eligibility</h2>
              <p className="text-gray-700 leading-relaxed">
                Refunds are available for orders that meet our return policy criteria. Items must be returned within 7 days of delivery in original condition and packaging.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Refund Processing Time</h2>
              <p className="text-gray-700 leading-relaxed">
                Once your return is received and inspected, we will send you an email notification about the approval or rejection of your refund. Approved refunds will be processed within 5-7 business days.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Refund Methods</h2>
              <p className="text-gray-700 leading-relaxed">
                For Cash on Delivery (COD) orders, refunds will be processed via bank transfer to your provided account details. You will need to provide your bank account information for the refund process.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Partial Refunds</h2>
              <p className="text-gray-700 leading-relaxed">
                Partial refunds may be granted for items that are returned in used condition, damaged by customer, or missing parts for reasons not due to our error.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Non-Refundable Items</h2>
              <p className="text-gray-700 leading-relaxed">
                Certain items are non-refundable including perishable goods, opened fertilizers or pesticides, custom-mixed products, and items damaged due to misuse or normal wear.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Shipping Costs</h2>
              <p className="text-gray-700 leading-relaxed">
                Original shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund unless the return is due to our error.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Damaged or Defective Items</h2>
              <p className="text-gray-700 leading-relaxed">
                If you received a damaged or defective item, we will provide a full refund including original shipping costs. Please report such issues within 24 hours of delivery.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Refund Disputes</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any concerns about your refund, please contact our customer service team. We are committed to resolving all refund disputes fairly and promptly.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              For refund requests or questions, contact us at{' '}
              <a href="mailto:support@agriatoo.com" className="text-green-600 hover:text-green-700">
                support@agriatoo.com
              </a>{' '}
              or call{' '}
              <a href="tel:+919999274486" className="text-green-600 hover:text-green-700">
                +91-9999-AGRI-TOO
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;

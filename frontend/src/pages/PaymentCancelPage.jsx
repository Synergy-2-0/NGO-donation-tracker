import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiXCircle, 
  FiArrowLeft, 
  FiRefreshCcw, 
  FiHelpCircle,
  FiMessageCircle,
  FiShoppingBag,
  FiClock,
  FiAlertTriangle
} from 'react-icons/fi';

const PaymentCancelPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 mb-8">
        <div className="bg-gradient-to-br from-red-500 to-rose-600 px-8 py-12 text-center relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-64 h-64 rounded-full bg-white blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 rounded-full bg-white blur-2xl animate-pulse delay-700"></div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-full mb-6 border border-white/30">
              <FiXCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
              Payment Cancelled
            </h1>
            <p className="text-rose-50 text-lg max-w-md mx-auto leading-relaxed">
              Your transaction has been cancelled. No funds have been deducted from your account.
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Context Card */}
            <div className="space-y-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Troubleshooting</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                    <FiAlertTriangle className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Common Issues</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Session timeout, incorrect card details, or insufficient funds can lead to cancellation.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                    <FiHelpCircle className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Still facing issues?</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Our support team is available 24/7 to help you complete your contribution.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Options */}
            <div className="space-y-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Quick Actions</h2>
              <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100 relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                    <FiRefreshCcw className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Try Again?</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    You can restart your donation process from the marketplace.
                  </p>
                  <Link 
                    to="/marketplace" 
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Return to Marketplace
                    <FiShoppingBag className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row gap-4">
            <Link 
              to="/dashboard" 
              className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FiArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>
            <button 
              className="flex-1 bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 px-8 rounded-2xl border-2 border-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Contact Support
              <FiMessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Alternative Support */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
            <FiClock className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">Check Donation History</h4>
            <p className="text-gray-500 text-sm">Sometimes it takes a moment to update.</p>
          </div>
        </div>
        <Link 
          to="/donations" 
          className="px-6 py-2.5 bg-gray-900 hover:bg-black rounded-xl text-white text-sm font-bold transition-all"
        >
          View History
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancelPage;

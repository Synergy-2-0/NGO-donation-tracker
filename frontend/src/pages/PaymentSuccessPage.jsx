import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCheckCircle, FiDownload, FiShare2, FiHeart, FiArrowRight, 
  FiExternalLink, FiShield, FiCalendar, FiAward, FiGlobe, FiMapPin, FiPrinter
} from 'react-icons/fi';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('transaction_id');
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const receiptRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    if (transactionId) {
      api.post(`/api/finance/payhere/verify/${transactionId}`)
        .then(() => {
          return api.get(`/api/finance/transactions/${transactionId}`);
        })
        .then(res => setTransaction(res.data))
        .catch(err => console.error('Error verifying/fetching transaction:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [transactionId]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = (platform) => {
    const campaignTitle = transaction?.campaignId?.title || 'a great cause';
    const amount = transaction ? `${transaction.currency} ${transaction.amount.toLocaleString()}` : '';
    const text = `I just donated ${amount} to "${campaignTitle}" on TrustFund! My contribution is helping transform lives. Join me in making a difference!`;
    const url = window.location.origin + (transaction?.campaignId?._id ? `/causes/${transaction.campaignId._id}` : '/marketplace');
    
    if (navigator.share) {
        navigator.share({ title: 'My Donation on TrustFund', text, url }).catch(() => {
            manualShare(platform, text, url);
        });
    } else {
        manualShare(platform, text, url);
    }
  };

  const manualShare = (platform, text, url) => {
    let shareUrl = '';
    if (platform === 'Twitter') shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    if (platform === 'Facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    if (platform === 'LinkedIn') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    
    if (shareUrl) {
        window.open(shareUrl, 'share', 'width=600,height=500,left=200,top=100');
    }
  };

  if (loading) return <LoadingSpinner message="Verifying contribution integrity..." />;

  const amount = transaction?.amount?.toLocaleString() || '0';
  const campaignTitle = transaction?.campaignId?.title || 'Emergency Humanitarian Fund';

  return (
    <>
      <div className="min-h-screen bg-[#F8F9FA] pt-24 pb-20 px-6 font-sans no-print-section selection:bg-tf-primary/20">
        <div className="max-w-2xl mx-auto space-y-12 animate-soft">
          
          {/* Minimalist Success Card */}
          <div className="bg-white rounded-[2rem] p-12 md:p-16 border border-slate-200/60 shadow-[0_20px_40px_rgba(0,0,0,0.03)] text-center space-y-10">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-slate-900/10">
                  <FiCheckCircle size={40} />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Contribution <span className="text-tf-primary">Verified.</span></h1>
              <p className="text-sm font-medium text-slate-400 max-w-sm mx-auto leading-relaxed">Your humanitarian capital has been securely mobilized and allocated to provide direct mission support.</p>
            </div>

            <div className="h-px bg-slate-100 flex items-center justify-center">
               <span className="bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Audit Registry Node</span>
            </div>

            <div className="space-y-6">
               <div className="flex justify-between items-center px-4">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-left">Designated Mission</p>
                  <p className="text-sm font-black text-slate-900 italic text-right max-w-[60%] truncate">{campaignTitle}</p>
               </div>
               <div className="flex justify-between items-center px-4">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-left">Asset Volume</p>
                  <p className="text-2xl font-black text-slate-900 italic tracking-tighter text-right">
                    <span className="text-[10px] font-black text-tf-primary uppercase mr-2">{transaction?.currency || 'LKR'}</span>
                    {amount}
                  </p>
               </div>
               <div className="flex justify-between items-center px-4 pt-4 border-t border-slate-50">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-left">Transaction ID</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">#{transaction?._id?.slice(-12).toUpperCase()}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6">
                <button 
                  onClick={handlePrint}
                  className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 border border-slate-200/50"
                >
                  <FiPrinter size={16} /> Receipt
                </button>
                <Link 
                  to="/dashboard"
                  className="w-full py-4 bg-slate-900 hover:bg-tf-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-slate-900/10"
                >
                  Dashboard <FiArrowRight size={16} />
                </Link>
            </div>
          </div>

          <div className="text-center space-y-6">
             <div className="flex justify-center gap-8 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
                <div className="flex items-center gap-2"><FiShield className="text-tf-primary" /> Encrypted</div>
                <div className="flex items-center gap-2"><FiCheckCircle className="text-emerald-500" /> Verified</div>
                <div className="flex items-center gap-2"><FiGlobe className="text-tf-primary" /> Traceable</div>
             </div>
             <p className="text-[10px] font-medium text-slate-400 italic">This transaction serves as a binding humanitarian asset deployment node.</p>
          </div>
        </div>
      </div>

      {/* INSTITUTIONAL MINIMALIST RECEIPT */}
      <div id="printable-area" className="hidden-standard printable-only bg-white text-slate-900 selection:bg-none">
         <div className="max-w-[210mm] mx-auto p-16 space-y-16 relative">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-10">
               <div className="space-y-2">
                  <h1 className="text-3xl font-black tracking-tighter leading-none">TRUSTFUND.</h1>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Official Humanitarian Receipt</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Document Registry</p>
                  <p className="text-[10px] font-bold text-slate-500">Node: {transaction?._id?.toUpperCase()}</p>
                  <p className="text-[10px] font-bold text-slate-500 mt-1">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
               </div>
            </div>

            {/* Content Table */}
            <div className="space-y-12">
               <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Stakeholder Information</p>
                  <div className="grid grid-cols-2 gap-8">
                     <div className="bg-slate-50 p-6 rounded-2xl">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Donor Identity</p>
                        <p className="text-lg font-black text-slate-900 italic uppercase">{transaction?.donorId?.name || 'Authorized Donor'}</p>
                        <p className="text-[9px] font-medium text-slate-400 mt-1 font-mono">{transaction?.donorId?.email}</p>
                     </div>
                     <div className="bg-slate-50 p-6 rounded-2xl">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Beneficiary Mission</p>
                        <p className="text-lg font-black text-slate-900 italic uppercase line-clamp-1">{campaignTitle}</p>
                        <p className="text-[9px] font-medium text-slate-400 mt-1 uppercase tracking-widest">Institutional Verified Node</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Asset Synchronization Summary</p>
                  <div className="border border-slate-200 rounded-3xl overflow-hidden">
                     <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                           <tr>
                              <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Item Description</th>
                              <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol Type</th>
                              <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Net Value</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           <tr>
                              <td className="px-6 py-6 font-black text-slate-900 italic">TrustFund Humanitarian Contribution</td>
                              <td className="px-6 py-6 text-right font-bold text-slate-400 uppercase tracking-widest text-[10px]">Strategic Asset</td>
                              <td className="px-6 py-6 text-right font-black text-slate-950 tabular-nums italic">{transaction?.currency || 'LKR'} {amount}</td>
                           </tr>
                           <tr className="bg-slate-900 text-white">
                              <td colSpan="2" className="px-6 py-6 text-right text-[9px] font-black uppercase tracking-[0.4em] text-white/50 italic">Total Authorized Liquidity Inbound</td>
                              <td className="px-6 py-6 text-right text-xl font-black italic tracking-tighter tabular-nums">{transaction?.currency || 'LKR'} {amount}</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>

            {/* Verification Footer */}
            <div className="pt-20 grid grid-cols-2 gap-20">
               <div className="space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                     <FiShield size={24} className="text-tf-primary opacity-30" />
                  </div>
                  <p className="text-[9px] font-black text-slate-400 leading-relaxed uppercase tracking-widest">
                     This document serves as formal evidence of humanitarian capital mobilization. The transaction was verified through a direct bank-to-NGO protocol.
                  </p>
               </div>
               <div className="text-right flex flex-col justify-end space-y-4">
                  <div className="h-[2px] w-48 bg-slate-100 ml-auto" />
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Secretariat Digital Seal</p>
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">Node: {transaction?._id?.slice(0, 16)}</p>
               </div>
            </div>
         </div>
      </div>

      <style>{`
        /* Standard Screen Styles */
        .hidden-standard { display: none; }
        
        @media print {
          @page { margin: 0; size: A4 portrait; }
          
          /* Hide the heavy screen layout without breaking child visibility */
          .no-print-section {
             display: none !important;
          }

          body { 
             visibility: hidden !important; 
             background: white !important; 
             margin: 0 !important; 
             -webkit-print-color-adjust: exact !important; 
             print-color-adjust: exact !important;
          }
          
          #printable-area {
             display: block !important;
             visibility: visible !important;
             position: fixed !important;
             left: 0 !important;
             top: 0 !important;
             width: 100% !important;
             height: 100% !important;
             z-index: 9999999 !important;
             background: white !important;
             margin: 0 !important;
             padding: 0 !important;
             overflow: visible !important;
          }
          
          #printable-area * {
             visibility: visible !important;
          }

          /* Ensure text is sharp */
          body { color: #000 !important; }
        }
      `}</style>
    </>
  );
};

export default PaymentSuccessPage;

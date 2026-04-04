import { useEffect, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiClock, FiDownload, FiDollarSign, FiRepeat, FiCheckCircle, 
  FiXCircle, FiMoreVertical, FiExternalLink, FiFilter, FiActivity, FiHash,
  FiUsers, FiShield, FiCalendar, FiArrowUpRight, FiLayers, FiPlus, FiTarget
} from 'react-icons/fi';

const statusBadgeStyle = {
  pending:   'bg-amber-50 text-amber-600 border-amber-100',
  completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  failed:    'bg-rose-50 text-rose-600 border-rose-100',
};

export default function TransactionsPage() {
  const { user } = useAuth();
  const { transactions, fetchTransactions, loading, error } = useFinance();
  const [ngoProfile, setNgoProfile] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (user?.role === 'ngo-admin') {
      api.get('/api/ngos/profile')
        .then(res => {
          setNgoProfile(res.data);
          if (res.data?._id) fetchTransactions(res.data._id);
        })
        .catch(err => {
           console.error("Error loading NGO profile for transactions:", err);
           fetchTransactions();
        });
    } else if (user?.role === 'partner' || user?.role === 'donor') {
        fetchTransactions(`donor/${user._id}`);
    } else {
        fetchTransactions();
    }
  }, [user, fetchTransactions]);

  const filtered = transactions.filter(tx => {
    const idStr = String(tx.payHereOrderId || tx._id).toLowerCase();
    const donorStr = String(tx.donorId?.name || '').toLowerCase();
    const campaignStr = String(tx.campaignId?.title || '').toLowerCase();
    const query = search.toLowerCase();
    return idStr.includes(query) || donorStr.includes(query) || campaignStr.includes(query);
  });

  const openDetails = (tx) => {
    setSelectedTx(tx);
    setShowDetails(true);
  };

  if (loading && transactions.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <LoadingSpinner />
      <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 animate-pulse">Synchronizing Global Ledger Hub...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32 pt-6">
      
      {/* Header Registry Frame */}
      <div className="relative overflow-hidden bg-slate-950 rounded-[48px] p-10 md:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-orange-600/10 to-transparent pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-orange-500 blur-[120px] opacity-20 rounded-full" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">Transaction Intelligence Hub</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter leading-none ">
              Transaction <span className="text-orange-500">Audit</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl font-medium leading-relaxed">
               Comprehensive immutable registry of verified inbound capital, mission allocations, and financial verification events Hub sync!
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-10 py-5 bg-white border border-slate-200 rounded-2xl text-[10px] font-extrabold uppercase tracking-widest hover:border-orange-500 transition-all flex items-center gap-3 text-slate-900 shadow-xl shadow-white/5 active:scale-95">
                <FiDownload size={18} /> Export Registry (CSV)
            </button>
          </div>
        </div>
      </div>

      {/* Controller Hub */}
      <div className="premium-surface p-6 flex flex-col md:flex-row items-center gap-6">
         <div className="flex-1 w-full relative group">
            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Identity Hash, Donor Name, or Mission Title Hub..." 
              className="w-full bg-slate-50 border border-slate-100 rounded-3xl pl-16 pr-6 py-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all placeholder:text-slate-400"
            />
         </div>
         <div className="flex items-center gap-4 w-full md:w-auto">
            <button className="px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-[10px] font-extrabold uppercase tracking-widest text-slate-600 flex items-center gap-3 hover:bg-slate-100 transition-all">
              <FiFilter size={18} /> Status Control
            </button>
            <div className="w-14 h-14 flex items-center justify-center bg-slate-900 rounded-3xl text-orange-500 shadow-lg shadow-slate-900/20">
              <FiActivity size={24} />
            </div>
         </div>
      </div>

      {/* Main Ledger Core */}
      <div className="premium-surface overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold border-b border-slate-50 bg-slate-50/50">
                <th className="px-10 py-8">Identity Hash</th>
                <th className="px-10 py-8">Inbound Mission</th>
                <th className="px-10 py-8">Ledger Timeline</th>
                <th className="px-10 py-8">Capital Sync</th>
                <th className="px-10 py-8 text-center" width="200">Governance</th>
                <th className="px-10 py-8 text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length > 0 ? (
                filtered.map((tx) => (
                  <tr key={tx._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-10">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-orange-500 group-hover:border-slate-900 transition-all group-hover:scale-105 shadow-sm">
                              <FiHash size={20} />
                           </div>
                           <div>
                              <p className="font-mono text-sm text-slate-900 font-extrabold tracking-tighter">
                                #{tx.payHereOrderId || tx._id.slice(-12).toUpperCase()}
                              </p>
                              <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mt-1 ">Registry Entry Hub</p>
                           </div>
                        </div>
                    </td>
                    <td className="px-10 py-10">
                        <div className="space-y-2">
                           <p className="text-base font-extrabold text-slate-950 line-clamp-1 ">{tx.campaignId?.title || 'General Treasury Funds'}</p>
                           <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                                 <FiUsers size={10} className="text-orange-500" />
                              </div>
                              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{tx.donorId?.name || 'Anonymous Institutional Donor'}</span>
                           </div>
                        </div>
                    </td>
                    <td className="px-10 py-10">
                        <div className="space-y-1">
                           <p className="text-sm font-extrabold text-slate-900 tabular-nums">
                             {new Date(tx.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                           </p>
                           <div className="flex items-center gap-2">
                              <FiClock size={12} className="text-slate-300" />
                              <span className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest">Finalized Hub</span>
                           </div>
                        </div>
                    </td>
                    <td className="px-10 py-10">
                        <p className="text-lg font-extrabold text-slate-950 tabular-nums leading-none mb-1">
                            {tx.currency} {Number(tx.amount).toLocaleString()}
                        </p>
                        <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                           <FiCheckCircle size={10} /> Verified Reserve
                        </p>
                    </td>
                    <td className="px-10 py-10">
                        <div className="flex justify-center">
                          <span className={`px-5 py-2 rounded-2xl text-[9px] font-extrabold uppercase tracking-widest border shadow-sm transition-all group-hover:shadow-md ${statusBadgeStyle[tx.status] || 'bg-slate-50 text-slate-400'}`}>
                            {tx.status} Hub
                          </span>
                        </div>
                    </td>
                    <td className="px-10 py-10 text-right">
                        <button 
                          onClick={() => openDetails(tx)}
                          className="px-6 py-4 bg-slate-50 border border-slate-100 text-slate-400 rounded-3xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95 shadow-sm hover:shadow-xl hover:shadow-slate-900/20 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-widest group/btn ml-auto"
                        >
                            <FiArrowUpRight className="text-sm group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" /> View OPS
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-10 py-40 text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-6 border border-slate-100 text-slate-200">
                             <FiLayers size={48} />
                        </div>
                        <h3 className="text-slate-300 font-extrabold text-lg uppercase tracking-[0.2em] ">Zero Ledger Intelligence</h3>
                        <p className="text-slate-300 text-xs mt-3 font-bold uppercase tracking-widest">Verify synchronization or adjust filter Hub sync!</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Depth Modal Hub */}
      <AnimatePresence>
        {showDetails && selectedTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetails(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative bg-white rounded-[56px] w-full max-w-4xl shadow-2xl overflow-hidden"
            >
              <div className="p-12 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                 <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-slate-900 text-orange-500 rounded-[32px] flex items-center justify-center shadow-2xl shadow-slate-900/20">
                       <FiShield size={36} />
                    </div>
                    <div>
                       <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-slate-400 mb-2 ">Institutional Payment Verification Registry Hub</p>
                       <h3 className="text-4xl font-extrabold text-slate-900 tracking-tighter leading-none ">
                          Registry Trace: <span className="text-orange-500">#{selectedTx.payHereOrderId || selectedTx._id.slice(-8).toUpperCase()}</span>
                       </h3>
                    </div>
                 </div>
                 <button 
                  onClick={() => setShowDetails(false)}
                  className="p-4 bg-slate-100 rounded-3xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                >
                  <FiPlus size={28} className="rotate-45" />
                </button>
              </div>

              <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12 max-h-[60vh] overflow-y-auto custom-scrollbar">
                
                {/* Left Side: Donor & Mission context */}
                <div className="space-y-12 text-left">
                  <div className="space-y-6">
                    <h5 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                       <FiUsers className="text-orange-500" /> Origin Verification
                    </h5>
                    <div className="p-8 bg-slate-50 rounded-[40px] space-y-6 border border-slate-100">
                       <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Donor Identity</p>
                          <p className="text-2xl font-extrabold text-slate-900 ">{selectedTx.donorId?.name || 'Anonymous Operational Donor'}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Authenticated Relay</p>
                          <p className="text-base font-bold text-slate-600 underline underline-offset-4 decoration-orange-200">{selectedTx.donorId?.email || 'N/A'}</p>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h5 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                       <FiTarget className="text-orange-500" /> Mission Destination Hub
                    </h5>
                    <div className="p-8 bg-slate-900 rounded-[40px] text-white relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform"><FiActivity size={80}/></div>
                       <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Target Campaign Registry</p>
                       <p className="text-2xl font-extrabold text-white  leading-tight mb-4">{selectedTx.campaignId?.title || 'Operational Emergency Fund Hub'}</p>
                       <div className="flex justify-between items-end pt-4 border-t border-white/10">
                          <div>
                             <p className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Relay Status</p>
                             <p className="text-base font-extrabold text-emerald-400 ">VERIFIED SYNC</p>
                          </div>
                          <p className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500">Class A Protocol</p>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Financial Metadata */}
                <div className="space-y-12 text-left">
                  <div className="space-y-6">
                    <h5 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                       <FiLayers className="text-orange-500" /> Financial Metadata Hub
                    </h5>
                    <div className="premium-surface p-8 space-y-6">
                       <div className="grid grid-cols-2 gap-8">
                          <div>
                             <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Sync Liquidity</p>
                             <p className="text-2xl font-extrabold text-slate-900 tabular-nums leading-none ">{selectedTx.currency} {selectedTx.amount?.toLocaleString()}</p>
                          </div>
                          <div>
                             <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Relay Protocol</p>
                             <p className="text-base font-extrabold text-slate-900  underline decoration-2 decoration-orange-500/20">{selectedTx.paymentMethod || 'Manual Entry'}</p>
                          </div>
                       </div>
                       
                       <div className="h-px bg-slate-100" />
                       
                       <div className="space-y-4">
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Identifier</span>
                             <code className="text-[11px] font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">#{selectedTx.payHereOrderId || 'MB-INTERNAL'}</code>
                          </div>
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Process Timeline</span>
                             <span className="text-[11px] font-extrabold text-slate-900 ">{new Date(selectedTx.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Internal Status</span>
                             <span className={`px-4 py-1 text-[10px] font-extrabold uppercase rounded-lg border  ${statusBadgeStyle[selectedTx.status]}`}>{selectedTx.status} Hub</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                     <h5 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                        <FiCalendar className="text-orange-500" /> Operational Context Hub
                     </h5>
                     <div className="p-8 bg-slate-50 rounded-[40px] border border-dashed border-slate-200 min-h-[120px]">
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">Relay Justification / Notes</p>
                        <p className="text-sm font-bold text-slate-600  leading-relaxed">
                          {selectedTx.notes || 'Institutional relay finalized without secondary operational notations Hub sync!'}
                        </p>
                     </div>
                  </div>
                </div>

              </div>
              
              <div className="p-12 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <FiShield className="text-orange-500" size={24} />
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 max-w-xs leading-relaxed ">
                      This record is secured via Institutional Identity Hub and cannot be manually modified Hub.
                    </p>
                 </div>
                 <button className="px-10 py-5 bg-slate-900 text-white rounded-3xl text-[10px] font-extrabold uppercase tracking-widest shadow-2xl shadow-slate-900/40 hover:bg-orange-600 transition-all flex items-center gap-3 ">
                    <FiDownload /> Finalize Registry Certification Hub
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

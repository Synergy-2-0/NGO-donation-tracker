import { useEffect, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FiSearch, FiClock, FiDownload, FiDollarSign, FiRepeat, FiCheckCircle, 
  FiXCircle, FiMoreVertical, FiExternalLink, FiFilter, FiActivity, FiHash 
} from 'react-icons/fi';

const statusBadgeStyle = {
  pending:   'bg-amber-50 text-amber-600 border-amber-100',
  completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  failed:    'bg-rose-50 text-rose-600 border-rose-100',
};

export default function TransactionsPage() {
  const { transactions, fetchTransactions, loading, error } = useFinance();
  const [ngoProfile, setNgoProfile] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/api/partners/me/profile')
      .then(res => {
        setNgoProfile(res.data);
        fetchTransactions(res.data._id);
      })
      .catch(err => console.error("Error loading NGO profile:", err));
  }, [fetchTransactions]);

  const filtered = transactions.filter(tx => {
    const idStr = String(tx.payHereOrderId || tx._id).toLowerCase();
    const methodStr = String(tx.paymentMethod || '').toLowerCase();
    const query = search.toLowerCase();
    return idStr.includes(query) || methodStr.includes(query);
  });

  if (loading && transactions.length === 0) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fadeIn text-left">
      {/* Header */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-slate-400 mb-2">Financial Ledger</p>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Transaction <span className="text-brand-red">Audit</span>
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl font-medium">
               Detailed record of all inbound funds, financial flows, and finalized verification events in your treasury.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-white text-slate-900 shadow-xl shadow-white/10 hover:bg-slate-100 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 flex items-center gap-2">
                <FiDownload className="text-sm stroke-[2.5]" />
                Export CSV Registry
            </button>
          </div>
        </div>
      </div>

      {/* Control / Filter Bar */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-5 flex flex-col md:flex-row items-center gap-4">
         <div className="flex-1 w-full relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by Order ID, Transaction Hash or Method..." 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-brand-red/5 transition-all"
            />
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
              <FiFilter /> Filter Status
            </button>
            <div className="w-12 h-12 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl text-slate-400">
              <FiActivity />
            </div>
         </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/90 backdrop-blur-xl rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] text-slate-400 uppercase tracking-[.2em] font-black border-b border-slate-50 bg-slate-50/50">
                <th className="px-10 py-6">Identity Hash</th>
                <th className="px-10 py-6">Timeline</th>
                <th className="px-10 py-6">Liquidity Inbound</th>
                <th className="px-10 py-6">Mode of Exchange</th>
                <th className="px-10 py-6 text-center">Governance</th>
                <th className="px-10 py-6 text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length > 0 ? (
                filtered.map((tx) => (
                  <tr key={tx._id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-10 py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-serif group-hover:bg-brand-red group-hover:text-white transition-all scale-95 group-hover:scale-100">
                              <FiHash />
                           </div>
                           <div>
                              <p className="font-mono text-[10px] text-slate-800 font-bold tracking-tighter">
                                #{tx.payHereOrderId || tx._id.slice(-12).toUpperCase()}
                              </p>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5 font-serif">Registry Entry</p>
                           </div>
                        </div>
                    </td>
                    <td className="px-10 py-6 whitespace-nowrap">
                        <p className="text-sm font-bold text-slate-700 font-serif">
                          {new Date(tx.createdAt).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'})}
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                          <FiClock className="text-xs" /> Finalized
                        </p>
                    </td>
                    <td className="px-10 py-6 font-semibold">
                        <p className="text-sm font-black text-slate-900 tracking-tighter">
                            {tx.currency} {Number(tx.amount).toLocaleString()}
                        </p>
                        <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">Verified Balance</p>
                    </td>
                    <td className="px-10 py-6">
                        <div className="flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-slate-200" />
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              {tx.paymentMethod || 'Institutional Transfer'}
                           </span>
                        </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col items-center">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${statusBadgeStyle[tx.status] || 'bg-slate-50 text-slate-400'}`}>
                          {tx.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                        <button className="p-3 bg-slate-50 border border-slate-100 text-slate-500 rounded-2xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95 shadow-sm group-hover:shadow-xl transition-all duration-300">
                            <FiExternalLink className="text-sm" />
                        </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-10 py-32 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mx-auto mb-5 border border-slate-100 text-slate-200 font-serif">
                             <FiRepeat className="text-4xl" />
                        </div>
                        <h3 className="text-slate-400 font-black text-sm uppercase tracking-widest">Zero Intelligence Detected.</h3>
                        <p className="text-slate-300 text-xs mt-2 font-medium">Verify your synchronization or adjust filter parameters.</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminDonor } from '../../context/AdminDonorContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiTrendingUp, FiCheckCircle, FiClock, FiSearch, FiRefreshCw, FiExternalLink, FiDollarSign } from 'react-icons/fi';

const statusColor = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm',
  fulfilled: 'bg-tf-primary/10 text-tf-primary border-tf-primary/20 shadow-sm',
  cancelled: 'bg-slate-100 text-slate-400 border-slate-200',
  pending: 'bg-amber-50 text-amber-600 border-amber-100 shadow-sm',
};

const ROWS_PER_PAGE = 8;

export default function AdminDonorPledgesPage() {
  const navigate = useNavigate();
  const { pledges, loading, error, fetchAllPledges } = useAdminDonor();
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchAllPledges().catch(() => {});
  }, [fetchAllPledges]);

  const filtered = pledges.filter((p) => {
    const donorName = p.donorId?.userId?.name?.toLowerCase() || '';
    const q = search.toLowerCase();
    const matchSearch = !q || donorName.includes(q);
    const matchFilter = !filter || p.status === filter;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated  = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  if (loading && pledges.length === 0) return <LoadingSpinner message="Loading donor pledges..." />;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-32 animate-fadeIn font-sans selection:bg-tf-primary selection:text-white pt-6">
      
      {/* Simplified Professional Header */}
      <section className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-10 md:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-tf-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10 text-left">
          <div className="space-y-4 flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-tf-primary text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
               <FiTrendingUp /> Donation Commitments Hub
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Pledge <span className="text-tf-primary">Registry</span>
            </h2>
            <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed max-w-xl">
               Manage recurring community support and upcoming financial promises made by verified donors.
            </p>
          </div>
          
          <div className="flex gap-4 shrink-0">
             <div className="bg-white/5 border border-white/10 backdrop-blur-xl px-8 py-6 rounded-2xl space-y-1 text-left">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Total Pledges</p>
                <p className="text-4xl font-black text-tf-primary tabular-nums">{pledges.length}</p>
             </div>
             <div className="bg-white/5 border border-white/10 backdrop-blur-xl px-8 py-6 rounded-2xl space-y-1 text-left">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Active Commits</p>
                <p className="text-4xl font-black text-emerald-500 tabular-nums">{pledges.filter(p => p.status === 'active').length}</p>
             </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
          {error && <div className="px-4"><ErrorAlert message={error} /></div>}
      </AnimatePresence>

      {/* Filter Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4">
        <div className="lg:col-span-12">
            <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center">
               <div className="relative flex-1 w-full group">
                  <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-tf-primary transition-colors" />
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search by donor name or pledge ID..."
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-6 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-tf-primary focus:bg-white transition-all shadow-inner italic"
                  />
               </div>
               
               <div className="flex gap-3 w-full md:w-auto">
                  <select 
                    value={filter}
                    onChange={(e) => { setFilter(e.target.value); setPage(1); }}
                    className="h-14 px-6 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 focus:outline-none focus:border-tf-primary transition-all appearance-none cursor-pointer pr-12"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 15px center', backgroundSize: '14px' }}
                  >
                    <option value="">All Pledges Hub</option>
                    <option value="active">Active Commitment</option>
                    <option value="fulfilled">Success / Received</option>
                    <option value="cancelled">Cancelled Archive</option>
                    <option value="pending">Awaiting Verification Hub</option>
                  </select>
                  
                  <button 
                    onClick={() => fetchAllPledges()}
                    className="h-14 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-tf-primary transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-slate-950/10"
                  >
                    <FiRefreshCw className="text-sm" /> Sync Hub
                  </button>
               </div>
            </div>
        </div>

        {/* Database Table */}
        <div className="lg:col-span-12">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 relative group/table">
            <div className="overflow-x-auto relative z-10">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">
                    <th className="px-6 pb-4 text-left font-black">Community Supporter</th>
                    <th className="px-6 pb-4 text-left font-black">Commitment Amount</th>
                    <th className="px-6 pb-4 text-center font-black">Frequency</th>
                    <th className="px-6 pb-4 text-center font-black">Sync Status</th>
                    <th className="px-6 pb-4 text-right font-black">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginated.length > 0 ? paginated.map((pledge, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                      key={pledge._id} 
                      className="group/row hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center font-black text-sm group-hover/row:bg-tf-primary group-hover/row:text-white transition-all">
                             {pledge.donorId?.userId?.name?.charAt(0) || 'D'}
                          </div>
                          <div>
                            <p className="text-base font-black text-slate-900 group-hover/row:text-tf-primary transition-colors leading-tight mb-0.5">{pledge.donorId?.userId?.name || 'Verified Member'}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {pledge._id.slice(-6).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-0.5 group/money">
                           <p className="text-lg font-black text-slate-950 tracking-tight tabular-nums group-hover/row:text-tf-primary transition-colors leading-none">
                              LKR {Number(pledge.amount).toLocaleString()}
                           </p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                              <FiDollarSign className="text-emerald-500" /> Community Contribution
                           </p>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="px-4 py-1.5 bg-slate-950 text-white rounded-xl text-[9px] font-black uppercase tracking-widest group-hover/row:bg-tf-primary transition-colors italic">
                           {pledge.frequency?.toUpperCase() || 'ONE-TIME'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                         <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-500 ${statusColor[pledge.status] || 'bg-white text-slate-300'}`}>
                            {pledge.status} Hub
                         </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => navigate(`/admin/donors/${pledge.donorId?._id}`)}
                              className="px-5 py-2.5 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                            >
                               Donor Profile <FiExternalLink className="text-xs" />
                            </button>
                         </div>
                      </td>
                    </motion.tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
                         <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-200">
                            <FiUsers size={32} />
                         </div>
                         <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">No pledges found</h4>
                         <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Try adjusting your filters Hub.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Hub */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6 px-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Showing {((page - 1) * ROWS_PER_PAGE) + 1} to {Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length} commitments
                </p>
                <div className="flex items-center gap-3">
                   <button 
                     disabled={page === 1} onClick={() => setPage(p => p - 1)}
                     className="px-5 py-2.5 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-900 hover:text-white disabled:opacity-20 transition-all active:scale-95"
                   >
                     Prev Hub
                   </button>
                   <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm">
                      {page}
                   </div>
                   <button 
                     disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                     className="px-5 py-2.5 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-900 hover:text-white disabled:opacity-20 transition-all active:scale-95"
                   >
                     Next Hub
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

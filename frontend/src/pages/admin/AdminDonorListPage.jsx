import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminDonor } from '../../context/AdminDonorContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiRefreshCw, FiExternalLink, 
  FiTrash2, FiMail, FiPhone, FiTrendingUp,
  FiShield, FiGlobe, FiAlertTriangle, FiUsers
} from 'react-icons/fi';

const StatusBadge = ({ status }) => {
  const cls = {
    active:   'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm',
    inactive: 'bg-amber-50 text-amber-600 border-amber-100 shadow-sm',
    deleted:  'bg-rose-50 text-rose-600 border-rose-100 shadow-sm',
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-500 ${cls[status] || 'bg-slate-50 text-slate-300 border-slate-100'}`}>
      {status || 'unknown'}
    </span>
  );
};

const ROWS_PER_PAGE = 8;

export default function AdminDonorListPage() {
  const navigate = useNavigate();
  const { donors, loading, error, setError, fetchDonors, deleteDonor } = useAdminDonor();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDonors().catch(() => {});
  }, [fetchDonors]);

  const filtered = donors.filter((d) => {
    const name  = d.userId?.name?.toLowerCase() || '';
    const email = d.userId?.email?.toLowerCase() || '';
    const q = search.toLowerCase();
    const matchSearch = !q || name.includes(q) || email.includes(q);
    const matchStatus = !statusFilter || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated  = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const handleDelete = async () => {
    setLocalError('');
    try {
      await deleteDonor(confirmDelete);
      setConfirmDelete(null);
      setSuccess('Donor record updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to update record.');
      setConfirmDelete(null);
    }
  };

  if (loading && donors.length === 0) return <LoadingSpinner message="Loading donor directory..." />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32 animate-fadeIn font-sans selection:bg-tf-primary selection:text-white pt-6">
      
      {/* Simplified Professional Header */}
      <section className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-10 md:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-tf-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-4 flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-tf-primary text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
               <FiUsers /> Donor Management Hub
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Donor <span className="text-tf-primary">Registry</span>
            </h1>
            <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed max-w-2xl">
              Manage your community of philanthropic supporters and humanitarian partners in one central location.
            </p>
          </div>
          
          <div className="flex gap-4 shrink-0">
             <div className="bg-white/5 border border-white/10 backdrop-blur-xl px-8 py-6 rounded-2xl space-y-1">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Total Donors</p>
                <p className="text-4xl font-black text-tf-primary tabular-nums">{donors.length}</p>
             </div>
             <div className="bg-white/5 border border-white/10 backdrop-blur-xl px-8 py-6 rounded-2xl space-y-1">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Active Members</p>
                <p className="text-4xl font-black text-emerald-500 tabular-nums">{donors.filter(d => d.status === 'active').length}</p>
             </div>
          </div>
        </div>
      </section>

      {/* Filter Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12">
            <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center">
               <div className="relative flex-1 w-full group">
                  <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-tf-primary transition-colors" />
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search by name or email address..."
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-6 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-tf-primary focus:bg-white transition-all shadow-inner"
                  />
               </div>
               
               <div className="flex gap-3 w-full md:w-auto">
                  <select 
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="h-14 px-6 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 focus:outline-none focus:border-tf-primary transition-all appearance-none cursor-pointer pr-12"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 15px center', backgroundSize: '14px' }}
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active Residents</option>
                    <option value="inactive">Pending Activation</option>
                  </select>
                  
                  <button 
                    onClick={() => fetchDonors().catch(() => {})}
                    className="h-14 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-tf-primary transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-slate-950/10"
                  >
                    <FiRefreshCw className="text-sm" /> Refresh Data
                  </button>
               </div>
            </div>
        </div>

        {/* Database Table */}
        <div className="lg:col-span-12">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 relative">
            <div className="overflow-x-auto relative z-10">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">
                    <th className="px-6 pb-4 text-left font-black">Donor Info</th>
                    <th className="px-6 pb-4 text-left font-black">Contact Details</th>
                    <th className="px-6 pb-4 text-left font-black">Total Contributions</th>
                    <th className="px-6 pb-4 text-center font-black">Status</th>
                    <th className="px-6 pb-4 text-right font-black">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginated.length > 0 ? paginated.map((donor, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                      key={donor._id} 
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center font-black text-sm group-hover:bg-tf-primary group-hover:text-white transition-all">
                             {donor.userId?.name?.charAt(0) || 'D'}
                          </div>
                          <div>
                            <p className="text-base font-black text-slate-900 group-hover:text-tf-primary transition-colors leading-tight mb-0.5">{donor.userId?.name || 'Authorized Member'}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {donor._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                         <div className="space-y-1">
                            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm tracking-tight">
                               <FiMail className="text-slate-300 shrink-0" /> {donor.userId?.email}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                               <FiPhone className="text-slate-200 shrink-0" /> {donor.phone || 'No phone provided'}
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                         <div className="space-y-0.5">
                            <p className="text-lg font-black text-slate-950 tracking-tight tabular-nums group-hover:text-tf-primary transition-colors leading-none">
                               LKR {Number(donor.analytics?.totalDonated || 0).toLocaleString()}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                               <FiTrendingUp className="text-emerald-500" /> Life-time Giving
                            </p>
                         </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <StatusBadge status={donor.status || 'inactive'} />
                      </td>
                      <td className="px-6 py-5 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => navigate(`/admin/donors/${donor._id}`)}
                              className="px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                            >
                               Details <FiExternalLink className="text-xs" />
                            </button>
                            <button 
                              onClick={() => { setConfirmDelete(donor._id); setSuccess(''); }}
                              className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm active:scale-95"
                              title="Delete Record"
                            >
                               <FiTrash2 />
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
                         <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">No donors found</h4>
                         <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Try adjusting your search or filters Hub.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Component */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Showing {((page - 1) * ROWS_PER_PAGE) + 1} to {Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length} donors
                </p>
                <div className="flex items-center gap-3">
                   <button 
                     disabled={page === 1} onClick={() => setPage(p => p - 1)}
                     className="px-5 py-2.5 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-900 hover:text-white disabled:opacity-20 transition-all active:scale-95"
                   >
                     Prev
                   </button>
                   <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm">
                      {page}
                   </div>
                   <button 
                     disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                     className="px-5 py-2.5 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-900 hover:text-white disabled:opacity-20 transition-all active:scale-95"
                   >
                     Next
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
         {confirmDelete && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
               <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2rem] p-10 max-w-lg w-full text-center space-y-8 shadow-2xl">
                  <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-inner-sm">
                     <FiAlertTriangle />
                  </div>
                  <div className="space-y-2">
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Delete Donor Record?</h2>
                     <p className="text-slate-500 font-medium leading-relaxed text-sm px-4">
                        Are you sure you want to delete this donor? This action cannot be undone and will remove all their information from the registry.
                     </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                     <button onClick={handleDelete} className="flex-[2] py-4 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-rose-600/20">
                        Confirm Delete Hub
                     </button>
                     <button onClick={() => setConfirmDelete(null)} className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95">
                        Cancel
                     </button>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Success Tooltip */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]">
             <div className="bg-slate-950 text-emerald-400 px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-black uppercase tracking-widest text-[10px]">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                {success}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

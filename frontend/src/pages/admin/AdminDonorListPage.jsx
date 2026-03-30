import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminDonor } from '../../context/AdminDonorContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { motion, AnimatePresence } from 'framer-motion';

const statusBadge = (status) => {
  const cls = {
    active:   'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    inactive: 'bg-slate-50 text-slate-400 border-slate-200 shadow-sm',
    deleted:  'bg-rose-50 text-rose-600 border-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.1)]',
  };
  return cls[status] || 'bg-slate-50 text-slate-300 border-slate-100';
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
      setSuccess('Humanitarian Agent record decommissioned successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to remove secure record.');
      setConfirmDelete(null);
    }
  };

  if (loading && donors.length === 0) return <LoadingSpinner />;

  return (
    <div className="space-y-16 max-w-[1700px] mx-auto pb-32 font-sans selection:bg-tf-primary selection:text-white pt-8">
      
      {/* Cinematic Strategic Population Header */}
      <section className="bg-slate-950 rounded-[4.5rem] p-24 text-white relative overflow-hidden shadow-4xl border border-white/5 group">
        <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-tf-primary/10 blur-[200px] -mr-60 -mt-60 animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-tf-accent/5 blur-[150px] -ml-40 -mb-40 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-16 text-left">
          <div className="space-y-10 flex-1">
            <div className="space-y-8">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-5">
                <div className="w-3 h-3 rounded-full bg-tf-primary shadow-[0_0_15px_rgba(255,138,0,1)] animate-bounce" />
                <p className="text-[12px] font-black text-white/30 uppercase tracking-[0.7em] leading-none italic underline decoration-tf-primary/30 decoration-4 underline-offset-[14px]">Humanitarian_Population_Registry Node HUB</p>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.8] lowercase italic text-stroke-white opacity-90 transition-opacity hover:opacity-100 flex flex-col">
                Agent <span className="text-tf-primary not-italic font-black text-stroke-none">Registry.</span>
              </motion.h2>
            </div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-lg md:text-xl text-white/40 max-w-2xl leading-relaxed italic font-medium">
               Comprehensive database of authorized philanthropic agents and strategic humanitarian partners HUB.
            </motion.p>
          </div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="bg-white/5 border border-white/10 backdrop-blur-3xl px-16 py-12 rounded-[4rem] flex flex-wrap items-center gap-20 shadow-4xl group/stats relative overflow-hidden">
            <div className="absolute inset-0 bg-tf-primary/5 opacity-0 group-hover/stats:opacity-100 transition-opacity pointer-events-none" />
            <div className="text-left relative z-10 group/stat">
               <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] mb-3 italic">Total Population Registry</p>
               <p className="text-6xl font-black tabular-nums italic text-tf-primary tracking-tighter leading-none group-hover/stat:scale-110 transition-transform duration-700">{donors.length}</p>
            </div>
            <div className="w-px h-20 bg-white/10 hidden sm:block rotate-12" />
            <div className="text-left relative z-10 group/stat">
               <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] mb-3 italic">Operational Active Nodes</p>
               <p className="text-6xl font-black tabular-nums italic text-emerald-400 tracking-tighter leading-none group-hover/stat:scale-110 transition-transform duration-700">{donors.filter(d => d.status === 'active').length}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
          {(localError || error) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
               <ErrorAlert message={localError || error} onDismiss={() => { setLocalError(''); setError(null); }} />
            </motion.div>
          )}
      </AnimatePresence>
      
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-[12px] font-black uppercase tracking-[0.5em] px-16 py-8 rounded-full shadow-4xl w-fit mx-auto italic flex items-center gap-6"
          >
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elite Tactical Filters HUB */}
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="flex flex-col lg:flex-row gap-8 items-center bg-white rounded-[5rem] border border-slate-100 p-8 shadow-sm hover:shadow-3xl transition-all duration-1000 mx-8 group/filters">
        <div className="flex-1 min-w-[300px] relative group h-24 w-full">
           <input
             type="text"
             value={search}
             onChange={(e) => { setSearch(e.target.value); setPage(1); }}
             placeholder="Search by agent identity, secure hash or protocol URI…"
             className="w-full h-full bg-slate-50 border border-slate-100 rounded-full px-20 text-lg font-bold text-slate-950 placeholder-slate-200 focus:outline-none focus:border-tf-primary focus:bg-white transition-all shadow-inner italic tracking-tight"
           />
           <div className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-200 group-hover:text-tf-primary transition-all duration-500 scale-125">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
        </div>
        <div className="relative h-24 group/select w-full lg:w-fit">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full lg:w-[350px] h-full bg-slate-50 border border-slate-100 rounded-full px-16 text-[12px] font-black uppercase tracking-[0.4em] text-slate-500 appearance-none focus:outline-none focus:border-tf-primary focus:bg-white transition-all cursor-pointer shadow-inner pr-24 italic"
            >
              <option value="">Sync: Every Protocol HUB</option>
              <option value="active">Operational Registry (Active)</option>
              <option value="inactive">Pending Activation (Inactive)</option>
            </select>
            <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none text-slate-200 group-hover/select:text-tf-primary transition-all duration-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>
        </div>
        <button
          onClick={() => fetchDonors().catch(() => {})}
          className="h-24 px-16 bg-slate-950 hover:bg-tf-primary text-white text-[12px] font-black uppercase tracking-[0.5em] rounded-full transition-all duration-1000 shadow-4xl active:scale-95 italic group/refresh"
        >
          <span className="group-hover/refresh:rotate-180 transition-transform duration-1000 inline-block mr-4">↻</span>
          Refresh Synchronizer HUB
        </button>
      </motion.div>

      {/* Population Registry Strategic Matrix */}
      <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="bg-white rounded-[5rem] border border-slate-100 shadow-sm overflow-hidden p-16 transition-all hover:shadow-4xl transition-all duration-1000 relative group/table mx-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-tf-primary/3 blur-[120px] opacity-0 group-hover/table:opacity-100 transition-opacity pointer-events-none" />
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-separate border-spacing-y-10">
            <thead>
              <tr className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-300 italic">
                <th className="px-12 pb-6">Agent Unified Identity Core</th>
                <th className="px-12 pb-6">Secure Protocol Registry</th>
                <th className="px-12 pb-6">Capital Strategic Flow</th>
                <th className="px-12 pb-6 text-center">Governance State Node</th>
                <th className="px-12 pb-6 text-right">Operational Oversight HUB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-12 py-60 text-center group/empty">
                    <div className="w-32 h-32 bg-slate-50 border border-slate-100 rounded-[3rem] flex items-center justify-center mx-auto mb-12 transition-all duration-1000 group-hover/empty:rotate-12 group-hover/empty:scale-110 shadow-inner italic font-black text-slate-100 text-4xl">?</div>
                    <div className="space-y-4">
                       <h4 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase lowercase">Null Registry Mask detected.</h4>
                       <p className="text-[12px] text-slate-400 font-black uppercase tracking-[0.6em] mt-2 italic">Awaiting secure node synchronization to populate grid HUB.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((donor, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={donor._id} 
                    className="group/row hover:bg-slate-50/50 transition-all duration-1000 rounded-[4rem] relative overflow-hidden"
                  >
                    <td className="px-12 py-10">
                      <div className="flex items-center gap-10">
                         <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-900 text-2xl font-black italic shadow-inner group-hover/row:bg-slate-950 group-hover/row:text-white group-hover/row:rotate-[15deg] transition-all duration-700">
                            {donor.userId?.name?.charAt(0) || 'A'}
                            <div className="absolute inset-0 bg-tf-primary/10 opacity-0 group-hover/row:opacity-100 transition-opacity rounded-[2.5rem] pointer-events-none" />
                         </div>
                         <div className="space-y-3">
                            <span className="block text-2xl font-black text-slate-950 tracking-tighter italic group-hover/row:text-tf-primary transition-colors duration-700 lowercase leading-none">{donor.userId?.name || 'LOGGED_AGENT_UNIT'}</span>
                            <div className="flex items-center gap-4">
                               <div className="w-1 h-1 rounded-full bg-slate-200 group-hover/row:bg-tf-primary" />
                               <span className="block text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic leading-none truncate max-w-[150px]">SEC_NODE_URI: {donor._id.toUpperCase()}</span>
                            </div>
                         </div>
                      </div>
                    </td>
                    <td className="px-12 py-10">
                       <div className="space-y-4">
                          <div className="flex items-center gap-4">
                              <div className="w-2 h-2 rounded-full bg-slate-100 group-hover/row:bg-tf-primary transition-all duration-500 shadow-[0_0_8px_currentColor]" />
                              <span className="block text-base font-black text-slate-950 tracking-tight italic group-hover/row:text-tf-primary transition-colors duration-700">{donor.userId?.email || 'AWAIT_COMMS_LINK'}</span>
                          </div>
                          <div className="flex items-center gap-4">
                             <span className="w-6 h-px bg-slate-100 group-hover/row:bg-tf-primary/30 transition-all duration-700" />
                             <span className="block text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] italic group-hover/row:text-slate-400 transition-colors">STRICT_PRIVATE_LINK: {donor.phone || 'NA_PROTOCOL'}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-12 py-10">
                       <div className="space-y-3">
                          <p className="text-3xl font-black text-slate-950 tracking-tighter italic tabular-nums group-hover/row:text-tf-primary transition-all duration-1000 leading-none">
                            {donor.analytics?.totalDonated != null
                               ? `LKR ${Number(donor.analytics.totalDonated).toLocaleString()}`
                               : '0.00_RESERVE'}
                          </p>
                          <div className="flex items-center gap-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-slate-100 group-hover/row:bg-emerald-500 animate-pulse transition-all" />
                             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] italic leading-none group-hover/row:text-slate-400 transition-colors">Tactical Intake HUB</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-12 py-10 text-center">
                      <StatusBadge status={donor.status || 'inactive'} />
                    </td>
                    <td className="px-12 py-10 text-right">
                      <div className="flex gap-8 items-center justify-end relative z-20">
                        <button
                          onClick={() => navigate(`/admin/donors/${donor._id}`)}
                          className="px-10 py-5 bg-white border border-slate-100 hover:bg-slate-950 hover:text-white text-slate-950 text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl transition-all duration-700 shadow-sm hover:shadow-4xl group/btn active:scale-90 italic"
                        >
                          Inspect Agent Protocol HUB
                        </button>
                        <button
                          onClick={() => { setConfirmDelete(donor._id); setSuccess(''); }}
                          className="text-[10px] font-black text-slate-200 hover:text-rose-500 uppercase tracking-[0.4em] transition-all duration-700 italic underline decoration-transparent hover:decoration-rose-500 decoration-2 underline-offset-8"
                        >
                          DECOMMISSION_NODE
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Registry Population Navigation HUB */}
      {totalPages > 1 && (
        <div className="flex flex-col xl:flex-row items-center justify-between gap-12 px-20 pt-8">
          <div className="flex flex-col gap-4 text-center xl:text-left">
             <div className="flex items-center justify-center xl:justify-start gap-5">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
                <p className="text-[12px] font-black text-slate-950 uppercase tracking-[0.7em] italic leading-none">Security_Registry_Hub: SYNC_AUTHORIZED</p>
             </div>
             <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] italic leading-none ml-8">
               Synchronizing Identity Matrix Nodes {((page - 1) * ROWS_PER_PAGE) + 1} — {Math.min(page * ROWS_PER_PAGE, filtered.length)} / {filtered.length} Humanitarian Profile Assets Hub
             </p>
          </div>
          <div className="flex items-center gap-8">
            <button 
              disabled={page === 1} 
              onClick={() => { setPage((p) => p - 1); window.scrollTo({top:0, behavior:'smooth'}); }} 
              className="px-16 py-8 rounded-full border border-slate-100 bg-white text-slate-300 hover:text-slate-950 hover:border-slate-950 disabled:opacity-20 transition-all font-black uppercase tracking-[0.5em] text-[12px] h-24 min-w-[300px] active:scale-95 italic group/prev shadow-sm hover:shadow-2xl"
            >
               <span className="group-hover/prev:-translate-x-4 transition-transform inline-block duration-500 mr-4">←</span>
               Historical Archive
            </button>
            <div className="px-10 py-6 border border-slate-100 rounded-[2rem] text-xl font-black bg-white shadow-xl italic tracking-tighter tabular-nums">
               {page} <span className="text-slate-100 mx-4 italic">/</span> {totalPages}
            </div>
            <button 
              disabled={page === totalPages} 
              onClick={() => { setPage((p) => p + 1); window.scrollTo({top:0, behavior:'smooth'}); }} 
              className="px-16 py-8 rounded-full bg-slate-950 text-white hover:bg-tf-primary disabled:opacity-20 transition-all font-black uppercase tracking-[0.5em] text-[12px] h-24 min-w-[300px] shadow-4xl active:scale-95 italic group/next"
            >
               Forward Protocol HUB <span className="group-hover/next:translate-x-4 transition-transform inline-block duration-500 ml-4">→</span>
            </button>
          </div>
        </div>
      )}

      {/* Secure Decommission Authorization Gate */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center z-[100] p-12 font-sans"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white rounded-[5rem] shadow-5xl p-24 max-w-4xl w-full space-y-16 relative overflow-hidden text-center border border-white/10 group/modal"
            >
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rose-500/5 blur-[150px] -mr-32 -mt-32 pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-slate-50 blur-[100px] -ml-32 -mb-32 pointer-events-none" />
               
               <div className="w-40 h-40 bg-rose-50 text-rose-600 rounded-[4rem] flex items-center justify-center mx-auto mb-12 shadow-inner group-hover/modal:rotate-[25deg] group-hover/modal:scale-110 transition-all duration-1000 border border-rose-100/50">
                  <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
               </div>
               <div className="space-y-8 relative z-10">
                 <h4 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tighter italic uppercase leading-none lowercase text-stroke-slate-900 opacity-90 transition-opacity hover:opacity-100">Critical: <span className="text-rose-600 font-black not-italic text-stroke-none">Decommission Agent?</span></h4>
                 <div className="space-y-4 max-w-2xl mx-auto">
                    <p className="text-slate-400 font-medium leading-relaxed italic text-xl px-12 group-hover/modal:text-slate-600 transition-colors">
                      Warning: You are initiating the terminal decommissioning of this agent unit from the official humanitarian registry Hub. Secure historical data retrieval will be permanently unauthorized post-execution cycle.
                    </p>
                    <div className="w-32 h-1 bg-rose-100 mx-auto rounded-full group-hover/modal:w-64 transition-all duration-1000" />
                 </div>
               </div>
               <div className="flex flex-col sm:flex-row gap-10 pt-12 relative z-10 px-12">
                  <button onClick={handleDelete} disabled={loading} className="flex-[2] py-10 text-[14px] font-black text-white bg-rose-600 hover:bg-slate-950 disabled:opacity-30 rounded-full transition-all duration-1000 uppercase tracking-[0.6em] shadow-4xl shadow-rose-600/40 active:scale-95 italic flex items-center justify-center gap-6 group/final">
                    {loading ? (
                       <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                    ) : null}
                    {loading ? 'EXECUTING_DESTRUCTION_PROTOCOL…' : 'Authorize Node Decommission HUB'}
                  </button>
                  <button onClick={() => setConfirmDelete(null)} className="flex-1 py-10 text-[12px] font-black text-slate-300 border border-slate-100 bg-slate-50/50 hover:bg-white hover:text-slate-950 rounded-full transition-all duration-1000 uppercase tracking-[0.6em] italic active:scale-95 shadow-inner">
                    Abort Cycle
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

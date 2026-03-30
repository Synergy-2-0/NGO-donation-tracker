import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminDonor } from '../../context/AdminDonorContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { motion, AnimatePresence } from 'framer-motion';

const statusColor = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
  fulfilled: 'bg-tf-primary/10 text-tf-primary border-tf-primary/20 shadow-sm',
  cancelled: 'bg-slate-100 text-slate-400 border-slate-200',
  pending: 'bg-amber-50 text-amber-600 border-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
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

  if (loading && pledges.length === 0) return <LoadingSpinner />;

  return (
    <div className="space-y-16 max-w-[1700px] mx-auto pb-32 font-sans selection:bg-tf-primary selection:text-white pt-8">
      
      {/* Cinematic Strategic Capital Header */}
      <section className="bg-slate-950 rounded-[4.5rem] p-24 text-white relative overflow-hidden shadow-4xl border border-white/5 group">
        <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-tf-primary/10 blur-[200px] -mr-60 -mt-60 animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-tf-accent/5 blur-[150px] -ml-40 -mb-40 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-16 text-left">
          <div className="space-y-10 flex-1">
            <div className="space-y-8">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-5">
                <div className="w-3 h-3 rounded-full bg-tf-primary shadow-[0_0_15px_rgba(255,138,0,1)] animate-bounce" />
                <p className="text-[12px] font-black text-white/30 uppercase tracking-[0.7em] leading-none italic underline decoration-tf-primary/30 decoration-4 underline-offset-[14px]">Verified Capital Commitment Protocol HUB</p>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.8] lowercase italic text-stroke-white opacity-90 transition-opacity hover:opacity-100 flex flex-col">
                Commitment <span className="text-tf-primary not-italic font-black text-stroke-none">Matrix HUB.</span>
              </motion.h2>
            </div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-lg md:text-xl text-white/40 max-w-2xl leading-relaxed italic font-medium">
               Real-time monitoring and authorization of strategic humanitarian pledges and capital stabilization protocols HUB.
            </motion.p>
          </div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="bg-white/5 border border-white/10 backdrop-blur-3xl px-16 py-12 rounded-[4rem] flex flex-wrap items-center gap-20 shadow-4xl group/stats relative overflow-hidden">
            <div className="absolute inset-0 bg-tf-primary/5 opacity-0 group-hover/stats:opacity-100 transition-opacity pointer-events-none" />
            <div className="text-left relative z-10 group/stat">
               <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] mb-3 italic">Total Strategic Plans</p>
               <p className="text-6xl font-black tabular-nums italic text-tf-primary tracking-tighter leading-none group-hover/stat:scale-110 transition-transform duration-700">{pledges.length}</p>
            </div>
            <div className="w-px h-20 bg-white/10 hidden sm:block rotate-12" />
            <div className="text-left relative z-10 group/stat">
               <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] mb-3 italic">Active Commitments</p>
               <p className="text-6xl font-black tabular-nums italic text-emerald-400 tracking-tighter leading-none group-hover/stat:scale-110 transition-transform duration-700">{pledges.filter(p => p.status === 'active').length}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="px-8">
               <ErrorAlert message={error} />
            </motion.div>
          )}
      </AnimatePresence>

      {/* Elite Strategic Filters HUB */}
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="flex flex-col lg:flex-row gap-8 items-center bg-white rounded-[5rem] border border-slate-100 p-8 shadow-sm hover:shadow-3xl transition-all duration-1000 mx-8 group/filters">
        <div className="flex-1 min-w-[300px] relative group h-24 w-full">
           <input
             type="text"
             value={search}
             onChange={(e) => { setSearch(e.target.value); setPage(1); }}
             placeholder="Search by agent identity, secure protocol hash or mission ID…"
             className="w-full h-full bg-slate-50 border border-slate-100 rounded-full px-20 text-lg font-bold text-slate-950 placeholder-slate-200 focus:outline-none focus:border-tf-primary focus:bg-white transition-all shadow-inner italic tracking-tight"
           />
           <div className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-200 group-hover:text-tf-primary transition-all duration-500 scale-125">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
        </div>
        <div className="relative h-24 group/select w-full lg:w-fit">
            <select
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setPage(1); }}
              className="w-full lg:w-[350px] h-full bg-slate-50 border border-slate-100 rounded-full px-16 text-[12px] font-black uppercase tracking-[0.4em] text-slate-500 appearance-none focus:outline-none focus:border-tf-primary focus:bg-white transition-all cursor-pointer shadow-inner pr-24 italic"
            >
              <option value="">Sync: All Pledges HUB</option>
              <option value="active">Active Commitment Protocol</option>
              <option value="fulfilled">Fulfilled Operational Success</option>
              <option value="cancelled">Aborted Protocol Archive</option>
              <option value="pending">Awaiting Verification Hub</option>
            </select>
            <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none text-slate-200 group-hover/select:text-tf-primary transition-all duration-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>
        </div>
        <button
          onClick={() => fetchAllPledges()}
          className="h-24 px-16 bg-slate-950 hover:bg-tf-primary text-white text-[12px] font-black uppercase tracking-[0.5em] rounded-full transition-all duration-1000 shadow-4xl active:scale-95 italic group/refresh"
        >
          <span className="group-hover/refresh:rotate-180 transition-transform duration-1000 inline-block mr-4">↻</span>
          Synchronize Matrix HUB
        </button>
      </motion.div>

      {/* Strategic Capital Registry Matrix */}
      <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="bg-white rounded-[5rem] border border-slate-100 shadow-sm overflow-hidden p-16 transition-all hover:shadow-4xl transition-all duration-1000 relative group/table mx-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-tf-primary/3 blur-[120px] opacity-0 group-hover/table:opacity-100 transition-opacity pointer-events-none" />
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-separate border-spacing-y-10">
            <thead>
              <tr className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-300 italic">
                <th className="px-12 pb-6">Humanitarian Agent Hub</th>
                <th className="px-12 pb-6">Tactical Liquidity Target</th>
                <th className="px-12 pb-6 text-center">Operation Frequency HUB</th>
                <th className="px-12 pb-6 text-center">Governance Protocol</th>
                <th className="px-12 pb-6 text-right">Audit & Registry HUB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-12 py-60 text-center group/empty">
                    <div className="w-32 h-32 bg-white border border-slate-100 rounded-[3rem] flex items-center justify-center mx-auto mb-12 transition-all duration-1000 group-hover/empty:rotate-12 group-hover/empty:scale-110 shadow-inner italic font-black text-slate-100 text-4xl">?</div>
                    <div className="space-y-4">
                       <h4 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase lowercase">Null Commitment Registry node.</h4>
                       <p className="text-[12px] text-slate-400 font-black uppercase tracking-[0.6em] mt-2 italic">No humanitarian protocols match the current strategic synchronization mask HUB.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((pledge, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={pledge._id} 
                    className="group/row hover:bg-slate-50/50 transition-all duration-1000 rounded-[4rem] relative overflow-hidden"
                  >
                    <td className="px-12 py-10">
                      <div className="flex items-center gap-10">
                         <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-950 text-2xl font-black italic shadow-inner group-hover/row:bg-slate-950 group-hover/row:text-white group-hover/row:rotate-[15deg] transition-all duration-700 relative overflow-hidden">
                            {pledge.donorId?.userId?.name?.charAt(0) || 'D'}
                            <div className="absolute inset-0 bg-tf-primary/10 opacity-0 group-hover/row:opacity-100 transition-opacity pointer-events-none" />
                         </div>
                         <div className="space-y-3">
                            <span className="block text-2xl font-black text-slate-950 tracking-tighter italic group-hover/row:text-tf-primary transition-colors duration-700 lowercase leading-none">{pledge.donorId?.userId?.name || 'LOGGED_AGENT_UNIT'}</span>
                            <div className="flex items-center gap-4">
                               <div className="w-1 h-1 bg-tf-primary/20 rounded-full group-hover/row:w-3 transition-all duration-700" />
                               <span className="block font-mono text-[10px] font-black text-slate-300 uppercase tracking-widest italic leading-none">PROTOCOL_ID: {pledge._id.toUpperCase()}</span>
                            </div>
                         </div>
                      </div>
                    </td>
                    <td className="px-12 py-10">
                       <div className="space-y-4">
                          <div className="flex items-center gap-4 group/money">
                             <span className="text-3xl font-black text-slate-950 tracking-tighter italic tabular-nums group-hover/row:text-tf-primary transition-all duration-1000 leading-none">LKR {Number(pledge.amount).toLocaleString()}</span>
                             <div className="w-2 h-2 rounded-full bg-tf-primary shadow-[0_0_10px_currentColor] animate-pulse opacity-0 group-hover/row:opacity-100 transition-opacity" />
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="w-4 h-px bg-slate-100 group-hover/row:bg-tf-primary/30 transition-all duration-1000" />
                             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] italic leading-none group-hover/row:text-slate-400 transition-colors">Scheduled Capital Stabilization HUB</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-12 py-10 text-center">
                       <span className="px-10 py-4 bg-slate-950 text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-3xl italic group-hover/row:bg-tf-primary group-hover/row:scale-110 transition-all duration-700 inline-block">
                          {pledge.frequency?.toUpperCase() || 'ONE-TIME'} Protocol
                       </span>
                    </td>
                    <td className="px-12 py-10 text-center">
                      <span className={`px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.3em] italic border border-slate-100 shadow-2xl transition-all duration-1000 ${statusColor[pledge.status] || 'bg-white text-slate-300'}`}>
                        NODE_{pledge.status?.toUpperCase()}_SYNC
                      </span>
                    </td>
                    <td className="px-12 py-10 text-right">
                       <button
                         onClick={() => navigate(`/admin/donors/${pledge.donorId?._id}`)}
                         className="px-12 py-6 bg-white border border-slate-100 hover:bg-slate-950 hover:text-white text-slate-950 text-[11px] font-black uppercase tracking-[0.5em] rounded-2xl transition-all duration-700 shadow-sm hover:shadow-4xl group/audit active:scale-90 italic"
                       >
                         Audit Agent Registry HUB <span className="group-hover/audit:translate-x-3 transition-transform inline-block ml-4">→</span>
                       </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Strategic Matrix Navigation HUB */}
      {totalPages > 1 && (
        <div className="flex flex-col xl:flex-row items-center justify-between gap-12 px-20 pt-8">
          <div className="flex flex-col gap-4 text-center xl:text-left">
             <div className="flex items-center justify-center xl:justify-start gap-5">
                <div className="w-3 h-3 rounded-full bg-tf-primary shadow-[0_0_15px_rgba(255,138,0,0.5)] animate-pulse" />
                <p className="text-[12px] font-black text-slate-950 uppercase tracking-[0.7em] italic leading-none">Security_Matrix_Hub: SYNC_AUTHORIZED</p>
             </div>
             <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] italic leading-none ml-8">
               Synchronizing Capital Nodes {((page - 1) * ROWS_PER_PAGE) + 1} — {Math.min(page * ROWS_PER_PAGE, filtered.length)} / {filtered.length} Philanthropic Asset Protocols Hub
             </p>
          </div>
          <div className="flex items-center gap-8">
            <button 
              disabled={page === 1} 
              onClick={() => { setPage((p) => p - 1); window.scrollTo({top:0, behavior:'smooth'}); }} 
              className="px-16 py-8 rounded-full border border-slate-100 bg-white text-slate-300 hover:text-slate-950 hover:border-slate-950 disabled:opacity-20 transition-all font-black uppercase tracking-[0.5em] text-[12px] h-24 min-w-[300px] active:scale-95 italic group/prev shadow-sm hover:shadow-2xl"
            >
               <span className="group-hover/prev:-translate-x-4 transition-transform inline-block duration-500 mr-4">←</span>
               Historical Commitment Archive
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
    </div>
  );
}

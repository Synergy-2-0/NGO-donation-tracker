import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminDonor } from '../../context/AdminDonorContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { motion, AnimatePresence } from 'framer-motion';

const SEGMENT_META = {
  new:     { label: 'Initial Recruits HUB', bar: 'bg-indigo-500', icon: (
    <svg className="w-6 h-6 text-indigo-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ) },
  regular: { label: 'Active Operational HUB', bar: 'bg-emerald-500', icon: (
    <svg className="w-6 h-6 text-emerald-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ) },
  major:   { label: 'Executive Stakeholders', bar: 'bg-tf-primary', icon: (
    <svg className="w-6 h-6 text-orange-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ) },
  lapsed:  { label: 'Dormant Registry HUB', bar: 'bg-slate-500', icon: (
    <svg className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  ) },
  vip:     { label: 'Institutional Philanthropists', bar: 'bg-slate-950', icon: (
    <svg className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ) },
};

function ImpactCard({ label, value, color, icon, trend }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} className="bg-white rounded-[4.5rem] border border-slate-100 p-14 shadow-sm hover:shadow-4xl transition-all duration-1000 group relative overflow-hidden flex flex-col justify-between h-full">
      <div className={`absolute top-0 right-0 w-48 h-48 ${color.replace('text-', 'bg-')} opacity-[0.03] blur-[80px] -mr-24 -mt-24 group-hover:opacity-10 transition-opacity duration-1000`} />
      <div className="flex justify-between items-start mb-14 relative z-10">
         <div className="w-20 h-20 bg-white border border-slate-100 rounded-[2.5rem] flex items-center justify-center transition-all duration-1000 group-hover:scale-125 shadow-xl group-hover:bg-slate-950 group-hover:text-white group-hover:rotate-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-tf-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            {icon}
         </div>
         {trend && (
           <span className="text-[11px] font-black text-emerald-500 bg-emerald-50 px-6 py-3 rounded-full uppercase tracking-[0.4em] border border-emerald-100 italic shadow-sm group-hover:scale-110 transition-transform duration-700">
             {trend}_SYNC
           </span>
         )}
      </div>
      <div className="relative z-10 space-y-4">
        <div className="space-y-1">
           <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.5em] mb-1 italic leading-none group-hover:text-slate-950 transition-colors">{label} Hub</p>
           <div className="w-10 h-0.5 bg-slate-100 group-hover:w-full group-hover:bg-tf-primary/20 transition-all duration-1000" />
        </div>
        <p className={`text-4xl font-black tracking-tighter text-slate-950 group-hover:text-tf-primary transition-all duration-700 tabular-nums italic leading-none lowercase origin-left group-hover:scale-105`}>{value ?? '0.00'}</p>
      </div>
    </motion.div>
  );
}

export default function AdminDonorAnalyticsPage() {
  const navigate = useNavigate();
  const { donors, segments, loading, error, setError, fetchDonors, fetchSegments } = useAdminDonor();

  useEffect(() => {
    fetchDonors().catch(() => {});
    fetchSegments().catch(() => {});
  }, [fetchDonors, fetchSegments]);

  // Compute top-level metrics
  const totalDonors    = donors.length;
  const activeDonors   = donors.filter((d) => d.status === 'active').length;
  const totalRaised    = donors.reduce((s, d) => s + (d.analytics?.totalDonated || 0), 0);
  const avgDonation    = totalDonors > 0
    ? donors.reduce((s, d) => s + (d.analytics?.averageDonation || 0), 0) / totalDonors
    : 0;

  // Normalise segments
  const segmentCounts = (() => {
    if (Array.isArray(segments)) {
      return segments.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {});
    }
    if (segments && typeof segments === 'object') return segments;
    return donors.reduce((acc, d) => {
      const seg = d.segment || 'new';
      acc[seg] = (acc[seg] || 0) + 1;
      return acc;
    }, {});
  })();

  const segmentEntries = Object.entries(segmentCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = segmentEntries.length > 0 ? Math.max(...segmentEntries.map(([, v]) => v)) : 1;

  if (loading && donors.length === 0) return <LoadingSpinner />;

  return (
    <div className="space-y-16 max-w-[1700px] mx-auto pb-40 font-sans selection:bg-tf-primary selection:text-white pt-8">
      
      {/* Cinematic Tactical Intelligence Header HUB */}
      <section className="bg-slate-950 rounded-[4.5rem] p-24 text-white relative overflow-hidden shadow-4xl border border-white/5 mx-8 group">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-tf-primary/10 blur-[250px] -mr-60 -mt-60 animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-tf-accent/5 blur-[200px] -ml-40 -mb-40 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-20 text-left">
          <div className="space-y-12 flex-1">
            <div className="space-y-10">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-6">
                <div className="w-4 h-4 rounded-full bg-tf-primary shadow-[0_0_20px_rgba(255,138,0,1)] animate-bounce" />
                <p className="text-[12px] font-black text-white/30 uppercase tracking-[0.8em] leading-none italic underline decoration-tf-primary/30 decoration-4 underline-offset-[14px]">Verified_Strategic_Capitally_Intelligence_HUB Node</p>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-9xl font-black tracking-tighter leading-[0.8] lowercase italic text-stroke-white opacity-90 transition-all hover:opacity-100 flex flex-col">
                Tactical <span className="text-tf-primary font-black uppercase-none not-italic text-stroke-none">Intel Hub.</span>
              </motion.h2>
            </div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-xl md:text-2xl text-white/40 max-w-3xl leading-relaxed italic font-medium">
               High-fidelity synchronization of authorized population engagement metrics and capital stabilization cycles HUB.
            </motion.p>
          </div>
          <div className="shrink-0 relative z-20 flex flex-col gap-6">
            <button onClick={() => window.print()} className="px-16 py-8 bg-white text-slate-950 text-[13px] font-black uppercase tracking-[0.6em] rounded-full hover:bg-tf-primary hover:text-white transition-all duration-1000 shadow-5xl active:scale-95 italic flex items-center justify-center gap-6 group/export">
              <svg className="w-6 h-6 group-hover/export:-translate-y-2 transition-transform duration-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export Intelligence Audit HUB
            </button>
            <div className="flex items-center gap-4 px-10">
               <div className="w-2 h-2 rounded-full bg-tf-primary animate-pulse shadow-[0_0_10px_rgba(255,138,0,0.5)]" />
               <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] italic">Real-time sync active node</p>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="px-8">
               <ErrorAlert message={error} onDismiss={() => setError(null)} />
            </motion.div>
          )}
      </AnimatePresence>

      {/* High-Fidelity Intelligence Matrix HUB */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 px-8">
        <ImpactCard label="Agent Resource Registry" value={totalDonors} color="text-indigo-500" trend="Active" icon={<path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />} />
        <ImpactCard label="Verified Active Population" value={activeDonors} color="text-emerald-500" trend="Operational" icon={<path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />} />
        <ImpactCard label="Cumulative Capital Intake" value={`LKR ${totalRaised.toLocaleString()}`} color="text-tf-primary" trend="Secured" icon={<path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2a9 9 0 1118 0" />} />
        <ImpactCard label="Average Strategy Scale" value={`LKR ${Math.round(avgDonation).toLocaleString()}`} color="text-blue-500" trend="Stables" icon={<path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-16 px-8 items-start">
        {/* Strategic Humanitarian Population Breakdown Hub */}
        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="xl:col-span-3 bg-slate-950 rounded-[5rem] p-20 shadow-5xl relative overflow-hidden group/pop text-white border border-white/5 space-y-20 transition-all duration-1000 hover:shadow-tf-primary/10">
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-tf-primary/5 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tf-primary/10 blur-[180px] -mr-60 -mt-60 pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
             <div className="flex items-center gap-6 mb-4">
                <div className="w-16 h-0.5 bg-tf-primary/40 group-hover/pop:w-32 transition-all duration-1000" />
                <p className="text-[12px] font-black text-white/20 uppercase tracking-[0.7em] italic">Intelligence Population Segments HUB</p>
             </div>
             <h3 className="text-5xl lg:text-7xl font-black italic lowercase tracking-tighter leading-none text-stroke-white opacity-90 group-hover/pop:opacity-100 transition-opacity">Agent <span className="text-tf-primary font-black uppercase-none not-italic text-stroke-none">Registry.</span></h3>
          </div>

          <div className="space-y-16 relative z-10 px-4">
            {segmentEntries.length === 0 ? (
              <div className="py-40 text-center group/null bg-white/5 rounded-[4rem] border-2 border-dashed border-white/10">
                 <div className="w-32 h-32 bg-white/5 border border-white/10 rounded-[3rem] flex items-center justify-center mx-auto mb-10 transition-all duration-1000 group-hover/null:rotate-12 group-hover/null:scale-110 shadow-inner italic font-black text-white/10 text-4xl">?</div>
                 <p className="text-[12px] font-black text-white/20 uppercase tracking-[0.8em] italic max-w-sm mx-auto leading-relaxed">Registry synchronization throughput insufficient for strategic real-time segmentation Hub.</p>
              </div>
            ) : (
              segmentEntries.map(([seg, count], idx) => {
                const meta = SEGMENT_META[seg] || { label: seg, bar: 'bg-slate-600', icon: <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> };
                const pct  = Math.min(100, Math.round((count / maxCount) * 100));
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15, duration: 0.8 }}
                    key={seg} 
                    className="space-y-8 cursor-default group/seg relative"
                  >
                    <div className="flex items-center justify-between text-[12px] px-4 italic">
                      <div className="flex items-center gap-10">
                         <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center transition-all duration-700 group-hover/seg:bg-white group-hover/seg:scale-125 group-hover/seg:rotate-12 shadow-2xl relative overflow-hidden group/icon">
                            <div className="absolute inset-0 bg-tf-primary/10 opacity-0 group-hover/icon:opacity-100 transition-opacity" />
                            {meta.icon}
                         </div>
                         <div className="space-y-1">
                            <span className="font-black text-white/30 uppercase tracking-[0.4em] group-hover/seg:text-tf-primary transition-colors duration-700">{meta.label}</span>
                            <div className="w-8 h-px bg-white/10 group-hover/seg:w-full group-hover/seg:bg-tf-primary/20 transition-all duration-1000" />
                         </div>
                      </div>
                      <div className="text-right space-y-2">
                          <p className="font-black text-white group-hover/seg:text-tf-primary transition-colors tracking-tighter text-3xl leading-none tabular-nums lowercase">{count} <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em] ml-2 italic">authorized profiles Hub</span></p>
                          <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.6em] group-hover/seg:text-tf-primary/40 transition-colors">{pct}% Registry Mass synchronization</p>
                      </div>
                    </div>
                    <div className="h-6 bg-white/5 rounded-full overflow-hidden p-1.5 border border-white/10 shadow-inner group-hover/seg:border-tf-primary/20 transition-colors duration-1000">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 2, ease: "circOut", delay: idx * 0.1 }}
                        className={`h-full rounded-full ${meta.bar} relative overflow-hidden group-hover/seg:brightness-125 transition-all duration-1000`}
                        style={{ boxShadow: `0 0 30px ${meta.bar.includes('indigo') ? 'rgba(99,102,241,0.3)' : meta.bar.includes('emerald') ? 'rgba(16,185,129,0.3)' : 'rgba(255,138,0,0.3)'}` }}
                      >
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer" />
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Top Operational Contributors Hub Ranking */}
        <div className="xl:col-span-2 space-y-12">
           <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center justify-between px-10">
              <div className="flex items-center gap-5">
                 <div className="w-3 h-3 rounded-full bg-tf-primary shadow-[0_0_15px_rgba(255,138,0,0.6)] animate-pulse" />
                 <h3 className="text-[12px] font-black text-slate-950 uppercase tracking-[0.7em] italic underline decoration-tf-primary/30 decoration-2 underline-offset-8">Leading Strategists HUB Ranking</h3>
              </div>
              <span className="text-[11px] font-black text-tf-primary uppercase tracking-[0.4em] italic group-hover:scale-110 transition-transform cursor-help">Verified protocols</span>
           </motion.div>

           <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="bg-white rounded-[5rem] border border-slate-100 p-10 shadow-sm hover:shadow-4xl transition-all duration-1000 flex flex-col h-full relative overflow-hidden group/rank mx-2">
              <div className="absolute top-0 right-0 w-80 h-80 bg-tf-primary/5 blur-[120px] -mr-40 -mt-40 pointer-events-none group-hover/rank:opacity-100 transition-opacity opacity-0 duration-1000" />
              
              <div className="space-y-8 relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[700px] py-6 px-4">
                {donors.length === 0 ? (
                  <div className="py-40 text-center space-y-10 group/null bg-slate-50/50 rounded-[4rem] border border-slate-100">
                    <div className="w-24 h-24 bg-white border border-slate-100 rounded-[3rem] flex items-center justify-center mx-auto text-slate-100 rotate-12 transition-transform hover:rotate-0 duration-1000 shadow-inner italic font-black text-4xl">!</div>
                    <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.6em] italic px-20 leading-relaxed">No high-impact agent node performance data synchronized for current protocol HUB.</p>
                  </div>
                ) : (
                  [...donors]
                    .sort((a, b) => (b.analytics?.totalDonated || 0) - (a.analytics?.totalDonated || 0))
                    .slice(0, 10)
                    .map((d, i) => {
                      const meta = SEGMENT_META[d.segment] || { label: d.segment || 'Asset Node', icon: '👤' };
                      return (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1, duration: 0.6 }}
                          key={d._id}
                          className="flex items-center justify-between p-8 rounded-[3.5rem] bg-slate-50/40 border border-slate-50 hover:bg-slate-950 hover:border-tf-primary/30 hover:shadow-5xl transition-all duration-700 cursor-pointer group/item relative overflow-hidden"
                          onClick={() => navigate(`/admin/donors/${d._id}`)}
                        >
                          <div className="absolute inset-0 bg-tf-primary/5 pointer-events-none opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          <div className="flex items-center gap-8 relative z-10 w-full lg:w-fit">
                             <div className="text-xl font-black text-slate-200 italic group-hover/item:text-tf-primary transition-all duration-700 w-12 text-center">#{i + 1}</div>
                             <div className="min-w-0">
                               <p className="text-[18px] font-black text-slate-950 tracking-tighter group-hover/item:text-white transition-all duration-700 truncate italic leading-none lowercase group-hover/item:scale-105 origin-left">
                                 {d.userId?.name || 'Verified Agent Node'}
                               </p>
                               <div className="flex flex-wrap items-center gap-5 mt-4">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none group-hover/item:text-tf-primary/50 transition-colors uppercase">{meta.label}</span>
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover/item:bg-emerald-500 group-hover/item:animate-pulse transition-all" />
                                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic leading-none">{d.analytics?.retentionScore ?? 0}% Retention Sync HUB</span>
                               </div>
                             </div>
                          </div>
                          <div className="text-right shrink-0 relative z-10">
                             <p className="text-2xl font-black text-slate-950 tracking-tighter tabular-nums italic group-hover/item:text-tf-primary group-hover/item:scale-110 transition-all duration-700 origin-right leading-none lowercase">LKR {(d.analytics?.totalDonated || 0).toLocaleString()}</p>
                             <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] italic mt-2 group-hover/item:text-white/20 transition-colors">Cumulative Intake HUB</p>
                          </div>
                        </motion.div>
                      );
                    })
                )}
              </div>
           </motion.div>
        </div>
      </div>

    </div>
  );
}

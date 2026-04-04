import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminDonor } from '../../context/AdminDonorContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiCheckCircle, FiTrendingUp, FiActivity, FiArrowUpRight, FiSearch, FiBriefcase, FiZap } from 'react-icons/fi';

const SEGMENT_META = {
  new:     { label: 'New Members', bar: 'bg-indigo-500', icon: <FiUsers className="w-6 h-6" /> },
  regular: { label: 'Active Members', bar: 'bg-emerald-500', icon: <FiCheckCircle className="w-6 h-6" /> },
  major:   { label: 'Large Donors', bar: 'bg-tf-primary', icon: <FiTrendingUp className="w-6 h-6" /> },
  lapsed:  { label: 'Inactive Members', bar: 'bg-slate-500', icon: <FiActivity className="w-6 h-6" /> },
  vip:     { label: 'Key Partners', bar: 'bg-slate-950', icon: <FiZap className="w-6 h-6" /> },
};

function ImpactCard({ label, value, color, icon, trend }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-[2rem] border border-slate-100 p-10 shadow-sm hover:shadow-xl transition-all duration-700 group relative overflow-hidden flex flex-col justify-between h-full">
      <div className={`absolute top-0 right-0 w-32 h-32 ${color.replace('text-', 'bg-')} opacity-[0.03] blur-3xl -mr-16 -mt-16 transition-opacity duration-1000`} />
      <div className="flex justify-between items-start mb-10 relative z-10">
         <div className={`w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center transition-all duration-700 group-hover:scale-110 shadow-sm group-hover:bg-slate-950 group-hover:text-white relative overflow-hidden ${color}`}>
            {icon}
         </div>
         {trend && (
           <span className="text-[9px] font-extrabold text-emerald-500 bg-emerald-50 px-4 py-2 rounded-full uppercase tracking-widest border border-emerald-100 ">
             {trend}
           </span>
         )}
      </div>
      <div className="relative z-10 space-y-2">
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest  group-hover:text-slate-900 transition-colors uppercase">{label}</p>
        <p className={`text-3xl font-extrabold tracking-tight text-slate-950 group-hover:text-tf-primary transition-all duration-700 tabular-nums`}>{value ?? '0.00'}</p>
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

  const totalDonors    = donors.length;
  const activeDonors   = donors.filter((d) => d.status === 'active').length;
  const totalRaised    = donors.reduce((s, d) => s + (d.analytics?.totalDonated || 0), 0);
  const avgDonation    = totalDonors > 0
    ? donors.reduce((s, d) => s + (d.analytics?.averageDonation || 0), 0) / totalDonors
    : 0;

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

  if (loading && donors.length === 0) return <LoadingSpinner message="Scanning community information hub..." />;

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-40 font-sans selection:bg-tf-primary selection:text-white pt-6">
      
      {/* Professional Information Header */}
      <section className="bg-slate-900 rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-tf-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-tf-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-6 flex-1">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-tf-primary text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-md">
               <FiActivity /> Donor Insights Hub
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Impact <span className="text-tf-primary">Analytics</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
              Track your community growth, donation performance, and member engagement statistics in one place.
            </p>
          </div>
          <div className="shrink-0 flex flex-col gap-4">
            <button onClick={() => window.print()} className="px-8 py-4 bg-white text-slate-950 text-[10px] font-extrabold uppercase tracking-widest rounded-2xl hover:bg-tf-primary hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ">
              Export Growth Report HUB
            </button>
            <div className="flex items-center gap-3 px-4">
               <div className="w-2 h-2 rounded-full bg-tf-primary animate-pulse" />
               <p className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest">Real-time data synchronization</p>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
          {error && <div className="px-4"><ErrorAlert message={error} onDismiss={() => setError(null)} /></div>}
      </AnimatePresence>

      {/* Main Metric Strips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        <ImpactCard label="Total Community Support" value={totalDonors} color="text-indigo-500" trend="Growing" icon={<FiUsers className="w-6 h-6" />} />
        <ImpactCard label="Active Community Members" value={activeDonors} color="text-emerald-500" trend="On Track" icon={<FiCheckCircle className="w-6 h-6" />} />
        <ImpactCard label="Total Raised (LKR)" value={totalRaised.toLocaleString()} color="text-tf-primary" trend="Secured" icon={<FiTrendingUp className="w-6 h-6" />} />
        <ImpactCard label="Average Gift (LKR)" value={Math.round(avgDonation).toLocaleString()} color="text-blue-500" trend="Stable" icon={<FiZap className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4 items-start">
        {/* Support Groups Information */}
        <div className="lg:col-span-12">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm relative overflow-hidden group">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                  <div className="space-y-1">
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3  underline decoration-tf-primary/30 decoration-4 underline-offset-8">Support Segments</h2>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Breakdown of community member groups by activity HUB</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {segmentEntries.map(([seg, count], idx) => {
                    const meta = SEGMENT_META[seg] || { label: seg, bar: 'bg-slate-200', icon: <FiUsers /> };
                    const pct  = Math.round((count / totalDonors) * 100) || 0;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}
                        key={seg} className="space-y-4 group/seg"
                      >
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className={`w-12 h-12 ${meta.bar} bg-opacity-10 rounded-xl flex items-center justify-center ${meta.bar.replace('bg-', 'text-')} shadow-sm group-hover/seg:scale-110 transition-transform`}>
                                  {meta.icon}
                               </div>
                               <div>
                                  <p className="text-base font-extrabold text-slate-900 transition-colors leading-none mb-1">{meta.label}</p>
                                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{count} members</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-lg font-extrabold text-slate-950 ">{pct}%</p>
                            </div>
                         </div>
                         <div className="h-2 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden shadow-inner p-0.5">
                            <motion.div 
                               initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} transition={{ duration: 1.5, ease: "easeOut" }}
                               className={`h-full rounded-full ${meta.bar}`}
                            />
                         </div>
                      </motion.div>
                    );
                  })}
               </div>
            </div>
        </div>

        {/* Top Community Supporters */}
        <div className="lg:col-span-12">
           <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm relative overflow-hidden">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-50 pb-8">
                  <div className="space-y-1">
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3  underline decoration-tf-primary/30 decoration-4 underline-offset-8">Top Community Supporters</h2>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Members with highest total impact Hub</p>
                  </div>
               </div>

               <div className="space-y-4">
                  {donors.length > 0 ? (
                    [...donors]
                      .sort((a, b) => (b.analytics?.totalDonated || 0) - (a.analytics?.totalDonated || 0))
                      .slice(0, 5)
                      .map((d, i) => (
                        <div 
                          key={d._id} 
                          onClick={() => navigate(`/admin/donors/${d._id}`)}
                          className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50/50 hover:bg-white border hover:border-slate-100 rounded-2xl transition-all group cursor-pointer"
                        >
                           <div className="flex items-center gap-6">
                              <span className="text-lg font-extrabold text-slate-200 group-hover:text-tf-primary transition-colors">#{i + 1}</span>
                              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-extrabold text-sm group-hover:bg-slate-900 group-hover:text-white transition-all">
                                 {d.userId?.name?.[0]}
                              </div>
                              <div>
                                 <p className="text-base font-extrabold text-slate-900 group-hover:text-tf-primary transition-colors leading-none mb-1.5">{d.userId?.name}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{SEGMENT_META[d.segment]?.label || 'Member'}</p>
                              </div>
                           </div>
                           <div className="mt-4 md:mt-0 text-right">
                              <p className="text-xl font-extrabold text-slate-950 tabular-nums  group-hover:text-tf-primary transition-colors">LKR {(d.analytics?.totalDonated || 0).toLocaleString()}</p>
                              <p className="text-[9px] font-extrabold text-slate-300 uppercase tracking-widest ">Total Given</p>
                           </div>
                        </div>
                      ))
                  ) : (
                    <div className="py-20 text-center space-y-6">
                       <FiUsers className="mx-auto text-slate-100" size={60} />
                       <p className="text-slate-400 font-bold text-xs uppercase tracking-widest ">No community data synchronized Hub.</p>
                    </div>
                  )}
               </div>
           </div>
        </div>
      </div>

    </div>
  );
}

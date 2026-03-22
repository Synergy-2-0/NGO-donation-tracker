import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminDonor } from '../../context/AdminDonorContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';

const SEGMENT_META = {
  new:     { label: 'New Members', bar: 'bg-blue-500', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ) },
  regular: { label: 'Active Support', bar: 'bg-tf-green', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ) },
  major:   { label: 'Key Partners', bar: 'bg-tf-primary', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ) },
  lapsed:  { label: 'Inactive Feed', bar: 'bg-slate-400', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  ) },
  vip:     { label: 'Major Philanthropists', bar: 'bg-tf-purple', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ) },
};

function ImpactCard({ label, value, color, icon, trend }) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-700 group relative overflow-hidden flex flex-col justify-between h-full">
      <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-[0.03] blur-[60px] -mr-16 -mt-16 group-hover:opacity-10 transition-opacity`} />
      <div className="flex justify-between items-start mb-10 relative z-10">
         <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-sm font-black transition-all group-hover:bg-tf-purple group-hover:text-white group-hover:scale-110 shadow-sm border border-white/10`}>
            {icon}
         </div>
         {trend && (
           <span className="text-[10px] font-black text-tf-green bg-tf-green/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-tf-green/20 shadow-sm">
             {trend}
           </span>
         )}
      </div>
      <div className="relative z-10 space-y-3">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1 italic leading-none">{label}</p>
        <p className={`text-3xl lg:text-4xl font-black tracking-tighter text-tf-purple group-hover:text-tf-primary transition-colors tabular-nums`}>{value ?? '0'}</p>
      </div>
    </div>
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
    <div className="space-y-12 animate-fade-in max-w-[1700px] mx-auto pb-24 font-sans selection:bg-tf-primary selection:text-white">
      
      {/* Cinematic Intel Header */}
      <div className="relative p-12 lg:p-16 bg-tf-purple rounded-[4rem] overflow-hidden shadow-2xl group text-white border border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1600')] opacity-5 blur-sm scale-110 group-hover:scale-100 transition-transform duration-1000 grayscale" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-tf-green/10 blur-[130px] -mr-48 -mb-48 opacity-40" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <span className="w-2.5 h-2.5 rounded-full bg-tf-green shadow-[0_0_20px_rgba(34,197,94,0.8)] animate-pulse" />
                 <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic opacity-60">Philanthropic Performance Reports</p>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black tracking-tighter uppercase italic tracking-tight">Impact <span className="text-tf-primary">Analytics </span> Reports</h2>
           </div>
           <button onClick={() => window.print()} className="px-12 py-6 bg-white/5 backdrop-blur-xl border-2 border-white/10 hover:border-tf-primary hover:bg-white hover:text-tf-purple rounded-3xl text-[13px] font-black uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-xl">
              Export Official Report
           </button>
        </div>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      {/* High-Impact Kpi Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <ImpactCard label="Total Registered Members" value={totalDonors} color="text-tf-purple" trend="Stable" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
        <ImpactCard label="Active Philanthropists" value={activeDonors} color="text-tf-green" trend="Verified" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <ImpactCard label="Cumulative Donations" value={`LKR ${totalRaised.toLocaleString()}`} color="text-tf-primary" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2a9 9 0 1118 0" /></svg>} />
        <ImpactCard label="Average Gift Size" value={`LKR ${Math.round(avgDonation).toLocaleString()}`} color="text-blue-500" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Support Base Breakdown */}
        <div className="lg:col-span-3 bg-[#0f041a] rounded-[4rem] p-16 shadow-2xl relative overflow-hidden group text-white border border-white/5 space-y-12">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-tf-primary/5 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-tf-primary/10 blur-[90px] -mr-32 -mt-32" />
          <div className="space-y-1 relative z-10">
             <h3 className="text-3xl font-black italic uppercase tracking-tighter">Support Segments</h3>
             <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic font-sans">Member Distribution Analysis</p>
          </div>

          {segmentEntries.length === 0 ? (
            <p className="text-center py-24 text-[11px] font-black text-white/20 uppercase tracking-widest italic leading-relaxed">System state: Member activity insufficient for analysis.</p>
          ) : (
            <div className="space-y-12 relative z-10">
              {segmentEntries.map(([seg, count]) => {
                const meta = SEGMENT_META[seg] || { label: seg, bar: 'bg-slate-600', icon: '👤' };
                const pct  = Math.min(100, Math.round((count / maxCount) * 100));
                return (
                  <div key={seg} className="space-y-5 cursor-default group/seg">
                    <div className="flex items-center justify-between text-[11px] px-2">
                      <div className="flex items-center gap-4">
                         <span className="text-xl group-hover/seg:scale-125 transition-transform duration-500">{meta.icon}</span>
                         <span className="font-black text-white/60 uppercase tracking-[0.2em] group-hover/seg:text-white transition-colors">{meta.label}</span>
                      </div>
                      <span className="text-white/40 font-black tracking-widest font-mono group-hover/seg:text-tf-primary transition-colors">{count} MEMBERS • {pct}% REPRESENTATION</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                      <div
                        className={`h-full rounded-full transition-all duration-[2000ms] cubic-bezier(0.16, 1, 0.3, 1) ${meta.bar}`}
                        style={{ 
                          width: `${pct}%`,
                          boxShadow: `0 0 20px ${meta.bar.includes('pink') ? 'rgba(255,138,0,0.3)' : 'rgba(255,255,255,0.05)'}`
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Contributors Hub */}
        <div className="lg:col-span-2 space-y-8">
           <div className="flex items-center justify-between px-6">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] italic">Leading Contributors</h3>
              <span className="text-[10px] font-black text-tf-primary uppercase tracking-widest">Active Ranking</span>
           </div>
           <div className="bg-white rounded-[4rem] border border-slate-100 p-4 shadow-sm">
             <div className="bg-slate-50 rounded-[3rem] p-6 space-y-4">
                {donors.length === 0 ? (
                  <p className="text-center py-24 text-[10px] font-black text-slate-300 uppercase tracking-widest italic leading-relaxed px-10">Analyzing member contribution history…</p>
                ) : (
                  [...donors]
                    .sort((a, b) => (b.analytics?.totalDonated || 0) - (a.analytics?.totalDonated || 0))
                    .slice(0, 7)
                    .map((d, i) => {
                      const meta = SEGMENT_META[d.segment] || { label: d.segment || 'Member', icon: '👤' };
                      return (
                        <div
                          key={d._id}
                          className="flex items-center justify-between p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-tf-primary/30 hover:shadow-xl hover:shadow-tf-purple/5 transition-all cursor-pointer group"
                          onClick={() => navigate(`/admin/donors/${d._id}`)}
                        >
                          <div className="flex items-center gap-6">
                             <div className="text-sm font-black text-slate-200 italic group-hover:text-tf-primary transition-colors">#{i + 1}</div>
                             <div className="min-w-0">
                               <p className="text-[13px] font-black text-tf-purple tracking-tight group-hover:text-tf-primary transition-colors truncate">
                                 {d.userId?.name || 'Verified Member'}
                               </p>
                               <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{meta.label}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-200" />
                                  <span className="text-[9px] font-black text-tf-green uppercase tracking-widest">{d.analytics?.retentionScore ?? 0}% Rel.</span>
                               </div>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-black text-tf-purple tracking-tighter tabular-nums italic group-hover:scale-110 transition-transform origin-right">LKR {(d.analytics?.totalDonated || 0).toLocaleString()}</p>
                          </div>
                        </div>
                      );
                    })
                )}
             </div>
           </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>
    </div>
  );
}

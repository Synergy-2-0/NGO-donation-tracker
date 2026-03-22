import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminDonor } from '../../context/AdminDonorContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';

function StatCard({ label, value, trend, trendColor = 'text-tf-green', icon, colorCls }) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm hover:shadow-2xl transition-all duration-700 group relative overflow-hidden flex flex-col justify-between h-56">
      <div className={`absolute top-0 right-0 w-32 h-32 ${colorCls} opacity-[0.03] blur-[60px] -mr-16 -mt-16 group-hover:opacity-10 transition-opacity`} />
      <div className="flex justify-between items-start mb-auto relative z-10">
         <div className={`p-4 rounded-2xl ${colorCls} bg-opacity-10 text-sm font-black transition-all group-hover:bg-tf-purple group-hover:text-white group-hover:scale-110 shadow-sm border border-white/10`}>
            {icon}
         </div>
         {trend && (
           <span className={`text-[10px] font-black ${trendColor} bg-opacity-10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-current shadow-sm`}>
             {trend}
           </span>
         )}
      </div>
      <div className="relative z-10 space-y-3">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1 italic leading-none">{label}</p>
        <p className="text-3xl lg:text-4xl font-black tracking-tighter text-tf-purple group-hover:text-tf-primary transition-colors tabular-nums">{value}</p>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { donors, segments, loading, error, fetchDonors, fetchSegments } = useAdminDonor();

  useEffect(() => {
    fetchDonors().catch(() => {});
    fetchSegments().catch(() => {});
  }, [fetchDonors, fetchSegments]);

  const activeDonors = donors.filter(d => d.status === 'active').length;
  const totalRaised = donors.reduce((sum, d) => sum + (d.analytics?.totalDonated || 0), 0);
  const avgDonation = donors.length > 0 ? totalRaised / donors.length : 0;

  if (loading && donors.length === 0) return <LoadingSpinner />;

  return (
    <div className="space-y-12 animate-fade-in max-w-[1700px] mx-auto pb-24 font-sans selection:bg-tf-primary selection:text-white">
      
      {/* Professional Admin Header */}
      <div className="relative p-12 lg:p-20 bg-tf-purple rounded-[4rem] overflow-hidden shadow-2xl group text-white border border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600')] opacity-5 blur-sm scale-110 group-hover:scale-100 transition-transform duration-1000 grayscale" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-tf-primary/10 blur-[130px] -mr-48 -mb-48 opacity-40 animate-pulse" />
        <div className="relative z-10 space-y-8 max-w-4xl">
           <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-tf-green shadow-[0_0_20px_rgba(34,197,94,0.8)] animate-pulse" />
              <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic opacity-60">Operations Management Panel</p>
           </div>
           <h1 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase italic leading-tight text-white italic tracking-tight">
              Control <span className="text-tf-primary">Center </span> Dashboard
           </h1>
           <div className="flex gap-6 pt-6">
              <button onClick={() => navigate('/admin/donors')} className="px-12 py-6 bg-white text-tf-purple rounded-3xl text-[12px] font-black uppercase tracking-[0.2em] transform active:scale-95 transition-all hover:bg-tf-primary hover:text-white shadow-2xl shadow-tf-purple/10">
                Manage members
              </button>
              <button 
                onClick={() => navigate('/admin/donor-analytics')} 
                className="px-12 py-6 bg-white/5 backdrop-blur-xl border-2 border-white/10 hover:border-tf-primary hover:bg-white hover:text-tf-purple rounded-3xl text-[12px] font-black uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-xl"
              >
                View reports
              </button>
           </div>
        </div>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Primary Metrics Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          label="Total Registered members" 
          value={donors.length} 
          trend="+12% Gain" 
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} 
          colorCls="text-tf-purple"
        />
        <StatCard 
          label="Active Philanthropists" 
          value={activeDonors} 
          trend="89% Engagement" 
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
          colorCls="text-tf-green"
        />
        <StatCard 
          label="Cumulative Contribution" 
          value={`LKR ${totalRaised.toLocaleString()}`} 
          trend="Secure High" 
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
          colorCls="text-tf-primary"
        />
        <StatCard 
          label="Average Gift size" 
          value={`LKR ${Math.round(avgDonation).toLocaleString()}`} 
          trend="Stable" 
          trendColor="text-blue-500"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} 
          colorCls="text-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Platform Activity */}
        <div className="bg-[#0f041a] rounded-[4rem] p-16 shadow-2xl relative overflow-hidden group text-white border border-white/5 space-y-12">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-tf-primary/5 to-transparent pointer-events-none" />
          <div className="space-y-1 relative z-10">
             <h3 className="text-3xl font-black italic uppercase tracking-tighter">Activity Log</h3>
             <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic font-sans">Humanitarian Engagement Real-Time Stream</p>
          </div>
          
          <div className="space-y-8 relative z-10">
            {[
              { type: 'DONOR_JOIN', label: 'New Member Registered', donor: 'Johnathan Smith', time: '2m ago' },
              { type: 'PLEDGE_INIT', label: 'Commitment Initiated', donor: 'Global Relief Org', time: '14m ago' },
              { type: 'SYS_SYNC', label: 'Impact Data Synchronized', donor: 'System Ops', time: '1h ago' },
              { type: 'FUND_RX', label: 'Contribution Received', donor: 'Anonymous Partner', time: '3h ago' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-6 rounded-[2.5rem] bg-white/5 border border-white/5 group/log hover:bg-white/[0.08] hover:border-tf-primary/30 hover:shadow-xl hover:shadow-tf-purple/5 transition-all cursor-default">
                 <div className="flex items-center gap-6">
                    <div className="w-3 h-3 rounded-full bg-tf-primary/40 group-hover/log:bg-tf-primary transition-colors" />
                    <div className="space-y-1">
                       <p className="text-[13px] font-black tracking-tight text-white/90">{log.label}</p>
                       <p className="text-[10px] font-black text-tf-primary uppercase tracking-widest">{log.donor}</p>
                    </div>
                 </div>
                 <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cause Distribution Heatmap */}
        <div className="bg-white rounded-[4rem] border border-slate-100 p-16 shadow-sm space-y-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-tf-purple/5 blur-[80px] -mr-32 -mt-32" />
          <div className="space-y-1 relative z-10">
             <h3 className="text-3xl font-black italic uppercase tracking-tighter text-tf-purple">Cause Support</h3>
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic font-sans">Global Distribution of Member Interest</p>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            {[
              { name: 'Education Relief', pct: 45, color: 'bg-tf-purple' },
              { name: 'Pure Water Access', pct: 23, color: 'bg-blue-400' },
              { name: 'Global Health', pct: 18, color: 'bg-tf-green' },
              { name: 'Sustainable Tech', pct: 14, color: 'bg-tf-primary' },
            ].map(item => (
              <div key={item.name} className="p-8 rounded-[3rem] bg-slate-50 border border-slate-100 hover:border-tf-primary/30 hover:bg-white transition-all group/item">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 group-hover/item:text-tf-primary transition-colors leading-none">{item.name}</p>
                 <div className="flex items-end justify-between">
                    <span className="text-4xl font-black text-tf-purple tracking-tighter italic">{item.pct}%</span>
                    <div className={`h-1.5 w-16 ${item.color} rounded-full opacity-60 group-hover/item:opacity-100 transition-opacity mb-2`} />
                 </div>
              </div>
            ))}
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

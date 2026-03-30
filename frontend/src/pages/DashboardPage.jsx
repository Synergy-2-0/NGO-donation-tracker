import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDonor } from '../context/DonorContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const statusBadgeStyle = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
  pending: 'bg-amber-50 text-amber-600 border-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.1)]',
  cancelled: 'bg-rose-50 text-rose-600 border-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.1)]',
  fulfilled: 'bg-tf-primary/10 text-tf-primary border-tf-primary/20',
};

function PremiumStatCard({ label, value, icon, subtext, color, delay, trend }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden bg-white px-10 py-12 rounded-[4rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 group flex flex-col justify-between h-full"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 blur-[50px] -mr-16 -mt-16 group-hover:bg-tf-primary/5 transition-colors duration-700 pointer-events-none" />
      
      <div className="relative z-10 flex justify-between items-start gap-6">
        <div className="space-y-8 flex-1">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-tf-primary shadow-[0_0_10px_rgba(255,138,0,1)] animate-bounce" />
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] leading-none italic">{label}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className={`text-4xl font-black tracking-tighter tabular-nums leading-none italic ${color}`}>{value ?? '0'}</h3>
            {trend && (
              <div className="flex items-center gap-2 pt-2">
                 <div className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center">
                    <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 15l7-7 7 7" /></svg>
                 </div>
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{trend} Increase</span>
              </div>
            )}
          </div>

          <p className="text-[9px] text-slate-300 uppercase font-black tracking-[0.3em] leading-none italic">{subtext}</p>
        </div>

        <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-200 group-hover:text-tf-primary group-hover:bg-slate-950 group-hover:border-slate-950 group-hover:rotate-6 transition-all duration-700 shadow-inner group-hover:shadow-xl">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { donorProfile, transactions, pledges, analytics, loading, fetchProfile, fetchTransactions, fetchPledges, fetchAnalytics } = useDonor();

  useEffect(() => {
    const load = async () => {
      try {
        const profile = donorProfile || (await fetchProfile());
        if (profile?._id) {
          fetchTransactions(profile._id).catch(() => {});
          fetchPledges(profile._id).catch(() => {});
          fetchAnalytics(profile._id).catch(() => {});
        }
      } catch {
        // silence
      }
    };
    load();
  }, [donorProfile, fetchProfile, fetchTransactions, fetchPledges, fetchAnalytics]);

  const activePledgesCount = pledges.filter(p => p.status === 'active').length;

  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [
        { name: 'Cycle 01', impact: 0 },
        { name: 'Cycle 02', impact: 0 },
        { name: 'Cycle 03', impact: 0 },
        { name: 'Cycle 04', impact: 0 },
        { name: 'Cycle 05', impact: 0 },
      ];
    }
    return transactions.slice(-6).map((tx, idx) => ({
      name: `Cycle ${idx + 1}`,
      impact: tx.amount,
    }));
  }, [transactions]);

  if (loading && !donorProfile) return <LoadingSpinner />;

  return (
    <div className="space-y-12 max-w-[1700px] mx-auto pb-32 font-sans selection:bg-tf-primary selection:text-white pt-8">
      
      {/* Cinematic Identity Header */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="bg-slate-950 rounded-[4rem] p-16 text-white relative overflow-hidden shadow-2xl border border-white/5 group"
      >
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-tf-primary/10 blur-[150px] -mr-60 -mt-60 animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-tf-accent/5 blur-[120px] -ml-48 -mb-48 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-20">
           <div className="space-y-12">
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-tf-primary shadow-[0_0_15px_rgba(255,138,0,1)] animate-bounce" />
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.7em] leading-none italic">Institutional Protcols Active 2.0</p>
                 </div>
                 <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none italic lowercase text-stroke-white opacity-90 transition-opacity hover:opacity-100">
                    Mission Control: <span className="text-tf-primary not-italic font-black ">{user?.name?.split(' ')[0] || 'Member'}</span>
                 </h1>
              </div>
              <p className="text-lg md:text-xl text-white/40 max-w-2xl leading-relaxed italic font-medium">
                 Comprehensive synchronization of your humanitarian capital flows. 
                 Real-time verification through the <span className="text-white/60">TransFund Secure Network.</span>
              </p>
              
              <div className="flex flex-wrap gap-8 pt-4">
                 <button 
                   onClick={() => navigate('/causes')}
                   className="px-16 py-7 bg-white text-slate-950 text-[12px] font-black uppercase tracking-[0.5em] rounded-[2rem] hover:bg-tf-primary hover:text-white transition-all duration-700 shadow-3xl active:scale-95 group italic"
                 >
                    Authorize Capital Flow <span className="group-hover:translate-x-4 transition-all duration-500 inline-block ml-4">→</span>
                 </button>
                 <button 
                    onClick={() => navigate('/pledges')}
                    className="px-16 py-7 bg-white/5 backdrop-blur-2xl border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.5em] rounded-[2rem] hover:bg-white/10 transition-all duration-700 active:scale-95 italic"
                 >
                    Strategy Node Registry
                 </button>
              </div>
           </div>

           {/* Pulse Dynamics Visualization */}
           <div className="hidden xl:block w-[450px] h-[350px] bg-white/5 rounded-[4rem] border border-white/10 p-12 backdrop-blur-sm relative overflow-hidden group/viz shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-br from-tf-primary/10 to-transparent pointer-events-none" />
              <div className="relative z-10 space-y-10 flex flex-col justify-between h-full">
                 <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] italic">Impact Pulse</p>
                      <p className="text-xl font-black italic text-tf-primary">Operational.</p>
                    </div>
                    <div className="flex items-end gap-1.5 h-6">
                       {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 bg-tf-primary/30 rounded-full animate-bounce" style={{ height: `${i*20}%`, animationDelay: `${i*0.15}s` }} />)}
                    </div>
                 </div>
                 
                 <div className="h-40 flex items-end gap-3 group-hover/viz:gap-4 transition-all duration-700 pr-2">
                    {[35, 65, 40, 95, 75, 100, 55, 85].map((h, i) => (
                       <motion.div 
                          key={i} 
                          initial={{ height: 0 }} 
                          animate={{ height: `${h}%` }}
                          transition={{ delay: 0.8 + (i * 0.1), duration: 1.5, ease: "circOut" }}
                          className="flex-1 bg-gradient-to-t from-tf-primary/5 via-tf-primary/40 to-tf-primary/80 rounded-t-xl group-hover/viz:to-white transition-all duration-1000"
                       />
                    ))}
                 </div>
                 <div className="flex justify-between items-center pt-6 border-t border-white/5">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] italic">X-Ref: TRANSFUND_SEC_HUB</p>
                   <div className="w-4 h-1 bg-tf-primary rounded-full animate-pulse" />
                 </div>
              </div>
           </div>
        </div>
      </motion.section>

      {/* Strategic Intelligence Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-8">
        <PremiumStatCard
          label="Cumulative Intake"
          value={`LKR ${(analytics?.totalDonated || 0).toLocaleString()}`}
          color="text-slate-950"
          delay={0.1}
          subtext="Verified Capital Transfer"
          trend="12.5%"
          icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2a9 9 0 1118 0" /></svg>}
        />
        <PremiumStatCard
          label="Impact Milestone Cycles"
          value={analytics?.donationCount || 0}
          color="text-slate-950"
          delay={0.2}
          subtext="Verified Support Events"
          icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
        />
        <PremiumStatCard
          label="Active Pledges Registry"
          value={activePledgesCount}
          color="text-slate-950"
          delay={0.3}
          subtext="Strategic Commitments"
          trend={`${activePledgesCount} Strategy Nodes`}
          icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
        <PremiumStatCard
          label="Humanitarian Trust Score"
          value={`${analytics?.retentionScore || 0}%`}
          color="text-tf-primary"
          delay={0.4}
          subtext="Credential Ranking"
          icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 px-8 items-stretch">
        {/* Visualized Logistics Hub */}
        <div className="xl:col-span-2 bg-white rounded-[4rem] p-16 border border-slate-100 shadow-sm space-y-16 flex flex-col justify-between group overflow-hidden relative transition-all duration-700 hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-50 blur-[120px] -mr-40 -mt-40 pointer-events-none group-hover:bg-tf-primary/5 transition-colors duration-1000" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-tf-primary" />
                    <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.6em] leading-none italic">Asset Flow Visualization</p>
                 </div>
                 <h3 className="text-3xl font-black text-slate-950 tracking-tighter italic lowercase">Impact <span className="not-italic text-slate-400">Tactical Hub.</span></h3>
              </div>
             <div className="flex gap-6">
                <button className="px-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-slate-950 hover:bg-white hover:border-slate-200 transition-all duration-500 active:scale-95 italic">Inbound Feed</button>
                <button className="px-8 py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-2xl active:scale-95 shadow-slate-950/20 hover:bg-tf-primary italic duration-700">Operational Matrix</button>
             </div>
          </div>
          
          <div className="h-[450px] w-full relative z-10 pt-4">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData}>
                 <defs>
                   <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#FF8A00" stopOpacity={0.4}/>
                     <stop offset="95%" stopColor="#FF8A00" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" hide />
                 <YAxis hide />
                 <Tooltip 
                    contentStyle={{ borderRadius: '32px', border: 'none', background: '#0F172A', color: '#fff', fontSize: '10px', padding: '20px 32px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.2em', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', fontStyle: 'italic' }}
                 />
                 <Area 
                    type="monotone" 
                    dataKey="impact" 
                    stroke="#FF8A00" 
                    strokeWidth={6}
                    fillOpacity={1} 
                    fill="url(#colorImpact)" 
                    animationDuration={2500}
                    animationEasing="ease-in-out"
                 />
               </AreaChart>
             </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-12 border-t border-slate-100 relative z-10">
             {[
                { l: 'Authorized Missions', v: 'Browse Registry', to: '/causes' },
                { l: 'Capital Ledger', v: 'Tactical Logs', to: '/donations' },
                { l: 'Identity Profile', v: 'Security Sync', to: '/profile' },
                { l: 'Synergy Matrix', v: 'Verified Partners', to: '/partners/list' }
             ].map(i => (
                <button 
                  key={i.l}
                  onClick={() => navigate(i.to)}
                  className="space-y-2 group/btn text-left hover:translate-x-2 transition-all duration-500"
                >
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] leading-none mb-2 group-hover/btn:text-tf-primary transition-colors italic">{i.l}</p>
                   <p className="text-base font-black text-slate-950 italic tracking-tight transition-all duration-500 group-hover/btn:scale-105 origin-left">{i.v} <span className="group-hover/btn:translate-x-2 inline-block transition-transform">→</span></p>
                </button>
             ))}
          </div>
        </div>

        {/* Tactical Strategy Matrix */}
        <div className="bg-white rounded-[4rem] border border-slate-100 p-16 shadow-sm flex flex-col space-y-16 relative overflow-hidden group/strategy transition-all duration-700 hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 blur-[60px] -mr-24 -mt-24 pointer-events-none group-hover/strategy:bg-tf-primary/10 transition-colors duration-1000" />
          
          <div className="flex items-center justify-between border-b border-slate-50 pb-10 relative z-10">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-tf-primary" />
                    <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.5em] leading-none italic">Execution Registry</p>
                 </div>
                 <h3 className="text-2xl font-black text-slate-950 tracking-tighter italic lowercase leading-none">Strategy <span className="text-slate-400 not-italic">Matrix.</span></h3>
              </div>
             <Link to="/pledges" className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-200 hover:text-tf-primary hover:bg-white hover:border-tf-primary/20 hover:scale-110 transition-all duration-500 shadow-sm active:scale-90">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
             </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pr-2 space-y-6">
            {pledges.length > 0 ? pledges.slice(0, 7).map((pledge, idx) => (
              <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 whileHover={{ x: 12 }}
                 className="flex items-center justify-between p-8 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 hover:border-tf-primary/20 hover:bg-white transition-all duration-700 group/row shadow-sm hover:shadow-xl"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 text-white flex items-center justify-center shadow-2xl group-hover/row:bg-tf-primary group-hover/row:rotate-12 transition-all duration-700 font-black italic text-xl">
                     {pledge.frequency?.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-black text-slate-950 tabular-nums italic group-hover/row:text-tf-primary transition-colors transition-all duration-500 leading-none">LKR {Number(pledge.amount).toLocaleString()}</p>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] italic leading-none">{pledge.frequency} Implementation</p>
                  </div>
                </div>
                <span className={`px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border transition-all duration-700 italic shadow-sm group-hover/row:scale-110 ${statusBadgeStyle[pledge.status] || 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                  {pledge.status}
                </span>
              </motion.div>
            )) : (
              <div className="py-24 text-center space-y-8">
                 <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2rem] mx-auto flex items-center justify-center text-slate-100 transition-all duration-1000 group-hover/strategy:scale-110 group-hover/strategy:rotate-12">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <p className="text-[11px] text-slate-300 font-black uppercase tracking-[0.5em] italic leading-relaxed px-12">Strategy matrix offline. Protocol requires manual philanthropic initialization Hub.</p>
              </div>
            )}
          </div>

          <button 
             onClick={() => navigate('/pledges')}
             className="w-full py-8 bg-slate-950 hover:bg-tf-primary text-white text-[12px] font-black uppercase tracking-[0.6em] rounded-full transition-all duration-700 shadow-3xl active:scale-95 mt-6 italic"
          >
             Initialize Strategy Protocol
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(15,23,42,0.05); 
          border-radius: 10px; 
          transition: background 0.3s;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(255,138,0,0.1); }
        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 2s linear infinite;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>
    </div>
  );
}

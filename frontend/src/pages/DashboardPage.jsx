import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDonor } from '../context/DonorContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

function MetricCard({ label, value, colorCls, icon, trend }) {
  return (
    <div className="bg-white rounded-[3.5rem] border border-slate-100 p-12 shadow-sm hover:shadow-2xl transition-all duration-700 group relative overflow-hidden flex flex-col justify-between h-72">
      <div className={`absolute top-0 right-0 w-32 h-32 ${colorCls} opacity-[0.03] blur-[60px] -mr-16 -mt-16 group-hover:opacity-10 transition-opacity`} />
      <div className="flex justify-between items-start mb-auto relative z-10">
         <div className={`p-4 rounded-2xl ${colorCls} bg-opacity-10 text-sm font-black transition-all group-hover:bg-tf-purple group-hover:text-white group-hover:scale-110 shadow-sm border border-white/10`}>
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
        <p className="text-4xl lg:text-5xl font-black tracking-tighter text-tf-purple group-hover:text-tf-primary transition-colors tabular-nums">{value}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { donorProfile, transactions, pledges, loading, error, fetchProfile, fetchTransactions, fetchPledges } = useDonor();

  useEffect(() => {
    const load = async () => {
      try {
        const profile = donorProfile || (await fetchProfile());
        if (profile?._id) {
          fetchTransactions(profile._id).catch(() => {});
          fetchPledges(profile._id).catch(() => {});
        }
      } catch {
        // handle or redirect
      }
    };
    load();
  }, [donorProfile, fetchProfile, fetchTransactions, fetchPledges]);

  const totalDonated = transactions.reduce((sum, t) => sum + (t.status === 'completed' ? t.amount : 0), 0);
  const activePledges = pledges.filter(p => p.status === 'active').length;

  if (loading && !donorProfile) return <LoadingSpinner />;

  return (
    <div className="space-y-12 animate-fade-in max-w-[1700px] mx-auto pb-24 font-sans selection:bg-tf-primary selection:text-white">
      
      {/* Cinematic Donor Header */}
      <div className="relative p-12 lg:p-20 bg-tf-purple rounded-[4rem] overflow-hidden shadow-2xl group text-white border border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=1600')] opacity-5 blur-sm scale-110 group-hover:scale-100 transition-transform duration-1000 grayscale" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-tf-primary/10 blur-[130px] -mr-40 -mb-40 opacity-40 animate-pulse" />
        <div className="relative z-10 space-y-8 max-w-4xl">
           <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-tf-primary shadow-[0_0_20px_rgba(255,138,0,0.8)] animate-pulse" />
              <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic opacity-60">Welcome back to TrustFund</p>
           </div>
           <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-none truncate max-w-full italic tracking-tight">
              Hello, <span className="text-tf-primary">{user?.name?.split(' ')[0] || 'Friend'}</span>
           </h1>
           <p className="text-xl lg:text-2xl font-black text-white/50 tracking-tight leading-relaxed italic uppercase max-w-2xl">
              Thank you for your continued support. Together, we are creating measurable change in local communities.
           </p>
        </div>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Impact Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 px-4">
        <MetricCard label="Total Impact Portfolio" value={`LKR ${totalDonated.toLocaleString()}`} colorCls="text-tf-primary" trend="Top 10%" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <MetricCard label="Active Commitments" value={activePledges} colorCls="text-tf-purple" trend="Stable" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <MetricCard label="Global Influence" value="7.4X" colorCls="text-tf-green" trend="Impact Multiplier" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Quick Actions Console */}
        <div className="bg-[#0f041a] rounded-[4rem] p-16 shadow-2xl relative overflow-hidden group text-white border border-white/5 space-y-12">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-tf-primary/10 to-transparent pointer-events-none" />
          <div className="space-y-1 relative z-10">
             <h3 className="text-3xl font-black italic uppercase tracking-tighter">Support Center</h3>
             <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic font-sans">Empowering Humanitarian Action</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
            {[
              { 
                label: 'Start a Pledge', 
                desc: 'Identify a cause to support', 
                icon: (
                  <svg className="w-5 h-5 text-tf-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ), 
                to: '/causes' 
              },
              { 
                label: 'My Impact History', 
                desc: 'View donation registry', 
                icon: (
                  <svg className="w-5 h-5 text-tf-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ), 
                to: '/donations' 
              },
              { 
                label: 'Personal Information', 
                desc: 'Manage your profile', 
                icon: (
                  <svg className="w-5 h-5 text-tf-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ), 
                to: '/profile' 
              },
              { 
                label: 'Explore Our Causes', 
                desc: 'Find new initiatives', 
                icon: (
                  <svg className="w-5 h-5 text-tf-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                ), 
                to: '/' 
              },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => navigate(item.to)}
                className="flex flex-col items-start p-8 rounded-[2.5rem] bg-white/5 border border-white/5 group/item hover:bg-white hover:border-tf-primary hover:shadow-2xl transition-all text-left transform active:scale-95"
              >
                 <span className="text-3xl mb-10 group-hover/item:scale-125 transition-transform duration-500">{item.icon}</span>
                 <p className="text-[14px] font-black text-white group-hover/item:text-tf-purple transition-colors italic leading-none mb-2">{item.label}</p>
                 <p className="text-[10px] font-black text-white/20 group-hover/item:text-tf-purple/40 uppercase tracking-widest">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Support Focus Distribution */}
        <div className="bg-white rounded-[4rem] border border-slate-100 p-16 shadow-sm space-y-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-tf-primary/5 blur-[80px] -mr-32 -mt-32" />
          <div className="space-y-1 relative z-10">
             <h3 className="text-3xl font-black italic uppercase tracking-tighter text-tf-purple">Impact Reach</h3>
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic font-sans">Active Donation Interest Areas</p>
          </div>

          <div className="space-y-8 relative z-10">
            {donorProfile?.preferredCauses?.length > 0 ? (
              donorProfile.preferredCauses.map(cause => (
                <div key={cause} className="group/bar cursor-default">
                  <div className="flex justify-between items-end mb-3 px-2">
                    <p className="text-[11px] font-black text-tf-purple uppercase tracking-[0.2em] italic group-hover/bar:text-tf-primary transition-colors">#{cause.toUpperCase()}</p>
                    <span className="text-[10px] font-black tracking-widest text-slate-300 italic">Verified Support Focus</span>
                  </div>
                  <div className="h-1.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden p-0.5">
                    <div className="h-full bg-tf-purple w-full rounded-full transition-all duration-[1500ms] group-hover/bar:bg-tf-primary group-hover/bar:shadow-[0_0_15px_rgba(255,138,0,0.3)]" />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-24 text-center space-y-6">
                <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest italic max-w-sm mx-auto">
                   Please update your profile to highlight causes that matter most to you.
                </p>
                <button onClick={() => navigate('/profile')} className="text-[12px] font-black text-tf-primary uppercase tracking-widest hover:underline underline-offset-8">Update Focus Hub</button>
              </div>
            )}
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

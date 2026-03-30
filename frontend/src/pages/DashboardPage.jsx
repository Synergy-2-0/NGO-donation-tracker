import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useDonor } from '../context/DonorContext';
import LoadingSpinner from '../components/LoadingSpinner';

const analytics = {
  totalDonations: 4500000,
  totalCampaigns: 12,
  impactScore: 98
};

const statusBadgeStyle = {
  active: 'bg-green-50 text-green-600 border-green-100',
  pending: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  cancelled: 'bg-red-50 text-red-600 border-red-100',
};

function PremiumStatCard({ label, value, icon, trend, color, bg }) {
  return (
    <div className="relative overflow-hidden bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-4xl transition-all duration-500 group">
      <div className="flex justify-between items-start">
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic leading-none">{label}</p>
          <h3 className={`text-3xl font-black italic tracking-tighter tabular-nums font-display ${color}`}>{value ?? '—'}</h3>
          {trend && (
            <div className="flex items-center gap-2 pt-2">
              <span className={`text-[10px] font-black px-3 py-1 rounded-full italic ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
              <span className="text-[9px] text-slate-300 uppercase font-black tracking-widest italic leading-none">Monthly Flow</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${bg} text-white shadow-xl shadow-current transition-all group-hover:rotate-12 duration-700`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { donorProfile, transactions, pledges, loading, fetchProfile, fetchTransactions, fetchPledges } = useDonor();

  useEffect(() => {
    const load = async () => {
      try {
        const profile = donorProfile || (await fetchProfile());
        if (profile?._id) {
          fetchTransactions(profile._id).catch(() => {});
          fetchPledges(profile._id).catch(() => {});
        }
      } catch {
        // silence errors for demo
      }
    };
    load();
  }, [donorProfile, fetchProfile, fetchTransactions, fetchPledges]);

  const activePledgesCount = pledges.filter(p => p.status === 'active').length;

  if (loading && !donorProfile) return <LoadingSpinner />;

  return (
    <div className="space-y-16 animate-fade-in max-w-[1600px] mx-auto pb-24 font-sans selection:bg-tf-primary selection:text-white">
      
      {/* Cinematic Donor Header */}
      <div className="relative p-16 lg:p-24 bg-tf-dark rounded-[4rem] overflow-hidden shadow-5xl group text-white border border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=1600')] opacity-5 blur-sm scale-110 group-hover:scale-100 transition-transform duration-[20s] grayscale" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-tf-primary/10 blur-[150px] -mr-40 -mb-40 group-hover:bg-tf-primary/20 transition-all duration-1000" />
        <div className="relative z-10 space-y-10 max-w-4xl">
           <div className="flex items-center gap-4">
              <span className="w-3 h-3 rounded-full bg-tf-primary shadow-[0_0_20px_rgba(255,138,0,1)] animate-pulse" />
              <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.6em] italic leading-none">Official Registry Active • TransFund Node</p>
           </div>
           <h1 className="text-6xl lg:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] font-display">
              Patron <span className="text-tf-primary tracking-normal">{user?.name?.split(' ')[0] || 'Friend'}</span>
           </h1>
           <p className="text-xl lg:text-3xl font-medium text-white/50 tracking-tight leading-relaxed italic max-w-2xl">
              Initiating your humanitarian metrics. Every micro-contribution is tracked for absolute institutional transparency.
           </p>
        </div>
      </div>

      {/* Stats Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <PremiumStatCard
          label="Total Capital Flow"
          value={`LKR ${analytics.totalDonations.toLocaleString()}`}
          color="text-tf-dark"
          bg="bg-tf-dark"
          trend={12}
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <PremiumStatCard
          label="Active Missions Supported"
          value={analytics.totalCampaigns}
          color="text-tf-primary"
          bg="bg-tf-primary"
          trend={5}
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
        />
        <PremiumStatCard
          label="Active Direct Pledges"
          value={activePledgesCount}
          color="text-tf-dark"
          bg="bg-slate-300"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
        <PremiumStatCard
          label="Institutional Impact Score"
          value={`${analytics.impactScore}%`}
          color="text-tf-accent"
          bg="bg-tf-accent"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Quick Actions Console */}
        <div className="bg-tf-dark rounded-[4rem] p-16 shadow-5xl relative overflow-hidden group text-white border border-white/5 space-y-16">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-tf-primary/20 to-transparent pointer-events-none" />
          <div className="space-y-4 relative z-10">
             <h3 className="text-4xl font-black italic uppercase tracking-tighter italic font-display">Operational Console</h3>
             <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.5em] italic leading-none">Empowering Direct Humanitarian Action</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 relative z-10">
            {[
              { 
                label: 'Support Missions', 
                desc: 'Browse Active Registry', 
                icon: (
                  <svg className="w-6 h-6 text-tf-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ), 
                to: '/causes' 
              },
              { 
                label: 'Audit History', 
                desc: 'Personal Impact Ledger', 
                icon: (
                  <svg className="w-6 h-6 text-tf-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ), 
                to: '/donations' 
              },
              { 
                label: 'Node Settings', 
                desc: 'Identity Management', 
                icon: (
                  <svg className="w-6 h-6 text-tf-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ), 
                to: '/profile' 
              },
              { 
                label: 'Impact Map', 
                desc: 'Global Node Reach', 
                icon: (
                  <svg className="w-6 h-6 text-tf-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ), 
                to: '/impact' 
              },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => navigate(item.to)}
                className="flex flex-col items-start p-10 rounded-[3rem] bg-white/5 border border-white/5 group/item hover:bg-white hover:border-tf-primary hover:shadow-4xl transition-all duration-500 text-left active:scale-95"
              >
                 <span className="mb-10 group-hover/item:scale-125 transition-transform duration-700">{item.icon}</span>
                 <p className="text-xl font-black text-white group-hover/item:text-tf-dark transition-colors italic leading-none mb-3 font-display">{item.label}</p>
                 <p className="text-[10px] font-black text-white/30 group-hover/item:text-tf-dark/40 uppercase tracking-[0.2em] italic font-sans">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Pledges Overview */}
        <div className="bg-white rounded-[4rem] border border-slate-100 p-16 shadow-sm space-y-12 relative overflow-hidden group flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-tf-primary/10 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
          <div className="flex items-end justify-between relative z-10 pb-6 border-b border-slate-50">
             <div className="space-y-4">
                <p className="text-tf-primary text-[11px] font-black uppercase tracking-[0.6em] italic leading-none">Operational Metrics</p>
                <h3 className="text-4xl font-black italic uppercase tracking-tighter text-tf-dark font-display">Active Pledges</h3>
             </div>
             <Link to="/pledges" className="text-[11px] font-black italic tracking-[0.3em] uppercase text-tf-slate hover:text-tf-primary transition-colors underline underline-offset-8 decoration-slate-100">
               Audit Full Registry →
             </Link>
          </div>
          
          <div className="flex-1 overflow-x-auto pt-6">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] text-slate-400 uppercase tracking-[0.4em] font-black italic">
                  <th className="pb-8 px-4">Node Designation</th>
                  <th className="pb-8 px-4">Capital Allocation</th>
                  <th className="pb-8 px-4 text-center">Frequency</th>
                  <th className="pb-8 px-4">Registry State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-sans">
                {pledges.length > 0 ? pledges.slice(0, 5).map((pledge) => (
                  <tr key={pledge._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-tf-primary group-hover:scale-110 transition-transform duration-700 shadow-sm border border-slate-100">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          </div>
                          <span className="text-sm font-bold text-tf-dark italic uppercase tracking-tight">Humanitarian Mission</span>
                      </div>
                    </td>
                    <td className="py-6 px-4 font-black text-tf-dark italic text-lg tabular-nums tracking-tighter font-display">
                      LKR {Number(pledge.amount).toLocaleString()}
                    </td>
                    <td className="py-6 px-4 text-center">
                      <span className="px-4 py-1.5 bg-slate-100 text-tf-slate text-[9px] uppercase font-black tracking-widest rounded-full italic">
                          {pledge.frequency}
                      </span>
                    </td>
                    <td className="py-6 px-4">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic border ${statusBadgeStyle[pledge.status] || 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                        {pledge.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                      <td colSpan="4" className="py-20 text-center text-slate-300 font-black italic uppercase tracking-[0.4em] text-[10px]">No Active Pledges in Registry.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDonor } from '../context/DonorContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiHeart, FiActivity, FiDollarSign, FiZap, FiArrowRight, FiUser, FiClock, FiPlusCircle, FiList } from 'react-icons/fi';

const pledgeStatusColor = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  fulfilled: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  cancelled: 'bg-rose-50 text-rose-600 border-rose-100',
  pending: 'bg-amber-50 text-amber-600 border-amber-100',
};

function PremiumStatCard({ label, value, icon, color, bg }) {
  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-7 flex items-center justify-between gap-4 group hover:shadow-xl transition-all duration-300 relative overflow-hidden text-left">
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-slate-50 group-hover:scale-110 transition-transform opacity-60" />
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</p>
        <h3 className={`text-2xl font-black tracking-tight ${color}`}>{value ?? <span className="text-slate-200">—</span>}</h3>
      </div>
    </div>
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
          fetchAnalytics(profile._id).catch(() => { });
          fetchPledges(profile._id).catch(() => { });
        }
      } catch (e) { }
    };
    load();
  }, [fetchProfile, fetchAnalytics, fetchPledges]);

  if (loading && !donorProfile) return (
    <div className="py-20 flex justify-center">
      <LoadingSpinner message="Syncing donor intelligence..." />
    </div>
  );

  const activePledgesCount = pledges.filter((p) => p.status === 'active').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fadeIn text-left">
      {/* Header */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[.2em] text-slate-500 mb-2">Internal Registry</p>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Welcome, <span className="text-brand-red">{user?.name?.split(' ')[0] || 'Donor'}</span>
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl font-medium">Monitoring your philanthropic contributions and strategic impact scores across all active campaigns.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <PremiumStatCard
          label="Cumulative Donated"
          value={analytics?.totalDonations != null ? `LKR ${Number(analytics.totalDonations).toLocaleString()}` : null}
          color="text-slate-900"
          bg="bg-slate-900"
          icon={<FiDollarSign />}
        />
        <PremiumStatCard
          label="Mission Count"
          value={analytics?.totalCampaigns ?? null}
          color="text-brand-red"
          bg="bg-brand-red"
          icon={<FiActivity />}
        />
        <PremiumStatCard
          label="Active Pledges"
          value={pledges.length > 0 ? activePledgesCount : null}
          color="text-brand-orange"
          bg="bg-brand-orange shadow-brand-orange/20"
          icon={<FiZap />}
        />
        <PremiumStatCard
          label="Trust Score"
          value="98.4%"
          color="text-emerald-600"
          bg="bg-emerald-600"
          icon={<FiHeart />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Pledges Table Section */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-sm"><FiList /></span>
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Recent Pledges Node</h3>
            </div>
            <Link to="/pledges" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand-red hover:underline">
               Full Ledger <FiArrowRight />
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
             <table className="w-full">
               <thead>
                 <tr className="text-left text-[9px] text-slate-400 uppercase tracking-widest font-black border-b border-slate-50">
                    <th className="px-8 py-4">Synergy Node</th>
                    <th className="px-8 py-4">Inbound Liquidity</th>
                    <th className="px-8 py-4 text-center">Frequency</th>
                    <th className="px-8 py-4 text-right">Governance</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {pledges.length > 0 ? pledges.slice(0, 5).map((p) => (
                    <tr key={p._id} className="group hover:bg-slate-50/50 transition-colors">
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                             <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                <FiPlusCircle />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-slate-800 tracking-tight">Mission Support</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5 font-serif font-serif">Registry Entry</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-5">
                          <p className="text-sm font-black text-slate-900 tracking-tighter">LKR {Number(p.amount).toLocaleString()}</p>
                       </td>
                       <td className="px-8 py-5 text-center">
                          <span className="px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-tighter rounded-md">
                             {p.frequency}
                          </span>
                       </td>
                       <td className="px-8 py-5 text-right">
                          <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${pledgeStatusColor[p.status] || 'bg-slate-50'}`}>
                             {p.status}
                          </span>
                       </td>
                    </tr>
                  )) : (
                    <tr>
                       <td colSpan="4" className="px-8 py-20 text-center">
                          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-200">
                             <FiClock className="text-2xl" />
                          </div>
                          <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No Intelligence Detected.</p>
                       </td>
                    </tr>
                  )}
               </tbody>
             </table>
          </div>
        </div>

        {/* Audit & Quick Actions Panel */}
        <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden flex flex-col justify-between text-left">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
           
           <div className="relative z-10">
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
                <FiUser className="text-2xl text-slate-300" />
              </div>
              <h3 className="text-xl font-black tracking-tight mb-3">Identity Ops</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">Manage your donor credentials, security preferences, and synchronization nodes.</p>
              
              <div className="space-y-3">
                 <Link to="/profile" className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest transition-all group">
                    <span>Manage Profile Registry</span>
                    <FiArrowRight className="text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                 </Link>
                 <Link to="/pledges" className="w-full flex items-center justify-between p-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/30 rounded-2xl text-emerald-500 text-[10px] font-black uppercase tracking-widest transition-all group">
                    <span>Initiate New Pledge Node</span>
                    <FiArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                 </Link>
                 <Link to="/donations" className="w-full flex items-center justify-between p-4 bg-brand-red/10 hover:bg-brand-red/20 border border-brand-red/20 hover:border-brand-red/30 rounded-2xl text-brand-red text-[10px] font-black uppercase tracking-widest transition-all group">
                    <span>Access Historical Ledger</span>
                    <FiArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                 </Link>
              </div>
           </div>

           <div className="relative z-10 pt-8 mt-8 border-t border-white/5 flex items-end justify-between">
              <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Type</p>
                 <p className="text-sm font-bold text-slate-300">Strategic Philanthropy</p>
              </div>
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-[.2em]">
                 SYNERGY V2.4
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
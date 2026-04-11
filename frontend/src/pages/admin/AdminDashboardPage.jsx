import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminDonor } from '../../context/AdminDonorContext';
import { useAdminCampaign } from '../../context/AdminCampaignContext';
import { useAdminNgo } from '../../context/AdminNgoContext';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUsers, FiTarget, FiActivity, FiShield, FiArrowRight, 
  FiCheckCircle, FiXCircle, FiTrendingUp, FiBriefcase, 
  FiDollarSign, FiClock, FiSettings, FiGlobe, FiInfo
} from 'react-icons/fi';

const STATUS_COLORS = {
  active: 'bg-emerald-500',
  pending: 'bg-amber-500',
  completed: 'bg-indigo-500',
  rejected: 'bg-rose-500',
};

function TacticalStat({ label, value, icon, colorClass, delay = 0 }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay }}
      className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-tf-primary/5 transition-colors" />
      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-4">
          <div className={`w-14 h-14 rounded-2xl ${colorClass} text-white flex items-center justify-center text-xl shadow-lg shadow-slate-900/5 group-hover:scale-110 transition-transform duration-500`}>
            {icon}
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">{value}</h4>
          </div>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse self-start mt-1" />
      </div>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { donors, loading: loadingDonors, fetchDonors } = useAdminDonor();
  const { campaigns, loading: loadingCampaigns, fetchCampaigns } = useAdminCampaign();
  const { pendingNgos, loading: loadingNgos, fetchPendingNgos, approveNgo, rejectNgo } = useAdminNgo();

  useEffect(() => {
    fetchDonors().catch(() => {});
    fetchCampaigns().catch(() => {});
    fetchPendingNgos().catch(() => {});
  }, [fetchDonors, fetchCampaigns, fetchPendingNgos]);

  const stats = useMemo(() => [
    { label: 'Total Donors', value: donors.length, icon: <FiUsers />, colorClass: 'bg-tf-primary' },
    { label: 'Active Projects', value: campaigns.length, icon: <FiTarget />, colorClass: 'bg-orange-600' },
    { label: 'Funds Raised', value: `LKR ${(campaigns.reduce((s, c) => s + (c.raisedAmount || 0), 0) / 1000).toFixed(0)}K`, icon: <FiTrendingUp />, colorClass: 'bg-slate-900' },
    { label: 'Direct Impact', value: campaigns.length * 12, icon: <FiActivity />, colorClass: 'bg-emerald-500' },
  ], [donors, campaigns]);

  if ((loadingDonors || loadingCampaigns || loadingNgos) && donors.length === 0) {
    return <LoadingSpinner message="Synchronizing Registry HUB..." />;
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 pb-20 font-sans selection:bg-tf-primary selection:text-white pt-6 group/main">
      
      {/* Professional Command Header */}
      <section className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-10 md:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tf-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="space-y-6 flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-tf-primary text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-md">
               <FiShield className="animate-pulse" /> Platform Management Center
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Administrator <span className="text-tf-primary">Dashboard</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
              Real-time overview of community growth, project performance, and partner organizational approvals.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 shrink-0">
             {user?.role !== 'admin' && (
               <Link to="/admin/campaigns/create" className="px-8 py-4 bg-tf-primary text-white text-[11px] font-extrabold uppercase tracking-widest rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-tf-primary/20 active:scale-95 flex items-center gap-2">
                  Launch New Project <FiArrowRight />
               </Link>
             )}
             <button onClick={() => navigate('/settings')} className="p-4 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all active:scale-95">
                <FiSettings />
             </button>
          </div>
        </div>
      </section>

      {/* Main Statistics Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => <TacticalStat key={idx} {...s} delay={idx * 0.05} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Verification Center */}
        <div className="lg:col-span-12">
          <AnimatePresence>
            {pendingNgos.length > 0 ? (
               <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-orange-50 border border-orange-100 rounded-[2.5rem] p-10 space-y-10 shadow-sm relative overflow-hidden group/ngos">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-tf-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                 <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        <FiBriefcase className="text-tf-primary" /> Pending Organization Approvals
                      </h3>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Awaiting Verification Registry Hub</p>
                   </div>
                   <span className="px-5 py-2.5 bg-tf-primary text-white rounded-xl text-[10px] font-extrabold uppercase tracking-widest shadow-lg shadow-tf-primary/20 animate-pulse">
                      Action Required: {pendingNgos.length}
                   </span>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                   {pendingNgos.map(ngo => (
                     <div key={ngo._id} className="bg-white rounded-3xl p-8 border border-orange-100/50 shadow-sm hover:shadow-xl transition-all space-y-6 group/item">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-extrabold text-xl group-hover/item:bg-tf-primary group-hover/item:text-white transition-all duration-500">
                             {ngo.organizationName?.[0]}
                          </div>
                          <div>
                            <h4 className="text-sm font-extrabold text-slate-900 leading-none mb-1">{ngo.organizationName}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ngo.sectorFocus?.[0] || 'Community Service'}</p>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => approveNgo(ngo._id)} className="px-5 py-3 bg-emerald-500 text-white rounded-xl text-[9px] font-extrabold uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2 flex-1 shadow-lg shadow-emerald-500/10">
                             <FiCheckCircle /> Approve
                          </button>
                          <button onClick={() => rejectNgo(ngo._id)} className="px-5 py-3 bg-white border border-slate-200 text-slate-400 rounded-xl text-[9px] font-extrabold uppercase tracking-widest hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all flex-1">
                             Decline
                          </button>
                       </div>
                     </div>
                   ))}
                 </div>
               </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Quick Registry Table View */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mt-10">
            <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
                  <FiUsers className="text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight uppercase">Recent Donor Activity</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Member onboarding log Hub</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/admin/donors')} 
                className="px-6 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-[9px] font-extrabold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
              >
                View Full Registry
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-10 py-5 text-left text-[9px] font-extrabold text-slate-400 uppercase tracking-widest font-extrabold">Member Identity</th>
                    <th className="px-10 py-5 text-left text-[9px] font-extrabold text-slate-400 uppercase tracking-widest font-extrabold">Region</th>
                    <th className="px-10 py-5 text-left text-[9px] font-extrabold text-slate-400 uppercase tracking-widest font-extrabold">Total Giving</th>
                    <th className="px-10 py-5 text-right text-[9px] font-extrabold text-slate-400 uppercase tracking-widest font-extrabold">Actions</th>
                  </tr>
                </thead><tbody className="divide-y divide-slate-50">
                  {donors.slice(0, 5).map(donor => (
                    <tr key={donor._id} className="hover:bg-slate-50/30 transition-all group/row">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[11px] font-extrabold text-slate-400 group-hover/row:bg-tf-primary group-hover/row:text-white transition-all">
                             {donor.userId?.name?.[0]}
                          </div>
                          <div>
                            <p className="text-sm font-extrabold text-slate-900 group-hover/row:text-tf-primary transition-colors leading-none mb-1">{donor.userId?.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{donor.userId?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tight">
                           <FiGlobe className="text-slate-200" /> {donor.address?.city || 'Colombo'}, {donor.address?.country || 'LK'}
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="space-y-0.5">
                           <p className="text-base font-extrabold text-slate-900 tracking-tight tabular-nums group-hover/row:text-tf-primary transition-colors leading-none">
                              LKR {(donor.analytics?.totalDonated || 0).toLocaleString()}
                           </p>
                           <p className="text-[9px] font-extrabold text-slate-300 uppercase tracking-widest leading-none">verified intake</p>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover/row:translate-x-0 group-hover/row:opacity-100 transition-all duration-500">
                           <button onClick={() => navigate(`/admin/donors/${donor._id}`)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-tf-primary hover:border-tf-primary transition-all shadow-sm">
                              <FiArrowRight />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {donors.length === 0 && (
              <div className="p-20 text-center space-y-4">
                 <FiInfo className="mx-auto text-slate-200" size={48} />
                 <p className="text-slate-400 font-bold text-sm uppercase tracking-widest ">Awaiting community member data sync Hub.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

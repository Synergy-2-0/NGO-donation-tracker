import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePartner } from '../context/PartnerContext';
import { usePartnerOperations } from '../context/PartnerOperationsContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FiActivity, FiFileText, FiTarget, FiArrowRight, 
  FiCheckCircle, FiClock, FiShield, FiTrendingUp, FiLayers, FiAlertCircle 
} from 'react-icons/fi';

const asMoney = (val) => `LKR ${Number(val || 0).toLocaleString()}`;

export default function PartnerDashboardPage() {
  const { user } = useAuth();
  const { fetchPartnerById } = usePartner();
  const { fetchPartnerAgreements: fetchAgreements } = usePartnerOperations();
  
  const [partner, setPartner] = useState(null);
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const pData = await fetchPartnerById('me');
        setPartner(pData);
        if (pData?._id) {
            const aData = await fetchAgreements(pData._id);
            setAgreements(Array.isArray(aData) ? aData : []);
        }
      } catch (err) {
        console.error("Dashboard load error", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [fetchPartnerById, fetchAgreements]);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  const activeAgreements = agreements.filter(a => a.status === 'active');
  const pendingAgreements = agreements.filter(a => a.status === 'draft' || a.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fadeIn text-left">
      {/* Hero Welcome */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-slate-500 mb-2">Partner Overview</p>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              {partner?.organizationName || user?.name?.split(' ')[0]}
            </h2>
            <div className="flex items-center gap-3 mt-3">
               <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${partner?.verificationStatus === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                  {partner?.verificationStatus === 'verified' ? 'Verified Account' : 'Account Pending'}
               </span>
               <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  {partner?.organizationType || 'Organization'}
               </span>
            </div>
          </div>
          <Link to="/profile" className="px-6 py-3 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl shadow-white/5 active:scale-95">
            Manage Settings
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <MetricCard 
           label="Active Agreements" 
           value={activeAgreements.length} 
           sub="Partnerships in progress"
           icon={<FiActivity />} 
           color="text-emerald-600" 
           bg="bg-emerald-50" 
         />
         <MetricCard 
           label="Pending Requests" 
           value={pendingAgreements.length} 
           sub="Awaiting review"
           icon={<FiClock />} 
           color="text-amber-600" 
           bg="bg-amber-50" 
         />
         <MetricCard 
           label="Total Contributions" 
           value={asMoney(partner?.partnershipHistory?.totalContributed)} 
           sub="Lifetime donation total"
           icon={<FiTrendingUp />} 
           color="text-brand-red" 
           bg="bg-red-50" 
         />
         <MetricCard 
           label="Organization Health" 
           value={partner?.verificationStatus === 'verified' ? 'Excellent' : 'Pending'} 
           sub="Verification level"
           icon={<FiShield />} 
           color="text-slate-900" 
           bg="bg-slate-100" 
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Section */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-sm"><FiLayers /></span>
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Recent Activity</h3>
                </div>
                <Link to="/partner/agreements" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand-red hover:underline">
                   View All Agreements <FiArrowRight />
                </Link>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full">
                   <thead>
                      <tr className="text-left text-[9px] text-slate-400 uppercase tracking-widest font-black border-b border-slate-50">
                        <th className="px-8 py-4">Campaign</th>
                        <th className="px-8 py-4">Agreed Amount</th>
                        <th className="px-8 py-4 text-center">Status</th>
                        <th className="px-8 py-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {agreements.length > 0 ? agreements.slice(0, 5).map(a => (
                        <tr key={a._id} className="group hover:bg-slate-50/50 transition-colors">
                           <td className="px-8 py-5">
                              <div>
                                <p className="text-sm font-bold text-slate-800 tracking-tight">{a.campaignId?.title || 'Unknown Campaign'}</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Agreement Reference</p>
                              </div>
                           </td>
                           <td className="px-8 py-5">
                              <p className="text-sm font-black text-slate-900 tracking-tighter">{asMoney(a.totalValue)}</p>
                           </td>
                           <td className="px-8 py-5 text-center">
                              <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${a.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                 {a.status}
                              </span>
                           </td>
                           <td className="px-8 py-5 text-right">
                              <Link to={`/partner/agreements/${a._id}/milestones`} className="p-2.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                 <FiTarget className="text-sm" />
                              </Link>
                           </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="4" className="px-8 py-20 text-center">
                             <FiAlertCircle className="text-4xl text-slate-100 mx-auto mb-4" />
                             <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No Agreements Found.</p>
                          </td>
                        </tr>
                      )}
                   </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* Discovery Box */}
        <div className="space-y-6">
            <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden flex flex-col justify-between text-left group min-h-[400px]">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transform group-hover:scale-110 transition-transform duration-700" />
               
               <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
                    <FiTarget className="text-2xl text-brand-red" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight mb-3">Explore Campaigns</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-10 font-medium">Find active projects in need of funding and propose new partnerships today.</p>
                  
                  <div className="space-y-3">
                     <Link to="/marketplace" className="w-full flex items-center justify-between p-5 bg-brand-red/10 hover:bg-brand-red/20 border border-brand-red/20 border-brand-red/30 rounded-2xl text-brand-red text-[11px] font-black uppercase tracking-widest transition-all group">
                        <span>See All Campaigns</span>
                        <FiArrowRight className="transform group-hover:translate-x-1 transition-transform stroke-[3]" />
                     </Link>
                     <Link to="/partners" className="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl text-white text-[11px] font-black uppercase tracking-widest transition-all group">
                        <span>Partner Directory</span>
                        <FiArrowRight className="text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                     </Link>
                  </div>
               </div>

               <div className="relative z-10 mt-10 pt-8 border-t border-white/5 flex items-center justify-between font-bold">
                   <div className="flex items-center gap-2">
                      <FiCheckCircle className="text-emerald-500 text-xs" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Online</span>
                   </div>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, icon, color, bg }) {
  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-7 space-y-3 hover:shadow-xl transition-all group text-left relative overflow-hidden">
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-slate-50 group-hover:bg-slate-100 transition-colors opacity-50" />
      <div className="flex items-center justify-between relative z-10">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${bg} ${color}`}>
          {icon}
        </span>
      </div>
      <div className="relative z-10">
         <h3 className={`text-2xl font-black tracking-tight ${color}`}>{value}</h3>
         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wide mt-1">{sub}</p>
      </div>
    </div>
  );
}

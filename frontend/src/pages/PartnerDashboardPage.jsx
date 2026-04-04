import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePartner } from '../context/PartnerContext';
import { usePartnerOperations } from '../context/PartnerOperationsContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { 
  FiActivity, FiFileText, FiTarget, FiArrowRight, 
  FiCheckCircle, FiClock, FiShield, FiTrendingUp, FiLayers, FiAlertCircle 
} from 'react-icons/fi';

const asMoney = (val) => `LKR ${Number(val || 0).toLocaleString()}`;

export default function PartnerDashboardPage() {
  const { t } = useTranslation();
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

  if (loading) return <LoadingSpinner message={t('marketplace.loading')} />;

  const activeAgreements = agreements.filter(a => a.status === 'active');
  const pendingAgreements = agreements.filter(a => a.status === 'draft' || a.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fadeIn text-left">
      {/* Hero Welcome */}
      <div className="relative overflow-hidden bg-tf-dark rounded-[32px] p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-tf-primary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-slate-500 mb-2">{t('partner_dashboard.overview_badge')}</p>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              {partner?.organizationName || user?.name?.split(' ')[0]}
            </h2>
            <div className="flex items-center gap-3 mt-3">
               <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${partner?.verificationStatus === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                  {partner?.verificationStatus === 'verified' ? t('partner_dashboard.verified_badge') : t('partner_dashboard.pending_badge')}
               </span>
               <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  {partner?.organizationType || 'Organization'}
               </span>
            </div>
          </div>
          <Link to="/profile" className="px-6 py-3 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl shadow-white/5 active:scale-95">
            {t('partner_dashboard.manage_settings')}
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <MetricCard 
           label={t('partner_dashboard.active_agreements')} 
           value={activeAgreements.length} 
           sub={t('partner_dashboard.partnerships_in_progress')}
           icon={<FiActivity className="text-xl" />} 
           color="text-emerald-600" 
           bg="bg-emerald-500" 
           iconBg="bg-emerald-500"
         />
         <MetricCard 
           label={t('partner_dashboard.pending_requests')} 
           value={pendingAgreements.length} 
           sub={t('partner_dashboard.awaiting_review')}
           icon={<FiClock className="text-xl" />} 
           color="text-amber-600" 
           bg="bg-amber-500" 
           iconBg="bg-amber-500"
         />
         <MetricCard 
           label={t('partner_dashboard.total_contributions')} 
           value={asMoney(partner?.partnershipHistory?.totalContributed)} 
           sub={t('partner_dashboard.lifetime_total')}
           icon={<FiTrendingUp className="text-xl" />} 
           color="text-tf-primary" 
           bg="bg-tf-primary" 
           iconBg="bg-tf-primary"
         />
         <MetricCard 
           label={t('partner_dashboard.org_health')} 
           value={partner?.verificationStatus === 'verified' ? 'Excellent' : 'Pending'} 
           sub={t('partner_dashboard.verification_level')}
           icon={<FiShield className="text-xl" />} 
           color="text-slate-900" 
           bg="bg-slate-900" 
           iconBg="bg-slate-900"
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Section */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-sm"><FiLayers /></span>
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('partner_dashboard.recent_activity')}</h3>
                </div>
                <Link to="/partner/agreements" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand-red hover:underline">
                   {t('partner_dashboard.view_all')} <FiArrowRight />
                </Link>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full">
                   <thead>
                      <tr className="text-left text-[9px] text-slate-400 uppercase tracking-widest font-black border-b border-slate-50">
                        <th className="px-8 py-4">{t('partner_dashboard.table.campaign')}</th>
                        <th className="px-8 py-4">{t('partner_dashboard.table.amount')}</th>
                        <th className="px-8 py-4 text-center">{t('partner_dashboard.table.status')}</th>
                        <th className="px-8 py-4 text-right">{t('partner_dashboard.table.actions')}</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {agreements.length > 0 ? agreements.slice(0, 5).map(a => (
                        <tr key={a._id} className="group hover:bg-slate-50/50 transition-colors">
                           <td className="px-8 py-5">
                              <div>
                                <p className="text-sm font-bold text-slate-800 tracking-tight">{a.campaignId?.title || 'Unknown Campaign'}</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{t('partner_agreements.table.mission')}</p>
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
                             <p className="text-slate-400 font-black text-xs uppercase tracking-widest">{t('partner_dashboard.no_agreements')}</p>
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
            <div className="bg-tf-dark rounded-[40px] p-8 text-white relative overflow-hidden flex flex-col justify-between text-left group min-h-[400px]">
               <div className="absolute top-0 right-0 w-64 h-64 bg-tf-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transform group-hover:scale-110 transition-transform duration-700" />
               
               <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
                    <FiTarget className="text-2xl text-tf-primary" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight mb-3 uppercase italic">{t('partner_dashboard.discovery.title')}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-10 font-medium italic">{t('partner_dashboard.discovery.subtitle')}</p>
                  
                  <div className="space-y-3">
                     <Link to="/marketplace" className="w-full flex items-center justify-between p-6 bg-tf-primary text-white hover:bg-white hover:text-slate-950 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all group shadow-xl shadow-tf-primary/10 italic">
                        <span>{t('partner_dashboard.discovery.cta')}</span>
                        <FiArrowRight className="transform group-hover:translate-x-1 transition-transform stroke-[3]" />
                     </Link>
                  </div>
               </div>

               <div className="relative z-10 mt-10 pt-8 border-t border-white/5 flex items-center justify-between font-bold">
                   <div className="flex items-center gap-2">
                       <FiCheckCircle className="text-emerald-500 text-xs" />
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{t('partner_dashboard.discovery.online')}</span>
                   </div>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, icon, color, iconBg }) {
  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-7 space-y-3 hover:shadow-xl transition-all group text-left relative overflow-hidden">
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-slate-50 group-hover:bg-slate-100 transition-colors opacity-50" />
      <div className="flex items-center justify-between relative z-10">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <span className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 text-white shadow-lg ${iconBg || 'bg-slate-800'}`}>
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

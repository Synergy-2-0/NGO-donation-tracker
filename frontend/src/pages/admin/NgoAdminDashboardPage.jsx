import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdminCampaign } from '../../context/AdminCampaignContext';
import { usePartnerOperations } from '../../context/PartnerOperationsContext';
import { useFinance } from '../../context/FinanceContext';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { 
  FiTarget, FiShield, FiArrowRight, FiPlus, 
  FiActivity, FiFileText, FiTrendingUp, FiDollarSign, 
  FiChevronRight, FiPieChart, FiGlobe, FiInfo, FiUsers
} from 'react-icons/fi';
import { LuScale3D } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

function MetricCard({ label, value, icon, colorClass, sub, delay = 0 }) {
  const { t } = useTranslation();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${colorClass} opacity-5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity`} />
      <div className="relative z-10 flex flex-col justify-between h-full gap-5">
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 rounded-2xl ${colorClass.replace('bg-', 'text-')} bg-opacity-10 flex items-center justify-center text-xl`}>
            {icon}
          </div>
          <span className="text-[9px] font-extrabold text-slate-300 uppercase tracking-widest leading-none group-hover:text-slate-500 transition-colors">{t('ngo_dashboard.registry_node')}</span>
        </div>
        <div>
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
          <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">{value}</h4>
          {sub && <p className="text-[9px] font-bold text-slate-400 mt-2">{sub}</p>}
        </div>
      </div>
    </motion.div>
  );
}

export default function NgoAdminDashboardPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [ngoProfile, setNgoProfile] = useState(null);
    const { campaigns, loading: loadingCampaigns, fetchCampaigns } = useAdminCampaign();
    const { agreements, fetchAllAgreements } = usePartnerOperations();
    const { summary: financeSummary, transactions, fetchNgoMetrics, fetchNgoLedger } = useFinance();

    useEffect(() => {
        const load = async () => {
            try {
                await Promise.all([
                    fetchCampaigns(),
                    fetchAllAgreements(),
                    fetchNgoMetrics(),
                    fetchNgoLedger()
                ]);
            } catch (err) {
                console.error("Dashboard sync error:", err);
            }
        };
        load();
    }, [fetchCampaigns, fetchAllAgreements, fetchNgoMetrics, fetchNgoLedger]);

    const stats = useMemo(() => {
        const activeCount = campaigns.filter(c => c.status === 'active').length;
        const totalRaised = campaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0);
        
        return [
            { label: t('ngo_dashboard.active_projects'), value: activeCount, icon: <FiTarget />, colorClass: 'bg-tf-primary', sub: t('ngo_dashboard.verified_missions') },
            { label: t('ngo_dashboard.trust_rating'), value: `${financeSummary?.trustScore || 85}%`, icon: <FiShield />, colorClass: 'bg-orange-600', sub: t('ngo_dashboard.transparency_score') },
            { label: t('ngo_dashboard.total_raised'), value: `LKR ${totalRaised.toLocaleString()}`, icon: <FiTrendingUp />, colorClass: 'bg-slate-900', sub: t('ngo_dashboard.cumulative_intake') },
            { label: t('ngo_dashboard.treasury_balance'), value: `LKR ${(financeSummary?.availableFunds || 0).toLocaleString()}`, icon: <FiDollarSign />, colorClass: 'bg-emerald-500', sub: t('ngo_dashboard.allocated_projects') },
        ];
    }, [financeSummary, campaigns, t]);

    const recentAgreements = useMemo(() => agreements.slice(0, 5), [agreements]);
    const recentCampaigns = useMemo(() => campaigns.slice(0, 4), [campaigns]);

    if (loadingCampaigns && campaigns.length === 0) return <LoadingSpinner message={t('marketplace.loading')} />;

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20 font-sans animate-soft pt-6 text-left selection:bg-tf-primary selection:text-white">
            
            {/* NGO Command Center Header */}
            <section className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-10 md:p-14 shadow-2xl border border-white/5">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tf-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="space-y-6 flex-1">
                        <div className="inline-flex items-center gap-4">
                           {financeSummary?.status !== 'approved' ? (
                             <span className="flex items-center gap-2 px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-500 text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-md">
                                <FiShield className="text-sm shrink-0" /> {t('ngo_dashboard.verification_badge')}
                             </span>
                           ) : (
                             <span className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-md">
                                <FiShield className="text-sm shrink-0" /> MISSION AUTHORIZED
                             </span>
                           )}
                           <span className="text-[10px] font-extrabold text-white/30 uppercase tracking-[0.5em]">{t('ngo_dashboard.control_center')}</span>
                        </div>
                        
                        <div className="space-y-2">
                           <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tighter leading-none">
                              {t('ngo_dashboard.welcome')}, <span className="text-tf-primary">{user?.name?.split(' ')[0]}</span>
                           </h1>
                           <p className="text-white/50 text-base md:text-lg font-medium max-w-xl leading-relaxed">
                              {t('ngo_dashboard.tagline')}
                           </p>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                           <button onClick={() => navigate('/admin/campaigns/create')} className="px-8 py-3.5 bg-tf-primary hover:bg-orange-500 text-white rounded-2xl text-[10px] font-extrabold uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-3">
                              <FiPlus className="text-lg" /> CREATE CAMPAIGN HUB
                           </button>
                           <button onClick={() => navigate('/admin/finance')} className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-[10px] font-extrabold uppercase tracking-widest transition-all flex items-center gap-3">
                              <FiActivity className="text-lg" /> {t('ngo_dashboard.locked_sync')}
                           </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 lg:w-[450px]">
                        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] space-y-2 group hover:bg-white/10 transition-all shadow-2xl relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-20 h-20 bg-tf-primary/10 blur-2xl -mr-10 -mt-10" />
                           <p className="text-[9px] font-extrabold text-white/30 uppercase tracking-widest">{t('ngo_dashboard.treasury_analytics')}</p>
                           <h4 className="text-2xl font-extrabold text-white tabular-nums leading-none">LKR {(financeSummary?.availableFunds || 0).toLocaleString()}</h4>
                           <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} className="h-full bg-tf-primary" />
                           </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] space-y-2 group hover:bg-white/10 transition-all shadow-2xl">
                           <p className="text-[9px] font-extrabold text-white/30 uppercase tracking-widest">{t('ngo_dashboard.active_projects')}</p>
                           <h4 className="text-2xl font-extrabold text-white tabular-nums leading-none">{campaigns.filter(c => c.status === 'active').length}</h4>
                           <div className="flex -space-x-2 mt-4">
                              {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800" />)}
                              <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-tf-primary flex items-center justify-center text-[8px] font-bold text-white tracking-widest">+</div>
                           </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Performance Metric Hub */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, idx) => (
                    <MetricCard key={idx} label={s.label} value={s.value} icon={s.icon} colorClass={s.colorClass} sub={s.sub} delay={idx * 0.05} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Active Agreements View */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Financial Activity Pulse */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-left">
                        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-tf-primary/10 text-tf-primary rounded-xl flex items-center justify-center shadow-lg">
                                    <FiActivity className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Financial Activity Pulse</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Real-time contribution resonance</p>
                                </div>
                            </div>
                            <Link to="/finance/transactions" className="px-6 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-[9px] font-extrabold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm">Audit Ledger</Link>
                        </div>
                        
                        <div className="divide-y divide-slate-50 text-left">
                            {transactions?.length > 0 ? transactions.slice(0, 5).map((ra) => (
                                <div key={ra._id} className="flex items-center justify-between p-8 hover:bg-slate-50 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-tf-primary group-hover:text-white transition-all">
                                            <FiDollarSign className="text-lg" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-extrabold text-slate-950 group-hover:text-tf-primary transition-colors leading-none mb-1">{ra.description || 'Campaign Contribution'}</p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-extrabold text-tf-primary uppercase tracking-widest">{ra.type === 'income' ? 'Contribution' : 'Allocation'}</span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{new Date(ra.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-extrabold text-slate-950 tabular-nums leading-none">{ra.type === 'income' ? '+' : '-'}LKR {ra.amount.toLocaleString()}</p>
                                        <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Verified</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-20 text-center space-y-4">
                                    <FiActivity className="mx-auto text-slate-100" size={60} />
                                    <p className="text-slate-300 font-bold text-xs uppercase tracking-widest">Awaiting financial synchronization.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-left">
                        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
                                    <FiUsers className="text-xl" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Partner Agreements Hub</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Formal community partner registry</p>
                                </div>
                            </div>
                            <Link to="/partner/agreements" className="px-6 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-[9px] font-extrabold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm">View Archive</Link>
                        </div>
                        
                        <div className="divide-y divide-slate-50">
                            {recentAgreements.length > 0 ? recentAgreements.map((a) => (
                                <Link key={a._id} to={`/partner/agreements/${a._id}/milestones`} className="flex items-center justify-between p-8 hover:bg-slate-50 transition-all group">
                                    <div className="flex items-center gap-6 text-left">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-tf-primary group-hover:text-white group-hover:border-tf-primary/20 transition-all shadow-inner">
                                            <FiFileText className="text-xl" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-base font-extrabold text-slate-950 group-hover:text-tf-primary transition-colors leading-none mb-1">{a.title || 'Institutional Partnership'}</p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-extrabold text-tf-primary uppercase tracking-widest">{(a.agreementType || 'Mission').toUpperCase()}</span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{a.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <FiChevronRight className="text-slate-300 group-hover:text-tf-primary group-hover:translate-x-1 transition-all" />
                                </Link>
                            )) : (
                                <div className="p-20 text-center space-y-4">
                                    <FiGlobe className="mx-auto text-slate-100" size={60} />
                                    <p className="text-slate-300 font-bold text-xs uppercase tracking-widest">No agreements found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Project Progress Overview */}
                <div className="lg:col-span-4 space-y-8 text-left">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 space-y-10 group/projects overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-tf-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                        <div className="flex items-center justify-between relative z-10">
                            <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Project Funding Status</h3>
                            <FiTarget className="text-tf-primary" />
                        </div>
                        
                        <div className="space-y-10 relative z-10 text-left">
                            {recentCampaigns.length > 0 ? recentCampaigns.map((c) => (
                                <div key={c._id} className="space-y-4 group/item">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1 max-w-[70%]">
                                           <h4 className="text-sm font-extrabold text-slate-900 group-hover/item:text-tf-primary transition-colors leading-tight truncate">{c.title}</h4>
                                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{c.category || 'Humanitarian'}</p>
                                        </div>
                                        <span className="text-lg font-extrabold text-slate-950 tabular-nums group-hover/item:text-tf-primary transition-colors">{Math.round((c.raisedAmount / c.goalAmount) * 100)}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden shadow-inner p-0.5">
                                        <motion.div 
                                            initial={{ width: 0 }} whileInView={{ width: `${Math.min(100, (c.raisedAmount / c.goalAmount) * 100)}%` }} transition={{ duration: 2 }}
                                            className="h-full bg-tf-primary rounded-full relative overflow-hidden"
                                        >
                                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-shimmer" />
                                        </motion.div>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-20 text-center space-y-4">
                                    <FiInfo className="mx-auto text-slate-100" size={40} />
                                    <p className="text-slate-300 font-bold text-[9px] uppercase tracking-widest">Awaiting project data synchronization Hub.</p>
                                </div>
                            )}
                        </div>

                        <div className="pt-10 border-t border-slate-50 relative z-10">
                           <Link to="/admin/campaign-dashboard" className="w-full py-4 bg-slate-900 hover:bg-tf-primary text-white text-[10px] font-extrabold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-slate-900/10">
                              Manage Projects <FiActivity className="text-sm" />
                           </Link>
                        </div>
                    </div>
                    
                    {/* Information Module */}
                    <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden text-center lg:text-left">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-tf-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
                        <div className="relative z-10 space-y-6">
                           <div className="flex items-center justify-between">
                              <h4 className="text-[10px] font-extrabold text-tf-primary uppercase tracking-widest flex items-center gap-2">
                                <FiPieChart /> Funding Allocation
                              </h4>
                              <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981] animate-pulse" />
                           </div>
                           <p className="text-xs font-medium text-white/50 leading-relaxed">System information showing distribution of donor contributions across all active projects Hub.</p>
                           <button className="text-[10px] font-extrabold text-tf-primary uppercase tracking-widest hover:text-white transition-colors">Analyze Flow Reports →</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes shimmer { 
                    0% { transform: translateX(-100%); } 
                    100% { transform: translateX(100%); } 
                }
                .animate-shimmer {
                    animation: shimmer 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
            `}</style>
        </div>
    );
}

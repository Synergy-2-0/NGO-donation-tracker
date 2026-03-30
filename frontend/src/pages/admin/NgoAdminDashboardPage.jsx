import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdminCampaign } from '../../context/AdminCampaignContext';
import { usePartnerOperations } from '../../context/PartnerOperationsContext';
import { useFinance } from '../../context/FinanceContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { DashboardSkeleton } from '../../components/Skeleton';
import { 
  FiGrid, FiTarget, FiUsers, FiDollarSign, FiPlus, FiChevronRight, 
  FiActivity, FiCheckCircle, FiClock, FiTrendingUp, FiFileText 
} from 'react-icons/fi';
import { LuScale3D } from 'react-icons/lu';

export default function NgoAdminDashboardPage() {
    const { user } = useAuth();
    const { campaigns, loading: loadingCampaigns, fetchCampaigns } = useAdminCampaign();
    const { agreements, fetchAllAgreements } = usePartnerOperations();
    const { stats: financeStats, fetchStats: fetchFinanceStats } = useFinance();

    useEffect(() => {
        fetchCampaigns().catch(() => {});
        fetchAllAgreements().catch(() => {});
        if (fetchFinanceStats) fetchFinanceStats().catch(() => {});
    }, [fetchCampaigns, fetchAllAgreements, fetchFinanceStats]);

    const stats = useMemo(() => {
        const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
        const pendingAgreements = agreements.filter(a => a.status === 'pending').length;
        const totalImpactValue = agreements.reduce((sum, a) => sum + (Number(a.totalValue) || 0), 0);
        
        return [
            { label: 'Active Projects', value: activeCampaigns, icon: <FiTarget />, color: 'bg-brand-red' },
            { label: 'Pending Reviews', value: pendingAgreements, icon: <FiClock />, color: 'bg-amber-500' },
            { label: 'Total Impact Value', value: `LKR ${(totalImpactValue / 1000000).toFixed(1)}M`, icon: <FiTrendingUp />, color: 'bg-indigo-600' },
            { label: 'Financial Liquidity', value: financeStats?.totalBalance?.toLocaleString() || '0', icon: <FiDollarSign />, color: 'bg-emerald-500' },
        ];
    }, [campaigns, agreements, financeStats]);

    const recentAgreements = useMemo(() => agreements.slice(0, 5), [agreements]);
    const recentCampaigns = useMemo(() => campaigns.slice(0, 4), [campaigns]);

    if (loadingCampaigns && campaigns.length === 0) return <DashboardSkeleton />;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fadeIn text-left">
            {/* Premium Header */}
            <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-8 md:p-10 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[.2em] text-slate-500 mb-2">Administrative Command</p>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Mission <span className="text-brand-red">Control</span></h2>
                        <p className="text-slate-400 text-sm mt-2 max-w-xl font-medium">Overseeing humanitarian impact, partner alliances, and project lifecycles across the network.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/admin/campaigns/create" className="px-6 py-3 bg-brand-red text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-red/90 transition-all shadow-xl shadow-brand-red/20 flex items-center gap-2 active:scale-95">
                            <FiPlus className="text-sm stroke-[3]" /> Launch New Mission
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, idx) => (
                    <div key={idx} className="bg-white rounded-[32px] border border-slate-100 p-7 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow group">
                        <div className={`w-14 h-14 ${s.color} text-white rounded-2xl flex items-center justify-center text-xl shadow-lg transition-transform group-hover:scale-110`}>{s.icon}</div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">{s.label}</p>
                            <h4 className="text-xl font-black text-slate-900 truncate">{s.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Mission Milestones */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-sm"><LuScale3D /></span>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Alliance Activity</h3>
                        </div>
                        <Link to="/partner/agreements" className="text-[10px] font-black uppercase tracking-widest text-brand-red hover:underline">View Registry</Link>
                    </div>

                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="divide-y divide-slate-50">
                            {recentAgreements.length > 0 ? recentAgreements.map((a) => (
                                <Link key={a._id} to={`/partner/agreements/${a._id}/milestones`} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-brand-red group-hover:border-brand-red/20 transition-all">
                                            <FiFileText className="text-lg" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-extrabold text-slate-800 tracking-tight group-hover:text-brand-red transition-colors">{a.title || 'Institutional Partnership'}</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 capitalize">{a.agreementType} Support • {a.status}</p>
                                        </div>
                                    </div>
                                    <FiChevronRight className="text-slate-300 group-hover:text-brand-red group-hover:translate-x-1 transition-all" />
                                </Link>
                            )) : (
                                <div className="p-12 text-center text-slate-400 font-bold text-sm uppercase tracking-widest">No active alliances detected.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mission Status Snapshot */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-brand-red text-white rounded-xl flex items-center justify-center text-sm"><FiTarget /></span>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Project Snapshots</h3>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {recentCampaigns.length > 0 ? recentCampaigns.map((c) => (
                            <div key={c._id} className="bg-white rounded-[32px] border border-slate-100 p-6 space-y-4 shadow-sm group hover:-translate-y-1 transition-all">
                                <div className="flex items-start justify-between">
                                    <h4 className="text-sm font-black text-slate-800 line-clamp-1">{c.title}</h4>
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${c.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                        {c.status}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span>Funding Status</span>
                                        <span className="text-slate-900">{Math.round((c.raisedAmount / c.goalAmount) * 100)}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                        <div 
                                            className="h-full bg-brand-red rounded-full transition-all duration-1000" 
                                            style={{ width: `${Math.min(100, (c.raisedAmount / c.goalAmount) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="bg-white rounded-[32px] border border-slate-100 p-12 text-center text-slate-400 font-bold text-xs uppercase tracking-widest shadow-sm">No missions launched.</div>
                        )}
                        <Link to="/admin/campaign-dashboard" className="flex items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                            Manage All Projects <FiActivity className="ml-2" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

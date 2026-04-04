import { useEffect, useState, useMemo } from 'react';
import { useAdminCampaign } from '../../context/AdminCampaignContext';
import { DashboardSkeleton } from '../../components/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FiPlus, FiTarget, FiCheckCircle, FiEdit3, FiSearch, 
  FiChevronLeft, FiChevronRight, FiGrid, FiList, FiPieChart,
  FiActivity, FiClock, FiArchive, FiSend, FiShield
} from 'react-icons/fi';

const statusConfig = {
    draft: {
        label: 'Proposal',
        className: 'bg-slate-100 text-slate-500 border-slate-200',
        icon: <FiClock className="text-xs" />,
    },
    pending: {
        label: 'Awaiting Audit',
        className: 'bg-amber-100 text-amber-600 border-amber-200',
        icon: <FiShield className="text-xs" />,
    },
    active: {
        label: 'Live Mission',
        className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        icon: <FiActivity className="text-xs" />,
    },
    completed: {
        label: 'Accomplished',
        className: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
        icon: <FiCheckCircle className="text-xs" />,
    },
    archived: {
        label: 'Closed',
        className: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        icon: <FiArchive className="text-xs" />,
    },
};

function StatusBadge({ status }) {
    const cfg = statusConfig[status] ?? statusConfig.draft;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${cfg.className}`}>
            {cfg.icon}
            {cfg.label}
        </span>
    );
}

export default function CampaignDashboardPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { campaigns, loading, fetchCampaigns, publishCampaign, submitCampaign } = useAdminCampaign();
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 8;

    useEffect(() => {
        fetchCampaigns().catch(() => { });
    }, [fetchCampaigns]);

    const filteredCampaigns = useMemo(() => {
        return campaigns.filter(c => {
            const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
            const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 c._id.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [campaigns, statusFilter, searchQuery]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredCampaigns.length]);

    const totalPages = Math.max(1, Math.ceil(filteredCampaigns.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCampaigns = filteredCampaigns.slice(startIndex, startIndex + itemsPerPage);

    const stats = useMemo(() => {
        const total = campaigns.length;
        const live = campaigns.filter(c => c.status === 'active').length;
        const drafts = campaigns.filter(c => c.status === 'draft').length;
        const totalRaised = campaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0);

        return [
            { label: t('campaign_registry.stats.network'), value: total, icon: <FiTarget className="text-xl" />, color: 'bg-tf-primary' },
            { label: t('campaign_registry.stats.active'), value: live, icon: <FiActivity className="text-xl" />, color: 'bg-emerald-500' },
            { label: t('campaign_registry.stats.pending'), value: drafts, icon: <FiEdit3 className="text-xl" />, color: 'bg-amber-500' },
            { label: t('campaign_registry.stats.impact'), value: `LKR ${(totalRaised / 1000).toFixed(0)}K`, icon: <FiPieChart className="text-xl" />, color: 'bg-indigo-600' },
        ];
    }, [campaigns, t]);

    if (loading && campaigns.length === 0) return <DashboardSkeleton />;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fadeIn text-left pt-6">
            <div className="relative overflow-hidden bg-tf-dark rounded-[32px] p-8 md:p-10 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-tf-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-tf-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[.2em] text-slate-500 mb-2 italic">{t('campaign_registry.operational_hub')}</p>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight italic">{t('campaign_registry.title_1')} <span className="text-tf-primary not-italic">{t('campaign_registry.title_2')}</span></h2>
                        <p className="text-slate-400 text-sm mt-2 max-w-xl font-medium italic">{t('campaign_registry.subtitle')}</p>
                        {user?.role === 'ngo-admin' && (
                            <Link 
                                to="/admin/campaigns/create" 
                                className="flex items-center gap-2 px-8 py-4 bg-tf-primary text-white rounded-[24px] text-xs font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] active:scale-95 group mt-6 italic"
                            >
                                <FiPlus className="text-lg group-hover:rotate-90 transition-transform duration-500" />
                                <span>{t('campaign_registry.create_button')}</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, idx) => (
                    <div key={idx} className="bg-white rounded-[32px] border border-slate-100 p-7 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow group italic">
                        <div className={`w-14 h-14 ${s.color} text-white rounded-2xl flex items-center justify-center text-xl shadow-lg transition-transform group-hover:scale-110 shadow-slate-900/5`}>{s.icon}</div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">{s.label}</p>
                            <h4 className="text-xl font-black text-slate-900 truncate tracking-tight">{s.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col font-sans">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('campaign_registry.filter.placeholder')}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-tf-primary/5 focus:border-tf-primary/20 transition-all italic"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 focus:outline-none focus:ring-4 focus:ring-tf-primary/5 transition-all outline-none appearance-none cursor-pointer pr-10 relative italic"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 15px center', backgroundSize: '12px' }}
                        >
                            <option value="all">{t('campaign_registry.filter.all')}</option>
                            <option value="draft">{t('campaign_registry.filter.proposals')}</option>
                            <option value="active">{t('campaign_registry.filter.live')}</option>
                            <option value="completed">{t('campaign_registry.filter.success')}</option>
                            <option value="archived">{t('campaign_registry.filter.closed')}</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[.2em] text-slate-400 italic font-sans">{t('campaign_registry.table.identity')}</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[.2em] text-slate-400 italic font-sans">{t('campaign_registry.table.progress')}</th>
                                <th className="px-8 py-5 text-center text-[10px] font-black uppercase tracking-[.2em] text-slate-400 italic font-sans">{t('campaign_registry.table.level')}</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[.2em] text-slate-400 italic font-sans">{t('campaign_registry.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedCampaigns.length > 0 ? paginatedCampaigns.map((c) => (
                                <tr key={c._id} className="group hover:bg-slate-50/50 transition-all duration-200">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-5 italic text-left">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-tf-primary group-hover:border-tf-primary/20 group-hover:bg-orange-50 transition-all shadow-sm shrink-0">
                                                <FiTarget className="text-xl" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-black text-slate-800 truncate tracking-tight group-hover:text-tf-primary transition-colors">{c.title}</p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: {c._id.slice(-8)} HUB</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-2 w-48 italic">
                                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                               <span className="text-slate-400">Raised</span>
                                               <span className="text-slate-900">{Math.round((c.raisedAmount / c.goalAmount) * 100)}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                                <div 
                                                    className={`h-full transition-all duration-1000 ${c.status === 'active' ? 'bg-tf-primary' : 'bg-slate-300'}`} 
                                                    style={{ width: `${Math.min(100, (c.raisedAmount / c.goalAmount) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <StatusBadge status={c.status} />
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 italic">
                                            {/* NGO Submission Hub */}
                                            {c.status === 'draft' && user?.role === 'ngo-admin' && (
                                                <button
                                                    onClick={() => { if(window.confirm("Submit this mission for administrative audit?")) submitCampaign(c._id); }}
                                                    className="px-4 py-2 bg-tf-primary/10 text-tf-primary rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-tf-primary hover:text-white transition-all shadow-sm border border-tf-primary/20 flex items-center gap-2 active:scale-95 italic"
                                                >
                                                    <FiSend className="text-xs" /> {t('campaign_registry.table.submit')}
                                                </button>
                                            )}

                                            {/* Admin Deployment Hub */}
                                            {(c.status === 'draft' || c.status === 'pending') && user?.role === 'admin' && (
                                                <button
                                                    onClick={() => { if(window.confirm("Authorize this mission for public marketplace deployment?")) publishCampaign(c._id); }}
                                                    className="px-4 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-emerald-500/10 border border-emerald-400 flex items-center gap-2 active:scale-95 italic"
                                                >
                                                    <FiCheckCircle className="text-xs" /> {t('campaign_registry.table.approve')}
                                                </button>
                                            )}
                                            <Link
                                                to={`/admin/campaigns/${c._id}`}
                                                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-tf-primary transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center gap-2 italic"
                                            >
                                                {t('campaign_registry.table.details')} <FiChevronRight className="text-sm" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center italic">
                                        <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-400">
                                            <FiTarget className="text-3xl" />
                                        </div>
                                        <p className="text-slate-400 font-black text-sm uppercase tracking-widest italic">{t('campaign_registry.no_results')}</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Hub */}
                    {totalPages > 1 && (
                        <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/10 italic">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                >
                                    <FiChevronLeft />
                                </button>
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                >
                                    <FiChevronRight />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
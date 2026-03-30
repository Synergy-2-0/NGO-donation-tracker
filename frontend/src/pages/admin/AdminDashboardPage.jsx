import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdminDonor } from '../../context/AdminDonorContext';
import { useAdminCampaign } from '../../context/AdminCampaignContext';
import { DashboardSkeleton } from '../../components/Skeleton';
import { 
  FiUsers, FiActivity, FiDollarSign, FiPieChart, FiShield, 
  FiTarget, FiSend, FiChevronRight, FiCheckCircle, FiClock
} from 'react-icons/fi';

const SEGMENT_META = {
    new: { label: 'New Arrival', bar: 'bg-blue-400', icon: <FiUsers /> },
    regular: { label: 'Recurring', bar: 'bg-emerald-500', icon: <FiActivity /> },
    major: { label: 'Strategic', bar: 'bg-orange-500', icon: <FiTarget /> },
    vip: { label: 'Imperial', bar: 'bg-brand-red', icon: <FiShield /> },
};

function StatCard({ label, value, icon, color, sub }) {
    return (
        <div className="bg-white rounded-[32px] border border-slate-100 p-7 flex items-center gap-5 shadow-sm hover:shadow-md transition-all group">
            <div className={`w-14 h-14 ${color} text-white rounded-2xl flex items-center justify-center text-xl shadow-lg transition-transform group-hover:scale-110 shadow-slate-900/5`}>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">{label}</p>
                <h4 className="text-xl font-black text-slate-900 truncate tracking-tight">{value ?? '—'}</h4>
                {sub && <p className="text-[9px] font-black text-slate-400 mt-1 uppercase tracking-tighter">{sub}</p>}
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const { donors, segments, loading: loadingDonors, fetchDonors, fetchSegments } = useAdminDonor();
    const { campaigns, loading: loadingCampaigns, fetchCampaigns, publishCampaign } = useAdminCampaign();

    useEffect(() => {
        fetchDonors().catch(() => { });
        fetchSegments().catch(() => { });
        fetchCampaigns().catch(() => { });
    }, [fetchDonors, fetchSegments, fetchCampaigns]);

    const proposals = useMemo(() => campaigns.filter(c => c.status === 'draft'), [campaigns]);
    const totalRaised = donors.reduce((s, d) => s + (d.analytics?.totalDonated || 0), 0);

    if ((loadingDonors || loadingCampaigns) && donors.length === 0) return <DashboardSkeleton />;

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-16 animate-fadeIn text-left">
            {/* Header: Commands */}
            <div className="relative overflow-hidden bg-slate-900 rounded-[40px] p-10 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-8 h-8 bg-brand-red text-white rounded-xl flex items-center justify-center text-sm shadow-lg shadow-brand-red/20"><FiShield /></span>
                            <span className="text-[10px] font-black uppercase tracking-[.3em] text-slate-500">System Command</span>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tight">Admin <span className="text-brand-red">Console</span></h2>
                        <p className="text-slate-400 text-sm mt-3 max-w-xl font-medium leading-relaxed">Global platform governance, strategic donor oversight, and mission validation control.</p>
                    </div>
                </div>
            </div>

            {/* Global KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Registry" value={donors.length} icon={<FiUsers />} color="bg-slate-900" sub="Verified Identities" />
                <StatCard label="Platform Liquidity" value={`LKR ${(totalRaised/1000).toFixed(0)}K`} icon={<FiDollarSign />} color="bg-emerald-500" sub="Cumulative Impact" />
                <StatCard label="Mission Proposals" value={proposals.length} icon={<FiClock />} color="bg-amber-500" sub="Awaiting Deployment" />
                <StatCard label="Network Growth" value="12.4%" icon={<FiPieChart />} color="bg-indigo-600" sub="Inter-quarter delta" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Deployment Control - Only for Admin */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Mission Proposals</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Pending Strategic Review</p>
                            </div>
                            <Link to="/admin/campaign-dashboard" className="text-[10px] font-black text-brand-red uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-1">
                                Full Registry <FiChevronRight />
                            </Link>
                        </div>

                        <div className="divide-y divide-slate-50">
                            {proposals.length > 0 ? proposals.slice(0, 4).map(p => (
                                <div key={p._id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-200 group-hover:text-amber-500 group-hover:border-amber-100 transition-all shadow-sm">
                                            <FiClock className="text-lg" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800 tracking-tight">{p.title}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">NGO: {p.ngoId?.name || 'Authorized Entity'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => publishCampaign(p._id)}
                                            className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-sm flex items-center gap-2 active:scale-95"
                                        >
                                            <FiSend /> Deploy
                                        </button>
                                        <Link 
                                            to={`/admin/campaigns/${p._id}`}
                                            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-brand-red transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center gap-2"
                                        >
                                            Inspect <FiChevronRight />
                                        </Link>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-16 text-center">
                                    <FiCheckCircle className="text-3xl text-slate-100 mx-auto mb-4" />
                                    <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Global Registry Synchronized</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Access Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <Link to="/admin/donors" className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col items-center text-center space-y-4">
                            <div className="w-12 h-12 bg-rose-50 text-[#DC2626] rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform"><FiUsers /></div>
                            <div>
                                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Donor Directory</h4>
                                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Manage Identities</p>
                            </div>
                         </Link>
                         <Link to="/admin/donors/pledges" className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col items-center text-center space-y-4">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform"><FiActivity /></div>
                            <div>
                                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Strategic Pledges</h4>
                                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Monitor Commitments</p>
                            </div>
                         </Link>
                         <Link to="/admin/donor-analytics" className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col items-center text-center space-y-4">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform"><FiPieChart /></div>
                            <div>
                                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Impact Core</h4>
                                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Advanced Intelligence</p>
                            </div>
                         </Link>
                    </div>
                </div>

                {/* Secondary Column */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[.3em]">Identity Segments</h3>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <div className="space-y-6">
                            {Object.entries(SEGMENT_META).slice(0, 4).map(([key, meta]) => {
                                const count = donors.filter(d => (d.segment || 'new') === key).length;
                                return (
                                    <div key={key} className="space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-slate-400 flex items-center gap-2">{meta.icon} {meta.label}</span>
                                            <span className="text-slate-900">{count}</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                            <div className={`h-full transition-all duration-1000 ${meta.bar}`} style={{ width: `${Math.min(100, (count / donors.length) * 100 || 0)}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-red/20 rounded-full blur-2xl translate-y-1/2 translate-x-1/2" />
                        <FiSend className="text-4xl text-brand-red mb-6" />
                        <h4 className="text-xl font-black tracking-tight mb-2">Protocol Ready.</h4>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">Review proposed campaigns from authorized NGOs and deploy them to the live network to begin mission funding.</p>
                        <Link to="/admin/campaign-dashboard" className="inline-flex h-10 items-center px-6 bg-brand-red text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all active:scale-95">
                            Launch Registry
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

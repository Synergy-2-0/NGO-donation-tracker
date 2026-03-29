import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdminCampaign } from '../../context/AdminCampaignContext';
import { usePartnerOperations } from '../../context/PartnerOperationsContext';
import LoadingSpinner from '../../components/LoadingSpinner';

function StatCard({ label, value, color, sub, icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <p className={`text-3xl font-bold ${color}`}>{value ?? '—'}</p>
          {sub && <p className="text-xs text-gray-400 mt-2 font-medium">{sub}</p>}
        </div>
        <div className="p-3 rounded-xl bg-gray-50 text-gray-400 group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function NgoAdminDashboardPage() {
  const { user } = useAuth();
  const { campaigns, loading: loadingCampaigns, fetchCampaigns } = useAdminCampaign();
  const { agreements, fetchAllAgreements } = usePartnerOperations();

  useEffect(() => {
    fetchCampaigns().catch(() => {});
    fetchAllAgreements().catch(() => {});
  }, [fetchCampaigns, fetchAllAgreements]);

  if (loadingCampaigns && campaigns.length === 0) return <LoadingSpinner message="Loading your operations..." />;

  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;
  const draftCampaigns = campaigns.filter((c) => c.status === 'draft').length;
  const completedCampaigns = campaigns.filter((c) => c.status === 'completed').length;

  const totalAgreements = agreements.length;
  const activeAgreements = agreements.filter((a) => a.status === 'active').length;
  const totalAgreementValue = agreements.reduce((sum, a) => sum + (a.totalValue || 0), 0);

  const recentCampaigns = [...campaigns].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">NGO Admin Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back, {user?.name}. Manage your campaigns and partnerships.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Campaigns"
          value={campaigns.length}
          color="text-indigo-600"
          sub={`${activeCampaigns} active, ${draftCampaigns} draft`}
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M6 3v4m12-4v4M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" /></svg>}
        />
        <StatCard
          label="Active Agreements"
          value={activeAgreements}
          color="text-emerald-600"
          sub={`${totalAgreements} total agreements`}
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 11h5m-8 8h14a2 2 0 002-2V7a2 2 0 00-2-2h-3l-2-2H10L8 5H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
        />
        <StatCard
          label="Partnership Value"
          value={`LKR ${totalAgreementValue.toLocaleString()}`}
          color="text-amber-600"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Completed Campaigns"
          value={completedCampaigns}
          color="text-blue-600"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Quick Operations</h3>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/campaign-dashboard" className="px-5 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-semibold">Manage Campaigns</Link>
          <Link to="/partner/agreements" className="px-5 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-semibold">Partnerships</Link>
          <Link to="/finance/dashboard" className="px-5 py-2.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-sm font-semibold">Finance Allocations</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-gray-800">Recent Campaigns</h3>
            <Link to="/admin/campaign-dashboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">See all</Link>
          </div>
          {recentCampaigns.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No campaigns found.</p>
          ) : (
            <div className="space-y-4">
              {recentCampaigns.map((c) => (
                <div key={c._id} className="flex justify-between items-center group p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-800">{c.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs font-medium text-indigo-600">LKR {(c.goalAmount || 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.status === 'active' ? 'bg-emerald-100 text-emerald-700' : c.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{c.status.toUpperCase()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

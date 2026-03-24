import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useDonor } from '../context/DonorContext';
import LoadingSpinner from '../components/LoadingSpinner';

const dummyChartData = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 2000 },
  { name: 'Apr', amount: 2780 },
  { name: 'May', amount: 1890 },
  { name: 'Jun', amount: 2390 },
  { name: 'Jul', amount: 3490 },
];

function PremiumStatCard({ label, value, icon, trend, color, bg }) {
  return (
    <div className="relative overflow-hidden bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">{label}</p>
          <h3 className={`text-2xl font-bold tracking-tight ${color}`}>{value ?? '—'}</h3>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${bg} text-white shadow-lg shadow-${color}/20 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <div className="absolute -bottom-2 -right-2 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
        {icon}
      </div>
    </div>
  );
}

const pledgeStatusColor = {
  active: 'bg-green-100 text-green-700',
  fulfilled: 'bg-orange-100 text-orange-700',
  cancelled: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    donorProfile,
    analytics,
    pledges,
    fetchProfile,
    fetchAnalytics,
    fetchPledges,
    loading,
  } = useDonor();

  useEffect(() => {
    fetchProfile()
      .then((profile) => {
        if (profile?._id) {
          fetchAnalytics(profile._id).catch(() => {});
          fetchPledges(profile._id).catch(() => {});
        }
      })
      .catch(() => {});
  }, [fetchProfile, fetchAnalytics, fetchPledges]);

  if (loading && !donorProfile) return <LoadingSpinner />;

  const activePledges = pledges.filter((p) => p.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.name || 'Donor'} 👋
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Here&apos;s an overview of your donation activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Donated"
          value={
            analytics?.totalDonations != null
              ? `LKR ${Number(analytics.totalDonations).toLocaleString()}`
              : null
          }
          color="text-[#DC2626]"
          bg="bg-white"
        />
        <PremiumStatCard
          label="Campaigns Supported"
          value={analytics?.totalCampaigns ?? null}
          color="text-emerald-600"
          bg="bg-emerald-600"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
        />
        <PremiumStatCard
          label="Active Pledges"
          value={pledges.length > 0 ? activePledges : null}
          color="text-[#7C2D12]"
          bg="bg-white"
        />
        <PremiumStatCard
          label="Total Impact Score"
          value="98%"
          color="text-rose-600"
          bg="bg-rose-600"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-base font-semibold text-gray-700 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/profile"
            className="px-4 py-2 bg-red-50 text-[#DC2626] hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
          >
            Manage Profile
          </Link>
          <Link
            to="/pledges"
            className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors"
          >
            New Pledge
          </Link>
          <Link
            to="/donations"
            className="px-4 py-2 bg-orange-50 text-[#7C2D12] hover:bg-orange-100 rounded-lg text-sm font-medium transition-colors"
          >
            Donation History
          </Link>
        </div>
      </div>

      {/* Recent Pledges */}
      {pledges.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-700">Recent Pledges</h3>
            <Link to="/pledges" className="text-sm text-[#DC2626] hover:underline">
              View all →
            </Link>
          </div>
          <Link to="/pledges" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
            Manage All →
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-widest font-bold">
                <th className="pb-4 px-2">Campaign Category</th>
                <th className="pb-4 px-2">Amount</th>
                <th className="pb-4 px-2 text-center">Frequency</th>
                <th className="pb-4 px-2">Status</th>
                <th className="pb-4 px-2">Next Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pledges.length > 0 ? pledges.slice(0, 5).map((pledge) => (
                <tr key={pledge._id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <span className="font-semibold text-gray-700">General Support</span>
                    </div>
                  </td>
                  <td className="py-4 px-2 font-bold text-gray-900">
                    LKR {Number(pledge.amount).toLocaleString()}
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] uppercase font-black tracking-tighter rounded-md">
                        {pledge.frequency}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${statusBadgeStyle[pledge.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      {pledge.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-gray-500 text-sm font-medium">
                    {new Date(pledge.startDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan="5" className="py-10 text-center text-gray-300 font-medium italic">You haven't made any pledges yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

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

const statusBadgeStyle = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  fulfilled: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  cancelled: 'bg-rose-50 text-rose-600 border-rose-100',
  pending: 'bg-amber-50 text-amber-600 border-amber-100',
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
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{user?.name || 'Donor'}</span> 👋
          </h2>
          <p className="text-gray-500 font-medium mt-1">
            Empowering change through your generous contributions.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/pledges" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all text-sm font-semibold flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Make a Pledge
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <PremiumStatCard
          label="Total Donated"
          value={analytics?.totalDonations != null ? `LKR ${Number(analytics.totalDonations).toLocaleString()}` : null}
          color="text-indigo-600"
          bg="bg-indigo-600"
          trend={12}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
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
          color="text-purple-600"
          bg="bg-purple-600"
          trend={5}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944V21m0 0l-9-9m9 9l9-9" /></svg>}
        />
        <PremiumStatCard
          label="Total Impact Score"
          value="98%"
          color="text-rose-600"
          bg="bg-rose-600"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart View */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-800">Donation Trends</h3>
            <select className="bg-gray-50 border-none text-gray-500 text-xs font-bold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyChartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  itemStyle={{color: '#6366f1', fontWeight: 'bold'}}
                />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden group">
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Daily Insight</span>
                    <h3 className="text-2xl font-bold mt-3 leading-tight text-white/90">Your support recently helped 12 orphans in Colombo get school supplies.</h3>
                </div>
                <div className="mt-8">
                    <p className="text-sm text-indigo-200 mb-4">View your full transparency impact report to see exactly where your funds went.</p>
                    <button className="w-full py-3 bg-white text-indigo-900 font-bold rounded-xl text-sm hover:scale-105 transition-transform active:scale-95">
                        Download Report
                    </button>
                </div>
            </div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-20 group-hover:blur-[100px] transition-all"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-400 rounded-full blur-[60px] opacity-20 group-hover:blur-[80px] transition-all"></div>
        </div>
      </div>

      {/* Recent Pledges Table */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Your Active Pledges</h3>
            <p className="text-xs text-gray-400 font-medium">Auto-renewing recurring support records</p>
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

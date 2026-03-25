import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useDonor } from '../context/DonorContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

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

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { donorProfile, transactions, pledges, loading, error, fetchProfile, fetchTransactions, fetchPledges } = useDonor();

  useEffect(() => {
    const load = async () => {
      try {
        const profile = donorProfile || (await fetchProfile());
        if (profile?._id) {
          fetchTransactions(profile._id).catch(() => {});
          fetchPledges(profile._id).catch(() => {});
        }
      } catch {
        // handle or redirect
      }
    };
    load();
  }, [donorProfile, fetchProfile, fetchTransactions, fetchPledges]);

  const totalDonated = transactions.reduce((sum, t) => sum + (t.status === 'completed' ? t.amount : 0), 0);
  const activePledges = pledges.filter(p => p.status === 'active').length;

  if (loading && !donorProfile) return <LoadingSpinner />;

  return (
    <div className="space-y-12 animate-fade-in max-w-[1700px] mx-auto pb-24 font-sans selection:bg-tf-primary selection:text-white">
      
      {/* Cinematic Donor Header */}
      <div className="relative p-12 lg:p-20 bg-tf-purple rounded-[4rem] overflow-hidden shadow-2xl group text-white border border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=1600')] opacity-5 blur-sm scale-110 group-hover:scale-100 transition-transform duration-1000 grayscale" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-tf-primary/10 blur-[130px] -mr-40 -mb-40 opacity-40 animate-pulse" />
        <div className="relative z-10 space-y-8 max-w-4xl">
           <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-tf-primary shadow-[0_0_20px_rgba(255,138,0,0.8)] animate-pulse" />
              <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic opacity-60">Welcome back to TrustFund</p>
           </div>
           <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-none truncate max-w-full italic tracking-tight">
              Hello, <span className="text-tf-primary">{user?.name?.split(' ')[0] || 'Friend'}</span>
           </h1>
           <p className="text-xl lg:text-2xl font-black text-white/50 tracking-tight leading-relaxed italic uppercase max-w-2xl">
              Thank you for your continued support. Together, we are creating measurable change in local communities.
           </p>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Quick Actions Console */}
        <div className="bg-[#0f041a] rounded-[4rem] p-16 shadow-2xl relative overflow-hidden group text-white border border-white/5 space-y-12">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-tf-primary/10 to-transparent pointer-events-none" />
          <div className="space-y-1 relative z-10">
             <h3 className="text-3xl font-black italic uppercase tracking-tighter">Support Center</h3>
             <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic font-sans">Empowering Humanitarian Action</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
            {[
              { 
                label: 'Start a Pledge', 
                desc: 'Identify a cause to support', 
                icon: (
                  <svg className="w-5 h-5 text-tf-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ), 
                to: '/causes' 
              },
              { 
                label: 'My Impact History', 
                desc: 'View donation registry', 
                icon: (
                  <svg className="w-5 h-5 text-tf-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ), 
                to: '/donations' 
              },
              { 
                label: 'Personal Information', 
                desc: 'Manage your profile', 
                icon: (
                  <svg className="w-5 h-5 text-tf-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ), 
                to: '/profile' 
              },
              { 
                label: 'Explore Our Causes', 
                desc: 'Find new initiatives', 
                icon: (
                  <svg className="w-5 h-5 text-tf-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                ), 
                to: '/' 
              },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => navigate(item.to)}
                className="flex flex-col items-start p-8 rounded-[2.5rem] bg-white/5 border border-white/5 group/item hover:bg-white hover:border-tf-primary hover:shadow-2xl transition-all text-left transform active:scale-95"
              >
                 <span className="text-3xl mb-10 group-hover/item:scale-125 transition-transform duration-500">{item.icon}</span>
                 <p className="text-[14px] font-black text-white group-hover/item:text-tf-purple transition-colors italic leading-none mb-2">{item.label}</p>
                 <p className="text-[10px] font-black text-white/20 group-hover/item:text-tf-purple/40 uppercase tracking-widest">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Support Focus Distribution */}
        <div className="bg-white rounded-[4rem] border border-slate-100 p-16 shadow-sm space-y-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-tf-primary/5 blur-[80px] -mr-32 -mt-32" />
          <div className="space-y-1 relative z-10">
             <h3 className="text-3xl font-black italic uppercase tracking-tighter text-tf-purple">Impact Reach</h3>
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic font-sans">Active Donation Interest Areas</p>
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

import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDonor } from '../context/DonorContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  FiDollarSign, FiHeart, FiCalendar, FiShield, 
  FiArrowRight, FiActivity, FiPieChart, FiTrendingUp 
} from 'react-icons/fi';
import AIInsights from '../components/AIInsights';

const StatusBadge = ({ status }) => {
  const styles = {
    active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    pending: 'bg-amber-50 text-amber-600 border-amber-100',
    completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    cancelled: 'bg-rose-50 text-rose-600 border-rose-100',
    default: 'bg-slate-50 text-slate-600 border-slate-100'
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-[0.1em] border ${styles[status] || styles.default}`}>
      {status}
    </span>
  );
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { donorProfile, transactions, pledges, analytics, loading, fetchProfile, fetchTransactions, fetchPledges, fetchAnalytics } = useDonor();

  useEffect(() => {
    const load = async () => {
      const profile = donorProfile || (await fetchProfile());
      if (profile?._id) {
        fetchTransactions(profile._id);
        fetchPledges(profile._id);
        fetchAnalytics(profile._id);
      }
    };
    load();
  }, []);

  const chartData = useMemo(() => {
    if (!transactions?.length) return Array(6).fill(0).map((_, i) => ({ name: `Month ${i+1}`, amount: 0 }));
    // Aggregate by month for better visualization
    return transactions.slice(-10).map((tx) => ({
      name: new Date(tx.createdAt).toLocaleString('default', { month: 'short', day: 'numeric' }),
      amount: tx.amount,
    }));
  }, [transactions]);

  if (loading && !donorProfile) return <LoadingSpinner />;

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 pb-20 p-8">
      
      {/* Cinematic Header Overlay */}
      <section className="relative h-[300px] rounded-[3rem] overflow-hidden group">
         <img src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover brightness-[0.4] group-hover:scale-105 transition-transform duration-[5s]" alt="Dashboard Header" />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
         
         <div className="absolute bottom-12 left-12 space-y-4">
            <div className="flex items-center gap-3">
               <div className="px-4 py-1.5 bg-orange-500 rounded-xl text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl">DONOR HUB</div>
               <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.3em]">Institutional Grade Security Authorized</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter italic leading-none">
              Welcome back, <span className="text-orange-500">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-white/60 font-medium italic text-lg max-w-xl">
              Your humanitarian capital is actively supporting verified missions.
            </p>
         </div>
      </section>

      {/* Real-time Impact Nodes (Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Asset Impact', value: `RS ${(analytics?.totalDonated || 0).toLocaleString()}`, icon: FiDollarSign, sub: 'Verified Deployments', color: 'text-orange-500' },
          { label: 'Active Missions', value: analytics?.donationCount || 0, icon: FiHeart, sub: 'Community Support Nodes', color: 'text-rose-500' },
          { label: 'Strategy Pledges', value: pledges.filter(p => p.status === 'active').length, icon: FiTrendingUp, sub: 'Recurring Commitments', color: 'text-emerald-500' },
          { label: 'Trust Ranking', value: `${analytics?.retentionScore || 92}%`, icon: FiShield, sub: 'Supporter Integrity', color: 'text-tf-accent' }
        ].map((stat, i) => (
          <motion.div 
            key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000">
               <stat.icon size={120} />
            </div>
            <div className="flex justify-between items-start mb-10">
              <div className={`p-4 bg-slate-50 rounded-2xl ${stat.color} shadow-inner`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic leading-none">{stat.label}</p>
               <h3 className="text-3xl font-black text-slate-950 tracking-tighter italic">{stat.value}</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-3 border-t border-slate-50 mt-4 leading-none">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Deep Data Analytics */}
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-16 px-4">
            <div className="space-y-2">
               <h3 className="text-2xl font-black text-slate-950 tracking-tight italic flex items-center gap-4 uppercase">
                 <FiActivity className="text-orange-500" /> Capital Timeline
               </h3>
               <p className="text-xs font-medium text-slate-400">Historical data nodes for your philanthropic asset deployment.</p>
            </div>
            <button className="px-6 py-2 border border-slate-100 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">6 Month Cycle</button>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#cbd5e1'}} dy={20} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#cbd5e1'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '20px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#F97316" strokeWidth={6} fillOpacity={1} fill="url(#colorAmt)" animationDuration={3000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Personalized Intelligence Hub */}
        <div className="space-y-12">
          {/* AI Module */}
          <AIInsights />
          
          {/* Targeted Areas */}
          <div className="bg-slate-950 rounded-[3rem] p-12 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 blur-[80px] -mr-20 -mt-20 group-hover:bg-orange-500/20 transition-all duration-1000" />
            
            <h4 className="text-xs font-black text-orange-500 uppercase tracking-[0.4em] mb-10 italic flex items-center gap-3">
              <FiPieChart /> Impact Allocation
            </h4>
            
            <div className="space-y-10">
              {[
                { sector: 'Humanitarian Education', val: 85, color: 'bg-orange-500' },
                { sector: 'Environmental Protection', val: 62, color: 'bg-emerald-500' },
                { sector: 'Emergency Healthcare', val: 40, color: 'bg-rose-500' }
              ].map((s, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-white/50 italic">{s.sector}</span>
                    <span className="text-xl font-black text-white italic">{s.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} whileInView={{ width: `${s.val}%` }} transition={{ duration: 2 }}
                      className={`h-full ${s.color} rounded-full`} 
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 pt-10 border-t border-white/5 flex items-center justify-between">
               <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic">Strategic Optimized Flow</p>
               <FiArrowRight className="text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Registry Interface */}
      <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden mb-20 transition-all hover:shadow-2xl">
        <div className="p-12 border-b border-slate-50 flex items-center justify-between">
           <div className="space-y-1">
             <h3 className="text-2xl font-black text-slate-950 italic tracking-tight uppercase">Recent Impact Log</h3>
             <p className="text-xs font-medium text-slate-400">Detailed synchronization of your last authorized capital flows.</p>
           </div>
           <button onClick={() => navigate('/finance/transactions')} className="px-8 py-3 bg-slate-50 text-slate-900 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-orange-500 hover:text-white transition-all shadow-sm">View Full Registry</button>
        </div>
        
        <div className="overflow-x-auto">
           <table className="w-full">
              <thead className="bg-slate-50/50">
                 <tr>
                    <th className="px-12 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol ID</th>
                    <th className="px-12 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Mission Title</th>
                    <th className="px-12 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Volume</th>
                    <th className="px-12 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Current State</th>
                    <th className="px-12 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">System Node</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {transactions.length > 0 ? transactions.slice(0, 5).map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-50/20 group transition-all">
                       <td className="px-12 py-8">
                          <code className="text-[10px] font-bold text-slate-300 group-hover:text-orange-500 uppercase tracking-widest">#{tx._id.slice(-8).toUpperCase()}</code>
                       </td>
                       <td className="px-12 py-8">
                          <p className="text-sm font-bold text-slate-950 italic">{tx.campaignId?.title || 'General Support Allocation'}</p>
                       </td>
                       <td className="px-12 py-8">
                          <span className="text-base font-black text-slate-900 tabular-nums">RS {tx.amount.toLocaleString()}</span>
                       </td>
                       <td className="px-12 py-8">
                          <StatusBadge status={tx.status} />
                       </td>
                       <td className="px-12 py-8 text-right">
                          <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                             <FiArrowRight />
                          </button>
                       </td>
                    </tr>
                 )) : (
                    <tr>
                       <td colSpan="5" className="px-12 py-32 text-center">
                          <div className="space-y-4">
                             <FiActivity className="mx-auto text-slate-100" size={60} />
                             <p className="text-slate-300 font-bold italic uppercase tracking-[0.2em]">Awaiting new capital mobilization nodes...</p>
                          </div>
                       </td>
                    </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}
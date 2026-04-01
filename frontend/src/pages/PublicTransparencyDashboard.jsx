import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiGlobe, FiUsers, FiTrendingUp, FiTarget, 
  FiCheckCircle, FiShield, FiHeart, FiActivity 
} from 'react-icons/fi';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import api from '../api/axios';
import MapboxMap from '../components/MapboxMap';

const MetricCard = ({ icon: Icon, label, value, subtext, color = 'orange' }) => {
  const colorStyles = {
    orange: 'bg-orange-50 text-orange-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600'
  };

  return (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col items-center text-center space-y-6 group">
      <div className={`p-6 rounded-[2rem] ${colorStyles[color] || colorStyles.orange} group-hover:scale-110 transition-transform duration-700 shadow-inner`}>
        <Icon size={28} />
      </div>
      <div className="space-y-2">
        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] italic leading-none">{label}</h3>
        <p className="text-4xl font-black text-slate-950 tracking-tighter italic">{value}</p>
        {subtext && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4 border-t border-slate-50 mt-4 leading-none">{subtext}</p>}
      </div>
    </div>
  );
};

export default function PublicTransparencyDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [donorStats, setDonorStats] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [mRes, dRes, gRes] = await Promise.all([
          api.get('/api/public/impact-metrics'),
          api.get('/api/public/donor-stats'),
          api.get('/api/public/map-data')
        ]);
        setMetrics(mRes.data);
        setDonorStats(dRes.data);
        setMapData(gRes.data);
      } catch (err) {
        console.error('Error fetching transparency data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-mesh">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full mb-4 flex items-center justify-center">
          <FiGlobe className="text-orange-500 animate-spin" size={32} />
        </div>
        <p className="text-slate-400 font-medium">Synching global transparency network...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBFBFE] pb-20">
      {/* Header Section */}
      <section className="pt-48 pb-32 px-6 lg:px-20 bg-slate-950 relative overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=2400" className="w-full h-full object-cover brightness-[0.2] group-hover:scale-105 transition-transform duration-[8s]" alt="Audit" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-10">
          <div className="flex justify-center">
            <span className="px-6 py-2 rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-500 font-black text-[10px] tracking-[0.5em] uppercase mb-6 inline-flex items-center gap-3 italic">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,1)]" />
              Institutional Audit Registry HUB
            </span>
          </div>
          <h1 className="text-6xl lg:text-9xl font-black text-white mb-6 tracking-tighter leading-[0.85] italic uppercase selection:bg-orange-500">
            Absolute <br /> <span className="text-orange-500 italic">Integrity.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed italic border-t border-white/5 pt-12 mt-12 font-medium">
            Bridging global capital with direct local humanitarian impact using a verified proof-of-progress framework. Witness the trajectory of every philanthropic asset.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-12">
            <MetricCard 
              icon={FiHeart} 
              label="Asset Deployment" 
              value={`LKR ${(metrics?.totalFundsAllocated || 0).toLocaleString()}`} 
              subtext="To 12+ Active Partners"
              color="orange"
            />
            <MetricCard 
              icon={FiUsers} 
              label="Human Reach" 
              value={(metrics?.totalBeneficiaries || 0).toLocaleString()} 
              subtext="Impacted Regions"
              color="blue"
            />
            <MetricCard 
              icon={FiCheckCircle} 
              label="Field Milestones" 
              value={metrics?.milestonesCompleted || 0} 
              subtext="Proof-of-Progress Sync"
              color="green"
            />
            <MetricCard 
              icon={FiShield} 
              label="Verified NGOs" 
              value={metrics?.verifiedPartners || 0} 
              subtext="Institutional Grade"
              color="amber"
            />
          </div>
        </div>
      </section>

      {/* Analytics Main Section */}
      <section className="px-6 lg:px-20 -mt-10 overflow-visible relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Map Section */}
          <div className="lg:col-span-2 h-[500px] premium-surface overflow-hidden relative group">
            <MapboxMap data={mapData} />
          </div>

          {/* Stats Sidebar */}
          <div className="premium-surface p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <FiActivity className="text-orange-500" /> Donor Ecosystem
              </h3>
              <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                <FiTrendingUp size={10} /> +{donorStats?.donorGrowthRate}%
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Total Donors</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-black text-slate-900">{donorStats?.totalDonors}</p>
                  <span className="text-xs text-slate-500 mb-1">Global members</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-4">Top Cause Areas</p>
                <div className="space-y-3">
                  {donorStats?.topCauses?.map((cause, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{cause}</span>
                        <span>{95 - (idx * 15)}% Match</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-500 rounded-full" 
                          style={{ width: `${95 - (idx * 15)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 text-center">Average Individual Contribution</p>
                  <p className="text-2xl font-black text-orange-500 text-center">${donorStats?.avgDonationAmount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Analytics & Trust Leaderboard */}
      <section className="pt-20 px-6 lg:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trust Leaderboard */}
          <div className="premium-surface p-8">
            <h4 className="font-bold text-slate-900 mb-8 flex items-center gap-2">
              <FiShield className="text-orange-500" /> NGO Trust Leaderboard
            </h4>
            <div className="space-y-4">
              {[
                { name: 'Global Relief Network', score: 98, level: 'Excellent' },
                { name: 'EcoWatch Foundation', score: 94, level: 'Excellent' },
                { name: 'Kindness Foundation', score: 89, level: 'Very Good' },
                { name: 'Education for All', score: 86, level: 'Very Good' }
              ].map((ngo, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-300 w-4">{i + 1}</span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{ngo.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{ngo.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-orange-500">{ngo.score}%</p>
                    <p className="text-[9px] text-slate-400">Trust Index</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="premium-surface p-8">
            <h4 className="font-bold text-slate-900 mb-8 flex items-center gap-2">
              <FiTrendingUp className="text-orange-500" /> Fund Allocation Trend
            </h4>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: 'Jan', val: 4000 }, { name: 'Feb', val: 3000 },
                  { name: 'Mar', val: 5000 }, { name: 'Apr', val: 4500 },
                  { name: 'May', val: 7000 }, { name: 'Jun', val: metrics?.totalFundsAllocated || 0 }
                ]}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  />
                  <Area type="monotone" dataKey="val" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="premium-surface p-8">
            <h4 className="font-bold text-slate-900 mb-8 flex items-center gap-2">
              <FiTarget className="text-orange-500" /> Beneficiary Reach by Region
            </h4>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Colombo', reach: 4500 }, { name: 'Kandy', reach: 3200 },
                  { name: 'Galle', reach: 2100 }, { name: 'Matara', reach: 1200 },
                  { name: 'Jaffna', reach: 1500 }
                ]}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc', radius: 4}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="reach" fill="#F97316" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

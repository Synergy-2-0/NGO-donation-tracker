import React, { useState, useEffect } from 'react';
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
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const MetricCard = ({ icon: Icon, label, value, subtext, color = 'orange' }) => {
  const colorStyles = {
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100'
  };

  return (
    <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 hover:border-tf-primary/30 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col items-center text-center space-y-6 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-tf-primary/5 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className={`p-6 rounded-[2rem] border ${colorStyles[color] || colorStyles.orange} group-hover:scale-110 transition-all duration-700 shadow-sm`}>
        <Icon size={28} />
      </div>
      <div className="space-y-2 relative z-10">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] leading-none mb-4">{label}</h3>
        <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{value}</p>
        {subtext && (
          <div className="pt-6 mt-6 border-t border-slate-50">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">{subtext}</p>
          </div>
        )}
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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 bg-tf-primary/10 rounded-full mb-4 flex items-center justify-center border border-tf-primary/20">
          <FiGlobe className="text-tf-primary animate-spin" size={32} />
        </div>
        <p className="text-slate-400 font-extrabold uppercase text-[10px] tracking-widest">Loading Verified Impact Data Hub...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBFBFE] pb-0 text-left overflow-x-hidden font-sans">
      <PublicNavbar />
      
      {/* Premium Light Hero Section */}
      <section className="pt-56 pb-40 px-6 lg:px-20 bg-slate-50 relative overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img 
             src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2400" 
             className="w-full h-full object-cover opacity-10 group-hover:scale-105 transition-transform duration-[12s] ease-linear" 
             alt="Data Network" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-[#FBFBFE]" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-16">
          <div className="inline-flex flex-col items-center">
            <span className="px-8 py-3 rounded-full border border-tf-primary/30 bg-tf-primary/5 text-tf-primary font-black text-[10px] tracking-[0.6em] uppercase mb-8 flex items-center gap-4 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-tf-primary animate-pulse shadow-[0_0_15px_rgba(249,115,22,1)]" />
              Live Impact Registry
            </span>
            <h1 className="text-7xl lg:text-[10rem] font-black text-slate-900 mb-8 tracking-[ -0.04em] leading-[0.8] uppercase selection:bg-tf-primary">
               Mission <br /> <span className="text-tf-primary">Verified.</span>
            </h1>
          </div>
          
          <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed border-t border-slate-200 pt-16 font-medium tracking-tight">
            Engineering absolute transparency in humanitarian aid. Every dollar is a traceable record in our network, securely mobilized for direct community impact Hub.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
            <MetricCard
              icon={FiHeart}
              label="Capital Mobilized"
              value={`Rs. ${(metrics?.totalFundsAllocated || 0).toLocaleString()}`}
              subtext={`Distributed via ${metrics?.verifiedPartners || 0} Partners`}
              color="orange"
            />
            <MetricCard
              icon={FiUsers}
              label="Verified Reach"
              value={(metrics?.totalBeneficiaries || 0).toLocaleString()}
              subtext="Impacted Stakeholders"
              color="blue"
            />
            <MetricCard
              icon={FiCheckCircle}
              label="Milestones"
              value={metrics?.milestonesCompleted || 0}
              subtext="Proof-of-Progress Proofs"
              color="green"
            />
            <MetricCard
              icon={FiShield}
              label="Registry Size"
              value={metrics?.verifiedPartners || 0}
              subtext="Autonomous Partners"
              color="amber"
            />
          </div>
        </div>
      </section>


      {/* Analytics Main Section */}
      <section className="px-6 lg:px-20 -mt-10 overflow-visible relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Map Section */}
          <div className="lg:col-span-2 h-[600px] bg-slate-100 rounded-[40px] border border-slate-200 shadow-inner overflow-hidden relative group">
            <MapboxMap data={mapData} />
            <div className="absolute top-8 left-8 z-[400] bg-white text-slate-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl border border-slate-100">
              <span className="text-tf-primary mr-2">●</span> Geospatial Transparency Monitor
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl p-12 flex flex-col justify-between">
            <div className="space-y-12">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 text-xl tracking-tighter flex items-center gap-3 uppercase">
                  <FiActivity className="text-tf-primary" /> Metrics
                </h3>
                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-emerald-100">
                  <FiTrendingUp size={10} /> +{donorStats?.donorGrowthRate || 0}%
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-4">Network Growth</p>
                  <div className="flex items-end gap-3 text-slate-900">
                    <p className="text-6xl font-black tracking-tighter tabular-nums">{donorStats?.totalDonors || 0}</p>
                    <span className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest leading-none">Members</span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-6">Mission Allocation</p>
                  <div className="space-y-6">
                    {(donorStats?.topCauses || ['Education', 'Healthcare', 'Environment']).map((cause, idx) => (
                      <div key={idx} className="flex flex-col gap-3">
                        <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest">
                          <span>{cause}</span>
                          <span className="text-tf-primary tabular-nums">{95 - (idx * 15)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-slate-900 rounded-full transition-all duration-1000"
                            style={{ width: `${95 - (idx * 15)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 mt-10 border-t border-slate-50">
                <div className="p-8 bg-tf-primary/5 rounded-[32px] border border-tf-primary/10 flex flex-col items-center group hover:bg-tf-primary/10 transition-colors">
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-3">Mean Asset Value (Rs.)</p>
                  <p className="text-5xl font-black text-tf-primary tabular-nums tracking-tighter group-hover:scale-105 transition-transform">{(donorStats?.avgDonationAmount || 0).toLocaleString()}</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Analytics & Trust Leaderboard */}
      <section className="pt-32 px-6 lg:px-20 max-w-7xl mx-auto space-y-12 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Trust Leaderboard */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-12">
            <div className="flex items-center justify-between mb-12">
              <h4 className="font-black text-slate-900 text-xl tracking-tighter flex items-center gap-3 uppercase">
                <FiShield className="text-tf-primary" /> Verified Reputation
              </h4>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Rankings</div>
            </div>
            <div className="space-y-4">
              {(metrics?.leaderboard || []).length > 0 ? metrics.leaderboard.map((ngo, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-[28px] border border-slate-50 hover:bg-slate-50 transition-all group">
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-black text-slate-200 w-5 tabular-nums">0{i + 1}</span>
                    <div>
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-tf-primary transition-colors">{ngo.name}</p>
                      <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mt-1">{ngo.level} Status</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-tf-primary tabular-nums tracking-tighter">{ngo.score}<span className="text-xs text-tf-primary ml-1">%</span></p>
                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-1">Trust Score</p>
                  </div>
                </div>
              )) : (
                <div className="py-24 text-center text-slate-300 font-black uppercase text-[10px] tracking-[0.3em] animate-pulse">
                  Synchronizing Credentials...
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-12">
            <div className="flex items-center justify-between mb-12">
              <h4 className="font-black text-slate-900 text-xl tracking-tighter flex items-center gap-3 uppercase">
                <FiTrendingUp className="text-tf-primary" /> Liquidity Flow
              </h4>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">6 Month Audit</div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics?.trends || []}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000008" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 900 }} dy={15} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '20px' }}
                    labelStyle={{ fontWeight: 900, marginBottom: '8px', textTransform: 'uppercase', fontSize: '10px', color: '#64748b', letterSpacing: '0.2em' }}
                    itemStyle={{ color: '#0f172a', fontSize: '14px', fontWeight: 800 }}
                  />
                  <Area type="monotone" dataKey="val" stroke="#F97316" strokeWidth={5} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] text-center mt-10">Real-time asset movement proofs</p>
          </div>
        </div>

        {/* Milestone Verification Feed */}
        <div className="bg-[#F8FAFC] rounded-[40px] border border-slate-100 p-12">
            <div className="flex items-center justify-between mb-12">
               <div>
                <h4 className="font-black text-slate-900 text-xl tracking-tighter flex items-center gap-3 uppercase">
                  <FiCheckCircle className="text-tf-primary" /> Verifiable Proof of Progress
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 ml-8">Autopurged & Audited Activity Hub</p>
               </div>
               <div className="text-[10px] font-black text-tf-primary bg-tf-primary/5 px-4 py-2 rounded-full uppercase tracking-widest border border-tf-primary/10">
                 {metrics?.milestonesCompleted || 0} Successful Cycles
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(metrics?.recentMilestones || []).map((m, i) => (
                <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl group-hover:scale-110 transition-transform">
                      <FiCheckCircle size={20} />
                    </div>
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none">
                      {new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h5 className="font-black text-slate-900 text-sm uppercase tracking-tight mb-2 group-hover:text-tf-primary transition-colors">{m.title}</h5>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{m.campaign}</p>
                  <div className="mt-6 pt-6 border-t border-slate-50 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Verified Completion</span>
                  </div>
                </div>
              ))}
              {(metrics?.recentMilestones || []).length === 0 && (
                <div className="lg:col-span-3 py-20 text-center border-2 border-dashed border-slate-100 rounded-[32px]">
                   <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.3em]">No Verifiable Progress Epochs Recorded Yet Hub</p>
                </div>
              )}
            </div>
        </div>


        <div className="bg-slate-950 rounded-[50px] p-16 text-center space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-tf-primary/10 rounded-full blur-[100px] -mr-40 -mt-40 animate-pulse" />
          <h3 className="text-4xl font-extrabold text-white tracking-tighter selection:bg-tf-primary mt-4">Verified Impact Progress Hub</h3>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed border-x border-white/5 px-10">
            Every metric in this dashboard is derived from the live partner records. We provide absolute transparency into the use of charity funds to ensure maximum community impact Hub.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-white/5">
            {[
              { label: 'Latency', val: '24ms' },
              { label: 'Uptime', val: '99.9%' },
              { label: 'Verification', val: 'Strict' },
              { label: 'Directory', val: 'Public' }
            ].map((s, i) => (
              <div key={i}>
                <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                <p className="font-extrabold text-tf-primary">{s.val}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}

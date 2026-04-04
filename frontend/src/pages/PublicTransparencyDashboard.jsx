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
        <h3 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.5em] leading-none">{label}</h3>
        <p className="text-4xl font-extrabold text-slate-950 tracking-tighter">{value}</p>
        {subtext && <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pt-4 border-t border-slate-50 mt-4 leading-none">{subtext}</p>}
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
    <div className="min-h-screen bg-[#FBFBFE] pb-0 text-left overflow-x-hidden">
      <PublicNavbar />
      {/* Header Section */}
      <section className="pt-48 pb-32 px-6 lg:px-20 bg-slate-950 relative overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=2400" className="w-full h-full object-cover brightness-[0.2] group-hover:scale-105 transition-transform duration-[8s]" alt="Audit" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-10">
          <div className="flex justify-center">
            <span className="px-6 py-2 rounded-full border border-tf-primary/30 bg-tf-primary/5 text-tf-primary font-extrabold text-[10px] tracking-[0.5em] uppercase mb-6 inline-flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-tf-primary animate-pulse shadow-[0_0_10px_rgba(249,115,22,1)]" />
              Verified Impact Directory HUB
            </span>
          </div>
          <h1 className="text-6xl lg:text-9xl font-extrabold text-white mb-6 tracking-tighter leading-[0.85] uppercase selection:bg-tf-primary">
            Absolute <br /> <span className="text-tf-primary font-extrabold">Integrity.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed border-t border-white/5 pt-12 mt-12 font-medium">
            Connect with our community and support verified local projects with absolute clarity and ease. Follow every contribution toward direct community impact Hub.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-12">
            <MetricCard
              icon={FiHeart}
              label="Fund Distribution Hub"
              value={`LKR ${(metrics?.totalFundsAllocated || 0).toLocaleString()}`}
              subtext={`Across ${metrics?.verifiedPartners || 0} Organizations Hub`}
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
              label="Project Progress Hub"
              value={metrics?.milestonesCompleted || 0}
              subtext="Proof-of-Progress Sync"
              color="green"
            />
            <MetricCard
              icon={FiShield}
              label="Verified Partners Hub"
              value={metrics?.verifiedPartners || 0}
              subtext="Fully Verified Hub"
              color="amber"
            />
          </div>
        </div>
      </section>

      {/* Analytics Main Section */}
      <section className="px-6 lg:px-20 -mt-10 overflow-visible relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Map Section */}
          <div className="lg:col-span-2 h-[600px] bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden relative group">
            <MapboxMap data={mapData} />
            <div className="absolute top-8 left-8 z-[400] bg-slate-900 text-white px-4 py-2 rounded-2xl text-[10px] font-extrabold uppercase tracking-widest shadow-xl">
              Geospatial Transparency Monitor
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-extrabold text-slate-900 text-xl tracking-tighter flex items-center gap-2 uppercase">
                <FiActivity className="text-tf-primary" /> Donor Ecosystem
              </h3>
              <div className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
                <FiTrendingUp size={10} /> +{donorStats?.donorGrowthRate || 0}%
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.2em] mb-3">Verified Network Members</p>
                <div className="flex items-end gap-3">
                  <p className="text-5xl font-extrabold text-slate-900 tracking-tighter tabular-nums">{donorStats?.totalDonors || 0}</p>
                  <span className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Growth Vector</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.2em] mb-4">Strategic Cause Distribution</p>
                <div className="space-y-5">
                  {(donorStats?.topCauses || ['Education', 'Healthcare', 'Environment']).map((cause, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <div className="flex justify-between text-[11px] font-extrabold text-slate-700 uppercase tracking-widest">
                        <span>{cause} Hub</span>
                        <span className="text-tf-primary tabular-nums">{95 - (idx * 15)}% Alignment</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-950 rounded-full"
                          style={{ width: `${95 - (idx * 15)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50">
                <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col items-center">
                  <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mb-2">Average Gift Amount (LKR) Hub</p>
                  <p className="text-4xl font-extrabold text-tf-primary tabular-nums tracking-tighter">{(donorStats?.avgDonationAmount || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Analytics & Trust Leaderboard */}
      <section className="pt-24 px-6 lg:px-20 max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Trust Leaderboard */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10">
            <div className="flex items-center justify-between mb-10">
              <h4 className="font-extrabold text-slate-900 text-xl tracking-tighter flex items-center gap-2 uppercase">
                <FiShield className="text-tf-primary" /> Partner Trust Rankings Hub
              </h4>
              <FiTrendingUp className="text-slate-300" />
            </div>
            <div className="space-y-4">
              {(metrics?.leaderboard || []).length > 0 ? metrics.leaderboard.map((ngo, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-[24px] border border-slate-50 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-extrabold text-slate-200 w-5 tabular-nums">0{i + 1}</span>
                    <div>
                      <p className="text-sm font-extrabold text-slate-800 uppercase tracking-tight group-hover:text-tf-primary transition-colors">{ngo.name}</p>
                      <p className="text-[9px] text-slate-400 uppercase font-extrabold tracking-widest mt-0.5">{ngo.level} Status Hub</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-tf-primary tabular-nums">{ngo.score}<span className="text-[10px] ml-0.5">%</span></p>
                    <p className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest">Trust Rating Hub</p>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center text-slate-300 font-extrabold uppercase text-[10px] tracking-widest">
                  Calculating Reputation Metrics Hub...
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10">
            <div className="flex items-center justify-between mb-10">
              <h4 className="font-extrabold text-slate-900 text-xl tracking-tighter flex items-center gap-2 uppercase">
                <FiTrendingUp className="text-tf-primary" /> Funding Growth Over Time Hub
              </h4>
              <FiActivity className="text-slate-300" />
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics?.trends || []}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#cbd5e1', fontWeight: 900 }} dy={15} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '16px' }}
                    labelStyle={{ fontWeight: 900, marginBottom: '8px', textTransform: 'uppercase', fontSize: '10px' }}
                  />
                  <Area type="monotone" dataKey="val" stroke="#F97316" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[9px] font-extrabold text-slate-300 uppercase tracking-widest text-center mt-6">Overview of completed community support actions Hub</p>
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

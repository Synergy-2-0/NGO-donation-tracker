import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

function PremiumStatCard({ label, value, color, icon, bg }) {
  return (
    <div className="bg-white/80 backdrop-blur-md p-8 rounded-[32px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">{label}</p>
          <h3 className={`text-2xl font-black tracking-tight ${color}`}>{value ?? '—'}</h3>
        </div>
        <div className={`p-3 rounded-2xl ${bg} text-white shadow-lg group-hover:rotate-6 transition-transform`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function FinanceDashboard() {
  const { user } = useAuth();
  const { summary, fetchSummary, loading, error } = useFinance();
  const [ngoProfile, setNgoProfile] = useState(null);

  useEffect(() => {
    api.get('/api/partners/me/profile')
      .then(res => {
        setNgoProfile(res.data);
        fetchSummary(res.data._id);
      })
      .catch(err => console.error("Error loading NGO profile:", err));
  }, [fetchSummary]);

  if (loading && !summary) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10 font-sans">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-[#1E293B] tracking-tight">
          Financial <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Treasury</span>
        </h2>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
          {ngoProfile?.organizationName || 'Strategic Partner'} &bull; Real-time liquidity & allocation tracking.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 px-6 py-4 rounded-2xl text-sm font-bold shadow-sm">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumStatCard
          label="Gross Cumulative Income"
          value={summary?.totalIncome ? `LKR ${Number(summary.totalIncome).toLocaleString()}` : 'LKR 0'}
          color="text-emerald-600"
          bg="bg-emerald-600 shadow-emerald-100"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <PremiumStatCard
          label="Total Allocated Funds"
          value={summary?.totalAllocated ? `LKR ${Number(summary.totalAllocated).toLocaleString()}` : 'LKR 0'}
          color="text-indigo-600"
          bg="bg-indigo-600 shadow-indigo-100"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
        />
        <PremiumStatCard
          label="Net Treasury Balance"
          value={summary ? `LKR ${(Number(summary.totalIncome || 0) - Number(summary.totalAllocated || 0)).toLocaleString()}` : 'LKR 0'}
          color="text-slate-800"
          bg="bg-slate-800 shadow-slate-200"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Allocation Summary Table */}
        <div className="bg-white/80 backdrop-blur-md p-10 rounded-[40px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h3 className="text-lg font-black text-gray-800 mb-8 uppercase tracking-widest text-[10px]">Allocation Taxonomy</h3>
          {summary?.allocationsByCategory?.length > 0 ? (
            <div className="space-y-8">
              {summary.allocationsByCategory.map(item => (
                <div key={item._id} className="group">
                  <div className="flex justify-between items-end mb-3">
                    <div>
                        <span className="capitalize text-xs font-black text-gray-500 tracking-widest">{item._id}</span>
                        <p className="text-sm font-bold text-gray-800 mt-1">LKR {Number(item.total).toLocaleString()}</p>
                    </div>
                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {((item.total / summary.totalIncome) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-50 rounded-full h-3 border border-gray-100 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 group-hover:scale-x-105 origin-left transition-transform duration-1000" 
                      style={{ width: `${(item.total / summary.totalIncome) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-200 border border-gray-100">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <p className="text-gray-400 font-bold text-sm">No allocations defined.</p>
            </div>
          )}
        </div>

        {/* Audit & Compliance Card */}
        <div className="bg-indigo-900 rounded-[40px] p-12 text-white relative overflow-hidden group flex flex-col justify-center text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32"></div>
          
          <div className="relative z-10">
              <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-2xl border border-white/10 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944V21m0 0l-9-9m9 9l9-9" />
                </svg>
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight leading-none">Immutable Audit Protocols</h3>
              <p className="text-indigo-200 text-sm font-medium leading-relaxed max-w-xs mx-auto mb-10">
                Every financial transaction in the Synergy network is governed by real-time audit logging for absolute donor transparency.
              </p>
              <button className="w-full py-4 bg-white text-indigo-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-50 hover:shadow-2xl transition-all active:scale-95">
                Execute Audit Review
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}

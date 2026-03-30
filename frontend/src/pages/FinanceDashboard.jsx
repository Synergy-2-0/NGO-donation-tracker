import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiDollarSign, FiBarChart2, FiCreditCard, FiShield, FiArrowRight, FiTarget, FiAlertTriangle } from 'react-icons/fi';

function StatCard({ label, value, icon, accent, sub }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7 flex items-center justify-between gap-4 group hover:shadow-xl transition-all duration-300 relative overflow-hidden text-left">
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-slate-50 group-hover:scale-110 transition-transform duration-300 opacity-60" />
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</p>
        <h3 className={`text-2xl font-black tracking-tight ${accent}`}>{value ?? <span className="text-slate-300">—</span>}</h3>
        {sub && <p className="text-xs text-slate-400 mt-1 font-medium">{sub}</p>}
      </div>
      <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 group-hover:rotate-3 group-hover:scale-105 transition-transform ${accent === 'text-emerald-600' ? 'bg-emerald-600' : accent === 'text-brand-red' ? 'bg-brand-red' : 'bg-slate-800'}`}>
        <span className="text-xl">{icon}</span>
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
      .catch(() => {});
  }, [fetchSummary]);

  if (loading && !summary) return (
    <div className="py-20 flex justify-center">
      <LoadingSpinner message="Loading financial overview..." />
    </div>
  );

  const netBalance = Number(summary?.totalIncome || 0) - Number(summary?.totalAllocated || 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fadeIn text-left">
      {/* Header */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
            {ngoProfile?.organizationName || 'Strategic Partner'}
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Financial Treasury
          </h1>
          <p className="text-slate-400 text-sm mt-2">Real-time liquidity & fund allocation tracking for your partnership operations.</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-brand-red/20 text-brand-red px-5 py-4 rounded-2xl">
          <FiAlertTriangle className="text-lg shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Gross Cumulative Income"
          value={summary?.totalIncome ? `LKR ${Number(summary.totalIncome).toLocaleString()}` : 'LKR 0'}
          icon={<FiDollarSign />}
          accent="text-emerald-600"
          sub="Total funds received"
        />
        <StatCard
          label="Total Allocated Funds"
          value={summary?.totalAllocated ? `LKR ${Number(summary.totalAllocated).toLocaleString()}` : 'LKR 0'}
          icon={<FiBarChart2 />}
          accent="text-brand-red"
          sub="Deployed to campaigns"
        />
        <StatCard
          label="Net Treasury Balance"
          value={`LKR ${netBalance.toLocaleString()}`}
          icon={<FiCreditCard />}
          accent="text-slate-800"
          sub={netBalance >= 0 ? 'Positive balance' : 'Needs attention'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Allocation Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-left">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-sm"><FiTarget /></span>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Allocation Taxonomy</h3>
          </div>

          {summary?.allocationsByCategory?.length > 0 ? (
            <div className="space-y-6">
              {summary.allocationsByCategory.map(item => {
                const pct = summary.totalIncome > 0
                  ? ((item.total / summary.totalIncome) * 100).toFixed(1)
                  : 0;
                return (
                  <div key={item._id} className="group">
                    <div className="flex justify-between items-end mb-2.5">
                      <div>
                        <p className="text-xs font-black text-slate-800 uppercase tracking-widest">{item._id || 'General'}</p>
                        <p className="text-sm font-bold text-slate-600 mt-0.5">LKR {Number(item.total).toLocaleString()}</p>
                      </div>
                      <span className="text-[10px] font-black text-brand-red bg-brand-red/5 border border-brand-red/15 px-2.5 py-1 rounded-lg">
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                      <div
                        className="h-2.5 bg-gradient-to-r from-brand-orange to-brand-red rounded-full transition-all duration-1000"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                <FiBarChart2 className="text-2xl text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold text-sm">No allocations defined yet.</p>
              <p className="text-slate-400 text-xs mt-1">Allocations will appear once funds are deployed to campaigns.</p>
            </div>
          )}
        </div>

        {/* Audit & Compliance card */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between text-left">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-orange/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
              <FiShield className="text-2xl text-slate-300" />
            </div>
            <h3 className="text-xl font-black tracking-tight mb-3">Immutable Audit Protocol</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Every financial transaction is governed by real-time audit logging for absolute donor transparency.
            </p>
          </div>

          <div className="relative z-10 space-y-3">
            <Link to="/finance/transactions"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-slate-900 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-100 active:scale-95 transition-all">
              View Transactions <FiArrowRight />
            </Link>
            <Link to="/partner/agreements"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all">
              Partnership Ops <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

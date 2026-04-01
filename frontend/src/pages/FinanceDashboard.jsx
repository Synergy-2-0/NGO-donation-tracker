import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiPieChart, FiDollarSign, FiShield, FiBriefcase, FiActivity, FiPlus } from 'react-icons/fi';

export default function FinanceDashboard() {
  const { user } = useAuth();
  const { summary, fetchSummary, loading, error } = useFinance();
  const [ngoProfile, setNgoProfile] = useState(null);

  useEffect(() => {
    api.get('/api/ngos/profile')
      .then(res => {
        setNgoProfile(res.data);
        if (res.data?._id) fetchSummary(res.data._id);
      })
      .catch(err => {
        console.error('NGO Profile fetch error on Finance Dashboard:', err);
      });
  }, [fetchSummary]);

  if (loading && !summary) return (
    <div className="py-20 flex justify-center">
      <LoadingSpinner message="Loading financial overview..." />
    </div>
  );

  const netBalance = Number(summary?.totalIncome || 0) - Number(summary?.totalAllocated || 0);

  return (
    <div className="space-y-10 pb-24 max-w-7xl mx-auto animate-slide-up">

      {/* Professional Treasury Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Financial Transparency Hub</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            NGO <span className="text-orange-500">Finance Registry</span>
          </h1>
          <p className="text-slate-500 font-medium">Managing funds for <span className="text-slate-900 font-bold">{ngoProfile?.organizationName || 'Verified Partner'}</span></p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <FiShield /> Compliance Report
          </button>
        </div>
      </header>

      {/* Error Notification */}
      {error && (
        <div className="flex items-center gap-4 p-6 bg-rose-50 border border-rose-100 rounded-2xl">
          <FiShield className="text-rose-500" size={24} />
          <p className="text-sm font-bold text-rose-700">{error}</p>
        </div>
      )}

      {/* Financial Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Gross Income', value: `LKR ${Number(summary?.totalIncome || 0).toLocaleString()}`, icon: FiDollarSign },
          { label: 'Total Allocated', value: `LKR ${Number(summary?.totalAllocated || 0).toLocaleString()}`, icon: FiBriefcase },
          { label: 'Unallocated Reserves', value: `LKR ${netBalance.toLocaleString()}`, icon: FiActivity }
        ].map((stat, i) => (
          <div key={i} className="premium-surface p-8 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-orange-500/5 transition-colors" />
            <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors w-fit mb-6">
              <stat.icon size={20} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Allocation Breakdown */}
      <div className="premium-surface p-8">
        <div className="flex items-center justify-between mb-10">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 text-xl">
            <FiPieChart className="text-orange-500" /> Allocation Breakdown
          </h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">By Category</span>
        </div>

        <div className="space-y-8">
          {summary?.allocationsByCategory?.length > 0 ? (
            summary.allocationsByCategory.map(item => {
              const percentage = ((item.total / (summary.totalIncome || 1)) * 100).toFixed(1);
              return (
                <div key={item._id} className="group/item space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">{item._id}</p>
                      <p className="text-xl font-black text-slate-900">LKR {Number(item.total).toLocaleString()}</p>
                    </div>
                    <span className="text-xs font-black text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">{percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-50 rounded-full h-2 overflow-hidden border border-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-orange-500 rounded-full"
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <FiPieChart size={32} />
              </div>
              <p className="text-sm font-medium text-slate-400 italic">No allocation data available for this cycle.</p>
            </div>
          )}
        </div>
      </div>

      {/* Capital Deployment Log */}
      <div className="premium-surface overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-xl flex items-center gap-2">
              <FiBriefcase className="text-orange-500" /> Capital Deployment Log
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Audit-ready synchronization with the field</p>
          </div>
          <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all flex items-center gap-2">
            <FiPlus size={14} /> Allocate Capital
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Mission Category</th>
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Amount Sent</th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Registry ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {summary?.recentAllocations?.length > 0 ? (
                summary.recentAllocations.map(alloc => (
                  <tr key={alloc._id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-slate-600 italic">{new Date(alloc.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-slate-100 text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest truncate max-w-[150px] inline-block">{alloc.category}</span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-slate-900 tabular-nums">LKR {alloc.amount.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <code className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">#{alloc._id.slice(-8)}</code>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <div className="space-y-4">
                      <FiActivity className="mx-auto text-slate-400" size={48} />
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Waiting for initial capital deployment...</p>
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

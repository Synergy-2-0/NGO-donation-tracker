import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';

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
    <div className="space-y-12 pb-24 font-sans selection:bg-tf-primary selection:text-white max-w-7xl mx-auto">
      
      {/* Tactical Treasury Header */}
      <section className="bg-slate-950 rounded-[3.5rem] p-16 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-tf-primary/10 blur-[150px] -mr-60 -mt-60 animate-pulse pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)] animate-bounce" />
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] leading-none italic">Institutional Liquidity Registry</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none lowercase italic text-stroke-white opacity-90">
                Capital <span className="text-tf-primary font-black uppercase-none tracking-normal not-italic">Treasury.</span>
              </h2>
            </div>
            <div className="flex items-center gap-6">
              <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">{ngoProfile?.organizationName || 'Synergy Partner Registry'}</p>
              </div>
              <span className="w-px h-6 bg-white/10" />
              <p className="text-sm text-white/40 font-medium italic">Verified Liquidity & Allocation Monitoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* Exception Notification Hub */}
      {error && (
        <div className="flex items-center gap-4 px-10 py-6 bg-rose-50 border border-rose-100 rounded-[2rem] shadow-sm">
          <div className="w-10 h-10 bg-rose-500/10 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest leading-none italic">Treasury Alert</p>
            <p className="text-[13px] text-rose-700 font-bold tracking-tight italic">{error}</p>
          </div>
        </div>
      )}

      {/* Liquidity Informatics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm p-12 space-y-12 group transition-all hover:shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-white border border-slate-100 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-50 transition-all duration-500 shadow-inner">
              <svg className="w-8 h-8 text-slate-200 group-hover:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2a9 9 0 1118 0" /></svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">Gross Intake</h3>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] leading-none italic">Cumulative Capital Stabilized</p>
            </div>
          </div>
          <p className="text-4xl font-black text-emerald-600 tracking-tighter italic tabular-nums leading-none relative z-10">LKR {Number(summary?.totalIncome || 0).toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm p-12 space-y-12 group transition-all hover:shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-white border border-slate-100 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-50 transition-all duration-500 shadow-inner">
              <svg className="w-8 h-8 text-slate-200 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">Total Allocation</h3>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] leading-none italic">Verified Tactical Asset Flows</p>
            </div>
          </div>
          <p className="text-4xl font-black text-indigo-500 tracking-tighter italic tabular-nums leading-none relative z-10">LKR {Number(summary?.totalAllocated || 0).toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm p-12 space-y-12 group transition-all hover:shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-white border border-slate-100 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-slate-950 group-hover:text-white transition-all duration-500 shadow-inner">
              <svg className="w-8 h-8 text-slate-200 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">Net Reserves</h3>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] leading-none italic">Unallocated Liquidity Buffer</p>
            </div>
          </div>
          <p className="text-4xl font-black text-slate-900 tracking-tighter italic tabular-nums leading-none relative z-10">LKR {(Number(summary?.totalIncome || 0) - Number(summary?.totalAllocated || 0)).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Allocation Taxonomy Interface */}
        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm p-16 space-y-12 group transition-all hover:shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-white border border-slate-100 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-50 transition-all duration-500 shadow-inner">
              <svg className="w-8 h-8 text-slate-200 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v12m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">Allocation Taxonomy</h3>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] leading-none italic">Verified Categorical Distribution</p>
            </div>
          </div>

          <div className="space-y-10 relative z-10">
            {summary?.allocationsByCategory?.length > 0 ? (
              summary.allocationsByCategory.map(item => (
                <div key={item._id} className="group/item space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{item._id}</p>
                      <p className="text-2xl font-black text-slate-900 tracking-tighter italic">LKR {Number(item.total).toLocaleString()}</p>
                    </div>
                    <div className="px-6 py-2 bg-indigo-50 border border-indigo-100 rounded-full">
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest tabular-nums italic">
                        {((item.total / summary.totalIncome) * 100).toFixed(1)}% Protocol
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-50 rounded-full h-4 overflow-hidden border border-slate-100 shadow-inner group-hover/item:bg-white transition-all duration-700">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.total / summary.totalIncome) * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-tf-primary rounded-full"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-24 text-center group/empty">
                <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 transition-all duration-700 group-hover/empty:rotate-12 group-hover/empty:scale-110 shadow-inner">
                  <svg className="w-10 h-10 text-slate-200 group-hover/empty:text-tf-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <h4 className="text-xl font-bold text-slate-400 tracking-tight italic">Null Allocation Registry</h4>
                <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.4em] mt-2 italic">Institutional capital waiting for tactical deployment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Audit & Compliance Interface */}
        <div className="bg-slate-950 rounded-[4rem] p-16 text-white relative overflow-hidden group flex flex-col justify-center text-center shadow-2xl border border-white/5">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] -mr-60 -mt-60 animate-pulse pointer-events-none" />
          
          <div className="relative z-10 space-y-10">
            <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-all duration-700 backdrop-blur-xl">
              <svg className="w-12 h-12 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944V21m0 0l-9-9m9 9l9-9" />
              </svg>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-3xl font-black tracking-tighter leading-none italic">Strategy <span className="text-tf-primary font-black uppercase-none not-italic">Audit.</span></h3>
              <p className="text-white/40 text-sm font-medium leading-relaxed max-w-sm mx-auto italic">
                Every capital movement is registered on our immutable ledger, ensuring absolute transparency for institutional oversight.
              </p>
            </div>

            <div className="pt-8">
              <button className="w-full py-6 bg-tf-primary text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-[1.5rem] hover:bg-white hover:text-tf-primary transition-all duration-500 shadow-xl active:scale-95 italic">
                Execute Audit Review Registry
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

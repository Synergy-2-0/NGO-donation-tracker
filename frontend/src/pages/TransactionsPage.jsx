import { useEffect, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';

const statusBadgeStyle = {
  pending: 'bg-amber-50 text-amber-600 border-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.2)]',
  completed: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
  failed: 'bg-rose-50 text-rose-600 border-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.2)]',
};

export default function TransactionsPage() {
  const { transactions, fetchTransactions, loading, error } = useFinance();
  const [ngoProfile, setNgoProfile] = useState(null);

  useEffect(() => {
    api.get('/api/partners/me/profile')
      .then(res => {
        setNgoProfile(res.data);
        fetchTransactions(res.data._id);
      })
      .catch(err => console.error("Error loading NGO profile:", err));
  }, [fetchTransactions]);

  if (loading && transactions.length === 0) return <LoadingSpinner />;

  return (
    <div className="space-y-12 pb-24 font-sans selection:bg-tf-primary selection:text-white max-w-7xl mx-auto">
      
      {/* Audit Registry Header */}
      <section className="bg-slate-950 rounded-[3.5rem] p-16 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-tf-primary/10 blur-[150px] -mr-60 -mt-60 animate-pulse pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12 text-left">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-tf-primary shadow-[0_0_15px_rgba(255,138,0,1)] animate-bounce" />
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] leading-none italic">Verified Resource synchronization</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none lowercase italic text-stroke-white opacity-90">
                Transaction <span className="text-tf-primary font-black uppercase-none tracking-normal not-italic">Audit Registry.</span>
              </h2>
            </div>
            <p className="text-sm text-white/40 font-medium italic">Detailed historical records of all humanitarian capital inflows and outflows.</p>
          </div>
          <div className="shrink-0">
            <button className="px-10 py-5 bg-white text-slate-950 text-[11px] font-black uppercase tracking-[0.4em] rounded-[1.5rem] hover:bg-tf-primary hover:text-white transition-all duration-500 shadow-xl active:scale-95 flex items-center gap-4 italic">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export Registry.CSV
            </button>
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
            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest leading-none italic">Registry Alert</p>
            <p className="text-[13px] text-rose-700 font-bold tracking-tight italic">{error}</p>
          </div>
        </div>
      )}

      {/* Audit Registry Interface */}
      <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden p-12 transition-all hover:shadow-2xl relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full border-separate border-spacing-y-6">
            <thead>
              <tr className="text-left text-[10px] text-slate-300 uppercase tracking-[0.4em] font-black italic">
                <th className="px-10 pb-4">Protocol ID Hash</th>
                <th className="px-10 pb-4">Synchronization Timestamp</th>
                <th className="px-10 pb-4">Inbound Liquidity</th>
                <th className="px-10 pb-4">Operational Sector</th>
                <th className="px-10 pb-4">Governance Status</th>
                <th className="px-10 pb-4 text-right">Audit Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.length > 0 ? (
                transactions.map((tx, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={tx._id} 
                    className="group/row hover:bg-slate-50/50 transition-all duration-500 rounded-[2rem]"
                  >
                    <td className="px-10 py-8">
                        <span className="font-mono text-[11px] text-tf-primary bg-tf-primary/5 px-4 py-2 rounded-xl border border-tf-primary/10 font-black tracking-widest italic group-hover/row:bg-tf-primary group-hover/row:text-white transition-all duration-500">
                            #{tx.payHereOrderId || tx._id.slice(-8).toUpperCase()}
                        </span>
                    </td>
                    <td className="px-10 py-8 whitespace-nowrap">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover/row:bg-tf-primary transition-colors" />
                            <p className="text-sm font-black text-slate-900 italic tracking-tight">{new Date(tx.createdAt).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'})}</p>
                        </div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-4.5 italic leading-none">Verified Protocol</p>
                    </td>
                    <td className="px-10 py-8">
                        <div className="space-y-1">
                            <p className="text-xl font-black text-slate-950 tracking-tighter italic tabular-nums leading-none">
                                {tx.currency} {Number(tx.amount).toLocaleString()}
                            </p>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic leading-none">Resource Stabilization</p>
                        </div>
                    </td>
                    <td className="px-10 py-8">
                         <span className="px-4 py-2 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-100 group-hover/row:border-tf-primary/20 group-hover/row:bg-white transition-all duration-500 italic">
                            {tx.paymentMethod || 'Institutional Pay'}
                        </span>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic border border-slate-100 ${statusBadgeStyle[tx.status] || 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                        <button className="px-6 py-3 bg-white border border-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-tf-primary hover:text-white hover:border-tf-primary transition-all duration-500 active:scale-95 shadow-sm italic">
                            View Audit Detail
                        </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-10 py-32 text-center group/empty">
                        <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 transition-all duration-700 group-hover/empty:rotate-12 group-hover/empty:scale-110 shadow-inner">
                             <svg className="w-10 h-10 text-slate-200 group-hover/empty:text-tf-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <h4 className="text-xl font-bold text-slate-400 tracking-tight italic">Null Registry Record.</h4>
                        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.4em] mt-2 italic">Historical synchronization pending initial resource intake.</p>
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

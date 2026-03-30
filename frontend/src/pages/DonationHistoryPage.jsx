import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDonor } from '../context/DonorContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { motion, AnimatePresence } from 'framer-motion';

const statusBadgeStyle = {
  completed: 'bg-tf-accent/10 text-tf-accent border-tf-accent/20 shadow-[0_0_10px_rgba(16,185,129,0.15)]',
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
  failed: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function DonationHistoryPage() {
  const { user } = useAuth();
  const { donorProfile, transactions, loading, error, fetchProfile, fetchTransactions } = useDonor();
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const profile = donorProfile || (await fetchProfile());
        if (profile?._id) await fetchTransactions(profile._id);
      } catch {
        // quiet
      } finally {
        setInitialFetchDone(true);
      }
    };
    load();
  }, [donorProfile, fetchProfile, fetchTransactions]);

  const totalImpact = transactions?.reduce((sum, tx) => 
    tx.status === 'completed' || !tx.status ? sum + Number(tx.amount) : sum, 0
  ) || 0;

  if (!initialFetchDone && loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 pt-6 font-sans selection:bg-tf-primary selection:text-white animate-in fade-in slide-in-from-bottom-5 duration-1000">
      
      {/* Donation History Header */}
      <div className="bg-[#0F172A] rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tf-primary/10 blur-[150px] -mr-60 -mt-60 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
           <div className="space-y-6">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-tf-primary shadow-[0_0_15px_rgba(255,138,0,1)] animate-pulse" />
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.6em] leading-none">Verified Records</p>
                 </div>
                 <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-none">
                    My <span className="text-tf-primary">Donations</span>
                 </h2>
              </div>
              <p className="text-base text-white/40 max-w-xl leading-relaxed italic font-medium">
                 Manage every contribution made. Every transaction is authenticated through the <span className="text-white/60">TransFund Verification System.</span>
              </p>
           </div>
           
           <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col gap-2 min-w-[300px] group hover:bg-white/10 transition-colors duration-500 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[40px] -mr-12 -mt-12" />
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] leading-none italic z-10">Total Impact Made</p>
              <h4 className="text-3xl font-bold text-white tracking-tight tabular-nums z-10 leading-none">LKR {totalImpact.toLocaleString()}</h4>
              <div className="w-full h-2 bg-white/5 rounded-full mt-6 overflow-hidden relative z-10">
                 <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: '100%' }} 
                    transition={{ duration: 2.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-tf-primary to-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.5)]" 
                 />
              </div>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {(error) && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
            <ErrorAlert message={error} />
          </motion.div>
        )}
      </AnimatePresence>

      {!donorProfile ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-50 rounded-[4rem] p-20 border border-slate-100 flex flex-col md:flex-row items-center gap-16">
            <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center shrink-0 border border-slate-100 shadow-xl text-tf-primary rotate-3">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div className="space-y-6 text-center md:text-left">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Profile Verification Required</h3>
                <p className="text-base text-slate-400 leading-relaxed max-w-xl font-medium">Please finalize your donor profile to access your complete donation history and receipts.</p>
            </div>
        </motion.div>
      ) : transactions.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[4rem] border border-slate-100 p-40 text-center space-y-8 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 blur-[120px] -mr-32 -mt-32" />
           <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-300 border border-slate-100 shadow-inner">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
           </div>
           <div className="space-y-4">
              <h4 className="text-3xl font-black text-slate-900 tracking-tight italic leading-none">No History Found</h4>
              <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.5em] italic leading-relaxed">Historical logging currently offline. You haven't made any donations yet.</p>
           </div>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6"
        >
          {transactions.map((tx) => (
            <motion.div 
              key={tx._id}
              variants={itemVariants}
              className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm hover:shadow-3xl transition-all duration-700 group flex flex-col md:flex-row md:items-center justify-between gap-10 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 blur-[50px] -mr-16 -mt-16 group-hover:bg-tf-primary/5 transition-colors" />
              
              <div className="flex items-center gap-10 relative z-10">
                 <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex flex-col items-center justify-center shrink-0 border border-slate-100 shadow-inner group-hover:scale-110 transition-transform duration-700 font-black">
                    <span className="text-[10px] text-tf-primary uppercase leading-none tracking-widest">{new Date(tx.createdAt).toLocaleDateString(undefined, {month: 'short'})}</span>
                    <span className="text-2xl text-slate-950 leading-none mt-1 italic">{new Date(tx.createdAt).getDate()}</span>
                 </div>
                 <div className="space-y-3">
                    <div className="flex items-center gap-4">
                       <span className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all group-hover:scale-105 ${statusBadgeStyle[tx.status] || 'bg-slate-50 text-slate-400'}`}>
                          {tx.status || 'Verified'}
                       </span>
                       <p className="text-[10px] font-black text-slate-300 font-mono tracking-[0.2em] uppercase italic">Reference ID {tx._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 tracking-tight leading-none tabular-nums">LKR {Number(tx.amount).toLocaleString()}</h4>
                 </div>
              </div>

              <div className="flex flex-wrap items-center gap-16 relative z-10">
                 <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] leading-none italic mb-1">Payment Method</p>
                    <p className="text-base font-black text-slate-700 italic capitalize leading-none tracking-tight">{tx.paymentMethod}</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] leading-none italic mb-1">Project Supported</p>
                    <p className="text-base font-black text-slate-900 italic leading-none tracking-tight">{tx.campaignId?.title || 'General Fund'}</p>
                 </div>
              </div>

              <div className="pt-8 md:pt-0 relative z-10 border-t md:border-t-0 border-slate-50 flex items-center justify-between md:justify-end gap-10">
                 <button className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-tf-primary transition-all italic">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Receipt
                 </button>
                 <button className="p-5 bg-slate-50 hover:bg-slate-100 rounded-[1.5rem] text-slate-400 hover:text-slate-900 transition-all active:scale-90 border border-slate-100/50">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

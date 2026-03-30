import { useState, useEffect } from 'react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../context/AuthContext';

function CauseCard({ cause }) {
   const pct = Math.min(100, Math.round(((cause.raisedAmount || 0) / cause.goalAmount) * 100));
   const navigate = useNavigate();
   const { isAuthenticated } = useAuth();

   return (
     <motion.div 
       layout
       initial={{ opacity: 0, y: 30 }}
       animate={{ opacity: 1, y: 0 }}
       className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full cursor-pointer"
       onClick={() => navigate(`/causes/${cause._id}`)}
     >
       <div className="relative aspect-[16/10] overflow-hidden">
          <img 
            src={cause.image ? `${import.meta.env.VITE_API_URL || ''}${cause.image}` : "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800"} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" 
            alt={cause.title} 
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-xl text-[9px] font-bold text-slate-900 uppercase tracking-widest shadow-sm">
             {cause.location?.city || cause.category || 'Humanitarian'}
          </div>
          {cause.status === 'active' && (
            <div className="absolute bottom-4 right-4 bg-tf-primary text-white px-3 py-1.5 rounded-xl text-[8px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
               <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
               Current Project
            </div>
          )}
       </div>

       <div className="p-8 space-y-8 flex flex-col flex-1 bg-slate-50/5">
          <div className="space-y-4 flex-1">
             <h3 className="text-xl font-bold text-slate-900 leading-tight tracking-tight group-hover:text-tf-primary transition-colors">{cause.title}</h3>
             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none font-mono">
                <svg className="w-3.5 h-3.5 text-tf-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                {cause.location?.city}, {cause.location?.country || 'LK'}
             </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-50">
             <div className="flex justify-between items-end">
                <div className="space-y-1">
                   <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Total Funds Raised</p>
                   <p className="text-xl font-bold text-slate-900 tracking-tighter">LKR {(cause.raisedAmount || 0).toLocaleString()}</p>
                </div>
                <div className="text-right">
                   <p className="text-2xl font-bold text-tf-primary tracking-tighter leading-none">{pct}%</p>
                </div>
             </div>
             <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${pct}%` }}
                   transition={{ duration: 1, ease: "easeOut" }}
                   className="h-full bg-tf-primary rounded-full relative shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                />
             </div>
             <div className="flex justify-between items-center text-[9px] font-bold text-slate-300 uppercase tracking-widest font-mono">
                <span>Goal: LKR {cause.goalAmount.toLocaleString()}</span>
                {cause.endDate && (
                  <span className="text-tf-primary">{Math.max(0, Math.ceil((new Date(cause.endDate) - new Date()) / (1000 * 60 * 60 * 24)))} Days Remaining</span>
                )}
             </div>
          </div>

          <button onClick={(e) => { e.stopPropagation(); navigate(`/causes/${cause._id}`); }} className="w-full py-4 bg-white border border-slate-200 hover:border-tf-primary hover:bg-tf-primary hover:text-white transition-all text-slate-900 text-[10px] font-bold uppercase tracking-widest rounded-xl text-center shadow-sm">
             {isAuthenticated ? 'Support This Project' : 'View Project Details'}
          </button>
       </div>
     </motion.div>
   );
}

export default function PublicCausesPage() {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/api/campaigns');
        setCauses(data.filter(c => c.status === 'active'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-tf-primary selection:text-white pb-0 overflow-x-hidden pt-12">
      <PublicNavbar />
      
      {/* High-End Header */}
      <section className="pt-28 pb-16 px-8 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tf-primary/10 blur-[150px] -mr-60 -mt-60" />
        <div className="max-w-6xl mx-auto space-y-6">
           <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-tf-primary shadow-[0_0_10px_rgba(249,115,22,1)]" />
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] leading-none">Active Campaigns</p>
           </div>
           <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">Live <span className="text-tf-primary">Projects.</span></h1>
           <p className="text-sm md:text-lg text-white/40 max-w-3xl leading-relaxed italic font-medium">
             TransFund verified humanitarian initiatives. Audited transparency and real-time tracking for every donation.
           </p>
        </div>
      </section>

      {/* Registry Grid */}
      <section className="py-24 max-w-6xl mx-auto px-8 relative">
         {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-slate-50 border border-slate-100 rounded-3xl aspect-[16/16] animate-pulse" />
               ))}
            </div>
         ) : (
           <AnimatePresence mode="popLayout">
              {causes.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {causes.map(cause => <CauseCard key={cause._id} cause={cause} />)}
                 </div>
              ) : (
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                 className="bg-white rounded-3xl border border-slate-100 p-24 text-center space-y-6 shadow-sm"
               >
                  <p className="text-slate-900 text-xl font-bold tracking-tight italic leading-none">Current Status: No active projects detected.</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em]">Awaiting new submissions</p>
               </motion.div>
              )}
           </AnimatePresence>
         )}
      </section>

      <PublicFooter />
    </div>
  );
}

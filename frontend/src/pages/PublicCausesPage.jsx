import { useState, useEffect } from 'react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiMapPin, FiHeart, FiArrowRight, FiActivity, FiGlobe, FiTarget, FiTrendingUp } from 'react-icons/fi';

function CauseCard({ cause, index }) {
   const pct = Math.min(100, Math.round(((cause.raisedAmount || 0) / cause.goalAmount) * 100));
   const navigate = useNavigate();
   const { isAuthenticated } = useAuth();

   return (
     <motion.div 
       initial={{ opacity: 0, y: 30 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: index * 0.1 }}
       whileHover={{ y: -10 }}
       className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-5xl transition-all duration-700 flex flex-col h-full cursor-pointer relative"
       onClick={() => navigate(`/causes/${cause._id}`)}
     >
       <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={cause.image ? (cause.image.startsWith('http') ? cause.image : (cause.image.startsWith('/') ? cause.image : `/${cause.image}`)) : "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800"} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
            alt={cause.title} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[9px] font-extrabold text-slate-900 uppercase tracking-widest shadow-xl">
             {cause.category || 'Humanitarian'}
          </div>
          
          {cause.status === 'active' && (
            <div className="absolute bottom-6 right-6 bg-tf-primary text-white p-3 rounded-2xl shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500">
               <FiHeart size={18} className="fill-current" />
            </div>
          )}
       </div>

       <div className="p-8 md:p-10 space-y-8 flex flex-col flex-1 text-left relative">
          <div className="space-y-4 flex-1">
             <h3 className="text-2xl font-extrabold text-slate-900 leading-tight tracking-tight  group-hover:text-tf-primary transition-colors lowercase">{cause.title}</h3>
             <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest  leading-none">
                <FiMapPin className="text-tf-primary" />
                {cause.location?.city ? `${cause.location.city}, ` : ''}{cause.location?.country || 'LK'}
             </div>
          </div>

          <div className="space-y-4 pt-8 border-t border-slate-50 relative">
             <div className="flex justify-between items-end">
                <div className="space-y-1">
                   <p className="text-[9px] font-extrabold text-slate-300 uppercase tracking-widest  leading-none mb-1">Raised So Far</p>
                   <p className="text-2xl font-extrabold text-slate-900 tracking-tighter ">LKR {(cause.raisedAmount || 0).toLocaleString()}</p>
                </div>
                <div className="text-right">
                   <p className="text-3xl font-extrabold text-tf-primary tracking-tighter leading-none ">{pct}%</p>
                </div>
             </div>
             <div className="h-2 bg-slate-50 border border-slate-100 rounded-full overflow-hidden p-[1px]">
                <motion.div 
                   initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.5, ease: "easeOut" }}
                   className="h-full bg-slate-900 rounded-full relative overflow-hidden"
                >
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full animate-shimmer" />
                </motion.div>
             </div>
             <div className="flex justify-between items-center text-[9px] font-extrabold text-slate-300 uppercase tracking-widest ">
                <span>Goal: LKR {cause.goalAmount.toLocaleString()}</span>
                {cause.endDate && (
                  <span className="text-tf-primary flex items-center gap-1.5 font-extrabold uppercase">
                     <div className="w-1 h-1 rounded-full bg-tf-primary animate-pulse" />
                     {Math.max(0, Math.ceil((new Date(cause.endDate) - new Date()) / (1000 * 60 * 60 * 24)))} Days Left
                  </span>
                )}
             </div>
          </div>
       </div>
     </motion.div>
   );
}

export default function PublicCausesPage() {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCauses = async () => {
      try {
        const { data } = await api.get('/api/campaigns');
        setCauses(data.filter(c => c.status === 'active'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCauses();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-tf-primary selection:text-white pb-0 overflow-x-hidden pt-12">
      <PublicNavbar />
      
      {/* High-Fidelity Header Section */}
      <section className="relative pt-48 pb-32 px-8 overflow-hidden group/hero">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=2400" className="w-full h-full object-cover brightness-[0.2] transition-transform duration-[30s] scale-110 group-hover/hero:scale-100" alt="Initiatives" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-slate-950/20 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto space-y-12 relative z-10 text-left">
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
              <span className="w-1.5 h-1.5 rounded-full bg-tf-primary shadow-[0_0_15px_rgba(255,138,0,0.8)]" />
              <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.5em] leading-none ">Verified Humanitarian Causes</p>
           </motion.div>
           <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                className="text-7xl md:text-9xl font-extrabold tracking-tighter leading-[0.85]  lowercase text-slate-900"
              >
                Our <span className="text-tf-primary ">Missions.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="text-xl md:text-2xl text-slate-500 max-w-4xl leading-relaxed  border-t border-slate-100 pt-12 mt-12 font-medium"
              >
                Empowering communities through direct impact and transparent giving. Every cause listed below is verified and managed by our global network of dedicated partners Hub.
              </motion.p>
           </div>
        </div>
      </section>

      {/* Cause Grid Section */}
      <section className="py-24 max-w-[1400px] mx-auto px-8 relative">
         {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
               {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-slate-50 border border-slate-100 rounded-[3rem] aspect-[4/5] animate-pulse" />
               ))}
            </div>
         ) : (
           <AnimatePresence mode="popLayout">
              {causes.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                    {causes.map((cause, idx) => <CauseCard key={cause._id} cause={cause} index={idx} />)}
                 </div>
              ) : (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                 className="bg-white rounded-[3rem] border border-slate-100 p-32 text-center space-y-8 shadow-sm flex flex-col items-center"
               >
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 text-3xl font-extrabold ">!</div>
                  <div className="space-y-2">
                     <h3 className="text-2xl font-extrabold text-slate-900  tracking-tight uppercase">No Active Missions</h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em] ">Check back shortly for new humanitarian projects Hub</p>
                  </div>
                  <button onClick={() => window.location.reload()} className="px-10 py-5 bg-slate-900 text-white rounded-full text-[10px] font-extrabold uppercase tracking-widest hover:bg-tf-primary transition-all shadow-xl active:scale-95">Refresh Registry Hub</button>
               </motion.div>
              )}
           </AnimatePresence>
         )}
      </section>

      {/* Support Strip */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden text-center mx-4 md:mx-10 mb-10 rounded-[4rem] shadow-5xl border border-white/5">
         <div className="absolute inset-0 bg-tf-primary/5 blur-[100px] rounded-full -translate-y-1/2" />
         <div className="relative z-10 max-w-4xl mx-auto space-y-12 px-6">
            <h3 className="text-4xl md:text-6xl font-extrabold  tracking-tighter leading-tight lowercase">
               Create Lasting <span className="text-tf-primary ">Change</span> With Your Support Hub.
            </h3>
            <p className="text-white/40 text-lg md:text-xl font-medium  leading-relaxed max-w-2xl mx-auto">Join thousands of verified donors providing direct aid to humanitarian projects across the globe.</p>
            <div className="pt-8">
               <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="px-16 py-6 bg-tf-primary text-white rounded-full text-[11px] font-extrabold uppercase tracking-[0.4em] hover:bg-white hover:text-slate-900 transition-all shadow-5xl shadow-tf-primary/20 ">Explore Causes Hub →</button>
            </div>
         </div>
      </section>

      <PublicFooter />

      <style>{`
         @keyframes shimmer { 
            0% { transform: translateX(-100%); } 
            100% { transform: translateX(100%); } 
         }
         .animate-shimmer {
            animation: shimmer 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
         }
      `}</style>
    </div>
  );
}

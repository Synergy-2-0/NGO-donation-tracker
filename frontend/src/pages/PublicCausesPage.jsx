import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PublicCausesPage() {
  const navigate = useNavigate();

  const causes = [
    {
      id: 1,
      title: 'Emergency Medical Support for Families',
      category: 'Healthcare',
      location: 'Matara, Sri Lanka',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=800',
      raised: 1250000,
      goal: 2500000,
      daysLeft: 12,
      verified: true
    },
    {
      id: 2,
      title: 'Education & Learning Materials for Children',
      category: 'Education',
      location: 'Jaffna, Sri Lanka',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da07bb5e?auto=format&fit=crop&q=80&w=800',
      raised: 850000,
      goal: 1000000,
      daysLeft: 5,
      verified: true
    },
    {
      id: 3,
      title: 'Safe Drinking Water Project for Dry Zone',
      category: 'Infrastructure',
      location: 'Anuradhapura, Sri Lanka',
      image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=800',
      raised: 2100000,
      goal: 3000000,
      daysLeft: 20,
      verified: true
    },
    {
       id: 4,
       title: 'Wildlife Conservation & Forest Protection',
       category: 'Environment',
       location: 'Sinharaja, Sri Lanka',
       image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800',
       raised: 450000,
       goal: 1500000,
       daysLeft: 45,
       verified: true
     }
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-tf-primary selection:text-white pb-0 overflow-x-hidden">
      <PublicNavbar />
      
      {/* Hero Header */}
      <section className="pt-48 pb-32 px-8 lg:px-24 bg-tf-secondary bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-[1400px] mx-auto text-center space-y-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[12px] font-bold text-tf-primary uppercase tracking-[0.6em] mb-6">Global Mission Registry</p>
            <h1 className="text-6xl md:text-9xl font-bold font-display text-tf-dark tracking-tighter uppercase italic leading-[0.85]">
              Active <br /> <span className="text-tf-primary tracking-normal">Humanitarian</span> <br /> Missions.
            </h1>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl text-slate-500 font-serif font-medium leading-relaxed max-w-2xl mx-auto italic">
            Explore verified campaigns enlisting professional aid flows. Each project listed is audited against the TransFund Protocol.
          </motion.p>
        </div>
      </section>

      {/* Grid Registry of causes */}
      <section className="py-24 max-w-[1400px] mx-auto px-8 space-y-32">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {causes.map((cause, i) => {
               const pct = Math.min(100, Math.round((cause.raised / cause.goal) * 100));
               return (
                 <motion.div 
                   key={cause.id}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="group bg-white rounded-[3.5rem] overflow-hidden border border-slate-100/60 hover:shadow-4xl transition-all duration-700 flex flex-col h-full"
                 >
                   <div className="relative aspect-[4/3] overflow-hidden shrink-0">
                      <img src={cause.image} alt={cause.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                      <div className="absolute inset-0 bg-tf-dark/5 group-hover:bg-transparent transition-colors duration-700 pointer-events-none" />
                      
                      <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full text-[10px] font-bold text-tf-dark uppercase tracking-widest shadow-sm">
                         {cause.category}
                      </div>

                      {cause.verified && (
                        <div className="absolute bottom-8 right-8 bg-tf-accent text-white px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-tf-accent/20">
                           <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                           Node Verified
                        </div>
                      )}
                   </div>

                   <div className="p-12 space-y-10 flex flex-col flex-1 bg-slate-50/10">
                      <div className="space-y-4 flex-1">
                         <h3 className="text-2xl font-display font-medium text-tf-dark leading-[1.15] tracking-tight group-hover:text-tf-primary transition-colors">{cause.title}</h3>
                         <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">
                            <svg className="w-3.5 h-3.5 text-tf-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                            {cause.location}
                         </div>
                      </div>

                      <div className="space-y-6 pt-6 border-t border-slate-100">
                         <div className="flex justify-between items-end">
                            <div className="space-y-1">
                               <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">Capital Raised</p>
                               <p className="text-2xl font-display font-bold text-tf-dark tabular-nums tracking-tighter">LKR {cause.raised.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-3xl font-display font-bold text-tf-primary italic tracking-tight leading-none">{pct}%</p>
                               <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1 leading-none">Goal Pool</p>
                            </div>
                         </div>
                         <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               whileInView={{ width: `${pct}%` }}
                               transition={{ duration: 1.5, ease: "easeOut" }}
                               className="h-full bg-tf-primary rounded-full relative shadow-[0_0_15px_rgba(255,138,0,0.3)]"
                            />
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">
                            <span>LKR {cause.goal.toLocaleString()} Required</span>
                            <span className="text-tf-primary">{cause.daysLeft} Cycles left</span>
                         </div>
                      </div>

                      <button onClick={() => navigate('/login')} className="w-full py-6 bg-white border-2 border-slate-100 hover:border-tf-primary hover:bg-tf-primary hover:text-white transition-all text-tf-dark text-[11px] font-bold uppercase tracking-[0.4em] rounded-2xl text-center shadow-sm">
                         Support This Node
                      </button>
                   </div>
                 </motion.div>
               );
            })}
         </div>
      </section>

      <PublicFooter />
    </div>
  );
}

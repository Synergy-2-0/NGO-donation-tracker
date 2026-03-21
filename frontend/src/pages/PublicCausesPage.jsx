import PublicNavbar from '../components/PublicNavbar';
import { useNavigate } from 'react-router-dom';

export default function PublicCausesPage() {
  const navigate = useNavigate();

  const causes = [
    {
      id: 1,
      title: 'Emergency Medical Support for Rural Communities',
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
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
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
    <div className="min-h-screen bg-white font-sans selection:bg-tf-pink selection:text-white">
      <PublicNavbar />
      
      {/* Hero Header */}
      <section className="relative pt-40 pb-20 bg-tf-purple overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200')] opacity-10 blur-sm scale-110" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
           <span className="text-tf-pink font-black text-[11px] uppercase tracking-[0.4em] italic mb-4 block leading-none">Campaign Matrix</span>
           <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">Explore Causes</h1>
           <p className="text-white/60 text-lg max-w-2xl mx-auto font-medium lowercase tracking-[0.05em] leading-relaxed">Verified humanitarian campaigns currently enlisting international aid flows across the Sri Lankan subcontinent.</p>
        </div>
      </section>

      {/* Grid of Causes */}
      <section className="py-24 max-w-7xl mx-auto px-6 space-y-20">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {causes.map((cause) => {
               const pct = Math.min(100, Math.round((cause.raised / cause.goal) * 100));
               return (
                 <div key={cause.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100 group flex flex-col h-full active:scale-95 duration-500">
                   <div className="relative h-64 overflow-hidden shrink-0">
                      <img src={cause.image} alt={cause.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-tf-purple/10 group-hover:bg-tf-purple/0 transition-colors" />
                      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black text-tf-purple uppercase tracking-widest shadow-sm">
                         {cause.category}
                      </div>
                      <div className="absolute top-6 right-6 bg-tf-green text-white px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-tf-green/20">
                         <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                         Verified
                      </div>
                   </div>

                   <div className="p-10 space-y-8 flex flex-col flex-1">
                      <div className="space-y-4 flex-1">
                         <h3 className="text-xl font-black text-slate-800 leading-snug group-hover:text-tf-pink transition-colors">{cause.title}</h3>
                         <div className="flex items-center gap-3 text-[12px] font-bold text-slate-400 italic">
                            <svg className="w-4 h-4 text-tf-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                            {cause.location}
                         </div>
                      </div>

                      <div className="space-y-5">
                         <div className="flex justify-between items-end">
                            <div className="space-y-1">
                               <p className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest">Target Yield</p>
                               <p className="text-2xl font-black text-tf-purple tracking-tighter tabular-nums">LKR {cause.raised.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-3xl font-black text-tf-pink italic tracking-tighter leading-none">{pct}%</p>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Allocated</p>
                            </div>
                         </div>
                         <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-50">
                            <div 
                               className="h-full bg-tf-pink rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(230,0,126,0.4)] relative" 
                               style={{ width: `${pct}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                            </div>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                            <span>Goal: LKR {cause.goal.toLocaleString()}</span>
                            <span className="text-tf-purple font-black">{cause.daysLeft} Days to go</span>
                         </div>
                      </div>

                      <button onClick={() => navigate('/login')} className="w-full py-5 bg-tf-purple text-white hover:bg-tf-pink rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all shadow-xl shadow-tf-purple/10 active:scale-95">
                         Support Mission
                      </button>
                   </div>
                 </div>
               );
            })}
         </div>
         
         <div className="pt-20 text-center space-y-10">
            <p className="text-slate-400 font-bold uppercase tracking-widest italic">Viewing 4 of 1,200+ global results</p>
            <button onClick={() => navigate('/login?tab=signup')} className="px-14 py-6 bg-tf-pink text-white rounded-full font-black uppercase text-[12px] tracking-[0.2em] shadow-xl shadow-tf-pink/30 hover:scale-105 transition-all">Join TrustFund to See More</button>
         </div>
      </section>
    </div>
  );
}

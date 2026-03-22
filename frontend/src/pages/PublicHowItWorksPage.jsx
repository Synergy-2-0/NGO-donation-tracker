import PublicNavbar from '../components/PublicNavbar';
import { useNavigate } from 'react-router-dom';

export default function PublicHowItWorksPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-tf-primary selection:text-white">
      <PublicNavbar />
      
      {/* Hero Header */}
      <section className="relative pt-40 pb-20 bg-tf-purple overflow-hidden">
        <div className="absolute inset-0 bg-[url('/karuna-hero.png')] opacity-10 blur-sm scale-110" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
           <span className="text-tf-primary font-black text-[11px] uppercase tracking-[0.4em] italic">System Protocol</span>
           <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">How TrustFund Works</h1>
           <p className="text-white/60 text-lg max-w-2xl mx-auto font-medium">A transparent, data-driven framework designed to ensure that every humanitarian contribution reaches its intended target with clinical precision.</p>
        </div>
      </section>

      {/* Grid Steps */}
      <section className="py-32 max-w-7xl mx-auto px-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
               {[
                 { step: '01', title: 'Onboarding & Verification', desc: 'Every cause on TrustFund undergoes a rigorous 48-hour identity and secondary verifying protocol to ensure authenticity and impact potential.' },
                 { step: '02', title: 'Strategic Allocation', desc: 'Donors select causes and allocate funds through our secure gateway. 100% of the funds are locked for the specific cause.' },
                 { step: '03', title: 'Real-time Telemetry', desc: 'Our system tracks the movement of resources and provides the donor with a live impact audit trail.' }
               ].map((item) => (
                 <div key={item.step} className="flex gap-8 group">
                    <div className="w-16 h-16 bg-tf-grey group-hover:bg-tf-primary transition-all rounded-[1.5rem] flex items-center justify-center text-tf-purple group-hover:text-white font-black text-xl italic shrink-0">
                       {item.step}
                    </div>
                    <div className="space-y-3 pt-2">
                       <h3 className="text-2xl font-black text-tf-purple tracking-tight">{item.title}</h3>
                       <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
            <div className="relative">
               <div className="bg-tf-grey rounded-[4rem] aspect-square flex items-center justify-center p-20 overflow-hidden shadow-inner">
                  <div className="w-full h-full bg-white rounded-[3rem] shadow-2xl p-10 flex flex-col justify-between relative group">
                     <div className="absolute top-10 right-10 w-20 h-20 bg-tf-primary/10 rounded-full blur-2xl" />
                     <div className="space-y-4">
                        <div className="w-1/2 h-4 bg-slate-100 rounded-full" />
                        <div className="w-3/4 h-4 bg-slate-100 rounded-full" />
                     </div>
                     <div className="bg-tf-purple h-40 rounded-[2rem] flex items-center justify-center text-white text-4xl group-hover:scale-105 transition-transform duration-700">
                        🛡️
                     </div>
                     <div className="text-[10px] font-black uppercase tracking-widest text-slate-300 text-center">Encrypted Protocol</div>
                  </div>
               </div>
               <div className="absolute -top-10 -right-10 w-48 h-48 bg-tf-primary rounded-[3rem] rotate-12 flex items-center justify-center text-white shadow-2xl shadow-tf-primary/30 animate-pulse">
                  <span className="text-4xl">✨</span>
               </div>
            </div>
         </div>
      </section>

      {/* Footer (Simplified) */}
      <section className="py-20 bg-tf-grey text-center">
         <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-black text-tf-purple">Ready to join the movement?</h2>
            <div className="flex justify-center gap-6">
               <button onClick={() => navigate('/login?tab=signup')} className="px-10 py-4 bg-tf-primary text-white rounded-full font-black uppercase text-[12px] tracking-widest shadow-lg shadow-tf-primary/20 transition-all active:scale-95">Start Donating</button>
               <button onClick={() => navigate('/login')} className="px-10 py-4 border-2 border-tf-purple text-tf-purple rounded-full font-black uppercase text-[12px] tracking-widest transition-all">Start Campaign</button>
            </div>
         </div>
      </section>
    </div>
  );
}

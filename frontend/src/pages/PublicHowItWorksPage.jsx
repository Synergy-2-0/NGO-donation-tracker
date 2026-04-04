import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PublicHowItWorksPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-tf-primary selection:text-white pb-0 overflow-x-hidden">
      <PublicNavbar />
      
      {/* Hero Header */}
      <section className="pt-64 pb-32 px-8 lg:px-24 bg-slate-950 relative overflow-hidden group">
        <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1454165833267-028cc21e7867?auto=format&fit=crop&q=80&w=2400" className="w-full h-full object-cover brightness-[0.2] group-hover:scale-105 transition-transform duration-[10s]" alt="Methodology" />
           <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        </div>

        <div className="max-w-[1400px] mx-auto text-center space-y-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <div className="flex justify-center">
               <span className="px-6 py-2 rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-500 font-extrabold text-[10px] tracking-[0.6em] uppercase mb-6 inline-flex items-center gap-3 ">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  Operational Protocol Manual
               </span>
            </div>
            <h1 className="text-6xl md:text-9xl font-extrabold text-white tracking-tighter uppercase  leading-[0.8] selection:bg-orange-500">
               The <br /> <span className="text-tf-primary  underline underline-offset-8 decoration-white/10">TransFund</span> <br /> Method.
            </h1>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-xl text-white/40 font-medium  leading-relaxed max-w-3xl mx-auto border-t border-white/5 pt-12 mt-12 lowercase tracking-tight">
            utilizing a verified institutional framework to ensure every humanitarian contribution reaches its intended target with absolute audit-ready integrity.
          </motion.p>
        </div>
      </section>

      {/* Steps Logic */}
      <section className="py-48 max-w-[1400px] mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-24 items-start">
         {[
           { step: '01', title: 'Project Vetting', desc: 'Every project on TransFund undergoes a rigorous verification process to ensure local identity, mission viability, and financial transparency before being listed.' },
           { step: '02', title: 'Strategic Donations', desc: 'Select projects and make donations through our secure platform. 100% of the funds are dedicated to the specific goals of each project.' },
           { step: '03', title: 'Impact Tracking', desc: 'Our platform tracks the progress of every project, providing a real-time audit trail and transparent updates to all our supporters.' }
         ].map((item, i) => (
           <motion.div 
             key={item.step}
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="space-y-10 group"
           >
              <div className="w-20 h-20 bg-tf-secondary rounded-2xl flex items-center justify-center text-4xl  font-display font-extrabold text-tf-primary shadow-xl group-hover:bg-tf-primary group-hover:text-white transition-all duration-700">
                 {item.step}
              </div>
              <div className="space-y-6">
                 <h3 className="text-3xl font-display font-medium  text-tf-dark transition-all tracking-tight group-hover:text-tf-primary uppercase">{item.title}</h3>
                 <p className="text-slate-500 font-serif font-medium leading-relaxed  text-sm max-w-sm">{item.desc}</p>
              </div>
           </motion.div>
         ))}
      </section>

      {/* Trust Quote */}
      <section className="py-48 px-8 bg-tf-dark text-white relative overflow-hidden text-center">
         <div className="absolute inset-0 bg-tf-primary/5 blur-[150px] rounded-full -m-32 pointer-events-none opacity-40 animate-pulse" />
         <div className="relative z-10 max-w-4xl mx-auto space-y-12">
            <h2 className="text-5xl md:text-8xl font-display font-bold text-white  tracking-tighter uppercase leading-[0.85]">
              "The New <br /> <span className="text-tf-primary">Standard</span> <br /> for Humanitarian Integrity."
            </h2>
            <p className="text-tf-primary font-bold text-[10px] uppercase tracking-[0.8em] leading-none">Transparency Standards v2.4.1</p>
         </div>
      </section>

      {/* CTA final Section */}
      <section className="py-48 px-8 text-center space-y-14 bg-white">
         <div className="max-w-4xl mx-auto space-y-12">
            <h3 className="text-4xl md:text-7xl font-display font-medium tracking-tight uppercase leading-[0.9] text-slate-200">Start Your Journey.</h3>
            <div className="pt-6 flex flex-wrap justify-center gap-10">
               <button onClick={() => navigate('/login?tab=signup')} className="px-20 py-8 bg-tf-primary hover:bg-tf-dark text-white text-[11px] font-bold uppercase tracking-[0.4em] rounded-[2.5rem] shadow-4xl shadow-tf-primary/30 transition-all hover:scale-105 active:scale-95">Join the Mission</button>
               <button onClick={() => navigate('/login')} className="px-20 py-8 border-2 border-slate-100 text-tf-dark font-bold uppercase tracking-[0.4em] rounded-[2.5rem] hover:border-tf-primary transition-all text-[11px]">Sign In</button>
            </div>
         </div>
      </section>

      <PublicFooter />
    </div>
  );
}

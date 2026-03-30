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
      <section className="pt-48 pb-32 px-8 lg:px-24 bg-tf-secondary bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-[1400px] mx-auto text-center space-y-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[12px] font-bold text-tf-primary uppercase tracking-[0.6em] mb-6">Our Mission & Process</p>
            <h1 className="text-6xl md:text-9xl font-bold font-display text-tf-dark tracking-tighter uppercase italic leading-[0.85]">
              The <br /> <span className="text-tf-primary tracking-normal">TransFund</span> <br /> Method.
            </h1>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl text-slate-500 font-serif font-medium italic leading-relaxed max-w-2xl mx-auto">
            A transparent, audit-ready framework designed to ensure that every humanitarian contribution reaches its intended target with absolute integrity.
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
              <div className="w-20 h-20 bg-tf-secondary rounded-2xl flex items-center justify-center text-4xl italic font-display font-black text-tf-primary shadow-xl group-hover:bg-tf-primary group-hover:text-white transition-all duration-700">
                 {item.step}
              </div>
              <div className="space-y-6">
                 <h3 className="text-3xl font-display font-medium italic text-tf-dark transition-all tracking-tight group-hover:text-tf-primary uppercase">{item.title}</h3>
                 <p className="text-slate-500 font-serif font-medium leading-relaxed italic text-sm max-w-sm">{item.desc}</p>
              </div>
           </motion.div>
         ))}
      </section>

      {/* Trust Quote */}
      <section className="py-48 px-8 bg-tf-dark text-white relative overflow-hidden text-center">
         <div className="absolute inset-0 bg-tf-primary/5 blur-[150px] rounded-full -m-32 pointer-events-none opacity-40 animate-pulse" />
         <div className="relative z-10 max-w-4xl mx-auto space-y-12">
            <h2 className="text-5xl md:text-8xl font-display font-bold text-white italic tracking-tighter uppercase leading-[0.85]">
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

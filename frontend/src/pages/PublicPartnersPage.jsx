import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PublicPartnersPage() {
  const navigate = useNavigate();

  const PARTNERS_LIST = [
    { name: 'Global Health Node', logo: '🌐' },
    { name: 'HealthGrid Node', logo: '🏥' },
    { name: 'EcoWatch Protocol', logo: '🌱' },
    { name: 'PureFlow Systems', logo: '💧' },
    { name: 'MindTrust Collective', logo: '🎓' },
    { name: 'AidNetwork Node', logo: '🤝' },
    { name: 'Resilience Protocol', logo: '🛡️' },
    { name: 'MediCloud Operations', logo: '💊' },
    { name: 'GreenTrust Foundation', logo: '🌳' },
    { name: 'LifeSecure Framework', logo: '⚕️' },
    { name: 'EduForce Node', logo: '🎒' },
    { name: 'CivicAid Systems', logo: '🏛️' }
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-tf-primary selection:text-white pb-0 overflow-x-hidden">
      <PublicNavbar />
      
      {/* Hero Header */}
      <section className="pt-48 pb-32 px-8 lg:px-24 bg-tf-secondary bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-[1400px] mx-auto text-center space-y-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[12px] font-bold text-tf-primary uppercase tracking-[0.6em] mb-6">Verified Node Partners</p>
            <h1 className="text-6xl md:text-9xl font-bold font-display text-tf-dark tracking-tighter uppercase italic leading-[0.85]">
              The <br /> <span className="text-tf-primary tracking-normal">Institutional</span> <br /> Registry.
            </h1>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl text-slate-500 font-serif font-medium leading-relaxed max-w-2xl mx-auto italic">
            Governing authorized humanitarian nodes and partner organizations. Every platform partner is audited for absolute transparency.
          </motion.p>
        </div>
      </section>

      {/* Grid Partner badges Registry */}
      <section className="py-24 max-w-[1400px] mx-auto px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 text-center group">
         {PARTNERS_LIST.map((p, i) => (
            <motion.div 
               key={p.name}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               className="flex flex-col items-center gap-6 p-12 rounded-[3.5rem] bg-white border border-slate-100/60 hover:shadow-4xl transition-all duration-700 cursor-crosshair group/item shadow-sm"
            >
               <div className="text-4xl bg-tf-secondary p-8 rounded-[2rem] shadow-xl group-hover/item:rotate-12 transition-all duration-700">{p.logo}</div>
               <div className="space-y-4">
                  <p className="text-[10px] font-bold tracking-[0.2em] group-hover/item:text-tf-primary transition-colors uppercase font-display italic">{p.name}</p>
                  <div className="text-[9px] font-bold text-tf-primary uppercase tracking-[0.4em] italic border border-tf-primary/20 px-4 py-1.5 rounded-full inline-block">Registry Confirmed</div>
               </div>
            </motion.div>
         ))}
      </section>

      {/* Final Partners Call Point */}
      <section className="py-48 px-8 max-w-[1400px] mx-auto">
         <div className="bg-tf-dark rounded-[4.5rem] p-24 text-center space-y-12 relative overflow-hidden group">
            <div className="absolute inset-0 bg-tf-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-[2s] pointer-events-none" />
            <div className="max-w-3xl mx-auto space-y-12 relative z-10">
               <h2 className="text-4xl md:text-8xl font-display font-medium text-white italic tracking-tighter uppercase leading-[0.85]">
                 Enlist Your <span className="text-tf-primary">Organization.</span>
               </h2>
               <p className="text-white/40 text-[13px] leading-relaxed font-bold uppercase tracking-[0.4em] max-w-xl mx-auto">Scale your humanitarian operations with advanced fundraising infrastructure and global donor grid access.</p>
               <div className="pt-10">
                 <button onClick={() => navigate('/login?tab=signup')} className="px-20 py-8 bg-tf-primary hover:bg-white text-white hover:text-tf-dark text-[11px] font-bold uppercase tracking-[0.4em] rounded-[2.5rem] shadow-4xl shadow-tf-primary/30 transition-all hover:scale-105 active:scale-95">
                    Submit Registration
                 </button>
               </div>
            </div>
         </div>
      </section>

      <PublicFooter />
    </div>
  );
}

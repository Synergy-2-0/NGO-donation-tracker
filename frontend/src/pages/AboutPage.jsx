import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const TEAM = [
  { name: 'Dr. Sarah Mitchell', role: 'Global Programs Director', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
  { name: 'James Wilson', role: 'Chief of Operations', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' },
  { name: 'Elena Rodriguez', role: 'Strategic Impact Auditor', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400' },
  { name: 'David Chen', role: 'Community Partnership Lead', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-tf-primary selection:text-white pb-0 overflow-x-hidden">
      <PublicNavbar />

      <section className="pt-64 pb-32 px-8 lg:px-24 bg-slate-950 relative overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2400" className="w-full h-full object-cover brightness-[0.2] group-hover:scale-105 transition-transform duration-[10s]" alt="Heritage" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        </div>

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
          <div className="space-y-12">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-0.5 bg-tf-primary" />
                 <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.8em] italic leading-none">Institutional Protocol v1.0</p>
              </div>
              <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] italic uppercase">
                Global <br /> <span className="text-tf-primary italic underline underline-offset-8 decoration-white/10">Architecture.</span>
              </h1>
            </motion.div>
            <motion.p 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} 
               className="text-xl text-white/40 font-medium leading-relaxed max-w-xl italic border-t border-white/5 pt-12 mt-12 lowercase tracking-tight"
            >
              founded on the principles of absolute decentralized transparency and direct humanitarian impact, transfund represents a global shift toward audited benevolence.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
            className="hidden lg:block relative"
          >
             <div className="absolute inset-0 bg-tf-primary/20 blur-[150px] rounded-full -z-10" />
             <div className="p-2 border border-white/10 rounded-[4.5rem]">
                <div className="bg-slate-900/40 backdrop-blur-2xl p-12 rounded-[4rem] space-y-6">
                   <p className="text-[10px] font-black text-tf-primary uppercase tracking-[0.4em] italic mb-4">Core Operating Vision_</p>
                   <p className="text-2xl font-black text-white tracking-tighter italic lowercase leading-tight">
                      to synchronize the world's capital with its greatest challenges through verified institutional integrity.
                   </p>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Vision */}
      <section className="py-48 px-8 lg:px-24 border-b border-slate-50">
        <div className="max-w-5xl mx-auto space-y-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-6">
              <h3 className="text-3xl font-display font-medium uppercase tracking-tight text-tf-dark">The Vision</h3>
              <p className="text-slate-500 leading-relaxed font-serif font-medium italic">We envision a world where every contribution to a cause is tracked, verified, and celebrated. No more black boxes, no more administrative waste—just pure, audited impact via TransFund.</p>
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-display font-medium uppercase tracking-tight text-tf-dark">The Mission</h3>
              <p className="text-slate-500 leading-relaxed font-serif font-medium italic">To build the world's most trusted humanitarian operating system, empowering local partners with the capital they need to solve the world's most pressing challenges.</p>
            </div>
          </div>

          <div className="bg-tf-dark rounded-[3rem] p-16 md:p-32 text-center space-y-12 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-tf-primary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none group-hover:bg-tf-primary/20 transition-all duration-[2s]" />
             <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight relative z-10 italic">
               "Impact is not about what we say, <br /> but what we verify."
             </h2>
             <p className="text-tf-primary font-bold text-[10px] uppercase tracking-[0.5em] mt-8 leading-none">TransFund Founding Principle</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-48 px-8 lg:px-24 bg-slate-50/30">
        <div className="max-w-[1400px] mx-auto space-y-24">
           <div className="text-center space-y-6">
              <p className="text-[12px] font-bold text-tf-primary uppercase tracking-[0.8em]">The Collective</p>
              <h2 className="text-5xl md:text-7xl font-display font-medium text-tf-dark tracking-tight leading-[0.9]">Meet The <span className="text-tf-primary">Architects.</span></h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {TEAM.map((member, i) => (
                <motion.div 
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white rounded-[3rem] p-8 space-y-8 border border-slate-100 hover:shadow-2xl transition-all duration-700"
                >
                  <div className="aspect-square overflow-hidden rounded-[2.5rem]">
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-2xl font-display font-bold tracking-tight text-tf-dark">{member.name}</h4>
                    <p className="text-[10px] font-bold text-tf-primary uppercase tracking-[0.3em] font-sans">{member.role}</p>
                  </div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

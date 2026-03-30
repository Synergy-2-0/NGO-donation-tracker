import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PublicImpactPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-tf-primary selection:text-white pb-0 overflow-x-hidden">
      <PublicNavbar />
      
      {/* Hero Header */}
      <section className="pt-48 pb-32 px-8 lg:px-24 bg-tf-secondary bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-[1400px] mx-auto text-center space-y-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[12px] font-bold text-tf-primary uppercase tracking-[0.6em] mb-6">Telemetry & Impact Matrix</p>
            <h1 className="text-6xl md:text-9xl font-bold font-display text-tf-dark tracking-tighter uppercase italic leading-[0.85]">
              Global <br /> <span className="text-tf-primary tracking-normal">Humanitarian</span> <br /> Footprint.
            </h1>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl text-slate-500 font-serif font-medium leading-relaxed max-w-2xl mx-auto italic">
            Every contribution processed through TransFund is an audited micro-investment into global resilience. We track every milestone with precision.
          </motion.p>
        </div>
      </section>

      {/* Stats Grid Registry */}
      <section className="py-24 max-w-[1400px] mx-auto px-8 grid grid-cols-2 lg:grid-cols-4 gap-16 text-center items-center divide-x-0 lg:divide-x divide-slate-100">
         {[
           { label: 'Total Aid Flow', value: 'LKR 42.8M+', color: 'text-tf-dark' },
           { label: 'Verified Nodes', value: '480+', color: 'text-tf-primary' },
           { label: 'Active Missions', value: '1,200+', color: 'text-tf-accent' },
           { label: 'Audit Integrity', value: '100%', color: 'text-tf-dark' }
         ].map((stat, i) => (
            <motion.div 
               key={stat.label}
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.1 }}
               className="space-y-4 group cursor-crosshair pb-8 lg:pb-0"
            >
               <div className={`text-5xl md:text-7xl font-display font-bold italic tracking-tighter tabular-nums group-hover:scale-105 transition-transform duration-700 ${stat.color}`}>{stat.value}</div>
               <div className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em] italic">{stat.label}</div>
            </motion.div>
         ))}
      </section>

      {/* Impact Stories Nodes */}
      <section className="py-32 px-8 lg:px-24 bg-slate-50/20">
         <div className="max-w-[1400px] mx-auto space-y-24">
            <div className="text-center space-y-6">
               <p className="text-[12px] font-bold text-tf-primary uppercase tracking-[0.8em]">Success Nodes</p>
               <h2 className="text-5xl md:text-7xl font-display font-medium text-tf-dark tracking-tight leading-[0.9]">Verified Milestones.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
               {[
                 { title: 'The Water Grid', desc: 'Installed 45 deep-bore wells in Anuradhapura, providing permanent water security for 12,000 agricultural families.', metric: '12,000 Families' },
                 { title: 'Education Hubs', desc: 'Upgraded 8 rural schools in Jaffna with high-speed digital tools and modern libraries, impacting 3,500 children.', metric: '3,500 Children' },
                 { title: 'Sovereign Health', desc: 'Distributed emergency surgical kits and life-saving meds to 30 primary clinics in rural Matara.', metric: '30 Clinics' }
               ].map((item, idx) => (
                 <motion.div 
                   key={idx}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   className="bg-white rounded-[3.5rem] p-16 space-y-12 relative overflow-hidden group hover:shadow-4xl transition-all duration-700 border border-slate-100/60"
                 >
                    <div className="space-y-6 flex-1">
                       <h3 className="text-2xl font-display font-bold italic tracking-tighter text-tf-dark uppercase group-hover:text-tf-primary transition-colors">{item.title}</h3>
                       <p className="text-slate-500 font-serif font-medium leading-relaxed italic text-sm">{item.desc}</p>
                    </div>
                    <div className="pt-10 border-t border-slate-50 flex items-center justify-between">
                       <span className="text-tf-primary font-bold text-[9px] uppercase tracking-[0.3em]">Node Confirmed</span>
                       <span className="text-tf-dark font-display font-bold italic tracking-tighter text-xl tabular-nums leading-none">{item.metric}</span>
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

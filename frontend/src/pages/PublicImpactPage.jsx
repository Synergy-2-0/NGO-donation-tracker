import PublicNavbar from '../components/PublicNavbar';
import { useNavigate } from 'react-router-dom';

export default function PublicImpactPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-tf-primary selection:text-white">
      <PublicNavbar />
      
      {/* Hero Header */}
      <section className="relative pt-40 pb-20 bg-tf-purple overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200')] opacity-10 blur-sm scale-110" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
           <span className="text-tf-primary font-black text-[11px] uppercase tracking-[0.4em] italic">Telemetry Matrix</span>
           <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic underline-offset-8 decoration-tf-primary/40">Our Global Impact</h1>
           <p className="text-white/60 text-lg max-w-2xl mx-auto font-medium leading-relaxed uppercase tracking-[0.05em]">Every donation on TrustFund is a measurable micro-investment into the resilience of our society.</p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-24 bg-white max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center items-center">
         {[
           { label: 'Total Aid Flow', value: 'LKR 2.4B+', color: 'text-tf-purple' },
           { label: 'Families Secured', value: '450,000+', color: 'text-tf-primary' },
           { label: 'Active Projects', value: '1,200+', color: 'text-tf-green' },
           { label: 'Transparency Index', value: '99.9%', color: 'text-blue-500' }
         ].map(stat => (
            <div key={stat.label} className="space-y-4 group">
               <div className="text-5xl font-black tracking-tighter italic tabular-nums group-hover:scale-110 transition-transform duration-700">{stat.value}</div>
               <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </div>
         ))}
      </section>

      {/* Impact Stories */}
      <section className="py-32 bg-tf-grey">
         <div className="max-w-7xl mx-auto px-6 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
               {[
                 { title: 'The Water Grid', desc: 'Installed 45 deep-bore wells in Anuradhapura, providing permanent water security for 12,000 agricultural families.', metric: '12,000 Families' },
                 { title: 'Education Hubs', desc: 'Upgraded 8 rural schools in Jaffna with high-speed digital tools and modern libraries, impacting 3,500 children.', metric: '3,500 Children' },
                 { title: 'Sovereign Health', desc: 'Distributed emergency surgical kits and life-saving meds to 30 primary clinics in rural Matara.', metric: '30 Clinics' }
               ].map((item, idx) => (
                 <div key={idx} className="bg-white rounded-[3rem] p-16 space-y-12 relative overflow-hidden group hover:bg-tf-primary/5 transition-all duration-700 border border-white hover:border-tf-primary/20">
                    <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-100 transition-opacity">✨</div>
                    <div className="space-y-4">
                       <h3 className="text-2xl font-black text-tf-purple">{item.title}</h3>
                       <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                       <span className="text-tf-primary font-black text-[12px] uppercase tracking-widest">Target Met</span>
                       <span className="text-tf-purple font-black italic tracking-tighter">{item.metric}</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Partners section preview */}
      <section className="py-20 text-center space-y-10">
         <h3 className="text-xl font-black text-tf-purple uppercase tracking-widest">Partner with us to scale impact</h3>
         <button onClick={() => navigate('/login?tab=signup')} className="px-14 py-6 bg-tf-purple text-white rounded-full font-black uppercase text-[12px] tracking-[0.2em] shadow-xl shadow-tf-purple/20 hover:bg-tf-primary transition-all">Submit NGO Prospectus</button>
      </section>
    </div>
  );
}

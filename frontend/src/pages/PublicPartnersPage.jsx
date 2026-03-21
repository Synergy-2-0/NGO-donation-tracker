import PublicNavbar from '../components/PublicNavbar';
import { useNavigate } from 'react-router-dom';

export default function PublicPartnersPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-tf-pink selection:text-white">
      <PublicNavbar />
      
      {/* Hero Header */}
      <section className="relative pt-40 pb-20 bg-tf-purple overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200')] opacity-10 blur-sm scale-110" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
           <span className="text-tf-pink font-black text-[11px] uppercase tracking-[0.4em] italic">Humanitarian Matrix</span>
           <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">Verified Partners</h1>
           <p className="text-white/60 text-[13px] max-w-2xl mx-auto font-black leading-relaxed uppercase tracking-[0.25em]">Governing authorized humanitarian nodes and organizations across the nation.</p>
        </div>
      </section>

      {/* Grid of Partner Badges */}
      <section className="py-32 bg-white max-w-7xl mx-auto px-10">
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 text-center group">
            {[
              { name: 'Global Aid', logo: '🌐' },
              { name: 'HealthGrid', logo: '🏥' },
              { name: 'EcoWatch', logo: '🌱' },
              { name: 'PureFlow', logo: '💧' },
              { name: 'MindTrust', logo: '🎓' },
              { name: 'AidNetwork', logo: '🤝' },
              { name: 'Resilience Hub', logo: '🛡️' },
              { name: 'MediCloud', logo: '💊' },
              { name: 'GreenTrust', logo: '🌳' },
              { name: 'LifeSecure', logo: '⚕️' },
              { name: 'EduForce', logo: '🎒' },
              { name: 'CivicAid', logo: '🏛️' }
            ].map(p => (
              <div key={p.name} className="flex flex-col items-center gap-6 p-8 rounded-[2.5rem] bg-tf-grey hover:bg-tf-pink/10 group-hover:grayscale grayscale-0 hover:grayscale-0 transition-all cursor-pointer">
                 <div className="text-5xl bg-white p-6 rounded-3xl shadow-sm rotate-6 group-hover:rotate-0 transition-transform">{p.logo}</div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-tf-purple transition-colors">{p.name}</p>
                 <div className="text-[9px] font-extrabold text-tf-pink uppercase tracking-widest border border-tf-pink/20 px-2 py-0.5 rounded-full inline-block">Verified</div>
              </div>
            ))}
         </div>
      </section>

      {/* Partners section preview */}
      <section className="py-24 bg-tf-purple relative overflow-hidden text-center text-white">
         <div className="absolute inset-0 bg-tf-pink/10 blur-[130px] -translate-x-1/2" />
         <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <h3 className="text-4xl font-black tracking-tight leading-snug">Become an Authorized <br/> Partner on TrustFund</h3>
            <p className="text-white/50 text-[14px] leading-relaxed font-bold uppercase tracking-widest">Scale your humanitarian operations with our advanced fundraising infrastructure and global donor grid.</p>
            <button onClick={() => navigate('/login?tab=signup')} className="px-14 py-6 bg-tf-pink hover:bg-white hover:text-tf-purple text-white rounded-full font-black uppercase text-[12px] tracking-[0.2em] shadow-xl shadow-tf-pink/30 transition-all hover:scale-105">Enlist My Organization</button>
         </div>
      </section>
    </div>
  );
}

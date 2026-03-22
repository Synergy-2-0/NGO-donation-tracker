import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

export default function HomePage() {
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
    }
  ];

  const partners = [
    { name: 'Global Aid', logo: '🌐' },
    { name: 'MediCloud', logo: '🏥' },
    { name: 'EcoWatch', logo: '🌱' },
    { name: 'FutureLearn', logo: '🎓' },
    { name: 'Heal Lanka', logo: '⚕️' },
    { name: 'Nature First', logo: '🌳' }
  ];

  const testimonials = [
    {
      name: 'Sunil Perera',
      role: 'Donor',
      text: 'TrustFund made it so easy for me to see exactly where my money was going. The transparency is unlike any other platform.',
      avatar: 'SP'
    },
    {
      name: 'Dr. Amara Siri',
      role: 'NGO Partner',
      text: 'As an organization, the verification process gave us the credibility we needed to reach more people.',
      avatar: 'AS'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-tf-primary selection:text-white scroll-smooth" id="top">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0">
          <img 
            src="/karuna-hero.png" 
            alt="TrustFund Hero" 
            className="w-full h-full object-cover transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-tf-purple/95 via-tf-purple/60 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col gap-20">
          <div className="max-w-4xl space-y-10 animate-fade-in">
            <div className="space-y-6">
              <span className="inline-block px-5 py-2 bg-tf-primary/20 text-tf-primary text-[11px] font-extrabold uppercase tracking-[0.3em] rounded-full border border-tf-primary/20 backdrop-blur-md">
                TrustFund Humanitarian Network
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight">
                Empowering <br />
                <span className="text-tf-primary italic underline decoration-white/10 underline-offset-8">Collective </span> 
                Kindness.
              </h1>
              <p className="text-white/80 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
                TrustFund is Sri Lanka's leading humanitarian marketplace, connecting verified donors with the country's most urgent verified causes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <button
                onClick={() => navigate('/login?tab=signup')}
                className="px-10 py-5 bg-tf-primary text-white rounded-full text-[14px] font-black uppercase tracking-widest hover:bg-white hover:text-tf-purple transition-all shadow-2xl shadow-tf-primary/30 active:scale-95"
              >
                Donate to a Cause
              </button>
              <button
                className="px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white rounded-full text-[14px] font-black uppercase tracking-widest hover:bg-white hover:text-tf-purple transition-all active:scale-95"
              >
                Start Fundraising
              </button>
            </div>
          </div>

          {/* Search Hub Inline Flow */}
          <div className="w-full max-w-5xl">
             <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl p-4 flex flex-col md:flex-row items-center gap-4 border border-white/40">
                <div className="flex-1 flex items-center gap-5 px-8 py-4 bg-white/50 rounded-[2rem] w-full border border-slate-100/50">
                   <svg className="w-6 h-6 text-tf-purple shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                   <input type="text" placeholder="Search verified causes, names or sectors..." className="bg-transparent w-full text-sm font-bold text-tf-purple focus:outline-none placeholder-tf-purple/30" />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <select className="bg-white px-8 py-4 rounded-[2rem] text-[11px] font-extrabold uppercase tracking-widest text-tf-purple focus:outline-none cursor-pointer border border-slate-100">
                     <option>All Sectors</option>
                     <option>Healthcare</option>
                     <option>Education</option>
                     <option>Emergency Relief</option>
                  </select>
                  <button className="bg-tf-purple text-white px-10 py-4 rounded-[2rem] text-[12px] font-black uppercase tracking-widest hover:bg-tf-primary transition-all shadow-lg shadow-tf-purple/20 active:scale-95">
                     Search
                  </button>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Emergency Alert Banner */}
      <div className="bg-tf-primary overflow-hidden py-3">
         <div className="flex whitespace-nowrap animate-marquee items-center gap-12 text-white text-[11px] font-black uppercase tracking-[0.3em] italic">
            <span>🔴 Urgent: Floods in Western Province Need Support</span>
            <span>🔴 Urgent: Emergency Medical Fund for Apeksha Hospital</span>
            <span>🔴 Urgent: Community Kitchens Open for Donations</span>
            <span>🔴 Urgent: Floods in Western Province Need Support</span>
            <span>🔴 Urgent: Emergency Medical Fund for Apeksha Hospital</span>
            <span>🔴 Urgent: Community Kitchens Open for Donations</span>
         </div>
      </div>

      {/* Stats Section */}
      <section id="impact" className="py-24 bg-tf-grey">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { label: 'Funds Raised', value: 'LKR 84.2M+', color: 'text-tf-primary' },
                { label: 'Families Supported', value: '12,500+', color: 'text-tf-purple' },
                { label: 'Verified Partners', value: '180+', color: 'text-tf-green' },
                { label: 'Active Volunteers', value: '2,400+', color: 'text-blue-500' }
              ].map(stat => (
                <div key={stat.label} className="space-y-3 group">
                   <p className={`text-4xl md:text-5xl font-black tracking-tighter ${stat.color} group-hover:scale-110 transition-transform duration-500`}>{stat.value}</p>
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] font-sans">{stat.label}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Featured Causes Grid */}
      <section id="featured" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
           <div className="flex flex-col md:flex-row justify-between items-end gap-8">
              <div className="space-y-4">
                 <span className="text-tf-primary font-extrabold text-[12px] uppercase tracking-[0.4em] italic leading-none block">Humanitarian Marketplace</span>
                 <h2 className="text-5xl font-black text-tf-purple tracking-tight">Verified Campaigns</h2>
                 <div className="w-20 h-1.5 bg-tf-primary rounded-full" />
              </div>
              <button className="text-[14px] font-black text-tf-purple hover:text-tf-primary transition-all uppercase tracking-widest flex items-center gap-3 active:translate-x-2">
                 Explore All Causes <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
           </div>

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
                          <h3 className="text-xl font-black text-slate-800 leading-snug group-hover:text-tf-primary transition-colors">{cause.title}</h3>
                          <div className="flex items-center gap-3 text-[12px] font-bold text-slate-400 italic">
                             <svg className="w-4 h-4 text-tf-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
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
                                <p className="text-3xl font-black text-tf-primary italic tracking-tighter leading-none">{pct}%</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Allocated</p>
                             </div>
                          </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-50">
                             <div 
                                className="h-full bg-tf-primary rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,138,0,0.4)] relative" 
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

                       <button className="w-full py-5 bg-tf-purple text-white hover:bg-tf-primary rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all shadow-xl shadow-tf-purple/10 active:scale-95">
                          Support Mission
                       </button>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-32 bg-tf-grey">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-20">
           <div className="max-w-3xl mx-auto space-y-4 text-center">
              <span className="text-tf-primary font-extrabold text-[12px] uppercase tracking-[0.4em] italic mb-4 block">Our Process</span>
              <h2 className="text-5xl font-black text-tf-purple tracking-tight">How TrustFund Works</h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">A transparent, three-step protocol designed to maximize the impact of every donation and ensure clinical distribution of aid.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {[
                { 
                  step: '01', 
                  title: 'Choose a Cause', 
                  desc: 'Browse our marketplace of verified humanitarian projects across Sri Lanka.', 
                  icon: (
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  ) 
                },
                { 
                  step: '02', 
                  title: 'Donate Securely', 
                  desc: 'Fast, encrypted allocations directly to your chosen campaign.', 
                  icon: (
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  ) 
                },
                { 
                  step: '03', 
                  title: 'Track Impact', 
                  desc: 'Receive real-time telemetry and data on how your funds changed lives.', 
                  icon: (
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ) 
                }
              ].map((item) => (
                <div key={item.step} className="bg-white rounded-[4rem] p-16 space-y-10 relative z-10 border border-white hover:border-tf-primary/30 hover:shadow-2xl transition-all duration-700 group flex flex-col items-center">
                   <div className="w-24 h-24 bg-tf-grey rounded-[2.5rem] flex items-center justify-center text-4xl group-hover:bg-tf-primary group-hover:-rotate-12 transition-all group-hover:text-white duration-500">
                      {item.icon}
                   </div>
                   <div className="space-y-6">
                      <p className="text-tf-primary font-black text-sm tracking-[0.5em] font-mono">{item.step}</p>
                      <h3 className="text-3xl font-black text-tf-purple">{item.title}</h3>
                      <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-10">
              <div className="space-y-6">
                 <span className="text-tf-primary font-black text-[12px] uppercase tracking-[0.4em]">Voices of Impact</span>
                 <h2 className="text-6xl font-black text-tf-purple leading-tight italic">Verified Trust <br/> from our Network</h2>
                 <p className="text-slate-500 text-lg font-medium leading-relaxed">Hear from the people who are making a difference and the organizations that are saving lives through TrustFund.</p>
              </div>
              <div className="space-y-8">
                 {testimonials.map((t, idx) => (
                    <div key={idx} className="bg-tf-grey rounded-[2.5rem] p-10 flex gap-8 items-start hover:bg-tf-primary/5 transition-all">
                       <div className="w-16 h-16 bg-tf-purple rounded-full flex items-center justify-center text-white shrink-0 font-black italic">{t.avatar}</div>
                       <div className="space-y-2">
                          <p className="text-slate-700 font-bold leading-relaxed">"{t.text}"</p>
                          <p className="text-tf-primary text-[11px] font-black uppercase tracking-widest">{t.name} • {t.role}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
           <div className="relative">
              <div className="aspect-square bg-tf-purple rounded-[5rem] overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-1000 shadow-2xl">
                 <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800" alt="Impact" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
              </div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-tf-primary rounded-[3rem] p-10 text-white flex flex-col justify-end -rotate-6">
                 <p className="text-4xl font-black italic tracking-tighter">98%</p>
                 <p className="text-[10px] font-black uppercase tracking-widest mt-2">Efficiency Rating</p>
              </div>
           </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-32 bg-tf-grey">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
           <div className="text-center space-y-4">
              <p className="text-slate-400 font-extrabold text-[12px] uppercase tracking-[0.6em] italic leading-none">Institutional Allies</p>
              <h3 className="text-4xl font-black text-tf-purple tracking-tight">Humanitarian Partners</h3>
              <div className="w-24 h-1 bg-tf-primary mx-auto rounded-full mt-6" />
           </div>
           <div className="grid grid-cols-2 md:grid-cols-6 gap-12 items-center justify-center opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
              {partners.map(p => (
                <div key={p.name} className="flex flex-col items-center gap-4 group cursor-pointer">
                   <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl group-hover:bg-tf-primary/10 group-hover:scale-110 transition-all shadow-sm">
                      {p.logo}
                   </div>
                   <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-tf-purple">{p.name}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-32 bg-white">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-20 items-center">
            <div className="flex-1 space-y-10 order-2 md:order-1">
               <span className="text-tf-primary font-black text-[12px] uppercase tracking-[0.4em]">Future of Aid</span>
               <h2 className="text-6xl font-black text-tf-purple leading-[1.1] tracking-tight">The Decentralized <br /> Hub for Resilience</h2>
               <p className="text-slate-500 text-lg leading-relaxed font-medium">Join a growing community of 45,000+ Sri Lankans who are building a more resilient nation through shared resources and collective action.</p>
               <div className="flex gap-8">
                  <div className="space-y-2">
                     <p className="text-3xl font-black text-tf-purple italic tabular-nums">1.2M+</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Meals Served</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-3xl font-black text-tf-purple italic tabular-nums">480+</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Schools Aided</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-3xl font-black text-tf-purple italic tabular-nums">22K+</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lives Transformed</p>
                  </div>
               </div>
               <button className="px-12 py-5 bg-tf-purple text-white rounded-full text-[13px] font-black uppercase tracking-widest hover:bg-tf-primary transition-all">
                  Join the Grid
               </button>
            </div>
            <div className="flex-1 order-1 md:order-2">
               <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800" alt="Resilience" className="rounded-[4rem] shadow-2xl" />
            </div>
         </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="bg-tf-purple rounded-[5rem] p-16 md:p-32 text-center text-white relative overflow-hidden group shadow-2xl">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200')] opacity-5 group-hover:scale-105 transition-transform duration-1000" />
               <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-tf-primary/10 blur-[150px]" />
               <div className="relative z-10 space-y-12">
                  <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1] italic">
                    Ready to Start <br />
                    the <span className="text-tf-primary">Change?</span>
                  </h2>
                  <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
                    <button onClick={() => navigate('/login?tab=signup')} className="px-14 py-7 bg-tf-primary hover:bg-white hover:text-tf-purple text-white text-[14px] font-black uppercase tracking-widest rounded-full transition-all shadow-2xl shadow-tf-primary/30 active:scale-95 group/btn">
                       Become a Donor
                       <span className="block text-[8px] font-bold mt-1 opacity-60">Join 45K Others</span>
                    </button>
                    <button className="px-14 py-7 bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white hover:text-tf-purple text-white text-[14px] font-black uppercase tracking-widest rounded-full transition-all active:scale-95">
                       Register Organization
                       <span className="block text-[8px] font-bold mt-1 opacity-60">Join 180+ Partners</span>
                    </button>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#05010b] text-white pt-40 pb-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24">
              <div className="space-y-12 text-center md:text-left">
                 <div className="flex items-center gap-5 justify-center md:justify-start">
                    <img src="/heart-logo c.png" alt="TrustFund Logo" className="w-20 h-20 object-contain drop-shadow-2xl" />
                 </div>
                 <p className="text-white/40 text-[14px] leading-relaxed font-bold max-w-sm mx-auto md:mx-0">
                    Empowering Sri Lanka's philanthropic community through transparency, commitment, and verified impact. Built to foster trust and lasting change.
                 </p>
                 <div className="flex gap-6 justify-center md:justify-start">
                    {['FB', 'TW', 'IG', 'LI'].map(soc => (
                      <div key={soc} className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-tf-primary hover:border-tf-primary transition-all cursor-pointer group hover:-translate-y-2">
                        <span className="text-[9px] font-black group-hover:scale-125 transition-transform font-mono opacity-60 group-hover:opacity-100">{soc}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-10">
                 <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-white italic text-center md:text-left">Resources</h4>
                 <ul className="space-y-6 text-white/40 text-[12px] font-black uppercase tracking-widest text-center md:text-left">
                    <li><button onClick={() => { document.querySelector('#featured').scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-tf-primary transition-colors hover:translate-x-2 transform block w-full md:w-auto">Active Causes</button></li>
                    <li><button onClick={() => navigate('/login?tab=signup')} className="hover:text-tf-primary transition-colors hover:translate-x-2 transform block w-full md:w-auto">Member Join</button></li>
                    <li><button onClick={() => { document.querySelector('#partners').scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-tf-primary transition-colors hover:translate-x-2 transform block w-full md:w-auto">Partner Network</button></li>
                    <li><button onClick={() => { document.querySelector('#how-it-works').scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-tf-primary transition-colors hover:translate-x-2 transform block w-full md:w-auto">Operations</button></li>
                 </ul>
              </div>

              <div className="space-y-10">
                 <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-white italic text-center md:text-left">Transparency</h4>
                 <ul className="space-y-6 text-white/40 text-[12px] font-black uppercase tracking-widest text-center md:text-left">
                    <li><button className="hover:text-tf-primary transition-colors hover:translate-x-2 transform block w-full md:w-auto">Our Process</button></li>
                    <li><button className="hover:text-tf-primary transition-colors hover:translate-x-2 transform block w-full md:w-auto">Help Center</button></li>
                    <li><button className="hover:text-tf-primary transition-colors hover:translate-x-2 transform block w-full md:w-auto">Compliance</button></li>
                    <li><button className="hover:text-tf-primary transition-colors hover:translate-x-2 transform block w-full md:w-auto">Privacy Policy</button></li>
                 </ul>
              </div>

              <div className="space-y-10">
                 <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-white italic text-center md:text-left">Impact Updates</h4>
                 <p className="text-white/40 text-[13px] font-bold text-center md:text-left leading-relaxed">Join our community of donors receiving real-time insights and emergency briefs.</p>
                 <div className="flex flex-col gap-4">
                    <input type="text" placeholder="Email Address" className="bg-white/5 border border-white/5 shadow-inner rounded-3xl px-8 py-6 text-sm font-bold flex-1 focus:outline-none focus:border-tf-primary transition-all text-white placeholder-white/10" />
                    <button className="bg-tf-primary py-6 rounded-3xl hover:bg-white hover:text-tf-purple text-white text-[12px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-tf-primary/10 active:scale-95">
                       Join Community
                    </button>
                 </div>
              </div>
           </div>

           <div className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
              <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.5em] leading-loose">
                 &copy; 2026 TRUSTFUND PHILANTHROPIC SERVICES. <br className="md:hidden" /> VERIFIED HUMANITARIAN INFRASTRUCTURE.
              </p>
              <div className="flex items-center gap-10">
                 <img src="/heart-logo c.png" alt="TrustFund Logo" className="w-10 h-10 object-contain grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
                 <p className="text-[10px] font-black text-white/5 uppercase tracking-[0.4em]">Official Network Registry</p>
              </div>
           </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in { 
          from { opacity: 0; transform: translateY(40px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-fade-in { animation: fade-in 1.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

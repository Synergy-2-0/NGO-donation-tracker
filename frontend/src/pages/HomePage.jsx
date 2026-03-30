import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const HERO_IMG = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=2400";
const TRUST_BANNER_IMG = "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=2000";

const CAMPAIGNS = [
  { id: 1, title: 'Medical Support for Communities', category: 'Health', location: 'Northern Province', raised: 4500000, target: 12000000, img: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1200", urgent: true },
  { id: 2, title: 'Clean Water Infrastructure', category: 'Infrastructure', location: 'Eastern Province', raised: 9800000, target: 10000000, img: "https://images.unsplash.com/photo-1503676260728-1c00da07bb5e?auto=format&fit=crop&q=80&w=1200", urgent: false },
  { id: 3, title: 'Primary Education Advancement', category: 'Education', location: 'Southern Province', raised: 1200000, target: 5000000, img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1200", urgent: false },
];

const PARTNERS = [
  { name: 'Global Health Alliance', logo: 'GHA' },
  { name: 'Eco-System Council', logo: 'ESC' },
  { name: 'Humanity First Network', logo: 'HFN' },
  { name: 'Community Care Group', logo: 'CCG' },
  { name: 'Relief Hub International', logo: 'RHI' },
];

const TESTIMONIALS = [
  { text: "TransFund is bridging the gap between donors and the ground reality with remarkable efficiency and absolute trust.", author: "Ayesha Perera", role: "Local Partner" },
  { text: "The audit trail feature gives me the confidence to contribute to causes that truly change lives.", author: "Michael Zhang", role: "Humanitarian Donor" },
  { text: "A benchmark for transparency in the humanitarian sector. TransFund is the future of direct action.", author: "David Wilson", role: "NGO Director" },
];

function ProgressCircle({ raised, target }) {
  const percent = Math.min(Math.round((raised / target) * 100), 100);
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
       <svg className="w-full h-full -rotate-90">
          <circle cx="32" cy="32" r={radius} fill="transparent" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
          <circle cx="32" cy="32" r={radius} fill="transparent" stroke="#FFF" strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
       </svg>
       <span className="absolute text-[10px] font-bold text-white tracking-wide">{percent}%</span>
    </div>
  );
}

function CampaignCard({ item }) {
  return (
    <div className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100/60 shadow-sm hover:shadow-4xl transition-all duration-700 flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={item.title} />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
        
        {item.urgent && (
          <div className="absolute top-8 left-8 px-5 py-2 bg-tf-primary rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-xl">
            Critical Support
          </div>
        )}

        <div className="absolute inset-x-8 bottom-8 flex items-center justify-between">
           <div className="space-y-1">
              <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest leading-none">{item.location}</p>
              <h4 className="text-2xl font-display font-medium text-white tracking-tight">{item.title}</h4>
           </div>
           <ProgressCircle raised={item.raised} target={item.target} />
        </div>
      </div>
      <div className="p-12 flex-1 flex flex-col justify-between space-y-10 bg-slate-50/20">
        <div className="space-y-6">
           <p className="text-[14px] font-medium text-slate-500 leading-relaxed font-serif italic">
             This verified humanitarian mission targets local infrastructure improvements to ensure long-term stability in {item.location}.
           </p>
           <div className="flex justify-between items-baseline pt-6 border-t border-slate-100">
              <div className="space-y-1">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Global Aid Flow</p>
                 <p className="text-2xl font-display font-bold text-tf-dark">LKR {item.raised.toLocaleString()}</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Goal Registry</p>
                 <p className="text-sm font-bold text-tf-primary/70">{item.target.toLocaleString()}</p>
              </div>
           </div>
        </div>
        <Link to="/login" className="w-full py-6 bg-white border-2 border-slate-200 group-hover:border-tf-primary group-hover:bg-tf-primary group-hover:text-white transition-all text-tf-dark text-[11px] font-bold uppercase tracking-widest rounded-2xl text-center shadow-sm">
          Join This Cause
        </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 1.05]);
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0.8]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-tf-primary selection:text-white pb-0 overflow-x-hidden">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center px-6 overflow-hidden">
        <motion.div style={{ scale, opacity }} className="absolute inset-0 z-0">
          <img src={HERO_IMG} className="w-full h-full object-cover brightness-[0.4] grayscale-[10%]" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
        </motion.div>

        <div className="relative z-10 max-w-[1400px] w-full mx-auto container px-8 md:px-20 text-center space-y-20 mt-20">
          <div className="space-y-12">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-block px-8 py-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full">
              <p className="text-[11px] font-bold text-white/90 uppercase tracking-[0.6em] leading-none">The TransFund Humanitarian Ecosystem</p>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              className="font-display text-[4rem] md:text-[6rem] lg:text-[7rem] font-bold text-white tracking-tight leading-[1] max-w-5xl mx-auto"
            >
              Building a Transparent Future for <span className="text-tf-primary italic underline decoration-white/10 underline-offset-[15px]">Humanity.</span>
            </motion.h1>
            <motion.p 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
               className="text-white/70 text-xl font-serif md:text-2xl font-medium max-w-2xl mx-auto italic leading-relaxed"
            >
              Bridging the gap between global donors and direct local impact. 
              The industry benchmark for humanitarian asset verification.
            </motion.p>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex flex-wrap justify-center gap-10">
             <Link to="/causes" className="px-14 py-8 bg-tf-primary hover:bg-tf-dark text-white font-bold text-[12px] uppercase tracking-widest rounded-[2rem] shadow-3xl shadow-tf-primary/30 transition-all active:scale-95 group">
                Support A Project Now <span className="group-hover:translate-x-2 transition-transform inline-block ml-4">→</span>
             </Link>
             <Link to="/about" className="px-14 py-8 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white text-white hover:text-tf-dark font-bold text-[12px] uppercase tracking-widest rounded-[2rem] transition-all active:scale-95">
                Learn Our Protocol
             </Link>
          </motion.div>
        </div>
      </section>

      {/* Partners Marquee */}
      <section className="bg-slate-50 py-16 border-b border-slate-100">
         <div className="max-w-[1400px] mx-auto px-8 flex flex-wrap justify-between items-center gap-12 opacity-50 grayscale group hover:grayscale-0 transition-all duration-1000">
            {PARTNERS.map(p => (
              <div key={p.name} className="flex items-center gap-4 cursor-crosshair">
                <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center font-bold text-xs text-slate-500 tracking-tight">{p.logo}</div>
                <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-500">{p.name}</span>
              </div>
            ))}
         </div>
      </section>

      {/* Stats Section with grounded design */}
      <section className="relative px-8 lg:px-24 -mt-20">
         <div className="bg-tf-dark rounded-[4rem] p-16 md:p-24 shadow-5xl relative overflow-hidden group">
            <img src={TRUST_BANNER_IMG} className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale group-hover:scale-110 transition-transform duration-[30s]" alt="Audits" />
            <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-16 md:gap-24 items-center">
                {[
                  { val: 'LKR 42.8M', label: 'Verified Capital Flow', color: 'text-white' },
                  { val: '480+', label: 'Local Support Nodes', color: 'text-tf-primary' },
                  { val: '12k+', label: 'Registered Donors', color: 'text-white' },
                  { val: '100%', label: 'Audit Compliance', color: 'text-tf-primary' },
                ].map((stat, i) => (
                  <div key={i} className={`space-y-4 ${i === 0 ? 'border-l-2 border-tf-primary pl-10' : 'border-l-2 border-white/5 pl-10'}`}>
                    <h4 className={`text-4xl md:text-5xl font-display font-bold ${stat.color} tracking-tight`}>{stat.val}</h4>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] leading-tight">{stat.label}</p>
                  </div>
                ))}
            </div>
         </div>
      </section>

      {/* Feature Section -- Why Us */}
      <section className="py-48 px-8 lg:px-24">
         <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-16">
               <div className="space-y-6">
                  <p className="text-tf-primary font-bold uppercase tracking-[0.8em] text-[10px]">The Institutional Advantage</p>
                  <h2 className="text-5xl md:text-7xl font-display font-medium text-tf-dark tracking-tight leading-[1.05]">
                    Proven Transparency. <br /> Maximum Local Impact.
                  </h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {[
                    { t: 'Verified Vetting', d: 'Every humanitarian mission undergoes rigorous financial and identity verification before listing.' },
                    { t: 'Direct Asset Flow', d: 'Removing middle-tier administrative layers to ensure capital reaches ground zero with speed.' },
                    { t: 'Real-Time Logging', d: 'Follow your donation journey through our immutable public registry of verified node milestones.' },
                    { t: 'Compliance First', d: 'Adhering to international humanitarian standards and secure data privacy protocols.' }
                  ].map(f => (
                    <div key={f.t} className="space-y-4">
                       <h5 className="text-xl font-display font-bold text-tf-dark tracking-tight">{f.t}</h5>
                       <p className="text-[14px] text-slate-500 font-medium leading-relaxed font-serif italic">{f.d}</p>
                    </div>
                  ))}
               </div>
            </div>
            <div className="relative group">
               <div className="absolute inset-0 bg-tf-primary/5 blur-[120px] rounded-full -m-32 pointer-events-none opacity-40" />
               <img src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=1200" className="rounded-[4rem] shadow-4xl relative z-10 hover:shadow-tf-primary/10 transition-shadow duration-[1s]" alt="Support" />
            </div>
         </div>
      </section>

      {/* Campaign Registry Section */}
      <section id="campaigns" className="py-48 px-8 lg:px-24 bg-slate-50/50 space-y-32">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 max-w-[1400px] mx-auto">
            <div className="space-y-6">
               <p className="text-tf-primary font-bold uppercase tracking-[0.8em] text-[10px]">Active Project Registry</p>
               <h2 className="text-5xl md:text-7xl font-display font-medium text-tf-dark tracking-tight leading-[1.05]">
                 Support Global <br /> <span className="text-tf-primary">Initiatives.</span>
               </h2>
            </div>
            <Link to="/causes" className="px-10 py-5 bg-white border border-slate-200 text-tf-dark hover:bg-tf-primary hover:text-white font-bold text-[11px] uppercase tracking-widest rounded-2xl transition-all shadow-sm">
              Explore The Registry →
            </Link>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 max-w-[1400px] mx-auto">
            {CAMPAIGNS.map(item => <CampaignCard key={item.id} item={item} />)}
         </div>
      </section>

      {/* Testimonials */}
      <section className="py-48 px-8 lg:px-24 border-b border-slate-100">
         <div className="max-w-[1400px] mx-auto space-y-24">
            <div className="text-center space-y-6">
               <p className="text-tf-primary font-bold uppercase tracking-[0.8em] text-[10px]">Voices From Our Network</p>
               <h2 className="text-4xl md:text-7xl font-display font-medium text-tf-dark tracking-tight leading-[1.05]">Institutional Trust.</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               {TESTIMONIALS.map((t, i) => (
                 <div key={i} className="bg-white border border-slate-100/60 p-12 rounded-[3.5rem] space-y-10 hover:shadow-2xl transition-all duration-500">
                    <p className="text-xl font-serif font-medium text-slate-700 leading-relaxed italic">"{t.text}"</p>
                    <div className="flex items-center gap-6 pt-6 border-t border-slate-50">
                       <div className="w-14 h-14 bg-tf-primary text-white rounded-2xl flex items-center justify-center font-bold text-xl">{t.author[0]}</div>
                       <div>
                          <h6 className="font-display font-bold uppercase tracking-tight text-tf-dark leading-none">{t.author}</h6>
                          <p className="text-[10px] font-bold text-tf-primary uppercase tracking-widest mt-2">{t.role}</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="py-60 px-8 text-center bg-white relative">
         <div className="relative z-10 space-y-20 max-w-5xl mx-auto">
            <h3 className="text-[4rem] md:text-[7rem] font-display font-medium text-tf-dark tracking-tighter uppercase leading-[0.9] italic">
               Be The Change <br /> In <span className="text-tf-primary">Real-Time.</span>
            </h3>
            <p className="text-xl md:text-3xl text-slate-400 font-serif font-medium max-w-2xl mx-auto italic leading-relaxed">Join TransFund and operate with absolute integrity, transparency, and direct humanitarian action.</p>
            <div className="flex flex-wrap justify-center gap-10 pt-10">
               <Link to="/login?tab=signup" className="px-20 py-8 bg-tf-primary hover:bg-tf-dark text-white text-[13px] font-bold uppercase tracking-[0.5em] rounded-[2.5rem] shadow-4xl transition-all hover:scale-105 active:scale-95 shadow-tf-primary/30">
                  Global Registration
               </Link>
               <Link to="/about" className="px-20 py-8 bg-white border-2 border-slate-100 text-tf-dark text-[13px] font-bold uppercase tracking-[0.5em] rounded-[2.5rem] hover:bg-slate-50 transition-all">
                  Our Methodology
               </Link>
            </div>
         </div>
      </section>

      <PublicFooter />
    </div>
  );
}

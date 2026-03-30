import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const HERO_IMG = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=2400";

function CampaignCard({ item }) {
  const percent = Math.min(Math.round(((item.raisedAmount || 0) / item.goalAmount) * 100), 100);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100/80 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={item.image ? `${import.meta.env.VITE_API_URL || ''}${item.image}` : "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200"} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" 
          alt={item.title} 
        />
        <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-500" />
        
        <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[9px] font-bold uppercase tracking-widest text-slate-900 shadow-sm">
          {item.location?.city || 'Global Mission'}
        </div>
        
        {item.category && (
          <div className="absolute top-6 right-6 px-4 py-1.5 bg-tf-primary text-white rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-lg">
             {item.category}
          </div>
        )}
      </div>
      
      <div className="p-10 flex-1 flex flex-col justify-between space-y-8">
        <div className="space-y-4">
           <h4 className="text-xl font-bold text-slate-900 tracking-tight leading-tight group-hover:text-tf-primary transition-colors">{item.title}</h4>
           <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-widest">
              <span>NGO: {item.ngoId?.organizationName || 'Verified Partner'}</span>
           </div>
           <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
             {item.description || "Join this mission to create a sustainable impact in the local community through verified aid flows."}
           </p>
        </div>

        <div className="space-y-6">
           <div className="space-y-3">
              <div className="flex justify-between items-end">
                 <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Capital Flow</p>
                    <p className="text-lg font-bold text-slate-900 tabular-nums tracking-tighter">LKR {(item.raisedAmount || 0).toLocaleString()}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-2xl font-bold text-tf-primary/80 tabular-nums tracking-tighter leading-none">{percent}%</p>
                 </div>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percent}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-tf-primary rounded-full relative shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                 />
              </div>
              <div className="flex justify-between items-center text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                 <span>Goal: LKR {item.goalAmount.toLocaleString()}</span>
                 <span>{item.donationsCount || 0} Backers</span>
              </div>
           </div>

           <Link to={`/causes/${item._id}`} className="w-full py-4 bg-slate-50 border border-slate-100 hover:border-tf-primary hover:bg-tf-primary hover:text-white transition-all text-slate-900 text-[10px] font-bold uppercase tracking-widest rounded-xl text-center flex items-center justify-center gap-3 group/btn">
             Invest In Impact <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
           </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.4]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data } = await api.get('/api/campaigns');
        const active = data.filter(c => c.status === 'active');
        setCampaigns(active.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const getWelcomeText = () => {
    if (!user) return <>Global Giving. <br /> <span className="text-tf-primary italic">Absolute</span> Trust.</>;
    return <>Welcome back, <br /> <span className="text-tf-primary italic">{user.name.split(' ')[0]}.</span></>;
  };

  const getSubText = () => {
    if (!user) return "Bridging the gap between global support and direct local action. The industry benchmark for donation transparency.";
    if (user.role === 'admin') return "System Administrator session active. Universal oversight, partner verification, and global audit tools are authorized.";
    if (user.role === 'ngo-admin') return "NGO Administrator session active. Mission control, campaign management, and strategic impact tools are authorized.";
    return "New projects added. Explore verified initiatives and support life-changing operations directly.";
  };

  const getRoleBadge = () => {
    if (!user) return "Direct Impact Donation Platform";
    if (user.role === 'admin') return "SYSTEM ADMINISTRATOR PORTAL";
    if (user.role === 'ngo-admin') return "NGO ADMINISTRATOR PORTAL";
    return `${user.role.toUpperCase()} PORTAL ACTIVE`;
  };

  const adaptiveAdminGates = () => {
    if (user?.role === 'admin') {
      return [
        { t: 'Partner Registry', d: 'Review and authorize institutional partner credentials and verification nodes.', l: '/partners/verification' },
        { t: 'Member Database', d: 'Comprehensive oversight of the global humanitarian agent community.', l: '/admin/donors' },
        { t: 'Global Audit Logs', d: 'Universal registry of all immutable capital flows and transactional data.', l: '/finance/transactions' }
      ];
    }
    if (user?.role === 'ngo-admin') {
      return [
        { t: 'Mission Control', d: 'Synchronized management of campaign registries and operational milestones.', l: '/admin/campaign-dashboard' },
        { t: 'Impact Intelligence', d: 'Real-time analysis of supporter commitment and philanthropic growth.', l: '/admin/donor-analytics' },
        { t: 'Launch New Mission', d: 'Authorize and initialize new humanitarian projects for community support.', l: '/admin/campaigns/create' }
      ];
    }
    return [];
  };

  const adminGates = adaptiveAdminGates();

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-tf-primary selection:text-white pb-0 overflow-x-hidden">
      <PublicNavbar />

      {/* Hero Section - Elite UI */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <motion.div style={{ opacity, y }} className="absolute inset-0 z-0">
          <img src={HERO_IMG} className="w-full h-full object-cover brightness-[0.4] scale-105" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/30" />
        </motion.div>

        <div className="relative z-10 max-w-7xl w-full mx-auto text-center space-y-16 mt-20">
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
              className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full mx-auto"
            >
              <div className="w-2 h-2 bg-tf-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
              <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] leading-none italic">
                {getRoleBadge()}
              </p>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: "circOut" }}
              className="text-[4.5rem] md:text-[7rem] lg:text-[8.5rem] font-extrabold text-white tracking-tighter leading-[0.9] max-w-6xl mx-auto italic lowercase text-stroke-white opacity-95 transition-opacity hover:opacity-100"
            >
              {getWelcomeText()}
            </motion.h1>
            
            <motion.p 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
               className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed border-t border-white/10 pt-8 mt-4 italic"
            >
              {getSubText()}
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} 
            className="flex flex-wrap justify-center gap-8 pt-6"
          >
             {user ? (
               <>
                 <Link to="/dashboard" className="px-12 py-6 bg-tf-primary hover:bg-white text-white hover:text-slate-900 font-black text-[11px] uppercase tracking-[0.5em] rounded-2xl shadow-2xl transition-all active:scale-95 group italic">
                    My Strategic Hub <span className="group-hover:translate-x-3 transition-transform inline-block ml-4">→</span>
                 </Link>
                 <Link to="/profile" className="px-12 py-6 bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white text-white hover:text-slate-900 font-black text-[11px] uppercase tracking-[0.5em] rounded-2xl transition-all active:scale-95 italic">
                    Identity Registry
                 </Link>
               </>
             ) : (
               <>
                 <Link to="/causes" className="px-12 py-6 bg-tf-primary hover:bg-white text-white hover:text-slate-900 font-black text-[11px] uppercase tracking-[0.5em] rounded-2xl shadow-2xl transition-all active:scale-95 group italic">
                    Explore Missions <span className="group-hover:translate-x-3 transition-transform inline-block ml-4">→</span>
                 </Link>
                 <Link to="/login" className="px-12 py-6 bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white text-white hover:text-slate-900 font-black text-[11px] uppercase tracking-[0.5em] rounded-2xl transition-all active:scale-95 italic">
                    Authorized Access
                 </Link>
               </>
             )}
          </motion.div>
        </div>
      </section>

      {/* Community Stats Section */}
      <section className="py-32 px-8 bg-white border-b border-slate-100">
         <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-16 text-center">
            {[
              { val: 'LKR 40M+', label: 'Verified Global Assets' },
              { val: '500+', label: 'Mission Nodes' },
              { val: '15k+', label: 'Global Agents' },
              { val: '100%', label: 'Immutable Integrity' },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="space-y-4 group"
              >
                <h4 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter italic group-hover:text-tf-primary transition-colors">{stat.val}</h4>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] leading-tight italic">{stat.label}</p>
              </motion.div>
            ))}
         </div>
      </section>

      {/* Admin Executive Gateways (Conditional) */}
      {adminGates.length > 0 && (
        <section className="py-32 px-8 lg:px-24 bg-slate-950 border-y border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tf-primary/5 blur-[120px] -mr-60 -mt-60 pointer-events-none" />
           <div className="max-w-7xl mx-auto space-y-20">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <span className="w-4 h-px bg-tf-primary" />
                       <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.6em] leading-none italic">Institutional Management Hub</p>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic lowercase">Executive <span className="text-tf-primary not-italic">Oversight.</span></h2>
                 </div>
                 <p className="text-white/40 font-medium italic text-sm max-w-xs border-l-2 border-white/10 pl-8 leading-relaxed">Authorized access to the synchronized data core and universal administration tools.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                 {adminGates.map((gate, i) => (
                   <motion.div
                     key={gate.t}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.1 }}
                   >
                     <Link to={gate.l} className="group h-full bg-white/5 border border-white/10 p-12 rounded-[3.5rem] hover:bg-tf-primary hover:border-tf-primary transition-all duration-700 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl group-hover:bg-white/20 transition-all duration-1000" />
                        <div className="space-y-6 relative z-10">
                           <h5 className="text-[12px] font-black text-tf-primary group-hover:text-white uppercase tracking-[0.4em] leading-none italic">{gate.t}</h5>
                           <p className="text-base text-white/40 group-hover:text-white/90 leading-relaxed italic font-medium">{gate.d}</p>
                        </div>
                        <div className="pt-8 flex items-center gap-4 text-[10px] font-black text-white/20 group-hover:text-white uppercase tracking-[0.3em] border-t border-white/5 mt-8 italic transition-colors">
                            Authorization Profile <span className="group-hover:translate-x-3 transition-transform duration-500">→</span>
                        </div>
                     </Link>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>
      )}

      {/* Active Projects Section */}
      <section id="campaigns" className="py-40 px-8 lg:px-24 bg-white">
         <div className="max-w-7xl mx-auto space-y-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
               <div className="space-y-6">
                  <div className="flex items-center gap-3">
                     <span className="w-1.5 h-1.5 rounded-full bg-tf-primary shadow-[0_0_8px_rgba(255,138,0,1)] animate-pulse" />
                     <p className="text-[10px] font-black text-tf-primary uppercase tracking-[0.5em] leading-none italic">
                        {user ? "Personalized Mission Registry" : "Active Global Projects"}
                     </p>
                  </div>
                  <h2 className="text-5xl md:text-8xl font-black text-slate-950 tracking-tighter leading-[0.8] italic lowercase">
                    {user ? "Strategic" : "Live Mission"} <br /> <span className="text-slate-400 not-italic">Protocols.</span>
                  </h2>
               </div>
               <Link to="/causes" className="px-12 py-5 bg-slate-950 text-white hover:bg-tf-primary font-black text-[11px] uppercase tracking-[0.4em] rounded-full transition-all shadow-3xl italic duration-700 active:scale-95">
                 Explore Catalog Registry →
               </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 opacity-30">
                 {[1,2,3].map(i => <div key={i} className="aspect-[16/10] bg-slate-100 rounded-[3rem] animate-pulse" />)}
              </div>
            ) : campaigns.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {campaigns.map(item => <CampaignCard key={item._id} item={item} />)}
               </div>
            ) : (
               <div className="bg-slate-50 rounded-[4rem] p-32 text-center border border-slate-100 shadow-inner space-y-8">
                  <div className="w-20 h-20 bg-white border border-slate-100 rounded-[2rem] mx-auto flex items-center justify-center text-slate-200">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div className="space-y-4">
                    <p className="text-slate-900 text-2xl font-black italic tracking-tighter uppercase">All units currently funded.</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.5em] italic">Awaiting new project synchronization</p>
                  </div>
               </div>
            )}
         </div>
      </section>

      {/* Direct Impact Section */}
      <section className="py-48 px-8 bg-slate-950 text-white relative overflow-hidden font-sans border-y border-white/5">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-tf-primary/5 blur-[180px] -mr-40 -mt-40 pointer-events-none" />
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tf-accent/5 blur-[120px] -ml-32 -mb-32 pointer-events-none" />
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center relative z-10">
            <div className="space-y-20">
               <div className="space-y-8">
                  <p className="text-tf-primary font-black uppercase tracking-[0.7em] text-[11px] italic">The Transparency Standard HUB</p>
                  <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] italic lowercase text-stroke-white opacity-90 transition-opacity hover:opacity-100">
                    Proven Audits. <br /> Fast <span className="not-italic text-tf-primary">Impact.</span>
                  </h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  {[
                    { t: 'Verified Partners', d: 'Every project mission is reviewed and authorized by our tactical verification team before public cataloging.' },
                    { t: 'Direct Asset Flow', d: 'Automated capital distribution ensures support resources reach the field objective directly without latency.' },
                    { t: 'Immutable Tracking', d: 'Track your capital contribution journey through every synchronized field milestone through the ledger.' },
                    { t: 'Global Security', d: 'Adhering to international institutional standards for data integrity and contribution safety encryption.' }
                  ].map(f => (
                    <div key={f.t} className="space-y-5 border-l-4 border-tf-primary/10 pl-10 group/feat">
                       <h5 className="text-xl font-black tracking-tight italic group-hover/feat:text-tf-primary transition-colors">{f.t}</h5>
                       <p className="text-[15px] text-white/40 leading-relaxed font-medium italic group-hover/feat:text-white/70 transition-colors">{f.d}</p>
                    </div>
                  ))}
               </div>
            </div>
            <div className="relative group">
               <div className="absolute -inset-4 bg-tf-primary/10 blur-[80px] rounded-[4rem] group-hover:bg-tf-primary/30 transition-all duration-1000" />
               <img src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=1200" className="rounded-[4rem] shadow-4xl grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[2s] ring-1 ring-white/10" alt="Verification" />
            </div>
         </div>
      </section>
      
      {/* CTA Section - Elite Finale */}
      <section className="py-64 px-8 text-center bg-white relative">
         <div className="relative z-10 space-y-20 max-w-6xl mx-auto">
            <h3 className="text-6xl md:text-[9rem] font-black text-slate-950 tracking-tighter uppercase leading-[0.8] italic group">
               {user ? "Expand Your" : "Join The"} <br /> <span className="text-tf-primary group-hover:scale-105 transition-transform inline-block">{user ? "Tactical Presence." : "Global Intel."}</span>
            </h3>
            <p className="text-xl md:text-3xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed italic pr-4">Engage with immutable transparency, direct field action, and verified community support via the TransFund network.</p>
            <div className="flex flex-wrap justify-center gap-12 pt-16">
               {user ? (
                 <Link to="/dashboard" className="px-20 py-8 bg-slate-950 hover:bg-tf-primary text-white text-[13px] font-black uppercase tracking-[0.6em] rounded-full shadow-3xl transition-all duration-700 active:scale-95 italic">
                    Access My Dashboard HUB <span className="ml-4">→</span>
                 </Link>
               ) : (
                 <Link to="/login?tab=signup" className="px-20 py-8 bg-slate-950 hover:bg-tf-primary text-white text-[13px] font-black uppercase tracking-[0.6em] rounded-full shadow-3xl transition-all duration-700 active:scale-95 italic">
                    Initialize Protocol <span className="ml-4">→</span>
                 </Link>
               )}
               <Link to="/about" className="px-12 py-8 text-slate-400 hover:text-slate-950 text-[12px] font-black uppercase tracking-[0.5em] transition-all border-b-2 border-slate-100 hover:border-tf-primary italic font-sans">
                  The Humanitarian Formula
               </Link>
            </div>
         </div>
      </section>

      <PublicFooter />
    </div>
  );
}

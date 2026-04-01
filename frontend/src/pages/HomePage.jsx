import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiShield, FiHeart, FiGlobe, FiActivity } from 'react-icons/fi';

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
        <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[9px] font-bold uppercase tracking-widest text-slate-900 shadow-sm">
          {item.location?.city || 'Global Mission'}
        </div>
        {item.category && (
          <div className="absolute top-6 right-6 px-4 py-1.5 bg-orange-500 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-lg">
             {item.category}
          </div>
        )}
      </div>
      
      <div className="p-10 flex-1 flex flex-col justify-between space-y-8">
        <div className="space-y-4">
           <h4 className="text-xl font-bold text-slate-900 tracking-tight leading-tight group-hover:text-orange-500 transition-colors">{item.title}</h4>
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
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Raised Amount</p>
                    <p className="text-lg font-bold text-slate-900 tabular-nums">LKR {(item.raisedAmount || 0).toLocaleString()}</p>
                 </div>
                 <p className="text-2xl font-bold text-orange-500 tabular-nums tracking-tighter leading-none">{percent}%</p>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percent}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-orange-500 rounded-full relative"
                 />
              </div>
           </div>
           <Link to={`/causes/${item._id}`} className="w-full py-4 bg-slate-50 border border-slate-100 hover:border-orange-500 hover:bg-orange-500 hover:text-white transition-all text-slate-900 text-[10px] font-bold uppercase tracking-widest rounded-xl text-center flex items-center justify-center gap-3">
             View Mission <FiArrowRight />
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

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-orange-500 selection:text-white overflow-x-hidden">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <motion.div style={{ opacity }} className="absolute inset-0 z-0">
          <img src={HERO_IMG} className="w-full h-full object-cover brightness-[0.4]" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
        </motion.div>

        <div className="relative z-10 max-w-7xl w-full mx-auto text-center space-y-16 mt-20">
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
              className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full mx-auto"
            >
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
              <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">
                {user ? `${user.role.toUpperCase()} PORTAL ACTIVE` : "VERIFIED CHARITY PLATFORM"}
              </p>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}
              className="text-5xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.9] italic"
            >
              {user ? <>Welcome back, <br /> <span className="text-orange-500">{user.name.split(' ')[0]}.</span></> : <>Modern Giving. <br /> <span className="text-orange-500">Absolute</span> Trust.</>}
            </motion.h1>
            
            <motion.p 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
               className="text-white/70 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed italic border-t border-white/10 pt-8 mt-4"
            >
              Bridging the gap between global donors and direct local impact. Verified transparency through our secure humanitarian network.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} 
            className="flex flex-wrap justify-center gap-6 pt-6"
          >
             <Link to="/causes" className="px-12 py-5 bg-orange-500 hover:bg-white text-white hover:text-slate-900 font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl shadow-2xl transition-all flex items-center gap-3 group">
                Explore Causes <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
             </Link>
             {!user && (
               <Link to="/login" className="px-12 py-5 bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white text-white hover:text-slate-900 font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl transition-all">
                  Join The Mission
               </Link>
             )}
          </motion.div>
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="py-24 px-8 bg-slate-50/50">
         <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { val: 'LKR 40M+', label: 'Verified Global Assets', icon: <FiDollarSign /> },
              { val: '500+', label: 'Impact Milestones', icon: <FiActivity /> },
              { val: '15k+', label: 'Global Donors', icon: <FiHeart /> },
              { val: '100%', label: 'Transparency Index', icon: <FiShield /> },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="text-orange-500 flex justify-center text-2xl mb-4 opacity-50"><stat.icon /></div>
                <h4 className="text-4xl font-black text-slate-900 tracking-tighter italic">{stat.val}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Features Section */}
      <section className="py-40 px-8 lg:px-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <header className="space-y-4">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em] italic">The TransFund Standard</span>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none italic lowercase">
                Direct Impact. <br /> <span className="text-slate-400 not-italic">No Middlemen.</span>
              </h2>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
                { t: 'Verified NGOs', d: 'Every partner undergoes multi-stage verification to ensure operational excellence and high trust scores.' },
                { t: 'Live Tracking', d: 'Witness your contribution reach the field through real-time milestone updates and photographic evidence.' },
                { t: 'Strategic AI', d: 'Get personalized humanitarian insights and donation recommendations tailored to your values.' },
                { t: 'Secure Gateway', d: 'Industry-standard encryption for all capital transfers, ensuring global safety and local velocity.' }
              ].map((f, i) => (
                <div key={i} className="space-y-3 group">
                   <h5 className="font-bold text-slate-900 italic transition-colors group-hover:text-orange-500">{f.t}</h5>
                   <p className="text-sm text-slate-500 leading-relaxed italic">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500 blur-[120px] opacity-20 -z-10 rounded-full" />
            <img src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=1200" className="rounded-[3rem] shadow-4xl ring-1 ring-slate-100" alt="Verification" />
          </div>
        </div>
      </section>

      {/* Active Causes */}
      <section className="py-40 px-8 lg:px-24 bg-slate-50">
         <div className="max-w-7xl mx-auto space-y-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-slate-200 pb-12">
               <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em] italic">Active Mission Registry</h3>
                  <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic lowercase leading-none">Current <span className="text-slate-400 not-italic">Initiatives.</span></h2>
               </div>
               <Link to="/causes" className="text-xs font-bold text-orange-500 uppercase tracking-widest border-b-2 border-orange-500/20 hover:border-orange-500 transition-all pb-1">View All Registry HUB Index</Link>
            </header>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                 {[1,2,3].map(i => <div key={i} className="aspect-[16/10] bg-white rounded-[3rem] animate-pulse" />)}
              </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {campaigns.map(item => <CampaignCard key={item._id} item={item} />)}
               </div>
            )}
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-64 text-center bg-slate-950 text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent" />
         <div className="relative z-10 max-w-4xl mx-auto px-12 space-y-12">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">Ready to <span className="text-orange-500">Transform?</span></h2>
            <p className="text-white/50 text-xl md:text-2xl font-medium leading-relaxed italic max-w-2xl mx-auto">Join a verified network of global donors dedicated to absolute transparency and direct action.</p>
            <div className="pt-10 flex flex-wrap justify-center gap-8">
               <Link to="/login?tab=signup" className="px-16 py-6 bg-orange-500 hover:bg-white text-white hover:text-slate-900 font-black text-[11px] uppercase tracking-[0.5em] rounded-full transition-all shadow-3xl italic active:scale-95">Initialize Profile →</Link>
               <Link to="/about" className="px-16 py-6 border border-white/10 hover:bg-white text-white hover:text-slate-900 font-black text-[11px] uppercase tracking-[0.5em] rounded-full transition-all italic active:scale-95">Our Methodology</Link>
            </div>
         </div>
      </section>

      <PublicFooter />
    </div>
  );
}

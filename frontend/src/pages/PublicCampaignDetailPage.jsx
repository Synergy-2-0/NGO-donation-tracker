import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';

function DonationModal({ campaign, user, onClose }) {
  const [amount, setAmount] = useState('1000');
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [donorDetails, setDonorDetails] = useState({
     firstName: user?.name?.split(' ')[0] || '',
     lastName: user?.name?.split(' ').slice(1).join(' ') || '',
     email: user?.email || '',
     phone: '',
     address: '',
     city: 'Colombo',
     country: 'Sri Lanka'
  });

  const finalAmount = amount === 'custom' ? parseFloat(customAmount) || 0 : parseFloat(amount);
  const isValid = finalAmount >= 100 && donorDetails.email && donorDetails.firstName && donorDetails.phone;

  const handlePayHere = async (e) => {
     e.preventDefault();
     
     if (!user || !user._id) {
        alert('SECURE HUB: AUTHENTICATION ERROR. \n\nPersonnel identity node not found. Please re-authenticate your session.');
        return;
     }

     if (!isValid || loading) return;

     setLoading(true);
     try {
        const payload = {
           donorId: user._id,
           ngoId: campaign.createdBy?._id || campaign.createdBy || '660000000000000000000000',
           campaignId: campaign._id,
           amount: finalAmount,
           currency: "LKR",
           firstName: donorDetails.firstName,
           lastName: donorDetails.lastName,
           email: donorDetails.email,
           phone: donorDetails.phone,
           address: donorDetails.address || 'Mission Headquarters',
           city: donorDetails.city || 'Colombo',
           country: donorDetails.country || 'Sri Lanka'
        };

        const { data } = await api.post('/api/finance/payhere/init', payload);

        if (data.success && data.paymentData) {
           const form = document.createElement('form');
           form.method = 'POST';
           form.action = 'https://sandbox.payhere.lk/pay/checkout';

           Object.keys(data.paymentData).forEach(key => {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = data.paymentData[key];
              form.appendChild(input);
           });

           document.body.appendChild(form);
           form.submit();
        }
     } catch (err) {
        const errorMsg = err.response?.data?.message || 'Network protocol disconnected.';
        const validationErrors = err.response?.data?.errors?.map(e => `${e.field}: ${e.message}`).join('\n');
        
        console.error('SECURE GATEWAY ERROR:', err.response?.data || err);
        alert(`SECURE BYPASS FAILED: ${errorMsg}\n${validationErrors || 'Validation node mismatch detected.'}`);
     } finally {
        setLoading(false);
     }
  };

  return (
    <div className="fixed inset-0 z-[1000] overflow-y-auto bg-slate-950/40 backdrop-blur-md">
       <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.98 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col lg:flex-row border border-slate-200/50"
          >
             {/* Left Column: Branding Node */}
             <div className="w-full lg:w-[40%] bg-slate-950 p-12 lg:p-16 text-white flex flex-col justify-between relative shrink-0">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-tf-primary/20 blur-[120px] -mr-48 -mt-48 pointer-events-none" />
                
                <div className="space-y-12 relative z-10">
                   <button onClick={onClose} className="flex items-center gap-3 text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] hover:text-white transition-colors group/back">
                      <svg className="w-4 h-4 group-hover/back:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                      BACK TO REGISTRY
                   </button>
                   
                   <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-tf-primary/10 border border-tf-primary/20 rounded-full">
                         <div className="w-1.5 h-1.5 rounded-full bg-tf-primary animate-pulse" />
                         <span className="text-[9px] font-bold text-tf-primary uppercase tracking-[0.2em]">SECURE HANDSHAKE ACTIVE</span>
                      </div>
                      <h3 className="text-5xl font-black tracking-tight leading-[1.0] italic">
                         Global <br/><span className="text-tf-primary italic uppercase tracking-tighter">Impact</span> Node
                      </h3>
                   </div>
                   
                   <div className="space-y-6">
                      <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                         <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.4em] mb-2 italic">CAMPAIGN ID_</p>
                         <p className="text-lg font-bold text-white leading-tight">{campaign.title}</p>
                      </div>
                      <p className="text-sm text-white/40 leading-relaxed font-medium italic">
                        Authorized deployment of humanitarian capital through the verified TransFund strategic HUB network.
                      </p>
                   </div>
                </div>

                <div className="pt-8 relative z-10 flex items-center justify-between border-t border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-tf-primary/20 flex items-center justify-center text-tf-primary">
                           <svg className="w-5 h-5 shadow-lg" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <div className="space-y-0.5">
                           <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">VERIFIED BY</p>
                           <p className="text-[10px] font-black text-white uppercase tracking-[0.1em]">TRANSFUND SECURITY HUB</p>
                        </div>
                    </div>
                </div>
             </div>

             {/* Right Column: Functional Form */}
             <div className="flex-1 p-12 lg:p-16 space-y-12 bg-white overflow-y-auto max-h-[90vh] custom-scrollbar">
                
                {/* Section 01: Capital */}
                <div className="space-y-8">
                   <div className="flex items-end justify-between border-b border-slate-100 pb-6">
                      <div className="space-y-1">
                         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em] italic">PHASE 01_ ALLOCATION</p>
                         <h4 className="text-3xl font-black text-slate-900 tracking-tight italic">Select Capital Volume</h4>
                      </div>
                      <span className="text-[10px] font-bold text-tf-primary uppercase tracking-[0.2em] italic mb-1">RS / LKR</span>
                   </div>
                   
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['500', '1000', '5000', 'custom'].map((val) => (
                         <button 
                            key={val} 
                            onClick={() => setAmount(val)}
                            className={`h-14 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] transition-all duration-300 border shadow-sm flex items-center justify-center ${amount === val ? 'bg-slate-950 text-white border-slate-950 shadow-xl' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-tf-primary/30 hover:bg-white hover:text-slate-900'}`}
                         >
                            {val === 'custom' ? 'OTHER' : `RS ${val}`}
                         </button>
                      ))}
                   </div>
                   
                   <AnimatePresence mode="wait">
                      {amount === 'custom' && (
                         <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="relative">
                            <input 
                               type="number" 
                               placeholder="Input custom amount (Min RS 100)" 
                               value={customAmount}
                               onChange={(e) => setCustomAmount(e.target.value)}
                               className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 text-lg font-bold text-slate-950 focus:outline-none focus:border-tf-primary/40 focus:ring-4 focus:ring-tf-primary/5 transition-all"
                            />
                         </motion.div>
                      )}
                   </AnimatePresence>
                </div>

                {/* Section 02: Details */}
                <div className="space-y-10">
                   <div className="border-b border-slate-100 pb-6">
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em] italic">PHASE 02_ IDENTIFICATION</p>
                      <h4 className="text-3xl font-black text-slate-900 tracking-tight italic">Agent Credentials</h4>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">GIVEN NAME</label>
                         <input 
                            placeholder="e.g. John"
                            value={donorDetails.firstName} onChange={(e) => setDonorDetails({...donorDetails, firstName: e.target.value})}
                            className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-950 focus:outline-none focus:border-tf-primary/40 transition-all placeholder:text-slate-200 placeholder:font-medium" 
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">LAST IDENTIFIER</label>
                         <input 
                            placeholder="e.g. Doe"
                            value={donorDetails.lastName} onChange={(e) => setDonorDetails({...donorDetails, lastName: e.target.value})}
                            className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-950 focus:outline-none focus:border-tf-primary/40 transition-all placeholder:text-slate-200" 
                         />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">EMAIL CHANNEL</label>
                         <input 
                            type="email" placeholder="agent@transfund.ngo"
                            value={donorDetails.email} onChange={(e) => setDonorDetails({...donorDetails, email: e.target.value})}
                            className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-950 focus:outline-none focus:border-tf-primary/40 transition-all placeholder:text-slate-200" 
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">CONTACT NODE (PHONE)</label>
                         <input 
                            placeholder="07XXXXXXXX"
                            value={donorDetails.phone} onChange={(e) => setDonorDetails({...donorDetails, phone: e.target.value})}
                            className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-950 focus:outline-none focus:border-tf-primary/40 transition-all placeholder:text-slate-200" 
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">GEO CENTER (CITY)</label>
                         <input 
                            placeholder="Colombo"
                            value={donorDetails.city} onChange={(e) => setDonorDetails({...donorDetails, city: e.target.value})}
                            className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-950 focus:outline-none focus:border-tf-primary/40 transition-all placeholder:text-slate-200" 
                         />
                      </div>
                   </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-10">
                   <button 
                      onClick={handlePayHere}
                      disabled={!isValid || loading}
                      className="flex-[2] py-6 bg-slate-950 text-white rounded-full text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-tf-primary transition-all duration-500 disabled:opacity-10 italic flex items-center justify-center gap-4 active:scale-95"
                   >
                      {loading ? 'Processing Protocol...' : `Authorize RS ${finalAmount.toLocaleString()} Support →`}
                   </button>
                   <button onClick={onClose} className="flex-1 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] border border-slate-100 rounded-full hover:bg-slate-50 transition-colors">Discard</button>
                </div>
                
                <div className="flex items-center justify-center gap-4 pt-8 opacity-40">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em] italic">Encryption protocol authorized and audited</p>
                </div>
             </div>
          </motion.div>
       </div>
    </div>
  );
}

export default function PublicCampaignDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/api/campaigns/${id}`);
        setCampaign(data);
      } catch (err) {
        setError('Mission registry offline or authorization restricted HUB.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error || !campaign) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-16 font-sans p-8 pt-4">
       <div className="w-32 h-32 bg-white border border-slate-100 rounded-[3rem] flex items-center justify-center text-slate-100 rotate-12 transition-all duration-1000 hover:rotate-0 shadow-inner italic font-black text-5xl">?</div>
       <div className="text-center space-y-8">
         <div className="space-y-4">
            <p className="text-slate-950 font-black uppercase tracking-[0.8em] italic text-sm">{error || 'Node Synchronization Failure HUB'}</p>
            <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.5em] italic">Mission Registry Node [SEC_NA_REF] detected HUB</p>
         </div>
         <button onClick={() => navigate('/causes')} className="inline-block px-16 py-8 bg-slate-950 text-white rounded-full text-[12px] font-black uppercase tracking-[0.6em] italic hover:bg-tf-primary transition-all duration-1000 shadow-5xl active:scale-95 mt-10">Return to Catalog Registry HUB Index</button>
       </div>
    </div>
  );

  const pct = Math.min(100, Math.round(((campaign.raisedAmount || 0) / campaign.goalAmount) * 100));

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-tf-primary selection:text-white">
      <PublicNavbar />
      
      {/* Cinematic Identity Header HUB Deployment */}
      <section className="relative pt-48 pb-40 px-8 overflow-hidden group/hero">
         <div className="absolute inset-0 z-0">
            <img 
               src={campaign.image ? `${import.meta.env.VITE_API_URL || ''}${campaign.image}` : "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=2400"} 
               className="w-full h-full object-cover brightness-[0.25] group-hover/hero:scale-125 transition-transform duration-[8000ms] ease-out" 
               alt={campaign.title} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent" />
         </div>

         <div className="relative z-10 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-tf-primary shadow-[0_0_15px_rgba(255,138,0,0.6)]" />
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.4em] leading-none">Sector: {campaign.category?.toUpperCase() || 'HUMANITARIAN AID'}</span>
               </motion.div>
               <div className="space-y-10">
                  <motion.h1 
                     initial={{ opacity: 0, y: 30 }} 
                     animate={{ opacity: 1, y: 0 }} 
                     transition={{ duration: 0.8 }} 
                     className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight leading-[0.95] italic"
                  >
                     {campaign.title}
                  </motion.h1>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-wrap items-center gap-12 pt-8 border-t border-slate-100">
                   <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">GEOGRAPHIC NODE</p>
                      <p className="text-2xl font-bold text-slate-900 tracking-tight italic">{campaign.location?.city}, {campaign.location?.country || 'Sri Lanka'}</p>
                   </div>
                   <div className="h-12 w-px bg-slate-100 hidden sm:block" />
                   <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">STRATEGIC PARTNER</p>
                      <p className="text-2xl font-bold text-slate-900 tracking-tight italic">{campaign.createdBy?.organizationName || campaign.createdBy?.name || 'TransFund Global'}</p>
                   </div>
                </motion.div>
             </div>
          </div>

            <motion.div 
               initial={{ opacity: 0, y: 40 }} 
               animate={{ opacity: 1, y: 0 }} 
               transition={{ delay: 0.3 }} 
               className="bg-white border border-slate-100 rounded-[3rem] p-16 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] space-y-12 relative overflow-hidden group/card"
            >
               <div className="space-y-10 relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                     <div className="space-y-4">
                        <p className="text-[11px] font-bold text-tf-primary uppercase tracking-[0.4em] italic mb-2">CAPITAL MOBILIZED_</p>
                        <div className="flex items-baseline gap-4">
                           <span className="text-3xl font-medium text-slate-400">RS</span>
                           <p className="text-7xl font-black text-slate-950 tracking-tighter tabular-nums">
                              {(campaign.raisedAmount || 0).toLocaleString()}
                           </p>
                        </div>
                     </div>
                     <div className="text-left md:text-right bg-slate-50 px-8 py-4 rounded-3xl border border-slate-100">
                        <p className="text-4xl font-black text-tf-primary tracking-tighter leading-none italic">{pct}%</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">SECURED</p>
                     </div>
                  </div>
                  <div className="h-4 bg-slate-50 rounded-full overflow-hidden relative border border-slate-100 p-[2px]">
                     <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${pct}%` }} 
                        transition={{ duration: 2, ease: "easeOut" }} 
                        className="h-full bg-slate-950 rounded-full relative"
                     />
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">
                     <span>Target Goal: RS {campaign.goalAmount.toLocaleString()}</span>
                     <span>{campaign.donationsCount || 0} Strategic Backers</span>
                  </div>
               </div>

               <button 
                  onClick={() => setShowModal(true)}
                  className="w-full py-8 bg-slate-950 text-white rounded-full text-sm font-black uppercase tracking-[0.4em] hover:bg-tf-primary transition-all duration-500 shadow-2xl hover:shadow-tf-primary/20 active:scale-95 flex items-center justify-center gap-6 group/btn italic"
               >
                  Authorize Support <span className="group-hover/btn:translate-x-3 transition-transform">→</span>
               </button>

               <div className="pt-10 flex flex-wrap items-center justify-center gap-10 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                     <div className="w-5 h-5 text-tf-primary"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">LIVE FIELD DATA</span>
                  </div>
               </div>
            </motion.div>
         </div>
      </section>

      <AnimatePresence>
         {showModal && <DonationModal campaign={campaign} user={user} onClose={() => setShowModal(false)} />}
      </AnimatePresence>

      {/* Mission Execution Roadmap */}
      <section className="py-48 max-w-[1400px] mx-auto px-12 grid grid-cols-1 lg:grid-cols-3 gap-32 relative">
         <div className="absolute top-1/2 left-0 w-px h-[500px] bg-gradient-to-b from-transparent via-tf-primary/20 to-transparent pointer-events-none" />
         
         <div className="lg:col-span-2 space-y-28">
            <div className="space-y-12 group/intel">
               <div className="flex items-center gap-8">
                  <div className="w-20 h-1 bg-tf-primary" />
                  <h3 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter italic leading-none">Mission <span className="text-slate-400">Context</span></h3>
               </div>
               <div className="text-xl text-slate-500 leading-relaxed space-y-12 font-medium italic pr-12 xl:pr-32">
                  <p className="first-letter:text-7xl first-letter:font-black first-letter:text-tf-primary first-letter:mr-6 first-letter:float-left first-letter:leading-none">
                    {campaign.description || "Every authorized mission project represents a strategic opportunity for verified positive humanitarian change. Through direct supporter mobilization, we target the provision of essential aid and sustainable infrastructure."}
                  </p>
                  <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="border-l-4 border-tf-primary pl-12 py-8 bg-slate-50 rounded-r-3xl text-lg text-slate-600">
                    Our commitment to transparency ensures that every contribution reaches its intended objective, verified through field reports and real-time updates.
                    <div className="mt-6 flex items-center gap-4">
                       <span className="text-[10px] font-bold text-tf-primary uppercase tracking-widest">Verified Transparency Protocol</span>
                    </div>
                  </motion.div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-24 border-t border-slate-100 border-dashed">
               {[
                  { t: 'Verified Impact', d: 'Every contribution is tracked through tactical audit registries accessible to verified mission personnel.' },
                  { t: 'Regional Coordination', d: 'Collaborating directly with regional humanitarian agents for maximum operational efficiency.' },
                  { t: 'Governance Standards', d: 'Adhering to global standards for capital safety and philanthropic synchronization.' },
                  { t: 'Real-time Intelligence', d: 'Supporters receive synchronized updates directly from the point of impact deployment.' }
               ].map((pillar, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    key={pillar.t} 
                    className="space-y-4"
                  >
                     <p className="text-xs font-bold text-tf-primary uppercase tracking-widest flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-tf-primary/20" />
                        {pillar.t}
                     </p>
                     <p className="text-base text-slate-400 font-medium leading-relaxed italic">{pillar.d}</p>
                  </motion.div>
               ))}
            </div>
         </div>

         {/* Sidebar Stats */}
         <div className="space-y-12">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-slate-50 rounded-3xl p-12 border border-slate-100 space-y-10">
               <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest italic">Mission Timeline</h4>
               <div className="space-y-8">
                  <div className="flex items-center gap-8">
                     <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 border border-slate-100 font-black text-xl italic shadow-sm">
                        IN
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Initialization</p>
                        <p className="text-lg font-bold text-slate-900">{new Date(campaign.startDate).toLocaleDateString()}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-8">
                     <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 border border-slate-100 font-black text-xl italic shadow-sm">
                        EX
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Expected Completion</p>
                        <p className="text-lg font-bold text-slate-900">{new Date(campaign.endDate).toLocaleDateString()}</p>
                     </div>
                  </div>
               </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-tf-dark rounded-3xl p-12 text-white space-y-8 border border-white/5">
               <h4 className="text-[10px] font-bold text-tf-primary uppercase tracking-widest">Status Report</h4>
               <p className="text-lg text-white/50 leading-relaxed italic font-medium">
                  Confirmed project state: <span className="text-white font-black uppercase">Active Deployment</span>. Resources are allocated on fixed authorization cycles based on verified field milestones.
               </p>
               <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                  <div className="w-3 h-3 bg-tf-accent rounded-full animate-pulse shadow-[0_0_10px_currentColor]" />
                  <span className="text-xs font-bold text-tf-accent uppercase tracking-widest">Surveillance: Active</span>
               </div>
            </motion.div>
         </div>
      </section>

      {/* Impact Matrix */}
      <section className="py-48 px-8 lg:px-24 bg-tf-dark text-white relative overflow-hidden font-sans border-y border-white/5">
         <div className="max-w-[1400px] mx-auto space-y-32 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16">
               <div className="space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-0.5 bg-tf-primary" />
                     <p className="text-xs font-bold text-tf-primary uppercase tracking-widest">Impact Strategy Matrix</p>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight italic">
                     Strategic <span className="text-tf-primary italic">Intelligence</span>
                  </h2>
               </div>
               <p className="max-w-md text-white/40 font-medium italic text-xl border-l-4 border-tf-primary/20 pl-10 leading-relaxed">
                 High-fidelity data points documenting the verified success of our global network and field agents.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                  { label: 'Personnel Reached', value: '1,200+', detail: 'Verified families and regional cohorts in direct coordination.', icon: '👥' },
                  { label: 'Integrity Protocol', value: '100%', detail: 'Total capital audit trail synchronization for all intake nodes.', icon: '🛡️' },
                  { label: 'Deployment Velocity', value: '48h', detail: 'Tactical deployment cycle for critical resource allocation.', icon: '⚡' }
               ].map((stat) => (
                  <div key={stat.label} className="bg-white/[0.03] border border-white/5 rounded-3xl p-12 space-y-8 hover:bg-white/[0.06] transition-all">
                     <div className="flex justify-between items-center">
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{stat.label}</p>
                        <span className="text-3xl grayscale opacity-30">{stat.icon}</span>
                     </div>
                     <h4 className="text-6xl font-black text-tf-primary tracking-tighter italic lowercase">{stat.value}</h4>
                     <p className="text-sm text-white/30 font-medium italic leading-relaxed pl-4 border-l border-white/10">{stat.detail}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-48 bg-white relative overflow-hidden text-center">
         <div className="max-w-4xl mx-auto px-12 space-y-16 relative z-10">
            <h3 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tighter uppercase italic leading-tight">
               Ready To <span className="text-tf-primary">Empower?</span>
            </h3>
            <p className="text-slate-400 text-2xl leading-relaxed italic font-medium">Join an elite network of global agents dedicated to verified field impact and community transformation.</p>
            
            <div className="pt-12 flex flex-col md:flex-row items-center justify-center gap-8">
               <button onClick={() => setShowModal(true)} className="px-16 py-6 bg-slate-950 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-tf-primary transition-all shadow-xl min-w-[300px]">
                  Initialize Support Now →
               </button>
               <Link to="/causes" className="text-slate-400 hover:text-slate-950 text-sm font-bold uppercase tracking-widest transition-all italic border-b border-slate-100 hover:border-tf-primary py-2">
                  Return to Active Causes
               </Link>
            </div>
         </div>
      </section>

      <PublicFooter />
      
      <style>{`
         @keyframes shimmer { 
            0% { transform: translateX(-100%); } 
            100% { transform: translateX(100%); } 
         }
         .animate-shimmer {
            animation: shimmer 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
         }
         .backdrop-blur-4xl {
            backdrop-filter: blur(80px);
         }
      `}</style>
    </div>
  );
}

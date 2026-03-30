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
  const isValid = finalAmount >= 100 && donorDetails.email && donorDetails.firstName;

  // PayHere Integration Data (Sandbox)
  const merchantId = "1233989";
  const returnUrl = `${window.location.origin}/dashboard`;
  const cancelUrl = window.location.href;
  const notifyUrl = "https://your-backend.com/api/donations/payhere-notify"; // MISSION_CRITICAL: REPLACE WITH PRODUCTION LIVE ENDPOINT
  const orderId = `TF-${Date.now()}`;
  const currency = "LKR";

  const handlePayHere = (e) => {
     e.preventDefault();
     if (!isValid) return;

     const form = document.createElement('form');
     form.method = 'POST';
     form.action = 'https://sandbox.payhere.lk/pay/checkout';

     const fields = {
        merchant_id: merchantId,
        return_url: returnUrl,
        cancel_url: cancelUrl,
        notify_url: notifyUrl,
        order_id: orderId,
        items: campaign.title,
        currency: currency,
        amount: finalAmount,
        first_name: donorDetails.firstName,
        last_name: donorDetails.lastName,
        email: donorDetails.email,
        phone: donorDetails.phone,
        address: donorDetails.address || 'No Address',
        city: donorDetails.city,
        country: donorDetails.country,
        custom_1: campaign._id,
        custom_2: user?._id || 'guest'
     };

     Object.keys(fields).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
     });

     document.body.appendChild(form);
     form.submit();
  };

  return (
    <div className="fixed inset-0 z-[500] overflow-y-auto">
       <div className="min-h-screen flex items-center justify-center p-8 relative">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 100 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            className="relative bg-white w-full max-w-6xl rounded-[5rem] shadow-5xl overflow-hidden border border-white/20 flex flex-col xl:flex-row transition-all duration-1000"
          >
             
             {/* Mission Identity: Strategic Authorization Panel */}
             <div className="w-full xl:w-[40%] bg-slate-950 p-20 text-white flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tf-primary/10 blur-[180px] -mr-60 -mt-60 animate-pulse pointer-events-none group-hover:bg-tf-primary/20 transition-all duration-1000" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-tf-accent/5 blur-[120px] -ml-32 -mb-32 pointer-events-none" />
                
                <div className="space-y-20 relative z-10">
                   <button onClick={onClose} className="flex items-center gap-6 text-[11px] font-black text-white/30 uppercase tracking-[0.7em] hover:text-white transition-all group/back italic">
                      <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center group-hover/back:border-white transition-all group-hover/back:-translate-x-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                      </div>
                      Abort Mission_Cycle HUB
                   </button>
                   
                   <div className="space-y-8">
                      <div className="flex items-center gap-5">
                         <div className="w-3 h-3 rounded-full bg-tf-primary shadow-[0_0_15px_rgba(255,138,0,1)] animate-pulse" />
                         <p className="text-[12px] font-black text-tf-primary uppercase tracking-[0.8em] leading-none italic underline decoration-tf-primary/30 decoration-4 underline-offset-[14px]">Authorized_Support_Synchronizer HUB</p>
                      </div>
                      <h3 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.8] italic lowercase text-stroke-white opacity-90 transition-all hover:opacity-100">
                         Activate <span className="text-white not-italic items-center">Humanitarian</span> Node.
                      </h3>
                   </div>
                   
                   <div className="space-y-10">
                      <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] space-y-6 group/box hover:bg-white/10 transition-all duration-1000 shadow-2xl relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-24 h-24 bg-tf-primary/10 blur-3xl opacity-0 group-hover/box:opacity-100 transition-opacity" />
                         <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic leading-none">Target_Mission Objective_Hub</p>
                         <p className="text-xl font-black text-white/80 italic leading-tight transition-all duration-700 group-hover/box:text-white lowercase tracking-tight">"{campaign.title}"</p>
                      </div>
                      <p className="text-[13px] text-white/40 leading-relaxed font-black uppercase tracking-widest italic px-6 border-l-2 border-white/10">Authorized capital contribution HUB directed through verified humanitarian registries to ensure absolute field impact synchronization.</p>
                   </div>
                </div>

                <div className="pt-20 relative z-10 flex items-center justify-between border-t border-white/10">
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em] italic">Security_Registry Protocol HUB</p>
                        <div className="flex items-center gap-6 text-white/40 group-hover:text-tf-primary transition-all duration-1000">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:rotate-12 transition-all">
                               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                            </div>
                            <p className="text-[11px] font-black uppercase tracking-[0.3em] leading-tight italic">Verified <br /> Transfund_Command HUB</p>
                        </div>
                    </div>
                    <img src="/payhere_logo.png" alt="PayHere" className="h-10 opacity-20 grayscale group-hover:filter-none group-hover:opacity-100 transition-all duration-1000 scale-125" />
                </div>
             </div>

             {/* Right Column: Tactical Input Interface Hub */}
             <div className="flex-1 p-20 xl:p-28 space-y-20 bg-white overflow-y-auto max-h-[90vh] custom-scrollbar relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-tf-primary/3 blur-[120px] pointer-events-none" />
                
                <div className="space-y-12">
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-50 pb-8">
                      <div className="space-y-3">
                         <p className="text-[12px] font-black text-slate-300 uppercase tracking-[0.7em] leading-none italic group-hover:text-slate-950 transition-colors">Strategic_Capital_Allocation_Protocol HUB</p>
                         <h4 className="text-3xl font-black italic tracking-tighter text-slate-950">Section 01_ <span className="text-slate-200">Liquidity Volume</span></h4>
                      </div>
                      <div className="px-6 py-2 bg-slate-50 border border-slate-100 rounded-full text-[11px] font-black text-tf-primary uppercase tracking-[0.5em] italic animate-pulse">Synchronizing LKR Matrix...</div>
                   </div>
                   
                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                      {['500', '1000', '5000', 'custom'].map((val, idx) => (
                         <motion.button 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                            key={val} 
                            onClick={() => setAmount(val)}
                            className={`h-24 rounded-[2rem] text-[13px] font-black uppercase tracking-[0.4em] transition-all duration-700 border italic tabular-nums relative overflow-hidden group/opt ${amount === val ? 'bg-slate-950 text-white border-slate-950 shadow-4xl scale-105 z-10' : 'bg-slate-50 text-slate-300 border-slate-100 hover:border-tf-primary/30 hover:bg-white hover:text-slate-950 hover:shadow-2xl'}`}
                         >
                            <div className="absolute inset-0 bg-tf-primary/5 opacity-0 group-hover/opt:opacity-100 transition-opacity" />
                            {val === 'custom' ? 'Direct Input Hub' : `LKR ${val}`}
                         </motion.button>
                      ))}
                   </div>
                   <AnimatePresence mode="wait">
                      {amount === 'custom' && (
                         <motion.div 
                            initial={{ opacity: 0, height: 0, y: -20 }} 
                            animate={{ opacity: 1, height: 'auto', y: 0 }} 
                            exit={{ opacity: 0, height: 0, y: -20 }}
                            className="relative"
                         >
                            <div className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-100 font-black italic text-xl tracking-widest uppercase">LKR_</div>
                            <input 
                               type="number" 
                               placeholder="Input strategic capital volume (Min 100)..." 
                               value={customAmount}
                               onChange={(e) => setCustomAmount(e.target.value)}
                               className="w-full bg-slate-50 border border-slate-100 rounded-[2.5rem] pl-28 pr-12 py-10 text-2xl font-black text-slate-950 focus:outline-none focus:border-tf-primary focus:bg-white transition-all shadow-inner italic placeholder:text-slate-100 tracking-tighter tabular-nums"
                            />
                            <div className="absolute right-12 top-1/2 -translate-y-1/2 text-[11px] font-black text-tf-primary uppercase tracking-[0.5em] italic leading-none animate-pulse">Target Min: 100_HUB</div>
                         </motion.div>
                      )}
                   </AnimatePresence>
                </div>

                <div className="space-y-16">
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-50 pb-8">
                      <div className="space-y-3">
                         <p className="text-[12px] font-black text-slate-300 uppercase tracking-[0.7em] leading-none italic group-hover:text-slate-950 transition-colors">Support_Agent_Logistics_Synchronization HUB</p>
                         <h4 className="text-3xl font-black italic tracking-tighter text-slate-950">Section 02_ <span className="text-slate-200">Agent Identification Hub</span></h4>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                      <div className="space-y-5">
                         <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-10 italic leading-none group-hover:text-tf-primary transition-colors">Authorization_Core_ID Hub</label>
                         <input 
                            value={donorDetails.firstName} onChange={(e) => setDonorDetails({...donorDetails, firstName: e.target.value})}
                            placeholder="GIVEN_IDENTIFIER"
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-[2.5rem] px-10 py-7 text-lg font-black text-slate-950 focus:outline-none focus:border-tf-primary focus:bg-white shadow-inner transition-all duration-700 italic placeholder:text-slate-100 tracking-tight" 
                         />
                      </div>
                      <div className="space-y-5">
                         <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-10 italic leading-none group-hover:text-tf-primary transition-colors">Institutional_Surname HUB</label>
                         <input 
                            value={donorDetails.lastName} onChange={(e) => setDonorDetails({...donorDetails, lastName: e.target.value})}
                            placeholder="SURNAME_PROTOCOL"
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-[2.5rem] px-10 py-7 text-lg font-black text-slate-950 focus:outline-none focus:border-tf-primary focus:bg-white shadow-inner transition-all duration-700 italic placeholder:text-slate-100 tracking-tight" 
                         />
                      </div>
                      <div className="md:col-span-2 space-y-5">
                         <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-10 italic leading-none group-hover:text-tf-primary transition-colors">Secure_Operational_Comms_Node (Email)</label>
                         <input 
                            type="email" value={donorDetails.email} onChange={(e) => setDonorDetails({...donorDetails, email: e.target.value})}
                            placeholder="DIGITAL_CRYPTO_ADDRESS"
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-[2.5rem] px-10 py-7 text-lg font-black text-slate-950 focus:outline-none focus:border-tf-primary focus:bg-white shadow-inner transition-all duration-700 italic placeholder:text-slate-100 tracking-tight" 
                         />
                      </div>
                      <div className="space-y-5">
                         <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-10 italic leading-none group-hover:text-tf-primary transition-colors">Verified_Voice_Protocol HUB</label>
                         <input 
                            placeholder="+94 7X XXX XXXX_LINK"
                            value={donorDetails.phone} onChange={(e) => setDonorDetails({...donorDetails, phone: e.target.value})}
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-[2.5rem] px-10 py-7 text-lg font-black text-slate-950 focus:outline-none focus:border-tf-primary focus:bg-white shadow-inner transition-all duration-700 italic placeholder:text-slate-100 tracking-tight" 
                         />
                      </div>
                      <div className="space-y-5">
                         <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-10 italic leading-none group-hover:text-tf-primary transition-colors">Regional_Tactical_Base Hub (City)</label>
                         <input 
                            value={donorDetails.city} onChange={(e) => setDonorDetails({...donorDetails, city: e.target.value})}
                            placeholder="OPERATIONAL_CITY_HUB"
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-[2.5rem] px-10 py-7 text-lg font-black text-slate-950 focus:outline-none focus:border-tf-primary focus:bg-white shadow-inner transition-all duration-700 italic placeholder:text-slate-100 tracking-tight" 
                         />
                      </div>
                   </div>
                </div>

                <div className="flex flex-col md:flex-row gap-10 pt-16 relative z-20">
                   <button 
                      onClick={handlePayHere}
                      disabled={!isValid}
                      className="flex-[3] py-10 bg-slate-950 text-white rounded-full text-[14px] font-black uppercase tracking-[0.7em] shadow-5xl hover:bg-tf-primary transition-all duration-1000 active:scale-95 disabled:opacity-20 disabled:grayscale italic group/confirm flex items-center justify-center gap-8"
                   >
                      Authorize LKR {finalAmount.toLocaleString()} Support Hub <span className="group-hover/confirm:translate-x-6 transition-transform duration-1000 inline-block text-2xl">→</span>
                   </button>
                   <button onClick={onClose} className="flex-1 py-10 text-[12px] font-black text-slate-300 uppercase tracking-[0.6em] transition-all duration-700 border-2 border-slate-50 rounded-full hover:bg-slate-50 hover:text-slate-950 italic hover:border-slate-100 shadow-inner">Discard HUB Cycle</button>
                </div>
                
                <div className="flex items-center justify-center gap-6 pt-10">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.7em] italic">Encryption protocol authorized HUB via Transfund_Secure_Registry Command Center</p>
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

         <div className="relative z-10 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-end">
            <div className="space-y-16">
               <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-6">
                  <div className="w-5 h-5 rounded-full bg-tf-primary animate-ping shadow-[0_0_20px_rgba(249,115,22,1)]" />
                  <span className="text-[13px] font-black text-slate-500 uppercase tracking-[0.8em] leading-none italic underline decoration-tf-primary/40 decoration-[6px] underline-offset-[16px]">Mission Sector HUB: {campaign.category?.toUpperCase() || 'HUMANITARIAN_LOGISTICS'}</span>
               </motion.div>
               <motion.h1 
                  initial={{ opacity: 0, y: 50 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.1, duration: 1 }} 
                  className="text-6xl md:text-9xl font-black text-slate-950 tracking-tighter leading-[0.85] italic lowercase text-stroke-white opacity-90 hover:opacity-100 transition-opacity flex flex-col"
               >
                  {campaign.title}
               </motion.h1>
               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="flex flex-wrap items-center gap-16 pl-4 border-l-4 border-tf-primary/10">
                  <div className="space-y-3">
                     <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.6em] italic leading-none">Tactical Deployment Base Hub</p>
                     <p className="text-2xl font-black text-slate-950 italic tracking-tighter lowercase">{campaign.location?.city}, {campaign.location?.country || 'LK_HUB'}</p>
                  </div>
                  <div className="h-14 w-[2px] bg-slate-100 rotate-[25deg] hidden sm:block" />
                  <div className="space-y-3">
                     <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.6em] italic leading-none">Lead Operational Authorized Partner Hub</p>
                     <p className="text-2xl font-black text-slate-950 italic tracking-tighter lowercase">{campaign.ngoId?.organizationName || 'Verified TransFund Network Command HUB'}</p>
                  </div>
               </motion.div>
            </div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 50 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               transition={{ delay: 0.3, duration: 1.2 }} 
               className="bg-white/95 backdrop-blur-4xl border border-white rounded-[5rem] p-20 shadow-5xl space-y-16 relative overflow-hidden group/card hover:shadow-tf-primary/10 transition-all duration-1000"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-tf-primary/10 blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover/card:bg-tf-primary/20 transition-all duration-1000" />
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-tf-accent/5 blur-[80px] -ml-24 -mb-24 pointer-events-none" />
               
               <div className="space-y-10 relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                     <div className="space-y-6">
                        <p className="text-[13px] font-black text-slate-400 uppercase tracking-[0.7em] leading-none italic group-hover/card:text-tf-primary transition-colors duration-700">Strategic_Capital_Registry_HUB SYNC</p>
                        <p className="text-6xl font-black text-slate-950 tracking-tighter tabular-nums leading-none italic group-hover/card:scale-105 transition-transform duration-1000 origin-left">
                           <span className="text-tf-primary text-3xl mr-4 italic group-hover/card:text-slate-950 transition-colors">LKR</span>
                           {(campaign.raisedAmount || 0).toLocaleString()}
                        </p>
                     </div>
                     <div className="text-right flex flex-col items-end gap-3">
                        <div className="flex items-center gap-4">
                           <div className="w-2 h-2 rounded-full bg-tf-primary shadow-[0_0_10px_rgba(255,138,0,0.5)] animate-pulse" />
                           <p className="text-6xl font-black text-tf-primary tracking-tighter leading-none tabular-nums italic group-hover/card:scale-125 transition-transform duration-1000">{pct}%</p>
                        </div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] italic">Current Node Sync Hub</p>
                     </div>
                  </div>
                  <div className="h-5 bg-slate-50 rounded-full overflow-hidden relative shadow-inner border border-slate-100 p-1.5">
                     <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${pct}%` }} 
                        transition={{ duration: 2.5, ease: "circOut", delay: 0.8 }} 
                        className="h-full bg-slate-950 shadow-[0_0_30px_rgba(255,138,0,0.5)] relative overflow-hidden group-hover/card:bg-tf-primary transition-colors duration-1000"
                     >
                        <div className="absolute inset-0 bg-white/30 animate-shimmer" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)', backgroundSize: '150% 100%' }} />
                     </motion.div>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-black text-slate-300 uppercase tracking-[0.6em] italic px-2">
                     <span className="group-hover/card:text-slate-950 transition-colors duration-700">Mission Target Registry: LKR {campaign.goalAmount.toLocaleString()} HUB</span>
                     <span className="text-tf-primary flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-tf-primary rounded-full animate-ping" />
                        {campaign.donationsCount || 0} Authorized Agents Operational HUB
                     </span>
                  </div>
               </div>

               <button 
                  onClick={() => setShowModal(true)}
                  className="w-full py-10 bg-slate-950 text-white rounded-[3rem] text-[15px] font-black uppercase tracking-[0.8em] hover:bg-tf-primary transition-all duration-1000 shadow-5xl hover:shadow-tf-primary/40 active:scale-95 flex items-center justify-center gap-8 group/authorize relative overflow-hidden italic"
               >
                  <span className="relative z-10 transition-transform duration-700 group-hover/authorize:scale-110">Authorize Tactical Support HUB</span>
                  <span className="relative z-10 group-hover/authorize:translate-x-6 transition-all duration-1000 text-3xl">→</span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/authorize:opacity-100 transition-opacity" />
               </button>

               <div className="pt-10 flex flex-wrap items-center justify-center gap-12 border-t border-slate-100 relative z-10">
                  <div className="flex items-center gap-5 group/sec">
                     <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-emerald-500 shadow-xl transition-all duration-1000 group-hover/sec:rotate-[360deg] group-hover/sec:bg-emerald-500 group-hover/sec:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                     </div>
                     <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] italic group-hover/sec:text-slate-950 transition-colors">SHA-512 Secure HUB Sync</span>
                  </div>
                  <div className="h-10 w-[1px] bg-slate-100 rotate-12 hidden md:block" />
                  <div className="flex items-center gap-5 group/intel">
                     <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-tf-primary shadow-xl transition-all duration-1000 group-hover/intel:scale-125 group-hover/intel:bg-tf-primary group-hover/intel:text-white text-base italic font-black">
                        100.0
                     </div>
                     <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] italic group-hover/intel:text-slate-950 transition-colors">Tactical_Transparency HUB</span>
                  </div>
               </div>
            </motion.div>
         </div>
      </section>

      <AnimatePresence>
         {showModal && <DonationModal campaign={campaign} user={user} onClose={() => setShowModal(false)} />}
      </AnimatePresence>

      {/* Mission Execution Strategic Roadmap HUB Deployment */}
      <section className="py-48 max-w-[1400px] mx-auto px-12 grid grid-cols-1 lg:grid-cols-3 gap-32 relative">
         <div className="absolute top-1/2 left-0 w-px h-[500px] bg-gradient-to-b from-transparent via-tf-primary/20 to-transparent pointer-events-none" />
         
         <div className="lg:col-span-2 space-y-28">
            <div className="space-y-12 group/intel">
               <div className="flex items-center gap-8">
                  <div className="w-20 h-1 bg-tf-primary group-hover/intel:w-40 transition-all duration-1000" />
                  <h3 className="text-5xl font-black text-slate-950 tracking-tighter italic lowercase text-stroke-slate-950 opacity-90 group-hover/intel:opacity-100 transition-opacity leading-none">Mission <span className="not-italic text-slate-200">Logistics Hub.</span></h3>
               </div>
               <div className="text-2xl text-slate-500 leading-relaxed space-y-12 font-medium italic pr-12 xl:pr-40 transition-colors duration-1000 group-hover/intel:text-slate-700">
                  <p className="first-letter:text-8xl first-letter:font-black first-letter:text-tf-primary first-letter:mr-6 first-letter:float-left first-letter:leading-none transition-all duration-1000 first-letter:italic">
                    {campaign.description || "Every authorized mission project represents a strategic opportunity for verified positive humanitarian change Hub. Through direct philanthropic supporter mobilization protocol, we target the provision of essential aid and sustainable field infrastructure."}
                  </p>
                  <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="border-l-8 border-tf-primary shadow-5xl pl-16 py-12 bg-slate-50 rounded-r-[4rem] text-xl text-slate-600 group/quote relative overflow-hidden transition-all duration-1000 hover:shadow-tf-primary/20">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-tf-primary/5 blur-[60px] pointer-events-none" />
                    Our institutional commitment to collective absolute transparency ensures that every capital unit reaches its intended mission objective Hub, verified through real-time field intelligence synchronization.
                    <div className="mt-8 flex items-center gap-5">
                       <div className="w-10 h-0.5 bg-tf-primary/30" />
                       <span className="text-[12px] font-black text-tf-primary uppercase tracking-[0.5em]">Command Hub Authorization Hub Protocol</span>
                    </div>
                  </motion.div>
               </div>
            </div>

            {/* Strategic Pillars Group HUB Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 pt-28 border-t-2 border-slate-50 border-dotted">
               {[
                  { t: 'Verified Impact Protocol HUB', d: 'Every authorized capital contribution is tracked through tactical audit registries accessible to verified mission personnel.' },
                  { t: 'Regional Field Coordination', d: 'Collaborating directly with verified regional humanitarian agents for maximum field operational efficiency Hub.' },
                  { t: 'Institutional Governance Hub', d: 'Adhering to global institutional standards for capital safety registries and philanthropic synchronization Hub.' },
                  { t: 'Direct Real-time Intelligence', d: 'Philanthropic Agents receive synchronized updates directly from the point of impact deployment Hub.' }
               ].map((pillar, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    key={pillar.t} 
                    className="space-y-6 group/pillar relative overflow-hidden p-8 rounded-[3rem] hover:bg-slate-50 transition-all duration-700"
                  >
                     <div className="absolute top-0 right-0 w-16 h-16 bg-tf-primary/10 rounded-full blur-2xl opacity-0 group-hover/pillar:opacity-100 transition-opacity" />
                     <p className="text-[14px] font-black text-tf-primary uppercase tracking-[0.6em] italic group-hover/pillar:translate-x-4 transition-transform duration-700 flex items-center gap-4">
                        <span className="w-3 h-3 rounded-full bg-tf-primary/20 group-hover/pillar:bg-tf-primary transition-colors" />
                        {pillar.t}
                     </p>
                     <p className="text-lg text-slate-400 font-medium leading-relaxed italic group-hover/pillar:text-slate-900 transition-colors duration-1000 pl-7">{pillar.d}</p>
                  </motion.div>
               ))}
            </div>
         </div>

         {/* Tactical Mission Sidebar Registry */}
         <div className="space-y-16">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-slate-50 rounded-[4rem] p-16 border border-slate-100 space-y-14 group/time hover:shadow-5xl transition-all duration-1000 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white blur-[80px] -mr-32 -mt-32 pointer-events-none group-hover/time:bg-tf-primary/5 transition-colors duration-1000" />
               <div className="flex items-center gap-5 relative z-10">
                  <div className="w-5 h-5 rounded-full bg-slate-950 border-4 border-white shadow-xl animate-pulse" />
                  <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.7em] italic leading-none group-hover:text-tf-primary transition-colors">Mission_Timeline Sync HUB</h4>
               </div>
               <div className="space-y-12 relative z-10">
                  <div className="flex items-center gap-10 group/item hover:translate-x-4 transition-transform duration-700">
                     <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center text-slate-100 border border-slate-100 italic font-black text-2xl transition-all duration-1000 group-hover/item:bg-slate-950 group-hover/item:text-white group-hover/item:rotate-[25deg] shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-tf-primary/10 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                        IN
                     </div>
                     <div className="space-y-2">
                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.6em] italic leading-none">Initialization Node HUB</p>
                        <p className="text-xl font-black text-slate-950 italic group-hover/item:text-tf-primary transition-colors duration-700">{new Date(campaign.startDate).toLocaleDateString(undefined, {month:'long', day:'numeric', year:'numeric'})}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-10 group/item hover:translate-x-4 transition-transform duration-700">
                     <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center text-slate-100 border border-slate-100 italic font-black text-2xl transition-all duration-1000 group-hover/item:bg-slate-950 group-hover/item:text-white group-hover/item:-rotate-[25deg] shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-tf-primary/10 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                        EX
                     </div>
                     <div className="space-y-2">
                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.6em] italic leading-none">Expected Node Finalization Hub</p>
                        <p className="text-xl font-black text-slate-950 italic group-hover/item:text-tf-primary transition-colors duration-700">{new Date(campaign.endDate).toLocaleDateString(undefined, {month:'long', day:'numeric', year:'numeric'})}</p>
                     </div>
                  </div>
               </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-slate-950 rounded-[4rem] p-16 text-white space-y-12 relative overflow-hidden group/alert hover:shadow-tf-primary/20 transition-all duration-1000 border border-white/5">
               <div className="absolute top-0 right-0 w-80 h-80 bg-tf-primary/10 blur-[100px] -mr-40 -mt-40 pointer-events-none group-hover/alert:opacity-100 transition-opacity opacity-0" />
               <div className="flex items-center gap-5">
                  <div className="w-4 h-4 rounded-full bg-tf-primary animate-pulse shadow-[0_0_15px_rgba(255,138,0,1)]" />
                  <p className="text-[12px] font-black text-white/30 uppercase tracking-[0.6em] italic leading-none group-hover:text-tf-primary transition-colors">Impact Transparency Registry HUB</p>
               </div>
               <p className="text-xl text-white/50 leading-relaxed italic font-medium group-hover/alert:text-white transition-all duration-1000 first-letter:text-4xl first-letter:font-black">
                  Authorized project state: <span className="text-tf-primary font-black uppercase not-italic">Authorized_Field_Deployment</span>. Direct capital intake resources are synchronized on fixed mission authorization cycles based on verified humanitarian field achievement milestones Hub.
               </p>
               <div className="flex items-center gap-6 pt-10 border-t border-white/10 group/live">
                  <div className="w-6 h-6 bg-tf-accent rounded-full animate-ping opacity-60 shadow-[0_0_20px_currentColor]" />
                  <span className="text-[13px] font-black text-tf-accent uppercase tracking-[0.6em] italic leading-none group-hover/live:text-white transition-colors duration-1000">Live_Surveillance_Status: ACTIVE HUB Node</span>
               </div>
            </motion.div>
         </div>
      </section>

      {/* Institutional Impact Matrix Strategic Section HUB Deployment */}
      <section className="py-48 px-8 lg:px-40 bg-slate-950 text-white relative overflow-hidden font-sans border-y-4 border-white/5">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,138,0,0.08),transparent)] pointer-events-none" />
         <div className="absolute bottom-0 right-0 w-[1000px] h-[1000px] bg-tf-primary/5 blur-[250px] -mr-32 -mb-32 pointer-events-none" />
         
         <div className="max-w-[1400px] mx-auto space-y-32 relative z-10">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-16">
               <div className="space-y-10 group/intelheader">
                  <div className="flex items-center gap-6 mb-2">
                     <div className="w-20 h-0.5 bg-tf-primary group-hover/intelheader:w-40 transition-all duration-1000" />
                     <p className="text-[13px] font-black text-tf-primary uppercase tracking-[0.8em] leading-none italic group-hover/intelheader:translate-x-4 transition-transform">Institutional Impact Strategy Matrix Hub</p>
                  </div>
                  <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-none italic lowercase opacity-90 transition-opacity hover:opacity-100 flex flex-col text-stroke-white">
                     Strategic <span className="text-tf-primary not-italic text-stroke-none">Intelligence.</span>
                  </h2>
               </div>
               <div className="max-w-xl space-y-8 relative">
                  <p className="text-white/40 font-medium italic text-2xl border-l-[6px] border-tf-primary/20 pl-12 leading-[1.6] group-hover:text-white/60 transition-colors duration-1000">
                    High-fidelity strategic data points documenting the verified tactical success of our global mission network and regional field agents HUB command center.
                  </p>
                  <div className="flex items-center gap-5 pl-12 text-[11px] font-black text-white/20 uppercase tracking-[0.5em] italic">NODE_SYNC_AUTHORIZED v2.1 Registry</div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-16">
               {[
                  { label: 'Authorized Field Personnel Reached HUB', value: '1,200+', detail: 'Verified families and regional cohorts in direct mission coordination HUB.', icon: '👥' },
                  { label: 'Mission Integrity Protocol Hub', value: '100%', detail: 'Total capital audit trail synchronization for all authorized capital intake nodes.', icon: '🛡️' },
                  { label: 'Tactical Deployment Velocity', value: '48h', detail: 'Authorized tactical deployment cycle for critical resource allocation Hub.', icon: '⚡' }
               ].map((stat, i) => (
                  <motion.div 
                     key={stat.label}
                     initial={{ opacity: 0, y: 50, scale: 0.95 }}
                     whileInView={{ opacity: 1, y: 0, scale: 1 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.2, duration: 1 }}
                     className="bg-white/[0.02] border border-white/5 rounded-[5rem] p-16 space-y-12 flex flex-col justify-between group/intelcard hover:bg-white/[0.08] hover:border-tf-primary/40 transition-all duration-1000 shadow-5xl relative overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 w-64 h-64 bg-tf-primary/10 blur-[100px] opacity-0 group-hover/intelcard:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                     <div className="space-y-10 relative z-10">
                        <div className="flex justify-between items-center">
                           <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.6em] italic group-hover/intelcard:text-tf-primary transition-colors duration-700">{stat.label}</p>
                           <span className="text-4xl opacity-20 group-hover/intelcard:opacity-100 group-hover/intelcard:scale-150 group-hover/intelcard:rotate-[360deg] transition-all duration-[1500ms]">{stat.icon}</span>
                        </div>
                        <h4 className="text-8xl font-black text-tf-primary tracking-tighter italic tabular-nums leading-none transition-all duration-1000 group-hover/intelcard:scale-110 origin-left lowercase">{stat.value}</h4>
                     </div>
                     <p className="text-xl text-white/30 font-medium italic leading-relaxed group-hover/intelcard:text-white/80 transition-all duration-1000 relative z-10 pl-4 border-l-2 border-white/5">{stat.detail}</p>
                  </motion.div>
               ))}
            </div>

            <div className="pt-32 border-t border-white/10 flex flex-col xl:flex-row items-center justify-between gap-20 relative">
               <div className="absolute top-0 left-0 w-64 h-2 bg-tf-primary/30 rounded-full" />
               <div className="space-y-10 max-w-4xl text-center xl:text-left group/protocol">
                  <p className="text-3xl lg:text-4xl text-white/50 leading-[1.4] italic font-medium group-hover/protocol:text-white transition-all duration-1000">
                    Every capital unit contributed to this mission node is synchronized through our <span className="text-white font-black underline underline-offset-[20px] decoration-tf-primary decoration-[10px] group-hover/protocol:text-tf-primary transition-colors">Impact Velocity Protocol Hub</span>, ensuring zero-latency node deployment to regionally authorized field agents.
                  </p>
                  <p className="text-[12px] font-black text-white/10 uppercase tracking-[0.8em] italic">Institutional Authorized Command Center Registry Synchronization Active Hub</p>
               </div>
               <div className="flex items-center gap-12 group/finalbadge">
                  <div className="text-right space-y-4">
                     <p className="text-[12px] font-black text-white/20 uppercase tracking-[0.7em] italic leading-none group-hover/finalbadge:text-tf-primary transition-colors">Institutional Strategic Standard HUB</p>
                     <p className="text-xl font-black text-tf-accent uppercase tracking-[0.4em] italic leading-none group-hover/finalbadge:text-white transition-colors duration-1000">Transfund_Integrity_Registry Hub Node v2.1</p>
                  </div>
                  <div className="w-28 h-28 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/10 group-hover/finalbadge:rotate-[720deg] transition-all duration-[2500ms] shadow-5xl group-hover/finalbadge:bg-tf-primary group-hover/finalbadge:border-tf-primary group-hover/finalbadge:scale-125 relative overflow-hidden">
                     <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/finalbadge:opacity-100 transition-opacity" />
                     <svg className="w-14 h-14 text-tf-primary group-hover/finalbadge:text-white transition-colors relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 7l11 5 11-5-11-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Terminal Call to Global Mission Section HUB Deployment */}
      <section className="py-56 bg-white relative overflow-hidden group/cta">
         <div className="absolute top-0 left-0 w-96 h-96 bg-slate-50 blur-[150px] pointer-events-none group-hover/cta:bg-tf-primary/5 transition-colors duration-1000" />
         <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-tf-primary/3 blur-[180px] pointer-events-none" />
         
         <div className="max-w-[1200px] mx-auto px-12 text-center space-y-24 relative z-10 font-sans">
            <div className="space-y-12">
                <div className="flex items-center justify-center gap-8 mb-6">
                  <div className="w-24 h-1 bg-slate-100 group-hover/cta:w-48 transition-all duration-1000" />
                  <p className="text-[13px] font-black text-tf-primary uppercase tracking-[0.8em] italic leading-none group-hover/cta:scale-110 transition-transform">Final_Registry_Commitment_Call Protocol HUB</p>
                  <div className="w-24 h-1 bg-slate-100 group-hover/cta:w-48 transition-all duration-1000" />
                </div>
                <h3 className="text-6xl md:text-9xl font-black text-slate-950 tracking-tighter uppercase italic leading-[0.85] lowercase group-hover/cta:scale-105 transition-all duration-1000">Ready To <span className="text-slate-200">Activate?</span></h3>
            </div>
            <p className="text-slate-400 max-w-4xl mx-auto text-3xl leading-[1.6] italic font-medium group-hover/cta:text-slate-600 transition-colors duration-1000 px-12">Join an elite institutional-grade network of global philanthropic agents dedicated to verified field impact synchronization and community transformation HUB.</p>
            
            <div className="pt-20 flex flex-col xl:flex-row items-center justify-center gap-12">
               <button onClick={() => setShowModal(true)} className="px-20 py-10 bg-slate-950 text-white rounded-full text-[15px] font-black uppercase tracking-[0.7em] transition-all duration-1000 shadow-5xl hover:bg-tf-primary active:scale-90 italic hover:shadow-tf-primary/40 min-w-[450px] relative overflow-hidden group/finalbtn">
                  <span className="relative z-10">Connect Support Protocol HUB Node</span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/finalbtn:opacity-100 transition-opacity" />
               </button>
               <Link to="/causes" className="text-slate-300 hover:text-slate-950 text-[13px] font-black uppercase tracking-[0.8em] transition-all border-b-4 border-transparent hover:border-tf-primary py-4 italic font-sans hover:translate-x-4 duration-1000">Return to Active Matrix Registry HUB Index Index →</Link>
            </div>
            
            <div className="pt-12 flex justify-center items-center gap-6">
               <div className="w-2 h-2 rounded-full bg-slate-100" />
               <div className="w-2 h-2 rounded-full bg-slate-200" />
               <div className="w-3 h-3 rounded-full bg-tf-primary animate-pulse" />
               <div className="w-2 h-2 rounded-full bg-slate-200" />
               <div className="w-2 h-2 rounded-full bg-slate-100" />
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

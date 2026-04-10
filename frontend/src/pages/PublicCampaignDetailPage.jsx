import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import {
   FiHeart, FiMapPin, FiShield, FiArrowRight, FiCheckCircle, FiInfo, FiClock,
   FiActivity, FiGlobe, FiTarget, FiDollarSign, FiUsers, FiMail, FiTrendingUp,
   FiX, FiCalendar, FiRepeat, FiZap, FiAward, FiPieChart, FiExternalLink
} from 'react-icons/fi';

function DonationModal({ campaign, user, onClose, defaultType = 'one-time' }) {
   const [type, setType] = useState(defaultType);
   const [amount, setAmount] = useState('1000');
   const [customAmount, setCustomAmount] = useState('');
   const [frequency, setFrequency] = useState('monthly');
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

   const handlePayment = async (e) => {
      e.preventDefault();
      if (!user || !user._id) {
         alert('Please log in to continue with your support.');
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
            address: donorDetails.address || 'Colombo',
            city: donorDetails.city || 'Colombo',
            country: donorDetails.country || 'Sri Lanka',
            type: type,
            frequency: type === 'pledge' ? frequency : null
         };

         const { data } = await api.post('/api/finance/payhere/init', payload);
         if (data.success && data.paymentData) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = data.checkoutUrl || 'https://sandbox.payhere.lk/pay/checkout';
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
         const msg = err.response?.data?.message || err.message;
         alert(`Payment initialization failed: ${msg}`);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="fixed inset-0 z-[1000] overflow-y-auto bg-slate-950/40 backdrop-blur-3xl flex items-center justify-center p-4">
         <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-5xl overflow-hidden flex flex-col md:flex-row border border-slate-100"
         >
            {/* Left Panel */}
            <div className="w-full md:w-[35%] bg-slate-900 p-12 text-white relative flex flex-col justify-between overflow-hidden">
               <div className="relative z-10 space-y-12">
                  <button onClick={onClose} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all">
                     <FiX className="text-white/40" size={16} />
                  </button>
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-tf-primary ">Donation</p>
                        <h3 className="text-4xl font-extrabold  tracking-tighter leading-none">
                           {type === 'one-time' ? 'One-time Gift' : 'Impact Pledge'}
                        </h3>
                     </div>
                     <p className="text-base text-white/40 font-medium leading-relaxed ">
                        {type === 'one-time'
                           ? 'Support this cause directly with a one-time cash donation.'
                           : 'Commit to supporting this cause with a recurring monthly pledge.'}
                     </p>
                  </div>
                  <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-3">
                     <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">You are supporting</p>
                     <p className="text-lg font-extrabold leading-tight  line-clamp-3">{campaign.title}</p>
                  </div>
               </div>
               <div className="relative z-10 pt-10 border-t border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-tf-primary text-xl"><FiShield /></div>
                  <div className="space-y-0.5">
                     <p className="text-[9px] font-extrabold text-white/30 uppercase tracking-widest leading-none">100% Secure & Verified</p>
                     <p className="text-[11px] font-extrabold text-white uppercase tracking-widest">Protected by TransFund</p>
                  </div>
               </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 p-12 md:p-14 space-y-10 max-h-[90vh] overflow-y-auto text-left">
               {/* Type Tabs removed to enforce exclusive mode based on campaign config */}

               {/* Amount */}
               <div className="space-y-6">
                  <div>
                     <h4 className="text-xl font-extrabold text-slate-950  tracking-tight uppercase">Donation Amount</h4>
                     <p className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest mt-1">Select an amount in LKR</p>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                     {(type === 'pledge' ? (campaign.pledgeConfig?.suggestedAmounts?.length ? campaign.pledgeConfig.suggestedAmounts : ['500', '1000', '2500', '5000']) : ['1000', '5000', '10000', '25000']).map((val) => (
                        <button
                           key={val} onClick={() => setAmount(val)}
                           className={`h-14 rounded-2xl text-[11px] font-extrabold uppercase tracking-widest transition-all border-2 ${amount === val ? 'bg-slate-950 text-white border-slate-950 shadow-xl' : 'bg-slate-50 text-slate-400 border-transparent hover:border-tf-primary/30 hover:bg-white hover:text-slate-950'}`}
                        >
                           {parseFloat(val).toLocaleString()}
                        </button>
                     ))}
                     <button
                        onClick={() => setAmount('custom')}
                        className={`h-14 rounded-2xl text-[11px] font-extrabold uppercase tracking-widest transition-all border-2 ${amount === 'custom' ? 'bg-slate-950 text-white border-slate-950 shadow-xl' : 'bg-slate-50 text-slate-400 border-transparent'}`}
                     >
                        Custom
                     </button>
                  </div>
                  {amount === 'custom' && (
                     <input
                        type="number" placeholder="Enter amount (Min LKR 100)"
                        value={customAmount} onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full bg-slate-50 border-b-2 border-transparent border-b-slate-100 rounded-2xl px-7 py-5 text-lg font-extrabold text-slate-950 focus:outline-none focus:border-tf-primary"
                     />
                  )}
               </div>

               {/* Frequency Info */}
               {type === 'pledge' && (
                  <div className="p-8 bg-tf-primary/5 border border-tf-primary/10 rounded-[2rem] space-y-4">
                     <p className="text-[10px] font-extrabold text-tf-primary uppercase tracking-[0.2em]  flex items-center gap-2"><FiCalendar /> Frequency</p>
                     <div className="flex gap-3">
                        {(campaign.pledgeConfig?.frequencies || ['monthly']).map(f => (
                           <button
                              key={f} onClick={() => setFrequency(f)}
                              className={`px-7 py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all ${frequency === f ? 'bg-tf-primary text-white shadow-lg' : 'bg-white text-tf-primary border border-tf-primary/10 hover:bg-tf-primary/5'}`}
                           >
                              {f}
                           </button>
                        ))}
                     </div>
                     <p className="text-[9px] text-tf-primary/60 font-bold  leading-relaxed uppercase">Monthly pledges are commitment-based. You will be notified by email for each payment.</p>
                  </div>
               )}

               {/* Donor Info */}
               <div className="space-y-8">
                  <h4 className="text-xl font-extrabold text-slate-950  tracking-tight uppercase border-b border-slate-50 pb-4">Donor Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                        <input
                           value={donorDetails.firstName} onChange={(e) => setDonorDetails({ ...donorDetails, firstName: e.target.value })}
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold" placeholder="First Name"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                        <input
                           value={donorDetails.lastName} onChange={(e) => setDonorDetails({ ...donorDetails, lastName: e.target.value })}
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold" placeholder="Last Name"
                        />
                     </div>
                     <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input
                           value={donorDetails.email} onChange={(e) => setDonorDetails({ ...donorDetails, email: e.target.value })}
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold" placeholder="your@email.com"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <input
                           value={donorDetails.phone} onChange={(e) => setDonorDetails({ ...donorDetails, phone: e.target.value })}
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold" placeholder="07XXXXXXXX"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">City</label>
                        <input
                           value={donorDetails.city} onChange={(e) => setDonorDetails({ ...donorDetails, city: e.target.value })}
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold" placeholder="City"
                        />
                     </div>
                  </div>
               </div>

               <div className="pt-8 flex flex-col gap-5">
                  <button
                     onClick={handlePayment}
                     disabled={!isValid || loading}
                     className="w-full py-6 bg-slate-950 text-white rounded-[2rem] text-[11px] font-extrabold uppercase tracking-[0.4em] hover:bg-tf-primary transition-all duration-500 shadow-xl active:scale-95  flex items-center justify-center gap-3"
                  >
                     {loading ? 'Processing...' : `Donate LKR ${finalAmount.toLocaleString()} →`}
                  </button>
                  <div className="flex items-center justify-center gap-4 text-slate-300">
                     <FiCheckCircle size={14} className="text-emerald-400" />
                     <p className="text-[10px] font-extrabold uppercase tracking-widest  leading-none">Your transaction is secure and private</p>
                  </div>
               </div>
            </div>
         </motion.div>
      </div>
   );
}

export default function PublicCampaignDetailPage() {
   const { id } = useParams();
   const navigate = useNavigate();
   const { user } = useAuth();
   const [campaign, setCampaign] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');
   const [showModal, setShowModal] = useState(false);
   const [modalType, setModalType] = useState('one-time');
   const [partners, setPartners] = useState([]);
   const [partnerImpactValue, setPartnerImpactValue] = useState(0);

   useEffect(() => {
      const fetchCampaign = async () => {
         try {
            const { data } = await api.get(`/api/campaigns/${id}`);
            setCampaign(data);

            const partnerRes = await api.get(`/api/public/campaign-partners/${id}`);
            if (partnerRes.data) {
               setPartners(partnerRes.data.partners || []);
               setPartnerImpactValue(partnerRes.data.totalPledged || 0);
            }
         } catch (err) {
            setError('Cause information unavailable.');
         } finally {
            setLoading(false);
         }
      };
      fetchCampaign();
   }, [id]);

   if (loading) return <LoadingSpinner message="Searching for cause..." />;
   if (error || !campaign) return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center space-y-8">
         <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 text-5xl font-extrabold  shadow-inner">!</div>
         <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-slate-950  uppercase tracking-tight">Information Missing</h2>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.4em]  leading-none">{error || 'Cause not found'}</p>
         </div>
         <button onClick={() => navigate('/causes')} className="px-10 py-5 bg-slate-900 text-white rounded-full text-[10px] font-extrabold uppercase tracking-widest hover:bg-tf-primary shadow-xl ">Back to Causes</button>
      </div>
   );

   const pct = Math.min(100, Math.round(((campaign.raisedAmount || 0) / campaign.goalAmount) * 100));

   return (
      <div className="min-h-screen bg-white font-sans selection:bg-tf-primary selection:text-white pb-0 overflow-x-hidden pt-12">
         <PublicNavbar />

         {/* Header Section */}
         <section className="relative pt-48 pb-32 px-8 overflow-hidden group/hero">
            <div className="absolute inset-0 z-0">
               <img
                  src={campaign.image ? (campaign.image.startsWith('http') ? campaign.image : (campaign.image.startsWith('/') ? campaign.image : `/${campaign.image}`)) : "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1600"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[5s] brightness-[0.4]"
                  alt={campaign.title}
               />
               <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
               <div className="flex-1 text-left space-y-10">
                  <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-3 px-5 py-2 bg-slate-950 text-white rounded-full text-[11px] font-extrabold  uppercase tracking-[0.2em] shadow-xl border border-white/5">
                     <FiAward className="text-tf-primary" size={14} /> Category: {campaign.category || 'Humanitarian'}
                  </motion.div>
                  <div className="space-y-6">
                     <motion.h1
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                        className="text-7xl md:text-8xl lg:text-9xl font-extrabold text-slate-950 tracking-tighter leading-[0.8]  lowercase"
                     >
                        {campaign.title}
                     </motion.h1>
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap items-center gap-10 pt-10 border-t border-slate-100">
                        <div className="space-y-1">
                           <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest  leading-none mb-1">Impact Location</p>
                           <p className="text-2xl font-extrabold text-slate-950 tracking-tight  flex items-center gap-2">
                              <FiMapPin className="text-tf-primary" /> 
                              {campaign.location?.city ? `${campaign.location.city}, ` : ''}
                              {campaign.location?.state ? `${campaign.location.state}, ` : ''}
                              {campaign.location?.country || 'Sri Lanka'}
                           </p>
                        </div>
                        <div className="w-px h-12 bg-slate-100 hidden md:block" />
                        <div className="space-y-1">
                           <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest  leading-none mb-1">Managed By</p>
                           <p className="text-2xl font-extrabold text-slate-950 tracking-tight  flex items-center gap-2">
                              <FiGlobe className="text-tf-primary" /> {campaign.createdBy?.organizationName || 'Verified TransFund Partner'}
                           </p>
                        </div>
                     </motion.div>
                  </div>
               </div>

               <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.5, duration: 0.7 }}
                  className="w-full lg:w-[480px] bg-white rounded-[3.5rem] p-16 shadow-5xl border border-slate-50 space-y-12 text-left relative overflow-hidden"
               >
                  <div className="space-y-10 relative z-10">
                     <div className="flex items-end justify-between">
                        <div className="space-y-2">
                           <p className="text-[11px] font-extrabold text-tf-primary uppercase tracking-[0.4em]  leading-none">Raised So Far</p>
                           <div className="flex items-baseline gap-2">
                              <span className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter ">LKR {(campaign.raisedAmount || 0).toLocaleString()}</span>
                           </div>
                        </div>
                        <div className="bg-slate-950 text-white px-7 py-3.5 rounded-2xl shadow-xl">
                           <p className="text-2xl font-extrabold text-tf-primary tracking-tighter leading-none ">{pct}%</p>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="flex items-center justify-between text-[13px] font-extrabold text-slate-900 uppercase tracking-widest ">
                           <span>Funded Progress</span>
                           <span className="text-tf-primary">{campaign.donationsCount || 0} Backers</span>
                        </div>
                        <div className="h-4 bg-slate-50 border border-slate-100 rounded-full overflow-hidden p-[1px]">
                           <motion.div
                              initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 2, ease: "easeOut" }}
                              className="h-full bg-slate-950 rounded-full relative"
                           >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full animate-shimmer" />
                           </motion.div>
                        </div>
                        <p className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest text-right  leading-none">Goal: LKR {campaign.goalAmount.toLocaleString()}</p>
                     </div>

                     <div className="grid grid-cols-1 gap-4">
                        {campaign.allowPledges ? (
                           <button
                              onClick={() => { setModalType('pledge'); setShowModal(true); }}
                              className="w-full py-6 bg-slate-950 text-white rounded-2xl text-[11px] font-extrabold uppercase tracking-[0.4em] hover:bg-tf-primary transition-all shadow-xl active:scale-95  flex items-center justify-center gap-3"
                           >
                              Monthly Pledge <FiRepeat size={14} className="text-tf-primary" />
                           </button>
                        ) : (
                           <button
                              onClick={() => { setModalType('one-time'); setShowModal(true); }}
                              className="w-full py-6 bg-slate-950 text-white rounded-2xl text-[11px] font-extrabold uppercase tracking-[0.4em] hover:bg-tf-primary transition-all shadow-xl active:scale-95  flex items-center justify-center gap-3"
                           >
                              Donate <FiZap size={14} className="text-tf-primary animate-pulse" />
                           </button>
                        )}
                     </div>

                     <div className="pt-6 border-t border-slate-50 flex items-center justify-center gap-8 text-slate-400">
                        <FiShield className="text-tf-primary" size={14} />
                        <span className="text-[10px] font-extrabold uppercase tracking-widest  leading-none">Verified Transparency</span>
                     </div>
                  </div>
               </motion.div>
            </div>
         </section>

         <AnimatePresence>
            {showModal && <DonationModal campaign={campaign} user={user} onClose={() => setShowModal(false)} defaultType={modalType} />}
         </AnimatePresence>

         {/* Main Content Section */}
         <section className="py-32 max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-8 space-y-24 text-left">
               {/* Context */}
               <div className="space-y-12">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-0.5 bg-tf-primary rounded-full shadow-lg" />
                     <h3 className="text-3xl font-extrabold text-slate-900  uppercase tracking-tight">Our Mission</h3>
                  </div>
                  <div className="text-2xl text-slate-600 leading-relaxed font-medium  pr-0 md:pr-16 lg:pr-24 space-y-10">
                     <p className="first-letter:text-8xl first-letter:font-extrabold first-letter:text-tf-primary first-letter:float-left first-letter:mr-5 first-letter:leading-[0.8] first-letter:mt-2">
                        {campaign.description}
                     </p>
                     {campaign.createdBy?.mission && <p className="opacity-80">{campaign.createdBy.mission}</p>}
                  </div>
               </div>

               {/* Impact Cards */}
               <div className="space-y-12">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-0.5 bg-tf-primary rounded-full shadow-lg" />
                     <h3 className="text-3xl font-extrabold text-slate-900  uppercase tracking-tight">Project Impact</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {[
                        { icon: <FiActivity />, val: campaign.impactPercentage > 0 ? `${campaign.impactPercentage}%` : 'TBD', t: 'Efficiency', d: 'Ratio of donation reaching final destinations in the field.' },
                        { icon: <FiUsers />, val: (campaign.targetBeneficiaries || 0) > 0 ? (campaign.targetBeneficiaries).toLocaleString() : 'Audit Pending', t: 'People Served', d: 'Total number of individuals this project aims to support.' },
                        { icon: <FiAward />, val: `Goal ${campaign.sdgAlignment?.[0] || 'Verification'}`, t: 'SDG Goal', d: 'Direct alignment with Sustainable Development Goals.' },
                        { icon: <FiPieChart />, val: (campaign.costPerBeneficiary || 0) > 0 ? `LKR ${(campaign.costPerBeneficiary).toLocaleString()}` : 'Calculating', t: 'Cost Per Unit', d: 'Average cost required to assist one individual.' },
                        ...(partnerImpactValue > 0 ? [{ 
                           icon: <FiShield className="text-tf-primary" />, 
                           val: `LKR ${partnerImpactValue.toLocaleString()}`, 
                           t: 'Strategic Commitment', 
                           d: 'Cumulative mission capital pledged by verified institutional partners Hub.' 
                        }] : [])
                     ].map((item, i) => (
                        <motion.div
                           initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                           key={i} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 hover:border-tf-primary/30 transition-all group"
                        >
                           <div className="w-14 h-14 bg-white text-slate-950 rounded-2xl flex items-center justify-center text-xl shadow-lg mb-8 group-hover:bg-slate-950 group-hover:text-white transition-all duration-500">{item.icon}</div>
                           <div className="space-y-2">
                              <p className="text-3xl font-extrabold  tracking-tighter text-slate-950">{item.val}</p>
                              <h4 className="text-[11px] font-extrabold text-tf-primary  uppercase tracking-[0.2em] mb-1">{item.t}</h4>
                              <p className="text-sm font-medium text-slate-400 ">{item.d}</p>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </div>

               {/* Mission Partners Section */}
               {partners.length > 0 && (
                  <div className="space-y-12">
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-0.5 bg-tf-primary rounded-full shadow-lg" />
                        <h3 className="text-3xl font-extrabold text-slate-900  uppercase tracking-tight">Strategic Partners</h3>
                     </div>
                     
                     <div className="space-y-6">
                        <p className="text-base font-medium text-slate-500  max-w-2xl leading-relaxed">
                           These verified institutional partners have committed strategic capital and operational support to this mission. Their participation ensures higher accountability and field-level impact.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {partners.map((p) => (
                              <Link 
                                 to={`/partners/${p._id}`}
                                 key={p._id} 
                                 className="flex items-center gap-6 p-8 bg-slate-50 border border-slate-100 rounded-[3rem] hover:border-tf-primary/40 hover:bg-white hover:shadow-2xl transition-all group"
                              >
                                 <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center border border-slate-100 group-hover:bg-slate-900 transition-all duration-500 shrink-0 shadow-sm">
                                    <FiShield className="text-3xl text-tf-primary group-hover:text-tf-primary" />
                                 </div>
                                 <div className="text-left overflow-hidden space-y-1.5">
                                    <h5 className="text-2xl font-extrabold text-slate-900 tracking-tighter  group-hover:text-tf-primary transition-colors truncate leading-none">{p.organizationName}</h5>
                                    <div className="flex items-center gap-3">
                                       <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-extrabold uppercase rounded-lg border border-emerald-100 ">Trust Hub {p.trustScore}%</span>
                                       <span className="text-[10px] font-extrabold text-slate-300 uppercase tracking-[0.2em] truncate">
                                          {p.csrFocus?.[0] ? p.csrFocus[0].replace(/_/g, ' ') : 'Strategic Aid'}
                                       </span>
                                    </div>
                                 </div>
                                 <div className="ml-auto w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-200 group-hover:border-tf-primary group-hover:text-tf-primary group-hover:translate-x-1 transition-all shadow-sm">
                                    <FiArrowRight />
                                 </div>
                              </Link>
                           ))}
                        </div>
                     </div>
                  </div>
               )}
            </div>

            {/* Sidebar Stats */}
            <aside className="lg:col-span-4 space-y-8">
               <div className="bg-slate-950 rounded-[3.5rem] p-12 text-white space-y-12 relative overflow-hidden shadow-5xl border border-white/5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-tf-primary/10 rounded-full blur-[80px] -mr-16 -mt-16" />
                  <div className="relative z-10 space-y-10 text-left">
                     <div className="space-y-2">
                        <p className="text-[10px] font-extrabold text-tf-primary uppercase tracking-[0.4em]  leading-none">Mission Info</p>
                        <h4 className="text-3xl font-extrabold  tracking-tighter">Current Status</h4>
                     </div>

                     <div className="space-y-8">
                        {[
                           { icon: <FiUsers />, val: `${campaign.donationsCount || 0} Donors`, label: 'Support Group', color: 'text-tf-primary' },
                           { icon: <FiTrendingUp />, val: 'Active Cause', label: 'Status', color: 'text-emerald-400' },
                           { icon: <FiClock />, val: new Date(campaign.endDate).toLocaleDateString(), label: 'Completion Date', color: 'text-tf-primary' },
                           { icon: <FiTarget />, val: 'Direct Aid', label: 'Method', color: 'text-white' }
                        ].map((stat, i) => (
                           <div key={i} className="flex items-center gap-6">
                              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-xl shadow-inner"><div className={stat.color}>{stat.icon}</div></div>
                              <div className="space-y-0.5">
                                 <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                 <p className={`text-xl font-extrabold tracking-tight  ${stat.color}`}>{stat.val}</p>
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className="pt-8 border-t border-white/5 flex items-center gap-4 group cursor-pointer" onClick={() => { setModalType('one-time'); setShowModal(true); }}>
                        <div className="w-2 h-2 rounded-full bg-tf-primary animate-pulse" />
                        <span className="text-[10px] font-extrabold text-tf-primary uppercase tracking-[0.2em] group-hover:text-white transition-colors ">Donate to this cause now →</span>
                     </div>
                  </div>
               </div>

               <div className="bg-slate-50 rounded-[3.5rem] p-10 border border-slate-100 flex flex-col items-center text-center space-y-6 group transition-all hover:shadow-2xl">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-tf-primary text-xl shadow-xl"><FiShield /></div>
                  <div className="space-y-2">
                     <h4 className="text-sm font-extrabold text-slate-950  uppercase tracking-[0.2rem]">Transparent Giving</h4>
                     <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight ">We use direct reporting tools to ensure every donation is spent exactly where it is needed.</p>
                  </div>
                  <Link to="/transparency" className="text-[10px] font-extrabold text-tf-primary uppercase tracking-widest hover:text-slate-950 transition-colors  flex items-center gap-2">View Audit Reports <FiExternalLink size={10} /></Link>
               </div>
            </aside>
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
      `}</style>
      </div>
   );
}

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminDonor } from '../../context/AdminDonorContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMail, FiPhone, FiMapPin, FiCalendar, FiClock, 
  FiCheckCircle, FiEdit3, FiTrash2, FiArrowLeft,
  FiActivity, FiTarget, FiBriefcase, FiZap, FiInfo, FiRefreshCw, FiDollarSign,
  FiAlertTriangle
} from 'react-icons/fi';

const INTERACTION_TYPES = ['email', 'call', 'meeting', 'event', 'other'];

const pledgeStatusBadge = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm',
  pending: 'bg-amber-50 text-amber-600 border-amber-100 shadow-sm',
  fulfilled: 'bg-tf-primary/10 text-tf-primary border-tf-primary/20',
  cancelled: 'bg-rose-50 text-rose-600 border-rose-100 shadow-sm',
};

function Section({ title, children, actions, description }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="bg-white rounded-[2rem] border border-slate-100 p-10 shadow-sm space-y-8 group hover:shadow-xl transition-all duration-700 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-tf-primary/5 blur-3xl -mr-32 -mt-32 pointer-events-none group-hover:opacity-100 transition-opacity opacity-0" />
      <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-6">
         <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">{title}</h3>
            {description && <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest leading-none">{description}</p>}
         </div>
         <div className="shrink-0">{actions}</div>
      </div>
      <div className="relative z-10">
         {children}
      </div>
    </motion.div>
  );
}

export default function AdminDonorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    loading, error, setError,
    fetchDonorById, updateDonor, deleteDonor,
    fetchDonorPledges,
    addInteraction, deleteInteraction,
    fetchDonorAnalytics, recalculateAnalytics,
  } = useAdminDonor();

  const [donor, setDonor] = useState(null);
  const [pledges, setPledges] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [interactionForm, setInteractionForm] = useState({ type: 'email', notes: '', date: new Date().toISOString().split('T')[0] });
  const [showInteractionForm, setShowInteractionForm] = useState(false);

  const load = useCallback(async () => {
    try {
      const d = await fetchDonorById(id);
      setDonor(d);
      setForm({
        phone: d.phone || '',
        bio: d.bio || '',
        preferredCauses: d.preferredCauses?.join(', ') || '',
        address: {
          street: d.address?.street || '',
          city: d.address?.city || '',
          country: d.address?.country || '',
          postalCode: d.address?.postalCode || '',
        },
      });
      fetchDonorPledges(id).then((p) => setPledges(p || [])).catch(() => {});
      fetchDonorAnalytics(id).then((a) => setAnalytics(a)).catch(() => {});
    } catch {
      // Error handled by fetchDonorById context
    }
  }, [id, fetchDonorById, fetchDonorPledges, fetchDonorAnalytics]);

  useEffect(() => { load(); }, [load]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccess('');
    try {
      const payload = {
        ...form,
        preferredCauses: form.preferredCauses.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const updated = await updateDonor(id, payload);
      setDonor(updated);
      setEditing(false);
      setSuccess('Donor information updated successfully Hub.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to update donor information.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDonor(id);
      navigate('/admin/donors');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to delete donor record.');
      setConfirmDelete(false);
    }
  };

  const handleAddInteraction = async (e) => {
    e.preventDefault();
    setLocalError('');
    try {
      const updated = await addInteraction(id, interactionForm);
      setDonor(updated);
      setShowInteractionForm(false);
      setInteractionForm({ type: 'email', notes: '', date: new Date().toISOString().split('T')[0] });
      setSuccess('Engagement message log added Hub.');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to log engagement message.');
    }
  };

  const handleDeleteInteraction = async (interactionId) => {
    setLocalError('');
    try {
      await deleteInteraction(id, interactionId);
      setDonor((prev) => ({
        ...prev,
        interactions: prev.interactions.filter((i) => i._id !== interactionId),
      }));
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to remove log.');
    }
  };

  const handleRecalculate = async () => {
    try {
      const updated = await recalculateAnalytics(id);
      setAnalytics(updated);
      setSuccess('Donation data refreshed Hub.');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to refresh donation data.');
    }
  };

  const inputCls = 'w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 placeholder-slate-200 focus:outline-none focus:border-tf-primary focus:bg-white transition-all shadow-inner italic';

  if (loading && !donor) return <LoadingSpinner message="Loading profile..." />;
  if (!donor && !loading) return (
    <div className="text-center py-40 space-y-8 max-w-lg mx-auto font-sans pt-8 text-left">
       <div className="w-20 h-20 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center mx-auto text-slate-100">
          <FiInfo size={40} />
       </div>
       <div className="space-y-4 text-center">
         <h3 className="text-2xl font-black text-slate-900 tracking-tight">Donor record not found</h3>
         <p className="text-sm text-slate-400 font-bold uppercase tracking-widest leading-none">Record missing or unavailable Hub</p>
         <button onClick={() => navigate('/admin/donors')} className="px-8 py-4 bg-slate-950 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-tf-primary transition-all shadow-xl active:scale-95 italic mt-6">Return to Donor List</button>
       </div>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 pb-40 font-sans selection:bg-tf-primary selection:text-white pt-8">
      
      {/* Simplified Donor Profile Header */}
      <section className="bg-slate-900 rounded-[2.5rem] p-12 md:p-16 text-white relative overflow-hidden shadow-2xl group flex flex-col md:flex-row gap-10 items-center text-left">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-tf-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative z-10 w-full space-y-10">
           <button onClick={() => navigate('/admin/donors')} className="flex items-center gap-3 text-[10px] font-black text-white/30 uppercase tracking-widest hover:text-tf-primary transition-all group/back italic">
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to All Donors Hub
           </button>
           
           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
              <div className="space-y-4 flex-1">
                 <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-tf-primary shadow-[0_0_10px_#ff8a00] animate-pulse" />
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic decoration-tf-primary/30 decoration-2 underline underline-offset-[8px]">Donor Member Profile HUB</p>
                 </div>
                 <h2 className="text-3xl lg:text-6xl font-black tracking-tight leading-tight italic">
                    {donor?.userId?.name || 'Authorized Member'}
                 </h2>
                 <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl italic">{donor?.userId?.email}</p>
              </div>
              
              <div className="flex gap-4 relative z-10">
                 {!editing ? (
                    <button onClick={() => setEditing(true)} className="px-8 py-4 bg-tf-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-tf-primary/20 active:scale-95 flex items-center gap-2">
                       <FiEdit3 /> Edit Profile
                    </button>
                 ) : (
                    <button onClick={() => setEditing(false)} className="px-8 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all active:scale-95">
                       Cancel Edit
                    </button>
                 )}
                 <button onClick={() => setConfirmDelete(true)} className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all active:scale-95">
                    <FiTrash2 />
                 </button>
              </div>
           </div>
        </div>
      </section>

      {(localError || error) && <div className="px-8"><ErrorAlert message={localError || error} /></div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">
        
        {/* Left Column: Data & Analytics */}
        <div className="lg:col-span-8 space-y-10">
           
           {/* Giving Overview */}
           <Section title="Giving Overview" description="Member's total life-time contributions Hub" actions={
              <button onClick={handleRecalculate} className="p-3 bg-slate-50 text-slate-400 hover:text-tf-primary rounded-xl transition-all border border-slate-100" title="Refresh Data">
                 <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              </button>
           }>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 {[
                   { label: 'Total Contributions', value: `LKR ${(analytics?.totalDonated || 0).toLocaleString()}`, icon: <FiDollarSign />, color: 'bg-tf-primary' },
                   { label: 'Successful Gifts', value: analytics?.donationCount || 0, icon: <FiCheckCircle />, color: 'bg-emerald-500' },
                   { label: 'Pending Pledges', value: pledges.filter(p => p.status === 'active').length, icon: <FiClock />, color: 'bg-amber-500' },
                 ].map((stat, i) => (
                    <div key={i} className="bg-slate-50/50 rounded-2xl p-6 space-y-3 group/stat border border-slate-100 hover:bg-white hover:shadow-lg transition-all duration-500">
                       <div className={`w-10 h-10 rounded-xl ${stat.color} text-white flex items-center justify-center text-lg`}>{stat.icon}</div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                          <p className="text-xl font-black text-slate-950 italic tabular-nums leading-none mt-1">{stat.value}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </Section>

           {/* Personal Profile Info */}
           <Section title="Donor Details" description="Personal information provided by member">
              {editing ? (
                 <form onSubmit={handleUpdate} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                          <input type="text" name="phone" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className={inputCls} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Social Causes (separated by comma)</label>
                          <input type="text" value={form.preferredCauses} onChange={(e) => setForm({...form, preferredCauses: e.target.value})} className={inputCls} />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Membership Bio / Description</label>
                       <textarea value={form.bio} onChange={(e) => setForm({...form, bio: e.target.value})} className={`${inputCls} min-h-[150px] resize-none py-6`} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-slate-50">
                       {['street', 'city', 'country', 'postalCode'].map(field => (
                          <div key={field} className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{field}</label>
                             <input type="text" value={form.address?.[field]} onChange={(e) => setForm({...form, address: {...form.address, [field]: e.target.value}})} className={inputCls} />
                          </div>
                       ))}
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.4em] hover:bg-tf-primary transition-all duration-700 shadow-xl active:scale-95 italic">
                       {loading ? 'Saving Changes...' : 'Save Updated Profile Hub'}
                    </button>
                 </form>
              ) : (
                 <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-6">
                          <div className="space-y-1">
                             <p className="text-[9px] font-black text-tf-primary uppercase tracking-[0.3em] italic">Official Bio Hub</p>
                             <p className="text-base text-slate-600 font-medium leading-relaxed italic">{donor.bio || 'This donor has not provided a community bio Hub.'}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[9px] font-black text-tf-primary uppercase tracking-[0.3em] italic">Preferred Causes Hub</p>
                             <div className="flex flex-wrap gap-2 pt-2">
                                {donor.preferredCauses?.length > 0 ? donor.preferredCauses.map((c, i) => (
                                   <span key={i} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest italic">{c}</span>
                                )) : <span className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">None specified Hub</span>}
                             </div>
                          </div>
                       </div>
                       <div className="space-y-6 bg-slate-50 border border-slate-100 rounded-[2rem] p-8">
                          <div className="space-y-4">
                             <div className="flex items-center gap-4">
                                <FiMapPin className="text-tf-primary shrink-0" />
                                <p className="text-sm font-bold text-slate-700 italic">
                                   {donor.address?.street && `${donor.address.street}, `}
                                   {donor.address?.city && `${donor.address.city}, `}
                                   {donor.address?.country || 'No country provided'}
                                </p>
                             </div>
                             <div className="flex items-center gap-4">
                                <FiPhone className="text-tf-primary shrink-0" />
                                <p className="text-sm font-bold text-slate-700 italic">{donor.phone || 'No phone number HUB'}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              )}
           </Section>

           {/* Active Pledge Agreements */}
           <Section title="Pledge Agreements" description="Member's standing financial commitments Hub">
              <div className="space-y-6">
                 {pledges.length > 0 ? pledges.map((p, i) => (
                    <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-slate-50/50 rounded-3xl border border-slate-100 group/pledge hover:bg-white hover:shadow-xl transition-all duration-700">
                       <div className="flex items-center gap-6">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${pledgeStatusBadge[p.status] || 'bg-slate-100 text-slate-500'}`}>
                             <FiZap />
                          </div>
                          <div>
                             <p className="text-lg font-black text-slate-950 italic tabular-nums leading-none mb-1">LKR {Number(p.amount).toLocaleString()} <span className="text-xs text-slate-400 not-italic font-bold">/ {p.frequency}</span></p>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{p.campaignId?.title || 'Unknown Project'}</p>
                          </div>
                       </div>
                       <div className="mt-6 md:mt-0 px-6 py-2 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest italic group-hover/pledge:bg-tf-primary group-hover/pledge:text-white transition-all">
                          {p.status} Commitment Hub
                       </div>
                    </div>
                 )) : (
                    <div className="py-20 text-center space-y-4 bg-slate-50 border border-slate-100 rounded-[2rem] border-dashed">
                       <FiZap className="mx-auto text-slate-200" size={48} />
                       <p className="text-slate-400 font-bold text-sm uppercase tracking-widest italic">No pledge commitments identified Hub.</p>
                    </div>
                 )}
              </div>
           </Section>
        </div>

        {/* Right Column: Interaction Log */}
        <div className="lg:col-span-4 space-y-10">
           
           <Section title="Message Log" description="Notes and engagement history Hub" actions={
              <button 
                onClick={() => setShowInteractionForm(!showInteractionForm)}
                className="w-10 h-10 bg-slate-950 text-white rounded-xl flex items-center justify-center hover:bg-tf-primary transition-all shadow-lg shadow-slate-950/20 active:scale-95"
              >
                 {showInteractionForm ? <FiCheckCircle /> : <FiZap />}
              </button>
           }>
              <AnimatePresence>
                 {showInteractionForm && (
                    <motion.form 
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddInteraction} className="space-y-6 pb-10 border-b border-slate-50 mb-10 overflow-hidden"
                    >
                       <div className="grid grid-cols-2 gap-4">
                          <select value={interactionForm.type} onChange={(e) => setInteractionForm({...interactionForm, type: e.target.value})} className="bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-tf-primary appearance-none cursor-pointer">
                             {INTERACTION_TYPES.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                          </select>
                          <input type="date" value={interactionForm.date} onChange={(e) => setInteractionForm({...interactionForm, date: e.target.value})} className="bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-tf-primary" />
                       </div>
                       <textarea value={interactionForm.notes} onChange={(e) => setInteractionForm({...interactionForm, notes: e.target.value})} placeholder="Notes about message..." className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-xs font-bold focus:outline-none focus:border-tf-primary min-h-[120px] resize-none" required />
                       <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all active:scale-95 italic">Save Information Hub</button>
                    </motion.form>
                 )}
              </AnimatePresence>

              <div className="space-y-8 relative">
                 <div className="absolute left-6 top-4 bottom-4 w-px bg-slate-50" />
                 {donor.interactions?.length > 0 ? [...donor.interactions].reverse().map((i, idx) => (
                    <div key={i._id} className="relative pl-14 group/log">
                       <div className="absolute left-4 top-1 w-4 h-4 rounded-full border-4 border-white bg-slate-100 group-hover/log:bg-tf-primary transition-colors duration-500 z-10" />
                       <div className="space-y-3">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-tf-primary uppercase tracking-[0.2em] italic">{i.type} INFO</span>
                                <span className="text-[10px] font-bold text-slate-300 italic">{new Date(i.date).toLocaleDateString()}</span>
                             </div>
                             <button onClick={() => handleDeleteInteraction(i._id)} className="text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover/log:opacity-100"><FiTrash2 size={12} /></button>
                          </div>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed italic">{i.notes}</p>
                       </div>
                    </div>
                 )) : (
                    <div className="py-20 text-center space-y-4 bg-slate-50/50 rounded-3xl border border-white">
                       <FiActivity className="mx-auto text-slate-100" size={40} />
                       <p className="text-slate-300 font-bold text-[9px] uppercase tracking-widest italic">No messages logged Hub.</p>
                    </div>
                 )}
              </div>
           </Section>

           {/* Quick Action Dock */}
           <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden group/dock">
              <div className="absolute top-0 right-0 w-32 h-32 bg-tf-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover/dock:opacity-100 transition-opacity opacity-0" />
              <div className="relative z-10 space-y-6 text-center lg:text-left">
                 <p className="text-[10px] font-black text-tf-primary uppercase tracking-[0.3em] italic">Information Protocol Hub</p>
                 <p className="text-xs font-medium text-white/50 leading-relaxed italic">Synchronized community data for authorized members Hub. All actions are logged and verified Hub.</p>
                 <div className="flex gap-4">
                    <button className="flex-1 py-3 bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/20 transition-all italic">Report Access</button>
                    <button className="flex-1 py-3 bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/20 transition-all italic">Log Export Hub</button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Delete Confirmation Gate */}
      <AnimatePresence>
        {confirmDelete && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-8">
              <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[3rem] p-16 max-w-xl w-full text-center space-y-10 shadow-4xl relative overflow-hidden">
                 <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-inner-sm">
                    <FiAlertTriangle />
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Destroy Member Record Map?</h3>
                    <p className="text-slate-400 font-medium leading-relaxed italic text-base px-6">Warning: Deleting this member Hub will permanently remove all community contributions and information from our system Hub.</p>
                 </div>
                 <div className="flex flex-col sm:flex-row gap-6">
                    <button onClick={handleDelete} className="flex-[2] py-5 bg-rose-600 hover:bg-slate-950 text-white text-[11px] font-black uppercase tracking-[0.5em] rounded-2xl transition-all shadow-4xl shadow-rose-600/30 active:scale-95 italic">Authorize Deletion Map Hub</button>
                    <button onClick={() => setConfirmDelete(false)} className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.5em] hover:text-slate-950 transition-all italic underline decoration-transparent hover:decoration-slate-900 underline-offset-8">Abort Cycle Hub</button>
                 </div>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]">
             <div className="bg-slate-950 text-emerald-400 px-10 py-5 rounded-full shadow-5xl backdrop-blur-2xl flex items-center gap-4 italic font-black uppercase tracking-widest text-[10px] border border-white/10">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                {success}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminDonor } from '../../context/AdminDonorContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { motion, AnimatePresence } from 'framer-motion';

const INTERACTION_TYPES = ['email', 'call', 'meeting', 'event', 'other'];

const pledgeStatusBadge = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
  pending: 'bg-amber-50 text-amber-600 border-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
  fulfilled: 'bg-tf-primary/10 text-tf-primary border-tf-primary/20',
  cancelled: 'bg-rose-50 text-rose-600 border-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.1)]',
};

function Section({ title, children, actions, description }) {
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="bg-white rounded-[5rem] border border-slate-100 p-16 shadow-sm space-y-16 group hover:shadow-4xl transition-all duration-1000 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-tf-primary/5 blur-[120px] -mr-48 -mt-48 pointer-events-none group-hover:opacity-100 transition-opacity opacity-0" />
      <div className="flex flex-col xl:flex-row xl:items-center justify-between relative z-10 gap-10">
         <div className="space-y-4">
            <h3 className="text-3xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">{title} Hub</h3>
            {description && <p className="text-[11px] text-slate-300 font-black uppercase tracking-[0.6em] italic leading-none">{description}</p>}
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

  // Interaction form
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
      setSuccess('Humanitarian Registry synchronized successfully HUB.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Authorization synchronization failure.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDonor(id);
      navigate('/admin/donors');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to decommission agent node.');
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
      setSuccess('Engagement intelligence log committed HUB.');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to authorize engagement log.');
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
      setLocalError(err.response?.data?.message || 'Failed to purge engagement protocol.');
    }
  };

  const handleRecalculate = async () => {
    try {
      const updated = await recalculateAnalytics(id);
      setAnalytics(updated);
      setSuccess('Strategic intelligence refreshed HUB.');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to sync real-time analytics.');
    }
  };

  const inputCls = 'w-full bg-slate-50/50 border border-slate-100 rounded-[2rem] px-10 py-6 text-lg font-black text-slate-950 placeholder-slate-200 focus:outline-none focus:border-tf-primary focus:bg-white transition-all shadow-inner italic tracking-tight';

  if (loading && !donor) return <LoadingSpinner />;
  if (!donor && !loading) return (
    <div className="text-center py-60 space-y-12 max-w-7xl mx-auto font-sans selection:bg-tf-primary selection:text-white pt-8">
       <div className="w-32 h-32 bg-white rounded-[3rem] border border-slate-100 flex items-center justify-center mx-auto text-slate-100 rotate-12 transition-transform hover:rotate-0 duration-1000 shadow-inner italic font-black text-4xl">?</div>
       <div className="space-y-6">
         <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Agent_Identifier_Missing HUB.</h3>
         <p className="text-[12px] text-slate-400 font-black uppercase tracking-[0.6em] italic leading-none mt-2">Synchronization failure within the member registry Hub</p>
         <button onClick={() => navigate('/admin/donors')} className="px-16 py-8 bg-slate-950 text-white rounded-full text-[13px] font-black uppercase tracking-[0.5em] hover:bg-tf-primary transition-all shadow-4xl active:scale-95 italic mt-10">Return to Registry Directory</button>
       </div>
    </div>
  );

  return (
    <div className="max-w-[1800px] mx-auto space-y-20 pb-40 font-sans selection:bg-tf-primary selection:text-white pt-12">
      
      {/* Cinematic Tactical Agent Profile Header */}
      <section className="bg-slate-950 rounded-[4.5rem] p-24 text-white relative overflow-hidden shadow-4xl border border-white/5 group mx-8">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-tf-primary/10 blur-[200px] -mr-60 -mt-60 animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-tf-accent/5 blur-[150px] -ml-40 -mb-40 pointer-events-none" />
        
        <div className="relative z-10 space-y-16">
           <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onClick={() => navigate('/admin/donors')} className="flex items-center gap-6 text-[11px] font-black text-white/30 uppercase tracking-[0.6em] hover:text-tf-primary transition-all group/back italic">
              <div className="w-12 h-12 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center group-hover/back:border-tf-primary/50 group-hover/back:bg-tf-primary/10 transition-all shadow-2xl group-hover/back:-translate-x-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </div>
              Return to Registry Index HUB
           </motion.button>
           
           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-16">
              <div className="space-y-10 flex-1">
                 <div className="space-y-6">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-6">
                       <span className="w-3 h-3 rounded-full bg-tf-primary shadow-[0_0_20px_rgba(255,138,0,1)] animate-bounce" />
                       <p className="text-[12px] font-black text-white/30 uppercase tracking-[0.7em] italic leading-none underline decoration-tf-primary/30 decoration-4 underline-offset-[14px]">Authorized_Humanitarian_Asset NODE</p>
                    </motion.div>
                    <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl lg:text-9xl font-black tracking-tighter leading-[0.85] lowercase italic text-stroke-white opacity-90 transition-all hover:opacity-100 flex flex-col">
                       {donor?.userId?.name || 'Verified Member Agent'}
                    </motion.h2>
                 </div>
                 
                 <div className="flex flex-wrap items-center gap-10 relative z-10">
                    <div className="px-10 py-4 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full flex items-center gap-5 hover:bg-white/10 transition-colors shadow-2xl">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse" />
                       <p className="text-[13px] font-black text-tf-primary uppercase tracking-[0.4em] italic leading-none">{donor?.userId?.email || 'OFFLINE_REGISTRY_CREDENTIALS'}</p>
                    </div>
                    <span className="w-px h-10 bg-white/10 rotate-12 hidden md:block" />
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic leading-none">Authorization Hub Security ID</p>
                       <p className="text-sm text-white/30 font-black tracking-[0.3em] uppercase italic tabular-nums">{id?.toUpperCase()}</p>
                    </div>
                 </div>
              </div>

              <div className="flex gap-8 shrink-0 relative z-20">
                 {!editing && (
                   <motion.button
                     initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                     onClick={() => { setEditing(true); setSuccess(''); }}
                     className="px-16 py-8 bg-white text-slate-950 rounded-full text-[13px] font-black uppercase tracking-[0.5em] transition-all duration-700 hover:bg-tf-primary hover:text-white active:scale-95 shadow-4xl italic group/edit"
                   >
                     Modify Registry Data <span className="group-hover/edit:translate-x-3 transition-transform inline-block ml-4">→</span>
                   </motion.button>
                 )}
                 <button
                   onClick={() => setConfirmDelete(true)}
                   className="px-12 py-8 bg-white/5 backdrop-blur-3xl border border-white/20 hover:border-rose-500 hover:bg-rose-500 hover:text-white rounded-full text-[12px] font-black uppercase tracking-[0.5em] transition-all transform active:scale-90 shadow-2xl italic group/trash"
                 >
                   Decommission Agent Node
                 </button>
              </div>
           </div>
        </div>
      </section>

      <AnimatePresence>
          {(localError || error) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="px-8">
               <ErrorAlert message={localError || error} onDismiss={() => { setLocalError(''); setError(null); }} />
            </motion.div>
          )}
      </AnimatePresence>
      
      <AnimatePresence>
        {success && (
          <motion.div 
             initial={{ opacity: 0, y: -20, scale: 0.95 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0 }}
             className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-[12px] font-black uppercase tracking-[0.6em] px-16 py-8 rounded-full shadow-4xl w-fit mx-auto italic flex items-center gap-6 animate-pulse"
          >
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Strategic Impact Informational Hub */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 px-8">
          {[
            { 
              label: 'Cumulative Capital Intake', 
              value: `LKR ${Number(analytics.totalDonated ?? 0).toLocaleString()}`, 
              color: 'text-tf-primary', 
              icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2a9 9 0 1118 0" />
            },
            { 
              label: 'Verified Gift Protocols', 
              value: analytics.donationCount ?? 0, 
              color: 'text-slate-950', 
              icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            },
            { 
              label: 'Average Support Matrix', 
              value: `LKR ${Number(analytics.averageDonation ?? 0).toLocaleString()}`, 
              color: 'text-tf-accent', 
              icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            },
            { 
              label: 'Member Trust Coefficient', 
              value: `${analytics.retentionScore ?? 0}%`, 
              color: 'text-emerald-600', 
              icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            },
          ].map((stat, idx) => (
            <motion.div 
              key={stat.label} 
              initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[4rem] border border-slate-100 p-14 shadow-sm group hover:shadow-4xl transition-all duration-1000 h-full relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 blur-3xl -mr-16 -mt-16 group-hover:bg-tf-primary/5 transition-colors duration-1000" />
              <div className="flex items-center gap-10 mb-12 relative z-10">
                 <div className="w-18 h-18 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-center transition-all duration-1000 group-hover:scale-125 shadow-xl group-hover:bg-slate-950 group-hover:text-white group-hover:rotate-12 overflow-hidden relative">
                    <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>{stat.icon}</svg>
                    <div className="absolute inset-0 bg-tf-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.5em] italic leading-tight group-hover:text-slate-950 transition-colors">{stat.label}</p>
                    <div className="w-8 h-0.5 bg-slate-100 group-hover:w-full group-hover:bg-tf-primary/20 transition-all duration-1000" />
                 </div>
              </div>
              <p className={`text-4xl font-black tracking-tighter ${stat.color} italic tabular-nums relative z-10 group-hover:scale-105 origin-left transition-transform duration-700`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 px-8 items-start">
        {/* Agent Personal Informatics Hub */}
        <Section title="Agent Core Personal Hub" description="Verified historical credentials and secure communication channels HUB.">
          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-12 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-10 italic transition-colors group-hover/section:text-tf-primary">Secure_Voice_Access NODE</label>
                  <input className={inputCls} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+X XXXXXXXXXX_COMMS" />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-10 italic transition-colors group-hover/section:text-tf-primary">Operational_City_Node</label>
                  <input className={inputCls} placeholder="HUB_LOCATION_REF" value={form.address?.city} onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, city: e.target.value } }))} />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-10 italic transition-colors group-hover/section:text-tf-primary">Verified_Nation_Registry</label>
                  <input className={inputCls} placeholder="NATION_STATE_PROTOCOL" value={form.address?.country} onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, country: e.target.value } }))} />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-10 italic transition-colors group-hover/section:text-tf-primary">Registry_Postal_Hash</label>
                  <input className={inputCls} placeholder="SEC_ZIP_LINK" value={form.address?.postalCode} onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, postalCode: e.target.value } }))} />
                </div>
                <div className="xl:col-span-2 space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-10 italic transition-colors group-hover/section:text-tf-primary">Street_Level_Landing_Site_Hub</label>
                  <input className={inputCls} placeholder="GEO_STREET_LOG" value={form.address?.street} onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, street: e.target.value } }))} />
                </div>
                <div className="xl:col-span-2 space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-10 italic transition-colors group-hover/section:text-tf-primary">Mission_Sector_Synchronization_Hub</label>
                  <input className={inputCls} value={form.preferredCauses} onChange={(e) => setForm((f) => ({ ...f, preferredCauses: e.target.value }))} placeholder="E.g. DISASTER_RELIEF_HUB, EDUCATION_CORE_PROTOCOL, CLINICAL_AID_NODE" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-8 pt-10">
                <button type="submit" disabled={loading} className="flex-[2] py-8 bg-slate-950 hover:bg-tf-primary disabled:opacity-50 text-white text-[13px] font-black uppercase tracking-[0.6em] rounded-full transition-all duration-700 shadow-4xl active:scale-95 italic flex items-center justify-center gap-6 group/submit">
                  {loading ? (
                    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                  ) : null}
                  {loading ? 'AUTHORIZED_SYNC...' : 'AUTHORIZE_REGISTRY_COMMIT HUB'}
                </button>
                <button type="button" onClick={() => setEditing(false)} className="flex-1 py-8 bg-white border border-slate-100 hover:bg-slate-50 text-slate-300 hover:text-slate-950 text-[12px] font-black uppercase tracking-[0.5em] rounded-full transition-all duration-700 active:scale-95 italic">
                  ABORT_CYCLE
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {[
                { label: 'Secure Voice Trace', value: donor?.phone, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /> },
                { label: 'Verified Global Nation HUB', value: donor?.address?.country, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
                { label: 'Regional Operational HUB', value: donor?.address?.city, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /> },
                { label: 'Secure Registry Zip HUB', value: donor?.address?.postalCode, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /> },
                { label: 'Tactical Landing Site Hub', value: donor?.address?.street, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
                { label: 'Authorization Lifecycle', value: donor?.status, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /> },
              ].map((item, idx) => (
                <div key={item.label} className="space-y-6 group/item relative overflow-hidden">
                  <div className="flex items-center gap-6 relative z-10 transition-transform duration-700 group-hover/item:translate-x-2">
                    <div className="w-12 h-12 bg-slate-50 border border-white rounded-2xl flex items-center justify-center text-slate-100 group-hover/item:bg-slate-950 group-hover/item:text-tf-primary group-hover/item:rotate-12 transition-all duration-1000 shadow-inner">
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>{item.icon}</svg>
                    </div>
                    <div className="space-y-2">
                       <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.5em] italic group-hover/item:text-tf-primary transition-all leading-none">{item.label}</p>
                       <p className="text-xl font-black text-slate-950 tracking-tighter italic leading-none lowercase group-hover/item:scale-105 origin-left transition-transform duration-700">{item.value || 'REDACTED_ACCESS'}</p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-12 w-24 h-px bg-slate-50 group-hover/item:w-full group-hover/item:bg-tf-primary/10 transition-all duration-1000" />
                </div>
              ))}
              {donor?.preferredCauses?.length > 0 && (
                <div className="xl:col-span-2 space-y-8 pt-10 relative overflow-hidden group/sectors">
                  <div className="flex items-center gap-6">
                     <span className="w-10 h-0.5 bg-tf-primary/20 group-hover/sectors:w-20 transition-all duration-1000" />
                     <p className="text-slate-300 text-[11px] font-black uppercase tracking-[0.6em] italic leading-none group-hover/sectors:text-tf-primary transition-colors">Mission Authorization HUB Sectors</p>
                  </div>
                  <div className="flex flex-wrap gap-6 pl-16">
                    {donor.preferredCauses.map((c) => (
                      <span key={c} className="px-10 py-4 bg-slate-50/50 border border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all duration-700 cursor-default shadow-sm italic hover:-translate-y-2 hover:shadow-4xl">#{c.toLowerCase()} HUB</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Section>

        {/* Strategic Pledge Lifecycle Hub */}
        <Section title="Capital Commitment Matrix" description="Verified historical and semi-active capital stabilization protocols Hub.">
          <div className="space-y-12">
            {pledges.length === 0 ? (
              <div className="py-40 text-center group/empty bg-slate-50/30 rounded-[4rem] border-2 border-dashed border-slate-100">
                 <div className="w-32 h-32 bg-white border border-slate-100 rounded-[3.5rem] flex items-center justify-center mx-auto mb-12 transition-all duration-1000 group-hover/empty:rotate-12 group-hover/empty:scale-110 shadow-inner italic font-black text-slate-100 text-4xl">?</div>
                 <div className="space-y-4">
                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase lowercase">Null Commitment Protocol registry detected.</h4>
                    <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.7em] mt-2 italic">Agent node has no authorized active pledge parameters identified HUB.</p>
                 </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-12 relative z-10">
                {pledges.map((p, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                    key={p._id} 
                    className="p-12 bg-slate-50/30 rounded-[4.5rem] border border-slate-50 group/pledge hover:bg-white hover:shadow-4xl transition-all duration-1000 flex flex-col xl:flex-row xl:items-center justify-between gap-12 relative overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 w-64 h-64 bg-tf-primary/3 blur-[80px] opacity-0 group-hover/pledge:opacity-100 transition-opacity pointer-events-none" />
                     <div className="space-y-8 flex-1 relative z-10">
                        <div className="flex items-center gap-6">
                           <div className="w-4 h-1 bg-tf-primary rounded-full group-hover/pledge:w-12 transition-all duration-1000" />
                           <p className="text-5xl font-black text-slate-950 tracking-tighter italic tabular-nums group-hover/pledge:text-tf-primary transition-colors duration-700 leading-none lowercase">LKR {Number(p.amount).toLocaleString()}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-8 pl-10">
                           <div className="px-8 py-3 bg-slate-950 text-white text-[11px] font-black uppercase tracking-[0.5em] rounded-2xl italic group-hover/pledge:bg-tf-primary transition-all duration-700 shadow-2xl">{p.frequency} HUB Protocol</div>
                           <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover/pledge:bg-tf-primary transition-colors" />
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] italic mb-1">Authorization Target Hub</p>
                              <p className="text-[13px] font-black text-slate-400 uppercase tracking-[0.2em] italic group-hover/pledge:text-slate-950 transition-colors duration-700">{p.campaign?.title || p.campaign || 'GENERAL_STABILIZATION_RESERVE'}</p>
                           </div>
                        </div>
                     </div>
                     <span className={`px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] italic border border-slate-100 shadow-2xl group-hover/pledge:scale-105 transition-all duration-1000 relative z-10 ${pledgeStatusBadge[p.status] || 'bg-white text-slate-400'}`}>
                        NODE_{p.status?.toUpperCase()}_SYNC
                     </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* Global Interaction Intelligence Log */}
        <Section 
          title="Tactical Engagement Intelligence" 
          description="Institutional logs of verified humanitarian agent interactions HUB Protocol."
          actions={
            <button
              onClick={() => setShowInteractionForm((v) => !v)}
              className="px-12 py-6 bg-slate-950 text-white text-[11px] font-black uppercase tracking-[0.5em] rounded-full hover:bg-tf-primary transition-all duration-700 shadow-4xl active:scale-95 italic flex items-center gap-5 group/btn"
            >
              <div className={`w-3 h-3 rounded-full ${showInteractionForm ? 'bg-tf-accent shadow-tf-accent' : 'bg-tf-primary shadow-tf-primary'} shadow-[0_0_10px_currentColor] animate-pulse`} />
              {showInteractionForm ? 'ABORT_REGISTRY_INPUT' : 'INITIALIZE_ENGAGEMENT_LOG Hub'}
            </button>
          }
        >
          <div className="space-y-16">
            <AnimatePresence>
              {showInteractionForm && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 10 }}
                  className="bg-slate-950 rounded-[4.5rem] p-16 space-y-14 shadow-5xl relative overflow-hidden border border-white/5 group/form"
                >
                  <div className="absolute top-0 right-0 w-96 h-96 bg-tf-primary/10 blur-[150px] -mr-48 -mt-48 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-tf-accent/5 blur-[120px] -ml-32 -mb-32 pointer-events-none" />
                  
                  <div className="flex items-center gap-6 relative z-10 mb-6">
                     <span className="w-12 h-1 bg-tf-primary rounded-full group-hover/form:w-24 transition-all duration-1000" />
                     <h4 className="text-xl font-black text-white/50 uppercase tracking-[0.6em] italic">Authorized_Engagement_Inbound Hub</h4>
                  </div>

                  <form onSubmit={handleAddInteraction} className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                      <div className="space-y-5 flex flex-col">
                        <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] ml-10 italic">Intelligence Protocol Hub</label>
                        <div className="relative group/sel">
                          <select
                            value={interactionForm.type}
                            onChange={(e) => setInteractionForm((f) => ({ ...f, type: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] px-12 py-7 text-lg font-black text-white appearance-none focus:outline-none focus:border-tf-primary focus:bg-white/10 transition-all italic shadow-inner tracking-widest"
                          >
                            {INTERACTION_TYPES.map((t) => (
                              <option key={t} value={t} className="bg-slate-900">{t.toUpperCase()}_PROTOCOL_HUB</option>
                            ))}
                          </select>
                          <div className="absolute right-10 top-1/2 -translate-y-1/2 text-white/20 group-hover/sel:text-tf-primary transition-colors pointer-events-none">
                             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-5 flex flex-col">
                        <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] ml-10 italic">Tactical_Synchronization_Date</label>
                        <input
                          type="date"
                          value={interactionForm.date}
                          onChange={(e) => setInteractionForm((f) => ({ ...f, date: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] px-12 py-7 text-lg font-black text-white focus:outline-none focus:border-tf-primary transition-all italic shadow-inner tracking-widest uppercase"
                        />
                      </div>
                    </div>
                    <div className="space-y-5 relative z-10">
                      <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] ml-10 italic">Institutional Engagement Intelligence Dataset Hub</label>
                      <textarea
                        value={interactionForm.notes}
                        onChange={(e) => setInteractionForm((f) => ({ ...f, notes: e.target.value }))}
                        rows={6}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-[3rem] px-12 py-12 text-lg font-bold text-white/90 placeholder-white/10 focus:outline-none focus:border-tf-primary focus:bg-white/10 transition-all resize-none italic leading-relaxed tracking-tight"
                        placeholder="INPUT_STRATEGIC_ENGAGEMENT_SUMMARY_PROTOCOL…"
                      />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-10 bg-tf-primary hover:bg-white hover:text-slate-950 disabled:opacity-30 text-white text-[14px] font-black uppercase tracking-[0.6em] rounded-full transition-all duration-1000 shadow-4xl active:scale-95 italic flex items-center justify-center gap-8 group/commit">
                      {loading ? (
                         <svg className="w-7 h-7 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                      ) : null}
                      COMMIT_STRATEGIC_LOG HUB <span className="group-hover/commit:translate-x-6 transition-transform duration-1000">→</span>
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {(!donor?.interactions || donor.interactions.length === 0) ? (
              <div className="py-40 text-center group/history bg-slate-50/20 rounded-[4rem] border-2 border-dashed border-slate-100">
                 <div className="w-32 h-32 bg-white border border-slate-100 rounded-[3.5rem] flex items-center justify-center mx-auto mb-12 transition-all duration-1000 group-hover/history:rotate-12 group-hover/history:scale-110 shadow-inner italic font-black text-slate-100 text-4xl">?</div>
                 <div className="space-y-4">
                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase lowercase">Null Intelligence History HUB detected.</h4>
                    <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.7em] mt-2 italic">Awaiting secure node interaction logging to populate historical grid HUB.</p>
                 </div>
              </div>
            ) : (
              <div className="space-y-12 relative z-10">
                {[...donor.interactions].reverse().map((i, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                    key={i._id} 
                    className="group/row relative flex flex-col md:flex-row items-start justify-between gap-12 p-14 rounded-[4.5rem] bg-slate-50/40 border border-slate-50 hover:bg-white hover:shadow-4xl transition-all duration-1000 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 blur-[80px] opacity-0 group-hover/row:opacity-100 transition-opacity pointer-events-none" />
                    <div className="flex flex-col md:flex-row items-start gap-12 flex-1 relative z-10 w-full">
                      <div className="flex flex-col items-center gap-4 shrink-0 mt-2">
                         <span className="px-10 py-4 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl transition-all shadow-4xl italic group-hover/row:bg-tf-primary group-hover/row:scale-110 group-hover/row:rotate-[-5deg] duration-700">
                           NODE_{i.type?.toUpperCase()}_PROTOCOL
                         </span>
                         <div className="w-px h-12 bg-slate-100 group-hover/row:bg-tf-primary/20 transition-all duration-1000" />
                      </div>
                      <div className="space-y-8 flex-1">
                        <p className="text-xl md:text-2xl font-black text-slate-950 leading-tight italic tracking-tight opacity-90 group-hover/row:text-tf-primary transition-colors duration-700 lowercase">"{i.notes || i.note || 'REDACTED_INTELLIGENCE_DATASET_HUB'}"</p>
                        <div className="flex items-center gap-5">
                           <div className="w-1.5 h-1.5 rounded-full bg-tf-primary shadow-[0_0_8px_rgba(255,138,0,0.5)] animate-shimmer" />
                           <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.5em] italic leading-none group-hover/row:text-slate-950 transition-colors duration-700">{new Date(i.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} Registry Synchronization HUB</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteInteraction(i._id)}
                      className="opacity-0 group-hover/row:opacity-100 text-[10px] font-black text-slate-200 hover:text-rose-600 uppercase tracking-[0.6em] transition-all duration-500 p-6 italic hover:underline decoration-2 underline-offset-8 relative z-20"
                    >
                      Purge_Protocol Hub
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* Global Impact Synchronizer Hub */}
        <div className="xl:col-span-2 flex justify-center py-20 px-8">
           <button
             onClick={handleRecalculate}
             disabled={loading}
             className="w-full py-10 border-2 border-slate-50 hover:border-tf-primary text-slate-300 hover:text-tf-primary text-[12px] font-black uppercase tracking-[0.8em] rounded-full hover:bg-white hover:shadow-5xl transition-all duration-1000 disabled:opacity-20 italic active:scale-95 flex items-center justify-center gap-10 group/sync"
           >
             <span className="group-hover/sync:rotate-180 transition-transform duration-1000 inline-block text-xl">↻</span>
             Synchronize Real-time Humanitarian Impact Intelligence Dataset Hub
             <span className="group-hover/sync:rotate-[-180deg] transition-transform duration-1000 inline-block text-xl">↻</span>
           </button>
        </div>
      </div>

      {/* Terminal Node Decommission Gate */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center z-[500] p-12 font-sans"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="bg-white rounded-[5rem] shadow-5xl p-24 max-w-5xl w-full space-y-16 relative overflow-hidden text-center border border-white/10 group/confirm"
            >
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/5 blur-[150px] -mr-32 -mt-32 pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-50 blur-[120px] -ml-32 -mb-32 pointer-events-none" />
               
               <div className="w-48 h-48 bg-rose-50 text-rose-600 rounded-[4.5rem] flex items-center justify-center mx-auto mb-12 shadow-inner group-hover/confirm:rotate-[25deg] group-hover/confirm:scale-110 transition-all duration-1000 border border-rose-100/50 relative overflow-hidden">
                  <svg className="w-24 h-24 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <div className="absolute inset-0 bg-rose-100 opacity-20 group-hover/confirm:opacity-40 transition-opacity" />
               </div>
               
               <div className="space-y-10 relative z-10">
                 <h4 className="text-5xl md:text-8xl font-black text-slate-950 tracking-tighter italic uppercase leading-none lowercase text-stroke-slate-900 transition-all hover:text-rose-600 hover:text-stroke-none duration-700">Terminal:<br /><span className="text-rose-600 not-italic">Purge Node?</span></h4>
                 <div className="space-y-6 max-w-3xl mx-auto">
                    <p className="text-slate-400 font-medium leading-relaxed italic text-2xl px-12 group-hover/confirm:text-slate-700 transition-colors duration-1000">
                      Warning: You are initiating the terminal decommissioning of <strong>{donor?.userId?.name}'s</strong> agent profile from the official registry Hub. This strategic action will result in permanent, irreversible data destruction within the humanitarian matrix.
                    </p>
                    <div className="flex justify-center items-center gap-6">
                       <span className="w-24 h-1 bg-rose-100 rounded-full group-hover/confirm:w-48 transition-all duration-1000" />
                       <div className="w-4 h-4 rounded-full bg-rose-500 animate-pulse" />
                       <span className="w-24 h-1 bg-rose-100 rounded-full group-hover/confirm:w-48 transition-all duration-1000" />
                    </div>
                 </div>
               </div>
               
               <div className="flex flex-col sm:flex-row gap-12 pt-16 relative z-10 px-16">
                  <button onClick={handleDelete} disabled={loading} className="flex-[2] py-12 text-[15px] font-black text-white bg-rose-600 hover:bg-slate-950 disabled:opacity-30 rounded-full transition-all duration-1000 uppercase tracking-[0.8em] shadow-5xl shadow-rose-600/40 active:scale-90 italic flex items-center justify-center gap-10 group/execution">
                    {loading ? (
                       <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                    ) : null}
                    {loading ? 'EXECUTING_PURGE_PROTOCOL…' : 'Authorize Node Destruction Hub'}
                  </button>
                  <button onClick={() => setConfirmDelete(false)} className="flex-1 py-12 text-[13px] font-black text-slate-300 border-2 border-slate-50 bg-slate-50/50 hover:bg-white hover:text-slate-950 rounded-full transition-all duration-1000 uppercase tracking-[0.6em] italic active:scale-95 shadow-inner">
                    Abort Protocol
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminDonor } from '../../context/AdminDonorContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';

const INTERACTION_TYPES = ['email', 'call', 'meeting', 'event', 'other'];

const pledgeStatusBadge = {
  active: 'bg-tf-green/10 text-tf-green border-tf-green/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]',
  pending: 'bg-amber-100 text-amber-600 border-tf-purple/10',
  fulfilled: 'bg-tf-primary/10 text-tf-primary border-tf-primary/20',
  cancelled: 'bg-red-50 text-red-600 border-red-100',
};

function Section({ title, children, actions }) {
  return (
    <div className="bg-white rounded-[3.5rem] border border-slate-100 p-12 shadow-sm space-y-10 group hover:shadow-2xl transition-all duration-700 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-tf-primary/5 blur-[50px] -mr-16 -mt-16 group-hover:opacity-100 transition-opacity opacity-0" />
      <div className="flex items-center justify-between relative z-10 px-2">
         <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] italic">{title}</h3>
         {actions}
      </div>
      <div className="relative z-10">
         {children}
      </div>
    </div>
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
      // fetchDonorById failed
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
      setSuccess('Donor record updated successfully.');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to update record.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDonor(id);
      navigate('/admin/donors');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to remove record.');
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
      setSuccess('Interaction logged successfully.');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to log interaction.');
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
      setLocalError(err.response?.data?.message || 'Failed to remove interaction.');
    }
  };

  const handleRecalculate = async () => {
    try {
      const updated = await recalculateAnalytics(id);
      setAnalytics(updated);
      setSuccess('Member statistics updated.');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to sync analytics.');
    }
  };

  const inputCls = 'w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-5 text-[14px] font-bold text-tf-purple placeholder-slate-300 focus:outline-none focus:border-tf-primary transition-all shadow-inner';

  if (loading && !donor) return <LoadingSpinner />;
  if (!donor && !loading) return (
    <div className="text-center py-48 space-y-8 font-sans">
       <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
       </div>
       <div className="space-y-2">
         <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Member not found in current directory.</p>
         <button onClick={() => navigate('/admin/donors')} className="text-[11px] font-black text-tf-primary uppercase tracking-widest hover:underline underline-offset-8">Return to Member Directory</button>
       </div>
    </div>
  );

  return (
    <div className="max-w-[1700px] mx-auto space-y-12 animate-fade-in pb-24 font-sans text-tf-purple selection:bg-tf-primary selection:text-white">
      
      {/* Professional Member Profile Header */}
      <div className="relative p-12 lg:p-16 bg-tf-purple rounded-[4rem] overflow-hidden shadow-2xl group text-white border border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1600')] opacity-5 blur-sm scale-110 group-hover:scale-100 transition-transform duration-1000 grayscale" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-tf-primary/10 blur-[130px] -mr-48 -mt-48 opacity-40 animate-pulse" />
        
        <div className="relative z-10 space-y-8">
           <button onClick={() => navigate('/admin/donors')} className="flex items-center gap-3 text-[10px] font-black text-white/50 uppercase tracking-[0.3em] hover:text-tf-primary transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Member Directory List
           </button>
           
           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-tf-primary shadow-[0_0_20px_rgba(255,138,0,0.8)] animate-pulse" />
                    <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic opacity-60">Verified Member Profile</p>
                 </div>
                 <h2 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase italic leading-tight truncate max-w-2xl">
                    {donor?.userId?.name || 'Verified Member'}
                 </h2>
                 <p className="text-tf-primary text-[14px] font-black uppercase tracking-[0.3em] italic">{donor?.userId?.email || 'private@member.com'}</p>
              </div>

              <div className="flex gap-4">
                 {!editing && (
                   <button
                     onClick={() => { setEditing(true); setSuccess(''); }}
                     className="px-12 py-6 bg-white text-tf-purple rounded-3xl text-[12px] font-black uppercase tracking-[0.2em] transition-all hover:bg-tf-primary hover:text-white active:scale-95 shadow-2xl shadow-tf-purple/10"
                   >
                     Update Profile
                   </button>
                 )}
                 <button
                   onClick={() => setConfirmDelete(true)}
                   className="px-12 py-6 bg-white/5 backdrop-blur-xl border-2 border-white/10 hover:border-red-500 hover:bg-red-500 hover:text-white rounded-3xl text-[12px] font-black uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-xl"
                 >
                   Remove Member
                 </button>
              </div>
           </div>
        </div>
      </div>

      {(localError || error) && (
        <ErrorAlert message={localError || error} onDismiss={() => { setLocalError(''); setError(null); }} />
      )}
      {success && (
        <div className="bg-tf-green/10 border border-tf-green/20 text-tf-green text-[11px] font-black uppercase tracking-widest px-10 py-6 rounded-full animate-fade-in shadow-sm w-fit mx-auto">
          {success}
        </div>
      )}

      {/* Impact Statistics Grid */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 px-4">
          {[
            { 
              label: 'Total Contributed', 
              value: `LKR ${Number(analytics.totalDonated ?? 0).toLocaleString()}`, 
              color: 'text-tf-primary', 
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2a9 9 0 1118 0" />
                </svg>
              ) 
            },
            { 
              label: 'Verified Gifts', 
              value: analytics.donationCount ?? 0, 
              color: 'text-tf-purple', 
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ) 
            },
            { 
              label: 'Average Contribution', 
              value: `LKR ${Number(analytics.averageDonation ?? 0).toLocaleString()}`, 
              color: 'text-blue-500', 
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ) 
            },
            { 
              label: 'Community Score', 
              value: `${analytics.retentionScore ?? 0}%`, 
              color: 'text-tf-green', 
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              ) 
            },
          ].map(({ label, value, color, icon }) => (
            <div key={label} className="bg-white rounded-[3.5rem] border border-slate-100 p-10 shadow-sm group hover:border-tf-primary transition-all h-full relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center gap-4 mb-8">
                 <span className="text-2xl group-hover:scale-125 transition-transform duration-500">{icon}</span>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">{label}</p>
              </div>
              <p className={`text-2xl font-black tracking-tight ${color} italic tabular-nums`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Personal Details Hub */}
        <Section title="Personal Membership Details">
          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Phone Number</label>
                  <input className={inputCls} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+1234567890" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">City</label>
                  <input className={inputCls} placeholder="City Name" value={form.address?.city} onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, city: e.target.value } }))} />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Country</label>
                  <input className={inputCls} placeholder="Country Name" value={form.address?.country} onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, country: e.target.value } }))} />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Postal Code</label>
                  <input className={inputCls} placeholder="Postal Code" value={form.address?.postalCode} onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, postalCode: e.target.value } }))} />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Street Address</label>
                  <input className={inputCls} placeholder="Street Address" value={form.address?.street} onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, street: e.target.value } }))} />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Preferred Causes</label>
                  <input className={inputCls} value={form.preferredCauses} onChange={(e) => setForm((f) => ({ ...f, preferredCauses: e.target.value }))} placeholder="E.g. EDUCATION, HEALTHCARE, RELIEF" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={loading} className="px-12 py-6 bg-tf-primary hover:bg-slate-900 disabled:opacity-60 text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-full transition-all shadow-2xl shadow-tf-primary/20 active:scale-95">
                  {loading ? 'SAVING CHANGES…' : 'SAVE PROFILE'}
                </button>
                <button type="button" onClick={() => setEditing(false)} className="px-12 py-6 border-2 border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-tf-purple text-[11px] font-black uppercase tracking-[0.2em] rounded-full transition-all active:scale-95">
                  CANCEL
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {[
                { 
                  label: 'Phone Number', 
                  value: donor?.phone, 
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  ) 
                },
                { 
                  label: 'Country', 
                  value: donor?.address?.country, 
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) 
                },
                { 
                  label: 'City', 
                  value: donor?.address?.city, 
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  ) 
                },
                { 
                  label: 'Postal Code', 
                  value: donor?.address?.postalCode, 
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) 
                },
                { 
                  label: 'Street Address', 
                  value: donor?.address?.street, 
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  ) 
                },
                { 
                  label: 'Account Status', 
                  value: donor?.status, 
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ) 
                },
              ].map((item) => (
                <div key={item.label} className="space-y-2 group/item">
                  <div className="flex items-center gap-3">
                    <span className="text-lg opacity-40 group-hover/item:opacity-100 transition-opacity">{item.icon}</span>
                    <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest group-hover/item:text-tf-primary transition-colors">{item.label}</p>
                  </div>
                  <p className="text-[16px] font-black text-tf-purple tracking-tight ml-8 italic">{item.value || 'Not provided'}</p>
                </div>
              ))}
              {donor?.preferredCauses?.length > 0 && (
                <div className="col-span-1 md:col-span-2 space-y-5 pt-4">
                  <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.3em] ml-8">Cause Interests</p>
                  <div className="flex flex-wrap gap-3 ml-8">
                    {donor.preferredCauses.map((c) => (
                      <span key={c} className="px-6 py-3 bg-slate-50 border border-slate-100 text-tf-purple text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-tf-primary hover:text-white hover:border-tf-primary transition-all cursor-default shadow-sm italic">#{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Section>

        {/* Commitment Strategy Hub */}
        <Section title="Historical Pledge Commitments">
          <div className="space-y-8">
            {pledges.length === 0 ? (
              <div className="py-24 text-center space-y-4">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 shadow-inner rotate-12">
                   <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                 </div>
                 <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest italic">Member has no active pledge commitments.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {pledges.map((p) => (
                  <div key={p._id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:bg-white hover:shadow-2xl hover:shadow-tf-purple/5 transition-all flex items-center justify-between">
                     <div className="space-y-3">
                        <p className="text-2xl font-black text-tf-purple tracking-tighter italic tabular-nums group-hover:text-tf-primary transition-colors">LKR {Number(p.amount).toLocaleString()}</p>
                        <div className="flex items-center gap-4">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-tf-purple transition-colors">{p.frequency}</span>
                           <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed max-w-[150px] truncate italic">Cause: {p.campaign?.title || p.campaign || 'General Support'}</span>
                        </div>
                     </div>
                     <span className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-dashed transition-all ${pledgeStatusBadge[p.status] || 'bg-white text-slate-400'}`}>
                        {p.status}
                     </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* Engagement History Log */}
        <Section 
          title="Manual Engagement Records" 
          actions={
            <button
              onClick={() => setShowInteractionForm((v) => !v)}
              className="text-[10px] font-black text-tf-primary uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"
            >
              {showInteractionForm ? 'HIDE FORM' : '[+] ADD ENGAGEMENT RECORD'}
            </button>
          }
        >
          <div className="space-y-10">
            {showInteractionForm && (
              <form onSubmit={handleAddInteraction} className="bg-slate-900 border-2 border-tf-primary/20 rounded-[3rem] p-12 space-y-8 animate-fade-in shadow-2xl relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-tf-primary/10 blur-[40px] -mr-16 -mt-16" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] ml-6">Interaction Type</label>
                    <select
                      value={interactionForm.type}
                      onChange={(e) => setInteractionForm((f) => ({ ...f, type: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-sm font-bold text-white focus:outline-none focus:border-tf-primary transition-all"
                    >
                      {INTERACTION_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-slate-900">{t.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] ml-6">Record Date</label>
                    <input
                      type="date"
                      value={interactionForm.date}
                      onChange={(e) => setInteractionForm((f) => ({ ...f, date: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-sm font-bold text-white focus:outline-none focus:border-tf-primary transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-3 relative z-10">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] ml-6">Engagement Notes</label>
                  <textarea
                    value={interactionForm.notes}
                    onChange={(e) => setInteractionForm((f) => ({ ...f, notes: e.target.value }))}
                    rows={4}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] px-10 py-8 text-sm font-bold text-white/90 placeholder-white/20 focus:outline-none focus:border-tf-primary transition-all resize-none italic"
                    placeholder="Enter details about the member interaction…"
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full py-6 bg-tf-primary hover:bg-white hover:text-tf-purple disabled:opacity-60 text-white text-[12px] font-black uppercase tracking-[0.3em] rounded-full transition-all shadow-2xl shadow-tf-primary/20 active:scale-95">
                  {loading ? 'STORING RECORD…' : 'SAVE ENGAGEMENT RECORD'}
                </button>
              </form>
            )}

            {(!donor?.interactions || donor.interactions.length === 0) ? (
              <div className="py-24 text-center space-y-4">
                 <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] italic leading-loose">No engagement history has been recorded for this member yet.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {[...donor.interactions].reverse().map((i) => (
                  <div key={i._id} className="group relative flex items-start justify-between gap-10 p-10 rounded-[3.5rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-tf-purple/5 transition-all duration-500">
                    <div className="flex items-start gap-10 flex-1">
                      <span className="px-6 py-3 bg-white border border-slate-100 text-tf-purple text-[9px] font-black uppercase tracking-widest rounded-2xl group-hover:bg-tf-purple group-hover:text-white transition-all shrink-0 shadow-sm italic">
                        {i.type}
                      </span>
                      <div className="space-y-4 flex-1">
                        <p className="text-sm font-black text-tf-purple leading-relaxed italic opacity-80 decoration-slate-200 decoration-offset-4 group-hover:opacity-100 transition-opacity underline group-hover:decoration-tf-primary/40">"{i.notes || i.note || 'No notes'}"</p>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">{new Date(i.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteInteraction(i._id)}
                      className="opacity-0 group-hover:opacity-100 text-[10px] font-black text-red-300 hover:text-red-600 uppercase tracking-widest transition-all p-3"
                    >
                      DELETE
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* Sync Controls */}
        <div className="lg:col-span-2 flex justify-center py-10">
           <button
             onClick={handleRecalculate}
             disabled={loading}
             className="px-12 py-5 border-2 border-slate-100 hover:border-tf-primary text-slate-300 hover:text-tf-primary text-[11px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-slate-50 transition-all disabled:opacity-50 italic"
           >
             Refresh Impact Analytics for this Member
           </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-tf-purple/95 backdrop-blur-3xl flex items-center justify-center z-[200] p-6 animate-fade-in font-sans">
          <div className="bg-white rounded-[4rem] shadow-2xl p-16 max-w-xl w-full space-y-12 relative overflow-hidden border border-white/20 text-center">
             <div className="absolute inset-0 bg-red-50/5 pointer-events-none" />
             <div className="w-24 h-24 bg-red-50 text-red-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner group transition-transform hover:scale-110">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
             </div>
             <div className="space-y-6">
               <h4 className="text-4xl font-black text-tf-purple tracking-tighter italic uppercase">Remove Member?</h4>
               <p className="text-slate-500 font-medium leading-relaxed px-6">
                 Warning: You are about to permanently remove <strong>{donor?.userId?.name}</strong> from the community registry. All historical data and pledge records will be lost.
               </p>
             </div>
             <div className="flex flex-col sm:flex-row gap-6 pt-6">
                <button onClick={handleDelete} disabled={loading} className="flex-[2] px-12 py-6 text-[12px] font-black text-white bg-red-600 hover:bg-slate-900 disabled:opacity-60 rounded-full transition-all uppercase tracking-[0.2em] shadow-2xl shadow-red-600/30 active:scale-95">
                  {loading ? 'REMOVING…' : 'CONFIRM REMOVAL'}
                </button>
                <button onClick={() => setConfirmDelete(false)} className="flex-1 px-12 py-6 text-[11px] font-black text-slate-400 border border-slate-100 hover:bg-slate-50 rounded-full transition-all uppercase tracking-[0.2em]">
                  CANCEL
                </button>
             </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>
    </div>
  );
}

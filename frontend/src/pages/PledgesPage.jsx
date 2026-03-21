import { useState, useEffect } from 'react';
import { useDonor } from '../context/DonorContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const FREQUENCIES = ['one-time', 'monthly', 'quarterly', 'annually'];

const statusColor = {
  active: 'bg-tf-green/10 text-tf-green border-tf-green/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]',
  fulfilled: 'bg-tf-pink/10 text-tf-pink border-tf-pink/20',
  cancelled: 'bg-slate-100 text-slate-400 border-slate-200',
  pending: 'bg-amber-100 text-amber-600 border-tf-purple/5',
};

function PledgeModal({ pledge, onClose, onSave, loading }) {
  const defaultForm = {
    amount: '',
    frequency: 'one-time',
    campaignId: '',
    notes: '',
    startDate: new Date().toISOString().split('T')[0],
  };

  const [form, setForm] = useState(
    pledge
      ? {
          amount: pledge.amount ?? '',
          frequency: pledge.frequency ?? 'one-time',
          campaignId: pledge.campaign ?? '',
          notes: pledge.notes ?? '',
          startDate: pledge.startDate
            ? new Date(pledge.startDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
        }
      : defaultForm
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      amount: Number(form.amount),
      frequency: form.frequency,
      startDate: form.startDate,
      notes: form.notes || undefined,
    };
    if (form.campaignId) payload.campaign = form.campaignId;
    onSave(payload);
  };

  const inputCls = "w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-5 text-[14px] font-bold text-tf-purple focus:outline-none focus:border-tf-pink transition-all shadow-inner placeholder:text-slate-300";

  return (
    <div className="fixed inset-0 bg-tf-purple/60 backdrop-blur-3xl flex items-center justify-center z-[100] animate-fade-in p-6">
      <div className="bg-white rounded-[4rem] border border-white/20 shadow-2xl p-16 max-w-2xl w-full space-y-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-tf-pink/5 blur-[50px] -mr-16 -mt-16 group-hover:opacity-100 transition-opacity" />
        <div className="space-y-4 text-center">
          <h4 className="text-4xl lg:text-5xl font-black text-tf-purple tracking-tighter italic uppercase underline decoration-tf-pink/20 underline-offset-8">
            {pledge?._id ? 'Adjust Pledge' : 'New Commitment'}
          </h4>
          <p className="text-slate-400 text-sm font-black uppercase tracking-[0.3em] italic">Humanitarian Support Planning</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-6">Pledge Amount (LKR)</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={(e) => setForm({...form, amount: e.target.value})}
                required
                placeholder="Target Amount"
                className={inputCls}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-6">Donation Frequency</label>
              <select
                name="frequency"
                value={form.frequency}
                onChange={(e) => setForm({...form, frequency: e.target.value})}
                className={inputCls + " appearance-none cursor-pointer pr-12"}
              >
                {FREQUENCIES.map((f) => (
                  <option key={f} value={f}>{f.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-6">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={(e) => setForm({...form, startDate: e.target.value})}
              className={inputCls}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-6">Personal Notes (Optional)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={(e) => setForm({...form, notes: e.target.value})}
              rows={3}
              placeholder="Any specific requests for this pledge…"
              className={inputCls + " resize-none p-8 italic font-medium text-slate-600"}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-tf-purple transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-6 bg-tf-pink hover:bg-tf-purple text-white text-[12px] font-black uppercase tracking-[0.3em] rounded-full transition-all shadow-2xl shadow-tf-pink/30 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'PROCESSING…' : 'AUTHORIZE PLEDGE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PledgesPage() {
  const {
    donorProfile,
    pledges,
    loading,
    error,
    fetchProfile,
    fetchPledges,
    createPledge,
    updatePledge,
    deletePledge,
  } = useDonor();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editPledge, setEditPledge] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const profile = donorProfile || (await fetchProfile());
        if (profile?._id) await fetchPledges(profile._id);
      } catch {
        // profile may not exist yet
      } finally {
        setInitialFetchDone(true);
      }
    };
    load();
  }, [donorProfile, fetchProfile, fetchPledges]);

  const handleCreate = async (data) => {
    setLocalError('');
    try {
      await createPledge(donorProfile._id, data);
      setShowCreateModal(false);
      setSuccess('Your pledge has been successfully registered.');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Deployment failed.');
    }
  };

  const handleUpdate = async (data) => {
    setLocalError('');
    try {
      await updatePledge(donorProfile._id, editPledge._id, data);
      setEditPledge(null);
      setSuccess('Pledge amount updated successfully.');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Modification rejected.');
    }
  };

  const handleDelete = async (pledgeId) => {
    setLocalError('');
    try {
      await deletePledge(donorProfile._id, pledgeId);
      setConfirmDelete(null);
      setSuccess('Pledge record removed from your profile.');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Revocation failed.');
    }
  };

  if (!initialFetchDone && loading) return <LoadingSpinner />;

  return (
    <div className="space-y-12 animate-fade-in max-w-[1700px] mx-auto pb-24 font-sans selection:bg-tf-pink selection:text-white">
      
      {/* Cinematic Strategy Header */}
      <div className="relative p-12 lg:p-16 bg-tf-purple rounded-[4rem] overflow-hidden shadow-2xl group text-white border border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1600')] opacity-5 blur-sm scale-110 group-hover:scale-100 transition-transform duration-1000 grayscale" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-tf-pink/10 blur-[130px] -mr-48 -mt-48 opacity-40 animate-pulse" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <span className="w-2.5 h-2.5 rounded-full bg-tf-pink shadow-[0_0_20px_rgba(230,0,126,0.8)] animate-pulse" />
                 <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic opacity-60">Verified Humanitarian Support History</p>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic tracking-tight">Active <span className="text-tf-pink">Pledge </span> Commitments</h2>
           </div>
           {donorProfile && (
             <button
               onClick={() => { setShowCreateModal(true); setSuccess(''); setLocalError(''); }}
               className="px-12 py-6 bg-tf-pink hover:bg-white hover:text-tf-purple text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-3xl transition-all shadow-2xl shadow-tf-pink/20 active:scale-95 hover:translate-x-1"
             >
               + Start New Pledge
             </button>
           )}
        </div>
      </div>

      {(localError || error) && (
        <ErrorAlert message={localError || error} onDismiss={() => setLocalError('')} />
      )}
      
      {success && (
        <div className="bg-tf-green/10 border border-tf-green/20 text-tf-green text-[11px] font-black uppercase tracking-widest px-10 py-6 rounded-full animate-fade-in w-fit mx-auto text-center shadow-lg">
          {success}
        </div>
      )}

      {!donorProfile && (
        <div className="bg-slate-900 rounded-[4rem] p-16 shadow-2xl border border-white/5 text-white flex flex-col items-center text-center space-y-10 group overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-tf-pink/10 blur-[80px]" />
           <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-tf-pink border border-white/5 shadow-inner scale-110">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
           </div>
           <div className="space-y-4 relative z-10">
             <h3 className="text-4xl font-black tracking-tighter italic uppercase">Identity Verification Required</h3>
             <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.4em] max-w-lg leading-relaxed italic">
               Please complete your profile details to begin managing your charitable pledges.
             </p>
           </div>
           <a href="/profile" className="px-12 py-6 bg-tf-pink group-hover:bg-tf-purple text-white rounded-full text-[12px] font-black uppercase tracking-[0.3em] transition-all shadow-3xl shadow-tf-pink/20 hover:scale-105 active:scale-95">
              Complete Profile Now
           </a>
        </div>
      )}

      {donorProfile && pledges.length === 0 && (
        <div className="bg-white rounded-[4rem] border-2 border-dashed border-slate-100 p-32 text-center space-y-12">
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200 shadow-inner rotate-3 hover:rotate-12 transition-transform duration-500">
             <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          </div>
          <p className="text-[12px] font-black text-slate-300 uppercase tracking-[0.4em] max-w-sm mx-auto leading-loose italic">
             No active pledge commitments found in your record.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-12 py-6 bg-slate-900 hover:bg-tf-pink text-white rounded-full text-[12px] font-black uppercase tracking-widest transition-all shadow-2xl active:scale-95"
          >
            Create Your First Pledge
          </button>
        </div>
      )}

      {pledges.length > 0 && (
        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden p-4">
          <div className="bg-slate-50 rounded-[3.5rem] border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200/50">
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic">Supported Cause</th>
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic text-center">Frequency</th>
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic text-center">Status</th>
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {pledges.map((pledge) => (
                  <tr key={pledge._id} className="group hover:bg-slate-50 transition-all cursor-default">
                    <td className="px-10 py-12">
                      <div className="space-y-3">
                        <span className="text-3xl font-black text-tf-purple tracking-tighter group-hover:text-tf-pink transition-colors italic tabular-nums">LKR {Number(pledge.amount).toLocaleString()}</span>
                        <div className="flex items-center gap-4">
                           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ID: {pledge._id.slice(-8).toUpperCase()}</span>
                           <span className="w-1.5 h-1.5 rounded-full bg-tf-pink/10" />
                           <span className="text-[10px] font-black text-tf-pink uppercase tracking-widest italic decoration-tf-pink underline underline-offset-4 decoration-1">{pledge.campaign?.title || pledge.campaign || 'Community Support'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-12 text-center">
                       <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 bg-slate-100 px-6 py-3 rounded-2xl group-hover:bg-tf-purple group-hover:text-white transition-all shadow-sm">{pledge.frequency}</span>
                    </td>
                    <td className="px-10 py-12 text-center">
                      <span className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-dashed transition-all ${statusColor[pledge.status]}`}>
                        {pledge.status}
                      </span>
                    </td>
                    <td className="px-10 py-12">
                      <div className="flex gap-8 items-center">
                        <button
                          onClick={() => { setEditPledge(pledge); setSuccess(''); setLocalError(''); }}
                          className="px-8 py-3 bg-white border-2 border-slate-100 hover:border-tf-pink hover:text-tf-pink text-tf-purple text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-sm hover:shadow-xl hover:shadow-tf-pink/10 active:scale-95 translate-y-0 hover:-translate-y-1"
                        >
                          Modify
                        </button>
                        <button
                          onClick={() => setConfirmDelete(pledge._id)}
                          className="text-[10px] font-black text-slate-300 hover:text-red-500 uppercase tracking-widest transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCreateModal && (
        <PledgeModal onClose={() => setShowCreateModal(false)} onSave={handleCreate} loading={loading} />
      )}
      {editPledge && (
        <PledgeModal pledge={editPledge} onClose={() => setEditPledge(null)} onSave={handleUpdate} loading={loading} />
      )}

      {/* Revocation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-tf-purple/95 backdrop-blur-3xl flex items-center justify-center z-[200] animate-fade-in p-6">
          <div className="bg-white rounded-[4rem] shadow-2xl p-16 max-w-xl w-full border border-white/20 text-center space-y-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-red-50/5 pointer-events-none" />
            <div className="w-24 h-24 bg-red-50 text-red-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner group transition-transform hover:rotate-12 duration-500 hover:scale-110">
               <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div className="space-y-6">
               <h4 className="text-4xl font-black text-tf-purple tracking-tighter italic uppercase">Remove Pledge?</h4>
               <p className="text-slate-500 font-medium leading-relaxed px-6 italic font-sans">
                 Warning: This action will permanently remove this pledge from your donation records.
               </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-tf-purple transition-colors">Go Back</button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={loading}
                className="flex-[2] py-6 text-[12px] font-black uppercase tracking-[0.2em] text-white bg-red-500 hover:bg-slate-900 rounded-full shadow-2xl shadow-red-500/30 active:scale-95 transition-all"
              >
                {loading ? 'REMOVING…' : 'CONFIRM REMOVAL'}
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

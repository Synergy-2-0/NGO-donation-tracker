import { useState, useEffect } from 'react';
import { useDonor } from '../context/DonorContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const FREQUENCIES = ['one-time', 'monthly', 'quarterly', 'annually'];

const statusBadgeStyle = {
  active: 'bg-tf-green/10 text-tf-green border-tf-green/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]',
  fulfilled: 'bg-tf-primary/10 text-tf-primary border-tf-primary/20',
  cancelled: 'bg-slate-100 text-slate-400 border-slate-200',
  pending: 'bg-amber-100 text-amber-600 border-tf-purple/5',
};

const inputCls = "w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-tf-purple focus:outline-none focus:border-tf-primary transition-all shadow-inner placeholder:text-slate-300";

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

  return (
    <div className="fixed inset-0 bg-tf-purple/60 backdrop-blur-3xl flex items-center justify-center z-[100] animate-fade-in p-6">
      <div className="bg-white rounded-[4rem] border border-white/20 shadow-2xl p-16 max-w-2xl w-full space-y-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-tf-primary/5 blur-[50px] -mr-16 -mt-16 group-hover:opacity-100 transition-opacity" />
        <div className="space-y-4 text-center">
          <h4 className="text-4xl lg:text-5xl font-black text-tf-purple tracking-tighter italic uppercase underline decoration-tf-primary/20 underline-offset-8">
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
              className="flex-[2] py-6 bg-tf-primary hover:bg-tf-purple text-white text-[12px] font-black uppercase tracking-[0.3em] rounded-full transition-all shadow-2xl shadow-tf-primary/30 active:scale-95 disabled:opacity-50"
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
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#1E293B] tracking-tight">
            Impact <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Pledges</span>
          </h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Manage your active commitments and recurring support.</p>
        </div>
        {donorProfile && (
          <button
            onClick={() => { setShowCreateModal(true); setSuccess(''); setLocalError(''); }}
            className="px-6 py-2.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-black transition-all shadow-xl active:scale-95 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            Initialize Pledge
          </button>
        )}
      </div>

      {(localError || error) && (
        <ErrorAlert message={localError || error} onDismiss={() => setLocalError('')} />
      )}
      
      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold px-6 py-4 rounded-2xl shadow-sm animate-pulse">
          {success}
        </div>
      )}

      {!donorProfile && (
        <div className="bg-indigo-900 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-indigo-200">
            <div className="w-20 h-20 bg-white/10 rounded-[24px] flex items-center justify-center shrink-0">
                <svg className="w-10 h-10 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div>
                <h3 className="text-xl font-black mb-2 tracking-tight">Registry Required</h3>
                <p className="text-indigo-200 text-sm leading-relaxed max-w-lg mb-6">
                    You must first establish your donor identity in the synergy ecosystem before committing to pledges.
                </p>
                <a href="/profile" className="inline-block py-3 px-8 bg-white text-indigo-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-black/10">
                    Create Profile
                </a>
            </div>
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
            className="px-12 py-6 bg-slate-900 hover:bg-tf-primary text-white rounded-full text-[12px] font-black uppercase tracking-widest transition-all shadow-2xl active:scale-95"
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
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic">Supported Cause / Amount</th>
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic text-center">Frequency</th>
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic text-center">Status</th>
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                {pledges.map((pledge) => (
                    <tr key={pledge._id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-10 py-6">
                            <div>
                                <p className="text-lg font-black text-gray-800 tracking-tight">LKR {Number(pledge.amount).toLocaleString()}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">General Support</p>
                            </div>
                        </td>
                        <td className="px-10 py-6 text-center">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-tighter rounded-md border border-gray-200">
                                {pledge.frequency}
                            </span>
                        </td>
                        <td className="px-10 py-6 text-center">
                            <span
                            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                statusBadgeStyle[pledge.status] || 'bg-gray-50 text-gray-400 border-gray-100'
                            }`}
                            >
                            {pledge.status}
                            </span>
                        </td>
                        <td className="px-10 py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-gray-700">{new Date(pledge.startDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</p>
                                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-1">Registry Date</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => { setEditPledge(pledge); setSuccess(''); setLocalError(''); }}
                                        className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-sm border border-indigo-100"
                                        title="Edit Pledge"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete(pledge._id)}
                                        className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all active:scale-95 shadow-sm border border-rose-100"
                                        title="Delete Pledge"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals integrated with logic */}
      {showCreateModal && (
        <PledgeModal onClose={() => setShowCreateModal(false)} onSave={handleCreate} loading={loading} />
      )}

      {editPledge && (
        <PledgeModal pledge={editPledge} onClose={() => setEditPledge(null)} onSave={handleUpdate} loading={loading} />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] shadow-2xl p-10 max-w-sm w-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-rose-100 italic">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </div>
                <h4 className="text-2xl font-black text-gray-800 tracking-tight mb-4">Terminate Pledge</h4>
                <p className="text-sm text-gray-400 font-medium leading-relaxed mb-10">
                You are about to remove this active commitment from your registry. This action is irreversible.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => handleDelete(confirmDelete)}
                        disabled={loading}
                        className="flex-1 py-4 bg-rose-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95"
                    >
                        {loading ? 'Erasing...' : 'Confirm'}
                    </button>
                    <button
                        onClick={() => setConfirmDelete(null)}
                        className="flex-1 py-4 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all active:scale-95"
                    >
                        Abort
                    </button>
                </div>
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

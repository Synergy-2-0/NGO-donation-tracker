import { useState, useEffect } from 'react';
import { useDonor } from '../context/DonorContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const FREQUENCIES = ['one-time', 'monthly', 'quarterly', 'annually'];

const statusBadgeStyle = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  fulfilled: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  cancelled: 'bg-rose-50 text-rose-600 border-rose-100',
  pending: 'bg-amber-50 text-amber-600 border-amber-100',
};

const defaultForm = {
  amount: '',
  frequency: 'one-time',
  campaignId: '',
  notes: '',
  startDate: new Date().toISOString().split('T')[0],
};

function PledgeModal({ pledge, onClose, onSave, loading }) {
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

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

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
    <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] shadow-2xl p-10 max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className="relative z-10">
            <h4 className="text-2xl font-black text-gray-800 tracking-tight mb-8 uppercase tracking-widest text-[10px]">
                {pledge?._id ? 'Modify Commitment' : 'New Impact Pledge'}
            </h4>

            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">
                Amount (LKR)
                </label>
                <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
                min="1"
                placeholder="5000"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all font-black"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">
                    Frequency
                    </label>
                    <select
                    name="frequency"
                    value={form.frequency}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold capitalize"
                    >
                    {FREQUENCIES.map((f) => (
                        <option key={f} value={f}>
                        {f}
                        </option>
                    ))}
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">
                    Commencement
                    </label>
                    <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-xs focus:outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold"
                    />
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">
                Campaign Taxonomy <span className="text-gray-300 normal-case font-medium italic select-none ml-1">(Optional)</span>
                </label>
                <input
                name="campaignId"
                value={form.campaignId}
                onChange={handleChange}
                placeholder="Leave blank for general"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 font-semibold"
                />
            </div>

            <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Impact Notes</label>
                <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={2}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 resize-none font-medium"
                />
            </div>

            <div className="flex gap-4 pt-4">
                 <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                >
                    {loading ? 'Processing...' : pledge?._id ? 'Update Mission' : 'Commit Pledge'}
                </button>
                <button
                type="button"
                onClick={onClose}
                className="px-6 py-4 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all active:scale-95"
                >
                Discard
                </button>
            </div>
            </form>
        </div>
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
  }, []);

  const handleCreate = async (data) => {
    setLocalError('');
    try {
      await createPledge(donorProfile._id, data);
      setShowCreateModal(false);
      setSuccess('Pledge created successfully.');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to create pledge.');
    }
  };

  const handleUpdate = async (data) => {
    setLocalError('');
    try {
      await updatePledge(donorProfile._id, editPledge._id, data);
      setEditPledge(null);
      setSuccess('Pledge updated successfully.');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to update pledge.');
    }
  };

  const handleDelete = async (pledgeId) => {
    setLocalError('');
    try {
      await deletePledge(donorProfile._id, pledgeId);
      setConfirmDelete(null);
      setSuccess('Pledge removed.');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to remove pledge.');
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
            className="px-6 py-3 bg-emerald-600 shadow-xl shadow-emerald-100 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-95 flex items-center gap-2"
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
        <div className="bg-white/80 backdrop-blur-md p-20 rounded-[40px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl mx-auto flex items-center justify-center text-gray-300 mb-8 border border-gray-100 group hover:rotate-6 transition-transform">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </div>
            <h3 className="text-2xl font-black text-[#1E293B] mb-2 tracking-tight">Zero Commitments Detected</h3>
            <p className="text-gray-400 text-sm font-medium mb-10 max-w-sm mx-auto">Your list of active pledges is empty. Start a new mission to track your recurring impact.</p>
            <button
                onClick={() => setShowCreateModal(true)}
                className="px-10 py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
            >
                Initialize First Pledge
            </button>
        </div>
      )}

      {pledges.length > 0 && (
        <div className="bg-white/80 backdrop-blur-md rounded-[32px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                <tr className="text-left text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black border-b border-gray-50">
                    <th className="px-10 py-6">Mission Details</th>
                    <th className="px-10 py-6">Frequency</th>
                    <th className="px-10 py-6">Governance Status</th>
                    <th className="px-10 py-6">Commencement</th>
                    <th className="px-10 py-6 text-right">Operational Actions</th>
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
                        <td className="px-10 py-6">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-tighter rounded-md border border-gray-200">
                                {pledge.frequency}
                            </span>
                        </td>
                        <td className="px-10 py-6">
                            <span
                            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                statusBadgeStyle[pledge.status] || 'bg-gray-50 text-gray-400 border-gray-100'
                            }`}
                            >
                            {pledge.status}
                            </span>
                        </td>
                        <td className="px-10 py-6">
                            <p className="text-sm font-bold text-gray-700">{new Date(pledge.startDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</p>
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-1">Registry Date</p>
                        </td>
                        <td className="px-10 py-6 text-right">
                            <div className="flex gap-3 justify-end">
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
        <PledgeModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreate}
          loading={loading}
        />
      )}

      {editPledge && (
        <PledgeModal
          pledge={editPledge}
          onClose={() => setEditPledge(null)}
          onSave={handleUpdate}
          loading={loading}
        />
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
    </div>
  );
}

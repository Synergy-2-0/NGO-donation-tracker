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
    <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] shadow-2xl p-10 max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

        <div className="relative z-10">
          <h4 className="text-2xl font-black text-gray-800 tracking-tight mb-8 uppercase tracking-widest text-[10px]">
            {pledge?._id ? 'Modify Commitment' : 'New Impact Pledge'}
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#7C2D12] uppercase tracking-wide mb-1">
                Amount (LKR)
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
                min="1"
                className="w-full border border-orange-200 bg-orange-50/40 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7C2D12] uppercase tracking-wide mb-1">
                Frequency
              </label>
              <select
                name="frequency"
                value={form.frequency}
                onChange={handleChange}
                className="w-full border border-orange-200 bg-orange-50/40 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
              >
                {FREQUENCIES.map((f) => (
                  <option key={f} value={f}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7C2D12] uppercase tracking-wide mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full border border-orange-200 bg-orange-50/40 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7C2D12] uppercase tracking-wide mb-1">
                Campaign ID{' '}
                <span className="text-gray-400 text-xs font-normal normal-case">(optional)</span>
              </label>
              <input
                name="campaignId"
                value={form.campaignId}
                onChange={handleChange}
                placeholder="Leave blank for general donation"
                className="w-full border border-orange-200 bg-orange-50/40 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7C2D12] uppercase tracking-wide mb-1">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={2}
                className="w-full border border-orange-200 bg-orange-50/40 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none transition"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-[#7C2D12] border border-orange-200 hover:bg-orange-50 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm text-white bg-[#DC2626] hover:bg-red-700 disabled:opacity-60 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Saving...' : 'Save Pledge'}
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
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500">
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Frequency</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Start Date</th>
                <th className="px-5 py-3 font-medium">Notes</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pledges.map((pledge) => (
                <tr key={pledge._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-semibold text-gray-800">
                    LKR {Number(pledge.amount).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 capitalize text-gray-600">{pledge.frequency}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[pledge.status] || 'bg-gray-100 text-gray-600'
                        }`}
                    >
                      {pledge.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {new Date(pledge.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-gray-500 max-w-xs truncate">
                    {pledge.notes || '—'}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => { setEditPledge(pledge); setSuccess(''); setLocalError(''); }}
                        className="text-[#DC2626] hover:text-red-700 text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDelete(pledge._id)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

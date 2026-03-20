import { useState, useEffect } from 'react';
import { useDonor } from '../context/DonorContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const FREQUENCIES = ['one-time', 'monthly', 'quarterly', 'annually'];

const statusColor = {
  active: 'bg-green-100 text-green-700',
  fulfilled: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
        <h4 className="text-base font-semibold text-gray-800 mb-5">
          {pledge?._id ? 'Edit Pledge' : 'New Pledge'}
        </h4>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (LKR)
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
              min="1"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frequency
            </label>
            <select
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign ID{' '}
              <span className="text-gray-400 text-xs font-normal">(optional)</span>
            </label>
            <input
              name="campaignId"
              value={form.campaignId}
              onChange={handleChange}
              placeholder="Leave blank for general donation"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg font-medium"
            >
              {loading ? 'Saving...' : 'Save Pledge'}
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pledges</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your recurring and one-time donation pledges.</p>
        </div>
        {donorProfile && (
          <button
            onClick={() => { setShowCreateModal(true); setSuccess(''); setLocalError(''); }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            + New Pledge
          </button>
        )}
      </div>

      {(localError || error) && (
        <ErrorAlert message={localError || error} onDismiss={() => setLocalError('')} />
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {!donorProfile && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-4 py-3 rounded-lg">
          Please{' '}
          <a href="/profile" className="font-semibold underline">
            create a donor profile
          </a>{' '}
          first to manage pledges.
        </div>
      )}

      {donorProfile && pledges.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <p className="text-gray-400 text-sm mb-3">You haven&apos;t made any pledges yet.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
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
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        statusColor[pledge.status] || 'bg-gray-100 text-gray-600'
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
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
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

      {/* Create Modal */}
      {showCreateModal && (
        <PledgeModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreate}
          loading={loading}
        />
      )}

      {/* Edit Modal */}
      {editPledge && (
        <PledgeModal
          pledge={editPledge}
          onClose={() => setEditPledge(null)}
          onSave={handleUpdate}
          loading={loading}
        />
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h4 className="text-base font-semibold text-gray-800 mb-2">Delete Pledge?</h4>
            <p className="text-sm text-gray-500 mb-5">
              This pledge will be permanently deleted and cannot be recovered.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
              >
                Keep It
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={loading}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded-lg font-medium"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

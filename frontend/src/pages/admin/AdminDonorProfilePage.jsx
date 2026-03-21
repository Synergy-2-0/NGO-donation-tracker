import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminDonor } from '../../context/AdminDonorContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';

const INTERACTION_TYPES = ['email', 'call', 'meeting', 'event', 'other'];

const pledgeStatusBadge = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  fulfilled: 'bg-orange-100 text-orange-700',
  cancelled: 'bg-red-100 text-red-600',
};

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
      <h3 className="text-base font-semibold text-[#7C2D12] border-b border-orange-100 pb-2">{title}</h3>
      {children}
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
      // Pledges and analytics are non-fatal — missing data is fine
      fetchDonorPledges(id).then((p) => setPledges(p || [])).catch(() => {});
      fetchDonorAnalytics(id).then((a) => setAnalytics(a)).catch(() => {});
    } catch {
      // fetchDonorById failed — context error state already set
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
      setSuccess('Donor updated successfully.');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to update donor.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDonor(id);
      navigate('/admin/donors');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to delete donor.');
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
      setSuccess('Interaction recorded.');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to add interaction.');
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
      setLocalError(err.response?.data?.message || 'Failed to delete interaction.');
    }
  };

  const handleRecalculate = async () => {
    try {
      const updated = await recalculateAnalytics(id);
      setAnalytics(updated);
      setSuccess('Analytics recalculated.');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to recalculate.');
    }
  };

  const inputCls = 'w-full border border-orange-200 bg-orange-50/40 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition';

  if (loading && !donor) return <LoadingSpinner />;
  if (!donor && !loading) return (
    <div className="text-center py-20 text-gray-400">Donor not found.</div>
  );

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => navigate('/admin/donors')} className="text-xs text-[#DC2626] hover:underline mb-1">
            ← Back to Donors
          </button>
          <h2 className="text-2xl font-bold text-[#7C2D12]">
            {donor?.userId?.name || 'Donor Profile'}
          </h2>
          <p className="text-sm text-gray-500">{donor?.userId?.email}</p>
        </div>
        <div className="flex gap-3">
          {!editing && (
            <button
              onClick={() => { setEditing(true); setSuccess(''); }}
              className="px-4 py-2 bg-[#DC2626] hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Edit
            </button>
          )}
          <button
            onClick={() => setConfirmDelete(true)}
            className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {(localError || error) && (
        <ErrorAlert message={localError || error} onDismiss={() => { setLocalError(''); setError(null); }} />
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Analytics Summary */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Donated', value: `LKR ${Number(analytics.totalDonated ?? 0).toLocaleString()}` },
            { label: 'Donations', value: analytics.donationCount ?? 0 },
            { label: 'Avg Donation', value: `LKR ${Number(analytics.averageDonation ?? 0).toLocaleString()}` },
            { label: 'Retention Score', value: `${analytics.retentionScore ?? 0}%` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className="text-xl font-bold text-[#DC2626]">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Profile Info / Edit Form */}
      <Section title="Profile Information">
        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#7C2D12] uppercase tracking-wide mb-1">Phone</label>
                <input className={inputCls} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+94771234567" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#7C2D12] uppercase tracking-wide mb-1">City</label>
                <input className={inputCls} value={form.address?.city} onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, city: e.target.value } }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#7C2D12] uppercase tracking-wide mb-1">Country</label>
                <input className={inputCls} value={form.address?.country} onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, country: e.target.value } }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#7C2D12] uppercase tracking-wide mb-1">Postal Code</label>
                <input className={inputCls} value={form.address?.postalCode} onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, postalCode: e.target.value } }))} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-[#7C2D12] uppercase tracking-wide mb-1">Street Address</label>
                <input className={inputCls} value={form.address?.street} onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, street: e.target.value } }))} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-[#7C2D12] uppercase tracking-wide mb-1">Preferred Causes <span className="font-normal text-gray-400 normal-case">(comma-separated)</span></label>
                <input className={inputCls} value={form.preferredCauses} onChange={(e) => setForm((f) => ({ ...f, preferredCauses: e.target.value }))} placeholder="education, health" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-[#7C2D12] uppercase tracking-wide mb-1">Bio</label>
                <textarea className={`${inputCls} resize-none`} rows={3} value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={loading} className="px-5 py-2 bg-[#DC2626] hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="px-5 py-2 border border-orange-200 hover:bg-orange-50 text-[#7C2D12] text-sm font-medium rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {[
              ['Phone', donor?.phone],
              ['Country', donor?.address?.country],
              ['City', donor?.address?.city],
              ['Postal Code', donor?.address?.postalCode],
              ['Street', donor?.address?.street],
              ['Status', donor?.status],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-gray-400 text-xs mb-0.5">{label}</p>
                <p className="font-medium text-gray-800 capitalize">{value || '—'}</p>
              </div>
            ))}
            {donor?.preferredCauses?.length > 0 && (
              <div className="col-span-2">
                <p className="text-gray-400 text-xs mb-1">Preferred Causes</p>
                <div className="flex flex-wrap gap-2">
                  {donor.preferredCauses.map((c) => (
                    <span key={c} className="px-2 py-0.5 bg-orange-50 text-[#7C2D12] text-xs rounded-full font-medium">{c}</span>
                  ))}
                </div>
              </div>
            )}
            {donor?.bio && (
              <div className="col-span-2">
                <p className="text-gray-400 text-xs mb-0.5">Bio</p>
                <p className="font-medium text-gray-800">{donor.bio}</p>
              </div>
            )}
          </div>
        )}
      </Section>

      {/* Pledge History */}
      <Section title="Pledge History">
        {pledges.length === 0 ? (
          <p className="text-sm text-gray-400">No pledges found for this donor.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs border-b border-gray-100">
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Frequency</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Start Date</th>
                  <th className="pb-2 font-medium">Campaign</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pledges.map((p) => (
                  <tr key={p._id}>
                    <td className="py-2.5 font-semibold text-gray-800">LKR {Number(p.amount).toLocaleString()}</td>
                    <td className="py-2.5 capitalize text-gray-600">{p.frequency}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${pledgeStatusBadge[p.status] || 'bg-gray-100 text-gray-500'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-gray-500">{new Date(p.startDate).toLocaleDateString()}</td>
                    <td className="py-2.5 text-gray-500">{p.campaign?.title || p.campaign || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Interaction Tracking */}
      <Section title="Interaction History">
        <div className="flex justify-between items-center -mt-2 mb-2">
          <span className="text-xs text-gray-400">{donor?.interactions?.length || 0} interactions recorded</span>
          <button
            onClick={() => setShowInteractionForm((v) => !v)}
            className="text-xs text-[#DC2626] font-semibold hover:underline"
          >
            {showInteractionForm ? 'Cancel' : '+ Add Interaction'}
          </button>
        </div>

        {showInteractionForm && (
          <form onSubmit={handleAddInteraction} className="bg-orange-50/40 border border-orange-100 rounded-lg p-4 space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#7C2D12] uppercase tracking-wide mb-1">Type</label>
                <select
                  value={interactionForm.type}
                  onChange={(e) => setInteractionForm((f) => ({ ...f, type: e.target.value }))}
                  className={inputCls}
                >
                  {INTERACTION_TYPES.map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#7C2D12] uppercase tracking-wide mb-1">Date</label>
                <input
                  type="date"
                  value={interactionForm.date}
                  onChange={(e) => setInteractionForm((f) => ({ ...f, date: e.target.value }))}
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#7C2D12] uppercase tracking-wide mb-1">Notes</label>
              <textarea
                value={interactionForm.notes}
                onChange={(e) => setInteractionForm((f) => ({ ...f, notes: e.target.value }))}
                rows={2}
                required
                className={`${inputCls} resize-none`}
                placeholder="Briefly describe the interaction…"
              />
            </div>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-[#DC2626] hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
              {loading ? 'Saving…' : 'Save Interaction'}
            </button>
          </form>
        )}

        {(!donor?.interactions || donor.interactions.length === 0) ? (
          <p className="text-sm text-gray-400">No interactions recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {[...donor.interactions].reverse().map((i) => (
              <div key={i._id} className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 px-2 py-0.5 bg-orange-50 text-[#7C2D12] text-xs rounded-full font-medium capitalize shrink-0">
                    {i.type}
                  </span>
                  <div>
                    <p className="text-sm text-gray-700">{i.note || '—'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(i.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteInteraction(i._id)}
                  className="text-xs text-gray-400 hover:text-red-600 shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Analytics recalculate */}
      <div className="flex justify-end">
        <button
          onClick={handleRecalculate}
          disabled={loading}
          className="text-xs text-[#DC2626] border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          Recalculate Analytics
        </button>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h4 className="text-base font-semibold text-gray-800 mb-2">Delete Donor?</h4>
            <p className="text-sm text-gray-500 mb-5">
              This will permanently remove <strong>{donor?.userId?.name}</strong> and all their records.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDelete(false)} className="px-4 py-2 text-sm text-[#7C2D12] border border-orange-200 hover:bg-orange-50 rounded-lg font-medium">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={loading} className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-lg font-medium">
                {loading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

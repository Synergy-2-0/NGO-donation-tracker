import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePartnerOperations } from '../context/PartnerOperationsContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const MILESTONE_STATUSES = ['pending', 'in-progress', 'completed'];

const statusStyle = {
  pending: 'bg-gray-100 text-gray-700 border-gray-200',
  'in-progress': 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

function toTitle(value) {
  return (value || '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function asDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString();
}

const emptyMilestone = {
  title: '',
  description: '',
  dueDate: '',
  status: 'pending',
  evidenceUrl: '',
};

export default function AgreementMilestonesPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const {
    currentAgreement,
    milestones,
    loading,
    error,
    setError,
    fetchAgreementById,
    fetchMilestones,
    createMilestone,
    updateMilestone,
    deleteMilestone,
  } = usePartnerOperations();

  const isAdminLike = user?.role === 'admin' || user?.role === 'ngo-admin';

  const [statusFilter, setStatusFilter] = useState('all');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyMilestone);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchAgreementById(id).catch(() => {});
    fetchMilestones({ agreementId: id }).catch(() => {});
  }, [id, fetchAgreementById, fetchMilestones]);

  const visibleMilestones = useMemo(() => {
    if (statusFilter === 'all') return milestones;
    return milestones.filter((item) => item.status === statusFilter);
  }, [milestones, statusFilter]);

  const progress = useMemo(() => {
    if (!milestones.length) return 0;
    const completedCount = milestones.filter((item) => item.status === 'completed').length;
    return Math.round((completedCount / milestones.length) * 100);
  }, [milestones]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyMilestone);
    setFormError('');
    setSuccess('');
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title || '',
      description: item.description || '',
      dueDate: item.dueDate?.slice(0, 10) || '',
      status: item.status || 'pending',
      evidenceUrl: item.evidence?.url || '',
    });
    setFormError('');
    setSuccess('');
    setShowModal(true);
  };

  const validateForm = () => {
    if (!form.title.trim()) return 'Milestone title is required.';
    if (!form.dueDate) return 'Due date is required.';
    if (form.evidenceUrl && !/^https?:\/\//i.test(form.evidenceUrl)) return 'Evidence URL must start with http:// or https://';
    return '';
  };

  const onSave = async (event) => {
    event.preventDefault();
    const validation = validateForm();
    if (validation) {
      setFormError(validation);
      return;
    }

    if (!currentAgreement?._id || !currentAgreement?.campaignId) {
      setFormError('Agreement context is missing campaign linkage.');
      return;
    }

    const payload = {
      agreementId: currentAgreement._id,
      campaignId: currentAgreement.campaignId?._id || currentAgreement.campaignId,
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate,
      status: form.status,
    };

    if (form.evidenceUrl.trim()) {
      payload.evidence = { url: form.evidenceUrl.trim() };
    }

    try {
      if (editing) {
        await updateMilestone(editing._id, payload);
        setSuccess('Milestone updated successfully.');
      } else {
        await createMilestone(payload);
        setSuccess('Milestone created successfully.');
      }
      setFormError('');
      setShowModal(false);
      setError('');
      await fetchMilestones({ agreementId: id });
    } catch (err) {
      setSuccess('');
      setFormError(err.response?.data?.message || 'Failed to save milestone.');
    }
  };

  const onDelete = async (milestoneId) => {
    const confirmed = window.confirm('Delete this milestone?');
    if (!confirmed) return;

    try {
      await deleteMilestone(milestoneId);
      setSuccess('Milestone deleted successfully.');
      setError('');
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.message || 'Failed to delete milestone.');
    }
  };

  if (loading && !currentAgreement) {
    return <LoadingSpinner message="Loading milestones..." />;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Agreement Milestones</h2>
          <p className="text-sm text-gray-500 mt-1">
            Drive execution with due-date tracking, completion status, and evidence links.
          </p>
        </div>
        <div className="flex gap-2">
          {isAdminLike && (
            <button
              onClick={openCreate}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              New Milestone
            </button>
          )}
          <Link to="/partner/agreements" className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
            Back to Agreements
          </Link>
        </div>
      </div>

      {currentAgreement && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Agreement</p>
            <p className="text-lg font-bold text-gray-800 mt-1">{currentAgreement.title}</p>
            <p className="text-sm text-gray-500 mt-1">{toTitle(currentAgreement.agreementType)} • {toTitle(currentAgreement.status)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Milestone Progress</p>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-sm text-gray-600 mt-2">{progress}% completed ({milestones.filter((item) => item.status === 'completed').length}/{milestones.length})</p>
          </div>
        </div>
      )}

      {(error || success) && (
        <div className="space-y-2">
          <ErrorAlert message={error} onDismiss={() => setError('')} />
          {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-lg">{success}</div>}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="all">All statuses</option>
            {MILESTONE_STATUSES.map((status) => (
              <option key={status} value={status}>{toTitle(status)}</option>
            ))}
          </select>
        </div>
      </div>

      {visibleMilestones.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center text-sm text-gray-500">
          No milestones found for this agreement.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-left text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Milestone</th>
                <th className="px-5 py-3 font-medium">Due Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Evidence</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleMilestones.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{item.description || '-'}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{asDate(item.dueDate)}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs border ${statusStyle[item.status] || statusStyle.pending}`}>
                      {toTitle(item.status)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {item.evidence?.url ? (
                      <a href={item.evidence.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                        View evidence
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {isAdminLike ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="px-3 py-1.5 rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(item._id)}
                          className="px-3 py-1.5 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Read-only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">{editing ? 'Edit Milestone' : 'New Milestone'}</h3>
              <button onClick={() => setShowModal(false)} className="text-xl text-gray-500">&times;</button>
            </div>
            <form onSubmit={onSave} className="p-5 space-y-4">
              {formError && <ErrorAlert message={formError} onDismiss={() => setFormError('')} />}

              <label className="block text-sm">
                <span className="text-gray-700">Title</span>
                <input
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2"
                  required
                />
              </label>

              <label className="block text-sm">
                <span className="text-gray-700">Description</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 min-h-24"
                />
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block text-sm">
                  <span className="text-gray-700">Due Date</span>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2"
                    required
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-gray-700">Status</span>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2"
                  >
                    {MILESTONE_STATUSES.map((status) => (
                      <option key={status} value={status}>{toTitle(status)}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block text-sm">
                <span className="text-gray-700">Evidence URL (optional)</span>
                <input
                  value={form.evidenceUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, evidenceUrl: e.target.value }))}
                  className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2"
                  placeholder="https://evidence-link"
                />
              </label>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400">
                  {loading ? 'Saving...' : editing ? 'Save Changes' : 'Create Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePartnerOperations } from '../context/PartnerOperationsContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const AGREEMENT_TYPES = ['financial', 'in-kind', 'skills-based', 'marketing', 'hybrid'];
const STATUS_OPTIONS = ['draft', 'pending', 'active', 'completed', 'cancelled', 'suspended'];

const badgeStyle = {
  draft: 'bg-gray-100 text-gray-700 border-gray-200',
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
  suspended: 'bg-amber-50 text-amber-700 border-amber-200',
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

function asMoney(value) {
  return `LKR ${Number(value || 0).toLocaleString()}`;
}

const emptyAgreementForm = {
  partnerId: '',
  campaignId: '',
  title: '',
  description: '',
  agreementType: 'financial',
  startDate: '',
  endDate: '',
  totalValue: '',
  terms: '',
  documents: [{ name: '', url: '' }],
};

export default function PartnerAgreementsPage() {
  const { user } = useAuth();
  const {
    agreements,
    loading,
    error,
    setError,
    fetchAllAgreements,
    fetchMyPartnerAgreements,
    fetchPartnerProfile,
    createAgreement,
    updateAgreement,
    updateAgreementStatus,
    approveAgreement,
    deleteAgreement,
  } = usePartnerOperations();

  const isAdminLike = user?.role === 'admin' || user?.role === 'ngo-admin';

  const [myPartner, setMyPartner] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [success, setSuccess] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAgreement, setEditingAgreement] = useState(null);
  const [form, setForm] = useState(emptyAgreementForm);
  const [formError, setFormError] = useState('');
  
  const location = useLocation();

  useEffect(() => {
    if (isAdminLike) {
      fetchAllAgreements().catch(() => {});
    } else {
      fetchMyPartnerAgreements().catch(() => {});
      fetchPartnerProfile()
        .then((profile) => {
          setMyPartner(profile || null);
        })
        .catch(() => {
          setMyPartner(null);
        });
    }
  }, [isAdminLike, fetchAllAgreements, fetchMyPartnerAgreements, fetchPartnerProfile]);

  useEffect(() => {
    // Both admin and partners need campaigns to map agreements
    api
      .get('/api/campaigns')
      .then(({ data }) => {
        const rows = Array.isArray(data) ? data : data?.data || [];
        setCampaigns(rows);
      })
      .catch(() => {
        setCampaigns([]);
      });
  }, []);

  useEffect(() => {
      // Auto-open create modal if coming from marketplace
      if (location.state?.prefillCampaignId && myPartner?._id && campaigns.length > 0) {
          openCreate();
          setForm(f => ({ ...f, campaignId: location.state.prefillCampaignId }));
          // Clear state to avoid reopening on remount
          window.history.replaceState({}, document.title);
      }
  }, [location.state?.prefillCampaignId, myPartner, campaigns]);

  const filteredAgreements = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return agreements.filter((agreement) => {
      if (statusFilter !== 'all' && agreement.status !== statusFilter) return false;
      if (typeFilter !== 'all' && agreement.agreementType !== typeFilter) return false;

      if (!keyword) return true;

      const haystack = [
        agreement.title,
        agreement.description,
        agreement.agreementType,
        agreement.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [agreements, search, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    const total = agreements.length;
    const active = agreements.filter((a) => a.status === 'active').length;
    const completed = agreements.filter((a) => a.status === 'completed').length;
    const value = agreements.reduce((sum, a) => sum + Number(a.totalValue || 0), 0);

    return { total, active, completed, value };
  }, [agreements]);

  const openCreate = () => {
    setSuccess('');
    setFormError('');
    setEditingAgreement(null);
    setForm({
      ...emptyAgreementForm,
      partnerId: myPartner?._id || '',
    });
    setShowCreateModal(true);
  };

  const openEdit = (agreement) => {
    setSuccess('');
    setFormError('');
    setEditingAgreement(agreement);
    setForm({
      partnerId: agreement.partnerId?._id || agreement.partnerId || myPartner?._id || '',
      campaignId: agreement.campaignId?._id || agreement.campaignId || '',
      title: agreement.title || '',
      description: agreement.description || '',
      agreementType: agreement.agreementType || 'financial',
      startDate: agreement.startDate?.slice(0, 10) || '',
      endDate: agreement.endDate?.slice(0, 10) || '',
      totalValue: String(agreement.totalValue || ''),
      terms: agreement.terms || '',
      documents: Array.isArray(agreement.documents) && agreement.documents.length
        ? agreement.documents.map((doc) => ({ name: doc.name || '', url: doc.url || '' }))
        : [{ name: '', url: '' }],
    });
    setShowCreateModal(true);
  };

  const validateForm = () => {
    if (!form.partnerId) return 'Partner profile is required.';
    if (!form.campaignId) return 'Campaign is required.';
    if (!form.title.trim()) return 'Title is required.';
    if (!form.description.trim()) return 'Description is required.';
    if (!form.startDate || !form.endDate) return 'Start and end dates are required.';
    if (new Date(form.endDate) < new Date(form.startDate)) return 'End date must be after start date.';
    if (Number(form.totalValue) < 0 || Number.isNaN(Number(form.totalValue))) return 'Total value must be 0 or greater.';
    if (!form.terms.trim()) return 'Terms are required.';

    const hasBadDoc = form.documents.some((doc) => (doc.name || doc.url) && (!doc.name.trim() || !doc.url.trim()));
    if (hasBadDoc) return 'Each document must include both name and URL.';

    return '';
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const validationMessage = validateForm();
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    const payload = {
      partnerId: form.partnerId,
      campaignId: form.campaignId,
      title: form.title.trim(),
      description: form.description.trim(),
      agreementType: form.agreementType,
      startDate: form.startDate,
      endDate: form.endDate,
      totalValue: Number(form.totalValue),
      terms: form.terms.trim(),
      documents: form.documents
        .filter((doc) => doc.name.trim() && doc.url.trim())
        .map((doc) => ({ name: doc.name.trim(), url: doc.url.trim() })),
    };

    try {
      if (editingAgreement) {
        await updateAgreement(editingAgreement._id, payload);
        setSuccess('Agreement updated successfully.');
      } else {
        await createAgreement(payload);
        setSuccess(user?.role === 'partner' ? 'Agreement submitted for approval.' : 'Agreement created successfully.');
      }
      setShowCreateModal(false);
      setFormError('');
      setError('');
    } catch (err) {
      setSuccess('');
      setFormError(err.response?.data?.message || 'Failed to save agreement.');
    }
  };

  const onStatusChange = async (agreementId, status) => {
    try {
      await updateAgreementStatus(agreementId, status);
      setSuccess('Agreement status updated.');
      setError('');
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const onDelete = async (agreementId) => {
    const confirmed = window.confirm('Delete this agreement? Active agreements cannot be deleted.');
    if (!confirmed) return;

    try {
      await deleteAgreement(agreementId);
      setSuccess('Agreement deleted successfully.');
      setError('');
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.message || 'Failed to delete agreement.');
    }
  };

  const onApprove = async (agreementId) => {
    try {
      await approveAgreement(agreementId);
      setSuccess('Agreement approved and activated.');
      setError('');
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.message || 'Failed to approve agreement.');
    }
  };

  const updateDoc = (index, key, value) => {
    setForm((prev) => {
      const docs = [...prev.documents];
      docs[index] = { ...docs[index], [key]: value };
      return { ...prev, documents: docs };
    });
  };

  const addDoc = () => {
    setForm((prev) => ({ ...prev, documents: [...prev.documents, { name: '', url: '' }] }));
  };

  const removeDoc = (index) => {
    setForm((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, idx) => idx !== index),
    }));
  };

  if (loading && agreements.length === 0) {
    return <LoadingSpinner message="Loading agreements..." />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Partner Agreements</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track agreements, monitor lifecycle status, and drill into milestones for delivery execution.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(isAdminLike || (user?.role === 'partner' && myPartner)) && (
            <button
              onClick={openCreate}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              New Agreement
            </button>
          )}
          <Link to="/partners" className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
            Back to Partners
          </Link>
        </div>
      </div>

      {!myPartner && !isAdminLike && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-4 py-3 text-sm">
          No partner profile found for this account. Create your profile first from the partners section.
        </div>
      )}

      {(error || success) && (
        <div className="space-y-2">
          <ErrorAlert message={error} onDismiss={() => setError('')} />
          {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-lg">{success}</div>}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Agreements" value={stats.total} />
        <MetricCard label="Active" value={stats.active} />
        <MetricCard label="Completed" value={stats.completed} />
        <MetricCard label="Total Value" value={asMoney(stats.value)} />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, type, status"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>{toTitle(status)}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All agreement types</option>
          {AGREEMENT_TYPES.map((type) => (
            <option key={type} value={type}>{toTitle(type)}</option>
          ))}
        </select>
      </div>

      {filteredAgreements.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-sm text-gray-500">
          No agreements match your current filters.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-left text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Period</th>
                <th className="px-5 py-3 font-medium">Value</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAgreements.map((agreement) => (
                <tr key={agreement._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="font-semibold text-gray-800">{agreement.title}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">{agreement.description}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{toTitle(agreement.agreementType)}</td>
                  <td className="px-5 py-3 text-gray-600">
                    {asDate(agreement.startDate)} - {asDate(agreement.endDate)}
                  </td>
                  <td className="px-5 py-3 text-gray-700 font-medium">{asMoney(agreement.totalValue)}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs border ${badgeStyle[agreement.status] || badgeStyle.draft}`}>
                      {toTitle(agreement.status)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/partner/agreements/${agreement._id}/milestones`}
                        className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs"
                      >
                        Milestones
                      </Link>

                      {(isAdminLike || user?.role === 'admin') && (
                        <button
                          onClick={() => openEdit(agreement)}
                          className="px-3 py-1.5 rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs"
                        >
                          Edit
                        </button>
                      )}

                      {(isAdminLike || user?.role === 'admin') && (
                        agreement.status === 'pending' ? (
                          <button
                            onClick={() => onApprove(agreement._id)}
                            className="px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs"
                          >
                            Approve
                          </button>
                        ) : null
                      )}

                      {(isAdminLike || user?.role === 'admin') && (
                        <select
                          value={agreement.status}
                          onChange={(e) => onStatusChange(agreement._id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-md px-2 py-1"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>{toTitle(status)}</option>
                          ))}
                        </select>
                      )}

                      {(isAdminLike || user?.role === 'admin') && (
                        <button
                          onClick={() => onDelete(agreement._id)}
                          className="px-3 py-1.5 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">{editingAgreement ? 'Edit Agreement' : 'New Agreement'}</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-xl text-gray-500">&times;</button>
            </div>
            <form onSubmit={onSubmit} className="p-5 space-y-4">
              {formError && <ErrorAlert message={formError} onDismiss={() => setFormError('')} />}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block text-sm">
                  <span className="text-gray-700">Partner</span>
                  {user?.role === 'partner' ? (
                    <input
                      value={myPartner?.organizationName || 'My Partner Profile'}
                      disabled
                      className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50"
                    />
                  ) : (
                    <input
                      value={form.partnerId}
                      disabled
                      placeholder="Partner ID (auto-selected)"
                      className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-xs"
                    />
                  )}
                </label>

                <label className="block text-sm">
                  <span className="text-gray-700">Campaign</span>
                  <select
                    value={form.campaignId}
                    onChange={(e) => setForm((prev) => ({ ...prev, campaignId: e.target.value }))}
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select campaign</option>
                    {campaigns.map((campaign) => (
                      <option key={campaign._id} value={campaign._id}>
                        {campaign.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm md:col-span-2">
                  <span className="text-gray-700">Title</span>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2"
                    required
                  />
                </label>

                <label className="block text-sm md:col-span-2">
                  <span className="text-gray-700">Description</span>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 min-h-24"
                    required
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-gray-700">Agreement Type</span>
                  <select
                    value={form.agreementType}
                    onChange={(e) => setForm((prev) => ({ ...prev, agreementType: e.target.value }))}
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2"
                  >
                    {AGREEMENT_TYPES.map((type) => (
                      <option key={type} value={type}>{toTitle(type)}</option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm">
                  <span className="text-gray-700">Total Value</span>
                  <input
                    type="number"
                    min="0"
                    value={form.totalValue}
                    onChange={(e) => setForm((prev) => ({ ...prev, totalValue: e.target.value }))}
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2"
                    required
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-gray-700">Start Date</span>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2"
                    required
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-gray-700">End Date</span>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2"
                    required
                  />
                </label>

                <label className="block text-sm md:col-span-2">
                  <span className="text-gray-700">Terms</span>
                  <textarea
                    value={form.terms}
                    onChange={(e) => setForm((prev) => ({ ...prev, terms: e.target.value }))}
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 min-h-20"
                    required
                  />
                </label>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-700">Documents</h4>
                  <button
                    type="button"
                    onClick={addDoc}
                    className="text-xs px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200"
                  >
                    Add Document
                  </button>
                </div>

                {form.documents.map((doc, index) => (
                  <div key={`doc-${index}`} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-2">
                    <input
                      value={doc.name}
                      onChange={(e) => updateDoc(index, 'name', e.target.value)}
                      placeholder="Document name"
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    />
                    <input
                      value={doc.url}
                      onChange={(e) => updateDoc(index, 'url', e.target.value)}
                      placeholder="https://document-url"
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeDoc(index)}
                      disabled={form.documents.length === 1}
                      className="text-xs px-3 py-2 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400">
                  {loading ? 'Saving...' : editingAgreement ? 'Save Changes' : 'Create Agreement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">{label}</p>
      <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
}

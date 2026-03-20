import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePartner } from '../context/PartnerContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import PartnerFormModal from '../components/PartnerFormModal';

const pageSizeOptions = [5, 10, 20];

const statusColor = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  suspended: 'bg-red-100 text-red-700',
};

const verificationColor = {
  verified: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
};

const toTitle = (value) =>
  value
    .split('_')
    .join(' ')
    .split('-')
    .join(' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase());

export default function PartnersPage() {
  const { user } = useAuth();
  const {
    partners,
    loading,
    error,
    setError,
    fetchPartners,
    createPartner,
    updatePartner,
    deletePartner,
    approvePartner,
  } = usePartner();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [orgTypeFilter, setOrgTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [deleteId, setDeleteId] = useState('');
  const [success, setSuccess] = useState('');

  const canCreate = user?.role === 'partner';
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchPartners().catch(() => {});
  }, [fetchPartners]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, verificationFilter, orgTypeFilter, sortBy, pageSize]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    let rows = partners.filter((partner) => {
      if (statusFilter !== 'all' && partner.status !== statusFilter) return false;
      if (verificationFilter !== 'all' && partner.verificationStatus !== verificationFilter) return false;
      if (orgTypeFilter !== 'all' && partner.organizationType !== orgTypeFilter) return false;

      if (!keyword) return true;
      const haystack = [
        partner.organizationName,
        partner.industry,
        partner.contactPerson?.name,
        partner.contactPerson?.email,
        partner.address?.city,
        ...(partner.csrFocus || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(keyword);
    });

    rows = rows.sort((a, b) => {
      if (sortBy === 'name-asc') return (a.organizationName || '').localeCompare(b.organizationName || '');
      if (sortBy === 'name-desc') return (b.organizationName || '').localeCompare(a.organizationName || '');
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    return rows;
  }, [partners, search, statusFilter, verificationFilter, orgTypeFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pagedPartners = filtered.slice((page - 1) * pageSize, page * pageSize);

  const canMutatePartner = (partner) => isAdmin || String(partner.userId) === String(user?.id);

  const onCreate = async (payload) => {
    try {
      await createPartner(payload);
      setShowCreateModal(false);
      setSuccess('Partner created successfully.');
      setError('');
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.message || 'Failed to create partner.');
    }
  };

  const onUpdate = async (payload) => {
    try {
      await updatePartner(editingPartner._id, payload);
      setEditingPartner(null);
      setSuccess('Partner updated successfully.');
      setError('');
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.message || 'Failed to update partner.');
    }
  };

  const onDelete = async () => {
    try {
      await deletePartner(deleteId);
      setDeleteId('');
      setSuccess('Partner deleted successfully.');
      setError('');
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.message || 'Failed to delete partner.');
    }
  };

  const onApprove = async (partnerId) => {
    try {
      await approvePartner(partnerId);
      setSuccess('Partner approved successfully.');
      setError('');
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.message || 'Failed to approve partner.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Partners</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage partnerships, verification, and impact visibility.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isAdmin && (
            <Link
              to="/partners/verification"
              className="px-3 py-2 text-sm bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg font-medium"
            >
              Pending Approvals
            </Link>
          )}
          {canCreate && (
            <button
              onClick={() => {
                setShowCreateModal(true);
                setSuccess('');
                setError('');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg"
            >
              + New Partner
            </button>
          )}
        </div>
      </div>

      {(error || success) && (
        <div className="space-y-2">
          <ErrorAlert message={error} onDismiss={() => setError('')} />
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
              {success}
            </div>
          )}
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by organization, city, industry, CSR focus..."
            className="lg:col-span-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <select value={verificationFilter} onChange={(e) => setVerificationFilter(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="all">All Verification</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
          <select value={orgTypeFilter} onChange={(e) => setOrgTypeFilter(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="all">All Org Types</option>
            <option value="corporate">Corporate</option>
            <option value="foundation">Foundation</option>
            <option value="government">Government</option>
            <option value="individual">Individual</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Sort</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm">
              <option value="newest">Newest</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Rows</label>
            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm">
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && partners.length === 0 ? (
        <LoadingSpinner message="Loading partners..." />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
          <p className="text-sm text-gray-500">No partners found for the selected filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-500">
                  <th className="px-5 py-3 font-medium">Organization</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Budget</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Verification</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pagedPartners.map((partner) => (
                  <tr key={partner._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="font-semibold text-gray-800">{partner.organizationName}</div>
                      <div className="text-xs text-gray-500">{partner.industry} • {partner.address?.city || 'Unknown city'}</div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{toTitle(partner.organizationType || 'unknown')}</td>
                    <td className="px-5 py-3 text-gray-600">
                      <div>{partner.contactPerson?.name || '—'}</div>
                      <div className="text-xs text-gray-500">{partner.contactPerson?.email || '—'}</div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      LKR {Number(partner.partnershipPreferences?.budgetRange?.min || 0).toLocaleString()} - {Number(partner.partnershipPreferences?.budgetRange?.max || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[partner.status] || 'bg-gray-100 text-gray-700'}`}>
                        {toTitle(partner.status || 'unknown')}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${verificationColor[partner.verificationStatus] || 'bg-gray-100 text-gray-700'}`}>
                        {toTitle(partner.verificationStatus || 'pending')}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-3 text-xs font-medium">
                        <Link to={`/partners/${partner._id}`} className="text-blue-600 hover:text-blue-800">View</Link>
                        <Link to={`/partners/${partner._id}/impact`} className="text-indigo-600 hover:text-indigo-800">Impact</Link>
                        {canMutatePartner(partner) && (
                          <button
                            onClick={() => {
                              setEditingPartner(partner);
                              setSuccess('');
                              setError('');
                            }}
                            className="text-amber-600 hover:text-amber-800"
                          >
                            Edit
                          </button>
                        )}
                        {canMutatePartner(partner) && (
                          <button
                            onClick={() => setDeleteId(partner._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        )}
                        {isAdmin && partner.verificationStatus === 'pending' && (
                          <button
                            onClick={() => onApprove(partner._id)}
                            className="text-emerald-600 hover:text-emerald-800"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-sm">
            <p className="text-gray-500">Showing {pagedPartners.length} of {filtered.length} partners</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-md"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 border border-gray-200 rounded-md text-gray-700">Page {page} / {totalPages}</span>
              <button
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-md"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <PartnerFormModal
          loading={loading}
          onClose={() => setShowCreateModal(false)}
          onSave={onCreate}
        />
      )}

      {editingPartner && (
        <PartnerFormModal
          partner={editingPartner}
          loading={loading}
          onClose={() => setEditingPartner(null)}
          onSave={onUpdate}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h4 className="text-base font-semibold text-gray-800 mb-2">Delete Partner?</h4>
            <p className="text-sm text-gray-500 mb-5">
              This will mark the partner as inactive in the backend and remove it from this list view.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId('')}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={onDelete}
                disabled={loading}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded-lg"
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

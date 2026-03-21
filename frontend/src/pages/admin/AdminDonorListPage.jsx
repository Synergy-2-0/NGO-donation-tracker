import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminDonor } from '../../context/AdminDonorContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';

const statusBadge = (status) => {
  const cls = {
    active:   'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-500',
    deleted:  'bg-red-100 text-red-600',
  };
  return cls[status] || 'bg-gray-100 text-gray-500';
};

const ROWS_PER_PAGE = 10;

export default function AdminDonorListPage() {
  const navigate = useNavigate();
  const { donors, loading, error, setError, fetchDonors, deleteDonor } = useAdminDonor();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDonors().catch(() => {});
  }, [fetchDonors]);

  const filtered = donors.filter((d) => {
    const name  = d.userId?.name?.toLowerCase() || '';
    const email = d.userId?.email?.toLowerCase() || '';
    const q = search.toLowerCase();
    const matchSearch = !q || name.includes(q) || email.includes(q);
    const matchStatus = !statusFilter || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated  = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const handleDelete = async () => {
    setLocalError('');
    try {
      await deleteDonor(confirmDelete);
      setConfirmDelete(null);
      setSuccess('Donor deleted successfully.');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to delete donor.');
      setConfirmDelete(null);
    }
  };

  if (loading && donors.length === 0) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#7C2D12]">Donor Directory</h2>
        <p className="text-sm text-gray-500 mt-1">Manage all registered donors.</p>
      </div>

      {(localError || error) && (
        <ErrorAlert message={localError || error} onDismiss={() => { setLocalError(''); setError(null); }} />
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or email…"
          className="flex-1 min-w-[220px] border border-orange-200 bg-orange-50/40 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-orange-200 bg-orange-50/40 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          onClick={() => fetchDonors().catch(() => {})}
          className="px-4 py-2.5 bg-[#DC2626] hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr className="text-left text-gray-500">
              <th className="px-5 py-3 font-medium">Donor Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Phone</th>
              <th className="px-5 py-3 font-medium">Total Donated</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">
                  No donors found.
                </td>
              </tr>
            ) : (
              paginated.map((donor) => (
                <tr key={donor._id} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {donor.userId?.name || '—'}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{donor.userId?.email || '—'}</td>
                  <td className="px-5 py-3 text-gray-500">{donor.phone || '—'}</td>
                  <td className="px-5 py-3 font-semibold text-[#DC2626]">
                    {donor.analytics?.totalDonated != null
                      ? `LKR ${Number(donor.analytics.totalDonated).toLocaleString()}`
                      : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusBadge(donor.status)}`}>
                      {donor.status || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/admin/donors/${donor._id}`)}
                        className="text-[#DC2626] hover:text-red-700 text-xs font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => { setConfirmDelete(donor._id); setSuccess(''); }}
                        className="text-gray-400 hover:text-red-600 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {((page - 1) * ROWS_PER_PAGE) + 1}–{Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-orange-200 disabled:opacity-40 hover:bg-orange-50 transition-colors"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  p === page
                    ? 'bg-[#DC2626] text-white border-[#DC2626]'
                    : 'border-orange-200 hover:bg-orange-50'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-orange-200 disabled:opacity-40 hover:bg-orange-50 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h4 className="text-base font-semibold text-gray-800 mb-2">Delete Donor?</h4>
            <p className="text-sm text-gray-500 mb-5">
              This will permanently remove the donor record. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm text-[#7C2D12] border border-orange-200 hover:bg-orange-50 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-lg font-medium"
              >
                {loading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

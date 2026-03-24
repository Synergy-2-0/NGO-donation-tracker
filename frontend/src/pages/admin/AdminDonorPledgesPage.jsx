import { useState, useEffect } from 'react';
import { useAdminDonor } from '../../context/AdminDonorContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';

const statusBadge = {
  active:    'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  fulfilled: 'bg-orange-100 text-orange-700',
  cancelled: 'bg-red-100 text-red-600',
};

const ROWS_PER_PAGE = 12;

export default function AdminDonorPledgesPage() {
  const { pledges, loading, error, setError, fetchAllPledges } = useAdminDonor();
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchAllPledges().catch(() => {});
  }, [fetchAllPledges]);

  const filtered = pledges.filter((p) => {
    const donorName    = (p.donor?.user?.name || '').toLowerCase();
    const campaignTitle = (p.campaign?.title || p.campaign || '').toLowerCase();
    const q = search.toLowerCase();
    const matchSearch  = !q || donorName.includes(q) || campaignTitle.includes(q);
    const matchStatus  = !statusFilter || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated  = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const activePledges = pledges.filter((p) => p.status === 'active').length;
  const totalValue    = pledges.reduce((s, p) => s + (Number(p.amount) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#7C2D12]">Donor Pledges</h2>
        <p className="text-sm text-gray-500 mt-1">Monitor all donor pledges across all campaigns.</p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      {/* Summary */}
      {pledges.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-500 mb-1">Total Pledges</p>
            <p className="text-2xl font-bold text-[#DC2626]">{pledges.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-500 mb-1">Active Pledges</p>
            <p className="text-2xl font-bold text-green-600">{activePledges}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-500 mb-1">Total Pledge Value</p>
            <p className="text-2xl font-bold text-[#7C2D12]">LKR {totalValue.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by donor or campaign…"
          className="flex-1 min-w-[220px] border border-orange-200 bg-orange-50/40 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-orange-200 bg-orange-50/40 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          onClick={() => fetchAllPledges().catch(() => {})}
          className="px-4 py-2.5 bg-[#DC2626] hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Table */}
      {loading && pledges.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500">
                <th className="px-5 py-3 font-medium">Donor</th>
                <th className="px-5 py-3 font-medium">Campaign</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Frequency</th>
                <th className="px-5 py-3 font-medium">Start Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">
                    No pledges found.
                  </td>
                </tr>
              ) : (
                paginated.map((pledge, idx) => (
                  <tr key={pledge._id || idx} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-800">
                      {pledge.donor?.user?.name || '—'}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {pledge.campaign?.title || pledge.campaign || '—'}
                    </td>
                    <td className="px-5 py-3 font-semibold text-[#DC2626]">
                      LKR {Number(pledge.amount).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 capitalize text-gray-600">{pledge.frequency}</td>
                    <td className="px-5 py-3 text-gray-500">
                      {pledge.startDate ? new Date(pledge.startDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusBadge[pledge.status] || 'bg-gray-100 text-gray-500'}`}>
                        {pledge.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {((page - 1) * ROWS_PER_PAGE) + 1}–{Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 rounded-lg border border-orange-200 disabled:opacity-40 hover:bg-orange-50 transition-colors">← Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${p === page ? 'bg-[#DC2626] text-white border-[#DC2626]' : 'border-orange-200 hover:bg-orange-50'}`}
              >
                {p}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-lg border border-orange-200 disabled:opacity-40 hover:bg-orange-50 transition-colors">Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}

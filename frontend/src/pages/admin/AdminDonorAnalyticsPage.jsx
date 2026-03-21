import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminDonor } from '../../context/AdminDonorContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';

const SEGMENT_META = {
  new:     { label: 'New',     color: 'bg-blue-100 text-blue-700',    bar: 'bg-blue-400' },
  regular: { label: 'Regular', color: 'bg-green-100 text-green-700',  bar: 'bg-green-500' },
  major:   { label: 'Major',   color: 'bg-orange-100 text-[#7C2D12]', bar: 'bg-orange-500' },
  lapsed:  { label: 'Lapsed',  color: 'bg-gray-100 text-gray-600',    bar: 'bg-gray-400' },
  vip:     { label: 'VIP',     color: 'bg-red-100 text-[#DC2626]',    bar: 'bg-[#DC2626]' },
};

export default function AdminDonorAnalyticsPage() {
  const navigate = useNavigate();
  const { donors, segments, loading, error, setError, fetchDonors, fetchSegments } = useAdminDonor();

  useEffect(() => {
    fetchDonors().catch(() => {});
    fetchSegments().catch(() => {});
  }, [fetchDonors, fetchSegments]);

  // Compute top-level metrics from loaded donors
  const totalDonors    = donors.length;
  const activeDonors   = donors.filter((d) => d.status === 'active').length;
  const totalRaised    = donors.reduce((s, d) => s + (d.analytics?.totalDonated || 0), 0);
  const avgDonation    = totalDonors > 0
    ? donors.reduce((s, d) => s + (d.analytics?.averageDonation || 0), 0) / totalDonors
    : 0;

  // Normalise segments: API returns [{_id, count, totalDonated}] or a plain object
  const segmentCounts = (() => {
    if (Array.isArray(segments)) {
      return segments.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {});
    }
    if (segments && typeof segments === 'object') return segments;
    return donors.reduce((acc, d) => {
      const seg = d.segment || 'new';
      acc[seg] = (acc[seg] || 0) + 1;
      return acc;
    }, {});
  })();

  const segmentEntries = Object.entries(segmentCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = segmentEntries.length > 0 ? Math.max(...segmentEntries.map(([, v]) => v)) : 1;

  if (loading && donors.length === 0) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#7C2D12]">Donor Analytics</h2>
        <p className="text-sm text-gray-500 mt-1">Engagement metrics and donor segmentation overview.</p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Donors',     value: totalDonors,                        color: 'text-[#DC2626]' },
          { label: 'Active Donors',    value: activeDonors,                       color: 'text-green-600' },
          { label: 'Total Raised',     value: `LKR ${totalRaised.toLocaleString()}`, color: 'text-[#7C2D12]' },
          { label: 'Avg Donation',     value: `LKR ${Math.round(avgDonation).toLocaleString()}`, color: 'text-orange-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Segment Breakdown */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-[#7C2D12] mb-5">Donor Segments</h3>
        {segmentEntries.length === 0 ? (
          <p className="text-sm text-gray-400">No segment data available.</p>
        ) : (
          <div className="space-y-4">
            {segmentEntries.map(([seg, count]) => {
              const meta = SEGMENT_META[seg] || { label: seg, color: 'bg-gray-100 text-gray-600', bar: 'bg-gray-400' };
              const pct  = Math.round((count / maxCount) * 100);
              return (
                <div key={seg} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${meta.color}`}>
                      {meta.label}
                    </span>
                    <span className="font-semibold text-gray-700">{count} donor{count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${meta.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top Donors Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-[#7C2D12] mb-4">Top Donors by Contribution</h3>
        {donors.length === 0 ? (
          <p className="text-sm text-gray-400">No donor data loaded.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs border-b border-gray-100">
                <th className="pb-2 font-medium">#</th>
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Segment</th>
                <th className="pb-2 font-medium">Total Donated</th>
                <th className="pb-2 font-medium">Donations</th>
                <th className="pb-2 font-medium">Retention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[...donors]
                .sort((a, b) => (b.analytics?.totalDonated || 0) - (a.analytics?.totalDonated || 0))
                .slice(0, 10)
                .map((d, i) => {
                  const meta = SEGMENT_META[d.segment] || { label: d.segment || '—', color: 'bg-gray-100 text-gray-500' };
                  return (
                    <tr
                      key={d._id}
                      className="hover:bg-orange-50/30 transition-colors cursor-pointer"
                      onClick={() => navigate(`/admin/donors/${d._id}`)}
                    >
                      <td className="py-2.5 text-gray-400 font-medium">{i + 1}</td>
                      <td className="py-2.5 font-medium text-gray-800">{d.userId?.name || '—'}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${meta.color}`}>
                          {meta.label}
                        </span>
                      </td>
                      <td className="py-2.5 font-semibold text-[#DC2626]">
                        LKR {Number(d.analytics?.totalDonated || 0).toLocaleString()}
                      </td>
                      <td className="py-2.5 text-gray-600">{d.analytics?.donationCount ?? 0}</td>
                      <td className="py-2.5 text-gray-600">{d.analytics?.retentionScore ?? 0}%</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

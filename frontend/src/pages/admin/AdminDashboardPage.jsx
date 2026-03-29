import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdminDonor } from '../../context/AdminDonorContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const pledgeStatusColor = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-500',
    deleted: 'bg-red-100 text-red-600',
};

const SEGMENT_META = {
    new: { label: 'New', bar: 'bg-blue-400' },
    regular: { label: 'Regular', bar: 'bg-green-500' },
    major: { label: 'Major', bar: 'bg-orange-500' },
    lapsed: { label: 'Lapsed', bar: 'bg-gray-400' },
    vip: { label: 'VIP', bar: 'bg-[#DC2626]' },
};

function StatCard({ label, value, color, sub }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <p className={`text-3xl font-bold ${color}`}>{value ?? '—'}</p>
            {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
    );
}

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const { donors, segments, loading, fetchDonors, fetchSegments } = useAdminDonor();

    useEffect(() => {
        fetchDonors().catch(() => { });
        fetchSegments().catch(() => { });
    }, [fetchDonors, fetchSegments]);

    if (loading && donors.length === 0) return <LoadingSpinner />;

    // KPI calculations
    const totalDonors = donors.length;
    const activeDonors = donors.filter((d) => d.status === 'active').length;
    const inactiveDonors = donors.filter((d) => d.status === 'inactive').length;
    const totalRaised = donors.reduce((s, d) => s + (d.analytics?.totalDonated || 0), 0);

    // Normalise segments: API returns [{_id, count, totalDonated}] or a plain object
    const segmentCounts = (() => {
        if (Array.isArray(segments)) {
            return segments.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {});
        }
        if (segments && typeof segments === 'object') return segments;
        // Fall back to computing from donors list
        return donors.reduce((acc, d) => {
            const seg = d.segment || 'new';
            acc[seg] = (acc[seg] || 0) + 1;
            return acc;
        }, {});
    })();
    const segmentEntries = Object.entries(segmentCounts).sort((a, b) => b[1] - a[1]);
    const maxCount = segmentEntries.length > 0 ? Math.max(...segmentEntries.map(([, v]) => v)) : 1;

    // Recent 5 donors (last added)
    const recentDonors = [...donors].slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800">
                    {user?.role === 'ngo-admin' ? 'NGO Admin Dashboard' : 'Admin Dashboard'}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    {user?.role === 'ngo-admin' ? 'NGO operations overview and campaign management.' : 'Platform overview and donor management summary.'}
                </p>
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Donors"
                    value={totalDonors}
                    color="text-[#DC2626]"
                />
                <StatCard
                    label="Active Donors"
                    value={activeDonors}
                    color="text-green-600"
                    sub={`${inactiveDonors} inactive`}
                />
                <StatCard
                    label="Total Raised"
                    value={`LKR ${totalRaised.toLocaleString()}`}
                    color="text-[#7C2D12]"
                />
                <StatCard
                    label="Avg Donation"
                    value={
                        totalDonors > 0
                            ? `LKR ${Math.round(
                                donors.reduce((s, d) => s + (d.analytics?.averageDonation || 0), 0) / totalDonors
                            ).toLocaleString()}`
                            : '—'
                    }
                    color="text-orange-600"
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-base font-semibold text-gray-700 mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                    <Link
                        to="/admin/donors"
                        className="px-4 py-2 bg-red-50 text-[#DC2626] hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                    >
                        Donor Directory
                    </Link>
                    <Link
                        to="/admin/donors/pledges"
                        className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors"
                    >
                        All Pledges
                    </Link>
                    <Link
                        to="/admin/donor-analytics"
                        className="px-4 py-2 bg-orange-50 text-[#7C2D12] hover:bg-orange-100 rounded-lg text-sm font-medium transition-colors"
                    >
                        Donor Analytics
                    </Link>

                    <Link
                        to="/admin/campaign-dashboard"
                        className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors"
                    >
                        Manage Campaigns
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Donors */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-700">Recent Donors</h3>
                        <Link to="/admin/donors" className="text-sm text-[#DC2626] hover:underline">
                            View all →
                        </Link>
                    </div>
                    {recentDonors.length === 0 ? (
                        <p className="text-sm text-gray-400 py-4 text-center">No donors yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {recentDonors.map((donor) => (
                                <Link
                                    key={donor._id}
                                    to={`/admin/donors/${donor._id}`}
                                    className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-orange-50/60 transition-colors group"
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 group-hover:text-[#DC2626] truncate">
                                            {donor.userId?.name || 'Unknown'}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate">{donor.userId?.email || '—'}</p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-3 shrink-0">
                                        <span className="text-sm font-semibold text-[#7C2D12]">
                                            LKR {(donor.analytics?.totalDonated || 0).toLocaleString()}
                                        </span>
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${pledgeStatusColor[donor.status] || 'bg-gray-100 text-gray-500'
                                                }`}
                                        >
                                            {donor.status || 'active'}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Segment Breakdown */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-700">Donor Segments</h3>
                        <Link to="/admin/donor-analytics" className="text-sm text-[#DC2626] hover:underline">
                            Full analytics →
                        </Link>
                    </div>
                    {segmentEntries.length === 0 ? (
                        <p className="text-sm text-gray-400 py-4 text-center">No segment data.</p>
                    ) : (
                        <div className="space-y-4">
                            {segmentEntries.map(([seg, count]) => {
                                const meta = SEGMENT_META[seg] || { label: seg, bar: 'bg-gray-400' };
                                const pct = Math.round((count / maxCount) * 100);
                                return (
                                    <div key={seg}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">{meta.label}</span>
                                            <span className="text-gray-500">{count} donor{count !== 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-500 ${meta.bar}`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDonor } from '../context/DonorContext';
import LoadingSpinner from '../components/LoadingSpinner';

function StatCard({ label, value, color, bg }) {
  return (
    <div className={`${bg} rounded-xl border border-gray-100 shadow-sm p-5`}>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value ?? '—'}</p>
    </div>
  );
}

const pledgeStatusColor = {
  active: 'bg-green-100 text-green-700',
  fulfilled: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    donorProfile,
    analytics,
    pledges,
    fetchProfile,
    fetchAnalytics,
    fetchPledges,
    loading,
  } = useDonor();

  useEffect(() => {
    fetchProfile()
      .then((profile) => {
        if (profile?._id) {
          fetchAnalytics(profile._id).catch(() => {});
          fetchPledges(profile._id).catch(() => {});
        }
      })
      .catch(() => {});
  }, [fetchProfile, fetchAnalytics, fetchPledges]);

  if (loading && !donorProfile) return <LoadingSpinner />;

  const activePledges = pledges.filter((p) => p.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.name || 'Donor'} 👋
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Here&apos;s an overview of your donation activity.
        </p>
      </div>

      {/* No profile banner */}
      {!donorProfile && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-4 py-3 rounded-lg">
          You don&apos;t have a donor profile yet.{' '}
          <Link to="/profile" className="font-semibold underline">
            Create your profile
          </Link>{' '}
          to start pledging.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Donated"
          value={
            analytics?.totalDonations != null
              ? `LKR ${Number(analytics.totalDonations).toLocaleString()}`
              : null
          }
          color="text-blue-600"
          bg="bg-white"
        />
        <StatCard
          label="Campaigns Supported"
          value={analytics?.totalCampaigns ?? null}
          color="text-green-600"
          bg="bg-white"
        />
        <StatCard
          label="Active Pledges"
          value={pledges.length > 0 ? activePledges : null}
          color="text-purple-600"
          bg="bg-white"
        />
        <StatCard
          label="Total Pledges"
          value={pledges.length || null}
          color="text-orange-600"
          bg="bg-white"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-base font-semibold text-gray-700 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/profile"
            className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
          >
            Manage Profile
          </Link>
          {(user?.role === 'partner' || user?.role === 'admin') && (
            <Link
              to="/partners"
              className="px-4 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-sm font-medium transition-colors"
            >
              Manage Partners
            </Link>
          )}
          <Link
            to="/pledges"
            className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors"
          >
            New Pledge
          </Link>
          <Link
            to="/donations"
            className="px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-sm font-medium transition-colors"
          >
            Donation History
          </Link>
        </div>
      </div>

      {/* Recent Pledges */}
      {pledges.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-700">Recent Pledges</h3>
            <Link to="/pledges" className="text-sm text-blue-600 hover:underline">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Frequency</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Start Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pledges.slice(0, 5).map((pledge) => (
                  <tr key={pledge._id}>
                    <td className="py-2.5 font-semibold text-gray-800">
                      LKR {Number(pledge.amount).toLocaleString()}
                    </td>
                    <td className="py-2.5 capitalize text-gray-600">{pledge.frequency}</td>
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          pledgeStatusColor[pledge.status] || 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {pledge.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-gray-500">
                      {new Date(pledge.startDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

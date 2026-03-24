import { useEffect } from 'react';
import { useDonor } from '../context/DonorContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const statusColor = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  archived: 'bg-gray-100 text-gray-500',
};

export default function DonationHistoryPage() {
  const { donorProfile, transactions, loading, error, fetchProfile, fetchTransactions } =
    useDonor();

  useEffect(() => {
    const load = async () => {
      try {
        const profile = donorProfile || (await fetchProfile());
        if (profile?._id) await fetchTransactions(profile._id);
      } catch {
        // profile may not exist yet
      }
    };
    load();
  }, []);

  if (loading && transactions.length === 0) return <LoadingSpinner />;

  const completedTx = transactions.filter((t) => t.status === 'completed');
  const totalDonated = completedTx.reduce((sum, t) => sum + (t.amount || 0), 0);
  const uniqueCampaigns = new Set(
    transactions.map((t) => t.campaignId?._id || t.campaignId).filter(Boolean)
  ).size;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Donation History</h2>
        <p className="text-sm text-gray-500 mt-1">Track all your contributions to campaigns.</p>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Summary Cards */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-500 mb-1">Total Donated</p>
            <p className="text-2xl font-bold text-[#DC2626]">
              LKR {totalDonated.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-500 mb-1">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-800">{transactions.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-500 mb-1">Campaigns Supported</p>
            <p className="text-2xl font-bold text-green-600">{uniqueCampaigns}</p>
          </div>
        </div>
      )}

      {transactions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <p className="text-gray-400 text-sm">No donation history found.</p>
          <p className="text-gray-300 text-xs mt-1">
            Transactions will appear here after you complete a donation.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500">
                <th className="px-5 py-3 font-medium">Campaign</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {tx.campaignId?.title || tx.campaignId || '—'}
                  </td>
                  <td className="px-5 py-3 font-semibold text-[#DC2626]">
                    LKR {Number(tx.amount).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 capitalize text-gray-500">{tx.type || '—'}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        statusColor[tx.status] || 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {new Date(tx.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

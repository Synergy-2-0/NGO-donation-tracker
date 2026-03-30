import { useEffect } from 'react';
import { useDonor } from '../context/DonorContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const statusBadgeStyle = {
  completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  pending: 'bg-amber-50 text-amber-600 border-amber-100',
  failed: 'bg-rose-50 text-rose-600 border-rose-100',
  archived: 'bg-gray-50 text-gray-400 border-gray-100',
};

function HistoryStatCard({ label, value, color, icon }) {
  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
      <div className="relative z-10 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">{label}</p>
          <p className="text-xl font-black text-gray-800 tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}

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
  }, [donorProfile, fetchProfile, fetchTransactions]);

  if (loading && transactions.length === 0) return <LoadingSpinner />;

  const completedTx = transactions.filter((t) => t.status === 'completed');
  const totalDonated = completedTx.reduce((sum, t) => sum + (t.amount || 0), 0);
  const uniqueCampaigns = new Set(
    transactions.map((t) => t.campaignId?._id || t.campaignId).filter(Boolean)
  ).size;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#1E293B] tracking-tight">
            Contribution <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">History</span>
          </h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
            Tracking your legacy of impact in the synergy network.
          </p>
        </div>
        <button className="px-6 py-2.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-black transition-all shadow-xl active:scale-95 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export Full Ledger
        </button>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Stats Summary */}
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

      {/* Table Section */}
      <div className="bg-white/80 backdrop-blur-md rounded-[32px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden font-sans">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black border-b border-gray-50">
                <th className="px-10 py-6">Mission / Campaign</th>
                <th className="px-10 py-6">Contribution Amount</th>
                <th className="px-10 py-6 text-center">Payment Mode</th>
                <th className="px-10 py-6">Governance Status</th>
                <th className="px-10 py-6">Verification Date</th>
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
                        statusBadgeStyle[tx.status] || 'bg-gray-100 text-gray-600'
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
      </div>
    </div>
  );
}

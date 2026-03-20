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
  }, []);

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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <HistoryStatCard
            label="Historical Total"
            value={`LKR ${totalDonated.toLocaleString()}`}
            color="bg-indigo-600 shadow-indigo-200"
            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <HistoryStatCard
            label="Total Ledger Entries"
            value={transactions.length}
            color="bg-slate-800 shadow-slate-200"
            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          />
          <HistoryStatCard
            label="Causes Supported"
            value={uniqueCampaigns}
            color="bg-emerald-600 shadow-emerald-100"
            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
          />
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
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx._id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-10 py-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <span className="font-bold text-gray-800 tracking-tight truncate max-w-[200px]">
                                {tx.campaignId?.title || tx.campaignId || 'General Pool'}
                            </span>
                        </div>
                    </td>
                    <td className="px-10 py-6">
                        <span className="text-sm font-black text-indigo-600 tracking-tighter">
                            LKR {Number(tx.amount).toLocaleString()}
                        </span>
                    </td>
                    <td className="px-10 py-6 text-center">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-tight rounded-md border border-gray-100">
                            {tx.type || 'Direct'}
                        </span>
                    </td>
                    <td className="px-10 py-6">
                      <span
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                          statusBadgeStyle[tx.status] || 'bg-gray-50 text-gray-400 border-gray-100'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                        <p className="text-sm font-bold text-gray-700">
                             {new Date(tx.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                        </p>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-0.5">Finalized</p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan="5" className="px-10 py-24 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-200">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                        </div>
                        <p className="text-gray-400 font-bold text-sm tracking-tight mb-2">Registry Record Empty</p>
                        <p className="text-gray-300 text-xs font-medium">Historical donation data will be visualized here upon completion.</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

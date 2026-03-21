import { useEffect, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const statusBadgeStyle = {
  pending: 'bg-amber-50 text-amber-600 border-amber-100',
  completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  failed: 'bg-rose-50 text-rose-600 border-rose-100',
};

export default function TransactionsPage() {
  const { transactions, fetchTransactions, loading, error } = useFinance();
  const [ngoProfile, setNgoProfile] = useState(null);

  useEffect(() => {
    api.get('/api/partners/me/profile')
      .then(res => {
        setNgoProfile(res.data);
        fetchTransactions(res.data._id);
      })
      .catch(err => console.error("Error loading NGO profile:", err));
  }, [fetchTransactions]);

  if (loading && transactions.length === 0) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10 font-sans">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#1E293B] tracking-tight">
            Transaction <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Audit Registry</span>
          </h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
             Detailed record of all income streams and verification events.
          </p>
        </div>
        <div className="flex gap-2">
            <button className="px-6 py-2.5 bg-gray-900 shadow-xl shadow-black/10 hover:bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Export Registry (CSV)
            </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-[32px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black border-b border-gray-50">
                <th className="px-10 py-6">Unique ID Hash</th>
                <th className="px-10 py-6">Timestamp</th>
                <th className="px-10 py-6">Inbound Amount</th>
                <th className="px-10 py-6">Payment Mode</th>
                <th className="px-10 py-6">Governance Status</th>
                <th className="px-10 py-6 text-right">Audit Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx._id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-10 py-6">
                        <span className="font-mono text-[10px] text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 font-bold">
                            #{tx.payHereOrderId || tx._id.slice(-8).toUpperCase()}
                        </span>
                    </td>
                    <td className="px-10 py-6 whitespace-nowrap">
                        <p className="text-sm font-bold text-gray-700">{new Date(tx.createdAt).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'})}</p>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-0.5">Finalized</p>
                    </td>
                    <td className="px-10 py-6 font-semibold">
                        <span className="text-sm font-black text-indigo-600 tracking-tighter">
                            {tx.currency} {Number(tx.amount).toLocaleString()}
                        </span>
                    </td>
                    <td className="px-10 py-6">
                         <span className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-tight rounded-md border border-gray-100">
                            {tx.paymentMethod || 'Synergy Pay'}
                        </span>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusBadgeStyle[tx.status] || 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                        <button className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-sm">
                            Verify Detail
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-10 py-24 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-200 border border-gray-100">
                             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <p className="text-gray-400 font-bold text-sm">Registry Record Empty.</p>
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

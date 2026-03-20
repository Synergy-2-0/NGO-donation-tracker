import { useEffect, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const statusColor = {
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Transaction Registry</h2>
          <p className="text-gray-500 text-sm mt-1">
             Detailed record of all income received and archived records.
          </p>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium shadow-sm transition-colors">
                Export to CSV
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">Transaction ID</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Method</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-blue-600">
                        {tx.payHereOrderId || tx._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {tx.currency} {Number(tx.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[tx.status] || 'bg-gray-100 text-gray-600'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {tx.paymentMethod}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:underline font-medium">View Detail</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    No transactions found in your records.
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

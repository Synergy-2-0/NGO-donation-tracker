import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

function StatCard({ label, value, color, bg }) {
  return (
    <div className={`${bg} rounded-xl border border-gray-100 shadow-sm p-6`}>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value ?? '—'}</p>
    </div>
  );
}

export default function FinanceDashboard() {
  const { user } = useAuth();
  const { summary, fetchSummary, loading, error } = useFinance();
  const [ngoProfile, setNgoProfile] = useState(null);

  useEffect(() => {
    // Fetch NGO profile for the current user
    api.get('/api/partners/me/profile')
      .then(res => {
        setNgoProfile(res.data);
        fetchSummary(res.data._id);
      })
      .catch(err => console.error("Error loading NGO profile:", err));
  }, [fetchSummary]);

  if (loading && !summary) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Financial Overview</h2>
        <p className="text-gray-500 text-sm mt-1">
          {ngoProfile?.organizationName || 'Your NGO'} &bull; Real-time tracking of income and allocations.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Income (Completed)"
          value={summary?.totalIncome ? `LKR ${Number(summary.totalIncome).toLocaleString()}` : 'LKR 0'}
          color="text-green-600"
          bg="bg-white"
        />
        <StatCard
          label="Total Allocations"
          value={summary?.totalAllocated ? `LKR ${Number(summary.totalAllocated).toLocaleString()}` : 'LKR 0'}
          color="text-blue-600"
          bg="bg-white"
        />
        <StatCard
          label="Available Balance"
          value={summary ? `LKR ${(Number(summary.totalIncome || 0) - Number(summary.totalAllocated || 0)).toLocaleString()}` : 'LKR 0'}
          color="text-indigo-600"
          bg="bg-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Mini-List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Allocation Summary</h3>
          {summary?.allocationsByCategory?.length > 0 ? (
            <div className="space-y-4">
              {summary.allocationsByCategory.map(item => (
                <div key={item._id} className="flex flex-col">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-gray-600">{item._id}</span>
                    <span className="font-semibold text-gray-800">LKR {Number(item.total).toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(item.total / summary.totalIncome) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-6">No allocations recorded yet.</p>
          )}
        </div>

        {/* Audit Highlights / Transparency info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944V21m0 0l-9-9m9 9l9-9" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Full Audit Logging</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-xs">
            Every financial action is logged and verified to ensure 100% transparency for your donors.
          </p>
          <button className="mt-6 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
            View Audit Logs
          </button>
        </div>
      </div>
    </div>
  );
}

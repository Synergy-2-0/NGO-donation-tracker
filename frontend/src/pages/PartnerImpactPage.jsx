import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePartner } from '../context/PartnerContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const amount = (value) => `LKR ${Number(value || 0).toLocaleString()}`;

export default function PartnerImpactPage() {
  const { id } = useParams();
  const { impactData, loading, error, setError, fetchPartnerImpact } = usePartner();

  useEffect(() => {
    fetchPartnerImpact(id).catch(() => {});
  }, [id, fetchPartnerImpact]);

  if (loading && !impactData) {
    return <LoadingSpinner message="Loading partner impact..." />;
  }

  if (!impactData) {
    return (
      <div className="space-y-4">
        <ErrorAlert
          message={error || 'Impact data is available only for verified partners.'}
          onDismiss={() => setError('')}
        />
        <Link to="/partners" className="text-blue-600 hover:underline text-sm">
          Back to Partners
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Impact: {impactData.organizationName}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Transparent snapshot of this partner&apos;s delivered outcomes.
          </p>
        </div>
        <Link to={`/partners/${id}`} className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">
          Back to Details
        </Link>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Metric label="Total Agreements" value={impactData.totalAgreements ?? 0} color="text-blue-700" />
        <Metric label="Active Agreements" value={impactData.activeAgreements ?? 0} color="text-green-700" />
        <Metric label="Completed Agreements" value={impactData.completedAgreements ?? 0} color="text-emerald-700" />
        <Metric label="Total Contributed" value={amount(impactData.totalContributed)} color="text-indigo-700" />
        <Metric label="Total Value Delivered" value={amount(impactData.totalValueDelivered)} color="text-purple-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">CSR Focus</h3>
          <TagList values={impactData.csrFocus || []} />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">SDG Goals</h3>
          <TagList values={(impactData.sdgGoals || []).map((goal) => `SDG ${goal}`)} />
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function TagList({ values }) {
  if (!values || values.length === 0) {
    return <p className="text-sm text-gray-500">No data available.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <span key={value} className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
          {String(value).replace(/_/g, ' ')}
        </span>
      ))}
    </div>
  );
}

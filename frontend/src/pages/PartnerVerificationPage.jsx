import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePartner } from '../context/PartnerContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

export default function PartnerVerificationPage() {
  const { user } = useAuth();
  const { partners, loading, error, setError, fetchPartners, approvePartner } = usePartner();
  const [success, setSuccess] = useState('');
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchPartners().catch(() => { });
  }, [fetchPartners]);

  const pendingPartners = useMemo(
    () => partners.filter((partner) => partner.verificationStatus === 'pending'),
    [partners]
  );

  const onApprove = async (id) => {
    try {
      await approvePartner(id);
      setSuccess('Partner approved successfully.');
      setError('');
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.message || 'Failed to approve partner.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Partner Verification Queue</h2>
          <p className="text-sm text-gray-500 mt-1">Review pending partners and approve verified organizations.</p>
        </div>
        <Link to="/partners" className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">
          Back to Partners
        </Link>
      </div>

      {(error || success) && (
        <div className="space-y-2">
          <ErrorAlert message={error} onDismiss={() => setError('')} />
          {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">{success}</div>}
        </div>
      )}

      {loading && partners.length === 0 ? (
        <LoadingSpinner message="Loading pending partners..." />
      ) : pendingPartners.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
          <p className="text-sm text-gray-500">No pending partner verification requests.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500">
                <th className="px-5 py-3 font-medium">Organization</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Submitted</th>
                <th className="px-5 py-3 font-medium">Documents</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pendingPartners.map((partner) => (
                <tr key={partner._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-semibold text-gray-800">{partner.organizationName}</td>
                  <td className="px-5 py-3 text-gray-600">{partner.organizationType}</td>
                  <td className="px-5 py-3 text-gray-600">
                    <div>{partner.contactPerson?.name || '—'}</div>
                    <div className="text-xs text-gray-500">{partner.contactPerson?.email || '—'}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{new Date(partner.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-gray-500">{partner.verificationDocuments?.length || 0}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-3 text-xs font-medium">
                      <Link to={`/partners/${partner._id}`} className="text-blue-600 hover:text-blue-800">Review</Link>
                      {isAdmin && (
                        <button onClick={() => onApprove(partner._id)} className="text-emerald-600 hover:text-emerald-800">Approve</button>
                      )}
                    </div>
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

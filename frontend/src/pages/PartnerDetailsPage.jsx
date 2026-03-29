import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePartner } from '../context/PartnerContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import PartnerFormModal from '../components/PartnerFormModal';
import { calculatePartnerReadiness, formatSdgLabel, getReadinessLabel } from '../utils/partnerInsights';

const badgeColor = {
  verified: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
};

const toTitle = (value) =>
  (value || '')
    .split('_')
    .join(' ')
    .split('-')
    .join(' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase());

const numberText = (value) => `LKR ${Number(value || 0).toLocaleString()}`;

export default function PartnerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentPartner, loading, error, setError, fetchPartnerById, updatePartner, deletePartner, approvePartner } = usePartner();

  const [editing, setEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [success, setSuccess] = useState('');
  const readinessScore = useMemo(() => calculatePartnerReadiness(currentPartner), [currentPartner]);
  const readinessLabel = useMemo(() => getReadinessLabel(readinessScore), [readinessScore]);

  useEffect(() => {
    fetchPartnerById(id).catch(() => {});
  }, [id, fetchPartnerById]);

  const canMutate = useMemo(() => {
    if (!currentPartner) return false;
    return user?.role === 'admin' || user?.role === 'ngo-admin' || String(currentPartner.userId) === String(user?.id);
  }, [currentPartner, user]);

  const onUpdate = async (payload) => {
    try {
      await updatePartner(id, payload);
      setEditing(false);
      setSuccess('Partner updated successfully.');
      setError('');
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.message || 'Failed to update partner.');
    }
  };

  const onDelete = async () => {
    try {
      await deletePartner(id);
      navigate('/partners');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete partner.');
    }
  };

  const onApprove = async () => {
    try {
      await approvePartner(id);
      setSuccess('Partner approved successfully.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve partner.');
    }
  };

  if (loading && !currentPartner) return <LoadingSpinner message="Loading partner details..." />;

  if (!currentPartner) {
    return (
      <div className="space-y-4">
        <ErrorAlert message={error || 'Partner not found.'} onDismiss={() => setError('')} />
        <Link to="/partners" className="text-blue-600 hover:underline text-sm">Back to Partners</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-4">
          {currentPartner.logoUrl && (
              <img src={currentPartner.logoUrl} alt="Logo" className="w-16 h-16 rounded-xl object-cover bg-white border border-gray-200 shadow-sm" />
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{currentPartner.organizationName}</h2>
            <p className="text-sm text-gray-500 mt-1">{toTitle(currentPartner.organizationType)} • {currentPartner.industry}</p>
            <div className="mt-2 flex gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badgeColor[currentPartner.verificationStatus] || 'bg-gray-100 text-gray-700'}`}>
                {toTitle(currentPartner.verificationStatus)}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {toTitle(currentPartner.status)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/partners" className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">Back</Link>
          <Link to="/partner/agreements" className="px-3 py-2 text-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg">Agreements</Link>
          <Link to={`/partners/${id}/impact`} className="px-3 py-2 text-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg">Impact</Link>
          {canMutate && (
            <button onClick={() => setEditing(true)} className="px-3 py-2 text-sm bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg">
              Edit
            </button>
          )}
          {canMutate && (
            <button onClick={() => setShowDelete(true)} className="px-3 py-2 text-sm bg-red-50 text-red-700 hover:bg-red-100 rounded-lg">
              Delete
            </button>
          )}
          {(user?.role === 'admin' || user?.role === 'ngo-admin') && currentPartner.verificationStatus === 'pending' && (
            <button onClick={onApprove} className="px-3 py-2 text-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg">
              Approve
            </button>
          )}
        </div>
      </div>

      {(error || success) && (
        <div className="space-y-2">
          <ErrorAlert message={error} onDismiss={() => setError('')} />
          {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">{success}</div>}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Contact">
          <Info label="Name" value={currentPartner.contactPerson?.name} />
          <Info label="Email" value={currentPartner.contactPerson?.email} />
          <Info label="Phone" value={currentPartner.contactPerson?.phone} />
          <Info label="Position" value={currentPartner.contactPerson?.position} />
        </Section>

        <Section title="Address">
          <Info label="Street" value={currentPartner.address?.street} />
          <Info label="City" value={currentPartner.address?.city} />
          <Info label="State" value={currentPartner.address?.state || '—'} />
          <Info label="Country" value={currentPartner.address?.country} />
          <Info label="Postal" value={currentPartner.address?.postalCode} />
          <Info
            label="Coordinates"
            value={Array.isArray(currentPartner.address?.coordinates?.coordinates)
              ? currentPartner.address.coordinates.coordinates.join(', ')
              : 'Auto-geocoded / unavailable'}
          />
        </Section>

        <Section title="Verification & Trust">
          <Info label="Verification Status" value={toTitle(currentPartner.verificationStatus)} />
          <Info label="Verified At" value={currentPartner.verifiedAt ? new Date(currentPartner.verifiedAt).toLocaleString() : '—'} />
          <Info label="Documents" value={String(currentPartner.verificationDocuments?.length || 0)} />
          <div className="mt-2">
            {(currentPartner.verificationDocuments || []).map((doc, index) => (
              <a key={`${doc.url}-${index}`} href={doc.url} target="_blank" rel="noreferrer" className="block text-sm text-blue-600 hover:underline">
                {toTitle(doc.documentType)}
              </a>
            ))}
          </div>
        </Section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title="CSR & SDG Focus">
          <TagList values={currentPartner.csrFocus || []} />
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">SDG Goals</p>
            <TagList values={(currentPartner.sdgGoals || []).map((goal) => formatSdgLabel(goal))} />
          </div>
        </Section>

        <Section title="Partnership Preferences">
          <Info label="Budget Range" value={`${numberText(currentPartner.partnershipPreferences?.budgetRange?.min)} - ${numberText(currentPartner.partnershipPreferences?.budgetRange?.max)}`} />
          <Info label="Duration" value={toTitle(currentPartner.partnershipPreferences?.duration)} />
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Partnership Types</p>
            <TagList values={currentPartner.partnershipPreferences?.partnershipTypes || []} />
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Geographic Focus</p>
            <TagList values={currentPartner.partnershipPreferences?.geographicFocus || []} />
          </div>
        </Section>

        <Section title="Capabilities">
          <Info label="Financial Capacity" value={numberText(currentPartner.capabilities?.financialCapacity)} />
          <Info label="Employee Count" value={currentPartner.capabilities?.employeeCount ?? '—'} />
          <Info label="Volunteer Hours" value={currentPartner.capabilities?.volunteerHoursAvailable ?? '—'} />
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Skills Available</p>
            <TagList values={currentPartner.capabilities?.skillsAvailable || []} />
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">In-kind Offerings</p>
            <TagList values={currentPartner.capabilities?.inKindOfferings || []} />
          </div>
        </Section>

        <Section title="Partnership History">
          <Info label="Total Partnerships" value={currentPartner.partnershipHistory?.totalPartnerships ?? 0} />
          <Info label="Active Partnerships" value={currentPartner.partnershipHistory?.activePartnerships ?? 0} />
          <Info label="Completed Partnerships" value={currentPartner.partnershipHistory?.completedPartnerships ?? 0} />
          <Info label="Total Contributed" value={numberText(currentPartner.partnershipHistory?.totalContributed)} />
        </Section>

        <Section title="Readiness Insight">
          <Info label="Readiness Score" value={`${readinessScore}%`} />
          <Info label="Readiness Tier" value={readinessLabel} />
          <p className="text-xs text-gray-500 mt-2">
            Score considers verification quality, contact completeness, SDG mapping, and contribution signals for partnership suitability.
          </p>
        </Section>
      </div>

      {editing && (
        <PartnerFormModal
          partner={currentPartner}
          loading={loading}
          onClose={() => setEditing(false)}
          onSave={onUpdate}
        />
      )}

      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h4 className="text-base font-semibold text-gray-800 mb-2">Delete Partner?</h4>
            <p className="text-sm text-gray-500 mb-5">This action marks the partner as inactive.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDelete(false)} className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
              <button onClick={onDelete} disabled={loading} className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded-lg">
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="mb-2">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm text-gray-800">{value || '—'}</p>
    </div>
  );
}

function TagList({ values }) {
  if (!values || values.length === 0) {
    return <p className="text-sm text-gray-500">—</p>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map((value) => (
        <span key={value} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
          {toTitle(String(value))}
        </span>
      ))}
    </div>
  );
}

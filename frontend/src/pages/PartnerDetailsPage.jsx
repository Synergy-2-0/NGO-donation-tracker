import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePartner } from '../context/PartnerContext';
import LoadingSpinner from '../components/LoadingSpinner';
import PartnerFormModal from '../components/PartnerFormModal';
import { calculatePartnerReadiness, formatSdgLabel, getReadinessLabel } from '../utils/partnerInsights';
import {
  FiArrowLeft, FiEdit3, FiTrash2, FiCheckCircle, FiAlertTriangle, FiX,
  FiBriefcase, FiMapPin, FiPhone, FiMail, FiFileText, FiExternalLink,
  FiTarget, FiUsers, FiActivity, FiDollarSign, FiClock, FiShield, FiBarChart2, FiArrowRight
} from 'react-icons/fi';

const verificationStyle = {
  verified: { cls: 'bg-emerald-50 text-emerald-600 border-emerald-100', dot: 'bg-emerald-500' },
  pending:  { cls: 'bg-amber-50 text-amber-600 border-amber-100',   dot: 'bg-amber-500'   },
  rejected: { cls: 'bg-rose-50 text-rose-600 border-rose-100',      dot: 'bg-rose-500'    },
};

const toTitle = (v = '') => v.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const asMoney = v => `LKR ${Number(v || 0).toLocaleString()}`;

function SectionCard({ title, icon, children, className = '' }) {
  return (
    <div className={`bg-white rounded-3xl border border-slate-100 shadow-sm p-7 text-left ${className}`}>
      <div className="flex items-center gap-2.5 mb-6">
        <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-sm shrink-0">{icon}</span>
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="mb-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-slate-800">{value || '—'}</p>
    </div>
  );
}

function TagPill({ value }) {
  return (
    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-lg border border-slate-200">
      {toTitle(String(value))}
    </span>
  );
}

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
    try { await deletePartner(id); navigate('/partners'); }
    catch (err) { setError(err.response?.data?.message || 'Failed to delete partner.'); }
  };

  const onApprove = async () => {
    try { await approvePartner(id); setSuccess('Partner approved.'); setError(''); }
    catch (err) { setError(err.response?.data?.message || 'Failed to approve.'); }
  };

  if (loading && !currentPartner) return (
    <div className="py-20 flex justify-center">
      <LoadingSpinner message="Loading partner details..." />
    </div>
  );

  if (!currentPartner) return (
    <div className="space-y-4 max-w-md mx-auto py-20 text-center">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
        <FiBriefcase className="text-2xl" />
      </div>
      <p className="text-slate-600 font-bold">{error || 'Partner not found.'}</p>
      <Link to="/partners" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-brand-red transition-all">
        <FiArrowLeft /> Back to Partners
      </Link>
    </div>
  );

  const vStyle = verificationStyle[currentPartner.verificationStatus] || verificationStyle.pending;
  const readinessPct = readinessScore;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fadeIn text-left">
      {/* Back */}
      <Link to="/partners" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-colors">
        <FiArrowLeft /> Back to Directory
      </Link>

      {/* Hero */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-red/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
              {currentPartner.logoUrl
                ? <img src={currentPartner.logoUrl} alt="logo" className="w-full h-full object-cover" />
                : <FiBriefcase className="text-2xl text-white/40" />}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${vStyle.cls}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${vStyle.dot}`} />
                  {toTitle(currentPartner.verificationStatus)}
                </span>
                <span className="px-3 py-1 bg-white/10 text-slate-300 border border-white/10 text-[10px] font-black uppercase tracking-widest rounded-lg">
                  {toTitle(currentPartner.status)}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                {currentPartner.organizationName}
              </h1>
              <p className="text-slate-400 text-sm mt-1">{toTitle(currentPartner.organizationType)} • {currentPartner.industry}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/partner/agreements"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5">
              <FiFileText /> Agreements
            </Link>
            <Link to={`/partners/${id}/impact`}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5">
              <FiActivity /> Impact
            </Link>
            {canMutate && (
              <button onClick={() => setEditing(true)}
                className="px-4 py-2.5 bg-brand-orange/20 hover:bg-brand-orange/30 border border-brand-orange/30 text-brand-orange text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5">
                <FiEdit3 /> Edit
              </button>
            )}
            {(user?.role === 'admin' || user?.role === 'ngo-admin') && currentPartner.verificationStatus === 'pending' && (
              <button onClick={onApprove}
                className="px-4 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5">
                <FiCheckCircle /> Approve
              </button>
            )}
            {canMutate && (
              <button onClick={() => setShowDelete(true)}
                className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-400 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5">
                <FiTrash2 /> Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(error || success) && (
        <div className="space-y-3">
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-brand-red/20 text-brand-red px-5 py-4 rounded-2xl">
              <FiAlertTriangle className="text-xl shrink-0" />
              <p className="text-sm font-medium">{error}</p>
              <button onClick={() => setError('')} className="ml-auto"><FiX /></button>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-2xl">
              <FiCheckCircle className="text-xl shrink-0" />
              <p className="text-sm font-medium">{success}</p>
              <button onClick={() => setSuccess('')} className="ml-auto"><FiX /></button>
            </div>
          )}
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <SectionCard title="Contact Information" icon={<FiMail />}>
            <InfoRow label="Name" value={currentPartner.contactPerson?.name} />
            <InfoRow label="Position" value={currentPartner.contactPerson?.position} />
            <InfoRow label="Email" value={currentPartner.contactPerson?.email} />
            <InfoRow label="Phone" value={currentPartner.contactPerson?.phone} />
          </SectionCard>

          <SectionCard title="Registered Address" icon={<FiMapPin />}>
            <InfoRow label="Street" value={currentPartner.address?.street} />
            <InfoRow label="City" value={currentPartner.address?.city} />
            <InfoRow label="State" value={currentPartner.address?.state} />
            <InfoRow label="Country" value={currentPartner.address?.country} />
            <InfoRow label="Postal Code" value={currentPartner.address?.postalCode} />
          </SectionCard>

          <SectionCard title="Compliance & Verification" icon={<FiShield />}>
            <InfoRow label="Status" value={toTitle(currentPartner.verificationStatus)} />
            <InfoRow label="Verified At" value={currentPartner.verifiedAt ? new Date(currentPartner.verifiedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '—'} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Documents</p>
              {currentPartner.verificationDocuments?.length > 0 ? (
                <div className="space-y-2">
                  {currentPartner.verificationDocuments.map((doc, i) => (
                    <a key={i} href={doc.url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 hover:border-brand-red/30 hover:bg-red-50/30 rounded-xl text-sm font-semibold text-slate-700 group transition-all">
                      <FiFileText className="text-slate-400 group-hover:text-brand-red transition-colors" />
                      {toTitle(doc.documentType || 'Document')}
                      <FiExternalLink className="ml-auto text-slate-300 group-hover:text-brand-red" />
                    </a>
                  ))}
                </div>
              ) : <p className="text-sm text-slate-400 italic">No documents</p>}
            </div>
          </SectionCard>
        </div>

        {/* Middle column */}
        <div className="space-y-6">
          <SectionCard title="SDG & CSR Focus" icon={<FiTarget />}>
            {currentPartner.csrFocus?.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-5">
                {currentPartner.csrFocus.map(f => <TagPill key={f} value={f} />)}
              </div>
            ) : <p className="text-sm text-slate-400 italic mb-5">No CSR focus set</p>}
            {currentPartner.sdgGoals?.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">SDG Goals</p>
                <div className="flex flex-wrap gap-2">
                  {currentPartner.sdgGoals.map(g => (
                    <span key={g} className="px-3 py-1 bg-brand-red/5 text-brand-red border border-brand-red/15 text-[10px] font-black uppercase tracking-wider rounded-lg">
                      SDG {g}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Partnership Preferences" icon={<FiActivity />}>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Min Budget</p>
                <p className="text-base font-black text-slate-800">{asMoney(currentPartner.partnershipPreferences?.budgetRange?.min)}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Max Budget</p>
                <p className="text-base font-black text-slate-800">{asMoney(currentPartner.partnershipPreferences?.budgetRange?.max)}</p>
              </div>
            </div>
            <InfoRow label="Preferred Duration" value={toTitle(currentPartner.partnershipPreferences?.duration || '')} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Partnership Types</p>
              <div className="flex flex-wrap gap-2">
                {currentPartner.partnershipPreferences?.partnershipTypes?.length > 0
                  ? currentPartner.partnershipPreferences.partnershipTypes.map(t => <TagPill key={t} value={t} />)
                  : <p className="text-sm text-slate-400 italic">Not set</p>}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Partnership History" icon={<FiClock />}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total', value: currentPartner.partnershipHistory?.totalPartnerships ?? 0 },
                { label: 'Active', value: currentPartner.partnershipHistory?.activePartnerships ?? 0 },
                { label: 'Completed', value: currentPartner.partnershipHistory?.completedPartnerships ?? 0 },
                { label: 'Contributed', value: asMoney(currentPartner.partnershipHistory?.totalContributed) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                  <p className="text-lg font-black text-slate-800">{value}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <SectionCard title="Organizational Capabilities" icon={<FiUsers />}>
            <div className="bg-brand-red/5 border border-brand-red/10 rounded-2xl p-5 mb-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Financial Capacity</p>
              <p className="text-2xl font-black text-brand-red">{asMoney(currentPartner.capabilities?.financialCapacity)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <p className="text-xl font-black text-slate-800">{currentPartner.capabilities?.employeeCount ?? '—'}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Employees</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <p className="text-xl font-black text-slate-800">{currentPartner.capabilities?.volunteerHoursAvailable ?? '—'}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Vol. Hrs</p>
              </div>
            </div>
            {currentPartner.capabilities?.skillsAvailable?.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Skills Available</p>
                <div className="flex flex-wrap gap-2">
                  {currentPartner.capabilities.skillsAvailable.map(s => <TagPill key={s} value={s} />)}
                </div>
              </div>
            )}
          </SectionCard>

          {/* Readiness Score */}
          <div className="bg-slate-900 rounded-3xl p-7 relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-red/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-8 h-8 bg-white/10 text-white rounded-xl flex items-center justify-center text-sm"><FiBarChart2 /></span>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Readiness Score</h3>
              </div>

              <div className="flex items-end gap-3 mb-4">
                <span className="text-5xl font-black text-white">{readinessPct}%</span>
                <span className="text-sm font-bold text-slate-400 mb-2">{readinessLabel}</span>
              </div>

              <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden mb-5">
                <div
                  className="h-2.5 bg-gradient-to-r from-brand-orange to-brand-red rounded-full transition-all duration-1000"
                  style={{ width: `${readinessPct}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Score considers verification quality, contact completeness, SDG mapping, and contribution signals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <PartnerFormModal
          partner={currentPartner}
          loading={loading}
          onClose={() => setEditing(false)}
          onSave={onUpdate}
        />
      )}

      {/* Delete modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full">
            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FiTrash2 className="text-2xl text-rose-500" />
            </div>
            <h4 className="text-lg font-black text-slate-800 mb-2 text-center">Delete Partner?</h4>
            <p className="text-sm text-slate-500 text-center mb-7">This marks the partner as inactive. This action cannot be easily reversed.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDelete(false)}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-widest rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={onDelete} disabled={loading}
                className="flex-1 px-4 py-3 bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2">
                <FiTrash2 /> {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

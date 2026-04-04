import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FiBriefcase, FiMapPin, FiPhone, FiMail, FiExternalLink, FiEdit3, 
  FiFileText, FiCheckCircle, FiClock, FiX, FiAlertTriangle,
  FiTarget, FiUsers, FiDollarSign, FiArrowRight, FiActivity
} from 'react-icons/fi';

const verificationStyle = {
  verified:  { cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
  pending:   { cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20',   dot: 'bg-amber-400'   },
  rejected:  { cls: 'bg-rose-500/10 text-rose-400 border-rose-500/20',      dot: 'bg-rose-400'    },
};

const toTitle = (v = '') => v.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const asMoney = v => `LKR ${Number(v || 0).toLocaleString()}`;

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value || '—'}</span>
    </div>
  );
}

function TagPill({ value }) {
  return (
    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-extrabold uppercase tracking-wider rounded-lg border border-slate-200">
      {toTitle(String(value))}
    </span>
  );
}

function SectionCard({ title, icon, children, className = '' }) {
  return (
    <div className={`bg-white rounded-3xl border border-slate-100 shadow-sm p-7 ${className}`}>
      <div className="flex items-center gap-2.5 mb-6">
        <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-sm">{icon}</span>
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function PartnerProfilePage() {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/api/partners/me/profile')
      .then(({ data }) => setPartner(data))
      .catch(err => {
        if (err.response?.status !== 404) {
          setError(err.response?.data?.message || 'Failed to load partner profile.');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="py-20 flex justify-center">
      <LoadingSpinner message="Loading your partner profile..." />
    </div>
  );

  const vStyle = verificationStyle[partner?.verificationStatus] || verificationStyle.pending;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fadeIn text-left">
      {/* Header banner */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
              {partner?.logoUrl
                ? <img src={partner.logoUrl} alt="logo" className="w-full h-full object-cover" />
                : <FiBriefcase className="text-2xl text-white/50" />}
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Partner Profile</p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {partner?.organizationName || 'My Organization'}
              </h1>
              <p className="text-slate-400 text-sm mt-1">{toTitle(partner?.organizationType || '')} • {partner?.industry || 'Industry not set'}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {partner && (
              <>
                <span className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-widest border backdrop-blur-sm ${vStyle.cls}`}>
                  <span className={`w-2 h-2 rounded-full ${vStyle.dot}`} />
                  {toTitle(partner.verificationStatus || 'pending')}
                </span>
                <Link to={`/partners/${partner._id}`}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold uppercase tracking-widest rounded-xl border border-white/10 flex items-center gap-2 transition-all">
                  <FiExternalLink /> Full Profile
                </Link>
                <Link to="/partner/agreements"
                  className="px-5 py-2.5 bg-brand-red hover:bg-brand-red/90 text-white text-xs font-extrabold uppercase tracking-widest rounded-xl shadow-[0_8px_24px_rgba(220,38,38,0.3)] flex items-center gap-2 transition-all">
                  <FiFileText /> Partnership Ops
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-brand-red/20 text-brand-red px-5 py-4 rounded-2xl">
          <FiAlertTriangle className="text-lg shrink-0" />
          <p className="text-sm font-medium">{error}</p>
          <button onClick={() => setError('')} className="ml-auto"><FiX /></button>
        </div>
      )}

      {!partner ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
            <FiBriefcase className="text-3xl" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-800 mb-2">No Partner Profile Found</h3>
          <p className="text-slate-500 text-sm max-w-sm mb-6">Your account doesn't have a partner profile yet. Complete onboarding to create one.</p>
          <Link to="/partners"
            className="px-6 py-3 bg-slate-900 hover:bg-brand-red text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all flex items-center gap-2">
            <FiArrowRight /> Go to Partners
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left col: Contact + Address */}
          <div className="space-y-6">
            <SectionCard title="Contact Information" icon={<FiMail />}>
              <div className="space-y-5">
                <InfoRow label="Primary Contact" value={partner.contactPerson?.name} />
                <InfoRow label="Position" value={partner.contactPerson?.position} />
                <InfoRow label="Email" value={partner.contactPerson?.email} />
                <InfoRow label="Phone" value={partner.contactPerson?.phone} />
              </div>
            </SectionCard>

            <SectionCard title="Registered Address" icon={<FiMapPin />}>
              <div className="space-y-5">
                <InfoRow label="Street" value={partner.address?.street} />
                <InfoRow label="City" value={partner.address?.city} />
                <InfoRow label="Country" value={partner.address?.country} />
                <InfoRow label="Postal Code" value={partner.address?.postalCode} />
              </div>
            </SectionCard>

            <SectionCard title="Verification & Compliance" icon={<FiCheckCircle />}>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${vStyle.dot}`} />
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Verification Status</p>
                    <p className={`text-sm font-bold ${vStyle.cls.split(' ')[1]}`}>{toTitle(partner.verificationStatus)}</p>
                  </div>
                </div>
                <InfoRow label="Verified At" value={partner.verifiedAt ? new Date(partner.verifiedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Pending'} />
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block mb-2">Compliance Documents</span>
                  {partner.verificationDocuments?.length > 0 ? (
                    <div className="space-y-2">
                      {partner.verificationDocuments.map((doc, i) => (
                        <a key={i} href={doc.url} target="_blank" rel="noreferrer"
                          className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-red/30 hover:bg-red-50/30 transition-all text-sm font-semibold text-slate-700 group">
                          <FiFileText className="text-slate-400 group-hover:text-brand-red transition-colors" />
                          {toTitle(doc.documentType || 'Document')}
                          <FiExternalLink className="ml-auto text-slate-300 group-hover:text-brand-red" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 ">No documents uploaded</p>
                  )}
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Middle col: CSR + Preferences */}
          <div className="space-y-6">
            <SectionCard title="SDG & CSR Focus Areas" icon={<FiTarget />}>
              {partner.csrFocus?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {partner.csrFocus.map(f => <TagPill key={f} value={f} />)}
                </div>
              ) : <p className="text-sm text-slate-400 ">Not set</p>}
              
              {partner.sdgGoals?.length > 0 && (
                <div className="mt-5">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-3">SDG Goal Alignment</p>
                  <div className="flex flex-wrap gap-2">
                    {partner.sdgGoals.map(g => (
                      <span key={g} className="px-3 py-1 bg-brand-red/5 text-brand-red border border-brand-red/15 text-[10px] font-extrabold uppercase tracking-wider rounded-lg">
                        SDG {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </SectionCard>

            <SectionCard title="Partnership Preferences" icon={<FiActivity />}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Min Budget</p>
                    <p className="text-base font-extrabold text-slate-800">{asMoney(partner.partnershipPreferences?.budgetRange?.min)}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Max Budget</p>
                    <p className="text-base font-extrabold text-slate-800">{asMoney(partner.partnershipPreferences?.budgetRange?.max)}</p>
                  </div>
                </div>
                <InfoRow label="Preferred Duration" value={toTitle(partner.partnershipPreferences?.duration || '')} />
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Partnership Types</p>
                  <div className="flex flex-wrap gap-2">
                    {partner.partnershipPreferences?.partnershipTypes?.length > 0
                      ? partner.partnershipPreferences.partnershipTypes.map(t => <TagPill key={t} value={t} />)
                      : <p className="text-sm text-slate-400 ">Not set</p>}
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Partnership History" icon={<FiClock />}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Total', value: partner.partnershipHistory?.totalPartnerships ?? 0 },
                  { label: 'Active', value: partner.partnershipHistory?.activePartnerships ?? 0 },
                  { label: 'Completed', value: partner.partnershipHistory?.completedPartnerships ?? 0 },
                  { label: 'Contributed', value: asMoney(partner.partnershipHistory?.totalContributed) },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
                    <p className="text-lg font-extrabold text-slate-800">{value}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Right col: Capabilities + Quick actions */}
          <div className="space-y-6">
            <SectionCard title="Organizational Capabilities" icon={<FiUsers />}>
              <div className="space-y-4">
                <div className="bg-brand-red/5 border border-brand-red/10 rounded-2xl p-5">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Financial Capacity</p>
                  <p className="text-xl font-extrabold text-brand-red">{asMoney(partner.capabilities?.financialCapacity)}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                    <p className="text-2xl font-extrabold text-slate-800">{partner.capabilities?.employeeCount ?? '—'}</p>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mt-1">Employees</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                    <p className="text-2xl font-extrabold text-slate-800">{partner.capabilities?.volunteerHoursAvailable ?? '—'}</p>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mt-1">Vol. Hrs</p>
                  </div>
                </div>
                {partner.capabilities?.skillsAvailable?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Skills Available</p>
                    <div className="flex flex-wrap gap-2">
                      {partner.capabilities.skillsAvailable.map(s => <TagPill key={s} value={s} />)}
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* Quick Actions Card */}
            <div className="bg-slate-900 rounded-3xl p-7 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-red/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-5">Quick Actions</h3>
                <div className="space-y-2">
                  <Link to={`/partners/${partner._id}`}
                    className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl text-white text-sm font-bold transition-all group">
                    <span className="flex items-center gap-2"><FiExternalLink className="text-slate-400 group-hover:text-white transition-colors" /> View Public Profile</span>
                    <FiArrowRight className="text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </Link>
                  <Link to={`/partners/${partner._id}/impact`}
                    className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl text-white text-sm font-bold transition-all group">
                    <span className="flex items-center gap-2"><FiActivity className="text-slate-400 group-hover:text-white transition-colors" /> View Impact Report</span>
                    <FiArrowRight className="text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </Link>
                  <Link to="/partner/agreements"
                    className="flex items-center justify-between p-4 bg-brand-red/10 hover:bg-brand-red/20 border border-brand-red/20 hover:border-brand-red/40 rounded-2xl text-brand-red text-sm font-bold transition-all group">
                    <span className="flex items-center gap-2"><FiFileText /> Partnership Ops</span>
                    <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

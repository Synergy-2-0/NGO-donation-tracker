import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { 
  FiBriefcase, FiMapPin, FiMail, FiExternalLink, FiSearch,
  FiFileText, FiCheckCircle, FiShield, FiX, FiAlertTriangle,
  FiTarget, FiAward, FiDollarSign, FiArrowRight, FiActivity
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const verificationStyle = {
  verified:  { cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400', label: 'Verified Integrity' },
  pending:   { cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20',   dot: 'bg-amber-400',   label: 'Pending Audit' },
  rejected:  { cls: 'bg-rose-500/10 text-rose-400 border-rose-500/20',      dot: 'bg-rose-400',    label: 'Authorized Revoked' },
};

const toTitle = (v = '') => v.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const asMoney = v => `LKR ${Number(v || 0).toLocaleString()}`;

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value || '—'}</span>
    </div>
  );
}

function SectionCard({ title, icon, children, className = '' }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 ${className}`}
    >
      <div className="flex items-center gap-3 mb-8">
        <span className="w-10 h-10 bg-slate-950 text-white rounded-2xl flex items-center justify-center text-lg shadow-xl shadow-slate-950/20">{icon}</span>
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 italic">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

export default function NgoProfilePage() {
  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/api/ngos/profile')
      .then(({ data }) => setNgo(data))
      .catch(err => {
        if (err.response?.status !== 404) {
          setError(err.response?.data?.message || 'Failed to load NGO profile.');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Scanning organizational registry..." />;

  const vStyle = verificationStyle[ngo?.verificationStatus] || verificationStyle.pending;

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 pb-20 p-8 font-sans">
      {/* Cinematic Hero Header */}
      <section className="relative h-[400px] rounded-[4rem] overflow-hidden group shadow-5xl">
        <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?auto=format&fit=crop&q=80&w=2400" 
            className="w-full h-full object-cover brightness-[0.35] group-hover:scale-105 transition-transform duration-[10s]" 
            alt="NGO Header" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        
        <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-[2rem] bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center overflow-hidden shrink-0 shadow-2xl">
                {ngo?.logoUrl ? <img src={ngo.logoUrl} alt="logo" className="w-full h-full object-cover" /> : <FiBriefcase className="text-4xl text-white/40" />}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border backdrop-blur-xl italic ${vStyle.cls}`}>
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${vStyle.dot} animate-pulse`} />
                    {vStyle.label}
                  </div>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] italic">Operational Mission Node</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic leading-none lowercase">
                    {ngo?.organizationName || 'Initializing Profile'} <span className="text-tf-primary">.Global</span>
                </h1>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="px-10 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-slate-950 transition-all italic flex items-center gap-3">
              Edit Blueprint <FiActivity />
            </button>
            <Link to="/dashboard" className="px-10 py-4 bg-tf-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-tf-primary/30 hover:bg-slate-950 transition-all italic flex items-center gap-3">
              Command Deck <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}

      {!ngo ? (
        <SectionCard title="Authorization Required" icon={<FiShield />}>
          <div className="py-20 text-center space-y-6">
            <FiAlertTriangle className="mx-auto text-slate-100" size={80} />
            <p className="text-slate-400 font-bold text-sm tracking-widest uppercase italic">Operational Blueprints Not Found</p>
            <Link to="/onboarding/ngo" className="inline-flex py-4 px-10 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest italic shadow-xl">Initialize Onboarding Sync →</Link>
          </div>
        </SectionCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
          
          {/* Main Content Areas */}
          <div className="lg:col-span-8 space-y-8">
            <SectionCard title="Impact Strategy" icon={<FiTarget />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <InfoRow label="Registration ID" value={ngo.registrationNumber} />
                  <InfoRow label="Founding Directive" value={ngo.yearEstablished ? `Class established ${ngo.yearEstablished}` : 'N/A'} />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3 italic">Sector Focus Nodes</span>
                    <div className="flex flex-wrap gap-2">
                      {ngo.sectorFocus?.map(s => (
                        <span key={s} className="px-5 py-2 bg-slate-950 text-white text-[9px] font-black uppercase tracking-widest rounded-xl italic">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Transparency Rating</p>
                      <FiAward className="text-tf-primary text-xl" />
                    </div>
                    <div className="flex items-end gap-3">
                      <span className="text-6xl font-black text-slate-950 tracking-tighter italic leading-none">{(ngo.trustScore || 85).toFixed(0)}</span>
                      <span className="text-sm font-black text-tf-primary uppercase tracking-widest mb-1">Impact Score</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium italic leading-relaxed">Verified through real-time capital intake & allocation ledger sync. This rating determines global donor tier access.</p>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Financial Deployment Status" icon={<FiDollarSign />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Asset Intake', val: asMoney(ngo.totalFundsRaised), color: 'text-slate-950' },
                    { label: 'Verified Deployed', val: asMoney(ngo.allocatedFunds), color: 'text-tf-primary' },
                    { label: 'Unallocated HUB', val: asMoney(ngo.availableFunds), color: 'text-slate-400' }
                  ].map((stat, i) => (
                    <div key={i} className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm group hover:border-tf-primary transition-all">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic mb-2">{stat.label}</p>
                      <p className={`text-xl font-black italic tracking-tighter ${stat.color}`}>{stat.val}</p>
                    </div>
                  ))}
                </div>
            </SectionCard>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            <SectionCard title="Connect Details" icon={<FiMail />}>
              <div className="space-y-6">
                <InfoRow label="HQ Terminal" value={ngo.contactEmail} />
                <InfoRow label="Direct Comms" value={ngo.contactPhone} />
                <div className="pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-slate-800 hover:text-tf-primary transition-colors cursor-pointer group">
                    <FiMapPin className="text-slate-300 group-hover:text-tf-primary" />
                    <span className="text-sm font-bold truncate">{(ngo.address?.city || 'Colombo')}, Sri Lanka</span>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Audit Docs" icon={<FiFileText />}>
              <div className="space-y-3">
                 {ngo.verificationDocuments?.map((doc, i) => (
                   <a key={i} href={doc.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-tf-primary transition-all group">
                      <div className="flex items-center gap-3">
                        <FiShield className="text-slate-300 group-hover:text-tf-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">{doc.documentType}</span>
                      </div>
                      <FiExternalLink className="text-slate-300 group-hover:text-tf-primary" />
                   </a>
                 ))}
                 {!ngo.verificationDocuments?.length && <p className="text-xs text-slate-400 italic text-center py-4">No compliance items indexed.</p>}
              </div>
            </SectionCard>
          </div>

        </div>
      )}
    </div>
  );
}

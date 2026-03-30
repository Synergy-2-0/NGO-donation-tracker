import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePartner } from '../context/PartnerContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { FiArrowLeft, FiActivity, FiShield, FiTarget, FiDollarSign, FiClock, FiCheckCircle, FiFileText, FiBarChart2 } from 'react-icons/fi';

const asMoney = (value) => `LKR ${Number(value || 0).toLocaleString()}`;

function StatCard({ label, value, icon, accent, color }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-3 hover:shadow-xl transition-all group">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </span>
      </div>
      <p className={`text-2xl font-black tracking-tight ${accent}`}>{value}</p>
    </div>
  );
}

export default function PartnerImpactPage() {
  const { id } = useParams();
  const { impactData, loading, error, setError, fetchPartnerImpact } = usePartner();

  useEffect(() => {
    fetchPartnerImpact(id).catch(() => {});
  }, [id, fetchPartnerImpact]);

  if (loading && !impactData) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner message="Calculating institutional impact outcomes..." />
      </div>
    );
  }

  if (!impactData) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
          <FiShield className="text-4xl" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-800">Intelligence Restricted</h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            {error || 'Impact analytics are restricted to verified strategic partners with active history.'}
          </p>
        </div>
        <Link to="/partners" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-red transition-all shadow-xl shadow-slate-900/10 active:scale-95">
          <FiArrowLeft className="text-sm" /> Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fadeIn text-left">
      {/* Header */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-red/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-emerald-400 mb-2">Performance Intelligence</p>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Impact <span className="text-emerald-500">Analytics</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl font-medium">
              A verifiable, real-time snapshot of <span className="text-white font-bold">{impactData.organizationName}</span> and their contribution to global mission objectives.
            </p>
          </div>
          <Link to={`/partners/${id}`} className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10 flex items-center gap-2">
            <FiArrowLeft className="text-sm" /> Details Node
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl flex items-center gap-3 font-semibold shadow-sm animate-pulse">
          <FiActivity className="shrink-0" /> {error}
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Operational Nodes" 
          value={impactData.totalAgreements ?? 0} 
          icon={<FiFileText />} 
          accent="text-slate-800" 
          color="bg-slate-50 text-slate-400"
        />
        <StatCard 
          label="Active Deployments" 
          value={impactData.activeAgreements ?? 0} 
          icon={<FiActivity />} 
          accent="text-amber-600" 
          color="bg-amber-50 text-amber-500"
        />
        <StatCard 
          label="Fiscal Contribution" 
          value={asMoney(impactData.totalContributed)} 
          icon={<FiDollarSign />} 
          accent="text-brand-red" 
          color="bg-red-50 text-brand-red"
        />
        <StatCard 
          label="Outcome Value" 
          value={asMoney(impactData.totalValueDelivered)} 
          icon={<FiBarChart2 />} 
          accent="text-emerald-600" 
          color="bg-emerald-50 text-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Domain Alignment */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 text-left space-y-8">
          <div className="flex items-center gap-3">
             <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-sm"><FiTarget /></span>
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Domain Alignment Nodes</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">CSR Strategic Focus</p>
              {impactData.csrFocus?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {impactData.csrFocus.map(v => (
                    <span key={v} className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:bg-slate-100">
                      {String(v).replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              ) : <p className="text-sm font-medium text-slate-300 italic">No nodes identified</p>}
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Global SDG Synergy</p>
              {impactData.sdgGoals?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {impactData.sdgGoals.map(v => (
                    <span key={v} className="px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:bg-emerald-100">
                      SDG {v}
                    </span>
                  ))}
                </div>
              ) : <p className="text-sm font-medium text-slate-300 italic">No synergy mapped</p>}
            </div>
          </div>
        </div>

        {/* Audit Transparency Card */}
        <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden flex flex-col justify-between text-left group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/30 transition-all duration-700" />
           
           <div className="relative z-10">
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
                <FiCheckCircle className="text-2xl text-emerald-400" />
              </div>
              <h3 className="text-xl font-black tracking-tight mb-3">Verified Delivery Node</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                This impact profile is calculated based on verified milestone completions and finalized capital contributions in the TrustFund ledger.
              </p>
           </div>

           <div className="relative z-10 flex flex-col gap-3">
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                 <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">History</p>
                    <p className="text-lg font-black text-white">{impactData.completedAgreements ?? 0} Completed</p>
                 </div>
                 <FiClock className="text-slate-700 mb-1" />
              </div>
              <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-black text-[10px] uppercase tracking-[.2em] rounded-2xl transition-all active:scale-95 shadow-xl shadow-emerald-500/10">
                Generate Full Ledger
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

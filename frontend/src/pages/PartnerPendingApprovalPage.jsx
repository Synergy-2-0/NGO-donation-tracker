import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiArrowRight, FiLogOut, FiShield, FiClock, FiUsers } from 'react-icons/fi';

export default function PartnerPendingApprovalPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b2e 60%, #1a0a0a 100%)' }}>
      
      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg w-full mx-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <img src="/heart-logo c.png" alt="TrustFund" className="w-10 h-10 object-contain" />
          <span className="text-white font-extrabold text-xl tracking-tight">TrustFund</span>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center shadow-2xl">
          {/* Animated status icon */}
          <div className="relative mx-auto w-20 h-20 mb-8">
            <div className="absolute inset-0 rounded-full bg-brand-orange/20 animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center">
              <FiClock className="text-3xl text-brand-orange" />
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight mb-3">
            Application Under Review
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Your partner application is currently being reviewed by our compliance team. 
            You'll receive an email notification once the vetting process is complete.
          </p>

          {/* Status steps */}
          <div className="bg-white/5 rounded-2xl border border-white/5 p-5 mb-8 text-left space-y-4">
            <StatusStep icon={<FiUsers />} label="Application Submitted" done />
            <StatusStep icon={<FiShield />} label="Document Verification — In Progress" active />
            <StatusStep icon={<FiClock />} label="Compliance Review" pending />
            <StatusStep icon={<FiArrowRight />} label="Platform Access Granted" pending />
          </div>

          <div className="text-slate-500 text-xs font-medium mb-6">
            Logged in as <span className="text-slate-300 font-bold">{user?.email}</span>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-xl transition-all text-sm font-bold"
          >
            <FiLogOut />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusStep({ icon, label, done, active, pending }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm
        ${done ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
          active ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30' :
          'bg-white/5 text-slate-600 border border-white/5'}`}>
        {icon}
      </div>
      <span className={`text-sm font-semibold ${done ? 'text-emerald-400' : active ? 'text-brand-orange' : 'text-slate-600'}`}>
        {label}
      </span>
      {done && <span className="ml-auto text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest">Done</span>}
      {active && (
        <span className="ml-auto flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
          </span>
          <span className="text-[10px] font-extrabold text-brand-orange uppercase tracking-widest">Live</span>
        </span>
      )}
    </div>
  );
}

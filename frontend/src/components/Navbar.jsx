import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiChevronRight } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();

  const pageTitle = {
    admin: 'Admin Console',
    'ngo-admin': 'NGO Operations',
    partner: 'Partner Portal',
    donor: 'Donor Dashboard',
  }[user?.role] || 'Dashboard';

  const roleTag = {
    admin: { label: 'System Admin', cls: 'bg-rose-50 text-rose-500 border-rose-100' },
    'ngo-admin': { label: 'Administrator', cls: 'bg-slate-50 text-slate-500 border-slate-200' },
    partner: { label: 'Official Partner', cls: 'bg-emerald-50 text-emerald-500 border-emerald-100' },
    donor: { label: 'Verified Donor', cls: 'bg-sky-50 text-sky-600 border-sky-100' },
  }[user?.role] || { label: user?.role || 'User', cls: 'bg-slate-50 text-slate-500 border-slate-100' };

  return (
    <header className="glass-surface sticky top-0 px-8 py-4 flex items-center justify-between shrink-0 z-10">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-bold text-slate-900 tracking-bespoke">{pageTitle}</h1>
        <div className="w-1 h-1 rounded-full bg-slate-200" />
        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${roleTag.cls}`}>
          {roleTag.label}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 pr-6 border-r border-slate-100 hidden sm:flex">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-800 leading-none tracking-bespoke">{user?.name}</p>
            <p className="text-[9px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">{user?.email}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/10 border border-white/10 hover:border-brand-red/30 transition-all duration-300">
            <span className="text-white font-bold text-[10px] uppercase tracking-bespoke">
              {(user?.name || user?.email || 'U')[0]}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

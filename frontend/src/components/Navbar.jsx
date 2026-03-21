import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  const getDashboardType = () => {
    if (!user?.role) return 'Humanitarian';
    switch (user.role) {
      case 'admin':
      case 'ngo-admin': return 'Admin Command';
      case 'donor': return 'Humanitarian Portal';
      default: return 'Access Point';
    }
  };

  return (
    <header className="bg-white border-b border-slate-100 px-10 py-5 flex items-center justify-between shrink-0 relative z-20 font-sans">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-tf-pink shadow-[0_0_10px_rgba(230,0,126,0.5)] animate-pulse" />
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Authorized Session</span>
        </div>
        <div className="h-4 w-[1px] bg-slate-200" />
        <h1 className="text-sm font-bold text-tf-purple uppercase tracking-widest">{getDashboardType()}</h1>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end">
           <p className="text-[12px] font-bold text-slate-900 uppercase tracking-wider">{user?.name || 'Humanitarian'}</p>
           <p className="text-[10px] font-medium text-slate-400 lowercase italic tracking-tight">{user?.email}</p>
        </div>
        <div className="h-8 w-[1px] bg-slate-100" />
        <button
          onClick={logout}
          className="text-[10px] font-bold text-tf-pink hover:text-pink-700 uppercase tracking-widest transition-all hover:translate-x-1"
        >
          Secure Exit →
        </button>
      </div>
    </header>
  );
}

import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout } = useAuth();

  // Determine dashboard type based on user role
  const getDashboardType = () => {
    if (!user?.role) return 'Dashboard';

    switch (user.role) {
      case 'admin':
      case 'ngo-admin':
        return 'Admin Dashboard';
      case 'donor':
        return 'Donor Dashboard';
      case 'partner':
        return 'Partner Dashboard';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="bg-white/70 backdrop-blur-xl border-b border-gray-100 px-10 py-5 flex items-center justify-between shrink-0 z-20">
      <div>
        <h1 className="text-xl font-black text-[#1E293B] tracking-tight">
          Overview <span className="text-indigo-600 font-medium text-sm ml-2 tracking-normal">Real-time Analysis</span>
        </h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">System Live</span>
        </div>
        
        <div className="h-8 w-[1px] bg-gray-100"></div>

        <button
          onClick={logout}
          className="group flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-rose-200"
        >
          <span className="text-xs font-black uppercase tracking-widest">Logout</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
}

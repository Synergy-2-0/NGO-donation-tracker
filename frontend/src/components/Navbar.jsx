import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

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
    <header className="bg-brand-cream border-b border-brand-orange/30 px-6 py-3 flex items-center justify-between shrink-0">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-brand-brown">{getDashboardType()}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">{user?.name}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>
        
        <div className="h-8 w-[1px] bg-gray-100"></div>

        <button
          onClick={logout}
          className="text-sm text-brand-red hover:text-brand-red/80 font-medium transition-colors"
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

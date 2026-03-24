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
        <button
          onClick={logout}
          className="text-sm text-brand-red hover:text-brand-red/80 font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

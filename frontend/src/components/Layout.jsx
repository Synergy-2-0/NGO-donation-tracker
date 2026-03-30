import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {/* Subtle background texture */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle at 80% 0%, rgba(220,38,38,0.03) 0%, transparent 60%),
                            radial-gradient(circle at 20% 100%, rgba(249,115,22,0.03) 0%, transparent 60%)`
        }} />

        <Navbar />
        <main className="flex-1 overflow-y-auto p-8 relative z-10 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

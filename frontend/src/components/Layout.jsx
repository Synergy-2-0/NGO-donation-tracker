import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans selection:bg-orange-500 selection:text-white">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {/* Subtle Branding Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-tf-primary/5 rounded-full blur-[150px] -mr-64 -mt-64 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tf-accent/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none"></div>
        
        <Navbar />
        <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative z-10 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

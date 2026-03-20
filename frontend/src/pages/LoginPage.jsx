import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { login, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(form.email, form.password);
      if (user?.role !== 'donor') {
        // Portals are unified in Sidebar now, but we check if they are supposed to be here
        // If the user has a role, they are logged in.
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch font-sans antialiased text-slate-900 overflow-hidden">
      {/* Visual Section - Left (Hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 bg-[#0F172A] relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[160px] -mr-64 -mt-64 pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] -ml-64 -mb-64 pointer-events-none"></div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
               <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
               </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white tracking-tighter uppercase italic leading-none">Synergy</span>
              <span className="text-[10px] font-bold text-indigo-400 tracking-[0.2em] uppercase mt-1">Donation Tracker</span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-5xl font-black text-white leading-tight tracking-tight mb-8"
          >
            Empowering Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 italic">Impact</span> Through Strategic Transparency.
          </motion.h2>
          <div className="flex gap-4">
            <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
            <p className="text-indigo-200/60 font-medium text-lg italic">
              "Join 10,000+ donors bridging the gap between intention and verified execution."
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-xs font-black text-indigo-400 tracking-widest uppercase opacity-40">
           <span>Privacy Optimized</span>
           <span className="w-1 h-1 bg-indigo-800 rounded-full"></span>
           <span>SEC Compliant Ledger</span>
        </div>
      </div>

      {/* Form Section - Right */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-[#F8FAFC]">
        <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="w-full max-w-md space-y-12"
        >
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">Welcome Back</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Authentication required for terminal access.</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              className="bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl shadow-sm italic"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Identity (Email)</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="donor.discovery@synergy.net"
                    className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-5 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all font-semibold text-slate-700 placeholder:text-slate-200"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Access Credentials</label>
                    <a href="#" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors">Key Recovery?</a>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-5 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all font-semibold text-slate-700 placeholder:text-slate-200"
                  />
                </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl transition-all active:scale-[0.98] ${loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
            >
              {loading ? 'Decrypting Access...' : 'Authenticate Identity'}
            </button>
          </form>

          <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            No active identity? <Link to="/" className="text-indigo-600 hover:scale-105 inline-block transition-transform">Register Registry</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

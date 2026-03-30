import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function PublicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'The Mission', href: '/about' },
    { label: 'Impact Catalog', href: '/causes' },
    { label: 'Operational Hub', href: '/how-it-works' },
    { label: 'Field Evidence', href: '/impact' },
    { label: 'Partner Network', href: '/partners/list' }
  ];

  const isHomePage = location.pathname === '/';
  const logoSrc = (scrolled || !isHomePage) ? '/heart-logo d.png' : '/heart-logo c.png';

  const getDashboardLabel = () => {
    if (!user) return 'Mission Entry';
    if (user.role === 'admin') return 'System Control';
    if (user.role === 'ngo-admin') return 'Mission Intelligence';
    return 'Impact Hub';
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-10 md:px-24 py-8 flex items-center justify-between font-sans ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl border-b border-slate-100 py-6 shadow-2xl' 
        : (isHomePage ? 'bg-transparent text-white' : 'bg-white border-b border-slate-50 py-6')
    }`}>
      {/* Brand Section */}
      <Link to="/" className="flex items-center gap-6 group cursor-pointer">
        <img 
          src={logoSrc} 
          alt="TransFund Logo" 
          className="h-12 md:h-14 w-auto object-contain transition-all duration-700 group-hover:scale-105" 
        />
        <div className="h-8 w-px bg-slate-200/20 rotate-12 hidden lg:block" />
        <p className={`hidden lg:block text-[10px] font-black uppercase tracking-[0.6em] italic ${scrolled || !isHomePage ? 'text-slate-400' : 'text-white/40'}`}>Transfund Registry</p>
      </Link>

      {/* Primary Navigation Matrix */}
      <div className={`hidden lg:flex items-center gap-14 text-[11px] font-black uppercase tracking-[0.4em] italic ${
        scrolled || !isHomePage ? 'text-slate-500' : 'text-white/70'
      }`}>
        {navLinks.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="hover:text-tf-primary transition-all relative group py-2"
          >
            {item.label}
            <span className="absolute bottom-0 left-0 w-0 h-px bg-tf-primary transition-all group-hover:w-full" />
          </Link>
        ))}
      </div>

      {/* Strategic Entry Points */}
      <div className="flex items-center gap-8">
        {user ? (
          <div className="flex items-center gap-10">
             <button
               onClick={() => logout()}
               className={`hidden md:block text-[10px] font-black uppercase tracking-[0.5em] italic transition-all underline underline-offset-[12px] decoration-tf-primary/20 hover:decoration-tf-primary hover:text-tf-primary ${
                 scrolled || !isHomePage ? 'text-slate-300' : 'text-white/30'
               }`}
             >
               Discard Session
             </button>
             <button
               onClick={() => navigate('/dashboard')}
               className="px-14 py-5 bg-slate-950 hover:bg-tf-primary text-white text-[11px] font-black uppercase tracking-[0.5em] rounded-full transition-all shadow-3xl hover:shadow-tf-primary/30 active:scale-95 italic"
             >
               {getDashboardLabel()}
             </button>
          </div>
        ) : (
          <div className="flex items-center gap-10">
            <button
              onClick={() => navigate('/login')}
              className={`hidden md:block text-[10px] font-black uppercase tracking-[0.5em] italic transition-all underline underline-offset-[12px] decoration-tf-primary/20 hover:decoration-tf-primary hover:text-tf-primary ${
                scrolled || !isHomePage ? 'text-slate-950' : 'text-white'
              }`}
            >
              Authorize
            </button>
            <button
              onClick={() => navigate('/login?tab=signup')}
              className="px-14 py-5 bg-tf-primary hover:bg-slate-950 text-white text-[11px] font-black uppercase tracking-[0.5em] rounded-full transition-all shadow-3xl shadow-tf-primary/20 active:scale-95 italic"
            >
              Get Started HUB
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

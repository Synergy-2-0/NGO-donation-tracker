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
    { label: 'Our Mission', href: '/about' },
    { label: 'Causes', href: '/causes' },
    { label: 'Transparency', href: '/transparency' },
    { label: 'How it Works', href: '/how-it-works' },
    { label: 'Impact', href: '/impact' },
    { label: 'Partners', href: '/partners/list' }
  ];

  const isHomePage = location.pathname === '/';
  const logoSrc = (scrolled || !isHomePage) ? '/heart-logo d.png' : '/heart-logo c.png';

  const getDashboardLabel = () => {
    if (!user) return 'Login';
    if (user.role === 'admin') return 'Admin Portal';
    if (user.role === 'ngo-admin') return 'NGO Dashboard';
    return 'Donor Dashboard';
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-6 md:px-12 lg:px-20 py-5 flex items-center justify-between font-sans ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl border-b border-slate-100 py-4 shadow-2xl' 
        : (isHomePage ? 'bg-transparent text-white' : 'bg-white border-b border-slate-50 py-4')
    }`}>
      {/* Brand Section */}
      <div className="flex-1 flex justify-start">
        <Link to="/" className="flex items-center group cursor-pointer shrink-0">
          <img 
            src={logoSrc} 
            alt="TransFund Logo" 
            className="h-10 md:h-12 w-auto object-contain transition-all duration-700 group-hover:scale-105" 
          />
        </Link>
      </div>

      {/* Primary Navigation Matrix */}
      <div className={`hidden lg:flex flex-[2] justify-center items-center gap-6 xl:gap-8 text-[10px] font-black uppercase tracking-[0.15em] italic ${
        scrolled || !isHomePage ? 'text-slate-500' : 'text-white/70'
      }`}>
        {navLinks.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="hover:text-tf-primary transition-all relative group py-2 whitespace-nowrap"
          >
            {item.label}
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-tf-primary transition-all group-hover:w-full" />
          </Link>
        ))}
      </div>

      {/* Strategic Entry Points */}
      <div className="flex-1 flex items-center justify-end gap-6">
        {user ? (
          <div className="flex items-center gap-6">
             <button
               onClick={() => logout()}
               className={`hidden xl:block text-[9px] font-black uppercase tracking-[0.3em] italic transition-all underline underline-offset-[10px] decoration-tf-primary/20 hover:decoration-tf-primary hover:text-tf-primary ${
                 scrolled || !isHomePage ? 'text-slate-300' : 'text-white/30'
               }`}
             >
               Discard
             </button>
             <button
               onClick={() => navigate('/dashboard')}
               className="px-8 py-3.5 bg-slate-950 hover:bg-tf-primary text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full transition-all shadow-xl hover:shadow-tf-primary/30 active:scale-95 italic whitespace-nowrap"
             >
               {getDashboardLabel()}
             </button>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/login')}
              className={`hidden md:block text-[9px] font-black uppercase tracking-[0.3em] transition-all underline underline-offset-[10px] decoration-tf-primary/20 hover:decoration-tf-primary hover:text-tf-primary ${
                scrolled || !isHomePage ? 'text-slate-950' : 'text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login?tab=signup')}
              className="px-8 py-3.5 bg-tf-primary hover:bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full transition-all shadow-xl shadow-tf-primary/20 active:scale-95 italic whitespace-nowrap"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

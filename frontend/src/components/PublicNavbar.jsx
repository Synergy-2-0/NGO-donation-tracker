import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function PublicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Causes', href: '/causes' },
    { label: 'System', href: '/how-it-works' },
    { label: 'Impact', href: '/impact' },
    { label: 'Partners', href: '/partners/list' }
  ];

  const isHomePage = location.pathname === '/';
  
  // Provided logos
  const logoSrc = (scrolled || !isHomePage) ? '/heart-logo d.png' : '/heart-logo c.png';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-8 md:px-20 py-6 flex items-center justify-between ${
      scrolled 
        ? 'bg-white border-b border-slate-100 py-4 shadow-sm' 
        : (isHomePage ? 'bg-transparent text-white' : 'bg-white border-b border-slate-100 py-4')
    }`}>
      {/* Brand Section */}
      <Link to="/" className="flex items-center gap-4 group cursor-pointer font-display">
        <img 
          src={logoSrc} 
          alt="TransFund Logo" 
          className="h-10 md:h-12 w-auto object-contain transition-all duration-500" 
        />
      </Link>

      {/* Primary Links */}
      <div className={`hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.3em] ${
        scrolled || !isHomePage ? 'text-slate-600' : 'text-white/80'
      }`}>
        {navLinks.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="hover:text-tf-primary transition-all cursor-pointer"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Action Point CTA */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate('/login')}
          className={`hidden md:block text-[11px] font-bold uppercase tracking-widest ${
            scrolled || !isHomePage ? 'text-tf-dark' : 'text-white'
          } hover:text-tf-primary transition-all underline underline-offset-8 decoration-tf-primary/30`}
        >
          Portal
        </button>
        <button
          onClick={() => navigate('/login?tab=signup')}
          className="px-10 py-3.5 bg-tf-primary hover:bg-tf-dark text-white text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-tf-primary/20 active:scale-95"
        >
          Initialize
        </button>
      </div>
    </nav>
  );
}

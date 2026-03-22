import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function PublicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Explore Causes', href: '/causes' },
    { label: 'How it Works', href: '/how-it-works' },
    { label: 'Our Impact', href: '/impact' },
    { label: 'Verified Partners', href: '/partners' }
  ];

  const isHomePage = location.pathname === '/';
  // Use white logo on home page when not scrolled, or always on other pages if they have dark headers
  // But wait, my other pages have dark headers too (tf-purple).
  // So I'll stick to: C (white text) on dark backgrounds, D (dark text) on white backgrounds.
  const logoSrc = isScrolled ? '/heart-logo d.png' : '/heart-logo c.png';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 font-sans ${
      isScrolled 
        ? 'bg-white border-b border-slate-200 py-3 shadow-sm' 
        : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <img 
            src={logoSrc} 
            alt="TrustFund Logo" 
            className="h-8 md:h-10 w-auto object-contain transition-all duration-500" 
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`text-[12px] font-bold uppercase tracking-wider transition-colors hover:text-tf-primary ${
                isScrolled ? 'text-slate-600' : 'text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className={`text-[12px] font-bold uppercase tracking-wider transition-colors px-6 py-2.5 rounded-full border ${
              isScrolled 
                ? 'text-tf-purple border-tf-purple hover:bg-tf-purple hover:text-white' 
                : 'text-white border-white hover:bg-white hover:text-tf-purple'
            }`}
          >
            Access Portal
          </button>
          <button
            onClick={() => navigate('/login?tab=signup')}
            className="px-8 py-2.5 bg-tf-primary hover:bg-orange-700 text-white text-[12px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-tf-primary/20 transition-all transform active:scale-95"
          >
            Start Campaign
          </button>
        </div>
      </div>
    </nav>
  );
}

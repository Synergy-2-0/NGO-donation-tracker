import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { FiGlobe, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t('public_navbar.causes'), href: '/causes' },
    { label: t('public_navbar.transparency'), href: '/transparency' },
    { label: t('public_navbar.partner_list'), href: '/partners/list' }
  ];

  const isHomePage = location.pathname === '/';
  const logoSrc = (scrolled || !isHomePage) ? '/heart-logo d.png' : '/heart-logo c.png';

  const getDashboardLabel = () => {
    if (!user) return t('public_navbar.login');
    if (user.role === 'admin') return t('public_navbar.admin_portal');
    if (user.role === 'ngo-admin') return t('public_navbar.ngo_dashboard');
    if (user.role === 'partner') return t('public_navbar.partner_dashboard');
    return t('public_navbar.donor_dashboard');
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-6 md:px-12 py-5 ${
        scrolled || !isHomePage ? 'bg-white shadow-2xl py-4' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-8">
        
        {/* Brand */}
        <Link to="/" className="flex-shrink-0 w-48 transition-transform hover:scale-110 duration-500">
           <img src={logoSrc} alt="TrustFund" className="h-8 md:h-10 object-contain" />
        </Link>

        {/* Navigation - Strategic & Spaced */}
        <div className="hidden lg:flex items-center justify-center gap-10 xl:gap-16 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-[10px] font-extrabold uppercase tracking-[0.3em] transition-all hover:text-tf-primary whitespace-nowrap ${
                scrolled || !isHomePage ? 'text-slate-900' : 'text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions Hub */}
        <div className="flex items-center gap-4 xl:gap-8">
          {/* Language Switcher */}
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
            scrolled || !isHomePage ? 'bg-slate-50 border-slate-100 shadow-inner' : 'bg-white/10 border-white/10 backdrop-blur-md'
          }`}>
            {['en', 'si', 'ta'].map((lng) => (
              <button
                key={lng}
                onClick={() => changeLanguage(lng)}
                className={`w-8 h-8 rounded-full text-[9px] font-extrabold transition-all flex items-center justify-center ${
                  i18n.language === lng 
                    ? 'bg-tf-primary text-white shadow-lg shadow-tf-primary/20' 
                    : 'text-slate-400 hover:text-tf-primary'
                }`}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>

          <div className={`h-8 w-[1px] hidden xl:block ${scrolled || !isHomePage ? 'bg-slate-100' : 'bg-white/10'}`} />

          {/* Desktop Actions */}
          {user ? (
            <div className="hidden lg:flex items-center gap-6">
               <button
                 onClick={() => logout()}
                 className={`text-[9px] font-extrabold text-slate-400 uppercase tracking-widest hover:text-tf-primary transition-colors `}
               >
                 {t('public_navbar.discard')}
               </button>
               <button
                 onClick={() => navigate('/dashboard')}
                 className="px-8 py-3 bg-slate-950 hover:bg-tf-primary text-white text-[9px] font-extrabold uppercase tracking-widest rounded-full transition-all shadow-xl "
               >
                 {getDashboardLabel()}
               </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-6">
              <button
                onClick={() => navigate('/login')}
                className={`text-[9px] font-extrabold uppercase tracking-widest transition-all ${
                  scrolled || !isHomePage ? 'text-slate-950' : 'text-white'
                }`}
              >
                {t('public_navbar.sign_in')}
              </button>
              <button
                onClick={() => navigate('/login?tab=signup')}
                className="px-8 py-3 bg-tf-primary hover:bg-slate-950 text-white text-[9px] font-extrabold uppercase tracking-widest rounded-full transition-all shadow-xl "
              >
                {t('public_navbar.get_started')}
              </button>
            </div>
          )}

          {/* Mobile Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-3 rounded-xl transition-all ${
              scrolled || !isHomePage ? 'text-slate-900 bg-slate-100' : 'text-white bg-white/10'
            }`}
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-slate-100 overflow-hidden lg:hidden"
          >
            <div className="p-8 flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-extrabold text-slate-900 uppercase tracking-[0.2em] "
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px bg-slate-100 w-full" />
              
              {user ? (
                 <div className="flex flex-col gap-4">
                    <button
                      onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
                      className="w-full py-5 bg-slate-950 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-2xl "
                    >
                      {getDashboardLabel()}
                    </button>
                    <button
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="w-full py-5 bg-slate-50 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest rounded-2xl "
                    >
                      {t('public_navbar.discard')}
                    </button>
                 </div>
              ) : (
                <div className="flex flex-col gap-4">
                   <button
                     onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                     className="w-full py-5 bg-slate-50 text-slate-900 text-[10px] font-extrabold uppercase tracking-widest rounded-2xl  border border-slate-200"
                   >
                     {t('public_navbar.sign_in')}
                   </button>
                   <button
                     onClick={() => { navigate('/login?tab=signup'); setMobileMenuOpen(false); }}
                     className="w-full py-5 bg-tf-primary text-white text-[10px] font-extrabold uppercase tracking-widest rounded-2xl "
                   >
                     {t('public_navbar.get_started')}
                   </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

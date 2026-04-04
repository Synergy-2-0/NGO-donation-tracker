import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiGlobe } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const pageTitle = {
    admin: t('navbar.admin_console', { defaultValue: 'Admin Console' }),
    'ngo-admin': t('navbar.ngo_ops', { defaultValue: 'NGO Operations' }),
    partner: t('navbar.partner_portal', { defaultValue: 'Partner Portal' }),
    donor: t('navbar.donor_dash', { defaultValue: 'Donor Dashboard' }),
  }[user?.role] || t('navbar.dashboard');

  const roleTag = {
    admin: { label: t('navbar.roles.admin'), cls: 'bg-rose-50 text-rose-500 border-rose-100' },
    'ngo-admin': { label: t('navbar.roles.ngo_admin'), cls: 'bg-slate-50 text-slate-500 border-slate-200' },
    partner: { label: t('navbar.roles.partner'), cls: 'bg-emerald-50 text-emerald-500 border-emerald-100' },
    donor: { label: t('navbar.roles.donor'), cls: 'bg-sky-50 text-sky-600 border-sky-100' },
  }[user?.role] || { label: user?.role || 'User', cls: 'bg-slate-50 text-slate-500 border-slate-100' };

  return (
    <header className="glass-surface sticky top-0 px-8 py-4 flex items-center justify-between shrink-0 z-10">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-bold text-slate-900 tracking-bespoke">{pageTitle}</h1>
        <div className="w-1 h-1 rounded-full bg-slate-200" />
        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${roleTag.cls}`}>
          {roleTag.label}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 pr-6 border-r border-slate-100 hidden sm:flex">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-800 leading-none tracking-bespoke">{user?.name}</p>
            <p className="text-[9px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">{user?.email}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/10 border border-white/10 hover:border-brand-red/30 transition-all duration-300">
            <span className="text-white font-bold text-[10px] uppercase tracking-bespoke">
              {(user?.name || user?.email || 'U')[0]}
            </span>
          </div>
        </div>
        
        {/* Language Switcher */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
          <button
            onClick={() => changeLanguage('en')}
            className={`px-3 py-1.5 text-[10px] font-extrabold rounded-xl transition-all ${i18n.language === 'en' ? 'bg-white text-tf-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            EN
          </button>
          <div className="w-[1px] h-3 bg-slate-200" />
          <button
            onClick={() => changeLanguage('si')}
            className={`px-3 py-1.5 text-[10px] font-extrabold rounded-xl transition-all ${i18n.language === 'si' ? 'bg-white text-tf-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            සිං
          </button>
          <div className="w-[1px] h-3 bg-slate-200" />
          <button
            onClick={() => changeLanguage('ta')}
            className={`px-3 py-1.5 text-[10px] font-extrabold rounded-xl transition-all ${i18n.language === 'ta' ? 'bg-white text-tf-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            தமி
          </button>
        </div>

        <div className="h-8 w-[1px] bg-gray-100 hidden md:block"></div>

        <button
          onClick={logout}
          className="text-[10px] font-bold text-tf-primary hover:text-orange-700 uppercase tracking-widest transition-all hover:translate-x-1 flex items-center gap-2"
        >
          <span className="text-xs font-extrabold uppercase tracking-widest">{t('navbar.logout')}</span>
          <FiLogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

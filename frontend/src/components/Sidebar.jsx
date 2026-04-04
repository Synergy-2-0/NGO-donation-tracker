import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid,
  FiDollarSign,
  FiRepeat,
  FiShoppingBag,
  FiUser,
  FiCheckSquare,
  FiClock,
  FiUsers,
  FiShield,
  FiFileText,
  FiBarChart2,
  FiTarget,
  FiChevronRight,
  FiLogOut,
  FiMapPin,
  FiActivity,
} from 'react-icons/fi';
import { LuScale3D } from 'react-icons/lu';

// ─── Navigation configs per role ─────────────────────────────────────────────

const partnerNav = [
  {
    section: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: <FiGrid /> },
      { to: '/finance/transactions', label: 'Recent Activity', icon: <FiRepeat /> },
    ],
  },
  {
    section: 'Partnerships',
    items: [
      { to: '/partner/agreements', label: 'My Agreements', icon: <LuScale3D /> },
      { to: '/marketplace', label: 'Campaigns', icon: <FiShoppingBag /> },
    ],
  },
  {
    section: 'Account',
    items: [
      { to: '/profile', label: 'My Profile', icon: <FiUser /> },
      { to: '/settings', label: 'Security', icon: <FiShield /> },
    ],
  },
];

const adminNav = [
  {
    section: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: <FiGrid /> },
    ],
  },
  {
    section: 'Donors',
    items: [
      { to: '/admin/donors', label: 'Donor List', icon: <FiUsers /> },
      { to: '/admin/donors/pledges', label: 'All Pledges', icon: <FiCheckSquare /> },
      { to: '/admin/donor-analytics', label: 'Donor Data', icon: <FiBarChart2 /> },
    ],
  },
  {
    section: 'Missions',
    items: [
      { to: '/admin/campaign-dashboard', label: 'Mission Registry', icon: <FiTarget /> },
    ],
  },
  {
    section: 'Partners',
    items: [
      { to: '/partners', label: 'Partner List', icon: <FiMapPin /> },
      { to: '/partners/verification', label: 'Pending Access', icon: <FiShield /> },
      { to: '/partner/agreements', label: 'Managed Agreements', icon: <LuScale3D /> },
      { to: '/settings', label: 'Security', icon: <FiShield /> },
    ],
  },
];

const ngoAdminNav = [
  {
    section: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: <FiGrid /> },
      { to: '/finance/dashboard', label: 'Finance Summary', icon: <FiDollarSign /> },
      { to: '/finance/transactions', label: 'Recent Activity', icon: <FiRepeat /> },
    ],
  },
  {
    section: 'Campaigns',
    items: [
      { to: '/admin/campaign-dashboard', label: 'Manage Projects', icon: <FiTarget /> },
    ],
  },
  {
    section: 'Partners',
    items: [
      { to: '/partners', label: 'Partner List', icon: <FiUsers /> },
      { to: '/partners/verification', label: 'Pending Access', icon: <FiShield /> },
      { to: '/partner/agreements', label: 'Active Agreements', icon: <LuScale3D /> },
      { to: '/settings', label: 'Security', icon: <FiShield /> },
    ],
  },
];

const donorNav = [
  {
    section: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: <FiGrid /> },
    ],
  },
  {
    section: 'Giving',
    items: [
      { to: '/marketplace', label: 'Campaigns', icon: <FiShoppingBag /> },
      { to: '/pledges', label: 'My Pledges', icon: <FiCheckSquare /> },
      { to: '/donations', label: 'Donation History', icon: <FiClock /> },
    ],
  },
  {
    section: 'Account',
    items: [
      { to: '/profile', label: 'My Profile', icon: <FiUser /> },
      { to: '/settings', label: 'Security', icon: <FiShield /> },
    ],
  },
];

function getNavByRole(role) {
  if (role === 'admin') return adminNav;
  if (role === 'ngo-admin') return ngoAdminNav;
  if (role === 'partner') return partnerNav;
  return donorNav;
}

function getRoleTag(role, t) {
  const map = {
    admin: { label: t('navbar.roles.admin', { defaultValue: 'System Admin' }), color: 'bg-rose-50/5 text-rose-400 border-rose-500/20' },
    'ngo-admin': { label: t('navbar.roles.ngo_admin', { defaultValue: 'Administrator' }), color: 'bg-white/5 text-slate-300 border-white/10' },
    partner: { label: t('navbar.roles.partner', { defaultValue: 'Official Partner' }), color: 'bg-emerald-50/5 text-emerald-400 border-emerald-500/20' },
    donor: { label: t('navbar.roles.donor', { defaultValue: 'Verified Donor' }), color: 'bg-sky-50/5 text-sky-400 border-sky-500/20' },
  };
  return map[role] || { label: role, color: 'bg-slate-500/5 text-slate-400 border-slate-500/20' };
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const role = user?.role;

  const partnerNav = [
    {
      section: t('sidebar.sections.management'),
      items: [
        { to: '/dashboard', label: t('navbar.dashboard'), icon: <FiGrid /> },
        { to: '/finance/transactions', label: t('sidebar.items.operations_log'), icon: <FiRepeat /> },
      ],
    },
    {
      section: t('sidebar.sections.partnership_core'),
      items: [
        { to: '/partner/agreements', label: t('navbar.my_agreements'), icon: <LuScale3D /> },
        { to: '/partner/milestones', label: t('navbar.milestone_registry'), icon: <FiCheckSquare /> },
        { to: '/marketplace', label: t('sidebar.items.collab_missions'), icon: <FiShoppingBag /> },
      ],
    },
    {
      section: t('sidebar.sections.intel_ai'),
      items: [
        { to: '/partner/ai-match', label: t('navbar.ai_matchmaker'), icon: <FiActivity /> },
        { to: '/partner/csr-hub', label: t('navbar.csr_hub'), icon: <FiTarget /> },
      ],
    },
    {
      section: t('sidebar.sections.institutional'),
      items: [
        { to: '/profile', label: t('navbar.corporate_profile'), icon: <FiUser /> },
        { to: '/settings', label: t('navbar.settings'), icon: <FiShield /> },
      ],
    },
  ];

  const adminNav = [
    {
      section: t('navbar.overview'),
      items: [
        { to: '/dashboard', label: t('navbar.dashboard'), icon: <FiGrid /> },
      ],
    },
    {
      section: t('navbar.donors'),
      items: [
        { to: '/admin/donors', label: t('navbar.donor_list'), icon: <FiUsers /> },
        { to: '/admin/donors/pledges', label: t('navbar.all_pledges'), icon: <FiCheckSquare /> },
        { to: '/admin/donor-analytics', label: t('navbar.donor_data'), icon: <FiBarChart2 /> },
      ],
    },
    {
      section: t('navbar.missions'),
      items: [
        { to: '/admin/campaign-dashboard', label: t('navbar.mission_registry'), icon: <FiTarget /> },
      ],
    },
    {
      section: t('navbar.partners'),
      items: [
        { to: '/partners', label: t('navbar.partner_list'), icon: <FiMapPin /> },
        { to: '/partners/verification', label: t('navbar.pending_access'), icon: <FiShield /> },
        { to: '/partner/agreements', label: t('navbar.managed_agreements'), icon: <LuScale3D /> },
        { to: '/settings', label: t('navbar.security_hub'), icon: <FiShield /> },
      ],
    },
  ];

  const ngoAdminNav = [
    {
      section: t('navbar.overview'),
      items: [
        { to: '/dashboard', label: t('navbar.dashboard'), icon: <FiGrid /> },
        { to: '/finance/dashboard', label: t('navbar.finance_summary'), icon: <FiDollarSign /> },
        { to: '/finance/transactions', label: t('navbar.recent_activity'), icon: <FiRepeat /> },
      ],
    },
    {
      section: t('navbar.campaigns'),
      items: [
        { to: '/admin/campaign-dashboard', label: t('navbar.manage_projects'), icon: <FiTarget /> },
      ],
    },
    {
      section: t('navbar.partners'),
      items: [
        { to: '/partners', label: t('navbar.partner_list'), icon: <FiUsers /> },
        { to: '/partners/verification', label: t('navbar.pending_access'), icon: <FiShield /> },
        { to: '/partner/agreements', label: t('navbar.active_agreements'), icon: <LuScale3D /> },
        { to: '/settings', label: t('navbar.security_hub'), icon: <FiShield /> },
      ],
    },
  ];

  const donorNav = [
    {
      section: t('navbar.overview'),
      items: [
        { to: '/dashboard', label: t('navbar.dashboard'), icon: <FiGrid /> },
      ],
    },
    {
      section: t('navbar.giving'),
      items: [
        { to: '/marketplace', label: t('navbar.campaigns'), icon: <FiShoppingBag /> },
        { to: '/pledges', label: t('navbar.pledges'), icon: <FiCheckSquare /> },
        { to: '/donations', label: t('navbar.history'), icon: <FiClock /> },
      ],
    },
    {
      section: t('navbar.account'),
      items: [
        { to: '/profile', label: t('navbar.profile'), icon: <FiUser /> },
        { to: '/settings', label: t('navbar.settings'), icon: <FiShield /> },
      ],
    },
  ];

  function getNavByRole(r) {
    if (r === 'admin') return adminNav;
    if (r === 'ngo-admin') return ngoAdminNav;
    if (r === 'partner') return partnerNav;
    return donorNav;
  }

  const navSections = getNavByRole(role);
  const roleTag = getRoleTag(role, t);

  const linkCls = ({ isActive }) =>
    `group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
      isActive
        ? 'bg-white/10 text-white shadow-inner'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`;

  return (
    <aside className="w-64 shrink-0 flex flex-col h-screen sticky top-0 overflow-hidden"
      style={{ background: 'linear-gradient(170deg, #0f172a 0%, #1e1b2e 60%, #1a0a0a 100%)' }}>

      {/* Top glow accent */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-brand-red/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-brand-orange/5 blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="relative p-6 flex items-center justify-center border-b border-white/5 shrink-0">
        <img src="/heart-logo c.png" alt="TrustFund" className="w-40 h-auto object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-transform hover:scale-105 duration-500" />
      </div>

      {/* User profile chip */}
      <div className="relative px-4 py-4 border-b border-white/5 shrink-0">
        <Link to="/profile" className="flex items-center gap-3 p-2.5 rounded-full hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all group animate-soft">
          <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-white/10 flex items-center justify-center shrink-0 shadow-lg group-hover:border-brand-red/20 transition-all duration-500">
            <span className="text-white font-bold text-sm tracking-bespoke opacity-80 group-hover:opacity-100 transition-opacity">
              {(user?.name || user?.email || 'U')[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[11px] font-semibold truncate tracking-bespoke">{user?.name || 'User'}</p>
            <div className="flex items-center gap-1.5 mt-1">
               <span className={`text-[8px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full border ${roleTag.color}`}>
                {roleTag.label}
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-none">
        {navSections.map((section) => (
          <div key={section.section} className="mb-4">
            <p className="text-[9px] font-extrabold text-slate-600 uppercase tracking-[0.2em] px-4 mb-2">
              {section.section}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink key={item.to} to={item.to} end className={linkCls}>
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-red rounded-r-full" />
                      )}
                      <span className={`text-lg shrink-0 transition-colors ${isActive ? 'text-brand-red' : 'text-slate-500 group-hover:text-slate-300'}`}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                      {isActive && <FiChevronRight className="ml-auto text-slate-500 text-xs" />}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="relative px-4 py-4 border-t border-white/5">
        <p className="text-center text-slate-700 text-[10px] font-bold uppercase tracking-widest">
          TrustFund &copy; {new Date().getFullYear()}
        </p>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(255,255,255,0.05); 
          border-radius: 10px; 
          transition: background 0.3s;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(255,138,0,0.1); }
      `}</style>
    </aside>
  );
}

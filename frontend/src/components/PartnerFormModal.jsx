import { useEffect, useMemo, useState } from 'react';
import ErrorAlert from './ErrorAlert';
import { SDG_GOALS } from '../utils/partnerInsights';
import { FiX, FiCheck, FiArrowRight, FiShield, FiBriefcase, FiMapPin, FiGlobe, FiTarget, FiLink } from 'react-icons/fi';

const ORG_TYPES = ['corporate', 'foundation', 'government', 'individual'];
const COMPANY_SIZES = ['small', 'medium', 'large', 'enterprise'];
const CSR_FOCUS = [
  'education',
  'health',
  'environment',
  'poverty_alleviation',
  'clean_water',
  'sustainable_development',
  'community_development',
  'disaster_relief',
];
const PARTNERSHIP_TYPES = ['financial', 'in-kind', 'skills-based', 'marketing', 'hybrid'];
const DURATIONS = ['short-term', 'long-term', 'ongoing'];
const SKILLS = [
  'legal',
  'marketing',
  'technology',
  'finance',
  'hr',
  'logistics',
  'communications',
  'project_management',
];
const DOC_TYPES = ['registration', 'tax_clearance', 'csr_policy', 'annual_report'];

const defaultForm = {
  logoUrl: '',
  organizationName: '',
  organizationType: 'corporate',
  industry: '',
  companySize: 'medium',
  contactPerson: {
    name: '',
    email: '',
    phone: '',
    position: '',
  },
  address: {
    street: '',
    city: '',
    state: '',
    country: 'Sri Lanka',
    postalCode: '',
    longitude: '',
    latitude: '',
  },
  csrFocus: [],
  sdgGoalsText: '',
  partnershipPreferences: {
    budgetRange: { min: '', max: '' },
    partnershipTypes: ['financial'],
    duration: 'long-term',
    geographicFocusText: '',
  },
  capabilities: {
    financialCapacity: '',
    inKindOfferingsText: '',
    skillsAvailable: [],
    employeeCount: '',
    volunteerHoursAvailable: '',
  },
  verificationDocuments: [],
};

const toTitle = (v = '') => v.replace(/[_-]/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase());

const splitCsv = (value) => value.split(',').map(v => v.trim()).filter(Boolean);

const parseSdgGoals = (value) => {
  const nums = splitCsv(value).map(v => Number(v)).filter(n => Number.isInteger(n) && n >= 1 && n <= 17);
  return Array.from(new Set(nums));
};

function fromPartner(p) {
  const lon = p?.address?.coordinates?.coordinates?.[0];
  const lat = p?.address?.coordinates?.coordinates?.[1];
  return {
    logoUrl: p?.logoUrl || '',
    organizationName: p?.organizationName || '',
    organizationType: p?.organizationType || 'corporate',
    industry: p?.industry || '',
    companySize: p?.companySize || 'medium',
    contactPerson: {
      name: p?.contactPerson?.name || '',
      email: p?.contactPerson?.email || '',
      phone: p?.contactPerson?.phone || '',
      position: p?.contactPerson?.position || '',
    },
    address: {
      street: p?.address?.street || '',
      city: p?.address?.city || '',
      state: p?.address?.state || '',
      country: p?.address?.country || 'Sri Lanka',
      postalCode: p?.address?.postalCode || '',
      longitude: lon != null ? String(lon) : '',
      latitude: lat != null ? String(lat) : '',
    },
    csrFocus: Array.isArray(p?.csrFocus) ? p.csrFocus : [],
    sdgGoalsText: Array.isArray(p?.sdgGoals) ? p.sdgGoals.join(', ') : '',
    partnershipPreferences: {
      budgetRange: {
        min: p?.partnershipPreferences?.budgetRange?.min ?? '',
        max: p?.partnershipPreferences?.budgetRange?.max ?? '',
      },
      partnershipTypes: Array.isArray(p?.partnershipPreferences?.partnershipTypes) ? p.partnershipPreferences.partnershipTypes : ['financial'],
      duration: p?.partnershipPreferences?.duration || 'long-term',
      geographicFocusText: Array.isArray(p?.partnershipPreferences?.geographicFocus) ? p.partnershipPreferences.geographicFocus.join(', ') : '',
    },
    capabilities: {
      financialCapacity: p?.capabilities?.financialCapacity ?? '',
      inKindOfferingsText: Array.isArray(p?.capabilities?.inKindOfferings) ? p.capabilities.inKindOfferings.join(', ') : '',
      skillsAvailable: Array.isArray(p?.capabilities?.skillsAvailable) ? p.capabilities.skillsAvailable : [],
      employeeCount: p?.capabilities?.employeeCount ?? '',
      volunteerHoursAvailable: p?.capabilities?.volunteerHoursAvailable ?? '',
    },
    verificationDocuments: (p?.verificationDocuments || []).map(d => ({ documentType: d.documentType || 'registration', url: d.url || '' })),
  };
}

export default function PartnerFormModal({ partner, loading, onClose, onSave }) {
  const [form, setForm] = useState(() => (partner ? fromPartner(partner) : defaultForm));
  const [error, setError] = useState('');

  const title = partner?._id ? 'Edit Entity' : 'Register Entity';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.organizationName.trim()) return setError('Name is required.');
    if (!form.industry.trim()) return setError('Industry is required.');
    setError('');
    
    const payload = {
        ...form,
        organizationName: form.organizationName.trim(),
        industry: form.industry.trim(),
        sdgGoals: parseSdgGoals(form.sdgGoalsText),
        partnershipPreferences: {
            ...form.partnershipPreferences,
            budgetRange: {
                min: Number(form.partnershipPreferences.budgetRange.min),
                max: Number(form.partnershipPreferences.budgetRange.max)
            },
            geographicFocus: splitCsv(form.partnershipPreferences.geographicFocusText)
        },
        capabilities: {
            ...form.capabilities,
            financialCapacity: Number(form.capabilities.financialCapacity),
            inKindOfferings: splitCsv(form.capabilities.inKindOfferingsText),
            employeeCount: form.capabilities.employeeCount !== '' ? Number(form.capabilities.employeeCount) : undefined,
            volunteerHoursAvailable: form.capabilities.volunteerHoursAvailable !== '' ? Number(form.capabilities.volunteerHoursAvailable) : undefined
        }
    };
    onSave(payload);
  };

  const updateField = (path, val) => {
    setForm(prev => {
        const next = { ...prev };
        let curr = next;
        for (let i = 0; i < path.length - 1; i++) {
            curr[path[i]] = { ...curr[path[i]] };
            curr = curr[path[i]];
        }
        curr[path[path.length - 1]] = val;
        return next;
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-left">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn">
        <div className="flex items-center justify-between p-8 border-b border-slate-50 shrink-0">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-slate-400 mb-1">Impact Governance</p>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h3>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-rose-50 rounded-2xl text-slate-400 hover:text-rose-500 transition-all active:scale-90">
            <FiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 pt-6 space-y-12">
          {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-2xl font-bold flex items-center gap-3"><FiShield className="shrink-0" /> {error}</div>}

          {/* Section: Basic Intelligence */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center text-sm"><FiBriefcase /></span>
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Structural Foundations</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-3">
                  <FormInput label="Identifier Logo URL" value={form.logoUrl} onChange={v => updateField(['logoUrl'], v)} />
               </div>
               <FormInput label="Official Legal Name" required value={form.organizationName} onChange={v => updateField(['organizationName'], v)} />
               <FormSelect label="Structural Type" value={form.organizationType} onChange={v => updateField(['organizationType'], v)} options={ORG_TYPES} />
               <FormInput label="Primary Industry" required value={form.industry} onChange={v => updateField(['industry'], v)} />
               <FormSelect label="Scale" value={form.companySize} onChange={v => updateField(['companySize'], v)} options={COMPANY_SIZES} />
            </div>
          </div>

          {/* Section: Direct Communication */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center text-sm"><FiGlobe /></span>
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Communication Nodes</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <FormInput label="Contact Name" value={form.contactPerson.name} onChange={v => updateField(['contactPerson', 'name'], v)} />
               <FormInput label="Secure Email" value={form.contactPerson.email} onChange={v => updateField(['contactPerson', 'email'], v)} />
               <FormInput label="Direct Phone" value={form.contactPerson.phone} onChange={v => updateField(['contactPerson', 'phone'], v)} />
               <FormInput label="Governance Position" value={form.contactPerson.position} onChange={v => updateField(['contactPerson', 'position'], v)} />
            </div>
          </div>

          {/* Section: Geographic Nodes */}
          <div className="space-y-6">
             <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center text-sm"><FiMapPin /></span>
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Geographic Registry</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
               <FormInput label="Street" value={form.address.street} onChange={v => updateField(['address', 'street'], v)} />
               <FormInput label="City" value={form.address.city} onChange={v => updateField(['address', 'city'], v)} />
               <FormInput label="State" value={form.address.state} onChange={v => updateField(['address', 'state'], v)} />
               <FormInput label="Country" value={form.address.country} onChange={v => updateField(['address', 'country'], v)} />
               <FormInput label="Postal Node" value={form.address.postalCode} onChange={v => updateField(['address', 'postalCode'], v)} />
            </div>
          </div>

          {/* Section: SDG Synergy */}
          <div className="space-y-6">
             <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center text-sm"><FiTarget /></span>
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Synergy & Focus</h4>
            </div>
            <div className="grid grid-cols-1 gap-8">
               <div className="space-y-4">
                  <p className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest">CSR Focus Areas</p>
                  <div className="flex flex-wrap gap-2">
                     {CSR_FOCUS.map(f => {
                       const active = form.csrFocus.includes(f);
                       return (
                         <button key={f} type="button" onClick={() => {
                            const next = active ? form.csrFocus.filter(v => v !== f) : [...form.csrFocus, f];
                            setForm(p => ({ ...p, csrFocus: next }));
                         }} className={`px-4 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-widest border transition-all ${active ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'}`}>
                            {toTitle(f)}
                         </button>
                       );
                     })}
                  </div>
               </div>
               
               <div className="space-y-4">
                  <p className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest">Global SDG Synergy Node (1-17)</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({length: 17}, (_, i) => i + 1).map(n => {
                       const active = parseSdgGoals(form.sdgGoalsText).includes(n);
                       return (
                         <button key={n} type="button" onClick={() => {
                            const curr = parseSdgGoals(form.sdgGoalsText);
                            const next = active ? curr.filter(v => v !== n) : [...curr, n].sort((a,b) => a-b);
                            updateField(['sdgGoalsText'], next.join(', '));
                         }} className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-extrabold transition-all border ${active ? 'bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/20 scale-110 z-10' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300'}`}>
                            {n}
                         </button>
                       );
                    })}
                  </div>
               </div>
            </div>
          </div>
        </form>

        <div className="p-8 border-t border-slate-50 bg-slate-50/50 shrink-0 flex items-center justify-between">
            <p className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest hidden sm:block">Synergy Core V2.4</p>
            <div className="flex gap-3 w-full sm:w-auto">
               <button onClick={onClose} className="flex-1 sm:flex-none px-8 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-slate-50 transition-all">
                  Cancel Node
               </button>
               <button onClick={handleSubmit} disabled={loading} className="flex-1 sm:flex-none px-8 py-3.5 bg-brand-red text-white rounded-2xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-brand-red/90 shadow-xl shadow-brand-red/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
                  {loading ? 'Processing...' : 'Sync Registry'} <FiCheck className="text-sm stroke-[3]" />
               </button>
            </div>
        </div>
      </div>
    </div>
  );
}

function FormInput({ label, required, value, onChange, type="text" }) {
    return (
        <div className="space-y-2 group">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 group-focus-within:text-brand-red transition-colors flex items-center gap-1.5">
               {label} {required && <span className="w-1 h-1 rounded-full bg-brand-red" />}
            </label>
            <input 
              type={type} 
              value={value} 
              onChange={e => onChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red/20 transition-all"
            />
        </div>
    );
}

function FormSelect({ label, value, onChange, options }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{label}</label>
            <select 
              value={value} 
              onChange={e => onChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-brand-red/5 transition-all appearance-none cursor-pointer"
            >
              {options.map(o => <option key={o} value={o}>{toTitle(o)}</option>)}
            </select>
        </div>
    );
}

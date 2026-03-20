import { useEffect, useMemo, useState } from 'react';
import ErrorAlert from './ErrorAlert';

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

const toTitle = (value) =>
  value
    .split('_')
    .join(' ')
    .split('-')
    .join(' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase());

const splitCsv = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

function fromPartner(partner) {
  const longitude = partner?.address?.coordinates?.coordinates?.[0];
  const latitude = partner?.address?.coordinates?.coordinates?.[1];
  return {
    organizationName: partner?.organizationName || '',
    organizationType: partner?.organizationType || 'corporate',
    industry: partner?.industry || '',
    companySize: partner?.companySize || 'medium',
    contactPerson: {
      name: partner?.contactPerson?.name || '',
      email: partner?.contactPerson?.email || '',
      phone: partner?.contactPerson?.phone || '',
      position: partner?.contactPerson?.position || '',
    },
    address: {
      street: partner?.address?.street || '',
      city: partner?.address?.city || '',
      state: partner?.address?.state || '',
      country: partner?.address?.country || 'Sri Lanka',
      postalCode: partner?.address?.postalCode || '',
      longitude: longitude != null ? String(longitude) : '',
      latitude: latitude != null ? String(latitude) : '',
    },
    csrFocus: Array.isArray(partner?.csrFocus) ? partner.csrFocus : [],
    sdgGoalsText: Array.isArray(partner?.sdgGoals) ? partner.sdgGoals.join(', ') : '',
    partnershipPreferences: {
      budgetRange: {
        min: partner?.partnershipPreferences?.budgetRange?.min ?? '',
        max: partner?.partnershipPreferences?.budgetRange?.max ?? '',
      },
      partnershipTypes: Array.isArray(partner?.partnershipPreferences?.partnershipTypes)
        ? partner.partnershipPreferences.partnershipTypes
        : ['financial'],
      duration: partner?.partnershipPreferences?.duration || 'long-term',
      geographicFocusText: Array.isArray(partner?.partnershipPreferences?.geographicFocus)
        ? partner.partnershipPreferences.geographicFocus.join(', ')
        : '',
    },
    capabilities: {
      financialCapacity: partner?.capabilities?.financialCapacity ?? '',
      inKindOfferingsText: Array.isArray(partner?.capabilities?.inKindOfferings)
        ? partner.capabilities.inKindOfferings.join(', ')
        : '',
      skillsAvailable: Array.isArray(partner?.capabilities?.skillsAvailable)
        ? partner.capabilities.skillsAvailable
        : [],
      employeeCount: partner?.capabilities?.employeeCount ?? '',
      volunteerHoursAvailable: partner?.capabilities?.volunteerHoursAvailable ?? '',
    },
    verificationDocuments: Array.isArray(partner?.verificationDocuments)
      ? partner.verificationDocuments.map((doc) => ({
          documentType: doc.documentType || 'registration',
          url: doc.url || '',
        }))
      : [],
  };
}

function buildPayload(form) {
  const payload = {
    organizationName: form.organizationName.trim(),
    organizationType: form.organizationType,
    industry: form.industry.trim(),
    companySize: form.companySize,
    contactPerson: {
      name: form.contactPerson.name.trim(),
      email: form.contactPerson.email.trim(),
      phone: form.contactPerson.phone.trim(),
      position: form.contactPerson.position.trim(),
    },
    address: {
      street: form.address.street.trim(),
      city: form.address.city.trim(),
      state: form.address.state.trim(),
      country: form.address.country.trim(),
      postalCode: form.address.postalCode.trim(),
    },
    csrFocus: form.csrFocus,
    partnershipPreferences: {
      budgetRange: {
        min: Number(form.partnershipPreferences.budgetRange.min),
        max: Number(form.partnershipPreferences.budgetRange.max),
      },
      partnershipTypes: form.partnershipPreferences.partnershipTypes,
      duration: form.partnershipPreferences.duration,
      geographicFocus: splitCsv(form.partnershipPreferences.geographicFocusText),
    },
    capabilities: {
      financialCapacity: Number(form.capabilities.financialCapacity),
      inKindOfferings: splitCsv(form.capabilities.inKindOfferingsText),
      skillsAvailable: form.capabilities.skillsAvailable,
    },
    verificationDocuments: form.verificationDocuments.filter((doc) => doc.url.trim()),
  };

  const sdgGoals = splitCsv(form.sdgGoalsText).map((item) => Number(item));
  if (sdgGoals.length > 0) payload.sdgGoals = sdgGoals;

  if (form.capabilities.employeeCount !== '') {
    payload.capabilities.employeeCount = Number(form.capabilities.employeeCount);
  }

  if (form.capabilities.volunteerHoursAvailable !== '') {
    payload.capabilities.volunteerHoursAvailable = Number(form.capabilities.volunteerHoursAvailable);
  }

  const hasLon = form.address.longitude !== '';
  const hasLat = form.address.latitude !== '';
  if (hasLon || hasLat) {
    payload.address.coordinates = {
      type: 'Point',
      coordinates: [Number(form.address.longitude), Number(form.address.latitude)],
    };
  }

  return payload;
}

function validateForm(form) {
  if (!form.organizationName.trim()) return 'Organization name is required.';
  if (!form.industry.trim()) return 'Industry is required.';
  if (!form.contactPerson.name.trim()) return 'Contact person name is required.';
  if (!form.contactPerson.email.trim()) return 'Contact person email is required.';
  if (!form.contactPerson.phone.trim()) return 'Contact person phone is required.';
  if (!form.contactPerson.position.trim()) return 'Contact person position is required.';
  if (!form.address.street.trim() || !form.address.city.trim() || !form.address.country.trim() || !form.address.postalCode.trim()) {
    return 'Street, city, country, and postal code are required.';
  }
  if (form.csrFocus.length === 0) return 'Select at least one CSR focus area.';

  const min = Number(form.partnershipPreferences.budgetRange.min);
  const max = Number(form.partnershipPreferences.budgetRange.max);
  if (Number.isNaN(min) || Number.isNaN(max)) return 'Budget min and max are required.';
  if (max < min) return 'Budget max should be greater than or equal to min.';

  const financialCapacity = Number(form.capabilities.financialCapacity);
  if (Number.isNaN(financialCapacity)) return 'Financial capacity is required.';

  const hasLon = form.address.longitude !== '';
  const hasLat = form.address.latitude !== '';
  if ((hasLon && !hasLat) || (!hasLon && hasLat)) {
    return 'Provide both longitude and latitude, or keep both empty for auto geocoding.';
  }

  const sdgItems = splitCsv(form.sdgGoalsText);
  for (const value of sdgItems) {
    const num = Number(value);
    if (Number.isNaN(num) || num < 1 || num > 17) {
      return 'SDG goals must be numbers between 1 and 17.';
    }
  }

  return '';
}

export default function PartnerFormModal({ partner, loading, onClose, onSave }) {
  const [form, setForm] = useState(() => (partner ? fromPartner(partner) : defaultForm));
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(partner ? fromPartner(partner) : defaultForm);
    setError('');
  }, [partner]);

  const title = useMemo(() => (partner?._id ? 'Edit Partner' : 'Create Partner'), [partner]);

  const updateField = (path, value) => {
    setForm((prev) => {
      const next = { ...prev };
      let cursor = next;
      for (let i = 0; i < path.length - 1; i += 1) {
        cursor[path[i]] = { ...cursor[path[i]] };
        cursor = cursor[path[i]];
      }
      cursor[path[path.length - 1]] = value;
      return next;
    });
  };

  const toggleInArray = (path, option) => {
    setForm((prev) => {
      const next = { ...prev };
      let cursor = next;
      for (let i = 0; i < path.length - 1; i += 1) {
        cursor[path[i]] = { ...cursor[path[i]] };
        cursor = cursor[path[i]];
      }
      const key = path[path.length - 1];
      const list = Array.isArray(cursor[key]) ? [...cursor[key]] : [];
      cursor[key] = list.includes(option) ? list.filter((item) => item !== option) : [...list, option];
      return next;
    });
  };

  const upsertDocument = (index, key, value) => {
    setForm((prev) => {
      const docs = [...prev.verificationDocuments];
      docs[index] = { ...docs[index], [key]: value };
      return { ...prev, verificationDocuments: docs };
    });
  };

  const addDocument = () => {
    setForm((prev) => ({
      ...prev,
      verificationDocuments: [...prev.verificationDocuments, { documentType: 'registration', url: '' }],
    }));
  };

  const removeDocument = (index) => {
    setForm((prev) => ({
      ...prev,
      verificationDocuments: prev.verificationDocuments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateForm(form);
    if (validation) {
      setError(validation);
      return;
    }

    setError('');
    onSave(buildPayload(form));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          <ErrorAlert message={error} onDismiss={() => setError('')} />

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <h4 className="md:col-span-2 font-semibold text-gray-700">Organization</h4>
            <Input label="Organization Name" required value={form.organizationName} onChange={(value) => updateField(['organizationName'], value)} />
            <Select label="Organization Type" value={form.organizationType} onChange={(value) => updateField(['organizationType'], value)} options={ORG_TYPES} />
            <Input label="Industry" required value={form.industry} onChange={(value) => updateField(['industry'], value)} />
            <Select label="Company Size" value={form.companySize} onChange={(value) => updateField(['companySize'], value)} options={COMPANY_SIZES} />
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <h4 className="md:col-span-2 font-semibold text-gray-700">Contact Person</h4>
            <Input label="Name" required value={form.contactPerson.name} onChange={(value) => updateField(['contactPerson', 'name'], value)} />
            <Input label="Email" required type="email" value={form.contactPerson.email} onChange={(value) => updateField(['contactPerson', 'email'], value)} />
            <Input label="Phone" required placeholder="+94771234567" value={form.contactPerson.phone} onChange={(value) => updateField(['contactPerson', 'phone'], value)} />
            <Input label="Position" required value={form.contactPerson.position} onChange={(value) => updateField(['contactPerson', 'position'], value)} />
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <h4 className="md:col-span-2 font-semibold text-gray-700">Address</h4>
            <Input label="Street" required value={form.address.street} onChange={(value) => updateField(['address', 'street'], value)} />
            <Input label="City" required value={form.address.city} onChange={(value) => updateField(['address', 'city'], value)} />
            <Input label="State" value={form.address.state} onChange={(value) => updateField(['address', 'state'], value)} />
            <Input label="Country" required value={form.address.country} onChange={(value) => updateField(['address', 'country'], value)} />
            <Input label="Postal Code" required value={form.address.postalCode} onChange={(value) => updateField(['address', 'postalCode'], value)} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Longitude" type="number" value={form.address.longitude} onChange={(value) => updateField(['address', 'longitude'], value)} />
              <Input label="Latitude" type="number" value={form.address.latitude} onChange={(value) => updateField(['address', 'latitude'], value)} />
            </div>
          </section>

          <section className="space-y-3">
            <h4 className="font-semibold text-gray-700">CSR Focus (required)</h4>
            <CheckboxGrid options={CSR_FOCUS} selected={form.csrFocus} onToggle={(value) => toggleInArray(['csrFocus'], value)} />
            <Input label="SDG Goals (comma-separated, 1-17)" value={form.sdgGoalsText} onChange={(value) => updateField(['sdgGoalsText'], value)} placeholder="1, 4, 8" />
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <h4 className="md:col-span-2 font-semibold text-gray-700">Partnership Preferences</h4>
            <Input label="Budget Min" required type="number" value={form.partnershipPreferences.budgetRange.min} onChange={(value) => updateField(['partnershipPreferences', 'budgetRange', 'min'], value)} />
            <Input label="Budget Max" required type="number" value={form.partnershipPreferences.budgetRange.max} onChange={(value) => updateField(['partnershipPreferences', 'budgetRange', 'max'], value)} />
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-700 mb-2">Partnership Types</p>
              <CheckboxGrid options={PARTNERSHIP_TYPES} selected={form.partnershipPreferences.partnershipTypes} onToggle={(value) => toggleInArray(['partnershipPreferences', 'partnershipTypes'], value)} />
            </div>
            <Select label="Preferred Duration" value={form.partnershipPreferences.duration} onChange={(value) => updateField(['partnershipPreferences', 'duration'], value)} options={DURATIONS} />
            <Input label="Geographic Focus (comma-separated)" value={form.partnershipPreferences.geographicFocusText} onChange={(value) => updateField(['partnershipPreferences', 'geographicFocusText'], value)} placeholder="Colombo, Kandy" />
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <h4 className="md:col-span-2 font-semibold text-gray-700">Capabilities</h4>
            <Input label="Financial Capacity" required type="number" value={form.capabilities.financialCapacity} onChange={(value) => updateField(['capabilities', 'financialCapacity'], value)} />
            <Input label="Employee Count" type="number" value={form.capabilities.employeeCount} onChange={(value) => updateField(['capabilities', 'employeeCount'], value)} />
            <Input label="Volunteer Hours Available" type="number" value={form.capabilities.volunteerHoursAvailable} onChange={(value) => updateField(['capabilities', 'volunteerHoursAvailable'], value)} />
            <Input label="In-kind Offerings (comma-separated)" value={form.capabilities.inKindOfferingsText} onChange={(value) => updateField(['capabilities', 'inKindOfferingsText'], value)} placeholder="Computers, Training space" />
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-700 mb-2">Skills Available</p>
              <CheckboxGrid options={SKILLS} selected={form.capabilities.skillsAvailable} onToggle={(value) => toggleInArray(['capabilities', 'skillsAvailable'], value)} />
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-700">Verification Documents</h4>
              <button
                type="button"
                onClick={addDocument}
                className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                + Add Document
              </button>
            </div>
            {form.verificationDocuments.length === 0 && (
              <p className="text-sm text-gray-500">No documents added yet. Add URL-based documents for verification.</p>
            )}
            {form.verificationDocuments.map((doc, index) => (
              <div key={`${doc.documentType}-${index}`} className="grid grid-cols-1 md:grid-cols-[1fr_3fr_auto] gap-3 items-end">
                <Select
                  label="Type"
                  value={doc.documentType}
                  onChange={(value) => upsertDocument(index, 'documentType', value)}
                  options={DOC_TYPES}
                />
                <Input
                  label="Document URL"
                  value={doc.url}
                  onChange={(value) => upsertDocument(index, 'url', value)}
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={() => removeDocument(index)}
                  className="h-10 px-3 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                >
                  Remove
                </button>
              </div>
            ))}
          </section>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg"
            >
              {loading ? 'Saving...' : 'Save Partner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({ label, required, onChange, value, type = 'text', placeholder = '' }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700 mb-1 block">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700 mb-1 block">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {toTitle(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxGrid({ options, selected, onToggle }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {options.map((option) => {
        const checked = selected.includes(option);
        return (
          <label key={option} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
            <input type="checkbox" checked={checked} onChange={() => onToggle(option)} />
            <span>{toTitle(option)}</span>
          </label>
        );
      })}
    </div>
  );
}

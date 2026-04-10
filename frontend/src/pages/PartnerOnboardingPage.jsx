import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePartner } from '../context/PartnerContext';
import api from '../api/axios';
import ErrorAlert from '../components/ErrorAlert';

import { 
  FiHeart, 
  FiGlobe, 
  FiBookOpen, 
  FiShield, 
  FiUsers, 
  FiActivity, 
  FiDroplet,
  FiBriefcase,
  FiX,
  FiUploadCloud,
  FiArrowRight,
  FiCheckCircle,
  FiAlertTriangle,
  FiCheck
} from 'react-icons/fi';
import { LuPawPrint } from "react-icons/lu";

const CATEGORIES = [
  { id: 'health', label: 'Healthcare', icon: <FiActivity className="text-2xl" /> },
  { id: 'environment', label: 'Environment', icon: <FiGlobe className="text-2xl" /> },
  { id: 'education', label: 'Education', icon: <FiBookOpen className="text-2xl" /> },
  { id: 'animal_welfare', label: 'Animal Welfare', icon: <LuPawPrint className="text-2xl" />, fallsUnder: 'environment' },
  { id: 'community_development', label: 'Community', icon: <FiUsers className="text-2xl" /> },
  { id: 'disaster_relief', label: 'Emergency', icon: <FiShield className="text-2xl" /> },
  { id: 'poverty_alleviation', label: 'Poverty & Hunger', icon: <FiHeart className="text-2xl" /> },
  { id: 'clean_water', label: 'Clean Water', icon: <FiDroplet className="text-2xl" /> }
];

const INDUSTRIES = [
  'Technology', 'Finance & Banking', 'Manufacturing', 'Healthcare', 
  'Energy & Utilities', 'Retail & Consumer Goods', 'Telecommunications', 
  'Agriculture', 'Logistics & Transport', 'Legal & Professional Services', 
  'Media & Entertainment', 'Hospitality & Tourism'
];

const PARTNERSHIP_TYPES = [
  { id: 'financial', label: 'Financial Funding', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { id: 'in-kind', label: 'In-Kind Donations', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
  { id: 'skills-based', label: 'Skills-Based (Pro-bono)', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
  { id: 'marketing', label: 'Marketing Partnership', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg> },
  { id: 'hybrid', label: 'Hybrid Collaboration', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> }
];

export default function PartnerOnboardingPage() {
  const { user } = useAuth();
  const { createPartner } = usePartner();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Default structure wrapping complex backend requirements into a simple state
  const [form, setForm] = useState({
    logoUrl: '',
    organizationName: '',
    organizationType: 'foundation',
    industry: '',
    // Step 2 details
    contactPerson: {
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        position: 'Director / Representative'
    },
    verificationDocuments: [{ documentType: 'registration', url: '' }],
    // Step 3 details
    csrFocus: [],
    partnershipTypes: ['financial'],
    budgetRange: { min: 50000, max: 1000000 },
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('logo', file);

    setIsUploading(true);
    setError('');
    try {
        console.log('Starting local upload via Multer...');
        const { data } = await api.post('/api/partners/upload-logo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('Upload success:', data.url);
        setForm(prev => ({ ...prev, logoUrl: data.url }));
    } catch (err) {
        console.error('Frontend Upload Error:', err.response?.data || err.message);
        const serverMsg = err.response?.data?.message || err.response?.data?.error;
        setError(serverMsg ? `Server Error: ${serverMsg}` : 'Failed to upload logo locally. Please ensure the backend is running.');
    } finally {
        setIsUploading(false);
    }
  };

  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  const handleDocumentUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);

    setIsUploadingDoc(true);
    setError('');
    try {
        console.log('Starting document upload via Multer...');
        const { data } = await api.post('/api/partners/upload-document', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('Document upload success:', data.url);
        setForm(prev => {
            const docs = [...prev.verificationDocuments];
            docs[0].url = data.url;
            return { ...prev, verificationDocuments: docs };
        });
    } catch (err) {
        console.error('Frontend Document Upload Error:', err.response?.data || err.message);
        const serverMsg = err.response?.data?.message || err.response?.data?.error;
        setError(serverMsg ? `Server Error: ${serverMsg}` : 'Failed to upload document locally.');
    } finally {
        setIsUploadingDoc(false);
    }
  };

  const isStepValid = () => {
      if (step === 1) {
          return form.organizationName.trim() !== '' && form.industry !== '';
      }
      if (step === 2) {
          return form.contactPerson.phone.trim() !== '' && form.verificationDocuments[0]?.url !== '';
      }
      if (step === 3) {
          return form.csrFocus.length > 0;
      }
      return true;
  };

  const handleNext = () => {
      setError('');
      if (!isStepValid()) {
          if (step === 1) setError("Please fill in your organization's name and industry to continue.");
          if (step === 2) setError("A contact phone number and verification document are required.");
          return;
      }
      setStep(prev => prev + 1);
  };

  const toggleCategory = (id) => {
      // the backend allows specific enums. 
      // if animal_welfare is picked, we map it to environment in backend to satisfy enum if needed, but here we just store the conceptual ID and map during submit.
      setForm(prev => {
          const current = prev.csrFocus;
          if (current.includes(id)) {
              return { ...prev, csrFocus: current.filter(c => c !== id) };
          } else {
              return { ...prev, csrFocus: [...current, id] };
          }
      });
  };

  const handleFinish = async () => {
      if (form.csrFocus.length === 0) {
          return setError("Please select at least one impact category.");
      }
      setIsSubmitting(true);
      setError('');

      // Map our beautiful UI concepts into the rigid Database format
      const mappedCsrFocus = form.csrFocus.map(id => {
          if (id === 'animal_welfare') return 'environment';
          if (id === 'infrastructure') return 'community_development';
          if (id === 'emergency_response') return 'disaster_relief';
          return id;
      });
      
      const payload = {
          logoUrl: form.logoUrl,
          organizationName: form.organizationName.trim(),
          organizationType: form.organizationType,
          industry: form.industry,
          contactPerson: form.contactPerson,
          address: {
              street: 'Main Corporate Office', 
              city: 'Colombo',
              state: 'Western',
              country: 'Sri Lanka',
              postalCode: '00100',
              coordinates: {
                type: 'Point',
                coordinates: [79.8612, 6.9271] // Default to Colombo for onboarding ux
              }
          },
          csrFocus: Array.from(new Set(mappedCsrFocus)), 
          partnershipPreferences: {
              budgetRange: form.budgetRange,
              partnershipTypes: form.partnershipTypes,
              duration: 'ongoing'
          },
          capabilities: { 
            financialCapacity: form.budgetRange.max, 
            skillsAvailable: [] 
          },
          verificationDocuments: form.verificationDocuments.filter(d => d.url.trim() !== '')
      };

      try {
          await createPartner(payload);
          // Success! Send them to the shiny dashboard
          navigate('/dashboard', { replace: true });
      } catch (err) {
          setError(err.response?.data?.message || 'Failed to initialize partner profile. Please try again.');
          setIsSubmitting(false);
      }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 md:p-8 font-sans selection:bg-brand-red/20">
       {/* Background decorative elements */}
       <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-red/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-orange/10 blur-[100px]" />
       </div>
       
       <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-[40px] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.08)] border border-white/50 overflow-hidden flex flex-col md:flex-row relative z-10 min-h-[650px]">
          
          {/* Sidebar Area */}
          <div className="hidden md:flex flex-col justify-between w-5/12 bg-[#0A0F1C] text-white p-12 relative overflow-hidden">
              {/* Sidebar decorative grid */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
              
              <div className="relative z-10">
                  <div className="mb-14 group">
                      <img src="/hand-heart-logo.png" alt="Trustfund" className="w-48 h-auto transition-transform duration-700 group-hover:scale-105 drop-shadow-2xl" />
                  </div>

                  <h2 className="text-4xl font-extrabold leading-[1.1] mb-5 tracking-tight">
                      Join the<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-red">Impact Network.</span>
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-[260px]">
                      We connect verified funding with ground-level executors transparently. Complete your organizational profile to initiate the vetting process.
                  </p>
              </div>

              <div className="space-y-8 relative z-10 mt-12">
                 <div className={`flex items-center gap-4 transition-all duration-500 ${step >= 1 ? 'text-white opacity-100' : 'text-slate-600 opacity-50'}`}>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg transition-colors duration-500 ${step >= 1 ? 'bg-brand-red text-white shadow-brand-red/20' : 'bg-slate-800/50'}`}>1</div>
                    <div>
                        <span className="block text-sm font-bold tracking-wide">Corporate Identity</span>
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 mt-0.5 block">Basic Information</span>
                    </div>
                 </div>
                 <div className={`flex items-center gap-4 transition-all duration-500 ${step >= 2 ? 'text-white opacity-100' : 'text-slate-600 opacity-50'}`}>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg transition-colors duration-500 ${step >= 2 ? 'bg-brand-red text-white shadow-brand-red/20' : 'bg-slate-800/50'}`}>2</div>
                    <div>
                        <span className="block text-sm font-bold tracking-wide">Due Diligence</span>
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 mt-0.5 block">Verification Docs</span>
                    </div>
                 </div>
                 <div className={`flex items-center gap-4 transition-all duration-500 ${step >= 3 ? 'text-white opacity-100' : 'text-slate-600 opacity-50'}`}>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg transition-colors duration-500 ${step >= 3 ? 'bg-brand-red text-white shadow-brand-red/20' : 'bg-slate-800/50'}`}>3</div>
                    <div>
                        <span className="block text-sm font-bold tracking-wide">Strategic Impact</span>
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 mt-0.5 block">SDGs & Funding</span>
                    </div>
                 </div>
              </div>
          </div>

          {/* Form Area */}
          <div className="flex-1 p-8 md:p-14 flex flex-col relative">
             <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
                 <div className="h-full bg-brand-red transition-all duration-700 ease-out" style={{ width: `${(step / 3) * 100}%` }} />
             </div>

             {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}

             <div className="flex-1 mt-4">
                 {step === 1 && (
                     <div className="space-y-8 animate-fadeIn">
                         <div className="mb-10">
                             <h3 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Configure Identity</h3>
                             <p className="text-slate-500 text-sm font-medium">Establish your organizational presence on the platform.</p>
                         </div>

                         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-slate-50/50 p-6 rounded-[24px] border border-slate-100/50">
                            <label className="w-28 h-28 rounded-3xl border-2 border-dashed border-slate-300 bg-white text-slate-400 flex items-center justify-center overflow-hidden flex-shrink-0 group hover:border-brand-red/50 hover:shadow-lg transition-all relative cursor-pointer">
                                {isUploading ? (
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
                                ) : form.logoUrl ? (
                                    <div className="relative w-full h-full p-2 bg-white">
                                        <img src={form.logoUrl} alt="Logo" className="w-full h-full object-contain drop-shadow-sm" />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                                            <span className="text-[10px] text-white font-bold uppercase tracking-widest">Update</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-full border-2 border-brand-red p-2 shrink-0 bg-brand-red/5 text-brand-red flex items-center justify-center">
                                        <FiBriefcase className="text-3xl" />
                                    </div>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                            </label>
                            <div className="flex-1">
                                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-1.5">Organization Branding</label>
                                <p className="text-xs text-slate-500 mb-3 font-medium">Click the avatar to upload your official company logo. Transparent PNG recommended.</p>
                                {form.logoUrl && <div className="text-[10px] font-mono text-emerald-600 truncate max-w-[200px] bg-emerald-50 px-2 py-1 rounded inline-block">✓ Logo uploaded successfully</div>}
                            </div>
                         </div>

                         <div className="space-y-4">
                             <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Organization Name *</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-red"
                                    placeholder="e.g. Apex Global Foundation"
                                    value={form.organizationName}
                                    onChange={(e) => setForm(f => ({ ...f, organizationName: e.target.value }))}
                                />
                             </div>

                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Industry Sector *</label>
                                    <select 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-red"
                                        value={form.industry}
                                        onChange={(e) => setForm(f => ({ ...f, industry: e.target.value }))}
                                    >
                                        <option value="">Select Industry</option>
                                        {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Entity Type *</label>
                                    <select 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-red"
                                        value={form.organizationType}
                                        onChange={(e) => setForm(f => ({ ...f, organizationType: e.target.value }))}
                                    >
                                        <option value="corporate">Corporate Identity</option>
                                        <option value="foundation">Foundation / Trust</option>
                                        <option value="government">Public Sector</option>
                                        <option value="individual">High Net-Worth Individual</option>
                                    </select>
                                </div>
                             </div>
                         </div>
                     </div>
                 )}

                 {step === 2 && (
                     <div className="space-y-6 animate-fadeIn">
                         <div className="mb-10">
                             <h3 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Due Diligence</h3>
                             <p className="text-slate-500 text-sm font-medium">Provide your representative data and compliance documents.</p>
                         </div>

                         <div className="bg-slate-50/50 p-6 sm:p-8 rounded-[24px] border border-slate-100/50 space-y-6">
                             <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                <span className="w-6 h-px bg-slate-200" /> Primary Contact
                             </h4>
                             <div className="grid grid-cols-2 gap-4">
                                 <div>
                                     <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Name</label>
                                     <input type="text" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.contactPerson.name} onChange={e => setForm(f => ({...f, contactPerson: {...f.contactPerson, name: e.target.value}}))}/>
                                 </div>
                                 <div>
                                     <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Designation</label>
                                     <input type="text" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.contactPerson.position} onChange={e => setForm(f => ({...f, contactPerson: {...f.contactPerson, position: e.target.value}}))}/>
                                 </div>
                                 <div className="col-span-2">
                                     <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Direct Phone Limit *</label>
                                     <input type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.contactPerson.phone} onChange={e => setForm(f => ({...f, contactPerson: {...f.contactPerson, phone: e.target.value}}))}/>
                                 </div>
                             </div>
                         </div>

                         <div className="bg-slate-50/50 p-6 sm:p-8 rounded-[24px] border border-slate-100/50 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 mb-2">
                                        <span className="w-6 h-px bg-slate-200" /> Compliance Pipeline
                                    </h4>
                                    <p className="text-xs text-slate-500 font-medium">Please upload your public corporate registry or CSR mandate document (Required for verification).</p>
                                </div>
                                {isUploadingDoc && <span className="text-[10px] text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest animate-pulse">Uploading...</span>}
                            </div>
                            
                            <div className="relative group mt-4">
                                <input 
                                    type="file" 
                                    accept=".pdf,.doc,.docx,image/*" 
                                    className="hidden" 
                                    id="doc-upload"
                                    onChange={handleDocumentUpload}
                                    disabled={isUploadingDoc}
                                />
                                <label 
                                    htmlFor="doc-upload" 
                                    className="w-full bg-white border-2 border-dashed border-slate-200 rounded-xl px-4 py-8 flex flex-col items-center justify-center cursor-pointer hover:border-brand-dark/30 hover:bg-slate-50 transition-all group"
                                >
                                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{form.verificationDocuments[0].url ? <FiCheckCircle className="text-emerald-500" /> : <FiUploadCloud className="text-slate-400" />}</span>
                                    <span className="text-sm font-medium text-slate-600">
                                        {form.verificationDocuments[0].url ? 'Document Uploaded' : 'Click to Upload Document'}
                                    </span>
                                    <span className="text-[10px] text-slate-400 mt-1">PDF, DOC, or Images allowed (Max: 5MB)</span>
                                </label>
                            </div>

                            {form.verificationDocuments[0].url && (
                                <div className="mt-2 text-right">
                                    <a href={form.verificationDocuments[0].url} target="_blank" rel="noreferrer" className="text-xs font-bold text-brand-dark hover:underline">
                                        Preview Uploaded Document →
                                    </a>
                                </div>
                            )}
                         </div>
                     </div>
                 )}

                 {step === 3 && (
                     <div className="space-y-6 animate-fadeIn h-full flex flex-col">
                         <div className="mb-10 shrink-0">
                             <p className="text-sm font-bold text-slate-800 flex items-center gap-2"><FiUploadCloud className="text-slate-400" /> Compliance Records</p>
                             <h3 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Sustainable Impact Goals.</h3>
                             <p className="text-slate-500 text-sm font-medium">Choose the causes and funding preferences that align with your institutional values.</p>
                         </div>

                         <div className="space-y-6 overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-slate-200">
                             <div>
                                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                   <span className="w-6 h-px bg-slate-200" /> 1. Select Impact focus
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {CATEGORIES.map(cat => {
                                        const selected = form.csrFocus.includes(cat.id);
                                        return (
                                            <button 
                                                key={cat.id}
                                                onClick={() => toggleCategory(cat.id)}
                                                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                                                    selected 
                                                        ? 'border-brand-red bg-white text-brand-red shadow-[0_8px_30px_rgb(220,38,38,0.12)] -translate-y-1' 
                                                        : 'border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                            >
                                                <span className="text-3xl mb-2 filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110">{cat.icon}</span>
                                                <span className={`text-[10px] uppercase tracking-widest font-extrabold text-center leading-tight ${selected ? 'text-brand-red' : 'text-slate-400'}`}>{cat.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                             </div>

                             <div className="pt-4">
                                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                   <span className="w-6 h-px bg-slate-200" /> 2. Funding Format
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {PARTNERSHIP_TYPES.map(type => {
                                        const selected = form.partnershipTypes.includes(type.id);
                                        return (
                                            <button 
                                                key={type.id}
                                                onClick={() => setForm(f => ({
                                                    ...f, 
                                                    partnershipTypes: selected 
                                                        ? f.partnershipTypes.filter(t => t !== type.id)
                                                        : [...f.partnershipTypes, type.id]
                                                }))}
                                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ${
                                                    selected 
                                                        ? 'border-brand-orange bg-white text-brand-orange shadow-[0_8px_30px_rgb(234,88,12,0.12)]' 
                                                        : 'border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-300'
                                                }`}
                                            >
                                                <span className="text-2xl">{type.icon}</span>
                                                <span className={`text-[10px] font-extrabold uppercase tracking-widest text-left leading-tight ${selected ? 'text-brand-orange' : 'text-slate-400'}`}>{type.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                             </div>

                             <div className="bg-[#0A0F1C] rounded-[24px] p-8 text-white relative overflow-hidden mt-6">
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-orange via-brand-red to-transparent"></div>
                                <div className="relative z-10">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                                        <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                            <span className="w-6 h-px bg-slate-700" /> 3. Projected Annual CSR Budget
                                        </h4>
                                        <div className="bg-brand-red/10 border border-brand-red/20 px-4 py-2 rounded-xl">
                                            <span className="text-brand-red font-mono text-sm font-extrabold tracking-wider">LKR {Number(form.budgetRange.max).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="50000" 
                                        max="10000000" 
                                        step="50000"
                                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-red"
                                        value={form.budgetRange.max}
                                        onChange={(e) => setForm(f => ({...f, budgetRange: {...f.budgetRange, max: Number(e.target.value)}}))}
                                    />
                                    <div className="flex justify-between mt-3 text-[10px] font-extrabold text-slate-600 uppercase tracking-widest">
                                        <span>LKR 50K</span>
                                        <span>LKR 10M+</span>
                                    </div>
                                </div>
                             </div>
                         </div>
                     </div>
                 )}
             </div>

             {/* Footer Actions */}
             <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
                 {step > 1 ? (
                     <button onClick={() => setStep(prev => prev - 1)} className="px-6 py-3 rounded-xl font-extrabold text-[10px] text-slate-400 hover:bg-slate-100 uppercase tracking-widest transition-colors">
                         Back
                     </button>
                 ) : <div></div>}

                 {step < 3 ? (
                     <button 
                        onClick={handleNext} 
                        disabled={!isStepValid() || isUploading || isUploadingDoc}
                        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-extrabold text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                     >
                         {isUploading || isUploadingDoc ? 'Uploading...' : 'Continue →'}
                     </button>
                 ) : (
                     <button 
                        onClick={handleFinish} 
                        disabled={isSubmitting || !isStepValid()} 
                        className="px-8 py-3 bg-brand-red text-white flex items-center gap-3 rounded-xl font-extrabold text-[10px] uppercase tracking-widest hover:bg-brand-red/90 transition-all shadow-xl shadow-brand-red/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 active:scale-95"
                     >
                         {isSubmitting ? 'Finalizing Profile...' : 'Complete & Enter Pipeline'}
                         {!isSubmitting && <FiArrowRight className="text-lg" />}
                     </button>
                 )}
             </div>
          </div>

       </div>
    </div>
  );
}

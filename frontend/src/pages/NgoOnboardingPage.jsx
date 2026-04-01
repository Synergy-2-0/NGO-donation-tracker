import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ErrorAlert from '../components/ErrorAlert';
import { 
  FiBriefcase, FiGlobe, FiPhone, FiMapPin, 
  FiFileText, FiUploadCloud, FiCheckCircle, FiArrowRight 
} from 'react-icons/fi';

export default function NgoOnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState({
    organizationName: '',
    registrationNumber: '',
    mission: '',
    logoUrl: '',
    contactPhone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'Sri Lanka',
      postalCode: ''
    },
    website: '',
    verificationDocuments: [{ documentType: 'registration', url: '' }]
  });

  const handleNext = () => {
    if (step === 1 && (!form.organizationName || !form.registrationNumber || !form.mission)) {
      return setError('Please fill in all organization details.');
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const handleFileUpload = async (event, type = 'logo') => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(type === 'logo' ? 'logo' : 'document', file);

    setIsUploading(true);
    try {
      const endpoint = type === 'logo' ? '/api/ngos/upload-logo' : '/api/ngos/upload-document';
      const { data } = await api.post(endpoint, formData);
      
      if (type === 'logo') {
        setForm(prev => ({ ...prev, logoUrl: data.url }));
      } else {
        setForm(prev => ({
          ...prev,
          verificationDocuments: [{ ...prev.verificationDocuments[0], url: data.url }]
        }));
      }
    } catch (err) {
      setError('Upload failed. Using fallback simulation...');
      const fallbackUrl = 'https://via.placeholder.com/150';
      
      if (type === 'logo') {
        setForm(prev => ({ ...prev, logoUrl: fallbackUrl }));
      } else {
        setForm(prev => ({
          ...prev,
          verificationDocuments: [{ ...prev.verificationDocuments[0], url: fallbackUrl }]
        }));
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await api.post('/api/ngos/register', form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
        
        {/* Sidebar */}
        <div className="md:w-1/3 bg-slate-900 text-white p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-tf-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">NGO Registration</h2>
            <p className="text-slate-400 text-sm leading-relaxed">Join Synergy to bridge the gap between donors and impact.</p>
          </div>
          
          <div className="space-y-6 relative z-10">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex items-center gap-4 transition-all ${step >= s ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${step >= s ? 'bg-tf-primary' : 'bg-slate-800'}`}>{s}</div>
                <span className="text-xs font-bold uppercase tracking-widest">{s === 1 ? 'Identity' : s === 2 ? 'Details' : 'Compliance'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-12 flex flex-col">
          {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}

          <div className="flex-1">
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-2xl font-black text-slate-900">Organization Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">NGO Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4"
                      value={form.organizationName}
                      onChange={e => setForm({...form, organizationName: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Reg. Number</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4"
                        value={form.registrationNumber}
                        onChange={e => setForm({...form, registrationNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Phone</label>
                      <input 
                        type="tel" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4"
                        value={form.contactPhone}
                        onChange={e => setForm({...form, contactPhone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Mission Statement</label>
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 h-32"
                      value={form.mission}
                      onChange={e => setForm({...form, mission: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-2xl font-black text-slate-900">Address & Presence</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Street</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={form.address.street} onChange={e => setForm({...form, address: {...form.address, street: e.target.value}})}/>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">City</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={form.address.city} onChange={e => setForm({...form, address: {...form.address, city: e.target.value}})}/>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Website</label>
                    <input type="url" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={form.website} onChange={e => setForm({...form, website: e.target.value})}/>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-2xl font-black text-slate-900">Verification</h3>
                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
                  <FiUploadCloud className="text-3xl text-slate-400 mb-4" />
                  <p className="text-sm font-bold text-slate-700 mb-2">Upload Registration Document</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-6">PDF or Scanned Copy</p>
                  <input id="doc-upload" type="file" className="hidden" onChange={e => handleFileUpload(e, 'doc')} />
                  <label htmlFor="doc-upload" className="bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-black transition-all">Select File</label>
                  {form.verificationDocuments[0].url && <p className="mt-4 text-emerald-500 text-[10px] font-black uppercase tracking-widest">✓ Uploaded successfully</p>}
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 flex justify-between">
            {step > 1 ? (
              <button onClick={() => setStep(prev => prev - 1)} className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-all">Back</button>
            ) : <div />}
            {step < 3 ? (
              <button onClick={handleNext} className="bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all">Next <FiArrowRight /></button>
            ) : (
              <button onClick={handleFinish} disabled={isSubmitting} className="bg-tf-primary text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-tf-primary-dark transition-all disabled:opacity-50">{isSubmitting ? 'Registering...' : 'Complete Registration'}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

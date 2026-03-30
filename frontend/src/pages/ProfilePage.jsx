import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDonor } from '../context/DonorContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { motion, AnimatePresence } from 'framer-motion';

const defaultForm = {
  phone: '',
  address: { street: '', city: '', country: '', postalCode: '' },
  preferredCauses: '',
  bio: '',
};

function PremiumField({ label, name, value, onChange, type = 'text', placeholder, hint, className = '' }) {
  return (
    <div className={className + " space-y-3 group"}>
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-4 group-hover:text-tf-primary transition-colors duration-500">
        {label}
        {hint && <span className="ml-2 text-slate-300 normal-case italic font-medium tracking-normal">{hint}</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-100/50 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-tf-primary focus:ring-4 focus:ring-tf-primary/10 transition-all shadow-inner placeholder:text-slate-200"
      />
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { donorProfile, loading, error, fetchProfile, updateProfile } = useDonor();
  const [form, setForm] = useState(defaultForm);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [localError, setLocalError] = useState('');
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    fetchProfile()
      .catch(() => {})
      .finally(() => setInitialFetchDone(true));
  }, [fetchProfile]);

  useEffect(() => {
    if (donorProfile) {
      setForm({
        phone: donorProfile.phone || '',
        address: {
          street: donorProfile.address?.street || '',
          city: donorProfile.address?.city || '',
          country: donorProfile.address?.country || '',
          postalCode: donorProfile.address?.postalCode || '',
        },
        preferredCauses: donorProfile.preferredCauses?.join(', ') || '',
        bio: donorProfile.bio || '',
      });
    }
  }, [donorProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setForm((f) => ({ ...f, address: { ...f.address, [field]: value } }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccess('');
    const payload = {
      ...form,
      preferredCauses: form.preferredCauses
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    try {
      await updateProfile(donorProfile._id, payload);
      setSuccess('Profile updated successfully.');
      setEditing(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setLocalError(err.response?.data?.message || err.message || 'Verification failed.');
    }
  };

  if (!initialFetchDone && loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 pt-6 font-sans selection:bg-tf-primary selection:text-white animate-in fade-in slide-in-from-bottom-5 duration-1000">
      
      {/* High-Impact Profile Header */}
      <div className="bg-[#0F172A] rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tf-primary/10 blur-[150px] -mr-60 -mt-60 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
           <div className="flex items-center gap-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem] flex items-center justify-center text-5xl font-black border border-white/10 shadow-2xl backdrop-blur-xl group overflow-hidden">
                  <div className="absolute inset-0 bg-tf-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                  {user?.name?.[0].toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-tf-primary border-4 border-[#0F172A] rounded-2xl flex items-center justify-center shadow-lg">
                   <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
              <div className="space-y-3">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-tf-primary shadow-[0_0_10px_rgba(255,138,0,0.8)] animate-pulse" />
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] leading-none">Verified Supporter Profile</p>
                 </div>
                 <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">{user?.name || 'TransFund Member'}</h2>
                 <p className="text-xs text-white/50 font-bold tracking-widest uppercase">{user?.email}</p>
              </div>
           </div>
           <button
             onClick={() => { setEditing(!editing); setSuccess(''); setLocalError(''); }}
             className={`px-10 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 shadow-xl active:scale-95 ${
               editing 
               ? 'bg-white text-[#0F172A] hover:bg-slate-100' 
               : 'bg-tf-primary text-white hover:bg-white hover:text-[#0F172A] shadow-tf-primary/20 invisible md:visible'
             }`}
           >
             {editing ? 'Cancel Changes' : 'Edit Profile'}
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {localError || error ? (
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
             <ErrorAlert message={localError || error} onDismiss={() => setLocalError('')} />
           </motion.div>
        ) : null}
        
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="bg-tf-accent/5 border border-tf-accent/10 text-tf-accent text-[11px] font-black uppercase tracking-[0.3em] px-10 py-5 rounded-[1.5rem] shadow-sm flex items-center gap-4 italic"
          >
            <div className="w-2 h-2 bg-tf-accent rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Details Sidebar */}
        <div className="space-y-10">
           <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-10 overflow-hidden relative group"
           >
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 blur-[40px] -mr-16 -mt-16 group-hover:bg-tf-primary/5 transition-colors" />
              <div className="space-y-2 relative z-10">
                 <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Supporter ID</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none">Account Reference</p>
              </div>
              <div className="space-y-6 relative z-10 pt-4">
                 <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl group/sub">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover/sub:text-tf-primary transition-colors italic">System ID</p>
                    <p className="text-[11px] font-black text-slate-900 font-mono break-all">{donorProfile?._id || 'UNSET'}</p>
                 </div>
                 <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 italic text-tf-accent">Account Status</p>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-tf-accent shadow-[0_0_5px_rgba(16,185,129,1)]" />
                      <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Verified Supporter</p>
                    </div>
                 </div>
              </div>
           </motion.div>

           {!editing && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="bg-slate-950 rounded-[3rem] p-10 text-white space-y-8 relative overflow-hidden"
              >
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-tf-primary/20 blur-[50px] -mr-16 -mb-16" />
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] leading-none relative z-10 italic">Quick Actions</p>
                  <div className="space-y-4 relative z-10">
                    <button onClick={() => setEditing(true)} className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all">Edit My Profile</button>
                    <button className="w-full py-4 bg-white/5 border border-white/5 hover:border-tf-primary/30 text-white/60 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all">Export Giving History</button>
                  </div>
              </motion.div>
           )}
        </div>

        {/* Profile Content */}
        <div className="lg:col-span-2">
          {!editing ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm space-y-16"
            >
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-10">
                     <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] leading-none italic">Contact Phone</h4>
                        <p className="text-xl font-bold text-slate-900 italic tracking-tight">{donorProfile?.phone || 'Awaiting Input'}</p>
                     </div>
                     <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] leading-none italic">My Location</h4>
                        <p className="text-xl font-bold text-slate-900 italic tracking-tight">
                          {donorProfile?.address?.city && donorProfile?.address?.country 
                            ? `${donorProfile.address.city}, ${donorProfile.address.country}` 
                            : 'Location Not Set'}
                        </p>
                     </div>
                  </div>
                  <div className="space-y-6">
                     <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] leading-none italic">Causes I Support</h4>
                     <div className="flex flex-wrap gap-3">
                        {donorProfile?.preferredCauses?.length > 0
                          ? donorProfile.preferredCauses.map((cause) => (
                               <span key={cause} className="px-5 py-2.5 bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest rounded-xl shadow-sm hover:border-tf-primary transition-colors lowercase italic">{cause}</span>
                             ))
                          : <p className="text-xs text-slate-300 font-bold italic tracking-tight">No causes selected yet.</p>}
                     </div>
                  </div>
               </div>

               <div className="space-y-4 pt-12 border-t border-slate-50">
                  <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] leading-none italic">Personal Bio / Mission</h4>
                  <p className="text-lg text-slate-600 leading-relaxed italic font-medium max-w-2xl group-hover:text-slate-900 transition-colors">
                    {donorProfile?.bio || 'Tell us what drives your passion for supporting humanitarian work.'}
                  </p>
               </div>
            </motion.div>
          ) : (
            <motion.form 
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              onSubmit={handleSubmit} 
              className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl p-12 space-y-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-tf-primary/5 blur-[80px] -mr-24 -mt-24 pointer-events-none" />
              
              <div className="space-y-2 border-b border-slate-50 pb-8 relative z-10">
                 <h3 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">Update Profile</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] leading-none italic">Edit your profile details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                 <PremiumField label="Phone Number" name="phone" value={form.phone} onChange={handleChange} placeholder="+00 000 0000" />
                 <PremiumField label="City" name="address.city" value={form.address.city} onChange={handleChange} placeholder="City Name" />
                 <PremiumField label="Country" name="address.country" value={form.address.country} onChange={handleChange} placeholder="Country Name" />
                 <PremiumField label="Postal Code" name="address.postalCode" value={form.address.postalCode} onChange={handleChange} placeholder="00000" />
                 
                 <div className="md:col-span-2">
                   <PremiumField 
                     label="Causes Interests" 
                     name="preferredCauses" 
                     value={form.preferredCauses} 
                     onChange={handleChange} 
                     placeholder="Health, Education, Relief, etc." 
                     hint="(Separate with commas)" 
                   />
                 </div>
                 
                 <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-4 italic group-hover:text-tf-primary duration-500">Bio / Personal Mission</label>
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us about yourself and your charitable goals..."
                      className="w-full bg-slate-50 border border-slate-100/50 rounded-[2rem] px-8 py-6 text-sm font-bold text-slate-700 focus:outline-none focus:border-tf-primary focus:ring-4 focus:ring-tf-primary/10 transition-all resize-none shadow-inner italic"
                    />
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-6 bg-slate-950 text-white text-[11px] font-black uppercase tracking-[0.5em] rounded-[2rem] hover:bg-tf-primary transition-all duration-500 shadow-2xl shadow-tf-primary/10 active:scale-95 disabled:opacity-50 relative z-10"
              >
                {loading ? 'Updating Profile...' : 'Save Profile Settings'}
              </button>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
}


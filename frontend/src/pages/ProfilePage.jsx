import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDonor } from '../context/DonorContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const defaultForm = {
  phone: '',
  address: { street: '', city: '', country: '', postalCode: '' },
  preferredCauses: '',
  bio: '',
};

function Field({ label, name, value, onChange, type = 'text', placeholder, hint, className = '' }) {
  return (
    <div className={className + " space-y-2"}>
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 group-hover:text-tf-purple transition-colors">
        {label}
        {hint && <span className="ml-2 text-slate-300 normal-case italic font-medium">{hint}</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-tf-purple focus:outline-none focus:border-tf-primary transition-all shadow-inner"
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
    } catch (err) {
      setLocalError(err.response?.data?.message || err.message || 'Update failed.');
    }
  };

  if (!initialFetchDone && loading) return <LoadingSpinner />;

  return (
    <div className="space-y-12 animate-fade-in max-w-[1200px] mx-auto pb-20 font-sans selection:bg-tf-primary selection:text-white">
      {/* Cinematic Profile Header */}
      <div className="relative p-12 md:p-20 bg-tf-purple rounded-[3.5rem] overflow-hidden shadow-2xl group text-center text-white border border-white/5">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=1600')] opacity-5 blur-sm scale-110 group-hover:scale-100 transition-transform duration-1000 grayscale" />
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-tf-primary/20 blur-[130px] opacity-40 animate-pulse" />
         
         <div className="relative z-10 space-y-6">
            <div className="w-32 h-32 bg-white rounded-full mx-auto p-1.5 shadow-2xl shadow-tf-primary/20 ring-4 ring-white/10 overflow-hidden group">
               <div className="w-full h-full bg-tf-primary rounded-full flex items-center justify-center border-4 border-white text-4xl font-black text-white italic group-hover:scale-110 transition-transform">
                  {user?.name?.charAt(0) || 'D'}
               </div>
            </div>
            <div className="space-y-2">
               <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic tracking-tight">
                 {user?.name || 'Verified Member'}
               </h2>
               <p className="text-tf-primary text-[11px] font-black uppercase tracking-[0.5em] italic opacity-80">Philanthropist • Verified Account</p>
            </div>
         </div>
      </div>

      {(localError || error) && (
        <ErrorAlert message={localError || error} onDismiss={() => setLocalError('')} />
      )}
      
      {success && (
        <div className="bg-tf-green/10 border border-tf-green/20 text-tf-green text-[11px] font-black uppercase tracking-widest px-8 py-5 rounded-full animate-fade-in shadow-sm w-fit mx-auto text-center">
          {success}
        </div>
      )}

      {/* View Mode / Edit Mode Container */}
      {donorProfile && !editing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Identity Hub */}
          <div className="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-sm space-y-10 group hover:border-tf-primary transition-all flex flex-col justify-between">
             <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic font-sans group-hover:text-tf-purple transition-all">Account Details</h3>
                <button
                  onClick={() => setEditing(true)}
                  className="px-8 py-3 border border-slate-100 bg-slate-50 text-slate-400 hover:text-white hover:bg-tf-primary hover:border-tf-primary rounded-full text-[10px] font-black uppercase tracking-[0.1em] transition-all shadow-sm transform active:scale-95"
                >
                  Edit profile
                </button>
             </div>
             
             <div className="space-y-8">
                <div>
                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5 italic">Official Email Address</p>
                   <p className="text-[15px] font-black text-tf-purple tracking-tight italic underline underline-offset-4 decoration-tf-primary/10">{user?.email || '—'}</p>
                </div>
                <div>
                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5 italic">Phone Contact</p>
                   <p className="text-[15px] font-black text-tf-purple tracking-tight italic">{donorProfile.phone || 'Not provided'}</p>
                </div>
                <div>
                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5 italic">Current Location</p>
                   <p className="text-[15px] font-black text-tf-purple tracking-tight italic">
                      {donorProfile.address?.city && donorProfile.address?.country 
                        ? `${donorProfile.address.city}, ${donorProfile.address.country}` 
                        : 'No Location Data'}
                   </p>
                </div>
             </div>
          </div>

          {/* Mission & Impact */}
          <div className="space-y-10">
             <div className="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-sm space-y-8 group hover:border-tf-primary transition-all">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic font-sans group-hover:text-tf-purple transition-all">Humanitarian Goals</h3>
                <p className="text-[14px] font-bold text-slate-600 leading-relaxed italic opacity-80 decoration-slate-100 decoration-offset-4 underline transition-all group-hover:opacity-100">
                  {donorProfile.bio || 'Please update your bio to let us know about your philanthropic vision.'}
                </p>
             </div>

             <div className="bg-tf-purple rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group border border-white/5">
                <div className="absolute top-0 right-0 w-40 h-40 bg-tf-primary/10 blur-[60px]" />
                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic font-sans mb-10 group-hover:text-white/60 transition-colors">Cause Priorities</h3>
                <div className="flex flex-wrap gap-4">
                   {donorProfile.preferredCauses?.length > 0
                     ? donorProfile.preferredCauses.map((cause) => (
                          <span
                            key={cause}
                            className="px-6 py-3 bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:bg-tf-primary text-[10px] font-black uppercase tracking-[0.1em] rounded-2xl transition-all cursor-crosshair shadow-lg"
                          >
                            #{cause}
                          </span>
                        ))
                     : <p className="text-white/20 text-[10px] font-black uppercase tracking-widest italic leading-loose">No priority areas established yet.</p>}
                </div>
             </div>
          </div>
        </div>
      ) : (
        /* Edit Form */
        donorProfile ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl p-16 max-w-4xl mx-auto space-y-12 animate-fade-in"
        >
          <div className="space-y-3 text-center">
             <h3 className="text-4xl font-black text-tf-purple tracking-tighter italic uppercase">Update Profile</h3>
             <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] italic">Humanitarian Information Registry</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <Field
               label="Contact Number"
               name="phone"
               value={form.phone}
               onChange={handleChange}
               placeholder="+94 77 000 0000"
             />

             <Field
               label="Cause Interests"
               name="preferredCauses"
               value={form.preferredCauses}
               onChange={handleChange}
               placeholder="education, health, relief"
               hint="(Comma-separated)"
             />

             <div className="md:col-span-2 grid grid-cols-2 md:col-cols-4 gap-8">
                <Field label="Street" name="address.street" value={form.address.street} onChange={handleChange} className="col-span-2" />
                <Field label="City" name="address.city" value={form.address.city} onChange={handleChange} />
                <Field label="Country" name="address.country" value={form.address.country} onChange={handleChange} />
             </div>

             <div className="md:col-span-2 space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 leading-none italic">Your Humanitarian Vision</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Share your goals and vision for charitable giving…"
                  className="w-full bg-slate-50 border border-slate-100 rounded-[2.5rem] px-10 py-8 text-sm font-bold text-tf-purple focus:outline-none focus:border-tf-primary transition-all resize-none shadow-inner placeholder:text-slate-300 italic"
                />
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-6">
             <button
               type="button"
               onClick={() => setEditing(false)}
               className="flex-1 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-tf-purple transition-colors"
             >
               Cancel Changes
             </button>
             <button
               type="submit"
               disabled={loading}
               className="flex-[2] py-6 bg-tf-primary hover:bg-tf-purple text-white text-[12px] font-black uppercase tracking-[0.3em] rounded-full transition-all shadow-2xl shadow-tf-primary/30 active:scale-95 disabled:opacity-50"
             >
               {loading ? 'STORING DATA…' : 'SAVE ACCOUNT UPDATES'}
             </button>
          </div>
        </form>
        ) : (
          <div className="p-20 text-center"><LoadingSpinner /></div>
        )
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>
    </div>
  );
}

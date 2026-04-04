import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDonor } from '../context/DonorContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiHeart, FiEdit3, 
  FiSave, FiX, FiShield, FiTrendingUp, FiCreditCard, 
  FiCalendar, FiMessageSquare, FiInfo, FiGlobe, FiCheckSquare 
} from 'react-icons/fi';

const defaultForm = {
  phone: '',
  address: { street: '', city: '', country: 'Sri Lanka', postalCode: '' },
  preferredCauses: '',
  bio: '',
};

function ProfileStat({ icon, label, value, colorClass = "text-slate-900", iconBg = "bg-slate-50", iconColor = "text-slate-400" }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 flex items-center gap-5 shadow-sm transition-all hover:shadow-md group">
      <div className={`w-12 h-12 ${iconBg} ${iconColor} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500`}>
        <span className="text-xl">{icon}</span>
      </div>
      <div>
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-xl font-extrabold tracking-tight ${colorClass}`}>{value}</p>
      </div>
    </div>
  );
}

function ProfileField({ label, icon, value, editing, name, formValue, onChange, placeholder, type = "text" }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <span className="text-slate-400 text-xs">{icon}</span>
        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{label}</label>
      </div>
      {editing ? (
        <input
          type={type}
          name={name}
          value={formValue}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-tf-primary focus:ring-4 focus:ring-tf-primary/5 transition-all shadow-inner"
        />
      ) : (
        <div className="w-full bg-slate-50/50 border border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900">
          {value || <span className="text-slate-300  font-medium">Not specified</span>}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { donorProfile, transactions, loading, error, fetchProfile, updateProfile, fetchTransactions } = useDonor();
  const [form, setForm] = useState(defaultForm);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [localError, setLocalError] = useState('');
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await fetchProfile();
        const targetId = profile?.userId?._id || profile?.userId;
        if (targetId) await fetchTransactions(targetId);
      } catch (err) {
        console.error('Profile/Transactions fetch error:', err);
      } finally {
        setInitialFetchDone(true);
      }
    };
    load();
  }, [fetchProfile, fetchTransactions]);

  useEffect(() => {
    if (donorProfile) {
      setForm({
        phone: donorProfile.phone || '',
        address: {
          street: donorProfile.address?.street || '',
          city: donorProfile.address?.city || '',
          country: donorProfile.address?.country || 'Sri Lanka',
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
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setLocalError(err.response?.data?.message || err.message || 'Update failed.');
    }
  };

  if (!initialFetchDone && loading) return <LoadingSpinner message="Loading donor profile..." />;

  const isNgoOrAdmin = user?.role === 'ngo-admin' || user?.role === 'admin';

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 font-sans animate-soft pt-6">
      
      {/* Header Section */}
      <div className="relative bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-tf-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">
          <div className="relative group shrink-0">
            <div className="w-28 h-28 rounded-full bg-slate-800 border-4 border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden transition-all duration-700 group-hover:scale-105 group-hover:border-tf-primary/30">
               <span className="text-3xl text-white font-extrabold tracking-tight opacity-90 group-hover:opacity-100 transition-opacity">
                {(user?.name || user?.email || 'U')[0].toUpperCase()}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-tf-primary border-4 border-slate-900 rounded-full flex items-center justify-center text-white shadow-xl">
               <FiShield className="text-[10px] stroke-[3]" />
            </div>
          </div>

          <div className="text-center md:text-left flex-1 space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
               <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-none">
                {user?.name || 'anonymous donor'}
               </h1>
               <span className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-tf-primary backdrop-blur-md shadow-inner">
                 Verified Donor
               </span>
            </div>
            <p className="text-slate-400 font-medium text-base leading-relaxed max-w-lg">
              {donorProfile?.bio || 'Supporter committed to global impact and helping those in need.'}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2">
               <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                 <FiMail className="text-tf-primary" /> {user?.email}
               </div>
               {donorProfile?.phone && (
                 <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                   <FiPhone className="text-tf-primary" /> {donorProfile.phone}
                 </div>
               )}
            </div>
          </div>

          {!isNgoOrAdmin && donorProfile && (
            <div className="shrink-0 pt-4 md:pt-0">
               {!editing ? (
                 <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-6 py-3.5 bg-white text-slate-900 rounded-xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-tf-primary hover:text-white transition-all shadow-xl active:scale-95 group">
                   <FiEdit3 className="text-lg group-hover:scale-110 transition-transform" /> Edit Profile
                 </button>
               ) : (
                 <div className="flex gap-2">
                    <button onClick={() => setEditing(false)} className="px-6 py-3.5 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">
                      Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-6 py-3.5 bg-tf-primary text-white rounded-xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl active:scale-95 flex items-center gap-2">
                      Save Changes
                    </button>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Main Stats Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProfileStat 
          icon={<FiHeart />} 
          label="Total Contributions" 
          value={`LKR ${(transactions?.reduce((sum, tx) => tx.status === 'completed' ? sum + Number(tx.amount) : sum, 0) || 0).toLocaleString()}`} 
          colorClass="text-rose-500"
          iconBg="bg-rose-50"
          iconColor="text-rose-500"
        />
        <ProfileStat 
          icon={<FiCheckSquare />} 
          label="Successful Gifts" 
          value={transactions?.filter(tx => tx.status === 'completed').length || 0} 
          colorClass="text-emerald-500"
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
        />
        <ProfileStat 
          icon={<FiTrendingUp />} 
          label="Impact Score" 
          value={(transactions?.filter(tx => tx.status === 'completed').length || 0) * 10} 
          colorClass="text-tf-primary"
          iconBg="bg-amber-50"
          iconColor="text-tf-primary"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Profile Details Form/View */}
        <div className="lg:col-span-12">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10 space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-50 pb-8">
               <div className="space-y-1">
                 <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3  underline decoration-tf-primary/30 decoration-4 underline-offset-8">Account Details</h2>
                 <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Your private community profile information Hub</p>
               </div>
               {!isNgoOrAdmin && !editing && (
                 <button onClick={() => setEditing(true)} className="text-[10px] font-extrabold text-tf-primary uppercase tracking-widest hover:text-slate-900 transition-colors ">Update Information →</button>
               )}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <ProfileField label="Full Name" icon={<FiUser />} value={user?.name} editing={false} />
              <ProfileField label="Email Address" icon={<FiMail />} value={user?.email} editing={false} />
              
              <ProfileField 
                label="Contact Phone" icon={<FiPhone />} 
                value={form.phone} editing={editing} name="phone" formValue={form.phone} onChange={handleChange} placeholder="+94 77 123 4567" 
              />
              <ProfileField 
                label="Preferred Causes" icon={<FiHeart />} 
                value={form.preferredCauses} editing={editing} name="preferredCauses" formValue={form.preferredCauses} onChange={handleChange} placeholder="Education, Health, Environment..." 
              />

              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <FiMessageSquare className="text-slate-400 text-xs" />
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">About You / My Mission</label>
                </div>
                {editing ? (
                  <textarea 
                    name="bio" value={form.bio} onChange={handleChange} placeholder="A short bio about your mission..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-tf-primary focus:ring-4 focus:ring-tf-primary/5 transition-all shadow-inner min-h-[120px] resize-none"
                  />
                ) : (
                  <div className="w-full bg-slate-50/50 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 leading-relaxed ">
                    {donorProfile?.bio || <span className="text-slate-300  font-medium">No bio provided. Tell us about your mission Hub!</span>}
                  </div>
                )}
              </div>

              <div className="md:col-span-2 pt-6 border-t border-slate-50">
                <h3 className="text-[10px] font-extrabold text-slate-900 uppercase tracking-widest mb-8  flex items-center gap-3">
                  <FiMapPin className="text-tf-primary" /> Physical Address Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ProfileField 
                    label="Street Address" icon={<FiMapPin />} 
                    value={form.address.street} editing={editing} name="address.street" formValue={form.address.street} onChange={handleChange} 
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <ProfileField 
                      label="City" icon={<FiGlobe />} 
                      value={form.address.city} editing={editing} name="address.city" formValue={form.address.city} onChange={handleChange} 
                    />
                    <ProfileField 
                      label="Postal Code" icon={<FiCreditCard />} 
                      value={form.address.postalCode} editing={editing} name="address.postalCode" formValue={form.address.postalCode} onChange={handleChange} 
                    />
                  </div>
                </div>
              </div>

              {editing && (
                <div className="md:col-span-2 pt-10 flex gap-4">
                  <button type="submit" className="flex-1 py-5 bg-slate-950 text-white rounded-2xl text-[11px] font-extrabold uppercase tracking-widest hover:bg-tf-primary transition-all shadow-xl active:scale-95 ">Save Information Hub</button>
                  <button type="button" onClick={() => setEditing(false)} className="px-10 py-5 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-extrabold uppercase tracking-widest hover:text-slate-950 transition-all  underline decoration-transparent hover:decoration-slate-950 underline-offset-8">Cancel Hub</button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Informational Cards */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-950 rounded-[2rem] p-8 text-white relative overflow-hidden group/card shadow-2xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-tf-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover/card:opacity-100 transition-opacity opacity-0" />
             <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                   <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-tf-primary">
                      <FiShield className="text-xl" />
                   </div>
                   <span className="text-[9px] font-extrabold text-white/20 uppercase tracking-widest ">Verification Level 01</span>
                </div>
                <div className="space-y-2">
                   <h4 className="text-xl font-extrabold  tracking-tight">Security & Privacy Hub</h4>
                   <p className="text-xs text-white/50 font-medium leading-relaxed  ">Your account information is protected by industry-standard encryption protocols. We never share your private details without consent Hub.</p>
                </div>
                <button className="text-[10px] font-extrabold text-tf-primary uppercase tracking-widest hover:text-white transition-colors ">Privacy Settings Hub →</button>
             </div>
          </div>
          
          <div className="bg-white rounded-[2rem] border border-dashed border-slate-200 p-8 flex flex-col justify-center items-center text-center space-y-6 group hover:border-tf-primary/30 transition-all">
             <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 group-hover:text-tf-primary group-hover:bg-amber-50 transition-all">
                <FiInfo className="text-2xl" />
             </div>
             <div className="max-w-xs space-y-2">
                <h4 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">More Features Coming</h4>
                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest leading-relaxed">We are currently developing advanced impact reporting and recurring payment management hubs.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Persistence Feedback */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]">
             <div className="bg-slate-950 text-emerald-400 px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-extrabold uppercase tracking-widest text-[10px] border border-white/10 ">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                {success}
             </div>
          </motion.div>
        )}
        {localError && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]">
             <div className="bg-rose-600 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-extrabold uppercase tracking-widest text-[10px] ">
                <FiX />
                {localError}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

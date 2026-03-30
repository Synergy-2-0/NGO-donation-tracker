import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDonor } from '../context/DonorContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { FiUser, FiActivity, FiArrowRight, FiShield, FiBriefcase, FiEdit3 } from 'react-icons/fi';

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
      .catch(() => { })
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

  if (!initialFetchDone && loading) return <LoadingSpinner message="Accessing profile data..." />;

  const isNgoOrAdmin = user?.role === 'ngo-admin' || user?.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-soft text-left">
      <div>
        <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm"><FiUser /></span>
            <h2 className="text-2xl font-black text-slate-900 tracking-bespoke">Account Credentials</h2>
        </div>
        <p className="text-sm text-slate-500 font-medium">Manage your digital identity and secure access tokens.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
            {(localError || error) && (
                <ErrorAlert
                message={localError || error}
                onDismiss={() => setLocalError('')}
                />
            )}

            {success && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl shadow-sm mb-6">
                {success}
                </div>
            )}

            {isNgoOrAdmin ? (
                <div className="bg-white rounded-[40px] border border-slate-100 p-12 text-center space-y-6 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                        <FiShield className="text-4xl" />
                    </div>
                    <div className="space-y-2">
                         <h3 className="text-xl font-black text-slate-900 tracking-tight">Institutional Account</h3>
                         <p className="text-slate-500 text-sm font-medium max-w-sm mx-auto">
                            As an {user.role === 'admin' ? 'System' : 'NGO'} Administrator, you manage organizational performance directly from your mission dashboard.
                         </p>
                    </div>
                    <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-red transition-all shadow-xl shadow-slate-900/10 active:scale-95">
                        <FiArrowRight /> Return to Command
                    </Link>
                </div>
            ) : donorProfile && !editing ? (
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-brand-red text-white rounded-xl flex items-center justify-center text-sm"><FiBriefcase /></span>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Identity Details</h3>
                    </div>
                    <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                    <FiEdit3 className="text-sm" /> Modify
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Digital Identity</p>
                        <p className="text-base font-bold text-slate-900 tracking-bespoke">{user?.name || 'Authorized Donor'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Network Token</p>
                        <p className="text-sm font-medium text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tele-Identity</p>
                        <p className="text-sm font-medium text-slate-800">{donorProfile.phone || '—'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Geo-Impact Base</p>
                        <p className="text-sm font-medium text-slate-800">{donorProfile.address?.city}, {donorProfile.address?.country}</p>
                    </div>
                    
                    <div className="col-span-2 pt-4 border-t border-slate-50">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Strategic Interests</p>
                        <div className="flex flex-wrap gap-2">
                        {donorProfile.preferredCauses?.length > 0
                        ? donorProfile.preferredCauses.map((cause) => (
                            <span key={cause} className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-lg border border-slate-100 capitalize">
                                {cause}
                            </span>
                        ))
                        : <p className="text-sm text-slate-400 italic">No preferences registered.</p>}
                        </div>
                    </div>
                </div>
                </div>
            ) : donorProfile ? (
                 <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-brand-red text-white rounded-xl flex items-center justify-center text-sm"><FiEdit3 /></span>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Edit Credentials</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Primary Phone</label>
                                <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-brand-red/5 transition-all" />
                            </div>
                            <div className="col-span-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Street Access</label>
                                <input type="text" name="address.street" value={form.address.street} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-brand-red/5 transition-all" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Local City</label>
                                <input type="text" name="address.city" value={form.address.city} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-brand-red/5 transition-all" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Country Code</label>
                                <input type="text" name="address.country" value={form.address.country} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-brand-red/5 transition-all" />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button type="submit" disabled={loading} className="px-8 py-4 bg-brand-red text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-red/90 transition-all shadow-xl shadow-brand-red/20 active:scale-95 disabled:opacity-50">
                                {loading ? 'Syncing...' : 'Confirm Changes'}
                            </button>
                            <button type="button" onClick={() => setEditing(false)} className="px-8 py-4 bg-white border border-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
                                Discard
                            </button>
                        </div>
                    </form>
                 </div>
            ) : (
                <div className="bg-white rounded-[40px] border border-slate-100 p-12 text-center space-y-6 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                        <FiUser className="text-4xl" />
                    </div>
                    <div className="space-y-2">
                         <h3 className="text-xl font-black text-slate-900 tracking-tight">Mission Setup Required</h3>
                         <p className="text-slate-500 text-sm font-medium max-w-sm mx-auto">
                            Complete your registration as a Donor to begin setting up your strategic interests.
                         </p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}


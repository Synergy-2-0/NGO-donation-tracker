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

function PremiumField({ label, name, value, onChange, type = 'text', placeholder, hint, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">
        {label}
        {hint && <span className="ml-1 italic font-medium text-gray-300 normal-case">{hint}</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white/50 backdrop-blur-sm border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all font-semibold text-gray-700 placeholder:text-gray-200"
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
      setLocalError(err.response?.data?.message || err.message || 'Failed to save profile.');
    }
  };

  if (!initialFetchDone && loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#1E293B] tracking-tight">
            Donor <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Profile</span>
          </h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
            {donorProfile
              ? 'Manage your personal contribution records.'
              : 'Initialize your presence in the synergy ecosystem.'}
          </p>
        </div>
      </div>

      {(localError || error) && (
        <ErrorAlert
          message={localError || error}
          onDismiss={() => setLocalError('')}
        />
      )}
      
      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold px-6 py-4 rounded-2xl shadow-sm animate-pulse">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Avatar/Summary Card */}
        <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-10 -mr-16 -mt-16"></div>
                <div className="relative z-10 font-sans">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-indigo-200 group-hover:rotate-3 transition-transform duration-500">
                        {user?.name?.[0].toUpperCase() || 'U'}
                    </div>
                    <h3 className="text-xl font-black text-gray-800 mt-6">{user?.name}</h3>
                    <p className="text-sm font-bold text-gray-400 mt-1">{user?.email}</p>
                    <div className="mt-8 flex justify-center gap-2">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">Verified Donor</span>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Active</span>
                    </div>
                </div>
            </div>

            <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                <div className="relative z-10 flex flex-col justify-center items-center text-center">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
                    </div>
                    <h4 className="text-lg font-bold">Your Bio</h4>
                    <p className="text-sm text-indigo-200 mt-2 italic leading-relaxed">
                        {donorProfile?.bio || "Tell us why you support these causes..."}
                    </p>
                </div>
            </div>
        </div>

        {/* Right Side: Data/Form */}
        <div className="lg:col-span-2">
            {!editing && donorProfile ? (
                 <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-10">
                    <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                        <h3 className="text-lg font-black text-gray-800 tracking-tight uppercase tracking-widest text-[10px]">Registry Information</h3>
                        <button
                            onClick={() => setEditing(true)}
                            className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                        >
                            Update Profile
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 font-sans">
                        <div className="group">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 group-hover:text-indigo-400 transition-colors">Phone Discovery</p>
                            <p className="text-sm font-bold text-gray-700 tracking-tight">{donorProfile.phone || 'N/A'}</p>
                        </div>
                        <div className="group">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 group-hover:text-indigo-400 transition-colors">Residential Country</p>
                            <p className="text-sm font-bold text-gray-700 tracking-tight">{donorProfile.address?.country || 'N/A'}</p>
                        </div>
                        <div className="group">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 group-hover:text-indigo-400 transition-colors">City Location</p>
                            <p className="text-sm font-bold text-gray-700 tracking-tight">{donorProfile.address?.city || 'N/A'}</p>
                        </div>
                        <div className="group">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 group-hover:text-indigo-400 transition-colors">Geographic State</p>
                            <p className="text-sm font-bold text-gray-700 tracking-tight">{donorProfile.address?.state || 'N/A'}</p>
                        </div>
                        {donorProfile.address?.street && (
                            <div className="col-span-2 group">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 group-hover:text-indigo-400 transition-colors">Precise Street Address</p>
                                <p className="text-sm font-bold text-gray-700 tracking-tight leading-relaxed">{donorProfile.address.street}</p>
                            </div>
                        )}
                        <div className="col-span-2 group">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 group-hover:text-indigo-400 transition-colors">Preferred Impact Causes</p>
                             <div className="flex flex-wrap gap-2 mt-2">
                                {donorProfile.preferredCauses?.length > 0
                                ? donorProfile.preferredCauses.map((cause) => (
                                    <span
                                        key={cause}
                                        className="px-4 py-1.5 bg-gray-50 text-indigo-600 text-[10px] rounded-xl font-black uppercase tracking-widest border border-gray-100 hover:bg-indigo-600 hover:text-white transition-all cursor-default"
                                    >
                                        {cause}
                                    </span>
                                    ))
                                : <p className="text-sm font-bold text-gray-300 italic">— No causes defined</p>}
                             </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-50 flex justify-between items-center">
                        <p className="text-[10px] font-medium text-gray-400 italic">Careful with sensitive data deletion.</p>
                        <button
                            onClick={() => setConfirmDelete(true)}
                            className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                        >
                            Delete Registry Record
                        </button>
                    </div>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white/80 backdrop-blur-md p-10 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-8"
                >
                    <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                        <h3 className="text-lg font-black text-gray-800 tracking-tight uppercase tracking-widest text-[10px]">
                            {donorProfile ? 'Update Record' : 'Create Registry'}
                        </h3>
                    </div>

                    <PremiumField
                        label="Primary Phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+94 77 123 4567"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <PremiumField
                            label="Residential Street"
                            name="address.street"
                            value={form.address.street}
                            onChange={handleChange}
                            className="col-span-2"
                        />
                        <PremiumField
                            label="Town / City"
                            name="address.city"
                            value={form.address.city}
                            onChange={handleChange}
                        />
                        <PremiumField
                            label="Region / State"
                            name="address.state"
                            value={form.address.state}
                            onChange={handleChange}
                        />
                        <PremiumField
                            label="Country"
                            name="address.country"
                            value={form.address.country}
                            onChange={handleChange}
                        />
                        <PremiumField
                            label="ZIP Code"
                            name="address.postalCode"
                            value={form.address.postalCode}
                            onChange={handleChange}
                        />
                    </div>

                    <PremiumField
                        label="Impact Taxonomy"
                        name="preferredCauses"
                        value={form.preferredCauses}
                        onChange={handleChange}
                        placeholder="education, health, conservation"
                        hint="(comma-separated list)"
                    />

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Personal Mission Statement (Bio)</label>
                        <textarea
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Briefly describe your vision for charitable support..."
                            className="w-full bg-white/50 backdrop-blur-sm border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all font-semibold text-gray-700 placeholder:text-gray-200 resize-none"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 py-4 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all active:scale-95 ${loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
                        >
                            {loading ? 'Processing...' : donorProfile ? 'Commit Changes' : 'Initialize Profile'}
                        </button>
                        {donorProfile && (
                        <button
                            type="button"
                            onClick={() => setEditing(false)}
                            className="px-8 py-4 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all active:scale-95"
                        >
                            Discard
                        </button>
                        )}
                    </div>
                </form>
            )}
        </div>
      </div>

      {/* Modern Pop-up Modal for Deletion */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] shadow-2xl p-10 max-w-md w-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-rose-100 italic">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h4 className="text-2xl font-black text-gray-800 tracking-tight mb-4">
                Verify Data Erasure
                </h4>
                <p className="text-sm text-gray-400 font-medium leading-relaxed mb-10">
                You are about to permanently remove your registry record from the Synergy ecosystem. This operation is **irreversible**.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex-1 py-4 bg-rose-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95"
                    >
                        {loading ? 'Erasing...' : 'Confirm Erasure'}
                    </button>
                    <button
                        onClick={() => setConfirmDelete(false)}
                        className="flex-1 py-4 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all active:scale-95"
                    >
                        Abort
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

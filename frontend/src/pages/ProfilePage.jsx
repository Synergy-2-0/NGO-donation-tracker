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
      <label className="block text-xs font-semibold text-[#7C2D12] uppercase tracking-wide mb-1">
        {label}
        {hint && <span className="ml-1 text-gray-400 text-xs font-normal normal-case">{hint}</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-orange-200 bg-orange-50/40 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
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
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7C2D12]">Donor Profile</h2>
        <p className="text-sm text-gray-500 mt-1">View and manage your donor information.</p>
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

      {/* View Mode */}
      {donorProfile && !editing ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-700">Profile Information</h3>
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-[#DC2626] hover:text-red-700 font-semibold"
            >
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div>
              <p className="text-gray-400 mb-0.5">Name</p>
              <p className="font-medium text-gray-800">{user?.name || '—'}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Email</p>
              <p className="font-medium text-gray-800">{user?.email || '—'}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Phone</p>
              <p className="font-medium text-gray-800">{donorProfile.phone || '—'}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Country</p>
              <p className="font-medium text-gray-800">{donorProfile.address?.country || '—'}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">City</p>
              <p className="font-medium text-gray-800">{donorProfile.address?.city || '—'}</p>
            </div>
            {donorProfile.address?.street && (
              <div className="col-span-2">
                <p className="text-gray-400 mb-0.5">Street Address</p>
                <p className="font-medium text-gray-800">{donorProfile.address.street}</p>
              </div>
            )}
            <div className="col-span-2">
              <p className="text-gray-400 mb-0.5">Preferred Causes</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {donorProfile.preferredCauses?.length > 0
                  ? donorProfile.preferredCauses.map((cause) => (
                      <span
                        key={cause}
                        className="px-2 py-0.5 bg-orange-50 text-[#7C2D12] text-xs rounded-full font-medium"
                      >
                        {cause}
                      </span>
                    ))
                  : <p className="font-medium text-gray-800">—</p>}
              </div>
            </div>

        </div>
      ) : (
        /* Edit Form — only shown when editing an existing profile */
        donorProfile ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5"
        >
          <h3 className="text-base font-semibold text-gray-700">Edit Profile</h3>

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

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Street Address"
              name="address.street"
              value={form.address.street}
              onChange={handleChange}
              className="col-span-2"
            />
            <Field
              label="City"
              name="address.city"
              value={form.address.city}
              onChange={handleChange}
            />
            <Field
              label="Country"
              name="address.country"
              value={form.address.country}
              onChange={handleChange}
            />
            <Field
              label="Postal Code"
              name="address.postalCode"
              value={form.address.postalCode}
              onChange={handleChange}
            />
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

          <div>
            <label className="block text-xs font-semibold text-[#7C2D12] uppercase tracking-wide mb-1">Bio <span className="font-normal text-gray-400 normal-case">(optional)</span></label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              className="w-full border border-orange-200 bg-orange-50/40 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none transition"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#DC2626] hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-5 py-2 border border-orange-200 hover:bg-orange-50 text-[#7C2D12] text-sm font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
        ) : (
          <LoadingSpinner message="Setting up your profile..." />
        )
      )}

    </div>
  );
}

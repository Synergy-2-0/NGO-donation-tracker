import { useState } from 'react';
import { useAdminCampaign } from '../../../context/AdminCampaignContext';
import { useNavigate, Link } from 'react-router-dom';

export default function CreateCampaignPage() {
    const { createCampaign } = useAdminCampaign();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        goalAmount: '',
        startDate: '',
        endDate: '',
        image: null,
        imagePreview: '',
        location: {
            city: '',
            state: '',
            country: '',
            coordinates: { type: 'Point', coordinates: [0, 0] },
        },
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFormData((prev) => ({
            ...prev,
            image: file,
            imagePreview: URL.createObjectURL(file),
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['city', 'state', 'country'].includes(name)) {
            setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, [name]: value },
            }));
        } else if (['lat', 'lng'].includes(name)) {
            setFormData((prev) => ({
                ...prev,
                location: {
                    ...prev.location,
                    coordinates: [
                        name === 'lng' ? parseFloat(value) : prev.location.coordinates[0],
                        name === 'lat' ? parseFloat(value) : prev.location.coordinates[1],
                    ],
                },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await createCampaign(formData);
            navigate('/admin/campaign-dashboard');
        } catch (err) {
            console.error(err);
            setError('Failed to create campaign. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputCls = 'mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-colors bg-gray-50 hover:bg-white';
    const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5';

    return (
        <div className="min-h-full bg-gray-50 p-8 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Create New Campaign</h2>
                    <p className="text-gray-500 text-sm mt-1">Fill in the details to launch a new campaign.</p>
                </div>
                <Link
                    to="/admin/campaign-dashboard"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Basic Info */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-700">Basic Information</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className={labelCls}>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter campaign title"
                                className={inputCls}
                                required
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className={labelCls}>Campaign Image</label>
                            <label className="mt-1 flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-200 rounded-lg cursor-pointer bg-gray-50 hover:bg-red-50/30 hover:border-red-200 transition-colors group">
                                {formData.imagePreview ? (
                                    <div className="relative w-full">
                                        <img
                                            src={formData.imagePreview}
                                            alt="preview"
                                            className="w-full h-44 object-cover rounded-lg"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                            <p className="text-white text-xs font-semibold">Click to change image</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 px-4">
                                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-red-100 transition-colors">
                                            <svg className="w-5 h-5 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-medium text-gray-500 group-hover:text-[#DC2626] transition-colors">Click to upload image</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <div>
                            <label className={labelCls}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the campaign goals and impact..."
                                className={inputCls}
                                rows={4}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Goal & Dates */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-[#7C2D12]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-700">Goal & Timeline</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className={labelCls}>Goal Amount (LKR)</label>
                                <input
                                    type="number"
                                    name="goalAmount"
                                    value={formData.goalAmount}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className={inputCls}
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelCls}>Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className={inputCls}
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelCls}>End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className={inputCls}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-700">Location</h3>
                        <span className="text-xs text-gray-400 font-medium ml-1">(optional)</span>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className={labelCls}>City</label>
                                <input type="text" name="city" value={formData.location.city} onChange={handleChange} placeholder="Colombo" className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>State / Province</label>
                                <input type="text" name="state" value={formData.location.state} onChange={handleChange} placeholder="Western" className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Country</label>
                                <input type="text" name="country" value={formData.location.country} onChange={handleChange} placeholder="Sri Lanka" className={inputCls} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Latitude</label>
                                <input type="number" name="lat" value={formData.location.coordinates[1]} onChange={handleChange} placeholder="6.9271" className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Longitude</label>
                                <input type="number" name="lng" value={formData.location.coordinates[0]} onChange={handleChange} placeholder="79.8612" className={inputCls} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-lg">
                        <svg className="w-4 h-4 text-[#DC2626] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-[#DC2626] font-medium">{error}</p>
                    </div>
                )}

                {/* Submit */}
                <div className="flex items-center justify-end gap-3">
                    <Link
                        to="/admin/campaign-dashboard"
                        className="px-5 py-2.5 bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 rounded-lg text-sm font-medium transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: 'linear-gradient(135deg, #7C2D12 0%, #DC2626 100%)' }}
                    >
                        {loading ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Creating...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Create Campaign
                            </>
                        )}
                    </button>
                </div>
            </form>

        </div>
    );
}
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdminCampaign } from '../../../context/AdminCampaignContext';
import LoadingSpinner from '../../../components/LoadingSpinner';
import CampaignProgressSection from './CampaignProgressSection';
import CampaignReportSection from './CampaignReportSection';


const statusConfig = {
    draft: { label: 'Draft', className: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
    active: { label: 'Active', className: 'bg-red-100 text-[#DC2626]', dot: 'bg-[#DC2626]' },
    completed: { label: 'Completed', className: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
    archived: { label: 'Archived', className: 'bg-orange-100 text-[#7C2D12]', dot: 'bg-orange-500' },
};

function StatusBadge({ status }) {
    const cfg = statusConfig[status] ?? statusConfig.draft;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.className}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

export default function CampaignDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchCampaignById, updateCampaign, publishCampaign } = useAdminCampaign();

    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const isLocked =
        campaign?.status === "active" ||
        campaign?.status === "completed";
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        goalAmount: '',
        startDate: '',
        endDate: '',
        image: null,
        imagePreview: '',
        location: { city: '', state: '', country: '' },
    });

    useEffect(() => {
        setLoading(true);
        fetchCampaignById(id)
            .then((data) => {
                setCampaign(data);
                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    goalAmount: data.goalAmount || '',
                    startDate: data.startDate?.slice(0, 10) || '',
                    endDate: data.endDate?.slice(0, 10) || '',
                    image: null,
                    imagePreview: data.image || '',
                    location: {
                        city: data.location?.city || '',
                        state: data.location?.state || '',
                        country: data.location?.country || '',
                    },
                });
            })
            .catch(() => setError('Failed to load campaign.'))
            .finally(() => setLoading(false));
    }, [id, fetchCampaignById]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['city', 'state', 'country'].includes(name)) {
            setFormData((prev) => ({ ...prev, location: { ...prev.location, [name]: value } }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFormData((prev) => ({ ...prev, image: file, imagePreview: URL.createObjectURL(file) }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            const updated = await updateCampaign(id, formData);
            setCampaign(updated);
            setEditing(false);
            setSuccess('Campaign updated successfully.');
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Failed to save changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        setError('');
        setFormData({
            title: campaign.title || '',
            description: campaign.description || '',
            goalAmount: campaign.goalAmount || '',
            startDate: campaign.startDate?.slice(0, 10) || '',
            endDate: campaign.endDate?.slice(0, 10) || '',
            image: null,
            imagePreview: campaign.image || '',
            location: {
                city: campaign.location?.city || '',
                state: campaign.location?.state || '',
                country: campaign.location?.country || '',
            },
        });
    };

    const handlePublish = async () => {
        try {
            await publishCampaign(id);
            setCampaign((prev) => ({ ...prev, status: 'active' }));
            setSuccess('Campaign published.');
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Failed to publish campaign.');
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!campaign && !loading) return (
        <div className="min-h-full bg-gray-50 p-8 flex flex-col items-center justify-center gap-3">
            <p className="text-gray-500 text-sm">Campaign not found.</p>
            <Link to="/admin/campaign-dashboard" className="text-sm text-[#DC2626] hover:underline">← Back to dashboard</Link>
        </div>
    );

    const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-colors bg-gray-50 hover:bg-white';
    const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1';
    const viewValueCls = 'text-sm text-gray-800';

    const locationLine = [campaign.location?.city, campaign.location?.state, campaign.location?.country].filter(Boolean).join(', ');

    return (
        <div className="min-h-full bg-gray-50 p-8 space-y-6">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                    <Link
                        to="/admin/campaign-dashboard"
                        className="flex items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors shadow-sm shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div className="min-w-0">
                        <p className="text-gray-500 text-sm truncate">{campaign.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">ID: {id?.slice(-8)}</p>
                            <StatusBadge status={campaign.status} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">

                    {/* publish only when draft */}
                    {campaign.status === 'draft' && !editing && (
                        <button
                            onClick={handlePublish}
                            className="px-4 py-2 bg-green-50 text-green-700 border border-green-100 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                        >
                            Publish
                        </button>
                    )}

                    {/* edit button */}
                    {!editing && (
                        <button
                            disabled={isLocked}
                            onClick={() => setEditing(true)}
                            className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-all shadow-sm
            ${isLocked ? "opacity-50 cursor-not-allowed" : "hover:shadow-md hover:opacity-90"}`}
                            style={{ background: 'linear-gradient(135deg, #7C2D12 0%, #DC2626 100%)' }}
                        >
                            Edit
                        </button>
                    )}

                    {editing && !isLocked && (
                        <>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 rounded-lg text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-5 py-2 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md hover:opacity-90 disabled:opacity-50"
                                style={{ background: 'linear-gradient(135deg, #7C2D12 0%, #DC2626 100%)' }}
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </>
                    )}

                </div>
            </div>

            {isLocked && (
                <div className="text-xs text-orange-600 bg-orange-50 border border-orange-100 px-3 py-2 rounded-lg">
                    This campaign is already published or active. Editing is disabled to maintain transparency.
                </div>
            )}
            {/* Alerts */}
            {error && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-lg">
                    <svg className="w-4 h-4 text-[#DC2626] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-[#DC2626] font-medium">{error}</p>
                </div>
            )}
            {success && (
                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-100 rounded-lg">
                    <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-green-700 font-medium">{success}</p>
                </div>
            )}

            {/* Basic Information */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700">Basic Information</h3>
                </div>
                <div className="p-6 space-y-5">

                    {/* Image */}
                    <div>
                        <p className={labelCls}>Campaign Image</p>
                        {editing ? (
                            <label className="mt-1 flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-200 rounded-lg cursor-pointer bg-gray-50 hover:bg-red-50/30 hover:border-red-200 transition-colors group">
                                {formData.imagePreview ? (
                                    <div className="relative w-full">
                                        <img src={formData.imagePreview} alt="preview" className="w-full h-48 object-cover rounded-lg" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                            <p className="text-white text-xs font-semibold">Click to change image</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-red-100 transition-colors">
                                            <svg className="w-5 h-5 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-medium text-gray-500 group-hover:text-[#DC2626] transition-colors">Click to upload image</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        ) : (
                            formData.imagePreview ? (
                                <img src={formData.imagePreview} alt={campaign.title} className="mt-1 w-full h-48 object-cover rounded-lg border border-gray-100" />
                            ) : (
                                <div className="mt-1 w-full h-32 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center">
                                    <p className="text-xs text-gray-300">No image uploaded</p>
                                </div>
                            )
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <p className={labelCls}>Title</p>
                        {editing ? (
                            <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputCls} placeholder="Campaign title" required />
                        ) : (
                            <p className={`${viewValueCls} font-semibold text-gray-900`}>{campaign.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <p className={labelCls}>Description</p>
                        {editing ? (
                            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className={inputCls} placeholder="Campaign description..." />
                        ) : (
                            <p className={`${viewValueCls} text-gray-600 leading-relaxed`}>{campaign.description || '—'}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Goal & Timeline */}
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
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <p className={labelCls}>Goal Amount (LKR)</p>
                            {editing ? (
                                <input type="number" name="goalAmount" value={formData.goalAmount} onChange={handleChange} className={inputCls} placeholder="0" />
                            ) : (
                                <p className="text-lg font-bold text-[#7C2D12]">LKR {Number(campaign.goalAmount || 0).toLocaleString()}</p>
                            )}
                        </div>
                        <div>
                            <p className={labelCls}>Start Date</p>
                            {editing ? (
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className={inputCls} />
                            ) : (
                                <p className={viewValueCls}>{campaign.startDate ? new Date(campaign.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</p>
                            )}
                        </div>
                        <div>
                            <p className={labelCls}>End Date</p>
                            {editing ? (
                                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className={inputCls} />
                            ) : (
                                <p className={viewValueCls}>{campaign.endDate ? new Date(campaign.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</p>
                            )}
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
                </div>
                <div className="p-6">
                    {editing ? (
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className={labelCls}>City</p>
                                <input type="text" name="city" value={formData.location.city} onChange={handleChange} placeholder="Colombo" className={inputCls} />
                            </div>
                            <div>
                                <p className={labelCls}>State / Province</p>
                                <input type="text" name="state" value={formData.location.state} onChange={handleChange} placeholder="Western" className={inputCls} />
                            </div>
                            <div>
                                <p className={labelCls}>Country</p>
                                <input type="text" name="country" value={formData.location.country} onChange={handleChange} placeholder="Sri Lanka" className={inputCls} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4 text-[#DC2626] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {locationLine || <span className="text-gray-300">No location set</span>}
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Logs — visible for active campaigns */}
            {campaign.status === 'active' && (
                <CampaignProgressSection
                    campaignId={id}
                    campaignStatus={campaign.status}
                />
            )}

            {/* Campaign Report — only for completed campaigns */}
            {campaign.status === 'completed' && (
                <CampaignReportSection campaignId={id} />
            )}

        </div>
    );
}
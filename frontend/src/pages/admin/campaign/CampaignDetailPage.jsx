import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdminCampaign } from '../../../context/AdminCampaignContext';
import { useAuth } from '../../../context/AuthContext';
import { CampaignDetailSkeleton } from '../../../components/Skeleton';
import CampaignProgressSection from './CampaignProgressSection';
import CampaignReportSection from './CampaignReportSection';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { 
  FiChevronLeft, FiEdit3, FiCheckCircle, FiClock, FiActivity, 
  FiArchive, FiMapPin, FiCalendar, FiDollarSign, FiType, FiLayers,
  FiFileText, FiSave, FiX, FiAlertTriangle, FiCheck, FiCpu, FiTarget, FiPlus, FiTrash2
} from 'react-icons/fi';

const statusConfig = {
    draft: { label: 'Proposal', className: 'bg-slate-100 text-slate-500 border-slate-200', icon: <FiClock /> },
    active: { label: 'Live Mission', className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: <FiActivity /> },
    completed: { label: 'Accomplished', className: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20', icon: <FiCheckCircle /> },
    archived: { label: 'Closed', className: 'bg-rose-500/10 text-rose-500 border-rose-500/20', icon: <FiArchive /> },
};

function StatusBadge({ status }) {
    const cfg = statusConfig[status] ?? statusConfig.draft;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${cfg.className}`}>
            {cfg.icon}
            {cfg.label}
        </span>
    );
}

export default function CampaignDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { fetchCampaignById, updateCampaign, publishCampaign, deleteCampaign } = useAdminCampaign();

    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const isLocked = campaign?.status === "active" || campaign?.status === "completed";
    
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
            .catch(() => setError('Failed to load mission details.'))
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
            setSuccess('Mission profile synchronized.');
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Failed to synchronize mission changes.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        setError('');
        resetForm(campaign);
    };

    const handlePublish = async () => {
        try {
            await publishCampaign(id);
            setCampaign((prev) => ({ ...prev, status: 'active' }));
            setSuccess('Mission live on network.');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Deployment failed.');
        }
    };

    const handleDelete = () => setShowDeleteModal(true);
    
    const confirmDelete = async () => {
        setShowDeleteModal(false);
        try {
            await deleteCampaign(id);
            navigate('/admin/campaign-dashboard');
        } catch (err) {
            setError(err.message || 'Abortion failed.');
        }
    };

    if (loading) return <CampaignDetailSkeleton />;
    if (!campaign && !loading) return (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-left">
            <FiAlertTriangle className="text-4xl text-brand-red animate-pulse" />
            <p className="text-slate-400 font-black uppercase tracking-widest">Mission Not Found</p>
            <Link to="/admin/campaign-dashboard" className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-red transition-all">
               Return to Registry
            </Link>
        </div>
    );

    const inputCls = 'w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red/20 transition-all placeholder:text-slate-300';
    const labelCls = 'block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2';

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fadeIn text-left">
            
            {/* Action Header */}
            <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <div className="flex items-center gap-6 relative z-10">
                    <Link to="/admin/campaign-dashboard" className="w-12 h-12 bg-slate-900 flex items-center justify-center rounded-2xl text-white hover:bg-brand-red transition-all shadow-xl shadow-slate-900/10 active:scale-95">
                        <FiChevronLeft className="text-xl" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <h2 className="text-2xl font-black text-slate-900 tracking-tight">{campaign.title}</h2>
                             <StatusBadge status={campaign.status} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mission Identity: {id}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    {campaign.status === 'draft' && !editing && user?.role === 'admin' && (
                        <div className="flex gap-2">
                             <button onClick={handleDelete} className="p-3 bg-white border border-rose-100 text-rose-500 rounded-full hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95 group" title="Abort Mission">
                                <FiTrash2 className="text-sm stroke-[3]" />
                             </button>
                             <button onClick={handlePublish} className="px-6 py-3 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2">
                                <FiCheck className="text-sm stroke-[3]" /> Deploy Mission
                             </button>
                        </div>
                    )}

                    {!editing ? (
                        <button 
                            disabled={isLocked}
                            onClick={() => setEditing(true)}
                            className={`px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isLocked ? 'opacity-30 cursor-not-allowed' : 'hover:bg-brand-red shadow-xl shadow-slate-900/10 active:scale-95'}`}
                        >
                            <FiEdit3 className="text-sm" /> Modify Profile
                        </button>
                    ) : (
                        <>
                            <button onClick={handleCancel} className="px-6 py-3 bg-white border border-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                                <FiX className="text-sm stroke-[3]" /> Discard
                            </button>
                            <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-brand-red text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-red/90 transition-all shadow-xl shadow-brand-red/20 active:scale-95 flex items-center gap-2 disabled:opacity-50">
                                <FiSave className="text-sm" /> {saving ? 'Syncing...' : 'Keep Changes'}
                            </button>
                        </>
                    )}
                </div>
            </section>

            {isLocked && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3 animate-pulse">
                    <FiAlertTriangle className="text-amber-600 shrink-0" />
                    <p className="text-[11px] font-black text-amber-700 uppercase tracking-widest">
                        Mission Locked: Active or Completed initiatives cannot be modified to ensure audit transparency.
                    </p>
                </div>
            )}

            {(error || success) && (
                <div className={`rounded-2xl border p-4 flex items-center gap-3 shadow-sm ${error ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                    {error ? <FiAlertTriangle className="shrink-0" /> : <FiCheckCircle className="shrink-0" />}
                    <p className="text-[11px] font-black uppercase tracking-widest">{error || success}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Visuals & Core Data */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* Visual Media */}
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-12 flex flex-col items-center justify-center space-y-8 animate-soft">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-sm"><FiLayers /></span>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mission Media</h3>
                        </div>

                        <div className="relative group w-full">
                            {editing ? (
                                <label className="flex flex-col items-center justify-center w-full aspect-video border-4 border-dashed border-slate-50 rounded-[48px] cursor-pointer bg-slate-50 hover:bg-brand-red/5 hover:border-brand-red/20 transition-all duration-500">
                                    {formData.imagePreview ? (
                                        <div className="relative w-full h-full p-2">
                                            <img src={formData.imagePreview} className="w-full h-full object-cover rounded-[40px]" alt="preview" />
                                            <div className="absolute inset-0 bg-slate-900/40 rounded-[40px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white text-[10px] font-black uppercase tracking-widest text-center px-4">Update Visual</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4 text-center px-6">
                                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-200">
                                                <FiPlus className="text-3xl" />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Embed Visual Asset</p>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            ) : (
                                <div className="w-full aspect-video bg-slate-50 rounded-[48px] overflow-hidden border-8 border-white shadow-2xl relative group">
                                    {formData.imagePreview ? (
                                        <img src={formData.imagePreview} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={campaign.title} />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-200 gap-4">
                                            <FiCpu className="text-6xl" />
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-50">No Strategic Assets</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Intellectual Property / Details */}
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 space-y-8">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-brand-red text-white rounded-xl flex items-center justify-center text-sm"><FiFileText /></span>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mission Briefing</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className={labelCls}>Initiative Title</label>
                                {editing ? (
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputCls} />
                                ) : (
                                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{campaign.title}</h1>
                                )}
                            </div>

                            <div>
                                <label className={labelCls}>Strategic Description</label>
                                {editing ? (
                                    <textarea name="description" value={formData.description} onChange={handleChange} rows={6} className={inputCls} />
                                ) : (
                                    <p className="text-slate-600 leading-relaxed font-medium">{campaign.description || 'No strategic briefing available.'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Key Performance Indicators */}
                <div className="lg:col-span-4 space-y-8">
                    
                    {/* Financial & Timeline */}
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-8 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-white/5 border border-white/10 text-white rounded-xl flex items-center justify-center text-sm"><FiTarget /></span>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mission Parameters</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                <label className="text-[9px] font-black text-brand-red uppercase tracking-widest block mb-2">Target Goal</label>
                                {editing ? (
                                    <input type="number" name="goalAmount" value={formData.goalAmount} onChange={handleChange} className="w-full bg-slate-800 border-none text-white text-xl font-black focus:ring-1 focus:ring-brand-red rounded-xl p-3" />
                                ) : (
                                    <p className="text-2xl font-black tracking-tight text-white">LKR {Number(campaign.goalAmount || 0).toLocaleString()}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2"><FiCalendar className="inline mr-1" /> Deployment</label>
                                    {editing ? (
                                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full bg-slate-800 border-none text-white text-xs font-black rounded-lg p-2" />
                                    ) : (
                                        <p className="text-sm font-black text-slate-200">{campaign.startDate ? new Date(campaign.startDate).toLocaleDateString('en-GB') : 'PENDING'}</p>
                                    )}
                                </div>
                                <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2"><FiClock className="inline mr-1" /> Conclusion</label>
                                    {editing ? (
                                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full bg-slate-800 border-none text-white text-xs font-black rounded-lg p-2" />
                                    ) : (
                                        <p className="text-sm font-black text-slate-200">{campaign.endDate ? new Date(campaign.endDate).toLocaleDateString('en-GB') : 'PENDING'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2"><FiMapPin className="inline mr-1" /> Impact Geo</label>
                                {editing ? (
                                    <div className="space-y-2 mt-2">
                                        <input type="text" name="city" value={formData.location.city} onChange={handleChange} className="w-full bg-slate-800 text-white text-xs p-2 rounded-lg border-none" placeholder="City" />
                                        <input type="text" name="state" value={formData.location.state} onChange={handleChange} className="w-full bg-slate-800 text-white text-xs p-2 rounded-lg border-none" placeholder="State" />
                                        <input type="text" name="country" value={formData.location.country} onChange={handleChange} className="w-full bg-slate-800 text-white text-xs p-2 rounded-lg border-none" placeholder="Country" />
                                    </div>
                                ) : (
                                    <p className="text-sm font-black text-slate-200 uppercase tracking-widest">
                                        {[campaign.location?.city, campaign.location?.country].filter(Boolean).join(' • ') || 'UNDETERMINED'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Progress Monitor */}
                    {campaign.status === 'active' && <CampaignProgressSection campaignId={id} campaignStatus={campaign.status} />}
                    {campaign.status === 'completed' && <CampaignReportSection campaignId={id} />}
                </div>
            </div>

            <ConfirmationModal 
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Abort Strategic Mission?"
                message="This action will permanently remove this proposal from the mission registry. This cannot be undone."
                confirmText="Abort Mission"
                type="danger"
            />
        </div>
    );
}
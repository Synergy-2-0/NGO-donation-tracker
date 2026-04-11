import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdminCampaign } from '../../../context/AdminCampaignContext';
import { useAuth } from '../../../context/AuthContext';
import { CampaignDetailSkeleton } from '../../../components/Skeleton';
import CampaignProgressSection from './CampaignProgressSection';
import CampaignReportSection from './CampaignReportSection';
import CampaignFinancialsSection from './CampaignFinancialsSection';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiArrowLeft, FiEdit3, FiSave, FiX, FiTrash2, FiCheck,
    FiMapPin, FiCalendar, FiDollarSign, FiUsers, FiTarget,
    FiActivity, FiClock, FiCheckCircle, FiArchive,
    FiFileText, FiImage, FiGlobe, FiAlertTriangle,
    FiRepeat, FiTrendingUp, FiTag, FiBarChart2, FiInfo,
} from 'react-icons/fi';

// ─── Status config ───────────────────────────────────────────────────────────
const statusConfig = {
    draft: { label: 'Draft', cls: 'bg-slate-100 text-slate-600 border-slate-200', icon: <FiClock /> },
    active: { label: 'Active', cls: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: <FiActivity /> },
    completed: { label: 'Completed', cls: 'bg-indigo-50  text-indigo-600  border-indigo-200', icon: <FiCheckCircle /> },
    archived: { label: 'Archived', cls: 'bg-rose-50    text-rose-600    border-rose-200', icon: <FiArchive /> },
};

const SDG_COLORS = {
    1: '#E5243B', 2: '#DDA63A', 3: '#4C9F38', 4: '#C5192D', 5: '#FF3A21',
    6: '#26BDE2', 7: '#FCC30B', 8: '#A21942', 9: '#FD6925', 10: '#DD1367',
    11: '#FD9D24', 12: '#BF8B2E', 13: '#3F7E44', 14: '#0A97D9', 15: '#56C02B',
    16: '#00689D', 17: '#19486A',
};
const SDG_TITLES = {
    1: 'No Poverty', 2: 'Zero Hunger', 3: 'Good Health', 4: 'Quality Education', 5: 'Gender Equality',
    6: 'Clean Water', 7: 'Affordable Energy', 8: 'Decent Work', 9: 'Industry & Innovation', 10: 'Reduced Inequality',
    11: 'Sustainable Cities', 12: 'Responsible Consumption', 13: 'Climate Action', 14: 'Life Below Water',
    15: 'Life on Land', 16: 'Peace & Justice', 17: 'Partnerships',
};

function StatusBadge({ status }) {
    const cfg = statusConfig[status] ?? statusConfig.draft;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest border ${cfg.cls}`}>
            {cfg.icon} {cfg.label}
        </span>
    );
}

function KpiCard({ icon, label, value, sub, color = 'text-slate-900', iconBg = 'bg-slate-100', iconColor = 'text-slate-500' }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow group">
            <div className={`w-11 h-11 ${iconBg} ${iconColor} rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest truncate">{label}</p>
                <p className={`text-lg font-extrabold tracking-tight truncate ${color}`}>{value}</p>
                {sub && <p className="text-[10px] text-slate-400 font-medium mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

const inputCls = 'w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-tf-primary/10 focus:border-tf-primary/30 transition-all placeholder:text-slate-300';
const labelCls = 'block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2';

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
    const [activeTab, setActiveTab] = useState('overview');

    const [formData, setFormData] = useState({
        title: '', description: '', goalAmount: '',
        startDate: '', endDate: '',
        image: null, imagePreview: '',
        location: { city: '', state: '', country: '' },
    });

    const isLocked = campaign?.status === 'active' || campaign?.status === 'completed';

    useEffect(() => {
        setLoading(true);
        fetchCampaignById(id)
            .then(data => {
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
            .catch(() => setError('Failed to load campaign details.'))
            .finally(() => setLoading(false));
    }, [id, fetchCampaignById]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['city', 'state', 'country'].includes(name)) {
            setFormData(p => ({ ...p, location: { ...p.location, [name]: value } }));
        } else {
            setFormData(p => ({ ...p, [name]: value }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFormData(p => ({ ...p, image: file, imagePreview: URL.createObjectURL(file) }));
    };

    const handleSave = async () => {
        setSaving(true); setError(''); setSuccess('');
        try {
            const updated = await updateCampaign(id, formData);
            setCampaign(updated);
            setEditing(false);
            setSuccess('Campaign updated successfully.');
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Failed to save changes.');
        } finally { setSaving(false); }
    };

    const handlePublish = async () => {
        try {
            await publishCampaign(id);
            setCampaign(p => ({ ...p, status: 'active' }));
            setSuccess('Campaign is now live!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) { setError(err.message || 'Publish failed.'); }
    };

    const confirmDelete = async () => {
        setShowDeleteModal(false);
        try {
            await deleteCampaign(id);
            navigate('/admin/campaign-dashboard');
        } catch (err) { setError(err.message || 'Delete failed.'); }
    };

    if (loading) return <CampaignDetailSkeleton />;
    if (!campaign) return (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                <FiAlertTriangle className="text-2xl" />
            </div>
            <p className="text-slate-500 font-extrabold text-sm uppercase tracking-widest">Campaign Not Found</p>
            <Link to="/admin/campaign-dashboard" className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-tf-primary transition-all">
                Back to Registry
            </Link>
        </div>
    );

    const progress = campaign.goalAmount > 0 ? Math.min(100, (campaign.raisedAmount / campaign.goalAmount) * 100) : 0;
    const daysLeft = campaign.endDate ? Math.max(0, Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24))) : null;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <FiFileText className="text-xs" /> },
        { id: 'financials', label: 'Financial Breakdown', icon: <FiDollarSign className="text-xs" /> },
        ...(campaign.status === 'active' ? [{ id: 'progress', label: 'Progress & Milestones', icon: <FiBarChart2 className="text-xs" /> }] : []),
        ...(campaign.status === 'completed' ? [{ id: 'report', label: 'Impact Report', icon: <FiTrendingUp className="text-xs" /> }] : []),
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20 font-sans">

            {/* ── PAGE HEADER ─────────────────────────────────────────────── */}
            <div className="relative overflow-hidden bg-slate-900 rounded-[32px] shadow-2xl">
                {/* Background image */}
                {(formData.imagePreview || campaign.image) && (
                    <div className="absolute inset-0">
                        <img
                            src={formData.imagePreview || campaign.image}
                            className="w-full h-full object-cover opacity-20"
                            alt=""
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/60" />
                    </div>
                )}
                <div className="absolute top-0 right-0 w-96 h-96 bg-tf-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

                <div className="relative z-10 p-8 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        {/* Left: Title block */}
                        <div className="flex items-start gap-5">
                            <Link
                                to="/admin/campaign-dashboard"
                                className="mt-1 w-10 h-10 bg-white/10 border border-white/10 text-white rounded-xl flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all shrink-0 active:scale-95"
                            >
                                <FiArrowLeft className="stroke-[2.5]" />
                            </Link>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <StatusBadge status={campaign.status} />
                                    {campaign.allowPledges && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                            <FiRepeat className="text-[10px]" /> Pledges Enabled
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                                    {campaign.title}
                                </h1>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                                    ID: {id.slice(-12).toUpperCase()} · Created {new Date(campaign.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        {/* Right: Action buttons */}
                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            {campaign.status === 'draft' && !editing && user?.role === 'admin' && (
                                <>
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="px-4 py-2.5 bg-white/5 border border-rose-500/30 text-rose-400 rounded-xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all flex items-center gap-2 active:scale-95"
                                    >
                                        <FiTrash2 className="stroke-[2.5]" /> Delete
                                    </button>
                                    <button
                                        onClick={handlePublish}
                                        className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2 active:scale-95"
                                    >
                                        <FiCheck className="stroke-[2.5]" /> Publish Campaign
                                    </button>
                                </>
                            )}

                            {!editing ? (
                                <button
                                    disabled={isLocked}
                                    onClick={() => setEditing(true)}
                                    className={`px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all ${isLocked
                                        ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
                                        : 'bg-white text-slate-900 hover:bg-tf-primary hover:text-white shadow-lg active:scale-95'
                                        }`}
                                >
                                    <FiEdit3 className="stroke-[2.5]" />
                                    {isLocked ? 'Locked' : 'Edit Campaign'}
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setEditing(false)}
                                        className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 active:scale-95"
                                    >
                                        <FiX className="stroke-[2.5]" /> Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-5 py-2.5 bg-tf-primary text-white rounded-xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-tf-primary/30 flex items-center gap-2 active:scale-95 disabled:opacity-50"
                                    >
                                        <FiSave className="stroke-[2.5]" /> {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── STATUS ALERTS ────────────────────────────────────────────── */}
            <AnimatePresence>
                {isLocked && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-500 text-white rounded-xl flex items-center justify-center shrink-0">
                            <FiAlertTriangle className="text-sm" />
                        </div>
                        <p className="text-[11px] font-bold text-amber-800">
                            <strong>Editing locked.</strong> Active and completed campaigns cannot be modified to preserve audit integrity.
                        </p>
                    </motion.div>
                )}
                {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-rose-500 text-white rounded-xl flex items-center justify-center shrink-0">
                            <FiAlertTriangle className="text-sm" />
                        </div>
                        <p className="text-[11px] font-bold text-rose-700">{error}</p>
                        <button onClick={() => setError('')} className="ml-auto text-rose-400 hover:text-rose-600"><FiX /></button>
                    </motion.div>
                )}
                {success && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0">
                            <FiCheckCircle className="text-sm" />
                        </div>
                        <p className="text-[11px] font-bold text-emerald-700">{success}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── KPI STRIP ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard
                    icon={<FiDollarSign className="text-lg" />}
                    label="Goal Amount"
                    value={`LKR ${Number(campaign.goalAmount || 0).toLocaleString()}`}
                    iconBg="bg-tf-primary" iconColor="text-white"
                    color="text-tf-primary"
                />
                <KpiCard
                    icon={<FiTrendingUp className="text-lg" />}
                    label="Raised So Far"
                    value={`LKR ${Number(campaign.raisedAmount || 0).toLocaleString()}`}
                    sub={`${progress.toFixed(1)}% of goal`}
                    iconBg="bg-emerald-500" iconColor="text-white"
                    color="text-emerald-600"
                />
                <KpiCard
                    icon={<FiUsers className="text-lg" />}
                    label="Target Beneficiaries"
                    value={Number(campaign.targetBeneficiaries || 0).toLocaleString()}
                    iconBg="bg-indigo-500" iconColor="text-white"
                    color="text-indigo-600"
                />
                <KpiCard
                    icon={<FiCalendar className="text-lg" />}
                    label={daysLeft !== null && daysLeft >= 0 ? 'Days Remaining' : 'Campaign Ended'}
                    value={daysLeft !== null ? (daysLeft === 0 ? 'Ends Today' : `${daysLeft} days`) : '—'}
                    sub={campaign.endDate ? `Closes ${new Date(campaign.endDate).toLocaleDateString('en-GB')}` : ''}
                    iconBg="bg-amber-500" iconColor="text-white"
                    color={daysLeft !== null && daysLeft <= 7 ? 'text-rose-600' : 'text-slate-900'}
                />
            </div>

            {/* ── PROGRESS BAR ─────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-5">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Funding Progress</p>
                    <p className="text-[10px] font-extrabold text-tf-primary uppercase tracking-widest">{progress.toFixed(1)}%</p>
                </div>
                <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className={`h-full rounded-full ${progress >= 100 ? 'bg-emerald-500' : 'bg-tf-primary'}`}
                    />
                </div>
                <div className="flex justify-between mt-2">
                    <p className="text-[10px] text-slate-400 font-medium">LKR {Number(campaign.raisedAmount || 0).toLocaleString()} raised</p>
                    <p className="text-[10px] text-slate-400 font-medium">Goal: LKR {Number(campaign.goalAmount || 0).toLocaleString()}</p>
                </div>
            </div>

            {/* ── TABS ─────────────────────────────────────────────────────── */}
            {tabs.length > 1 && (
                <div className="flex gap-2 bg-slate-50/80 border border-slate-100 rounded-2xl p-1.5 w-fit">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === tab.id
                                ? 'bg-slate-900 text-white shadow-lg'
                                : 'text-slate-400 hover:text-slate-700'
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
            <AnimatePresence mode="wait">

                {/* ── OVERVIEW TAB ─────────────────────────────────────────── */}
                {activeTab === 'overview' && (
                    <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* LEFT: main content 2/3 */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Campaign Image */}
                            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-50 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                                        <FiImage className="text-sm" />
                                    </div>
                                    <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Campaign Cover Image</h3>
                                </div>
                                <div className="p-6">
                                    {editing ? (
                                        <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-slate-100 rounded-2xl cursor-pointer bg-slate-50 hover:border-tf-primary hover:bg-orange-50 transition-all group/up overflow-hidden">
                                            {formData.imagePreview ? (
                                                <div className="relative w-full h-full">
                                                    <img src={formData.imagePreview} className="w-full h-full object-cover" alt="preview" />
                                                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover/up:opacity-100 flex items-center justify-center transition-opacity">
                                                        <p className="text-white text-xs font-extrabold uppercase tracking-widest">Click to change</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-3 py-12">
                                                    <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 group-hover/up:text-tf-primary transition-colors">
                                                        <FiImage className="text-xl" />
                                                    </div>
                                                    <p className="text-sm font-extrabold text-slate-500 group-hover/up:text-tf-primary transition-colors">Upload Cover Image</p>
                                                    <p className="text-[10px] text-slate-300 uppercase tracking-widest">PNG, JPG up to 10MB</p>
                                                </div>
                                            )}
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                        </label>
                                    ) : (
                                        <div className="w-full aspect-video bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                            {formData.imagePreview ? (
                                                <img src={formData.imagePreview} className="w-full h-full object-cover" alt={campaign.title} />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-3">
                                                    <FiImage className="text-4xl" />
                                                    <p className="text-[10px] font-extrabold uppercase tracking-widest">No cover image</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Title & Description */}
                            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-50 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-tf-primary text-white rounded-xl flex items-center justify-center">
                                        <FiFileText className="text-sm" />
                                    </div>
                                    <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Campaign Details</h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <label className={labelCls}>Campaign Title</label>
                                        {editing ? (
                                            <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputCls} />
                                        ) : (
                                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{campaign.title}</h2>
                                        )}
                                    </div>
                                    <div>
                                        <label className={labelCls}>Description</label>
                                        {editing ? (
                                            <textarea name="description" value={formData.description} onChange={handleChange} rows={6} className={`${inputCls} resize-none leading-relaxed`} />
                                        ) : (
                                            <p className="text-slate-600 leading-relaxed font-medium text-sm">
                                                {campaign.description || <span className="text-slate-300 ">No description provided.</span>}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* SDG Alignment */}
                            {(campaign.sdgAlignment?.length > 0) && (
                                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-slate-50 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
                                            <FiGlobe className="text-sm" />
                                        </div>
                                        <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">UN SDG Alignment</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex flex-wrap gap-2">
                                            {campaign.sdgAlignment.map(sdgId => (
                                                <span
                                                    key={sdgId}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm"
                                                    style={{ backgroundColor: SDG_COLORS[sdgId] || '#64748b' }}
                                                >
                                                    <span className="font-extrabold opacity-70">{sdgId < 10 ? `0${sdgId}` : sdgId}</span>
                                                    {SDG_TITLES[sdgId]}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: sidebar 1/3 */}
                        <div className="space-y-6">

                            {/* Campaign Parameters */}
                            <div className="bg-slate-900 rounded-[2rem] shadow-2xl text-white overflow-hidden">
                                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
                                        <FiTarget className="text-sm text-white" />
                                    </div>
                                    <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Campaign Parameters</h3>
                                </div>
                                <div className="p-6 space-y-5">
                                    {/* Goal Amount */}
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                        <p className="text-[9px] font-extrabold text-tf-primary uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                            <FiDollarSign className="text-[10px]" /> Funding Goal
                                        </p>
                                        {editing ? (
                                            <input type="number" name="goalAmount" value={formData.goalAmount} onChange={handleChange}
                                                className="w-full bg-slate-800 text-white text-xl font-extrabold rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-tf-primary border-none" />
                                        ) : (
                                            <p className="text-2xl font-extrabold text-white tracking-tight">LKR {Number(campaign.goalAmount || 0).toLocaleString()}</p>
                                        )}
                                    </div>

                                    {/* Dates */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                            <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                <FiCalendar className="text-[10px]" /> Start
                                            </p>
                                            {editing ? (
                                                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange}
                                                    className="w-full bg-slate-800 text-white text-xs font-bold rounded-lg p-2 border-none focus:outline-none" />
                                            ) : (
                                                <p className="text-sm font-extrabold text-white">
                                                    {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                                </p>
                                            )}
                                        </div>
                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                            <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                <FiClock className="text-[10px]" /> End
                                            </p>
                                            {editing ? (
                                                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange}
                                                    className="w-full bg-slate-800 text-white text-xs font-bold rounded-lg p-2 border-none focus:outline-none" />
                                            ) : (
                                                <p className="text-sm font-extrabold text-white">
                                                    {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                        <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                            <FiMapPin className="text-[10px]" /> Location
                                        </p>
                                        {editing ? (
                                            <div className="space-y-2">
                                                {['city', 'state', 'country'].map(f => (
                                                    <input key={f} type="text" name={f} value={formData.location[f]}
                                                        onChange={handleChange} placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                                                        className="w-full bg-slate-800 text-white text-xs font-bold rounded-lg p-2 border-none focus:outline-none placeholder:text-slate-600" />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm font-bold text-white">
                                                {[campaign.location?.city, campaign.location?.state, campaign.location?.country].filter(Boolean).join(', ') || <span className="text-slate-600 text-xs ">Location not set</span>}
                                            </p>
                                        )}
                                    </div>

                                    {/* Beneficiaries */}
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                        <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                            <FiUsers className="text-[10px]" /> Target Beneficiaries
                                        </p>
                                        <p className="text-2xl font-extrabold text-indigo-400">
                                            {Number(campaign.targetBeneficiaries || 0).toLocaleString()}
                                            <span className="text-xs text-slate-500 font-bold ml-2">people</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Pledge Configuration */}
                            {campaign.allowPledges && campaign.pledgeConfig && (
                                <div className="bg-white rounded-[2rem] border border-emerald-100 shadow-sm overflow-hidden">
                                    <div className="p-5 border-b border-emerald-50 flex items-center gap-3 bg-emerald-50/50">
                                        <div className="w-8 h-8 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
                                            <FiRepeat className="text-sm" />
                                        </div>
                                        <div>
                                            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700">Pledge Configuration</h3>
                                            <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Recurring commitments enabled</p>
                                        </div>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            {(campaign.pledgeConfig.frequencies || ['monthly']).map(f => (
                                                <span key={f} className="px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-[10px] font-extrabold uppercase tracking-widest capitalize">
                                                    {f}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><FiDollarSign className="text-[9px]" /> Min Amount</p>
                                                <p className="font-extrabold text-slate-900 text-sm">LKR {Number(campaign.pledgeConfig.minimumAmount || 0).toLocaleString()}</p>
                                            </div>
                                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><FiClock className="text-[9px]" /> Max Duration</p>
                                                <p className="font-extrabold text-slate-900 text-sm">{campaign.pledgeConfig.maxDurationMonths || '∞'} months</p>
                                            </div>
                                        </div>
                                        {campaign.pledgeConfig.suggestedAmounts?.length > 0 && (
                                            <div>
                                                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1"><FiTag className="text-[9px]" /> Suggested Amounts</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {campaign.pledgeConfig.suggestedAmounts.map(a => (
                                                        <span key={a} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-extrabold text-slate-600">
                                                            LKR {a.toLocaleString()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {campaign.pledgeConfig.donorNote && (
                                            <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-50">
                                                <p className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-widest mb-1.5 flex items-center gap-1"><FiInfo className="text-[9px]" /> Message to Donors</p>
                                                <p className="text-xs text-slate-600 font-medium leading-relaxed">{campaign.pledgeConfig.donorNote}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Campaign Metadata */}
                            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 space-y-4">
                                <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Campaign Metadata</h3>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Campaign ID', value: id.slice(-12).toUpperCase() },
                                        { label: 'Created', value: new Date(campaign.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
                                        { label: 'Last Updated', value: new Date(campaign.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
                                        { label: 'SDG Goals', value: campaign.sdgAlignment?.length ? `${campaign.sdgAlignment.length} aligned` : 'None' },
                                    ].map(item => (
                                        <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{item.label}</p>
                                            <p className="text-[11px] font-bold text-slate-700">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── FINANCIALS TAB ────────────────────────────────────────── */}
                {activeTab === 'financials' && (
                    <motion.div key="financials" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <CampaignFinancialsSection campaignId={id} />
                    </motion.div>
                )}

                {/* ── PROGRESS TAB ─────────────────────────────────────────── */}
                {activeTab === 'progress' && (
                    <motion.div key="progress" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <CampaignProgressSection
                            campaignId={id}
                            campaignStatus={campaign.status}
                            onCampaignUpdated={async () => {
                                const refreshed = await fetchCampaignById(id);
                                setCampaign(refreshed);

                                if (refreshed.status === 'completed') {
                                    setActiveTab('report');
                                }
                            }}
                        />
                    </motion.div>
                )}

                {/* ── REPORT TAB ───────────────────────────────────────────── */}
                {activeTab === 'report' && (
                    <motion.div key="report" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <CampaignReportSection campaignId={id} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── DELETE MODAL ─────────────────────────────────────────────── */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Campaign?"
                message="This will permanently remove this campaign from the registry. This action cannot be undone."
                confirmText="Delete Campaign"
                type="danger"
            />
        </div>
    );
}

import { useState } from 'react';
import { useAdminCampaign } from '../../../context/AdminCampaignContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiCheckCircle, FiClock, FiTarget, FiMapPin, FiDollarSign,
    FiCalendar, FiImage, FiAlertCircle, FiArrowLeft, FiGlobe,
    FiUsers, FiFileText, FiPlus, FiRepeat, FiInfo, FiX,
    FiRefreshCw, FiRotateCcw, FiTrendingUp, FiSun, FiTag, FiEdit3
} from 'react-icons/fi';

const SDG_GOALS = [
    { id: 1,  title: 'No Poverty',               color: 'bg-[#E5243B]' },
    { id: 2,  title: 'Zero Hunger',              color: 'bg-[#DDA63A]' },
    { id: 3,  title: 'Good Health',              color: 'bg-[#4C9F38]' },
    { id: 4,  title: 'Quality Education',        color: 'bg-[#C5192D]' },
    { id: 5,  title: 'Gender Equality',          color: 'bg-[#FF3A21]' },
    { id: 6,  title: 'Clean Water',              color: 'bg-[#26BDE2]' },
    { id: 7,  title: 'Affordable Energy',        color: 'bg-[#FCC30B]' },
    { id: 8,  title: 'Decent Work',              color: 'bg-[#A21942]' },
    { id: 9,  title: 'Industry & Innovation',    color: 'bg-[#FD6925]' },
    { id: 10, title: 'Reduced Inequality',       color: 'bg-[#DD1367]' },
    { id: 11, title: 'Sustainable Cities',       color: 'bg-[#FD9D24]' },
    { id: 12, title: 'Responsible Consumption',  color: 'bg-[#BF8B2E]' },
    { id: 13, title: 'Climate Action',           color: 'bg-[#3F7E44]' },
    { id: 14, title: 'Life Below Water',         color: 'bg-[#0A97D9]' },
    { id: 15, title: 'Life on Land',             color: 'bg-[#56C02B]' },
    { id: 16, title: 'Peace & Justice',          color: 'bg-[#00689D]' },
    { id: 17, title: 'Partnerships',             color: 'bg-[#19486A]' },
];

const PLEDGE_FREQUENCIES = [
    {
        id: 'monthly',
        label: 'Monthly',
        Icon: FiRefreshCw,
        desc: 'Donor pays every month',
        detail: '12 payments / year',
        iconBg: 'bg-blue-500',
        activeBg: 'bg-blue-500',
        activeText: 'text-blue-50',
    },
    {
        id: 'quarterly',
        label: 'Quarterly',
        Icon: FiRotateCcw,
        desc: 'Donor pays every 3 months',
        detail: '4 payments / year',
        iconBg: 'bg-violet-500',
        activeBg: 'bg-violet-500',
        activeText: 'text-violet-50',
    },
    {
        id: 'yearly',
        label: 'Annually',
        Icon: FiSun,
        desc: 'Donor pays once per year',
        detail: '1 payment / year',
        iconBg: 'bg-amber-500',
        activeBg: 'bg-amber-500',
        activeText: 'text-amber-50',
    },
];

const SUGGESTED_AMOUNTS_DEFAULTS = [500, 1000, 2500, 5000];

function SectionCard({ icon, title, subtitle, accentColor = 'group-hover:bg-tf-primary', children }) {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden p-8 space-y-6 relative group hover:shadow-xl transition-all duration-700">
            <div className="flex items-center gap-5 relative z-10">
                <div className={`w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 text-slate-400 transition-all duration-500 group-hover:scale-110 group-hover:text-white shadow-sm ${accentColor}`}>
                    {icon}
                </div>
                <div>
                    <h3 className="text-base font-black text-slate-900 tracking-tight">{title}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{subtitle}</p>
                </div>
            </div>
            <div className="relative z-10">{children}</div>
        </div>
    );
}

function FieldLabel({ children, required, hint }) {
    return (
        <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.35em] leading-none">
                {children}
                {required && <span className="text-tf-primary text-[8px] font-black">REQUIRED</span>}
            </label>
            {hint && <span className="text-[10px] text-slate-400 font-medium">{hint}</span>}
        </div>
    );
}

const inputCls = "w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 placeholder:font-medium focus:outline-none focus:border-tf-primary focus:bg-white transition-all shadow-inner";
const dateInputCls = "w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-tf-primary focus:bg-white transition-all shadow-inner";

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
        location: { city: '', state: '', country: 'Sri Lanka', coordinates: { type: 'Point', coordinates: [0, 0] } },
        sdgAlignment: [],
        targetBeneficiaries: '',
        allowPledges: false,
        pledgeConfig: {
            frequencies: ['monthly'],
            minimumAmount: 500,
            suggestedAmounts: [500, 1000, 2500, 5000],
            maxDurationMonths: 12,
            donorNote: '',
        },
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [suggestedInput, setSuggestedInput] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFormData(prev => ({ ...prev, image: file, imagePreview: URL.createObjectURL(file) }));
    };

    const toggleSDG = (id) => {
        setFormData(prev => ({
            ...prev,
            sdgAlignment: prev.sdgAlignment.includes(id)
                ? prev.sdgAlignment.filter(x => x !== id)
                : [...prev.sdgAlignment, id]
        }));
    };

    const toggleFrequency = (freq) => {
        setFormData(prev => ({
            ...prev,
            pledgeConfig: {
                ...prev.pledgeConfig,
                frequencies: prev.pledgeConfig.frequencies.includes(freq)
                    ? prev.pledgeConfig.frequencies.filter(f => f !== freq)
                    : [...prev.pledgeConfig.frequencies, freq],
            },
        }));
    };

    const addSuggestedAmount = () => {
        const val = parseInt(suggestedInput);
        if (!val || val <= 0) return;
        if (formData.pledgeConfig.suggestedAmounts.includes(val)) return;
        setFormData(prev => ({
            ...prev,
            pledgeConfig: {
                ...prev.pledgeConfig,
                suggestedAmounts: [...prev.pledgeConfig.suggestedAmounts, val].sort((a, b) => a - b),
            },
        }));
        setSuggestedInput('');
    };

    const removeSuggestedAmount = (val) => {
        setFormData(prev => ({
            ...prev,
            pledgeConfig: {
                ...prev.pledgeConfig,
                suggestedAmounts: prev.pledgeConfig.suggestedAmounts.filter(a => a !== val),
            },
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['city', 'state', 'country'].includes(name)) {
            setFormData(prev => ({ ...prev, location: { ...prev.location, [name]: value } }));
        } else if (['lat', 'lng'].includes(name)) {
            setFormData(prev => ({
                ...prev,
                location: {
                    ...prev.location,
                    coordinates: [
                        name === 'lng' ? parseFloat(value) : prev.location.coordinates[0],
                        name === 'lat' ? parseFloat(value) : prev.location.coordinates[1],
                    ],
                },
            }));
        } else if (name.startsWith('pledge_')) {
            const key = name.replace('pledge_', '');
            setFormData(prev => ({
                ...prev,
                pledgeConfig: { ...prev.pledgeConfig, [key]: key === 'minimumAmount' || key === 'maxDurationMonths' ? parseInt(value) || 0 : value },
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
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
            setError(err?.response?.data?.message || 'Failed to create campaign. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const isReady = formData.title && formData.description && formData.goalAmount && formData.startDate && formData.endDate;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 font-sans">

            {/* Page Header */}
            <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-8 md:p-10 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-tf-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[.2em] text-slate-500 mb-2">Campaign Management</p>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            Create New <span className="text-tf-primary">Campaign</span>
                        </h2>
                        <p className="text-slate-400 text-sm mt-2 max-w-xl font-medium">
                            Define your campaign, set funding targets, and optionally open it for recurring pledge commitments from donors and partners.
                        </p>
                    </div>
                    <Link
                        to="/admin/campaign-dashboard"
                        className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all flex items-center gap-2 shrink-0 active:scale-95"
                    >
                        <FiArrowLeft className="stroke-[2.5]" /> Back to Registry
                    </Link>
                </div>
            </div>

            {/* Concept Banner: Donations vs Pledges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                        <FiDollarSign className="text-lg" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-blue-900 tracking-tight">One-Time Campaign Donation</h4>
                        <p className="text-[11px] text-blue-600 font-medium mt-1 leading-relaxed">
                            Donors give a single payment while the campaign is <strong>open</strong> (between start & end date). Once the campaign closes, no more one-time donations are accepted.
                        </p>
                    </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                        <FiRepeat className="text-lg" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-emerald-900 tracking-tight">Recurring Pledge Agreement</h4>
                        <p className="text-[11px] text-emerald-600 font-medium mt-1 leading-relaxed">
                            Donors commit to a <strong>recurring amount</strong> (monthly/quarterly/yearly). The pledge continues as a scheduled agreement — it is <strong>not</strong> limited by the campaign end date.
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`w-2.5 h-2.5 rounded-full transition-colors ${isReady ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-200'}`} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Status: <span className={isReady ? 'text-emerald-500' : 'text-slate-300'}>{isReady ? 'Ready to Submit' : 'Filling Required Fields'}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {formData.sdgAlignment.length > 0 && <span>{formData.sdgAlignment.length} SDGs</span>}
                    {formData.allowPledges && (
                        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl flex items-center gap-1.5">
                            <FiRepeat className="text-xs" /> Pledging On · {formData.pledgeConfig.frequencies.join(', ')}
                        </span>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">

                    {/* ── LEFT: Main Content ── */}
                    <div className="xl:col-span-2 space-y-8">

                        {/* Section 1: Campaign Identity */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                            <SectionCard icon={<FiFileText className="text-xl" />} title="Campaign Identity" subtitle="Title, description & core details">
                                <div className="space-y-5">
                                    <div>
                                        <FieldLabel required>Campaign Title</FieldLabel>
                                        <input type="text" name="title" value={formData.title} onChange={handleChange}
                                            placeholder="e.g. Clean Water for Northern Communities"
                                            className={inputCls} required />
                                    </div>
                                    <div>
                                        <FieldLabel required>Campaign Description</FieldLabel>
                                        <textarea name="description" value={formData.description} onChange={handleChange}
                                            placeholder="Describe the humanitarian objective, who it benefits, and how funds will be used..."
                                            className={`${inputCls} min-h-[160px] leading-relaxed resize-none`} required />
                                    </div>
                                </div>
                            </SectionCard>
                        </motion.div>

                        {/* Section 2: Location */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <SectionCard icon={<FiMapPin className="text-xl" />} title="Location & Coverage" subtitle="Where this campaign operates" accentColor="group-hover:bg-indigo-500">
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { name: 'city',    label: 'City', placeholder: 'e.g. Colombo' },
                                            { name: 'state',   label: 'Province / State', placeholder: 'e.g. Western Province' },
                                            { name: 'country', label: 'Country', placeholder: 'Sri Lanka' },
                                        ].map(f => (
                                            <div key={f.name}>
                                                <FieldLabel>{f.label}</FieldLabel>
                                                <input type="text" name={f.name} value={formData.location[f.name]}
                                                    onChange={handleChange} placeholder={f.placeholder} className={inputCls} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                                        <div>
                                            <FieldLabel>Longitude</FieldLabel>
                                            <input type="number" name="lng" step="0.0001"
                                                value={formData.location.coordinates[0] || ''}
                                                onChange={handleChange} placeholder="e.g. 79.8612" className={inputCls} />
                                        </div>
                                        <div>
                                            <FieldLabel>Latitude</FieldLabel>
                                            <input type="number" name="lat" step="0.0001"
                                                value={formData.location.coordinates[1] || ''}
                                                onChange={handleChange} placeholder="e.g. 6.9271" className={inputCls} />
                                        </div>
                                    </div>
                                </div>
                            </SectionCard>
                        </motion.div>

                        {/* Section 3: SDG Alignment */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                            <SectionCard icon={<FiGlobe className="text-xl" />} title="UN Sustainable Development Goals" subtitle="Select global impact indicators for this campaign" accentColor="group-hover:bg-emerald-500">
                                <div className="space-y-5">
                                    <div className="flex flex-wrap gap-2">
                                        {SDG_GOALS.map(sdg => (
                                            <button key={sdg.id} type="button" onClick={() => toggleSDG(sdg.id)}
                                                className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 flex items-center gap-1.5 ${
                                                    formData.sdgAlignment.includes(sdg.id)
                                                        ? `${sdg.color} text-white shadow-md`
                                                        : 'bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                                                }`}>
                                                {formData.sdgAlignment.includes(sdg.id) && <FiCheckCircle className="text-[9px]" />}
                                                {sdg.id < 10 ? `0${sdg.id}` : sdg.id}. {sdg.title}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="pt-4 border-t border-slate-50">
                                        <FieldLabel required>Target Beneficiaries</FieldLabel>
                                        <div className="relative">
                                            <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                            <input type="number" name="targetBeneficiaries" value={formData.targetBeneficiaries}
                                                onChange={handleChange} placeholder="How many people will this campaign help?"
                                                className={`${inputCls} pl-10`} required />
                                        </div>
                                    </div>
                                </div>
                            </SectionCard>
                        </motion.div>

                        {/* ── PLEDGE CONFIGURATION SECTION ── Full section on left for visibility */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <div className={`rounded-[2rem] border-2 transition-all duration-500 overflow-hidden ${formData.allowPledges ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 bg-white'}`}>

                                {/* Pledge Toggle Header */}
                                <div className="p-8">
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="flex items-start gap-5">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${formData.allowPledges ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-100 text-slate-400'}`}>
                                                <FiRepeat className="text-xl" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-black text-slate-900 tracking-tight">Enable Recurring Pledges</h3>
                                                <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed max-w-lg">
                                                    When enabled, donors and partners can sign a <strong>pledge agreement</strong> — a commitment to pay
                                                    a set amount on a regular schedule (monthly, quarterly, or yearly). This is <strong>separate from</strong> and
                                                    can <strong>outlast</strong> the campaign's open window.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Toggle Switch */}
                                        <button
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, allowPledges: !p.allowPledges }))}
                                            className={`w-16 h-9 rounded-full relative transition-all duration-500 shrink-0 ${formData.allowPledges ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-slate-200 border border-slate-200'}`}
                                        >
                                            <div className={`absolute top-1.5 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-500 flex items-center justify-center ${formData.allowPledges ? 'left-9' : 'left-1.5'}`}>
                                                {formData.allowPledges
                                                    ? <FiCheckCircle className="text-emerald-500 text-[11px]" />
                                                    : <FiClock className="text-slate-300 text-[11px]" />
                                                }
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Pledge Configuration — only visible when enabled */}
                                <AnimatePresence>
                                    {formData.allowPledges && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-8 pb-8 space-y-8 border-t border-emerald-100">

                                                {/* Payment Frequency */}
                                                <div className="pt-6">
                                                    <FieldLabel required>Allowed Payment Frequencies</FieldLabel>
                                                    <p className="text-[11px] text-slate-400 font-medium mb-4">
                                                        Select which schedules donors can choose from when setting up their pledge.
                                                    </p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        {PLEDGE_FREQUENCIES.map(freq => {
                                                            const active = formData.pledgeConfig.frequencies.includes(freq.id);
                                                            return (
                                                                <button
                                                                    key={freq.id}
                                                                    type="button"
                                                                    onClick={() => toggleFrequency(freq.id)}
                                                                    className={`px-5 py-4 rounded-2xl border-2 transition-all text-left flex items-center gap-4 active:scale-95 ${
                                                                        active
                                                                            ? 'border-emerald-400 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                                                            : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                                                                    }`}
                                                                >
                                                                    <span className="text-2xl">{freq.icon}</span>
                                                                    <div>
                                                                        <p className={`text-sm font-black tracking-tight ${active ? 'text-white' : 'text-slate-800'}`}>{freq.label}</p>
                                                                        <p className={`text-[10px] font-bold mt-0.5 ${active ? 'text-emerald-100' : 'text-slate-400'}`}>{freq.desc}</p>
                                                                    </div>
                                                                    {active && <FiCheckCircle className="ml-auto text-emerald-100 text-lg shrink-0" />}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Amounts */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div>
                                                        <FieldLabel required hint="per payment">Minimum Pledge Amount (LKR)</FieldLabel>
                                                        <div className="relative">
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">LKR</span>
                                                            <input
                                                                type="number"
                                                                name="pledge_minimumAmount"
                                                                value={formData.pledgeConfig.minimumAmount}
                                                                onChange={handleChange}
                                                                min="0"
                                                                placeholder="500"
                                                                className={`${inputCls} pl-14`}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <FieldLabel hint="max months">Max Pledge Duration (Months)</FieldLabel>
                                                        <input
                                                            type="number"
                                                            name="pledge_maxDurationMonths"
                                                            value={formData.pledgeConfig.maxDurationMonths}
                                                            onChange={handleChange}
                                                            min="1"
                                                            max="120"
                                                            placeholder="12"
                                                            className={inputCls}
                                                        />
                                                        <p className="text-[10px] text-slate-400 font-medium mt-1.5">
                                                            e.g. 12 = 1 year max · 0 = no limit
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Suggested Amounts */}
                                                <div>
                                                    <FieldLabel>Quick-Select Suggested Amounts (LKR)</FieldLabel>
                                                    <p className="text-[11px] text-slate-400 font-medium mb-3">
                                                        Donors will see these as quick-pick options when setting up their pledge. Leave empty to let them enter any amount.
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {formData.pledgeConfig.suggestedAmounts.map(amt => (
                                                            <span key={amt} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-[11px] font-black uppercase tracking-widest">
                                                                LKR {amt.toLocaleString()}
                                                                <button type="button" onClick={() => removeSuggestedAmount(amt)} className="text-emerald-400 hover:text-red-500 transition-colors">
                                                                    <FiX className="text-xs" />
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <input
                                                            type="number"
                                                            value={suggestedInput}
                                                            onChange={e => setSuggestedInput(e.target.value)}
                                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSuggestedAmount())}
                                                            placeholder="Type an amount and press Add"
                                                            className={`${inputCls} flex-1`}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={addSuggestedAmount}
                                                            className="px-5 py-3 bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2 shrink-0 active:scale-95"
                                                        >
                                                            <FiPlus className="stroke-[2.5]" /> Add
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Donor Note */}
                                                <div>
                                                    <FieldLabel>Message to Donors About This Pledge</FieldLabel>
                                                    <textarea
                                                        name="pledge_donorNote"
                                                        value={formData.pledgeConfig.donorNote}
                                                        onChange={handleChange}
                                                        placeholder="e.g. Your monthly pledge directly funds school meals for 50 children. You may cancel anytime."
                                                        className={`${inputCls} min-h-[90px] resize-none leading-relaxed`}
                                                        maxLength={500}
                                                    />
                                                    <p className="text-[10px] text-slate-300 font-bold mt-1 text-right">
                                                        {formData.pledgeConfig.donorNote.length} / 500
                                                    </p>
                                                </div>

                                                {/* Summary Box */}
                                                <div className="bg-white border border-emerald-100 rounded-2xl p-5">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <FiInfo className="text-emerald-500 text-sm" />
                                                        <p className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">Pledge Preview</p>
                                                    </div>
                                                    <p className="text-[12px] text-slate-600 font-medium leading-relaxed">
                                                        Donors can pledge from <strong>LKR {(formData.pledgeConfig.minimumAmount || 0).toLocaleString()}</strong>{' '}
                                                        {formData.pledgeConfig.frequencies.length > 0 ? (
                                                            <><strong>{formData.pledgeConfig.frequencies.join(', ')}</strong></>
                                                        ) : 'on a selected frequency'},{' '}
                                                        for up to <strong>{formData.pledgeConfig.maxDurationMonths || '∞'} months</strong>.
                                                        This pledge remains active <strong>even after the campaign closes</strong>.
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>

                    {/* ── RIGHT: Sidebar ── */}
                    <div className="space-y-6">

                        {/* Campaign Image */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <SectionCard icon={<FiImage className="text-xl" />} title="Campaign Cover" subtitle="Visual identity">
                                <label className="relative flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-slate-100 rounded-2xl cursor-pointer bg-slate-50 hover:bg-white hover:border-tf-primary transition-all duration-500 group/upload overflow-hidden">
                                    {formData.imagePreview ? (
                                        <div className="relative w-full h-full">
                                            <img src={formData.imagePreview} alt="preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center flex-col gap-3">
                                                <div className="w-12 h-12 bg-tf-primary text-white rounded-2xl flex items-center justify-center shadow-xl">
                                                    <FiImage className="text-lg" />
                                                </div>
                                                <p className="text-white text-[11px] font-black uppercase tracking-widest">Change Image</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4 py-8 px-6 text-center">
                                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover/upload:text-tf-primary group-hover/upload:border-tf-primary/20 group-hover/upload:scale-110 transition-all duration-500">
                                                <FiImage className="text-2xl" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-700 group-hover/upload:text-tf-primary transition-colors">Upload Cover Image</p>
                                                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">PNG, JPG up to 10MB</p>
                                            </div>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            </SectionCard>
                        </motion.div>

                        {/* Funding Goal */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                            <SectionCard icon={<FiDollarSign className="text-xl" />} title="Funding Goal" subtitle="Target amount to raise (LKR)">
                                <div>
                                    <FieldLabel required>Goal Amount</FieldLabel>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">LKR</span>
                                        <input type="number" name="goalAmount" value={formData.goalAmount} onChange={handleChange}
                                            placeholder="0" className={`${inputCls} pl-14 text-lg font-black text-tf-primary tabular-nums`} required />
                                    </div>
                                    {formData.goalAmount && (
                                        <p className="text-[10px] text-slate-400 font-bold mt-2 ml-1">
                                            = LKR {Number(formData.goalAmount).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </SectionCard>
                        </motion.div>

                        {/* Campaign Dates */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <SectionCard icon={<FiCalendar className="text-xl" />} title="Campaign Duration" subtitle="Open window for donations" accentColor="group-hover:bg-amber-500">
                                <div className="space-y-4">
                                    <div>
                                        <FieldLabel required>Start Date</FieldLabel>
                                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className={dateInputCls} required />
                                    </div>
                                    <div>
                                        <FieldLabel required>End Date</FieldLabel>
                                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} min={formData.startDate} className={dateInputCls} required />
                                    </div>
                                    {formData.startDate && formData.endDate && (
                                        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                                            <p className="text-[11px] font-black text-amber-700 uppercase tracking-widest">
                                                {Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))} day campaign window
                                            </p>
                                            <p className="text-[10px] text-amber-600 font-medium mt-0.5">
                                                One-time donations accepted only within this window
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </SectionCard>
                        </motion.div>

                        {/* Submit */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 space-y-4">
                                <button
                                    type="submit"
                                    disabled={loading || !isReady}
                                    className="w-full px-8 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-tf-primary transition-all duration-500 shadow-xl disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Creating Campaign...
                                        </>
                                    ) : (
                                        <>
                                            <FiPlus className="text-sm stroke-[3]" />
                                            Launch Campaign
                                        </>
                                    )}
                                </button>
                                <Link to="/admin/campaign-dashboard"
                                    className="w-full px-8 py-4 bg-slate-50 border border-slate-100 text-slate-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center active:scale-95">
                                    Cancel
                                </Link>
                                {!isReady && (
                                    <p className="text-[10px] font-bold text-slate-300 text-center uppercase tracking-widest">
                                        Fill all required fields to submit
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Error Alert */}
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
                            className="mt-8 flex items-center gap-4 px-6 py-4 bg-rose-50 border border-rose-100 rounded-2xl shadow-sm">
                            <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center shrink-0">
                                <FiAlertCircle className="text-lg" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Error</p>
                                <p className="text-sm font-bold text-rose-800 mt-0.5">{error}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </div>
    );
}
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdminCampaign } from '../../../context/AdminCampaignContext';
import LoadingSpinner from '../../../components/LoadingSpinner';
import CampaignProgressSection from './CampaignProgressSection';
import CampaignReportSection from './CampaignReportSection';
import { motion, AnimatePresence } from 'framer-motion';


const statusConfig = {
    draft: { label: 'CONCEPT_DRAFT', className: 'bg-slate-50 text-slate-400 border-slate-100 shadow-sm', dot: 'bg-slate-300' },
    active: { label: 'MISSION_ACTIVE', className: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.15)]', dot: 'bg-emerald-500 animate-pulse' },
    completed: { label: 'MISSION_SUCCESS', className: 'bg-tf-accent/10 text-tf-accent border-tf-accent/20', dot: 'bg-tf-accent' },
    archived: { label: 'MISSION_ARCHIVED', className: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400' },
};

function StatusBadge({ status }) {
    const cfg = statusConfig[status] ?? statusConfig.draft;
    return (
        <span className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-700 italic ${cfg.className}`}>
            <span className={`w-2 h-2 rounded-full ${cfg.dot} shadow-[0_0_8px_currentColor]`} />
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
            .catch(() => setError('Failed to load mission protocols.'))
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
            setSuccess('Mission Registry updated successfully.');
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Failed to synchronize registry changes.');
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
            setSuccess('Mission Node successfully deployed.');
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Deployment authorization failure.');
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!campaign && !loading) return (
        <div className="min-h-screen bg-slate-50 p-24 flex flex-col items-center justify-center gap-8 text-center italic">
            <div className="w-24 h-24 bg-white rounded-[2.5rem] border border-slate-100 shadow-inner flex items-center justify-center text-slate-100 font-black text-4xl group hover:rotate-12 transition-transform duration-700">?</div>
            <div className="space-y-2">
               <p className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Mission protocol not detected.</p>
               <p className="text-[11px] text-slate-300 font-black uppercase tracking-[0.5em] italic leading-none">Synchronization failure within the registry Hub</p>
            </div>
            <Link to="/admin/campaign-dashboard" className="px-12 py-5 bg-slate-950 text-white rounded-full text-[11px] font-black uppercase tracking-[0.5em] hover:bg-tf-primary transition-all shadow-3xl">← Return to Strategic HUB</Link>
        </div>
    );

    const locationLine = [campaign.location?.city, campaign.location?.state, campaign.location?.country].filter(Boolean).join(', ');

    return (
        <div className="space-y-16 pb-32 font-sans selection:bg-tf-primary selection:text-white max-w-7xl mx-auto pt-8">

            {/* Cinematic Tactical Oversight Header */}
            <section className="bg-slate-950 rounded-[4.5rem] p-24 text-white relative overflow-hidden shadow-4xl border border-white/5 group">
                <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-tf-primary/10 blur-[200px] -mr-60 -mt-60 animate-pulse pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-tf-accent/5 blur-[150px] -ml-40 -mb-40 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-16">
                   <div className="space-y-12 flex-1">
                      <div className="space-y-8">
                         <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-wrap items-center gap-6">
                            <Link to="/admin/campaign-dashboard" className="w-16 h-16 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center hover:bg-tf-primary hover:text-white transition-all shadow-2xl group/back">
                               <svg className="w-6 h-6 group-hover/back:-translate-x-3 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                            </Link>
                            <div className="space-y-2">
                               <div className="flex items-center gap-4">
                                  <div className="w-3 h-3 rounded-full bg-tf-primary shadow-[0_0_15px_rgba(255,138,0,1)] animate-bounce" />
                                  <p className="text-[12px] font-black text-white/30 uppercase tracking-[0.7em] leading-none italic underline decoration-tf-primary/30 decoration-4 underline-offset-[14px]">Mission_Registry_Node: {id?.slice(-12).toUpperCase()}</p>
                               </div>
                            </div>
                         </motion.div>
                         <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.8] lowercase italic text-stroke-white opacity-90 transition-opacity hover:opacity-100 flex flex-col">
                            Tactical <span className="text-tf-primary not-italic font-black text-stroke-none">Oversight Hub.</span>
                         </motion.h2>
                      </div>
                      <div className="flex flex-wrap items-center gap-10">
                         <StatusBadge status={campaign.status} />
                         <span className="w-px h-10 bg-white/10 rotate-12 hidden md:block" />
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic leading-none">Operational Descriptor Registry</p>
                            <p className="text-xl md:text-2xl text-white/40 font-black tracking-tight italic truncate max-w-lg lowercase">{campaign.title}</p>
                         </div>
                      </div>
                   </div>
                   
                   <div className="flex flex-wrap gap-8 shrink-0 relative z-10">
                        {campaign.status === 'draft' && !editing && (
                            <motion.button
                                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                onClick={handlePublish}
                                className="px-16 py-8 bg-emerald-500 text-white text-[13px] font-black uppercase tracking-[0.5em] rounded-full hover:bg-white hover:text-emerald-500 transition-all duration-700 shadow-3xl active:scale-95 italic group/deploy"
                            >
                                Deploy Operational Node <span className="group-hover/deploy:translate-x-4 transition-transform inline-block ml-4">→</span>
                            </motion.button>
                        )}
                        {!editing ? (
                            <button
                                disabled={isLocked}
                                onClick={() => setEditing(true)}
                                className={`px-16 py-8 text-[13px] font-black uppercase tracking-[0.5em] rounded-full transition-all duration-1000 shadow-3xl active:scale-95 italic
                                ${isLocked ? "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed" : "bg-tf-primary text-white hover:bg-white hover:text-tf-primary"}`}
                            >
                                {isLocked ? "Registry Protocol_Locked" : "Authorize Parameter Update"}
                            </button>
                        ) : (
                            <div className="flex flex-wrap items-center gap-6">
                                <button
                                    onClick={handleCancel}
                                    className="px-12 py-7 bg-white/5 border border-white/10 text-white text-[12px] font-black uppercase tracking-[0.5em] rounded-full hover:bg-white/10 transition-all duration-700 active:scale-95 italic"
                                >
                                    Abort Changes
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-16 py-7 bg-tf-primary text-white text-[12px] font-black uppercase tracking-[0.5em] rounded-full hover:bg-white hover:text-tf-primary transition-all duration-700 shadow-3xl active:scale-90 italic flex items-center gap-4"
                                >
                                    {saving ? (
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                                    ) : null}
                                    {saving ? "Synchronizing Hub..." : "Execute Registry Update"}
                                </button>
                            </div>
                        )}
                   </div>
                </div>
            </section>

            <AnimatePresence>
                {isLocked && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-6 px-12 py-6 bg-tf-primary/5 border border-tf-primary/10 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-tf-primary/5 blur-[50px] -mr-16 -mt-16 pointer-events-none" />
                        <div className="w-10 h-10 bg-tf-primary/10 rounded-full flex items-center justify-center text-tf-primary animate-pulse group-hover:rotate-12 transition-transform duration-700"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>
                        <p className="text-[11px] text-tf-primary font-black uppercase tracking-[0.5em] italic">System Registry Secured: Operational modifications restricted to maintain mission state integrity Hub.</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Exception Notification Hub */}
            <AnimatePresence>
                {(error || success) && (
                    <div className="space-y-6 px-8">
                        {error && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-8 px-12 py-8 bg-rose-50 border border-rose-100 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[50px] -mr-16 -mt-16 pointer-events-none" />
                                <div className="w-14 h-14 bg-rose-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg animate-bounce">
                                   <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div className="space-y-2">
                                   <p className="text-[12px] font-black text-rose-400 uppercase tracking-[0.6em] leading-none italic">Security_SynchronizationFailureHUB</p>
                                   <p className="text-xl text-rose-950 font-black tracking-tight italic">{error}</p>
                                </div>
                            </motion.div>
                        )}
                        {success && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-8 px-12 py-8 bg-emerald-50 border border-emerald-100 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] -mr-16 -mt-16 pointer-events-none" />
                                <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg group hover:rotate-12 transition-transform duration-700">
                                   <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div className="space-y-2">
                                   <p className="text-[12px] font-black text-emerald-400 uppercase tracking-[0.6em] leading-none italic">Registry_OperationalSync_Success</p>
                                   <p className="text-xl text-emerald-950 font-black tracking-tight italic">{success}</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 px-8 items-start">
                <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="xl:col-span-2 space-y-12">
                     {/* Primary Mission Artifact Hub */}
                    <div className="bg-white rounded-[4.5rem] border border-slate-100 shadow-sm overflow-hidden p-16 space-y-16 relative group/artifacts hover:shadow-4xl transition-all duration-1000">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-tf-primary/3 blur-[120px] opacity-0 group-hover/artifacts:opacity-100 transition-opacity pointer-events-none" />
                        
                        <div className="flex items-center gap-10 relative z-10">
                            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-center shrink-0 group-hover/artifacts:rotate-12 group-hover/artifacts:bg-slate-950 group-hover/artifacts:text-white transition-all duration-1000 shadow-inner italic font-black text-slate-100 text-3xl">
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <div className="space-y-3">
                               <h3 className="text-4xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">Primary Registry Artifacts</h3>
                               <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.7em] leading-none italic">Verified Humanitarian Mission Persona Hub</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                            <div className="space-y-8">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] mb-2 italic leading-none ml-6 group-hover/artifacts:text-tf-primary transition-colors">Mission Visualization Node</p>
                                {editing ? (
                                    <label className="relative flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-slate-100 rounded-[3rem] cursor-pointer bg-slate-50/50 hover:bg-white hover:border-tf-primary transition-all duration-1000 group/upload overflow-hidden shadow-inner">
                                        {formData.imagePreview ? (
                                            <div className="relative w-full h-full">
                                                <img src={formData.imagePreview} alt="preview" className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover/upload:scale-110" />
                                                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center flex-col gap-4">
                                                    <div className="w-16 h-16 bg-tf-primary text-white rounded-full flex items-center justify-center shadow-3xl animate-pulse">
                                                       <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                    </div>
                                                    <p className="text-white text-[11px] font-black uppercase tracking-[0.6em] italic">Authorize New Visual</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-20 text-center space-y-6">
                                               <div className="w-20 h-20 bg-white rounded-3xl mx-auto flex items-center justify-center shadow-sm">
                                                  <svg className="w-8 h-8 text-slate-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                               </div>
                                               <p className="text-[11px] text-slate-300 font-black uppercase tracking-widest italic">DEPLOY_MISSION_IMAGE</p>
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                ) : (
                                    <div className="group/frame relative w-full aspect-video rounded-[3.5rem] overflow-hidden shadow-4xl border border-white/5 ring-1 ring-slate-100 hover:ring-tf-primary/30 transition-all duration-1000">
                                        <div className="absolute inset-0 bg-tf-primary/5 opacity-0 group-hover/frame:opacity-100 transition-opacity z-10" />
                                        <img src={formData.imagePreview} className="w-full h-full object-cover transition-transform duration-[4s] group-hover/frame:scale-110" alt="mission asset" />
                                        <div className="absolute inset-x-0 bottom-0 py-8 px-10 bg-gradient-to-t from-slate-950/60 to-transparent z-20">
                                            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.6em] italic">Operational Field Evidence HUB</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-12 flex flex-col justify-center">
                                <div className="space-y-4">
                                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] mb-2 italic leading-none ml-4 group-hover/artifacts:text-tf-primary transition-colors">Authorization Unified Title</label>
                                     {editing ? (
                                         <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-10 py-7 text-xl font-black text-slate-950 placeholder-slate-200 focus:outline-none focus:border-tf-primary transition-all shadow-inner italic tracking-tighter" required />
                                     ) : (
                                         <h4 className="text-4xl font-black text-slate-950 tracking-tighter italic leading-[0.9] lowercase text-stroke-slate transition-all hover:text-tf-primary">{campaign.title}</h4>
                                     )}
                                </div>
                                
                                <div className="space-y-4">
                                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] mb-2 italic leading-none ml-4 group-hover/artifacts:text-tf-primary transition-colors">Strategic Mission Protocol Hub</label>
                                     {editing ? (
                                         <textarea name="description" value={formData.description} onChange={handleChange} rows={10} className="w-full bg-slate-50 border border-slate-100 rounded-[2.5rem] px-10 py-10 text-lg font-bold text-slate-950 placeholder-slate-200 focus:outline-none focus:border-tf-primary transition-all shadow-inner leading-relaxed italic tracking-tight" />
                                     ) : (
                                         <p className="text-lg text-slate-500 font-medium leading-relaxed italic pr-6 border-l-4 border-slate-50 hover:border-tf-primary transition-colors pl-8">{campaign.description || 'Institutional protocol analysis pending field synchronization Hub.'}</p>
                                     )}
                                </div>
                            </div>
                        </div>
                    </div>

                         {/* Geospatial Synchronization Matrix */}
                        <div className="bg-white rounded-[4.5rem] border border-slate-100 shadow-sm overflow-hidden p-16 space-y-16 relative group/geo hover:shadow-4xl transition-all duration-1000">
                             <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/3 blur-[120px] opacity-0 group-hover/geo:opacity-100 transition-opacity pointer-events-none" />
                             <div className="flex items-center gap-10 relative z-10">
                                <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-center shrink-0 group-hover/geo:rotate-12 group-hover/geo:bg-slate-950 group-hover/geo:text-white transition-all duration-1000 shadow-inner">
                                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <div className="space-y-3">
                                   <h3 className="text-4xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">Geospatial Landing Hub</h3>
                                   <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.7em] leading-none italic">Verified Operational Coordinates Registry</p>
                                </div>
                             </div>

                             <div className="relative z-10">
                                {editing ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                        {[
                                            { n: 'city', l: 'Strategic Node (City)', p: 'e.g. COLOMBO_01' },
                                            { n: 'state', l: 'Authorized Zone (State)', p: 'e.g. WESTERN_PROV' },
                                            { n: 'country', l: 'Verified Nation (Country)', p: 'e.g. SRI_LANKA' }
                                        ].map(loc => (
                                            <div key={loc.n} className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] ml-6 italic">{loc.l}</label>
                                                <input type="text" name={loc.n} value={formData.location[loc.n]} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-10 py-6 text-sm font-black text-slate-950 focus:outline-none focus:border-indigo-400 transition-all shadow-inner italic" placeholder={loc.p} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col md:flex-row items-center gap-12 p-12 bg-slate-50/50 rounded-[4rem] border border-slate-50 group-hover/geo:bg-indigo-50/30 transition-all duration-1000 shadow-inner group/data">
                                        <div className="w-16 h-16 rounded-[2rem] bg-white border border-slate-100 flex items-center justify-center text-indigo-500 shadow-xl group-hover/data:rotate-12 transition-transform duration-700 shrink-0"><svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg></div>
                                        <div className="space-y-3">
                                           <div className="flex items-center gap-4">
                                              <span className="w-4 h-px bg-indigo-200" />
                                              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.6em] italic">Authorized Field Location</p>
                                           </div>
                                           <p className="text-3xl md:text-5xl font-black text-slate-950 tracking-tighter italic lowercase text-stroke-indigo opacity-90">{locationLine || <span className="opacity-20">Awaiting Geospatial Sync Hub</span>}</p>
                                        </div>
                                    </div>
                                )}
                             </div>
                        </div>
                </motion.div>

                {/* Secondary Tactical Registry Sidebar */}
                <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="space-y-12">
                     
                     {/* Capital Flow Configuration HUB */}
                     <div className="bg-white rounded-[4.5rem] border border-slate-100 shadow-sm p-16 space-y-16 group/money hover:shadow-4xl transition-all duration-1000 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-tf-primary/5 blur-[80px] opacity-0 group-hover/money:opacity-100 transition-opacity pointer-events-none" />
                        <div className="flex items-center gap-10">
                           <div className="w-16 h-16 bg-white border border-slate-100 rounded-3xl flex items-center justify-center shrink-0 group-hover/money:scale-125 group-hover/money:bg-slate-950 group-hover/money:text-white transition-all duration-1000 shadow-xl group-hover/money:rotate-[-12deg]">
                               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2a9 9 0 1118 0" /></svg>
                           </div>
                           <div className="space-y-2">
                              <h3 className="text-2xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">Capital Threshold</h3>
                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.6em] leading-none italic">Asset Configuration Matrix</p>
                           </div>
                        </div>
                        
                        <div className="space-y-6">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] italic ml-8 group-hover/money:text-tf-primary transition-colors">Target Stabilization Capital (LKR)</label>
                            {editing ? (
                                <div className="relative group/field">
                                    <input type="number" name="goalAmount" value={formData.goalAmount} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-[2.5rem] px-12 py-8 text-3xl font-black text-tf-primary tabular-nums focus:outline-none focus:border-tf-primary focus:bg-white transition-all shadow-inner tracking-tighter italic" />
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-200 font-black text-2xl group-hover/field:text-tf-primary/20 transition-colors italic">¤</span>
                                </div>
                            ) : (
                                <div className="bg-slate-950 rounded-[3.5rem] p-12 shadow-4xl group-hover/money:scale-105 transition-all duration-1000 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-tf-primary/10 opacity-30 animate-pulse pointer-events-none" />
                                    <div className="relative z-10 space-y-4">
                                       <p className="text-4xl md:text-5xl font-black text-tf-primary tracking-tighter italic tabular-nums leading-none">LKR {Number(campaign.goalAmount || 0).toLocaleString()}</p>
                                       <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.5em] italic">Authorized Benchmark Registry</p>
                                    </div>
                                </div>
                            )}
                        </div>
                     </div>

                     {/* Temporal Operations Window HUB */}
                     <div className="bg-white rounded-[4.5rem] border border-slate-100 shadow-sm p-16 space-y-16 group/time hover:shadow-4xl transition-all duration-1000 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-48 h-48 bg-tf-accent/5 blur-[80px] opacity-0 group-hover/time:opacity-100 transition-opacity pointer-events-none" />
                        <div className="flex items-center gap-10">
                           <div className="w-16 h-16 bg-white border border-slate-100 rounded-3xl flex items-center justify-center shrink-0 group-hover/time:scale-125 group-hover/time:bg-slate-950 group-hover/time:text-white transition-all duration-1000 shadow-xl group-hover/time:rotate-[12deg]">
                               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
                           </div>
                           <div className="space-y-2">
                              <h3 className="text-2xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">Operational Cycle</h3>
                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.6em] leading-none italic">Mission Time Parameters HUB</p>
                           </div>
                        </div>

                        <div className="space-y-10">
                            {[
                                { l: 'INITIALIZE_MISSION_NODE', n: 'startDate', v: campaign.startDate, c: 'tf-primary' },
                                { l: 'TERMINATE_MISSION_PROTOCOL', n: 'endDate', v: campaign.endDate, c: 'tf-accent' }
                            ].map(date => (
                                <div key={date.n} className="space-y-4 group/dateitem">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-8 italic group-hover/dateitem:text-slate-950 transition-colors">{date.l}</label>
                                    {editing ? (
                                        <input type="date" name={date.n} value={formData[date.n]} onChange={handleChange} className={`w-full bg-slate-50 border border-slate-100 rounded-full px-12 py-7 text-[12px] font-black text-slate-950 focus:outline-none focus:border-${date.c} transition-all shadow-inner uppercase tracking-[0.4em] italic`} />
                                    ) : (
                                        <div className="bg-slate-50/50 rounded-full py-8 px-12 border border-slate-50 group-hover/dateitem:bg-white group-hover/dateitem:shadow-2xl transition-all duration-700 flex items-center justify-between">
                                           <p className="text-xl font-black text-slate-950 tracking-tighter italic uppercase">{date.v ? new Date(date.v).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'PROTOCOL_NULL_DATE'}</p>
                                           <div className={`w-3 h-3 rounded-full bg-${date.c} shadow-[0_0_12px_currentColor] animate-pulse`} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                     </div>
                </motion.div>
            </div>

            {/* Operational Oversight Sub-Systems */}
            <div className="px-8 space-y-16">
                {campaign.status === 'active' && (
                    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
                        <CampaignProgressSection campaignId={id} campaignStatus={campaign.status} />
                    </motion.div>
                )}

                {campaign.status === 'completed' && (
                    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
                        <CampaignReportSection campaignId={id} />
                    </motion.div>
                )}
            </div>

        </div>
    );
}
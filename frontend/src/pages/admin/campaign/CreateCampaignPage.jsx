import { useState } from 'react';
import { useAdminCampaign } from '../../../context/AdminCampaignContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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

    return (
        <div className="space-y-16 pb-32 font-sans selection:bg-tf-primary selection:text-white max-w-7xl mx-auto pt-8">
            
            {/* Cinematic Initialization Header */}
            <section className="bg-slate-950 rounded-[4rem] p-20 text-white relative overflow-hidden shadow-3xl border border-white/5 group">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-tf-primary/10 blur-[180px] -mr-60 -mt-60 animate-pulse pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-tf-accent/5 blur-[120px] -ml-40 -mb-40 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-16">
                   <div className="space-y-10 flex-1">
                      <div className="space-y-6">
                         <motion.div initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-5">
                            <div className="w-3 h-3 rounded-full bg-tf-primary shadow-[0_0_15px_rgba(255,138,0,1)] animate-bounce" />
                            <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.7em] leading-none italic underline decoration-tf-primary/30 decoration-4 underline-offset-[12px]">Deployment Authorization Protocol 01</p>
                         </motion.div>
                         <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-8xl font-black tracking-tighter leading-none lowercase italic text-stroke-white opacity-90 transition-opacity hover:opacity-100">
                            Initialize <span className="text-tf-primary not-italic font-black">Mission Node.</span>
                         </motion.h2>
                      </div>
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-lg md:text-xl text-white/40 max-w-2xl leading-relaxed italic font-medium">
                         Define the strategic parameters for a new humanitarian mobilization and verified community impact registry entry Hub.
                      </motion.p>
                   </div>
                   
                   <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
                      <Link
                          to="/admin/campaign-dashboard"
                          className="px-14 py-7 bg-white/5 backdrop-blur-2xl border border-white/10 text-white text-[12px] font-black uppercase tracking-[0.5em] rounded-full hover:bg-white hover:text-slate-950 transition-all duration-700 active:scale-95 flex items-center gap-5 group/btn italic"
                      >
                          <svg className="w-5 h-5 group-hover/btn:-translate-x-3 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                          Return to Registry Hub
                      </Link>
                   </motion.div>
                </div>
            </section>

            <form onSubmit={handleSubmit} className="space-y-12 px-8">

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
                    {/* Primary Mission Identity Core */}
                    <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="xl:col-span-2 space-y-12">
                        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden p-16 space-y-12 relative group/section hover:shadow-3xl transition-all duration-1000">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-tf-primary/5 blur-[80px] opacity-0 group-hover/section:opacity-100 transition-opacity pointer-events-none" />
                            
                            <div className="flex items-center gap-8 relative z-10">
                                <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-center shrink-0 group-hover/section:rotate-12 group-hover/section:bg-slate-950 group-hover/section:text-white transition-all duration-1000 shadow-inner italic font-black text-slate-100 text-3xl">
                                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <div className="space-y-3">
                                   <h3 className="text-3xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">Primary Registry Parameters</h3>
                                   <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.6em] leading-none italic">Authorized Institutional Identity Hub</p>
                                </div>
                            </div>

                            <div className="space-y-12 relative z-10">
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] mb-2 italic leading-none ml-10 transition-colors group-hover/section:text-tf-primary">Authorization Registry Title</label>
                                    <div className="relative group/input">
                                       <input
                                           type="text"
                                           name="title"
                                           value={formData.title}
                                           onChange={handleChange}
                                           placeholder="ENTER_MISSION_PROTOCOL_TITLE..."
                                           className="w-full bg-slate-50/50 border border-slate-100 rounded-[2.5rem] px-12 py-7 text-xl font-black text-slate-950 placeholder-slate-200 focus:outline-none focus:border-tf-primary focus:bg-white transition-all shadow-inner tracking-tighter italic"
                                           required
                                       />
                                       <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-100 group-hover/input:text-tf-primary/20 uppercase tracking-widest pointer-events-none transition-colors">REQ_FIELD</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] mb-2 italic leading-none ml-10 transition-colors group-hover/section:text-tf-primary">Strategic Operational Analysis</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Describe the humanitarian objective and operational impact parameters of this mission HUB..."
                                        className="w-full bg-slate-50/50 border border-slate-100 rounded-[3rem] px-12 py-10 text-lg font-bold text-slate-950 placeholder-slate-200 focus:outline-none focus:border-tf-primary focus:bg-white transition-all shadow-inner leading-relaxed min-h-[350px] italic tracking-tight"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Geospatial Registry Node */}
                        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden p-16 space-y-12 relative group/geo hover:shadow-3xl transition-all duration-1000">
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 blur-[120px] opacity-0 group-hover/geo:opacity-100 transition-opacity pointer-events-none" />
                            <div className="flex items-center gap-8 relative z-10">
                                <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-center shrink-0 group-hover/geo:rotate-12 group-hover/geo:bg-slate-950 group-hover/geo:text-white transition-all duration-1000 shadow-inner">
                                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="space-y-3">
                                   <h3 className="text-3xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">Geospatial Landing Site</h3>
                                   <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.6em] leading-none italic">Verified Operational Coordinates HUB</p>
                                </div>
                            </div>

                            <div className="space-y-10 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {[
                                        { n: 'city', l: 'Strategic City/Node', p: 'COLOMBO_CORE' },
                                        { n: 'state', l: 'Operational Region', p: 'WESTERN_PROVINCE' },
                                        { n: 'country', l: 'Verified Nation-State', p: 'SRI_LANKA' }
                                    ].map(loc => (
                                        <div key={loc.n} className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-1 italic leading-none ml-6 group-hover/geo:text-indigo-400 transition-colors">{loc.l}</label>
                                            <input type="text" name={loc.n} value={formData.location[loc.n]} onChange={handleChange} placeholder={loc.p} className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-10 py-6 text-sm font-black text-slate-950 placeholder-slate-200 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner italic" />
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-8 pt-6 relative group/coords">
                                    <div className="absolute inset-0 bg-indigo-50/50 rounded-[2rem] -m-6 opacity-0 group-hover/coords:opacity-100 transition-opacity pointer-events-none" />
                                    <div className="space-y-4 relative z-10">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-1 italic leading-none ml-6">Registry Lon-Axis Hub</label>
                                        <input type="number" name="lng" value={formData.location.coordinates[0]} onChange={handleChange} placeholder="79.8612" className="w-full bg-white border border-slate-100 rounded-3xl px-10 py-7 text-xl font-black text-indigo-500 tabular-nums focus:outline-none focus:border-indigo-500 transition-all shadow-2xl tracking-tighter italic" />
                                    </div>
                                    <div className="space-y-4 relative z-10">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-1 italic leading-none ml-6">Registry Lat-Axis Hub</label>
                                        <input type="number" name="lat" value={formData.location.coordinates[1]} onChange={handleChange} placeholder="6.9271" className="w-full bg-white border border-slate-100 rounded-3xl px-10 py-7 text-xl font-black text-indigo-500 tabular-nums focus:outline-none focus:border-indigo-500 transition-all shadow-2xl tracking-tighter italic" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Secondary Strategic Sidebar Registry */}
                    <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="space-y-12">
                        
                        {/* Global Visual Asset Node */}
                        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden p-12 space-y-12 relative group/visual hover:shadow-3xl transition-all duration-1000">
                             <div className="space-y-2">
                                <h3 className="text-xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">Visual Asset Hub</h3>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] leading-none italic">Institutional Evidence Protocol</p>
                             </div>
                             
                             <label className="relative flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-slate-100 rounded-[3rem] cursor-pointer bg-slate-50/50 hover:bg-white hover:border-tf-primary transition-all duration-1000 group/upload overflow-hidden shadow-inner">
                                {formData.imagePreview ? (
                                    <div className="relative w-full h-full">
                                        <img
                                            src={formData.imagePreview}
                                            alt="preview"
                                            className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover/upload:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center flex-col gap-4">
                                            <div className="w-16 h-16 bg-tf-primary text-white rounded-full flex items-center justify-center shadow-3xl animate-pulse">
                                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </div>
                                            <p className="text-white text-[11px] font-black uppercase tracking-[0.5em] italic">Authorized Update</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 px-12 text-center space-y-8">
                                        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-inner group-hover/upload:rotate-12 group-hover/upload:scale-110 transition-all duration-700 border border-slate-50 group-hover/upload:bg-tf-primary group-hover/upload:text-white group-hover/upload:shadow-tf-primary/30">
                                            <svg className="w-10 h-10 text-slate-100 group-hover/upload:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="space-y-3">
                                           <p className="text-[14px] font-black text-slate-950 group-hover/upload:text-tf-primary transition-colors uppercase tracking-widest italic">DEPLOY_VISUAL_ASSET</p>
                                           <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.4em] italic leading-relaxed">High-fidelity evidence only Hub<br />(MAX_PAYLOAD: 10MB)</p>
                                        </div>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                             </label>
                        </div>

                        {/* Capital Matrix Hub */}
                        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden p-12 space-y-12 relative group/money hover:shadow-3xl transition-all duration-1000">
                             <div className="space-y-4">
                                <h3 className="text-xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">Capital Configuration</h3>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] leading-none italic">Authorization Threshold HUB</p>
                             </div>
                             
                             <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] leading-none ml-6 group-hover/money:text-tf-primary transition-colors italic">Required Operational Capital (LKR)</label>
                                <div className="relative group/field">
                                   <input
                                       type="number"
                                       name="goalAmount"
                                       value={formData.goalAmount}
                                       onChange={handleChange}
                                       placeholder="0.00_RESERVE"
                                       className="w-full bg-slate-50/50 border border-slate-100 rounded-[2.5rem] px-14 py-8 text-3xl font-black text-tf-primary tabular-nums focus:outline-none focus:border-tf-primary focus:bg-white transition-all shadow-inner tracking-tighter italic"
                                       required
                                   />
                                   <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-100 font-black text-2xl group-hover/field:text-tf-primary transition-colors italic">¤</span>
                                </div>
                             </div>
                        </div>

                        {/* Temporal Matrix Node */}
                        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden p-12 space-y-12 relative group/time hover:shadow-3xl transition-all duration-1000">
                             <div className="space-y-4">
                                <h3 className="text-xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">Operational Cycle</h3>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] leading-none italic">Mission Window Parameters HUB</p>
                             </div>
                             
                             <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] ml-6 italic group-hover/time:text-tf-accent transition-colors">INITIALIZE_ON_NODE</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-10 py-6 text-xs font-black text-slate-950 focus:outline-none focus:border-tf-accent transition-all shadow-inner uppercase tracking-[0.3em] italic"
                                        required
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] ml-6 italic group-hover/time:text-tf-accent transition-colors">TERMINATE_BY_PROTOCOL</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-10 py-6 text-xs font-black text-slate-950 focus:outline-none focus:border-tf-accent transition-all shadow-inner uppercase tracking-[0.3em] italic"
                                        required
                                    />
                                </div>
                             </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tactical Deployment Gateways */}
                <div className="flex flex-col xl:flex-row items-center justify-between gap-12 pt-16 border-t-2 border-slate-50">
                    <div className="flex items-center gap-6 group/status">
                        <div className={`w-3 h-3 rounded-full ${formData.title && formData.description && formData.goalAmount ? 'bg-emerald-500 animate-pulse' : 'bg-slate-200'} shadow-[0_0_12px_currentColor]`} />
                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.5em] italic group-hover/status:text-slate-950 transition-colors">Authorization Synchronizer: {formData.title ? 'PARTIAL_READY' : 'AWAIT_INPUT'}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-10">
                        <Link
                            to="/admin/campaign-dashboard"
                            className="px-14 py-6 text-slate-300 hover:text-slate-950 text-[12px] font-black uppercase tracking-[0.6em] transition-all duration-700 italic border-b-2 border-transparent hover:border-slate-950"
                        >
                            Abort Initialization
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-24 py-8 bg-slate-950 text-white rounded-full text-[13px] font-black uppercase tracking-[0.6em] hover:bg-tf-primary shadow-4xl hover:shadow-tf-primary/40 transition-all duration-1000 disabled:opacity-30 active:scale-95 flex items-center gap-8 group/submit italic"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    SYNC_REGISTRY...
                                </>
                            ) : (
                                <>
                                    Authorize Mission Node <span className="text-xl group-hover/submit:translate-x-5 transition-transform duration-700">→</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Error Intelligence Node */}
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-8 px-12 py-8 bg-rose-50 border border-rose-100 rounded-[3rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[50px] -mr-16 -mt-16 pointer-events-none" />
                            <div className="w-14 h-14 bg-rose-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg animate-bounce">
                               <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div className="space-y-2">
                               <p className="text-[12px] font-black text-rose-400 uppercase tracking-[0.6em] leading-none italic">Authorization_FailureHUB</p>
                               <p className="text-xl text-rose-950 font-black tracking-tight italic">{error}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>

        </div>
    );
}
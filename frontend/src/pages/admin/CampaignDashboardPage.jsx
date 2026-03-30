import { useEffect, useState } from 'react';
import { useAdminCampaign } from '../../context/AdminCampaignContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig = {
    draft: {
        label: 'CONCEPT_DRAFT',
        className: 'bg-slate-50 text-slate-400 border-slate-100 shadow-sm',
        dot: 'bg-slate-300',
    },
    active: {
        label: 'MISSION_LIVE',
        className: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
        dot: 'bg-emerald-500 animate-pulse',
    },
    completed: {
        label: 'MISSION_SUCCESS',
        className: 'bg-tf-accent/10 text-tf-accent border-tf-accent/20',
        dot: 'bg-tf-accent',
    },
    archived: {
        label: 'MISSION_ARCHIVED',
        className: 'bg-slate-100 text-slate-500 border-slate-200',
        dot: 'bg-slate-400',
    },
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

function StatCard({ label, value, color, icon, delay = 0 }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-[4rem] border border-slate-100 shadow-sm p-12 flex flex-col justify-between group hover:shadow-3xl hover:-translate-y-2 transition-all duration-700 overflow-hidden relative h-full"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 blur-[50px] -mr-16 -mt-16 group-hover:bg-tf-primary/5 transition-colors duration-1000 pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8">
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] leading-none italic">{label}</p>
                  <div className={`w-12 h-1 bg-gradient-to-r from-${color.split('-')[1] || 'slate'}-500 to-transparent rounded-full opacity-30 mt-2`} />
               </div>
               <div className={`w-16 h-16 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center text-slate-200 group-hover:bg-slate-950 group-hover:text-white group-hover:rotate-12 transition-all duration-700 shadow-inner overflow-hidden`}>
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      {icon}
                  </svg>
               </div>
            </div>

            <div className="relative z-10 space-y-2">
                <p className={`text-4xl lg:text-5xl font-black ${color} tracking-tighter tabular-nums leading-none italic group-hover:scale-105 origin-left transition-transform duration-700`}>{value}</p>
                <div className="flex items-center gap-2 pt-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-100 animate-pulse" />
                   <p className="text-[9px] font-black text-slate-200 uppercase tracking-[0.3em] italic">Authorized Unit Synchronized</p>
                </div>
            </div>
        </motion.div>
    );
}


export default function CampaignDashboardPage() {
    const { campaigns, loading, fetchCampaigns, publishCampaign } = useAdminCampaign();
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const itemsPerPage = 6;

    useEffect(() => {
        fetchCampaigns().catch(() => { });
    }, [fetchCampaigns]);

    useEffect(() => {
        setCurrentPage(1);
    }, [campaigns.length, statusFilter]);

    if (loading && campaigns.length === 0) return <LoadingSpinner />;

    const totalCampaigns = campaigns.length;
    const draftCount = campaigns.filter((c) => c.status === 'draft').length;
    const nonDraftCount = campaigns.filter((c) => c.status !== 'draft').length;
    const filteredCampaigns =
        statusFilter === 'all'
            ? campaigns
            : campaigns.filter((c) => c.status === statusFilter);

    const totalPages = Math.max(1, Math.ceil(filteredCampaigns.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCampaigns = filteredCampaigns.slice(startIndex, startIndex + itemsPerPage);


    return (
        <div className="space-y-16 pb-32 font-sans selection:bg-tf-primary selection:text-white pt-8">

            {/* Cinematic Mission Control Header */}
            <section className="bg-slate-950 rounded-[4rem] p-20 text-white relative overflow-hidden shadow-3xl border border-white/5 group">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-tf-primary/10 blur-[180px] -mr-60 -mt-60 animate-pulse pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-tf-accent/5 blur-[120px] -ml-40 -mb-40 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-16">
                   <div className="space-y-10 flex-1">
                      <div className="space-y-6">
                         <motion.div initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-5">
                            <div className="w-3 h-3 rounded-full bg-tf-primary shadow-[0_0_15px_rgba(255,138,0,1)] animate-bounce" />
                            <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.7em] leading-none italic underline decoration-tf-primary/30 decoration-4 underline-offset-[12px]">Operational Mission Registry HUB</p>
                         </motion.div>
                         <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-8xl font-black tracking-tighter leading-none lowercase italic text-stroke-white opacity-90 transition-opacity hover:opacity-100">
                            Campaign <span className="text-tf-primary not-italic font-black">Control Hub.</span>
                         </motion.h2>
                      </div>
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-lg md:text-xl text-white/40 max-w-2xl leading-relaxed italic font-medium">
                         Initialize, authorize, and synchronize humanitarian mobilization missions across the global Transfund network Registry.
                      </motion.p>
                   </div>
                   
                   <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
                      <Link
                          to="/admin/campaigns/create"
                          className="px-16 py-8 bg-tf-primary text-white text-[12px] font-black uppercase tracking-[0.5em] rounded-full hover:bg-white hover:text-slate-950 transition-all duration-700 shadow-3xl active:scale-95 flex items-center gap-5 group/btn italic"
                      >
                          Initialize New Mission <span className="group-hover/btn:translate-x-4 transition-transform duration-500 text-lg">→</span>
                      </Link>
                   </motion.div>
                </div>
            </section>

            {/* Strategic Insight Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-8">
                <StatCard 
                    label="Total Mission Units" 
                    value={totalCampaigns} 
                    color="text-slate-950" 
                    delay={0.1}
                    icon={<path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 3v4m12-4v4M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" />}
                />
                <StatCard 
                    label="Live Authorized Assets" 
                    value={nonDraftCount} 
                    color="text-tf-accent" 
                    delay={0.2}
                    icon={<path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                />
                <StatCard 
                    label="Pending Concept Drafts" 
                    value={draftCount} 
                    color="text-tf-primary" 
                    delay={0.3}
                    icon={<path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />}
                />
            </div>

            {/* Mission Registry Command Center */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden p-16 space-y-16 group/registry hover:shadow-4xl transition-all duration-1000 mx-8">
                <div className="flex flex-col xl:flex-row items-center justify-between gap-12 relative z-10">
                    <div className="space-y-4 text-center xl:text-left">
                        <h3 className="text-4xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">Mission Catalog Registry</h3>
                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.6em] leading-none italic">Comprehensive synchronization of humanitarian initiative nodes Hub</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-8 group/controls">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic hidden sm:block">Filter Registry Matrix:</p>
                        <div className="relative group/select">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none bg-slate-50 border border-slate-100 rounded-[2rem] px-12 py-5 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 focus:outline-none focus:border-tf-primary transition-all cursor-pointer shadow-inner pr-24 italic"
                            >
                                <option value="all">Every Mission Phase (HUB)</option>
                                <option value="draft">Concept Logistics</option>
                                <option value="active">Live Deployments</option>
                                <option value="completed">Operational Success</option>
                                <option value="archived">System Archives</option>
                            </select>
                            <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-slate-200 group-hover/select:text-tf-primary transition-all duration-500">
                               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8 relative z-10">
                    <AnimatePresence mode="popLayout">
                        {paginatedCampaigns.length === 0 ? (
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="py-40 text-center space-y-10 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[4rem] group/empty">
                                <div className="w-24 h-24 bg-white rounded-[2.5rem] border border-slate-100 shadow-inner flex items-center justify-center mx-auto text-slate-100 italic font-black text-3xl transition-all duration-1000 group-hover/empty:rotate-12 group-hover/empty:scale-110">?</div>
                                <div className="space-y-4">
                                   <p className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">No Mission Registry Nodes detected.</p>
                                   <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.6em] italic">Awaiting strategic initialization of field initiatives Hub</p>
                                </div>
                            </motion.div>
                        ) : (
                            paginatedCampaigns.map((c, idx) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, x: -30 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    exit={{ opacity: 0, x: 30 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={c._id}
                                    className="flex flex-col lg:flex-row items-center justify-between p-12 bg-slate-50/40 hover:bg-white border border-slate-50 hover:border-tf-primary/30 rounded-[3.5rem] transition-all duration-700 group/row shadow-sm hover:shadow-3xl gap-12 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-tf-primary/5 blur-[60px] opacity-0 group-hover/row:opacity-100 transition-opacity pointer-events-none" />
                                    
                                    <div className="flex items-center gap-10 min-w-0 flex-1 relative z-10">
                                        <div className="w-20 h-20 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-center shrink-0 group-hover/row:rotate-12 group-hover/row:bg-slate-950 group-hover/row:text-white transition-all duration-700 shadow-inner italic font-black text-slate-100 text-xl overflow-hidden relative">
                                            <svg className="w-10 h-10 group-hover/row:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 3v4m12-4v4M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" />
                                            </svg>
                                            <div className="absolute inset-0 bg-tf-primary/10 opacity-0 group-hover/row:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="min-w-0 space-y-2">
                                            <p className="text-2xl font-black text-slate-950 group-hover/row:text-tf-primary transition-colors truncate tracking-tighter italic leading-none">{c.title || 'UNNAMED_MISSION_PROTOCOL'}</p>
                                            <div className="flex items-center gap-4">
                                               <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.4em] group-hover/row:text-slate-400 transition-colors italic whitespace-nowrap">
                                                   NODE_ID: {c._id?.slice(-12).toUpperCase() || 'OFFLINE_REGISTRY'}
                                               </p>
                                               <div className="w-1 h-1 rounded-full bg-slate-200" />
                                               <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em] italic truncate">Synchronized: {new Date(c.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-10 shrink-0 relative z-10">
                                        <StatusBadge status={c.status} />

                                        <div className="flex gap-5">
                                            <AnimatePresence>
                                                {c.status === 'draft' && (
                                                    <motion.button
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        onClick={() => publishCampaign(c._id)}
                                                        className="px-10 py-5 bg-white hover:bg-emerald-500 hover:text-white text-emerald-600 border border-emerald-100 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-700 active:scale-95 italic shadow-sm hover:shadow-emerald-500/20"
                                                    >
                                                        Deploy Node
                                                    </motion.button>
                                                )}
                                            </AnimatePresence>
                                            <Link
                                                to={`/admin/campaigns/${c._id}`}
                                                className="px-12 py-5 bg-slate-950 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] hover:bg-tf-primary shadow-2xl hover:shadow-tf-primary/30 transition-all duration-700 active:scale-95 italic"
                                            >
                                                Inspect Mission Protocol
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* Registry Matrix Navigation */}
                {filteredCampaigns.length > itemsPerPage && (
                    <div className="pt-16 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                        <div className="space-y-2 text-center md:text-left">
                           <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.5em] italic group-hover/registry:text-tf-primary transition-colors">
                              Audit Registry Sync: {startIndex + 1} — {Math.min(startIndex + itemsPerPage, filteredCampaigns.length)} / {filteredCampaigns.length} Mission Objects
                           </p>
                           <div className="h-1 w-24 bg-slate-50 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${(startIndex + Math.min(itemsPerPage, filteredCampaigns.length - startIndex)) / filteredCampaigns.length * 100}%` }} className="h-full bg-tf-primary animate-shimmer" />
                           </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); window.scrollTo({top:0, behavior:'smooth'}); }}
                                disabled={currentPage === 1}
                                className="w-16 h-16 rounded-[2rem] flex items-center justify-center bg-white border border-slate-100 text-slate-950 disabled:opacity-20 hover:bg-slate-950 hover:text-white transition-all duration-700 group/prev shadow-sm active:scale-90"
                            >
                                <svg className="w-6 h-6 group-hover/prev:-translate-x-2 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                            </button>

                            <div className="px-8 py-4 border border-slate-100 rounded-[1.5rem] text-[13px] font-black tabular-nums bg-white shadow-xl italic tracking-widest min-w-[120px] text-center">
                               {currentPage} <span className="text-slate-200 mx-3 italic">/</span> {totalPages}
                            </div>

                            <button
                                onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({top:0, behavior:'smooth'}); }}
                                disabled={currentPage === totalPages}
                                className="w-16 h-16 rounded-[2rem] flex items-center justify-center bg-white border border-slate-100 text-slate-950 disabled:opacity-20 hover:bg-slate-950 hover:text-white transition-all duration-700 group/next shadow-sm active:scale-90"
                            >
                                <svg className="w-6 h-6 group-hover/next:translate-x-2 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
            <style>{`
                .animate-shimmer {
                    background-size: 200% 100%;
                    animation: shimmer 2s linear infinite;
                    background: linear-gradient(90deg, #ff8a00, #ffba00, #ff8a00);
                }
                @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
            `}</style>
        </div>
    );
}
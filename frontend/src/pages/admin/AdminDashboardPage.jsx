import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminDonor } from '../../context/AdminDonorContext';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

const pledgeStatusColor = {
    active: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    inactive: 'bg-slate-100 text-slate-400 border-slate-200',
    deleted: 'bg-rose-50 text-rose-600 border-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.1)]',
};

const SEGMENT_META = {
    new: { label: 'Inbound Personnel HUB', bar: 'bg-indigo-500', glow: 'shadow-[0_0_20px_rgba(99,102,241,0.3)]' },
    regular: { label: 'Operational Support Hub', bar: 'bg-emerald-500', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]' },
    major: { label: 'Strategic Stakeholders', bar: 'bg-tf-primary', glow: 'shadow-[0_0_20px_rgba(255,138,0,0.3)]' },
    lapsed: { label: 'Dormant Protocol Hub', bar: 'bg-slate-400', glow: '' },
    vip: { label: 'Elite Institutional Agent', bar: 'bg-slate-950', glow: 'shadow-[0_0_20px_rgba(15,23,42,0.3)]' },
};

function StatCard({ label, value, color, sub, icon, delay }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-[4.5rem] border border-slate-100 shadow-sm p-14 space-y-10 group hover:shadow-4xl hover:-translate-y-3 transition-all duration-1000 overflow-hidden relative flex flex-col justify-between h-full"
        >
            <div className="absolute top-0 right-0 w-48 h-48 bg-tf-primary/3 blur-[80px] -mr-24 -mt-24 group-hover:bg-tf-primary/10 transition-all duration-1000 pointer-events-none" />
            <div className="space-y-10 relative z-10">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className={`w-2.5 h-2.5 rounded-full ${color.replace('text', 'bg')} shadow-[0_0_15px_currentColor] animate-pulse`} />
                     <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.6em] leading-none italic group-hover:text-slate-900 transition-colors uppercase">{label} Hub</p>
                  </div>
                  <div className="w-16 h-16 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-slate-950 group-hover:text-white group-hover:rotate-12 transition-all duration-1000 shadow-inner group-hover:shadow-4xl overflow-hidden relative group/icon">
                     <div className="absolute inset-0 bg-tf-primary/10 opacity-0 group-hover/icon:opacity-100 transition-opacity" />
                     {icon}
                  </div>
               </div>
               <div className="space-y-3">
                  <p className={`text-5xl font-black tracking-tighter tabular-nums ${color} leading-none italic group-hover:scale-105 origin-left transition-transform duration-1000 lowercase`}>{value ?? '0.00'}</p>
                  {sub && <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic leading-none group-hover:text-slate-500 transition-colors">{sub}</p>}
               </div>
            </div>
            <div className="pt-8 border-t border-slate-50 relative z-10">
               <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden shadow-inner">
                  <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ delay: delay + 0.8, duration: 2.5, ease: 'circOut' }} className={`h-full ${color.replace('text', 'bg')} opacity-20 relative overflow-hidden`}>
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] animate-shimmer" />
                  </motion.div>
               </div>
            </div>
        </motion.div>
    );
}

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const { donors, segments, loading, fetchDonors, fetchSegments } = useAdminDonor();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDonors().catch(() => { });
        fetchSegments().catch(() => { });
    }, [fetchDonors, fetchSegments]);

    if (loading && donors.length === 0) return <LoadingSpinner />;

    const totalDonors = donors.length;
    const activeDonors = donors.filter((d) => d.status === 'active').length;
    const inactiveDonors = donors.filter((d) => d.status === 'inactive').length;
    const totalRaised = donors.reduce((s, d) => s + (d.analytics?.totalDonated || 0), 0);

    const segmentCounts = (() => {
        if (Array.isArray(segments)) {
            return segments.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {});
        }
        if (segments && typeof segments === 'object') return segments;
        return donors.reduce((acc, d) => {
            const seg = d.segment || 'new';
            acc[seg] = (acc[seg] || 0) + 1;
            return acc;
        }, {});
    })();
    const segmentEntries = Object.entries(segmentCounts).sort((a, b) => b[1] - a[1]);
    const recentDonors = [...donors].slice(0, 5);

    return (
        <div className="space-y-20 pb-40 font-sans selection:bg-tf-primary selection:text-white pt-10">
            {/* Cinematic Administrative Command Header HUB */}
            <section className="bg-slate-950 rounded-[4.5rem] p-24 text-white relative overflow-hidden shadow-5xl border border-white/5 group mx-8">
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-tf-primary/10 blur-[250px] -mr-60 -mt-60 animate-pulse pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-tf-accent/5 blur-[180px] -ml-48 -mb-48 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-20">
                   <div className="space-y-12 flex-1">
                      <div className="space-y-10">
                         <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-6">
                            <div className="w-4 h-4 rounded-full bg-tf-primary shadow-[0_0_20px_rgba(255,138,0,1)] animate-bounce" />
                            <p className="text-[12px] font-black text-white/30 uppercase tracking-[0.8em] leading-none italic underline decoration-tf-primary/30 decoration-4 underline-offset-[14px]">Mission Authorization Command HUB v2.0-Elite</p>
                         </motion.div>
                         <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-9xl font-black tracking-tighter leading-[0.85] lowercase italic text-stroke-white opacity-90 transition-all hover:opacity-100 flex flex-col">
                            Welcome, <span className="text-tf-primary not-italic font-black text-stroke-none ">{user?.name?.split(' ')[0] || 'Admin Agent'}</span> 👋
                         </motion.h2>
                      </div>
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-xl md:text-2xl text-white/40 max-w-3xl leading-relaxed italic font-medium">
                         Synchronized real-time operational surveillance of global humanitarian agent mobilization and direct capital intake registries HUB Protocol.
                      </motion.p>
                   </div>
                   
                   <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-10 relative z-20">
                      <Link to="/admin/donors" className="px-16 py-8 bg-white text-slate-950 text-[14px] font-black uppercase tracking-[0.6em] rounded-full hover:bg-tf-primary hover:text-white transition-all duration-1000 shadow-5xl active:scale-95 italic group/btn flex items-center justify-center min-w-[320px]">
                         Open Registry Index <span className="ml-6 group-hover/btn:translate-x-4 transition-transform inline-block duration-1000">→</span>
                      </Link>
                      <Link to="/admin/campaign-dashboard" className="px-16 py-8 bg-white/5 backdrop-blur-3xl border border-white/20 text-white text-[12px] font-black uppercase tracking-[0.6em] rounded-full hover:bg-white/10 transition-all duration-1000 active:scale-95 italic text-center flex items-center justify-center min-w-[320px] shadow-2xl">
                         Mission Discovery HUB 
                      </Link>
                   </motion.div>
                </div>
            </section>

            {/* Tactical High-Integrity Intelligence Grid HUB */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 px-8">
                <StatCard 
                    label="Agent Registry Core" 
                    value={totalDonors} 
                    color="text-slate-950" 
                    delay={0.1}
                    icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                />
                <StatCard 
                    label="Operational Personnel" 
                    value={activeDonors} 
                    color="text-tf-accent" 
                    sub={`${inactiveDonors} Dormant Registry Nodes`} 
                    delay={0.2}
                    icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                />
                <StatCard 
                    label="Capital Net Intake" 
                    value={`LKR ${totalRaised.toLocaleString()}`} 
                    color="text-tf-primary" 
                    delay={0.3}
                    icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard 
                    label="Asset Support Vector" 
                    value={totalDonors > 0 ? `LKR ${Math.round(donors.reduce((s,d)=>s+(d.analytics?.averageDonation||0),0)/totalDonors).toLocaleString()}` : '0.00'} 
                    color="text-slate-400" 
                    delay={0.4}
                    icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-16 px-8 items-stretch">
                {/* Status Dashboard: Operational Registry Hub */}
                <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="xl:col-span-2 bg-white rounded-[5rem] border border-slate-100 shadow-sm p-20 space-y-20 group/list hover:shadow-5xl transition-all duration-1000 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-tf-primary/3 blur-[100px] opacity-0 group-hover/list:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-12 relative z-10">
                        <div className="space-y-6">
                           <h3 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">Recent Agent Activation Hub</h3>
                           <div className="flex items-center gap-5">
                              <div className="w-10 h-0.5 bg-tf-primary/30 group-hover/list:w-20 transition-all duration-1000" />
                              <p className="text-[12px] font-black text-slate-300 uppercase tracking-[0.6em] leading-none italic group-hover:text-slate-900 transition-colors uppercase">Latest 05 synchronized field entries Hub Protocol</p>
                           </div>
                        </div>
                        <Link to="/admin/donors" className="px-12 py-6 bg-slate-50 border border-slate-100 text-tf-primary text-[12px] font-black uppercase tracking-[0.5em] rounded-full hover:bg-slate-950 hover:text-white transition-all duration-1000 italic shadow-sm hover:shadow-4xl group/allactive shrink-0">Explore All Active HUB Index <span className="ml-3 group-hover/allactive:translate-x-2 transition-transform inline-block">→</span></Link>
                    </div>
                    
                    <div className="space-y-10 relative z-10">
                        {recentDonors.length === 0 ? (
                            <div className="py-40 text-center space-y-10 bg-slate-50/50 rounded-[4rem] border-2 border-dashed border-slate-100 group/null transition-all duration-1000">
                               <div className="w-32 h-32 bg-white rounded-[3rem] mx-auto flex items-center justify-center text-slate-100 italic font-black text-4xl shadow-inner rotate-12 group-hover/null:rotate-0 transition-transform duration-1000">?</div>
                               <p className="text-[13px] text-slate-300 font-black uppercase tracking-[0.7em] italic px-20 leading-relaxed">Authorized synchronization pending field activity Hub Discovery...</p>
                            </div>
                        ) : (
                            recentDonors.map((donor, idx) => (
                                <motion.div
                                    key={donor._id}
                                    initial={{ opacity: 0, scale: 0.98, x: -20 }}
                                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1, duration: 0.8 }}
                                >
                                    <button
                                        onClick={() => navigate(`/admin/donors/${donor._id}`)}
                                        className="w-full flex flex-col md:flex-row items-center justify-between p-12 bg-slate-50/40 hover:bg-slate-950 border border-slate-50 hover:border-tf-primary/30 rounded-[3.5rem] transition-all duration-1000 group/row shadow-sm hover:shadow-5xl relative overflow-hidden text-left"
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-tf-primary/5 blur-[80px] opacity-0 group-hover/row:opacity-100 transition-opacity pointer-events-none" />
                                        <div className="flex items-center gap-10 relative z-10 w-full md:w-auto">
                                           <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center text-3xl font-black text-slate-100 border border-slate-100 shadow-inner group-hover/row:bg-white group-hover/row:text-slate-950 transition-all duration-700 italic group-hover/row:rotate-[15deg] group-hover/row:scale-110 overflow-hidden relative group/avatar">
                                              <div className="absolute inset-0 bg-tf-primary/10 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                                              {donor.userId?.name?.[0]?.toUpperCase() || 'A'}
                                           </div>
                                           <div className="min-w-0 space-y-3">
                                              <p className="text-2xl font-black text-slate-950 group-hover/row:text-white truncate italic transition-all duration-700 leading-none tracking-tight lowercase">{donor.userId?.name || 'Verified Member Agent Node'}</p>
                                              <div className="flex items-center gap-4">
                                                 <div className="w-2 h-2 rounded-full bg-slate-200 group-hover/row:bg-tf-primary transition-all duration-700" />
                                                 <p className="text-[11px] text-slate-400 group-hover/row:text-white/40 italic font-black tracking-[0.3em] truncate uppercase transition-all duration-700">{donor.userId?.email || 'OFFLINE_NODE_PROTOCOL'}</p>
                                              </div>
                                           </div>
                                        </div>
                                        <div className="flex items-center gap-14 relative z-10 w-full md:w-auto justify-end mt-6 md:mt-0">
                                            <div className="text-right space-y-2">
                                               <p className="text-[11px] font-black text-slate-300 group-hover/row:text-white/20 uppercase tracking-[0.4em] leading-none italic transition-all duration-700">Verified Intake HUB</p>
                                               <p className="text-2xl font-black text-slate-950 group-hover/row:text-tf-primary tabular-nums italic tracking-tighter transition-all duration-1000 leading-none lowercase">LKR {(donor.analytics?.totalDonated || 0).toLocaleString()}</p>
                                            </div>
                                            <span className={`hidden md:flex px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.4em] border transition-all duration-1000 italic shadow-2xl group-hover/row:scale-110 ${pledgeStatusColor[donor.status] || 'bg-slate-50 text-slate-400 border-slate-100 group-hover/row:bg-white/10 group-hover/row:text-white group-hover/row:border-white/20'}`}>
                                                NODE_{donor.status?.toUpperCase() || 'ACTIVE'}_SYNC
                                            </span>
                                        </div>
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Agent Topology Intelligence: Strategic Oversight HUB */}
                <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="bg-slate-950 rounded-[5rem] p-20 shadow-5xl relative overflow-hidden group/topology text-white border border-white/10 space-y-20 transition-all duration-1000 hover:shadow-tf-primary/10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,138,0,0.05),transparent)] pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 blur-[120px] -mr-40 -mt-40 pointer-events-none" />
                    
                    <div className="space-y-8 relative z-10">
                        <div className="flex items-center gap-6 mb-2">
                           <div className="w-12 h-1 bg-tf-primary rounded-full group-hover/topology:w-24 transition-all duration-1000" />
                           <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-stroke-white opacity-90 group-hover/topology:opacity-100 transition-opacity">Topology HUB.</h3>
                        </div>
                        <p className="text-[12px] font-black text-white/20 uppercase tracking-[0.7em] leading-none italic group-hover:text-tf-primary transition-colors">Strategic Registry Distribution Hub Protocol</p>
                    </div>

                    <div className="space-y-12 relative z-10 px-4">
                        {segmentEntries.length === 0 ? (
                            <div className="py-40 text-center space-y-10 group/null bg-white/5 rounded-[4rem] border-2 border-dashed border-white/10 transition-all duration-1000">
                               <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[2.5rem] mx-auto flex items-center justify-center text-white/10 rotate-12 group-hover/null:rotate-0 transition-transform duration-1000 italic font-black text-3xl">!</div>
                               <p className="text-[12px] text-white/20 font-black uppercase tracking-[0.7em] italic leading-relaxed px-12">Authorized synchronization pending for real-time tactical population mapping HUB.</p>
                            </div>
                        ) : (
                            segmentEntries.map(([seg, count], idx) => {
                                const meta = SEGMENT_META[seg] || { label: seg, bar: 'bg-white/10', glow: '' };
                                const pct = Math.round((count / (totalDonors || 1)) * 100);
                                return (
                                    <div key={seg} className="space-y-6 group/entry relative">
                                        <div className="flex justify-between items-end px-2">
                                            <div className="space-y-3">
                                               <p className="text-xl font-black text-white/50 italic leading-none transition-all duration-700 group-hover/entry:text-tf-primary group-hover/entry:translate-x-2 lowercase tracking-tight">{meta.label}</p>
                                               <div className="flex items-center gap-3">
                                                  <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover/entry:bg-tf-primary group-hover/entry:animate-pulse transition-all" />
                                                  <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] italic group-hover/entry:text-white/40 transition-colors">System Categorization Node HUB</p>
                                               </div>
                                            </div>
                                            <div className="text-right space-y-2">
                                               <p className="text-3xl font-black text-white italic leading-none tabular-nums group-hover/entry:scale-125 transition-all duration-700 origin-right lowercase">{pct}%</p>
                                               <p className="text-[10px] font-black text-white/10 tracking-[0.3em] tabular-nums uppercase whitespace-nowrap leading-none group-hover/entry:text-tf-primary/50 transition-colors">{count} AGENTS SYNCED Hub</p>
                                            </div>
                                        </div>
                                        <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner group-hover:border-white/20 transition-all duration-1000 p-1">
                                            <motion.div
                                                initial={{ width: 0 }} 
                                                whileInView={{ width: `${pct}%` }} 
                                                viewport={{ once: true }}
                                                transition={{ duration: 2.5, delay: idx * 0.15, ease: "circOut" }}
                                                className={`h-full rounded-full transition-all duration-1000 ${meta.bar} ${meta.glow} relative overflow-hidden group-hover:brightness-125`}
                                            >
                                               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-shimmer" />
                                            </motion.div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="pt-16 border-t border-white/5 relative z-10 group/statbox">
                       <Link to="/admin/donor-analytics" className="w-full py-10 bg-white text-slate-950 hover:bg-tf-primary hover:text-white text-[14px] font-black uppercase tracking-[0.6em] rounded-full transition-all duration-1000 flex items-center justify-center gap-8 italic shadow-5xl active:scale-90 group/syncbtn">
                          Analyze Agent Matrix HUB <span className="text-2xl group-hover/syncbtn:translate-x-5 transition-transform duration-1000 inline-block">→</span>
                       </Link>
                    </div>
                </motion.div>
            </div>
            
            <style>{`
                @keyframes shimmer { 
                    0% { transform: translateX(-100%); } 
                    100% { transform: translateX(100%); } 
                }
                .animate-shimmer {
                    animation: shimmer 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
            `}</style>
        </div>
    );
}

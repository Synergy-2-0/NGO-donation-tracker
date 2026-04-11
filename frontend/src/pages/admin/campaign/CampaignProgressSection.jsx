import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../../api/axios';

const normalizeEvidence = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (!value) return [];
    if (typeof value === 'string') return [value];
    if (typeof value === 'object') {
        if (value.url) return [value.url];
        if (Array.isArray(value.urls)) return value.urls.filter(Boolean);
    }
    return [];
};

const normalizeProgressLog = (log) => ({
    ...log,
    description: log?.description || log?.details || log?.note || '',
    amountRaised: Number(log?.amountRaised ?? log?.amount ?? log?.fundsRaised ?? 0),
    beneficiaries: Number(log?.beneficiaries ?? log?.beneficiaryCount ?? 0),
    evidence: normalizeEvidence(log?.evidence),
});

const extractLogs = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.logs)) return payload.logs;
    if (Array.isArray(payload?.progress)) return payload.progress;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
};

export default function CampaignProgressSection({ campaignId, campaignStatus, onCampaignUpdated }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        description: '',
        amountRaised: '',
        beneficiaries: '',
        evidence: [],
    });

    useEffect(() => {
        api.get(`/api/campaigns/${campaignId}/progress`)
            .then((res) => {
                const normalized = extractLogs(res.data)
                    .map(normalizeProgressLog)
                    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                setLogs(normalized);
            })
            .catch(() => setError('Failed to load progress logs.'))
            .finally(() => setLoading(false));
    }, [campaignId]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'evidence') {
            setFormData((prev) => ({ ...prev, evidence: Array.from(files) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const payload = new FormData();
            payload.append('description', formData.description);
            payload.append('amountRaised', formData.amountRaised);
            payload.append('beneficiaries', formData.beneficiaries);
            formData.evidence.forEach((file) => payload.append('evidence', file));

            const res = await api.post(`/api/campaigns/${campaignId}/progress`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setLogs((prev) => [normalizeProgressLog(res.data), ...prev]);
            setFormData({ description: '', amountRaised: '', beneficiaries: '', evidence: [] });
            setShowForm(false);
            if (onCampaignUpdated) {
                await onCampaignUpdated();
            }
            setSuccess('Progress log added.');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add progress log.');
        } finally {
            setSubmitting(false);
        }
    };

    const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-colors bg-gray-50 hover:bg-white';
    const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1';

    return (
        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden p-12 space-y-12 relative group transition-all hover:shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 blur-[100px] -mr-32 -mt-32 pointer-events-none" />

            {/* Log Header Interface */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white border border-slate-100 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-tf-primary/5 transition-all duration-500 shadow-inner">
                        <svg className="w-8 h-8 text-slate-200 group-hover:text-tf-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v12m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-3xl font-extrabold text-slate-950 tracking-tighter uppercase  leading-none">Operational Logs</h3>
                        <p className="text-[10px] font-extrabold text-slate-300 uppercase tracking-[0.4em] leading-none ">Verified Milestone Synchronization</p>
                    </div>
                </div>

                {campaignStatus === 'active' && !showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-10 py-5 bg-slate-950 text-white text-[11px] font-extrabold uppercase tracking-[0.4em] rounded-[1.5rem] hover:bg-tf-primary transition-all duration-500 shadow-xl active:scale-95 flex items-center gap-4 group/add"
                    >
                        <svg className="w-4 h-4 group-hover/add:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        Initialize Entry
                    </button>
                )}
            </div>

            <div className="space-y-10 relative z-10">
                {/* Exception Handling Hub */}
                {(error || success) && (
                    <div className="space-y-4">
                        {error && (
                            <div className="flex items-center gap-4 px-10 py-6 bg-rose-50 border border-rose-100 rounded-[2rem] shadow-sm">
                                <div className="w-10 h-10 bg-rose-500/10 rounded-full flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-extrabold text-rose-400 uppercase tracking-widest leading-none ">Log Failure</p>
                                    <p className="text-[13px] text-rose-700 font-bold tracking-tight ">{error}</p>
                                </div>
                            </div>
                        )}
                        {success && (
                            <div className="flex items-center gap-4 px-10 py-6 bg-emerald-50 border border-emerald-100 rounded-[2rem] shadow-sm">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest leading-none ">Entry Synchronized</p>
                                    <p className="text-[13px] text-emerald-700 font-bold tracking-tight ">{success}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Secure Log Form */}
                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-slate-50 rounded-[3rem] p-12 border border-slate-100 shadow-inner space-y-10 group/form">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-2 h-2 rounded-full bg-tf-primary animate-pulse" />
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.4em] ">Secure Milestone Initialization</p>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.4em] ml-4 ">Description of Achievement</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the tactical progress and community impact achieved in this phase..."
                                className="w-full bg-white border border-slate-100 rounded-[2rem] px-8 py-8 text-sm font-bold text-slate-900 placeholder-slate-200 focus:outline-none focus:border-tf-primary transition-all shadow-sm leading-relaxed min-h-[150px]"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.4em] ml-4 ">Capital Mobilized (LKR)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="amountRaised"
                                        value={formData.amountRaised}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full bg-white border border-slate-100 rounded-3xl px-12 py-5 text-2xl font-extrabold text-tf-primary focus:outline-none focus:border-tf-primary transition-all shadow-inner  tabular-nums tracking-tighter"
                                    />
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-200 font-extrabold text-lg group-hover/form:text-tf-primary/20 transition-colors">¤</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.4em] ml-4 ">Lives Impacted</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="beneficiaries"
                                        value={formData.beneficiaries}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className="w-full bg-white border border-slate-100 rounded-3xl px-12 py-5 text-2xl font-extrabold text-indigo-500 focus:outline-none focus:border-indigo-400 transition-all shadow-inner  tabular-nums tracking-tighter"
                                    />
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-200 font-extrabold text-lg group-hover/form:text-indigo-400/20 transition-colors">¶</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.4em] ml-4 ">Evidence Repository</label>
                            <label className="relative flex items-center gap-6 px-10 py-6 bg-white border border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:border-tf-primary hover:bg-tf-primary/5 transition-all duration-500 group/evidence overflow-hidden">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover/evidence:scale-110 group-hover/evidence:bg-white transition-all shadow-inner">
                                    <svg className="w-6 h-6 text-slate-200 group-hover/evidence:text-tf-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-extrabold text-slate-900 group-hover/evidence:text-tf-primary transition-colors uppercase tracking-widest leading-none">
                                        {formData.evidence.length > 0 ? `${formData.evidence.length} Artifacts Prepared` : 'Upload Strategic Evidence'}
                                    </p>
                                    <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest ">Images, PDFs, Geo-logs (Limited Support)</p>
                                </div>
                                <input type="file" name="evidence" multiple onChange={handleChange} className="hidden" />
                            </label>
                        </div>

                        <div className="flex justify-end gap-6 pt-4">
                            <button
                                type="button"
                                onClick={() => { setShowForm(false); setError(''); }}
                                className="px-10 py-5 bg-white border border-slate-100 text-slate-400 text-[10px] font-extrabold uppercase tracking-[0.4em] rounded-[1.5rem] hover:bg-slate-50 hover:text-slate-900 transition-all duration-500 active:scale-95  text-center"
                            >
                                Abort Entry
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-12 py-5 bg-slate-950 text-white text-[10px] font-extrabold uppercase tracking-[0.5em] rounded-[1.5rem] hover:bg-tf-primary transition-all duration-500 shadow-xl disabled:opacity-50 active:scale-95 flex items-center gap-4"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Synchronizing Hub...
                                    </>
                                ) : 'Authorize Milestone'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Milestone Temporal Flow */}
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-6">
                        <div className="w-16 h-16 border-4 border-slate-50 border-t-tf-primary rounded-full animate-spin shadow-inner" />
                        <p className="text-[10px] font-extrabold text-slate-300 uppercase tracking-[0.5em] animate-pulse">Syncing Mission History...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="py-24 text-center group/empty">
                        <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 transition-all duration-700 group-hover/empty:rotate-12 group-hover/empty:scale-110 shadow-inner">
                            <svg className="w-10 h-10 text-slate-200 group-hover/empty:text-tf-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h4 className="text-xl font-bold text-slate-400 tracking-tight ">Null Progress Detected</h4>
                        <p className="text-[10px] text-slate-300 font-extrabold uppercase tracking-[0.4em] mt-2 ">Initial protocol requires active engagement logs.</p>
                    </div>
                ) : (
                    <div className="relative space-y-10 pl-16">
                        <div className="absolute left-[24px] top-4 bottom-4 w-1 bg-slate-50 group-hover:bg-tf-primary/5 transition-colors rounded-full" />
                        {logs.map((log, i) => (
                            <div key={log._id ?? i} className="relative group/log">
                                <div className="absolute left-[-56px] top-6 w-12 h-px bg-slate-100 group-hover/log:bg-tf-primary/20 transition-colors" />
                                <div className="absolute left-[-56px] top-5 w-4 h-4 rounded-full bg-white border-4 border-slate-100 group-hover/log:border-tf-primary transition-all duration-500 shadow-sm z-10" />

                                <motion.div
                                    whileHover={{ x: 10 }}
                                    className="bg-white border border-slate-100 rounded-[2.5rem] p-10 hover:shadow-2xl hover:border-tf-primary/10 transition-all duration-700 space-y-8 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-tf-primary/5 blur-[50px] -mr-16 -mt-16 pointer-events-none opacity-0 group-hover/log:opacity-100 transition-opacity" />

                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 overflow-hidden">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-tf-primary" />
                                                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest tabular-nums ">
                                                    {new Date(log.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <p className="text-base text-slate-700 font-bold leading-relaxed  tracking-tight">{log.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-slate-50">
                                        {log.amountRaised > 0 && (
                                            <div className="px-6 py-2 bg-tf-primary/5 border border-tf-primary/10 rounded-full flex items-center gap-2">
                                                <span className="w-1 h-1 bg-tf-primary rounded-full shadow-[0_0_5px_rgba(255,138,0,0.8)]" />
                                                <p className="text-[9px] font-extrabold text-tf-primary uppercase tracking-widest tabular-nums ">LKR {log.amountRaised.toLocaleString()} Stabilized</p>
                                            </div>
                                        )}
                                        {log.beneficiaries > 0 && (
                                            <div className="px-6 py-2 bg-indigo-50 border border-indigo-100 rounded-full flex items-center gap-2">
                                                <span className="w-1 h-1 bg-indigo-500 rounded-full shadow-[0_0_5px_rgba(99,102,241,0.8)]" />
                                                <p className="text-[9px] font-extrabold text-indigo-600 uppercase tracking-widest tabular-nums ">{log.beneficiaries} Lives Impacted</p>
                                            </div>
                                        )}
                                        {log.evidence?.length > 0 && (
                                            <div className="px-6 py-2 bg-slate-50 border border-slate-100 rounded-full flex items-center gap-2">
                                                <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest tabular-nums ">{log.evidence.length} Protocol Artifacts</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

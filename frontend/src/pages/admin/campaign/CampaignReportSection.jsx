import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import { FiCpu, FiZap, FiLoader } from 'react-icons/fi';

export default function CampaignReportSection({ campaignId }) {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [generatingSummary, setGeneratingSummary] = useState(false);

    const [formData, setFormData] = useState({
        summary: '',
        totalRaised: '',
        beneficiaries: '',
        evidence: [],
    });

    useEffect(() => {
        api.get(`/api/campaigns/${campaignId}/report`)
            .then((res) => setReport(res.data))
            .catch(() => setReport(null))
            .finally(() => setLoading(false));
    }, [campaignId]);

    const handleGenerateSummary = async () => {
        setGeneratingSummary(true);
        try {
            const res = await api.get(`/api/ai/generate-summary/${campaignId}`);
            setFormData(prev => ({ ...prev, summary: res.data.summary }));
        } catch (err) {
            console.error('Failed to generate summary:', err);
            setError('Failed to reach AI Synthesis Hub. Please try manual entry.');
        } finally {
            setGeneratingSummary(false);
        }
    };

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
            payload.append('summary', formData.summary);
            payload.append('totalRaised', formData.totalRaised);
            payload.append('beneficiaries', formData.beneficiaries);
            formData.evidence.forEach((file) => payload.append('evidence', file));

            const res = await api.post(`/api/campaigns/${campaignId}/report`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setReport(res.data);
            setShowForm(false);
            setSuccess('Report created successfully.');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create report.');
        } finally {
            setSubmitting(false);
        }
    };

    const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-colors bg-gray-50 hover:bg-white';
    const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1';

    return (
        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden p-12 space-y-12 relative group transition-all hover:shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
            
            {/* Report Header Interface */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white border border-slate-100 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-tf-primary/5 transition-all duration-500 shadow-inner">
                        <svg className="w-8 h-8 text-slate-200 group-hover:text-tf-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-3xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">Strategy Completion</h3>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] leading-none italic">Verified Tactical Outcome Log</p>
                    </div>
                </div>
                
                {!loading && !report && !showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-10 py-5 bg-slate-950 text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-[1.5rem] hover:bg-tf-primary transition-all duration-500 shadow-xl active:scale-95 flex items-center gap-4 group/add"
                    >
                        <svg className="w-4 h-4 group-hover/add:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        Initialize Report
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
                                   <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest leading-none italic">Registry Alert</p>
                                   <p className="text-[13px] text-rose-700 font-bold tracking-tight italic">{error}</p>
                                </div>
                            </div>
                        )}
                        {success && (
                            <div className="flex items-center gap-4 px-10 py-6 bg-emerald-50 border border-emerald-100 rounded-[2rem] shadow-sm">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                                   <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div className="space-y-1">
                                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none italic">Report Finalized</p>
                                   <p className="text-[13px] text-emerald-700 font-bold tracking-tight italic">{success}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-6">
                        <div className="w-16 h-16 border-4 border-slate-50 border-t-tf-primary rounded-full animate-spin shadow-inner" />
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] animate-pulse">Synchronizing Outcomes...</p>
                    </div>
                ) : report ? (
                    /* Finalized Outcome Display */
                    <div className="space-y-12">
                        <div className="flex items-center gap-6 px-10 py-8 bg-emerald-50/50 rounded-[3rem] border border-emerald-100 animate-in fade-in slide-in-from-top-4 duration-700">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] italic leading-none">Mission Successfully Concluded</p>
                                <p className="text-sm text-emerald-800 font-bold italic tracking-tight">Outcome synchronized and verified on {new Date(report.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 shadow-inner group/stat hover:bg-white transition-all duration-500">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 italic">Total Capital Stabilized</p>
                                <p className="text-4xl font-black text-tf-primary tracking-tighter italic tabular-nums leading-none">LKR {Number(report.totalRaised).toLocaleString()}</p>
                            </div>
                            <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 shadow-inner group/stat hover:bg-white transition-all duration-500">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 italic">Community Beneficiaries</p>
                                <p className="text-4xl font-black text-indigo-500 tracking-tighter italic tabular-nums leading-none">{Number(report.beneficiaries).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="space-y-4 px-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Strategic Executive Summary</p>
                            <p className="text-lg text-slate-700 font-bold leading-relaxed italic tracking-tight">{report.summary}</p>
                        </div>

                        {report.evidence?.length > 0 && (
                            <div className="space-y-6">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic ml-4">Verification Artifacts</p>
                                <div className="flex flex-wrap gap-4">
                                    {report.evidence.map((url, i) => (
                                        <a
                                            key={i}
                                            href={url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group/file px-8 py-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 hover:shadow-xl hover:border-tf-primary/20 transition-all duration-500"
                                        >
                                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover/file:bg-tf-primary/10 group-hover/file:text-tf-primary transition-all"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg></div>
                                            <p className="text-[11px] font-black text-slate-600 group-hover/file:text-tf-primary uppercase tracking-widest transition-colors mb-0">Artifact_{i + 1}.LOG</p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : showForm ? (
                    /* Outcome Initialization Interface */
                    <form onSubmit={handleSubmit} className="bg-slate-50 rounded-[3rem] p-12 border border-slate-100 shadow-inner space-y-10 group/form">
                        <div className="flex items-center gap-4 mb-2">
                             <div className="w-2 h-2 rounded-full bg-tf-primary animate-pulse" />
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Final Mission outcome Synchronization</p>
                        </div>

                        <div className="space-y-4">
                             <div className="flex items-center justify-between px-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Executive Impact Summary</label>
                                <button
                                    type="button"
                                    onClick={handleGenerateSummary}
                                    disabled={generatingSummary}
                                    className="px-4 py-2 bg-tf-primary/5 border border-tf-primary/10 rounded-full text-[9px] font-black text-tf-primary uppercase tracking-[0.2em] hover:bg-tf-primary hover:text-white transition-all duration-500 flex items-center gap-3 active:scale-95 disabled:opacity-50 group/ai"
                                >
                                    {generatingSummary ? (
                                        <FiLoader className="animate-spin text-xs" />
                                    ) : (
                                        <FiCpu className="text-xs group-hover/ai:rotate-12 transition-transform" />
                                    )}
                                    {generatingSummary ? 'Synthesizing...' : 'AI Generate Summary'}
                                </button>
                             </div>
                            <textarea
                                name="summary"
                                value={formData.summary}
                                onChange={handleChange}
                                rows={6}
                                placeholder="Summarise the strategic outcomes, long-term impact on the community, and key operational achievements..."
                                className="w-full bg-white border border-slate-100 rounded-[2rem] px-8 py-8 text-sm font-bold text-slate-900 placeholder-slate-200 focus:outline-none focus:border-tf-primary transition-all shadow-sm leading-relaxed min-h-[200px]"
                                required
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-4 italic">Final Capital Stabilization (LKR)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="totalRaised"
                                        value={formData.totalRaised}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full bg-white border border-slate-100 rounded-3xl px-12 py-5 text-2xl font-black text-tf-primary focus:outline-none focus:border-tf-primary transition-all shadow-inner italic tabular-nums tracking-tighter"
                                        required
                                    />
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-200 font-black text-lg group-hover/form:text-tf-primary/20 transition-colors">¤</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-4 italic">Verified Life Contacts</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="beneficiaries"
                                        value={formData.beneficiaries}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className="w-full bg-white border border-slate-100 rounded-3xl px-12 py-5 text-2xl font-black text-indigo-500 focus:outline-none focus:border-indigo-400 transition-all shadow-inner italic tabular-nums tracking-tighter"
                                        required
                                    />
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-200 font-black text-lg group-hover/form:text-indigo-400/20 transition-colors">¶</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-4 italic">Verification Repository</label>
                            <label className="relative flex items-center gap-6 px-10 py-6 bg-white border border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:border-tf-primary hover:bg-tf-primary/5 transition-all duration-500 group/evidence overflow-hidden">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover/evidence:scale-110 group-hover/evidence:bg-white transition-all shadow-inner">
                                    <svg className="w-6 h-6 text-slate-200 group-hover/evidence:text-tf-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black text-slate-900 group-hover/evidence:text-tf-primary transition-colors uppercase tracking-widest leading-none">
                                        {formData.evidence.length > 0 ? `${formData.evidence.length} Protocol Artifacts Prepared` : 'Upload Strategic Evidence'}
                                    </p>
                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic">Verification Logs, Completion Certificates, Impact Records</p>
                                </div>
                                <input type="file" name="evidence" multiple onChange={handleChange} className="hidden" />
                            </label>
                        </div>

                        <div className="flex justify-end gap-6 pt-4">
                            <button
                                type="button"
                                onClick={() => { setShowForm(false); setError(''); }}
                                className="px-10 py-5 bg-white border border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] rounded-[1.5rem] hover:bg-slate-50 hover:text-slate-900 transition-all duration-500 active:scale-95 italic text-center"
                            >
                                Abort Initialization
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-12 py-5 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.5em] rounded-[1.5rem] hover:bg-tf-primary transition-all duration-500 shadow-xl disabled:opacity-50 active:scale-95 flex items-center gap-4"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Finalizing Registry...
                                    </>
                                ) : 'Authorize Outcome'}
                            </button>
                        </div>
                    </form>
                ) : (
                    /* Empty State Interface */
                    <div className="py-24 text-center group/empty">
                        <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 transition-all duration-700 group-hover/empty:rotate-12 group-hover/empty:scale-110 shadow-inner">
                            <svg className="w-10 h-10 text-slate-200 group-hover/empty:text-tf-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h4 className="text-xl font-bold text-slate-400 tracking-tight italic">Null Outcome Log</h4>
                        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.4em] mt-2 italic">Strategic report initialization pending mission completion verification.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
import { useEffect, useState } from 'react';
import api from '../../../api/axios';

export default function CampaignReportSection({ campaignId }) {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700">Campaign Report</h3>
                </div>
                {!loading && !report && !showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-white rounded-lg text-xs font-medium transition-all hover:opacity-90 shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #7C2D12 0%, #DC2626 100%)' }}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Create Report
                    </button>
                )}
            </div>

            <div className="p-6 space-y-4">
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

                {loading ? (
                    <div className="py-8 flex justify-center">
                        <svg className="w-5 h-5 animate-spin text-[#DC2626]" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                    </div>
                ) : report ? (
                    /* Report exists — display it */
                    <div className="space-y-5">
                        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-100 rounded-lg">
                            <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-green-700 font-medium">Report submitted on {new Date(report.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                                <p className={labelCls}>Total Raised</p>
                                <p className="text-xl font-bold text-[#7C2D12]">LKR {Number(report.totalRaised).toLocaleString()}</p>
                            </div>
                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                                <p className={labelCls}>Beneficiaries</p>
                                <p className="text-xl font-bold text-[#DC2626]">{Number(report.beneficiaries).toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Summary */}
                        <div>
                            <p className={labelCls}>Summary</p>
                            <p className="text-sm text-gray-600 leading-relaxed mt-1">{report.summary}</p>
                        </div>

                        {/* Evidence */}
                        {report.evidence?.length > 0 && (
                            <div>
                                <p className={labelCls}>Evidence</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {report.evidence.map((url, i) => (
                                        <a
                                            key={i}
                                            href={url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-100 text-[#DC2626] rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                            </svg>
                                            File {i + 1}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : showForm ? (
                    /* Create report form */
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className={labelCls}>Summary</label>
                            <textarea
                                name="summary"
                                value={formData.summary}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Summarise the campaign outcomes, impact, and key achievements..."
                                className={inputCls}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Total Raised (LKR)</label>
                                <input
                                    type="number"
                                    name="totalRaised"
                                    value={formData.totalRaised}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className={inputCls}
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelCls}>Beneficiaries</label>
                                <input
                                    type="number"
                                    name="beneficiaries"
                                    value={formData.beneficiaries}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className={inputCls}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className={labelCls}>Evidence (images / files)</label>
                            <label className="mt-1 flex items-center gap-3 px-4 py-3 border border-dashed border-gray-200 rounded-lg cursor-pointer bg-white hover:border-red-200 hover:bg-red-50/30 transition-colors group">
                                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                                    <svg className="w-4 h-4 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 group-hover:text-[#DC2626] transition-colors font-medium">
                                        {formData.evidence.length > 0 ? `${formData.evidence.length} file(s) selected` : 'Attach evidence files'}
                                    </p>
                                    <p className="text-xs text-gray-400">Images, PDFs supported</p>
                                </div>
                                <input type="file" name="evidence" multiple onChange={handleChange} className="hidden" />
                            </label>
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                            <button
                                type="button"
                                onClick={() => { setShowForm(false); setError(''); }}
                                className="px-4 py-2 bg-white border border-gray-200 text-gray-500 hover:text-gray-700 rounded-lg text-xs font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center gap-1.5 px-4 py-2 text-white rounded-lg text-xs font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ background: 'linear-gradient(135deg, #7C2D12 0%, #DC2626 100%)' }}
                            >
                                {submitting ? (
                                    <>
                                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Submitting...
                                    </>
                                ) : 'Submit Report'}
                            </button>
                        </div>
                    </form>
                ) : (

                    <div className="py-10 text-center">
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <svg className="w-5 h-5 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-400 font-medium">No report submitted yet.</p>
                        <p className="text-xs text-gray-300 mt-1">Click "Create Report" to submit the final campaign report.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
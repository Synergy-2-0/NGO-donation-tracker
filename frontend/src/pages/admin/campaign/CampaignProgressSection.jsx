import { useEffect, useState } from 'react';
import api from '../../../api/axios';

export default function CampaignProgressSection({ campaignId, campaignStatus }) {
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
                setLogs(Array.isArray(res.data) ? res.data : []);
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

            setLogs((prev) => [res.data, ...prev]);
            setFormData({ description: '', amountRaised: '', beneficiaries: '', evidence: [] });
            setShowForm(false);
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
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#7C2D12]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700">Progress Logs</h3>
                    {logs.length > 0 && (
                        <span className="text-xs text-gray-400 font-medium">{logs.length} entries</span>
                    )}
                </div>
                {campaignStatus === 'active' && !showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-white rounded-lg text-xs font-medium transition-all hover:opacity-90 shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #7C2D12 0%, #DC2626 100%)' }}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Log
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

                {/* Add Log Form */}
                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">New Progress Entry</p>
                        <div>
                            <label className={labelCls}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Describe the progress made..."
                                className={inputCls}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Amount Raised (LKR)</label>
                                <input
                                    type="number"
                                    name="amountRaised"
                                    value={formData.amountRaised}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className={inputCls}
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
                                        Saving...
                                    </>
                                ) : 'Save Log'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Logs Timeline */}
                {loading ? (
                    <div className="py-8 flex justify-center">
                        <svg className="w-5 h-5 animate-spin text-[#DC2626]" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="py-10 text-center">
                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <svg className="w-5 h-5 text-orange-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-400 font-medium">No progress logs yet.</p>
                        {campaignStatus === 'active' && (
                            <p className="text-xs text-gray-300 mt-1">Add the first log entry above.</p>
                        )}
                    </div>
                ) : (
                    <div className="relative space-y-4 pl-4">
                        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-100" />
                        {logs.map((log, i) => (
                            <div key={log._id ?? i} className="relative flex gap-4">
                                <div className="w-3.5 h-3.5 rounded-full bg-[#DC2626] border-2 border-white shadow shrink-0 mt-1 z-10" />
                                <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-4 hover:border-red-100 transition-colors">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <p className="text-sm text-gray-700 leading-relaxed">{log.description}</p>
                                        <p className="text-[10px] text-gray-400 font-medium shrink-0">
                                            {new Date(log.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {log.amountRaised > 0 && (
                                            <span className="text-xs font-semibold text-[#7C2D12] bg-orange-50 px-2 py-0.5 rounded-full">
                                                LKR {log.amountRaised.toLocaleString()} raised
                                            </span>
                                        )}
                                        {log.beneficiaries > 0 && (
                                            <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                                                {log.beneficiaries} beneficiaries
                                            </span>
                                        )}
                                        {log.evidence?.length > 0 && (
                                            <span className="text-xs text-gray-400 font-medium">
                                                {log.evidence.length} file(s) attached
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
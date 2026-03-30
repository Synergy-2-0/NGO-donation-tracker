import { useState, useEffect } from 'react';
import { FiX, FiCheck, FiInfo, FiTag, FiDollarSign, FiFileText, FiTarget, FiCalendar, FiShield } from 'react-icons/fi';
import api from '../api/axios';

const PARTNERSHIP_TYPES = ['financial', 'in-kind', 'skills-based', 'hybrid'];

export default function PartnershipFormModal({ onClose, onSave, initialCampaignId }) {
    const [campaigns, setCampaigns] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [form, setForm] = useState({
        campaignId: initialCampaignId || '',
        title: '',
        partnershipType: 'financial', // maps to agreementType in backend
        totalValue: '',
        description: '',
        startDate: '',
        endDate: '',
        terms: 'I agree to the partnership terms and mission objectives.',
    });

    const [error, setError] = useState('');

    useEffect(() => {
        async function loadCampaigns() {
            setFetching(true);
            try {
                const res = await api.get('/api/campaigns');
                const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                setCampaigns(list.filter(c => c.status === 'published' || c.status === 'active'));
            } catch (err) {
                console.error("Failed to load campaigns", err);
            } finally {
                setFetching(false);
            }
        }
        loadCampaigns();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.campaignId) return setError('Please select a campaign mission.');
        if (!form.title.trim()) return setError('Please enter a title for this agreement.');
        if (!form.startDate || !form.endDate) return setError('Please select both start and end dates.');
        if (!form.totalValue || Number(form.totalValue) <= 0) return setError('Please enter a valid amount.');
        
        setError('');
        
        // Map frontend fields to backend requirements
        const payload = {
            ...form,
            agreementType: form.partnershipType, // Map to required backend field
            totalValue: Number(form.totalValue)
        };
        
        onSave(payload);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-left">
            <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn">
                <div className="flex items-center justify-between p-8 border-b border-slate-50 shrink-0">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[.2em] text-slate-400 mb-1">New Agreement</p>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Propose Partnership</h3>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-rose-50 rounded-2xl text-slate-400 hover:text-rose-500 transition-all active:scale-90">
                        <FiX className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-none">
                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                           <FiInfo className="shrink-0" /> {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title Field */}
                        <div className="md:col-span-2 space-y-2 group">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-brand-red transition-colors flex items-center gap-1.5">
                                <FiFileText /> Agreement Title
                            </label>
                            <input 
                                type="text"
                                placeholder="e.g. 2024 Educational Support Alliance"
                                value={form.title}
                                onChange={e => setForm({...form, title: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-brand-red/5 transition-all"
                            />
                        </div>

                        {/* Campaign Selection */}
                        <div className="md:col-span-2 space-y-2 group">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-brand-red transition-colors flex items-center gap-1.5">
                                <FiTarget /> Select Campaign Mission
                            </label>
                            <select 
                                value={form.campaignId}
                                disabled={!!initialCampaignId || fetching}
                                onChange={e => setForm({...form, campaignId: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-brand-red/5 transition-all appearance-none cursor-pointer disabled:opacity-60"
                            >
                                <option value="">{fetching ? 'Loading missions...' : 'Choose a mission...'}</option>
                                {campaigns.map(c => (
                                    <option key={c._id} value={c._id}>{c.title}</option>
                                ))}
                            </select>
                        </div>

                        {/* Partnership Type */}
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-brand-red transition-colors flex items-center gap-1.5">
                                <FiTag /> Partnership Type
                            </label>
                            <select 
                                value={form.partnershipType}
                                onChange={e => setForm({...form, partnershipType: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-brand-red/5 transition-all appearance-none cursor-pointer"
                            >
                                {PARTNERSHIP_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)} Support</option>)}
                            </select>
                        </div>

                        {/* Amount */}
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-brand-red transition-colors flex items-center gap-1.5">
                                <FiDollarSign /> Promised Amount (LKR)
                            </label>
                            <input 
                                type="number"
                                placeholder="e.g. 500000"
                                value={form.totalValue}
                                onChange={e => setForm({...form, totalValue: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-brand-red/5 transition-all"
                            />
                        </div>

                        {/* Start Date */}
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-brand-red transition-colors flex items-center gap-1.5">
                                <FiCalendar /> Commitment Start
                            </label>
                            <input 
                                type="date"
                                value={form.startDate}
                                onChange={e => setForm({...form, startDate: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-brand-red/5 transition-all"
                            />
                        </div>

                        {/* End Date */}
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-brand-red transition-colors flex items-center gap-1.5">
                                <FiCalendar /> Commitment End
                            </label>
                            <input 
                                type="date"
                                value={form.endDate}
                                onChange={e => setForm({...form, endDate: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-brand-red/5 transition-all"
                            />
                        </div>

                        {/* Terms checkbox */}
                        <div className="md:col-span-2 pt-2">
                             <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors group">
                                <div className="mt-0.5">
                                    <input 
                                      type="checkbox" 
                                      required 
                                      className="w-4 h-4 rounded border-slate-300 text-brand-red focus:ring-brand-red"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><FiShield /> Terms & Protocol</p>
                                    <p className="text-xs font-bold text-slate-600 mt-1 leading-relaxed">
                                        I confirm that the institutional data provided is accurate and I agree to fulfill the commitments specified in this mission alliance.
                                    </p>
                                </div>
                             </label>
                        </div>

                        <div className="md:col-span-2 space-y-2 group">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-brand-red transition-colors flex items-center gap-1.5">
                                <FiFileText /> Agreement Notes
                            </label>
                            <textarea 
                                rows="3"
                                placeholder="Details about this partnership..."
                                value={form.description}
                                onChange={e => setForm({...form, description: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-brand-red/5 transition-all resize-none"
                            />
                        </div>
                    </div>
                </form>

                <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="flex-1 px-8 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={fetching} className="flex-2 px-8 py-4 bg-brand-red text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-red/90 shadow-xl shadow-brand-red/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
                        {fetching ? 'Synchronizing...' : 'Submit Proposal'} <FiCheck className="text-sm stroke-[3]" />
                    </button>
                </div>
            </div>
        </div>
    );
}

import { useEffect, useState } from 'react';
import { 
  FiTarget, FiPieChart, FiTrendingUp, FiCheckCircle, 
  FiLayout, FiActivity, FiBriefcase, FiDollarSign,
  FiCalendar, FiHash, FiFeather, FiAlertTriangle, FiX, FiGlobe
} from 'react-icons/fi';
import { usePartner } from '../context/PartnerContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';

const SDG_PILLARS = [
    { id: 1, label: 'No Poverty', color: 'bg-red-500', sdg: 1 },
    { id: 2, label: 'Zero Hunger', color: 'bg-amber-600', sdg: 2 },
    { id: 3, label: 'Good Health', color: 'bg-emerald-500', sdg: 3 },
    { id: 4, label: 'Quality Education', color: 'bg-rose-600', sdg: 4 },
    { id: 5, label: 'Gender Equality', color: 'bg-orange-500', sdg: 5 },
    { id: 6, label: 'Clean Water', color: 'bg-sky-500', sdg: 6 },
    { id: 13, label: 'Climate Action', color: 'bg-emerald-700', sdg: 13 },
];

export default function PartnerCsrHubPage() {
    const { currentPartner, fetchPartnerById, updatePartner, loading, error, setError } = usePartner();
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState({
        organizationName: '',
        industry: '',
        sdgGoals: [],
        partnershipPreferences: {
            budgetRange: { min: 0, max: 10000000 },
        }
    });

    useEffect(() => {
        // Clear errors from previous sessions on mount Hub
        setError(null);
        fetchPartnerById('me').then(data => {
            if (data) {
                setForm({
                    organizationName: data.organizationName || '',
                    industry: data.industry || '',
                    sdgGoals: Array.isArray(data.sdgGoals) ? data.sdgGoals : [],
                    partnershipPreferences: {
                        budgetRange: data.partnershipPreferences?.budgetRange || { min: 0, max: 10000000 },
                    }
                });
            }
        }).catch(() => {});
    }, [fetchPartnerById, setError]);

    const togglePillar = (pillarId) => {
        setForm(prev => {
            const exists = prev.sdgGoals.includes(pillarId);
            return {
                ...prev,
                sdgGoals: exists 
                    ? prev.sdgGoals.filter(p => p !== pillarId)
                    : [...prev.sdgGoals, pillarId]
            };
        });
    };

    const handleSave = async () => {
        setSuccess('');
        setError(null);
        try {
            await updatePartner(currentPartner._id, {
                organizationName: form.organizationName,
                industry: form.industry,
                sdgGoals: form.sdgGoals,
                partnershipPreferences: form.partnershipPreferences
            });
            setSuccess('Institutional CSR strategy synchronized successfully.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            // Error handling is managed by PartnerContext which sets global 'error'
        }
    };

    if (loading && !currentPartner) return <LoadingSpinner message="Opening CSR Configuration Hub..." />;

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-soft pt-6 text-left">
            {/* CSR Profile Summary */}
            <section className="bg-slate-900 rounded-[40px] p-10 md:p-14 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-tf-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
                <div className="space-y-6 flex-1 text-left relative z-10">
                   <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                      <FiTarget className="text-tf-primary" />
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest  leading-none">Corporate Social Responsibility Hub Sync</span>
                   </div>
                   <h1 className="text-5xl font-extrabold text-white tracking-tighter  leading-tight">
                     CSR <span className="text-tf-primary">Preferences</span> Hub
                   </h1>
                   <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl ">
                     Configure your organization's mission priority sectors to enhance AI matching and automated collaboration proposals Hub.
                   </p>
                </div>
                <div className="w-full lg:w-96 p-8 bg-white/5 backdrop-blur-md rounded-[32px] text-white space-y-8 relative shadow-2xl border border-white/5">
                   <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 ">Institutional Asset Accuracy</p>
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-tf-primary/10 border border-tf-primary/20 flex items-center justify-center text-tf-primary text-2xl animate-pulse">
                        <FiPieChart />
                      </div>
                      <div>
                         <h4 className="text-4xl font-extrabold  tracking-tight tabular-nums">100<span className="text-tf-primary">%</span></h4>
                         <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest ">Verified Network Linkage</p>
                      </div>
                   </div>
                </div>
            </section>

            {(error || success) && (
                <div className="px-4">
                    {error && (
                        <div className="flex items-center justify-between gap-3 bg-red-50/50 border border-red-100 text-red-600 px-6 py-4 rounded-3xl animate-shake">
                            <div className="flex items-center gap-3">
                                <FiAlertTriangle className="text-xl shrink-0" />
                                <p className="text-sm font-bold">{error}</p>
                            </div>
                            <button onClick={() => setError(null)} className="hover:text-slate-900"><FiX /></button>
                        </div>
                    )}
                    {success && (
                        <div className="flex items-center justify-between gap-3 bg-emerald-50/50 border border-emerald-100 text-emerald-700 px-6 py-4 rounded-3xl animate-fadeIn">
                            <div className="flex items-center gap-3">
                                <FiCheckCircle className="text-xl shrink-0" />
                                <p className="text-sm font-bold">{success}</p>
                            </div>
                            <button onClick={() => setSuccess('')} className="ml-auto hover:text-slate-900"><FiX /></button>
                        </div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Sector Prioritization */}
                <div className="lg:col-span-8 bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm space-y-10 group text-left">
                   <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight  leading-none">Aligned SDG Pillars</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2  leading-none">Map institutional logic to global goals Hub</p>
                      </div>
                      <FiLayout className="text-slate-300" />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {SDG_PILLARS.map((pillar) => {
                            const isActive = form.sdgGoals.includes(pillar.id);
                            return (
                                <button
                                    key={pillar.id}
                                    onClick={() => togglePillar(pillar.id)}
                                    className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all duration-500 group/item ${
                                        isActive 
                                            ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/10' 
                                            : 'bg-white border-slate-100 hover:border-slate-300'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${pillar.color} shadow-lg shrink-0 group-hover/item:scale-110 transition-transform`}>
                                        <span className="font-extrabold text-xs">{pillar.sdg}</span>
                                    </div>
                                    <div className="text-left">
                                        <p className={`text-xs font-extrabold uppercase tracking-widest ${isActive ? 'text-tf-primary' : 'text-slate-400'}`}>SDG {pillar.sdg}</p>
                                        <p className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-800'}`}>{pillar.label}</p>
                                    </div>
                                    {isActive && <FiCheckCircle className="ml-auto text-tf-primary text-xl" />}
                                </button>
                            );
                        })}
                   </div>

                   {/* Investment Ceilings */}
                   <div className="pt-10 border-t border-slate-50 space-y-8">
                       <div className="flex items-center justify-between">
                           <h3 className="text-xl font-extrabold text-slate-900  tracking-tight">Investment Ceiling</h3>
                           <FiDollarSign className="text-slate-300" />
                       </div>
                       <div className="space-y-6">
                           <div className="flex justify-between items-end">
                               <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Max Grant Scale (LKR)</label>
                               <span className="text-2xl font-extrabold text-slate-900 tracking-tighter">{(form.partnershipPreferences?.budgetRange?.max || 0).toLocaleString()}</span>
                           </div>
                           <input 
                               type="range" 
                               min="100000" 
                               max="50000000" 
                               step="500000"
                               value={form.partnershipPreferences?.budgetRange?.max || 100000}
                               onChange={(e) => setForm(prev => ({ 
                                   ...prev, 
                                   partnershipPreferences: { 
                                       ...prev.partnershipPreferences, 
                                       budgetRange: { ...prev.partnershipPreferences.budgetRange, max: parseInt(e.target.value) } 
                                   } 
                               }))}
                               className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-tf-primary" 
                           />
                       </div>
                   </div>
                </div>

                <div className="lg:col-span-4 space-y-10">
                   {/* Entity Profile */}
                   <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm text-left">
                      <h3 className="text-lg font-extrabold  tracking-tight mb-6">Entity Profile Hub</h3>
                      <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Corporate Identity</label>
                            <input 
                               value={form.organizationName}
                               onChange={(e) => setForm(prev => ({ ...prev, organizationName: e.target.value }))}
                               placeholder="EcoSavior Logistics Hub"
                               className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white outline-none transition-all placeholder:text-slate-300" 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Industry Vector</label>
                            <input 
                               value={form.industry}
                               onChange={(e) => setForm(prev => ({ ...prev, industry: e.target.value }))}
                               placeholder="Supply Chain Tech"
                               className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white outline-none transition-all placeholder:text-slate-300" 
                            />
                         </div>
                      </div>
                   </div>

                   {/* Save HUB */}
                   <button 
                      onClick={handleSave}
                      disabled={loading}
                      className="w-full py-6 bg-tf-primary text-white rounded-[32px] text-xs font-extrabold uppercase tracking-[0.3em] hover:bg-slate-900 shadow-2xl shadow-tf-primary/20 transition-all flex items-center justify-center gap-3 active:scale-95 group"
                   >
                      {loading ? 'SYNCHRONIZING...' : 'SYNCHRONIZE HUB'}
                      <FiGlobe className="text-xl group-hover:rotate-180 transition-transform duration-1000" />
                   </button>

                   <div className="bg-slate-50 rounded-[40px] p-10 text-slate-500 text-[10px] font-bold uppercase tracking-widest text-center leading-relaxed">
                      Preferences are processed by the network engine to optimize partnership matching and automated proposal generation Hub.
                   </div>
                </div>
            </div>
        </div>
    );
}

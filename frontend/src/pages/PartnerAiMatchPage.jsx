import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiZap, FiTarget, FiGlobe, FiBriefcase, FiArrowRight, 
  FiTerminal, FiCompass, FiSearch, FiActivity, FiShield, FiCpu, FiX, FiAlertTriangle
} from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import MapboxMap from '../components/MapboxMap';
import { usePartner } from '../context/PartnerContext';
import api from '../api/axios';
import { useTranslation } from 'react-i18next';

export default function PartnerAiMatchPage() {
    const navigate = useNavigate();
    const { currentPartner, fetchPartnerById } = usePartner();
    const { t } = useTranslation();
    const [campaigns, setCampaigns] = useState([]);
    const [analyzing, setAnalyzing] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
             try {
                await fetchPartnerById('me');
                const campaignsData = await api.get('/api/campaigns?status=active').then(res => res.data);
                setCampaigns(Array.isArray(campaignsData) ? campaignsData : (campaignsData?.data || []));
             } catch (err) {
                setError(t('ai_match.errors.sync_failed'));
             } finally {
                setAnalyzing(false);
             }
        };
        load();
    }, [fetchPartnerById]);

    const suggestions = useMemo(() => {
        if (!currentPartner || !campaigns.length) return [];
        
        // Combine legacy string-based focus with modern numeric SDG goals Hub
        const partnerSdgs = [
            ...(Array.isArray(currentPartner.csrFocus) ? currentPartner.csrFocus.map(String) : []),
            ...(Array.isArray(currentPartner.sdgGoals) ? currentPartner.sdgGoals.map(String) : [])
        ];
        
        return campaigns.map(campaign => {
            let score = 50;
            const campaignSdgs = Array.isArray(campaign.sdgAlignment) ? campaign.sdgAlignment.map(String) : [];
            
            const overlap = campaignSdgs.filter(sdg => partnerSdgs.includes(sdg));
            score += Math.min(overlap.length * 15, 30);
            
            if (campaign.allowPledges) score += 5;
            
            const progress = (campaign.raisedAmount || 0) / (campaign.goalAmount || 1);
            if (progress < 0.2) score += 10;
            
            return {
                ...campaign,
                synergyScore: Math.min(score, 99),
                reason: overlap.length > 0 
                    ? t('ai_match.reasons.csr', { count: overlap.length }) 
                    : t('ai_match.reasons.scale')
            };
        }).sort((a, b) => b.synergyScore - a.synergyScore).slice(0, 3);
    }, [currentPartner, campaigns]);

    const geoData = useMemo(() => ({
        features: campaigns
            .filter(c => Array.isArray(c.location?.coordinates?.coordinates) && c.location.coordinates.coordinates.length >= 2)
            .map(c => ({
                geometry: { coordinates: c.location.coordinates.coordinates },
                properties: { 
                    name: c.title, 
                    city: c.location.city || 'Global Hub', 
                    focus: (c.description || '').slice(0, 50) + '...',
                    trustScore: Math.floor(Math.random() * (99 - 85 + 1) + 85)
                }
            }))
    }), [campaigns]);

    if (analyzing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-10 animate-fadeIn">
              <div className="relative">
                <div className="w-32 h-32 border-4 border-slate-900 border-t-tf-primary rounded-full animate-spin shadow-2xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <FiCpu className="text-4xl text-slate-900 animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-3">
                 <h2 className="text-2xl font-black italic tracking-tighter text-slate-900">{t('ai_match.loading.title')}</h2>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">{t('ai_match.loading.subtitle')}</p>
              </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-fadeIn text-left">
            
            {/* AI Hero */}
            <section className="relative overflow-hidden bg-white border border-slate-100 rounded-[40px] p-10 md:p-14 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                <div className="absolute top-0 right-0 w-96 h-96 bg-tf-primary/5 rounded-full blur-[100px] -mr-40 -mt-40" />
                <div className="space-y-6 flex-1 relative z-10">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full">
                       <FiZap className="text-tf-primary" />
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-none">{t('ai_match.hero.badge')}</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter italic leading-none">
                       {t('ai_match.hero.title_part_1', {defaultValue: 'AI'})} <span className="text-tf-primary">{t('ai_match.hero.synergy', {defaultValue: 'Synergy'})}</span> {t('ai_match.hero.matchmaker', {defaultValue: 'Matchmaker'})}
                    </h1>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xl italic">
                       {t('ai_match.hero.subtitle')}
                    </p>
                </div>
            </section>

            {error && (
                 <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl flex items-center gap-4 text-rose-700 font-bold mx-4">
                    <FiAlertTriangle className="text-xl" />
                    <span>{error}</span>
                 </div>
            )}

            {/* Suggestions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                {suggestions.map((mission, idx) => (
                    <motion.div
                        key={mission._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 bg-slate-900 text-white rounded-[24px] flex items-center justify-center text-2xl shadow-xl group-hover:bg-tf-primary transition-colors">
                                <FiTarget />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t('ai_match.grid.synergy')}</p>
                                <p className="text-3xl font-black italic tracking-tighter text-slate-900">{mission.synergyScore}%</p>
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 italic tracking-tight leading-tight mb-2 pr-4">{mission.title}</h3>
                        <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-4">{t('ai_match.grid.ngo')}: {mission.createdBy?.name || 'Verified Alliance'}</p>
                        
                        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 mb-6 flex-1">
                            <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                                {mission.reason}
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                            <div className="flex -space-x-2">
                                {[1,2,3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                                        {String.fromCharCode(64+i)}
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => navigate('/partner/agreements', { state: { prefillCampaignId: mission._id } })}
                                className="text-tf-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform"
                            >
                                {t('ai_match.grid.initialize_sync')} <FiArrowRight />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Global Explorer Map */}
            <div className="px-4">
                <div className="bg-slate-50 border border-slate-100 rounded-[40px] p-10 flex flex-col items-center justify-center space-y-6 text-center lg:text-left lg:flex-row lg:justify-between lg:px-20 relative overflow-hidden min-h-[500px]">
                    <div className="relative z-10 space-y-4">
                    <h3 className="text-3xl font-black text-slate-900 italic tracking-tight leading-none">{t('ai_match.map.title')}</h3>
                    <p className="text-slate-500 text-sm font-medium italic max-w-sm mb-8">{t('ai_match.map.subtitle')}</p>
                    
                    <div className="w-full lg:w-[600px] h-[350px] shadow-2xl rounded-3xl overflow-hidden border-4 border-white">
                        <MapboxMap data={geoData} />
                    </div>
                    </div>
                    <div className="relative z-10 flex flex-col gap-4">
                    <div className="p-6 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-xs">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('ai_match.map.density')}</p>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-tf-primary w-3/4" />
                        </div>
                        <p className="text-[9px] font-bold text-slate-500 mt-2 italic">{t('ai_match.map.coverage', { percent: 75 })}</p>
                    </div>
                    <button 
                        onClick={() => navigate('/transparency')}
                        className="px-10 py-5 bg-slate-900 text-white border border-slate-200 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-xl group"
                    >
                        {t('ai_match.map.expand')} <FiGlobe className="group-hover:rotate-180 transition-transform duration-1000" />
                    </button>
                    </div>
                </div>
            </div>

        </div>
    );
}

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiGlobe, FiSearch, FiMapPin, FiUsers, FiTarget, FiHeart, FiBriefcase } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const SDG_TITLES = {
    1:'No Poverty',2:'Zero Hunger',3:'Good Health',4:'Quality Education',5:'Gender Equality',
    6:'Clean Water',7:'Affordable Energy',8:'Decent Work',9:'Industry & Innovation',10:'Reduced Inequality',
    11:'Sustainable Cities',12:'Responsible Consumption',13:'Climate Action',14:'Life Below Water',
    15:'Life on Land',16:'Peace & Justice',17:'Partnerships',
};

export default function CampaignMarketplacePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSdg, setSelectedSdg] = useState('all');

    useEffect(() => {
        api.get('/api/campaigns?status=active')
            .then(res => setCampaigns(Array.isArray(res.data) ? res.data : (res.data?.data || [])))
            .catch(err => setError(err.response?.data?.message || 'Failed to load active campaigns.'))
            .finally(() => setLoading(false));
    }, []);

    const handleProposePartnership = (campaignId) => {
        navigate('/partner/agreements', { state: { prefillCampaignId: campaignId } });
    };

    const filteredCampaigns = useMemo(() => {
        return campaigns.filter(c => {
            const matchesSearch = c.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  c.description?.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesSdg = selectedSdg === 'all' || (c.sdgAlignment && c.sdgAlignment.includes(parseInt(selectedSdg)));
            
            return matchesSearch && matchesSdg;
        });
    }, [campaigns, searchQuery, selectedSdg]);

    // Extract unique SDGs present in active campaigns for the filter
    const availableSdgs = useMemo(() => {
        const sdgSet = new Set();
        campaigns.forEach(c => {
            if (c.sdgAlignment && Array.isArray(c.sdgAlignment)) {
                c.sdgAlignment.forEach(sdg => sdgSet.add(sdg));
            }
        });
        return Array.from(sdgSet).sort((a, b) => a - b);
    }, [campaigns]);

    if (loading) return <LoadingSpinner message={t('marketplace.loading')} />;

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20 font-sans">
            
            {/* Page Header */}
            <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-8 md:p-12 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-tf-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
                
                <div className="relative z-10 max-w-2xl">
                    <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-slate-500 mb-2">{t('marketplace.header.badge')}</p>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        {t('marketplace.header.title_1')} <span className="text-tf-primary">{t('marketplace.header.title_2')}</span>
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base mt-4 font-medium leading-relaxed">
                        {t('marketplace.header.subtitle')}
                    </p>
                </div>
            </div>

            {/* Filtering and Search */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
                
                {/* Search Bar */}
                <div className="flex-1 w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 flex items-center gap-3 focus-within:border-tf-primary/50 focus-within:bg-white transition-all shadow-inner">
                    <FiSearch className="text-slate-400 text-lg" />
                    <input 
                        type="text" 
                        placeholder={t('marketplace.search')} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-900 placeholder:text-slate-400 w-full outline-none"
                    />
                </div>

                {/* SDG Filter */}
                <div className="w-full md:w-auto flex flex-col gap-2 shrink-0 overflow-hidden">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-1">Filter by Goal</p>
                    <div className="flex overflow-x-auto gap-2 pb-2 -mb-2 scrollbar-hide">
                        <button 
                            onClick={() => setSelectedSdg('all')}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest whitespace-nowrap transition-all ${
                                selectedSdg === 'all' 
                                    ? 'bg-slate-900 text-white shadow-lg' 
                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                            }`}
                        >
                            {t('marketplace.all_goals')}
                        </button>
                        {availableSdgs.map(sdg => (
                            <button 
                                key={sdg}
                                onClick={() => setSelectedSdg(sdg.toString())}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest whitespace-nowrap transition-all ${
                                    selectedSdg === sdg.toString()
                                        ? 'bg-slate-900 text-white shadow-lg' 
                                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                                }`}
                            >
                                SDG {sdg}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}

            {/* Campaign Grid */}
            <AnimatePresence mode='wait'>
                {filteredCampaigns.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        className="bg-white py-24 rounded-[32px] border border-slate-100 shadow-sm text-center"
                    >
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl mx-auto flex items-center justify-center text-slate-300 mb-6">
                            <FiTarget size={32} />
                        </div>
                        <p className="text-slate-900 font-extrabold text-lg">{t('marketplace.no_results')}</p>
                        <p className="text-slate-500 text-sm font-medium mt-2">{t('marketplace.adjust_filters')}</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCampaigns.map((campaign, idx) => {
                            const progress = Math.min(Math.round(((campaign.raisedAmount || 0) / (campaign.goalAmount || 1)) * 100), 100);
                            const imageUrl = campaign.image ? (campaign.image.startsWith('http') ? campaign.image : (campaign.image.startsWith('/') ? campaign.image : `/${campaign.image}`)) : null;

                            return (
                                <motion.div 
                                    key={campaign._id} 
                                    initial={{ opacity: 0, y: 20 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-shadow flex flex-col group"
                                >
                                    {/* Card Header / Image */}
                                    <div className="h-48 bg-slate-100 relative overflow-hidden">
                                        {imageUrl ? (
                                            <img src={imageUrl} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center opacity-70">
                                                <FiGlobe className="text-5xl text-slate-300" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[9px] font-extrabold uppercase tracking-widest text-slate-900 shadow-sm flex items-center gap-1.5">
                                            <FiMapPin className="text-[10px] text-tf-primary" />
                                            {campaign.location?.city || campaign.location?.country || 'Global'}
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        
                                        {/* SDGs */}
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {campaign.sdgAlignment && campaign.sdgAlignment.slice(0, 2).map(sdg => (
                                                <span key={sdg} className="px-2 py-1 bg-slate-50 border border-slate-100 text-slate-500 rounded-lg text-[8px] font-extrabold uppercase tracking-widest truncate max-w-[120px]">
                                                    {SDG_TITLES[sdg] || `SDG ${sdg}`}
                                                </span>
                                            ))}
                                            {campaign.sdgAlignment && campaign.sdgAlignment.length > 2 && (
                                                <span className="px-2 py-1 bg-slate-50 border border-slate-100 text-slate-400 rounded-lg text-[8px] font-extrabold uppercase tracking-widest">
                                                    +{campaign.sdgAlignment.length - 2}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-extrabold text-slate-900 leading-tight mb-2 line-clamp-2 group-hover:text-tf-primary transition-colors">
                                            {campaign.title}
                                        </h3>
                                        
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2 mb-6">
                                            {campaign.description}
                                        </p>

                                        {/* Progress Section */}
                                        <div className="mt-auto space-y-4">
                                            <div className="flex justify-between items-end mb-2">
                                                <div>
                                                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{t('marketplace.raised')}</p>
                                                    <p className="text-sm font-extrabold text-slate-900">
                                                        LKR {(campaign.raisedAmount || 0).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-extrabold text-tf-primary tabular-nums tracking-tight leading-none">
                                                        {progress}%
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden shadow-inner">
                                                <div 
                                                    className="h-full bg-tf-primary rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                                                <span>{t('marketplace.goal')}: LKR {(campaign.goalAmount || 0).toLocaleString()}</span>
                                                <span className="flex items-center gap-1"><FiUsers /> {Number(campaign.targetBeneficiaries || 0).toLocaleString()} {t('marketplace.target')}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-50">
                                            {user?.role === 'partner' ? (
                                                <button 
                                                    onClick={() => handleProposePartnership(campaign._id)}
                                                    className="col-span-2 py-3 bg-slate-900 hover:bg-tf-primary text-white rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2"
                                                >
                                                    <FiBriefcase className="text-sm" /> {t('marketplace.propose_partnership')}
                                                </button>
                                            ) : user?.role === 'donor' ? (
                                                <Link 
                                                    to={`/causes/${campaign._id}`}
                                                    className="col-span-2 py-3 bg-tf-primary hover:bg-orange-600 text-white rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-tf-primary/20 flex items-center justify-center gap-2"
                                                >
                                                    <FiHeart className="text-sm" /> {t('marketplace.support_campaign')}
                                                </Link>
                                            ) : null}
                                            
                                            <Link 
                                                to={`/causes/${campaign._id}`}
                                                className={`py-3 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-600 text-[10px] font-extrabold uppercase tracking-widest rounded-xl text-center flex items-center justify-center transition-all ${(!user || (user.role !== 'partner' && user.role !== 'donor')) ? 'col-span-2' : 'col-span-2'}`}
                                            >
                                                {t('marketplace.view_details')}
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

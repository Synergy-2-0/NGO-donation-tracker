import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { Link, useNavigate } from 'react-router-dom';
import { usePartnerOperations } from '../context/PartnerOperationsContext';
import { FiArrowRight, FiTarget, FiActivity, FiSearch, FiFilter, FiHeart, FiExternalLink, FiImage } from 'react-icons/fi';

export default function CampaignMarketplacePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { fetchPartnerProfile } = usePartnerOperations();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [partnerProfile, setPartnerProfile] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (user?.role === 'partner') {
            fetchPartnerProfile().then(res => setPartnerProfile(res)).catch(() => {});
        }
        
        api.get('/api/campaigns?status=active')
            .then(res => setCampaigns(Array.isArray(res.data) ? res.data : (res.data?.data || [])))
            .catch(err => setError(err.response?.data?.message || 'Failed to load live campaigns.'))
            .finally(() => setLoading(false));
    }, [user, fetchPartnerProfile]);

    const handleProposePartnership = (campaignId) => {
        navigate('/partner/agreements', { state: { prefillCampaignId: campaignId } });
    };

    const filtered = campaigns.filter(c => 
        c.title?.toLowerCase().includes(search.toLowerCase()) || 
        c.category?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner message="Scanning global mission boards..." />
      </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fadeIn text-left">
            {/* Header */}
            <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-8 md:p-10 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[.2em] text-slate-400 mb-2">Funding Opportunities</p>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            Impact <span className="text-brand-red">Marketplace</span>
                        </h2>
                        <p className="text-slate-400 text-sm mt-2 max-w-xl font-medium">
                            Discover active ground operations seeking strategic institutional partnerships and verified funding.
                        </p>
                    </div>
                </div>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl flex items-center gap-3 font-semibold shadow-sm animate-pulse">
                <FiActivity className="shrink-0" /> {error}
              </div>
            )}

            {/* Filter Bar */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-5 flex flex-col md:flex-row items-center gap-4">
               <div className="flex-1 w-full relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by mission title or category..." 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-brand-red/5 transition-all"
                  />
               </div>
               <div className="flex items-center gap-2 w-full md:w-auto">
                  <button className="px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                    <FiFilter /> All Domains
                  </button>
               </div>
            </div>

            {filtered.length === 0 ? (
                <div className="py-24 bg-white rounded-[40px] border border-slate-100 shadow-sm text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                        <FiTarget className="text-3xl" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">Zero Operations Detected</h3>
                    <p className="text-slate-500 text-sm font-medium">There are no active missions matching your protocol parameters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map(campaign => {
                        const progress = campaign.fundingGoal > 0 ? ((campaign.currentFunding || 0) / campaign.fundingGoal) * 100 : 0;
                        
                        return (
                            <div key={campaign._id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 group flex flex-col overflow-hidden text-left relative">
                                <div className="h-56 bg-slate-100 relative overflow-hidden shrink-0">
                                    {campaign.image ? (
                                        <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-300">
                                            <FiImage className="text-4xl stroke-[1]" />
                                        </div>
                                    )}
                                    <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-lg border border-white/50">
                                        {campaign.category || 'General'}
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col space-y-6">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-brand-red transition-colors line-clamp-2">{campaign.title}</h3>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-3">
                                            {campaign.description}
                                        </p>
                                    </div>
                                    
                                    <div className="mt-auto space-y-4">
                                        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
                                            <div className="flex justify-between items-end mb-3">
                                                <div>
                                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inbound Liquidity</p>
                                                   <p className="text-base font-black text-slate-900 tracking-tighter">LKR {(campaign.currentFunding || 0).toLocaleString()}</p>
                                                </div>
                                                <div className="text-right">
                                                   <p className="text-[10px] font-black text-brand-red uppercase tracking-widest">Target Objective</p>
                                                   <p className="text-sm font-bold text-slate-600">LKR {(campaign.fundingGoal || 0).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="w-full h-2.5 bg-slate-200/50 rounded-full overflow-hidden border border-slate-200/50">
                                                <div className="h-full bg-gradient-to-r from-brand-orange to-brand-red transition-all duration-1000" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{Math.min(progress, 100).toFixed(1)}% Accomplished</p>
                                        </div>
                                        
                                        {user?.role === 'partner' && (
                                            <button 
                                                onClick={() => handleProposePartnership(campaign._id)}
                                                className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-brand-red text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-slate-900/10 hover:shadow-brand-red/20"
                                            >
                                                <FiTarget className="text-sm" /> Propose Alliance Alliance Alliance Partnership
                                            </button>
                                        )}
                                        {user?.role === 'donor' && (
                                            <Link 
                                                to={`/donations/new?campaign=${campaign._id}`}
                                                className="w-full flex items-center justify-center gap-2 py-4 bg-brand-red hover:bg-brand-red/90 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-brand-red/20"
                                            >
                                                <FiHeart className="text-sm" /> Pledge Liquidity
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

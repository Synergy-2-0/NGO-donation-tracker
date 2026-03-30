import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { Link, useNavigate } from 'react-router-dom';
import { usePartnerOperations } from '../context/PartnerOperationsContext';

export default function CampaignMarketplacePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { fetchPartnerProfile } = usePartnerOperations();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [partnerProfile, setPartnerProfile] = useState(null);

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
        // Navigates to Partnership Ops page with state to auto-open Draft Modal
        navigate('/partner/agreements', { state: { prefillCampaignId: campaignId } });
    };

    if (loading) return <LoadingSpinner message="Scanning active global campaigns..." />;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10 font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-[#1E293B] tracking-tight">
                        Impact <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-500">Marketplace</span>
                    </h2>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
                        Discover & Fund Verified Ground Operations
                    </p>
                </div>
            </div>

            {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}

            {campaigns.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-md p-24 rounded-[40px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
                    <p className="text-gray-400 font-bold text-sm tracking-tight mb-2">No Active Campaigns</p>
                    <p className="text-gray-300 text-xs font-medium">Check back later for new funding opportunities.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {campaigns.map(campaign => {
                        const progress = campaign.fundingGoal > 0 ? ((campaign.currentFunding || 0) / campaign.fundingGoal) * 100 : 0;
                        
                        return (
                            <div key={campaign._id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all group flex flex-col">
                                <div className="h-48 bg-slate-100 relative overflow-hidden">
                                    {campaign.image ? (
                                        <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-rose-50 flex items-center justify-center">
                                            <svg className="w-12 h-12 text-slate-300 pt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-red">
                                        {campaign.category || 'General'}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-slate-800 leading-tight mb-2 line-clamp-2">{campaign.title}</h3>
                                    <p className="text-sm text-slate-500 mb-6 line-clamp-3">
                                        {campaign.description}
                                    </p>
                                    
                                    <div className="mt-auto space-y-4">
                                        <div>
                                            <div className="flex justify-between text-xs font-bold mb-1">
                                                <span className="text-slate-400 uppercase tracking-wider">LKR {(campaign.currentFunding || 0).toLocaleString()}</span>
                                                <span className="text-brand-red uppercase tracking-wider">Goal: {(campaign.fundingGoal || 0).toLocaleString()}</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-brand-red transition-all duration-1000" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                                            </div>
                                        </div>
                                        
                                        {user?.role === 'partner' && (
                                            <button 
                                                onClick={() => handleProposePartnership(campaign._id)}
                                                className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wide transition-all active:scale-95"
                                            >
                                                Propose Partnership
                                            </button>
                                        )}
                                        {user?.role === 'donor' && (
                                            <Link 
                                                to={`/donations/new?campaign=${campaign._id}`}
                                                className="w-full py-3 block text-center bg-brand-red hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wide transition-all active:scale-95"
                                            >
                                                Pledge Support
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

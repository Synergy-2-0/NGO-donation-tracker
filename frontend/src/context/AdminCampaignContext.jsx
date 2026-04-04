import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const AdminCampaignContext = createContext();

export function useAdminCampaign() {
    return useContext(AdminCampaignContext);
}

export function AdminCampaignProvider({ children }) {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCampaigns = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/campaigns/my');
            setCampaigns(res.data);
        } catch (err) {
            console.error('Failed to fetch campaigns', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createCampaign = useCallback(async (campaignData) => {
        try {
            const formData = new FormData();

            if (campaignData.image) {
                formData.append('image', campaignData.image);
            }
            formData.append('title', campaignData.title);
            formData.append('description', campaignData.description);
            formData.append('goalAmount', campaignData.goalAmount);
            formData.append('startDate', campaignData.startDate);
            formData.append('endDate', campaignData.endDate);
            if (campaignData.location) {
                formData.append('location', JSON.stringify(campaignData.location));
            }
            if (campaignData.sdgAlignment) {
                formData.append('sdgAlignment', JSON.stringify(campaignData.sdgAlignment));
            }
            if (campaignData.targetBeneficiaries) {
                formData.append('targetBeneficiaries', campaignData.targetBeneficiaries);
            }
            // Pledge configuration
            formData.append('allowPledges', campaignData.allowPledges ? 'true' : 'false');
            if (campaignData.allowPledges && campaignData.pledgeConfig) {
                formData.append('pledgeConfig', JSON.stringify(campaignData.pledgeConfig));
            }

            const res = await api.post('/api/campaigns', formData);
            setCampaigns((prev) => [res.data, ...prev]);
            return res.data;
        } catch (err) {
            console.error('Failed to create campaign', err);
            throw err;
        }
    }, []);

    const publishCampaign = useCallback(async (campaignId) => {
        try {
            const res = await api.put(`/api/campaigns/${campaignId}/publish`);
            setCampaigns((prev) =>
                prev.map((c) => (c._id === campaignId ? res.data : c))
            );
            return res.data;
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to deploy mission to network.';
            console.error('[Publish Error]', message);
            throw new Error(message);
        }
    }, []);
    const fetchCampaignById = useCallback(async (id) => {
        try {
            const res = await api.get(`/api/campaigns/${id}`);
            return res.data;
        } catch (err) {
            console.error('Failed to fetch campaign', err);
            throw err;
        }
    }, []);

    const updateCampaign = useCallback(async (id, campaignData) => {
        try {
            const res = await api.put(`/api/campaigns/${id}`, campaignData);

            setCampaigns(prev =>
                prev.map(c => c._id === id ? res.data : c)
            );

            return res.data;
        } catch (err) {
            console.error('Failed to update campaign', err);
            throw err;
        }
    }, []);

    const deleteCampaign = useCallback(async (id) => {
        try {
            await api.delete(`/api/campaigns/${id}`);
            setCampaigns(prev => prev.filter(c => c._id !== id));
        } catch (err) {
            console.error('Failed to delete campaign', err);
            throw err;
        }
    }, []);

    const submitCampaign = useCallback(async (campaignId) => {
        try {
            const res = await api.put(`/api/campaigns/${campaignId}/submit`);
            setCampaigns((prev) =>
                prev.map((c) => (c._id === campaignId ? res.data : c))
            );
            return res.data;
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to submit mission for review.';
            console.error('[Submit Error]', message);
            throw new Error(message);
        }
    }, [setCampaigns]);

    return (
        <AdminCampaignContext.Provider
            value={{ 
                campaigns, 
                loading, 
                fetchCampaigns, 
                fetchCampaignById, 
                publishCampaign, 
                submitCampaign,
                createCampaign, 
                updateCampaign, 
                deleteCampaign 
            }}
        >
            {children}
        </AdminCampaignContext.Provider>
    );
}
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
            const res = await api.get('/api/campaigns');
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
            console.error('Failed to publish campaign', err);
            throw err;
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

    return (
        <AdminCampaignContext.Provider
            value={{ campaigns, loading, fetchCampaigns, fetchCampaignById, publishCampaign, createCampaign, updateCampaign }}
        >
            {children}
        </AdminCampaignContext.Provider>
    );
}
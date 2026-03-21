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

    return (
        <AdminCampaignContext.Provider
            value={{ campaigns, loading, fetchCampaigns, publishCampaign }}
        >
            {children}
        </AdminCampaignContext.Provider>
    );
}
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import api from '../api/axios';

const PartnerOperationsContext = createContext(null);

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export function PartnerOperationsProvider({ children }) {
  const [agreements, setAgreements] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [currentAgreement, setCurrentAgreement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const withLoading = async (runner) => {
    setLoading(true);
    setError('');
    try {
      return await runner();
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Request failed.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPartnerProfile = useCallback(async () => {
    return withLoading(async () => {
      try {
        const { data } = await api.get('/api/partners/me/profile');
        return data;
      } catch (err) {
        if (err.response?.status === 404) {
          // No partner profile exists yet (partner onboarding not completed)
          return null;
        }
        throw err;
      }
    });
  }, []);

  const fetchMyPartnerAgreements = useCallback(async () => {
    return withLoading(async () => {
      const { data: profile } = await api.get('/api/partners/me/profile');
      const partnerId = profile?._id;
      if (!partnerId) {
        setAgreements([]);
        return [];
      }

      const { data } = await api.get(`/api/agreements/partner/${partnerId}`);
      const rows = normalizeList(data);
      setAgreements(rows);
      return rows;
    });
  }, []);

  const fetchAllAgreements = useCallback(async () => {
    return withLoading(async () => {
      const { data } = await api.get('/api/agreements');
      const rows = normalizeList(data);
      setAgreements(rows);
      return rows;
    });
  }, []);

  const fetchPartnerAgreements = useCallback(async (partnerId) => {
    return withLoading(async () => {
      const { data } = await api.get(`/api/agreements/partner/${partnerId}`);
      const rows = normalizeList(data);
      setAgreements(rows);
      return rows;
    });
  }, []);

  const fetchAgreementById = useCallback(async (agreementId) => {
    return withLoading(async () => {
      const { data } = await api.get(`/api/agreements/${agreementId}`);
      setCurrentAgreement(data);
      return data;
    });
  }, []);

  const createAgreement = useCallback(async (payload) => {
    return withLoading(async () => {
      const { data } = await api.post('/api/agreements', payload);
      setAgreements((prev) => [data, ...prev]);
      return data;
    });
  }, []);

  const updateAgreement = useCallback(async (agreementId, payload) => {
    return withLoading(async () => {
      const { data } = await api.put(`/api/agreements/${agreementId}`, payload);
      setAgreements((prev) => prev.map((item) => (item._id === agreementId ? { ...item, ...data } : item)));
      setCurrentAgreement((prev) => (prev?._id === agreementId ? { ...prev, ...data } : prev));
      return data;
    });
  }, []);

  const updateAgreementStatus = useCallback(async (agreementId, status) => {
    return withLoading(async () => {
      const { data } = await api.patch(`/api/agreements/${agreementId}/status`, { status });
      setAgreements((prev) => prev.map((item) => (item._id === agreementId ? { ...item, ...data } : item)));
      setCurrentAgreement((prev) => (prev?._id === agreementId ? { ...prev, ...data } : prev));
      return data;
    });
  }, []);

  const approveAgreement = useCallback(async (agreementId) => {
    return withLoading(async () => {
      const { data } = await api.patch(`/api/agreements/${agreementId}/approve`);
      setAgreements((prev) => prev.map((item) => (item._id === agreementId ? { ...item, ...data } : item)));
      setCurrentAgreement((prev) => (prev?._id === agreementId ? { ...prev, ...data } : prev));
      return data;
    });
  }, []);

  const acceptAgreement = useCallback(async (agreementId) => {
    return withLoading(async () => {
      const { data } = await api.patch(`/api/agreements/${agreementId}/accept`);
      setAgreements((prev) => prev.map((item) => (item._id === agreementId ? { ...item, ...data } : item)));
      setCurrentAgreement((prev) => (prev?._id === agreementId ? { ...prev, ...data } : prev));
      return data;
    });
  }, []);

  const deleteAgreement = useCallback(async (agreementId) => {
    return withLoading(async () => {
      await api.delete(`/api/agreements/${agreementId}`);
      setAgreements((prev) => prev.filter((item) => item._id !== agreementId));
      if (currentAgreement?._id === agreementId) {
        setCurrentAgreement(null);
      }
      return true;
    });
  }, [currentAgreement?._id]);

  const fetchMilestones = useCallback(async ({ agreementId, campaignId }) => {
    return withLoading(async () => {
      const params = {};
      if (agreementId) params.agreementId = agreementId;
      if (campaignId) params.campaignId = campaignId;

      const { data } = await api.get('/api/milestones', { params });
      const rows = normalizeList(data);
      setMilestones(rows);
      return rows;
    });
  }, []);

  const createMilestone = useCallback(async (payload) => {
    return withLoading(async () => {
      const { data } = await api.post('/api/milestones', payload);
      setMilestones((prev) => [...prev, data]);
      return data;
    });
  }, []);

  const updateMilestone = useCallback(async (milestoneId, payload) => {
    return withLoading(async () => {
      const { data } = await api.put(`/api/milestones/${milestoneId}`, payload);
      setMilestones((prev) => prev.map((item) => (item._id === milestoneId ? data : item)));
      return data;
    });
  }, []);

  const deleteMilestone = useCallback(async (milestoneId) => {
    return withLoading(async () => {
      await api.delete(`/api/milestones/${milestoneId}`);
      setMilestones((prev) => prev.filter((item) => item._id !== milestoneId));
      return true;
    });
  }, []);

  const uploadMilestoneEvidence = useCallback(async (file) => {
    return withLoading(async () => {
      const formData = new FormData();
      formData.append('evidence', file);
      const { data } = await api.post('/api/milestones/upload-evidence', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    });
  }, []);

  const value = useMemo(() => ({
    agreements,
    milestones,
    currentAgreement,
    loading,
    error,
    setError,
    fetchPartnerProfile,
    fetchMyPartnerAgreements,
    fetchPartnerAgreements,
    fetchAllAgreements,
    fetchAgreementById,
    createAgreement,
    updateAgreement,
    updateAgreementStatus,
    approveAgreement,
    acceptAgreement,
    deleteAgreement,
    fetchMilestones,
    createMilestone,
    updateMilestone,
    deleteMilestone,
    uploadMilestoneEvidence,
  }), [
    agreements,
    milestones,
    currentAgreement,
    loading,
    error,
    fetchPartnerProfile,
    fetchMyPartnerAgreements,
    fetchPartnerAgreements,
    fetchAllAgreements,
    fetchAgreementById,
    createAgreement,
    updateAgreement,
    updateAgreementStatus,
    approveAgreement,
    acceptAgreement,
    deleteAgreement,
    fetchMilestones,
    createMilestone,
    updateMilestone,
    deleteMilestone,
    uploadMilestoneEvidence,
  ]);

  return <PartnerOperationsContext.Provider value={value}>{children}</PartnerOperationsContext.Provider>;
}

export function usePartnerOperations() {
  const ctx = useContext(PartnerOperationsContext);
  if (!ctx) throw new Error('usePartnerOperations must be used within PartnerOperationsProvider');
  return ctx;
}

import { createContext, useCallback, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const PartnerContext = createContext(null);

export function PartnerProvider({ children }) {
  const { user } = useAuth();
  const [partners, setPartners] = useState([]);
  const [currentPartner, setCurrentPartner] = useState(null);
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset state on logout Hub Hub Hub
  useEffect(() => {
    if (!user) {
      setPartners([]);
      setCurrentPartner(null);
      setImpactData(null);
      setError(null);
    }
  }, [user]);

  const fetchPartners = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/api/partners', { params });
      const normalized = Array.isArray(data) ? data : [];
      setPartners(normalized);
      return normalized;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to load partners.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPartnerById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    setCurrentPartner(null);
    try {
      const url = id === 'me' ? '/api/partners/me/profile' : `/api/partners/${id}`;
      const { data } = await api.get(url);
      setCurrentPartner(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to load partner.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPartner = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/api/partners', payload);
      setPartners((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to create partner.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePartner = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/api/partners/${id}`, payload);
      setPartners((prev) => prev.map((partner) => (partner._id === id ? data : partner)));
      setCurrentPartner((prev) => (prev?._id === id ? data : prev));
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update partner.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePartner = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/partners/${id}`);
      // Endpoint is soft-delete, we remove from active list view for UX clarity.
      setPartners((prev) => prev.filter((partner) => partner._id !== id));
      if (currentPartner?._id === id) {
        setCurrentPartner(null);
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to delete partner.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approvePartner = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.patch(`/api/partners/${id}/approve`);
      setPartners((prev) => prev.map((partner) => (partner._id === id ? data : partner)));
      setCurrentPartner((prev) => (prev?._id === id ? data : prev));
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to approve partner.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPartnerImpact = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    setImpactData(null);
    try {
      const { data } = await api.get(`/api/partners/${id}/impact`);
      setImpactData(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to load impact data.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <PartnerContext.Provider
      value={{
        partners,
        currentPartner,
        impactData,
        loading,
        error,
        setError,
        fetchPartners,
        fetchPartnerById,
        createPartner,
        updatePartner,
        deletePartner,
        approvePartner,
        fetchPartnerImpact,
      }}
    >
      {children}
    </PartnerContext.Provider>
  );
}

export function usePartner() {
  const ctx = useContext(PartnerContext);
  if (!ctx) throw new Error('usePartner must be used within PartnerProvider');
  return ctx;
}

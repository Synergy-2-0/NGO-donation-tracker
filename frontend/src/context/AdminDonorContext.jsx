import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const AdminDonorContext = createContext(null);

export function AdminDonorProvider({ children }) {
  const { user } = useAuth();
  const [donors, setDonors] = useState([]);
  const [pledges, setPledges] = useState([]);
  const [donorAnalytics, setDonorAnalytics] = useState(null);
  const [segments, setSegments] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear data on session change Hub Hub
  useEffect(() => {
    if (!user) {
      setDonors([]);
      setPledges([]);
      setDonorAnalytics(null);
      setSegments(null);
      setInteractions([]);
      setError(null);
    }
  }, [user]);

  // ── Donors ──────────────────────────────────────────────────
  const fetchDonors = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/api/donors', { params });
      setDonors(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load donors.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDonorById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/api/donors/${id}`);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load donor.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDonor = useCallback(async (id, body) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/api/donors/${id}`, body);
      setDonors((prev) => prev.map((d) => (d._id === id ? data : d)));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update donor.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDonor = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/donors/${id}`);
      setDonors((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete donor.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Pledges ─────────────────────────────────────────────────
  const fetchAllPledges = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/api/donors/pledges', { params });
      setPledges(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load pledges.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDonorPledges = useCallback(async (donorId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/api/donors/${donorId}/pledges`);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load donor pledges.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Interactions ─────────────────────────────────────────────
  const addInteraction = useCallback(async (donorId, body) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post(`/api/donors/${donorId}/interactions`, body);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add interaction.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteInteraction = useCallback(async (donorId, interactionId) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/donors/${donorId}/interactions/${interactionId}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete interaction.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Analytics ────────────────────────────────────────────────
  const fetchDonorAnalytics = useCallback(async (donorId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/api/donors/${donorId}/analytics`);
      setDonorAnalytics(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load analytics.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSegments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/api/donors/analytics/segments');
      setSegments(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load segments.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const recalculateAnalytics = useCallback(async (donorId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.patch(`/api/donors/${donorId}/analytics/recalculate`);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to recalculate analytics.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AdminDonorContext.Provider
      value={{
        donors,
        pledges,
        donorAnalytics,
        segments,
        interactions,
        loading,
        error,
        setError,
        fetchDonors,
        fetchDonorById,
        updateDonor,
        deleteDonor,
        fetchAllPledges,
        fetchDonorPledges,
        addInteraction,
        deleteInteraction,
        fetchDonorAnalytics,
        fetchSegments,
        recalculateAnalytics,
      }}
    >
      {children}
    </AdminDonorContext.Provider>
  );
}

export function useAdminDonor() {
  const ctx = useContext(AdminDonorContext);
  if (!ctx) throw new Error('useAdminDonor must be used inside AdminDonorProvider');
  return ctx;
}

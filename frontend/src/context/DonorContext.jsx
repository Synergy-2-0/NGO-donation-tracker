import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const DonorContext = createContext(null);

export function DonorProvider({ children }) {
  const [donorProfile, setDonorProfile] = useState(null);
  const [pledges, setPledges] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Profile ────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/api/donors/me');
      setDonorProfile(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to load profile.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/api/donors', profileData);
      setDonorProfile(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to create profile.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (id, profileData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/api/donors/${id}`, profileData);
      setDonorProfile(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update profile.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/donors/${id}`);
      setDonorProfile(null);
      setPledges([]);
      setAnalytics(null);
      setTransactions([]);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to delete profile.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── Pledges ────────────────────────────────────────────────
  const fetchPledges = useCallback(async (donorId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/api/donors/${donorId}/pledges`);
      setPledges(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to load pledges.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPledge = async (donorId, pledgeData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post(`/api/donors/${donorId}/pledges`, pledgeData);
      setPledges((prev) => [...prev, data]);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to create pledge.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePledge = async (donorId, pledgeId, pledgeData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(
        `/api/donors/${donorId}/pledges/${pledgeId}`,
        pledgeData
      );
      setPledges((prev) => prev.map((p) => (p._id === pledgeId ? data : p)));
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update pledge.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePledge = async (donorId, pledgeId) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/donors/${donorId}/pledges/${pledgeId}`);
      setPledges((prev) => prev.filter((p) => p._id !== pledgeId));
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to delete pledge.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── Analytics ──────────────────────────────────────────────
  const fetchAnalytics = useCallback(async (donorId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/api/donors/${donorId}/analytics`);
      setAnalytics(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to load analytics.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Transactions ───────────────────────────────────────────
  const fetchTransactions = useCallback(async (donorId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/api/finance/transactions/donor/${donorId}`);
      setTransactions(data);
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Failed to load transactions.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DonorContext.Provider
      value={{
        donorProfile,
        pledges,
        analytics,
        transactions,
        loading,
        error,
        fetchProfile,
        createProfile,
        updateProfile,
        deleteProfile,
        fetchPledges,
        createPledge,
        updatePledge,
        deletePledge,
        fetchAnalytics,
        fetchTransactions,
      }}
    >
      {children}
    </DonorContext.Provider>
  );
}

export function useDonor() {
  const ctx = useContext(DonorContext);
  if (!ctx) throw new Error('useDonor must be used within DonorProvider');
  return ctx;
}

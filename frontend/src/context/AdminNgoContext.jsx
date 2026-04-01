import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import api from '../api/axios';

const AdminNgoContext = createContext(null);

export function AdminNgoProvider({ children }) {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNgos = useCallback(async (filter = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/api/ngos', { params: filter });
      setNgos(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch NGOs');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPendingNgos = useCallback(() => fetchNgos({ status: 'pending' }), [fetchNgos]);

  const approveNgo = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.patch(`/api/ngos/${id}/approve`);
      setNgos(prev => prev.map(n => n._id === id ? { ...n, status: 'approved' } : n));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve NGO');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectNgo = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.patch(`/api/ngos/${id}/reject`);
      setNgos(prev => prev.map(n => n._id === id ? { ...n, status: 'rejected' } : n));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject NGO');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const pendingNgos = useMemo(() => ngos.filter(n => n.status === 'pending'), [ngos]);

  const value = useMemo(() => ({
    ngos,
    pendingNgos,
    loading,
    error,
    fetchNgos,
    fetchPendingNgos,
    approveNgo,
    rejectNgo
  }), [ngos, pendingNgos, loading, error, fetchNgos, fetchPendingNgos, approveNgo, rejectNgo]);

  return <AdminNgoContext.Provider value={value}>{children}</AdminNgoContext.Provider>;
}

export function useAdminNgo() {
  const ctx = useContext(AdminNgoContext);
  if (!ctx) throw new Error('useAdminNgo must be used within AdminNgoProvider');
  return ctx;
}

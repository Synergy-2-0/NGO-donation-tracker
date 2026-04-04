import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async (queryParam) => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/finance/transactions';
      if (typeof queryParam === 'string' && queryParam.startsWith('donor/')) {
         url = `/api/finance/transactions/${queryParam}`;
      } else if (queryParam) {
         url = `/api/finance/transactions/ngo/${queryParam}`;
      }
      
      const { data } = await api.get(url);
      setTransactions(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllocations = useCallback(async (ngoId) => {
    setLoading(true);
    setError(null);
    try {
      const url = ngoId ? `/api/finance/allocations/ngo/${ngoId}` : '/api/finance/allocations';
      const { data } = await api.get(url);
      setAllocations(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch allocations');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async (ngoId) => {
    if (!ngoId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/api/finance/summary/ngo/${ngoId}`);
      setSummary(data.data || data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAuditLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/api/finance/audits');
      setAuditLogs(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAllocation = async (allocationData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/api/finance/allocations', allocationData);
      setAllocations(prev => [data.data || data, ...prev]);
      return data.data || data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create allocation');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchNgoMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/api/ngos/finance/metrics');
      setSummary(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch NGO metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNgoLedger = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/api/ngos/finance/ledger');
      setTransactions(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch NGO ledger');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <FinanceContext.Provider value={{
      transactions, allocations, auditLogs, summary, loading, error,
      fetchTransactions, fetchAllocations, fetchSummary, fetchAuditLogs, createAllocation,
      fetchNgoMetrics, fetchNgoLedger
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => {
    const context = useContext(FinanceContext);
    if (!context) throw new Error('useFinance must be used within FinanceProvider');
    return context;
};

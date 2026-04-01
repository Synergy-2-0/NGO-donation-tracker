import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/api/users/login', { email, password });
      const jwt = data.token || data.data?.token;
      const userData = data.user || data.data?.user || data.data;
      if (!jwt) throw new Error('Invalid server response: missing token.');
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(jwt);
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/api/users/register', payload);
      const jwt = data.token || data.data?.token;
      const userData = data.user || data.data?.user || data.data;
      if (!jwt) throw new Error('Registration failed: no token returned.');
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(jwt);
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (body) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put('/api/users/me', body);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Update failed.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      await api.patch('/api/users/me/password', { currentPassword, newPassword });
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Password update failed.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, login, register, logout, updateProfile, updatePassword, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

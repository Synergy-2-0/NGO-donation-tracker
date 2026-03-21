import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch (parseError) {
      console.warn('AuthContext: invalid stored user JSON, clearing bad value', parseError);
      localStorage.removeItem('user');
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('token');
    return t === 'undefined' ? null : t;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/api/users/login', { email, password });
      // Support both { token, user } and { data: { token, user } } response shapes
      const jwt = data.token || data.data?.token;
      const userData = data.user || data.data?.user || data.data;
      if (!jwt) throw new Error('Invalid server response: missing token.');
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(jwt);
      setUser(userData);
      return userData;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please check your credentials.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password, role, phone, city, country, preferredCauses, bio }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/api/users/register', { name, email, password, role, phone, city, country, preferredCauses, bio });
      const jwt = data.token || data.data?.token;
      const userData = data.user || data.data?.user || data.data;
      if (!jwt) throw new Error('Registration succeeded but no token returned.');
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(jwt);
      setUser(userData);
      return userData;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again.';
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
      value={{ user, token, loading, error, login, register, logout, isAuthenticated: !!token }}
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

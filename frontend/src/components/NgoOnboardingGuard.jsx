import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from './LoadingSpinner';

export default function NgoOnboardingGuard({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ngo-admin') {
      api.get('/api/ngos/profile')
        .then(res => {
          setHasProfile(!!res.data);
          setIsPending(res.data?.status === 'pending');
        })
        .catch(() => setHasProfile(false))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  if (loading) return <LoadingSpinner />;
  
  if (isAuthenticated && user?.role === 'ngo-admin' && !hasProfile && location.pathname !== '/onboarding/ngo') {
    return <Navigate to="/onboarding/ngo" replace />;
  }

  return children;
}

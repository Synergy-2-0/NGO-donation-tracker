import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function PartnerOnboardingGuard({ children }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [status, setStatus] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (user?.role !== 'partner') {
        setHasProfile(true);
        setStatus('verified');
        setLoading(false);
        return;
    }
    
    // Check if the partner has an organization profile
    api.get('/api/partners/me/profile')
      .then(({ data }) => {
        setHasProfile(true);
        setStatus(data.verificationStatus || 'pending');
      })
      .catch((err) => {
        if (err.response?.status === 404) {
           setHasProfile(false);
           setStatus('');
        } else {
           // Allow continuing on other network errors so the app doesn't brick completely
           setHasProfile(true); 
           setStatus('verified'); // Fallback
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  if (loading) return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#F8FAFC]">
          <LoadingSpinner message="Verifying organization state..." />
      </div>
  );

  // If they are a partner but have no profile and are trying to access dashboard/etc.
  if (!hasProfile && location.pathname !== '/onboarding/partner') {
     return <Navigate to="/onboarding/partner" replace />;
  }

  // If they have a profile but it's pending approval
  if (hasProfile && status === 'pending' && location.pathname !== '/partner/pending-approval') {
     return <Navigate to="/partner/pending-approval" replace />;
  }

  return children ? children : <Outlet />;
}

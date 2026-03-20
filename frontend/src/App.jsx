import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DonorProvider } from './context/DonorContext';
import { PartnerProvider } from './context/PartnerContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import PledgesPage from './pages/PledgesPage';
import DonationHistoryPage from './pages/DonationHistoryPage';
import PartnersPage from './pages/PartnersPage';
import PartnerDetailsPage from './pages/PartnerDetailsPage';
import PartnerImpactPage from './pages/PartnerImpactPage';
import PartnerVerificationPage from './pages/PartnerVerificationPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DonorProvider>
          <PartnerProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="pledges" element={<PledgesPage />} />
                <Route path="donations" element={<DonationHistoryPage />} />
                <Route
                  path="partners"
                  element={
                    <RoleProtectedRoute roles={['partner', 'admin']}>
                      <PartnersPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="partners/verification"
                  element={
                    <RoleProtectedRoute roles={['admin']}>
                      <PartnerVerificationPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="partners/:id"
                  element={
                    <RoleProtectedRoute roles={['partner', 'admin']}>
                      <PartnerDetailsPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="partners/:id/impact"
                  element={
                    <RoleProtectedRoute roles={['partner', 'admin']}>
                      <PartnerImpactPage />
                    </RoleProtectedRoute>
                  }
                />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </PartnerProvider>
        </DonorProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

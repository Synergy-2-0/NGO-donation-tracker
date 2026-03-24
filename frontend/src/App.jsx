import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DonorProvider } from './context/DonorContext';
import { PartnerProvider } from './context/PartnerContext';
import { FinanceProvider } from './context/FinanceContext';
import { AdminDonorProvider } from './context/AdminDonorContext';
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
import FinanceDashboard from './pages/FinanceDashboard';
import TransactionsPage from './pages/TransactionsPage';
import HomePage from './pages/HomePage';

import AdminDonorListPage from './pages/admin/AdminDonorListPage';
import AdminDonorProfilePage from './pages/admin/AdminDonorProfilePage';
import AdminDonorPledgesPage from './pages/admin/AdminDonorPledgesPage';
import AdminDonorAnalyticsPage from './pages/admin/AdminDonorAnalyticsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import CampaignDashboardPage from './pages/admin/CampaignDashboardPage';
import { AdminCampaignProvider } from './context/AdminCampaignContext';
import CreateCampaignPage from './pages/admin/campaign/CreateCampaignPage';
import CampaignDetailPage from './pages/admin/campaign/CampaignDetailPage';
import { useAuth } from './context/AuthContext';

function RoleBasedDashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'ngo-admin';
  return isAdmin ? <AdminDashboardPage /> : <DashboardPage />;
}

function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin' && user?.role !== 'ngo-admin') return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <FinanceProvider>
          <DonorProvider>
            <PartnerProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Dashboard / Protected Routes */}
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="pledges" element={<PledgesPage />} />
                  <Route path="donations" element={<DonationHistoryPage />} />
                  <Route
                    path="partners"
                    element={
                      <RoleProtectedRoute roles={['partner', 'admin', 'donor']}>
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
                      <RoleProtectedRoute roles={['partner', 'admin', 'donor']}>
                        <PartnerDetailsPage />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route
                    path="partners/:id/impact"
                    element={
                      <RoleProtectedRoute roles={['partner', 'admin', 'donor']}>
                        <PartnerImpactPage />
                      </RoleProtectedRoute>
                    }
                  />
                  {/* Finance Routes */}
                  <Route
                    path="finance/dashboard"
                    element={
                      <RoleProtectedRoute roles={['ngo-admin', 'partner', 'admin']}>
                        <FinanceDashboard />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route
                    path="finance/transactions"
                    element={
                      <RoleProtectedRoute roles={['ngo-admin', 'partner', 'admin']}>
                        <TransactionsPage />
                      </RoleProtectedRoute>
                    }
                  />
                  {/* Catch-all for subroutes */}
                  <Route index element={<Navigate to="dashboard" replace />} />
                </Route>
                
                {/* Final Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </PartnerProvider>
          </DonorProvider>
        </FinanceProvider>
        <DonorProvider>
          <AdminDonorProvider>
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
                <Route path="dashboard" element={<RoleBasedDashboard />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="pledges" element={<PledgesPage />} />
                <Route path="donations" element={<DonationHistoryPage />} />

                {/* Admin routes */}
                <Route path="admin/donors" element={<AdminRoute><AdminDonorListPage /></AdminRoute>} />
                <Route path="admin/donors/pledges" element={<AdminRoute><AdminDonorPledgesPage /></AdminRoute>} />
                <Route path="admin/donors/:id" element={<AdminRoute><AdminDonorProfilePage /></AdminRoute>} />
                <Route path="admin/donor-analytics" element={<AdminRoute><AdminDonorAnalyticsPage /></AdminRoute>} />
                <Route path="admin/campaign-dashboard"
                  element={<AdminRoute><AdminCampaignProvider><CampaignDashboardPage /></AdminCampaignProvider></AdminRoute>} />
                <Route path="admin/campaigns/create"
                  element={<AdminRoute><AdminCampaignProvider><CreateCampaignPage /></AdminCampaignProvider></AdminRoute>} />
                <Route path="admin/campaigns/:id"
                  element={<AdminRoute><AdminCampaignProvider><CampaignDetailPage /></AdminCampaignProvider></AdminRoute>} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AdminDonorProvider>
        </DonorProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

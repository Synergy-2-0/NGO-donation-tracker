import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DonorProvider } from './context/DonorContext';
import { AdminDonorProvider } from './context/AdminDonorContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import PledgesPage from './pages/PledgesPage';
import DonationHistoryPage from './pages/DonationHistoryPage';
import AdminDonorListPage from './pages/admin/AdminDonorListPage';
import AdminDonorProfilePage from './pages/admin/AdminDonorProfilePage';
import AdminDonorPledgesPage from './pages/admin/AdminDonorPledgesPage';
import AdminDonorAnalyticsPage from './pages/admin/AdminDonorAnalyticsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import CampaignDashboardPage from './pages/admin/CampaignDashboardPage.jsx';
import { AdminCampaignProvider } from './context/AdminCampaignContext.jsx';
import CreateCampaignPage from './pages/admin/campaign/CreateCampaignPage.jsx';
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
                <Route
                  path="admin/campaigns/create"
                  element={
                    <AdminRoute>
                      <AdminCampaignProvider>
                        <CreateCampaignPage />
                      </AdminCampaignProvider>
                    </AdminRoute>
                  }
                />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AdminDonorProvider>
        </DonorProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DonorProvider } from './context/DonorContext';
import { AdminDonorProvider } from './context/AdminDonorContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
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
import PublicHowItWorksPage from './pages/PublicHowItWorksPage';
import PublicImpactPage from './pages/PublicImpactPage';
import PublicPartnersPage from './pages/PublicPartnersPage';
import PublicCausesPage from './pages/PublicCausesPage';
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
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/how-it-works" element={<PublicHowItWorksPage />} />
              <Route path="/impact" element={<PublicImpactPage />} />
              <Route path="/partners" element={<PublicPartnersPage />} />
              <Route path="/causes" element={<PublicCausesPage />} />
              
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<RoleBasedDashboard />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="pledges" element={<PledgesPage />} />
                <Route path="donations" element={<DonationHistoryPage />} />

                {/* Admin routes */}
                <Route path="admin/donors" element={<AdminRoute><AdminDonorListPage /></AdminRoute>} />
                <Route path="admin/donors/pledges" element={<AdminRoute><AdminDonorPledgesPage /></AdminRoute>} />
                <Route path="admin/donors/:id" element={<AdminRoute><AdminDonorProfilePage /></AdminRoute>} />
                <Route path="admin/donor-analytics" element={<AdminRoute><AdminDonorAnalyticsPage /></AdminRoute>} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AdminDonorProvider>
        </DonorProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

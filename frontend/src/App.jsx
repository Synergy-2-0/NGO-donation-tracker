import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DonorProvider } from './context/DonorContext';
import { PartnerProvider } from './context/PartnerContext';
import { FinanceProvider } from './context/FinanceContext';
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


export default function App() {
  return (
    <BrowserRouter>
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
      </AuthProvider>
    </BrowserRouter>
  );
}

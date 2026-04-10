import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DonorProvider } from './context/DonorContext';
import { PartnerProvider } from './context/PartnerContext';
import { FinanceProvider } from './context/FinanceContext';
import { AdminDonorProvider } from './context/AdminDonorContext';
import { AdminNgoProvider } from './context/AdminNgoContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import PartnerProfilePage from './pages/PartnerProfilePage';
import PledgesPage from './pages/PledgesPage';
import DonationHistoryPage from './pages/DonationHistoryPage';
import PartnersPage from './pages/PartnersPage';
import PartnerDetailsPage from './pages/PartnerDetailsPage';
import PartnerImpactPage from './pages/PartnerImpactPage';
import PartnerDashboardPage from './pages/PartnerDashboardPage';
import PartnerVerificationPage from './pages/PartnerVerificationPage';
import FinanceDashboard from './pages/FinanceDashboard';
import TransactionsPage from './pages/TransactionsPage';
import PartnerAgreementsPage from './pages/PartnerAgreementsPage';
import AgreementMilestonesPage from './pages/AgreementMilestonesPage';
import CampaignMarketplacePage from './pages/CampaignMarketplacePage';
import PartnerAiMatchPage from './pages/PartnerAiMatchPage';
import PartnerCsrHubPage from './pages/PartnerCsrHubPage';

import AdminDonorListPage from './pages/admin/AdminDonorListPage';
import AdminDonorProfilePage from './pages/admin/AdminDonorProfilePage';
import AdminDonorPledgesPage from './pages/admin/AdminDonorPledgesPage';
import AdminDonorAnalyticsPage from './pages/admin/AdminDonorAnalyticsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import NgoAdminDashboardPage from './pages/admin/NgoAdminDashboardPage';
import CampaignDashboardPage from './pages/admin/CampaignDashboardPage';
import { AdminCampaignProvider } from './context/AdminCampaignContext';
import CreateCampaignPage from './pages/admin/campaign/CreateCampaignPage';
import CampaignDetailPage from './pages/admin/campaign/CampaignDetailPage';
import NgoProfilePage from './pages/NgoProfilePage';
import SettingsPage from './pages/SettingsPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';

// Public pages for visitors
import PublicHowItWorksPage from './pages/PublicHowItWorksPage';
import PublicImpactPage from './pages/PublicImpactPage';
import PublicPartnersPage from './pages/PublicPartnersPage';
import PublicCausesPage from './pages/PublicCausesPage';
import PublicCampaignDetailPage from './pages/PublicCampaignDetailPage';
import PublicTransparencyDashboard from './pages/PublicTransparencyDashboard';

import { useAuth } from './context/AuthContext';
import { PartnerOperationsProvider } from './context/PartnerOperationsContext';
import PartnerOnboardingGuard from './components/PartnerOnboardingGuard';
import PartnerOnboardingPage from './pages/PartnerOnboardingPage';

import PartnerPendingApprovalPage from './pages/PartnerPendingApprovalPage';
import NgoOnboardingPage from './pages/NgoOnboardingPage';
import NgoOnboardingGuard from './components/NgoOnboardingGuard';

function RoleBasedDashboard() {
  const { user } = useAuth();
  const role = user?.role;
  if (role === 'admin') return <AdminDashboardPage />;
  if (role === 'ngo-admin') return <NgoAdminDashboardPage />;
  if (role === 'partner') return <PartnerDashboardPage />;
  return <DashboardPage />;
}

function RoleBasedProfile() {
  const { user } = useAuth();
  if (user?.role === 'partner') return <PartnerProfilePage />;
  if (user?.role === 'ngo-admin' || user?.role === 'admin') return <NgoProfilePage />;
  return <ProfilePage />;
}

function RoleBasedPledges() {
  const { user } = useAuth();
  return user?.role === 'partner' ? <Navigate to="/partner/pledges" replace /> : <PledgesPage />;
}

function RoleBasedDonations() {
  const { user } = useAuth();
  return user?.role === 'partner' ? <TransactionsPage /> : <DonationHistoryPage />;
}

function RoleBasedFinanceDashboard() {
  const { user } = useAuth();
  return user?.role === 'donor' ? <DashboardPage /> : <FinanceDashboard />;
}

function RoleBasedTransactions() {
  const { user } = useAuth();
  return user?.role === 'donor' ? <DonationHistoryPage /> : <TransactionsPage />;
}

function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin' && user?.role !== 'ngo-admin') return <Navigate to="/dashboard" replace />;
  return children;
}

import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <FinanceProvider>
            <PartnerOperationsProvider>
              <DonorProvider>
                <PartnerProvider>
                  <AdminDonorProvider>
                    <AdminNgoProvider>
                      <AdminCampaignProvider>
                  <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/about" element={<AboutPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* Partner Onboarding (No Layout) */}
                    <Route 
                      path="/onboarding/partner" 
                      element={
                        <ProtectedRoute>
                          <PartnerOnboardingPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/onboarding/ngo" 
                      element={
                        <ProtectedRoute>
                          <NgoOnboardingPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/partner/pending-approval" 
                      element={
                        <ProtectedRoute>
                          <PartnerPendingApprovalPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/how-it-works" element={<PublicHowItWorksPage />} />
                    <Route path="/impact" element={<PublicImpactPage />} />
                    <Route path="/causes" element={<PublicCausesPage />} />
                    <Route path="/causes/:id" element={<PublicCampaignDetailPage />} />
                    <Route path="/partners/list" element={<PublicPartnersPage />} />
                    <Route path="/transparency" element={<PublicTransparencyDashboard />} />
                    
                    {/* Payment Status (Public) */}
                    <Route path="/payment/success" element={<PaymentSuccessPage />} />
                    <Route path="/payment/cancel" element={<PaymentCancelPage />} />

                    {/* Dashboard / Protected Routes */}
                    <Route
                      path="/*"
                      element={
                        <ProtectedRoute>
                          <PartnerOnboardingGuard>
                            <NgoOnboardingGuard>
                              <Layout />
                            </NgoOnboardingGuard>
                          </PartnerOnboardingGuard>
                        </ProtectedRoute>
                      }
                    >
                      <Route path="dashboard" element={<RoleBasedDashboard />} />
                      <Route path="profile" element={<RoleBasedProfile />} />
                      <Route path="pledges" element={<RoleBasedPledges />} />
                      <Route path="donations" element={<RoleBasedDonations />} />
                      <Route path="settings" element={<SettingsPage />} />
                      
                      <Route path="marketplace" element={<CampaignMarketplacePage />} />

                      <Route
                        path="partners"
                        element={
                          <RoleProtectedRoute roles={['partner', 'admin', 'ngo-admin']}>
                            <PartnersPage />
                          </RoleProtectedRoute>
                        }
                      />
                      <Route
                        path="partners/verification"
                        element={
                          <RoleProtectedRoute roles={['admin', 'ngo-admin', 'partner']}>
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

                      {/* Finance Routes */}
                      <Route
                        path="finance/dashboard"
                        element={
                          <RoleProtectedRoute roles={['ngo-admin', 'partner', 'admin', 'donor']}>
                            <RoleBasedFinanceDashboard />
                          </RoleProtectedRoute>
                        }
                      />
                      <Route
                        path="finance/transactions"
                        element={
                          <RoleProtectedRoute roles={['ngo-admin', 'partner', 'admin', 'donor']}>
                            <RoleBasedTransactions />
                          </RoleProtectedRoute>
                        }
                      />

                      <Route
                        path="partner/agreements"
                        element={
                          <RoleProtectedRoute roles={['partner', 'admin', 'ngo-admin']}>
                            <PartnerAgreementsPage />
                          </RoleProtectedRoute>
                        }
                      />
                        <Route
                          path="partner/agreements/:id/milestones"
                          element={
                            <RoleProtectedRoute roles={['partner', 'admin', 'ngo-admin']}>
                              <AgreementMilestonesPage />
                            </RoleProtectedRoute>
                          }
                        />
                        <Route
                          path="partner/milestones/:id?"
                          element={
                            <RoleProtectedRoute roles={['partner', 'admin', 'ngo-admin']}>
                              <AgreementMilestonesPage />
                            </RoleProtectedRoute>
                          }
                        />
                        <Route
                          path="partner/ai-match"
                          element={
                            <RoleProtectedRoute roles={['partner']}>
                              <PartnerAiMatchPage />
                            </RoleProtectedRoute>
                          }
                        />
                        <Route
                          path="partner/csr-hub"
                          element={
                            <RoleProtectedRoute roles={['partner']}>
                              <PartnerCsrHubPage />
                            </RoleProtectedRoute>
                          }
                        />

                      {/* Admin donor routes */}
                      <Route path="admin/donors" element={<AdminRoute><AdminDonorListPage /></AdminRoute>} />
                      <Route path="admin/donors/pledges" element={<AdminRoute><AdminDonorPledgesPage /></AdminRoute>} />
                      <Route path="admin/donors/:id" element={<AdminRoute><AdminDonorProfilePage /></AdminRoute>} />
                      <Route path="admin/donor-analytics" element={<AdminRoute><AdminDonorAnalyticsPage /></AdminRoute>} />

                      {/* Admin campaign routes */}
                      <Route
                        path="admin/campaign-dashboard"
                        element={<AdminRoute><AdminCampaignProvider><CampaignDashboardPage /></AdminCampaignProvider></AdminRoute>}
                      />
                      <Route
                        path="admin/campaigns/create"
                        element={<AdminRoute><AdminCampaignProvider><CreateCampaignPage /></AdminCampaignProvider></AdminRoute>}
                      />
                      <Route
                        path="admin/campaigns/:id"
                        element={<AdminRoute><CampaignDetailPage /></AdminRoute>}
                      />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                      </AdminCampaignProvider>
                    </AdminNgoProvider>
                  </AdminDonorProvider>
                </PartnerProvider>
              </DonorProvider>
            </PartnerOperationsProvider>
          </FinanceProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DonorProvider } from './context/DonorContext';
import { FinanceProvider } from './context/FinanceContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import PledgesPage from './pages/PledgesPage';
import DonationHistoryPage from './pages/DonationHistoryPage';
import FinanceDashboard from './pages/FinanceDashboard';
import TransactionsPage from './pages/TransactionsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FinanceProvider>
          <DonorProvider>
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
                
                {/* Finance Routes */}
                <Route path="finance/dashboard" element={<FinanceDashboard />} />
                <Route path="finance/transactions" element={<TransactionsPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </DonorProvider>
        </FinanceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import SocialListeningApp from './App'
import AccountLayout from './pages/account/AccountLayout'
import ProfilePage from './pages/account/ProfilePage'
import SecurityPage from './pages/account/SecurityPage'
import PlanPage from './pages/account/PlanPage'
import TeamPage from './pages/account/TeamPage'
import Login from './Login'
import Register from './Register'
import ForgotPassword from './ForgotPassword'
import './index.css'
import { FavoritesProvider } from './context/FavoritesContext'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'
import OnboardingHome from './OnboardingHome'
import Landing from './Landing' // 👈 NUEVA IMPORTACIÓN
import Support from './Support'
import PaymentSuccess from './PaymentSuccess'
import PaymentCancelled from './PaymentCancelled'
import AboutPage from './pages/AboutPage'
import BlogPage from './pages/BlogPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import ResetPassword from './ResetPassword'

function Root() {
  const { session, loading } = useAuth()

  if (loading) return null

  return (
    <FavoritesProvider>
      <BrowserRouter>
        <Routes>

          {/* 👇 NUEVA RUTA PRINCIPAL */}
          <Route
            path="/"
            element={session ? <Navigate to="/app/mentions" replace /> : <Landing />}
          />

          <Route path="/sobre-nosotros" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/privacidad" element={<PrivacyPage />} />
          <Route path="/terminos-y-condiciones" element={<TermsPage />} />

          <Route
            path="/login"
            element={session ? <Navigate to="/app/mentions" replace /> : <Login />}
          />
          <Route
            path="/forgot-password"
            element={session ? <Navigate to="/app/mentions" replace /> : <ForgotPassword />}
          />
          <Route
            path="/register"
            element={session ? <Navigate to="/app/mentions" replace /> : <Register />}
          />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/app/*"
            element={
              <ProtectedRoute>
                <SocialListeningApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="security" element={<SecurityPage />} />
            <Route path="plan" element={<PlanPage />} />
            <Route path="team" element={<TeamPage />} />
          </Route>
          <Route
            path="/app/support"
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancelled" element={<PaymentCancelled />} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingHome />
              </ProtectedRoute>
            }
          />

          {/* Cualquier otra ruta redirige según el estado de sesión */}
          <Route
            path="*"
            element={<Navigate to={session ? '/app/mentions' : '/login'} replace />}
          />
        </Routes>
      </BrowserRouter>
    </FavoritesProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Root />
    </AuthProvider>
  </React.StrictMode>,
)

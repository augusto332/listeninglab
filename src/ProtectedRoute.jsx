import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { session, loading, planLoading, onboardingCompleted } = useAuth()
  const location = useLocation()

  if (loading || planLoading) return null
  if (!session) return <Navigate to="/login" replace />

  if (!onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  if (onboardingCompleted && location.pathname === '/onboarding') {
    return <Navigate to="/app/mentions" replace />
  }

  return children
}

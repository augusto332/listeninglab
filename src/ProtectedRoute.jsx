import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

function FullScreenLoading() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex items-center gap-3 text-slate-200">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Cargando tu cuenta...</span>
      </div>
    </div>
  )
}

export default function ProtectedRoute({ children }) {
  const { session, loading, planLoading, planRefreshing, onboardingCompleted } = useAuth()
  const location = useLocation()

  if (loading || planLoading || planRefreshing) {
    return <FullScreenLoading />
  }

  if (!session) return <Navigate to="/login" replace />

  if (!onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  if (onboardingCompleted && location.pathname === '/onboarding') {
    return <Navigate to="/app/mentions" replace />
  }

  return children
}

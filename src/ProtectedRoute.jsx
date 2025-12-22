import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ProtectedRoute({ children }) {
  const { session, loading, accountId, isRecoverySession } = useAuth()
  const location = useLocation()
  const [checkingKeywords, setCheckingKeywords] = useState(true)
  const [hasKeywords, setHasKeywords] = useState(false)

  useEffect(() => {
    if (isRecoverySession && session) {
      supabase.auth.signOut().catch((error) => {
        console.error('Error signing out from recovery session', error)
      })
    }
  }, [isRecoverySession, session])

  useEffect(() => {
    const checkKeywords = async () => {
      if (!session || isRecoverySession) {
        setCheckingKeywords(false)
        setHasKeywords(false)
        return
      }

      if (accountId === undefined) {
        return
      }

      if (!accountId) {
        setHasKeywords(false)
        setCheckingKeywords(false)
        return
      }

      const { count, error } = await supabase
        .from('dim_keywords')
        .select('keyword_id', { count: 'exact', head: true })
        .eq('account_id', accountId)
      if (error) {
        console.error('Error checking keywords', error)
      }
      setHasKeywords((count ?? 0) > 0)
      setCheckingKeywords(false)
    }
    checkKeywords()
  }, [session, accountId, location.pathname, isRecoverySession])

  if (loading || checkingKeywords) return null
  if (isRecoverySession) return <Navigate to="/login" replace />
  if (!session) return <Navigate to="/login" replace />

  if (!hasKeywords && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  if (hasKeywords && location.pathname === '/onboarding') {
    return <Navigate to="/app/mentions" replace />
  }

  return children
}

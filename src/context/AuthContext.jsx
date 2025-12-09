import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

const AuthContext = createContext({
  session: null,
  user: null,
  loading: true,
  plan: 'free',
  planLoading: true,
  role: 'contributor',
  accountId: undefined,
  subscriptionId: null,
  subscriptionStatus: null,
})

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState('free')
  const [planLoading, setPlanLoading] = useState(true)
  const [role, setRole] = useState('contributor')
  const [accountId, setAccountId] = useState(undefined)
  const [subscriptionId, setSubscriptionId] = useState(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState(null)

  useEffect(() => {
    const fetchUserPlan = async (currentSession) => {
      if (currentSession?.user) {
        setPlanLoading(true)

        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from('profiles')
          .select('role, account_id')
          .eq('user_id', currentSession.user.id)
          .single()

        if (profileError) {
          setPlan('free')
          setRole('contributor')
          setAccountId(null)
          setSubscriptionId(null)
          setSubscriptionStatus(null)
          setPlanLoading(false)
          return
        }

        const nextRole = profile?.role || 'contributor'
        const nextAccountId = profile?.account_id ?? null

        let nextPlan = 'free'
        let nextSubscriptionId = null
        let nextSubscriptionStatus = null

        if (nextAccountId) {
          const {
            data: account,
            error: accountError,
          } = await supabase
            .from('accounts')
            .select('plan_id, subscription_id, subscription_status, plans(name)')
            .eq('id', nextAccountId)
            .single()

          if (!accountError && account?.plans) {
            // Normalizar formato (Supabase puede devolver array u objeto)
            const planName = Array.isArray(account.plans)
              ? account.plans[0]?.name
              : account.plans?.name

            if (planName) {
              nextPlan = planName
            }
          }

          nextSubscriptionId = account?.subscription_id ?? null
          nextSubscriptionStatus = account?.subscription_status ?? null
        }

        setPlan(nextPlan)
        setRole(nextRole)
        setAccountId(nextAccountId)
        setSubscriptionId(nextSubscriptionId)
        setSubscriptionStatus(nextSubscriptionStatus)
        setPlanLoading(false)
        return
      }

      setPlan('free')
      setRole('contributor')
      setAccountId(null)
      setSubscriptionId(null)
      setSubscriptionStatus(null)
      setPlanLoading(false)
    }

    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
      await fetchUserPlan(session)
      setLoading(false)
    }
    initSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      fetchUserPlan(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user,
        loading,
        plan,
        planLoading,
        role,
        accountId,
        subscriptionId,
        subscriptionStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

const AuthContext = createContext({
  session: null,
  user: null,
  loading: true,
  plan: 'free',
  planLoading: true,
  planId: null,
  role: 'contributor',
  accountId: undefined,
  subscriptionId: null,
  subscriptionStatus: null,
  onboardingCompleted: false,
  refreshAccount: async () => {},
})

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState('free')
  const [planLoading, setPlanLoading] = useState(true)
  const [planId, setPlanId] = useState(null)
  const [role, setRole] = useState('contributor')
  const [accountId, setAccountId] = useState(undefined)
  const [subscriptionId, setSubscriptionId] = useState(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState(null)
  const [onboardingCompleted, setOnboardingCompleted] = useState(false)

  const fetchUserPlan = useCallback(async (currentSession) => {
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
        setPlanId(null)
        setRole('contributor')
        setAccountId(null)
        setSubscriptionId(null)
        setSubscriptionStatus(null)
        setOnboardingCompleted(false)
        setPlanLoading(false)
        return
      }

      const nextRole = profile?.role || 'contributor'
      const nextAccountId = profile?.account_id ?? null

      let nextPlan = 'free'
      let nextPlanId = null
      let nextSubscriptionId = null
      let nextSubscriptionStatus = null
      let nextOnboardingCompleted = false

      if (nextAccountId) {
        const {
          data: account,
          error: accountError,
        } = await supabase
          .from('accounts')
          .select(
            'plan_id, subscription_id, subscription_status, is_onboarding_completed, plans(name)',
          )
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

        nextPlanId = account?.plan_id ?? null
        nextSubscriptionId = account?.subscription_id ?? null
        nextSubscriptionStatus = account?.subscription_status ?? null
        nextOnboardingCompleted = account?.is_onboarding_completed ?? false
      }

      setPlan(nextPlan)
      setPlanId(nextPlanId)
      setRole(nextRole)
      setAccountId(nextAccountId)
      setSubscriptionId(nextSubscriptionId)
      setSubscriptionStatus(nextSubscriptionStatus)
      setOnboardingCompleted(nextOnboardingCompleted)
      setPlanLoading(false)
      return
    }

    setPlan('free')
    setPlanId(null)
    setRole('contributor')
    setAccountId(null)
    setSubscriptionId(null)
    setSubscriptionStatus(null)
    setOnboardingCompleted(false)
    setPlanLoading(false)
  }, [])

  const refreshAccount = useCallback(async () => {
    await fetchUserPlan(session)
  }, [fetchUserPlan, session])

  useEffect(() => {
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
  }, [fetchUserPlan])

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user,
        loading,
        plan,
        planLoading,
        planId,
        role,
        accountId,
        subscriptionId,
        subscriptionStatus,
        onboardingCompleted,
        refreshAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

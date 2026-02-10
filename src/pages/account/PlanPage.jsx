"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Crown, Check, ChevronDown, ChevronUp } from "lucide-react"
import { planConfig } from "./constants"
import { ConfirmationModal } from "@/components/ConfirmationModal"
import { supabase } from "@/lib/supabaseClient"

export default function PlanPage() {
  const { plan, planLoading, accountId, subscriptionId, subscriptionStatus, customerPortalUrl } =
    useAuth()
  const planTier = plan ?? "free"
  const isPaidPlan = planTier !== "free"
  const [showPlans, setShowPlans] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [plansData, setPlansData] = useState([])
  const [plansLoading, setPlansLoading] = useState(false)
  const [plansError, setPlansError] = useState("")
  const [lastKnownPlan, setLastKnownPlan] = useState(plan ?? "free")
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "Confirmar",
    cancelLabel: "Cancelar",
    onConfirm: null,
  })

  const activeSubscriptionStatuses = ["active", "past_due", "paid", "cancelled"]
  const hasActiveSubscription = Boolean(
    subscriptionId && activeSubscriptionStatuses.includes(subscriptionStatus)
  )
  const isCancelledSubscription = subscriptionStatus === "cancelled"

  const plansById = useMemo(
    () =>
      plansData.reduce((acc, planItem) => {
        acc[planItem.id] = planItem
        return acc
      }, {}),
    [plansData]
  )

  // Llamada a edge function create_checkout
  const handleCheckout = async (variantId) => {
    if (!variantId || !accountId) return

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create_checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            account_id: accountId,
            variant_id: variantId,
          }),
        }
      )

      const data = await response.json()

      if (data?.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Error creando checkout:", error)
    }
  }

  const handleUpdateSubscription = async (variantId) => {
    if (!variantId || !subscriptionId) return

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update_subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            subscription_id: subscriptionId,
            action: "update",
            variant_id: variantId,
            invoice_immediately: false,
            disable_prorations: false,
          }),
        }
      )

      const data = await response.json()

      if (data?.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Error actualizando la suscripción:", error)
    }
  }

  const handleCancelSubscription = async () => {
    if (!subscriptionId) return

    try {
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update_subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          subscription_id: subscriptionId,
          action: "cancel",
        }),
      })
    } catch (error) {
      console.error("Error cancelando la suscripción:", error)
    }
  }

  const closeConfirmationModal = () => {
    setConfirmationModal((prev) => ({ ...prev, isOpen: false, onConfirm: null }))
  }

  const openConfirmationModal = (config) => {
    setConfirmationModal({
      isOpen: true,
      title: config.title,
      message: config.message,
      confirmLabel: config.confirmLabel ?? "Confirmar",
      cancelLabel: config.cancelLabel ?? "Cancelar",
      onConfirm: config.onConfirm,
    })
  }

  const confirmAction = () => {
    if (typeof confirmationModal.onConfirm === "function") {
      confirmationModal.onConfirm()
    }
    closeConfirmationModal()
  }

  const handlePlanSelection = (planItem) => {
    if (plansLoading) {
      setPlansError("Los planes aún se están cargando. Intentá de nuevo en unos segundos.")
      return
    }

    if (!planItem?.plan_id) {
      setPlansError("Este plan no tiene un checkout disponible.")
      return
    }

    const variantId = plansById[planItem.plan_id]?.variant_id

    if (!variantId) {
      setPlansError("No se encontró el identificador de pago para este plan.")
      return
    }

    if (hasActiveSubscription) {
      openConfirmationModal({
        title: "Confirmar cambio de plan",
        message:
          "¿Estás seguro que querés cambiar tu plan? Esta acción modificará tu suscripción de inmediato.",
        confirmLabel: "Confirmar",
        cancelLabel: "Cancelar",
        onConfirm: () => handleUpdateSubscription(variantId),
      })
      return
    }

    handleCheckout(variantId)
  }

  const availablePlans = [
    {
      id: "basic",
      plan_id: 2,
      label: "Plan Básico",
      price: "$29",
      period: "/mes",
      description: "Perfecto para empezar",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      features: [
        "Monitoreo de redes sociales",
        "Análisis de sentimiento básico",
        "Reportes mensuales",
        "Hasta 5 marcas",
        "Soporte por email",
      ],
      cta: "Elegir Plan Básico",
    },
    {
      id: "team",
      plan_id: 3,
      label: "Plan Team",
      price: "$79",
      period: "/mes",
      description: "Para equipos en crecimiento",
      color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      features: [
        "Todo del Plan Básico",
        "Análisis avanzado de sentimiento",
        "Reportes semanales",
        "Hasta 20 marcas",
        "2 usuarios",
        "Integraciones básicas",
      ],
      cta: "Elegir Plan Team",
    },
    {
      id: "pro",
      plan_id: 4,
      label: "Plan Pro",
      price: "$199",
      period: "/mes",
      description: "Para profesionales",
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      features: [
        "Todo del Plan Team",
        "Análisis predictivo",
        "Reportes en tiempo real",
        "Hasta 50 marcas",
        "5 usuarios",
        "Integraciones premium",
        "API access",
      ],
      cta: "Elegir Plan Pro",
      popular: true,
    },
    {
      id: "enterprise",
      label: "Plan Enterprise",
      price: "Contactar",
      period: "",
      description: "Solución personalizada",
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      features: [
        "Todo personalizado",
        "Usuarios ilimitados",
        "Soporte dedicado",
        "Implementación personalizada",
        "SLA garantizado",
        "Capacitación incluida",
      ],
      cta: "Contactar ventas",
    },
  ]

  const currentPlanConfig = useMemo(() => planConfig[planTier] ?? planConfig.free, [planTier])

  const planBadge = useMemo(() => {
    const planToDisplay = planLoading ? lastKnownPlan : plan
    const config = planConfig[planToDisplay] ?? planConfig.free
    const PlanIcon = config.icon

    return (
      <Badge variant="secondary" className={`${config.color} flex items-center gap-1.5 px-3 py-1.5`}>
        <PlanIcon className="w-3 h-3" />
        <span>{config.label}</span>
        {planLoading && <span className="text-[11px] uppercase tracking-wide">Cargando</span>}
      </Badge>
    )
  }, [lastKnownPlan, plan, planLoading])

  useEffect(() => {
    if (plan) {
      setLastKnownPlan(plan)
    }
  }, [plan])

  useEffect(() => {
    if (!accountId) return

    const controller = new AbortController()
    const fetchPaymentMethod = async () => {
      setPaymentLoading(true)

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get_payment_method`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({ account_id: accountId }),
            signal: controller.signal,
          }
        )

        if (!response.ok) {
          throw new Error("No se pudo obtener el método de pago")
        }

        const data = await response.json()
        setPaymentMethod(data)
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error obteniendo el método de pago:", error)
          setPaymentMethod(null)
        }
      } finally {
        setPaymentLoading(false)
      }
    }

    fetchPaymentMethod()

    return () => controller.abort()
  }, [accountId])

  useEffect(() => {
    let isMounted = true

    const fetchPlans = async () => {
      setPlansLoading(true)
      setPlansError("")

      try {
        const { data, error } = await supabase.from("plans").select("id, variant_id")

        if (error) {
          throw error
        }

        if (isMounted) {
          setPlansData(data ?? [])
        }
      } catch (error) {
        console.error("Error cargando planes:", error)
        if (isMounted) {
          setPlansData([])
          setPlansError("No se pudieron cargar los planes disponibles.")
        }
      } finally {
        if (isMounted) {
          setPlansLoading(false)
        }
      }
    }

    fetchPlans()

    return () => {
      isMounted = false
    }
  }, [])

  const paymentDetails = useMemo(() => {
    const brand = paymentMethod?.card_brand?.toUpperCase?.()
    const lastFour = paymentMethod?.card_last_four
    const isCardPayment = Boolean(brand && lastFour)

    return {
      isCardPayment,
      display: isCardPayment
        ? `${brand} •••• ${lastFour}`
        : paymentMethod
          ? "Alternativo"
          : "Método de pago no disponible",
      actionLabel: isCardPayment ? "Cambiar tarjeta" : "Ir a portal de cliente",
      actionUrl: isCardPayment
        ? paymentMethod?.update_payment_method_url
        : paymentMethod?.customer_portal_url,
    }
  }, [paymentMethod])

  const sectionTitle = hasActiveSubscription ? "Actualizar tu plan" : "Contrata un nuevo plan"

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-blue-600/20 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-purple-400" />
            </div>
            <CardTitle className="text-white">Plan Actual</CardTitle>
          </div>
          <CardDescription className="text-slate-400">Información sobre tu suscripción</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
            <div>
              <h4 className="font-medium text-white mb-1">{currentPlanConfig.label}</h4>
              <p className="text-sm text-slate-400">
                {isPaidPlan ? "Acceso completo a las funciones avanzadas" : "Acceso básico a funciones de monitoreo"}
              </p>
            </div>
            {planBadge}
          </div>

          <div className="flex flex-col gap-3 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">Método de pago</p>
                <p className="text-white font-medium">
                  {paymentLoading ? "Cargando método de pago..." : paymentDetails.display}
                </p>
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                {paymentDetails.isCardPayment && (
                  <Button
                    variant="outline"
                    className="border-slate-700 text-slate-200 hover:bg-slate-700/60"
                    disabled={paymentLoading || !paymentDetails.actionUrl}
                    onClick={() => {
                      if (paymentDetails.actionUrl) {
                        window.location.href = paymentDetails.actionUrl
                      }
                    }}
                  >
                    {paymentDetails.actionLabel}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="text-blue-200 hover:text-blue-100 hover:bg-blue-500/10 border border-blue-500/30 bg-transparent"
                  disabled={!customerPortalUrl}
                  onClick={() => {
                    if (customerPortalUrl) {
                      window.location.href = customerPortalUrl
                    }
                  }}
                >
                  Ir al portal de cliente
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {planTier !== "enterprise" && (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-6 h-6 text-amber-400" />
                <h3 className="text-2xl font-bold text-white">{sectionTitle}</h3>
              </div>
              <p className="text-slate-300 mb-6">
                {hasActiveSubscription
                  ? "Cambia tu plan actual según las necesidades de tu equipo."
                  : "Descubre funciones avanzadas y elige el plan que mejor se adapte a tu equipo."}
              </p>

              {isCancelledSubscription && (
                <div className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-amber-200">
                  Tu suscripción fue cancelada. Elige un plan para reactivarla.
                </div>
              )}

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25"
                onClick={() => setShowPlans(!showPlans)}
              >
                <Crown className="w-5 h-5 mr-2" />
                {showPlans ? "Ocultar planes" : "Ver planes disponibles"}
                {showPlans ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>
              {hasActiveSubscription && !isCancelledSubscription && (
                <Button
                  variant="ghost"
                  className="mt-3 w-full text-red-300 border border-red-500/40 hover:bg-red-500/20 bg-transparent"
                  onClick={() =>
                    openConfirmationModal({
                      title: "Cancelar suscripción",
                      message:
                        "¿Estás seguro que querés cancelar tu suscripción? Perderás acceso a las funciones premium al finalizar tu período de facturación.",
                      confirmLabel: "Sí, cancelar",
                      cancelLabel: "Volver",
                      onConfirm: handleCancelSubscription,
                    })
                  }
                >
                  Cancelar suscripción
                </Button>
              )}
            </div>
          </div>

          {showPlans && (
            <div className="space-y-4">
              {plansError && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
                  {plansError}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {availablePlans.map((planItem) => (
                  <Card
                    key={planItem.id}
                    className={`relative overflow-hidden transition-all hover:shadow-lg ${
                      planTier === planItem.id
                        ? "ring-2 ring-purple-500 bg-slate-800/50"
                        : "bg-slate-800/30 hover:bg-slate-800/50"
                    } border-slate-700/50 backdrop-blur-sm`}
                  >
                    {planItem.popular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                        Popular
                      </div>
                    )}

                    <CardHeader>
                      <CardTitle className="text-white text-lg">{planItem.label}</CardTitle>
                      <CardDescription className="text-slate-400">{planItem.description}</CardDescription>
                      <div className="pt-4">
                        <span className="text-3xl font-bold text-white">{planItem.price}</span>
                        {planItem.period && <span className="text-slate-400 text-sm">{planItem.period}</span>}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        {planItem.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-slate-300">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        className={`w-full ${
                          planTier === planItem.id
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : planItem.popular
                              ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                              : "bg-slate-700 hover:bg-slate-600"
                        }`}
                        disabled={planTier === planItem.id || plansLoading || !planItem.plan_id}
                        onClick={() => handlePlanSelection(planItem)}
                      >
                        {planTier === planItem.id
                          ? "Plan actual"
                          : hasActiveSubscription
                            ? `Cambiar a ${planItem.label}`
                            : planItem.cta}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmLabel={confirmationModal.confirmLabel}
        cancelLabel={confirmationModal.cancelLabel}
        onConfirm={confirmAction}
        onCancel={closeConfirmationModal}
      />
    </div>
  )
}

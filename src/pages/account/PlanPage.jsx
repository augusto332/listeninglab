"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Crown, Check, ChevronDown, ChevronUp } from "lucide-react"
import { planConfig } from "./constants"
import { supabase } from "@/lib/supabaseClient"

export default function PlanPage() {
  const { plan, planLoading, accountId } = useAuth()
  const planTier = plan ?? "free"
  const isPaidPlan = planTier !== "free"
  const [showPlans, setShowPlans] = useState(false)
  const [planVariants, setPlanVariants] = useState({})

  useEffect(() => {
    const fetchPlanVariants = async () => {
      const { data, error } = await supabase.from("plans").select("name, variant_id")

      if (error) {
        console.error("Error fetching plan variants:", error)
        return
      }

      const variantMap = data?.reduce((acc, { name, variant_id }) => {
        if (name && variant_id) {
          acc[name.toLowerCase()] = variant_id
        }
        return acc
      }, {})

      setPlanVariants(variantMap ?? {})
    }

    fetchPlanVariants()
  }, [])

  const availablePlans = [
    {
      id: "basic",
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
    if (planLoading) return null

    const config = planConfig[plan] ?? planConfig.free
    const PlanIcon = config.icon

    return (
      <Badge variant="secondary" className={`${config.color} flex items-center gap-1.5 px-3 py-1.5`}>
        <PlanIcon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }, [plan, planLoading])

  const handleCheckout = async (planId) => {
    const variantId = planVariants[planId]

    if (!variantId || !accountId) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create_checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ account_id: accountId, variant_id: variantId }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create checkout: ${response.statusText}`)
      }

      const data = await response.json()

      if (data?.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Error creating checkout:", error)
    }
  }

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
        </CardContent>
      </Card>

      {planTier !== "enterprise" && (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-6 h-6 text-amber-400" />
                <h3 className="text-2xl font-bold text-white">Actualiza tu plan</h3>
              </div>
              <p className="text-slate-300 mb-6">
                Descubre funciones avanzadas y elige el plan que mejor se adapte a tu equipo.
              </p>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25"
                onClick={() => setShowPlans(!showPlans)}
              >
                <Crown className="w-5 h-5 mr-2" />
                {showPlans ? "Ocultar planes" : "Ver planes disponibles"}
                {showPlans ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>

          {showPlans && (
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
                      disabled={planTier === planItem.id}
                      onClick={() => handleCheckout(planItem.id)}
                    >
                      {planTier === planItem.id ? "Plan actual" : planItem.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

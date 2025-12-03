import { useMemo } from "react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Crown } from "lucide-react"
import { planConfig } from "./accountConfig"

export default function PlanPage() {
  const { plan, planLoading } = useAuth()
  const planTier = plan ?? "free"
  const currentPlanConfig = planConfig[planTier] ?? planConfig.free
  const isPaidPlan = planTier !== "free"

  const getPlanBadge = useMemo(() => {
    if (planLoading) return null

    const config = planConfig[planTier] ?? planConfig.free
    const PlanIcon = config.icon

    return (
      <Badge variant="secondary" className={`${config.color} flex items-center gap-1.5 px-3 py-1.5`}>
        <PlanIcon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }, [planLoading, planTier])

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
            {getPlanBadge}
          </div>
        </CardContent>
      </Card>

      {planTier !== "enterprise" && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-6 h-6 text-amber-400" />
              <h3 className="text-2xl font-bold text-white">Actualiza tu plan</h3>
            </div>
            <p className="text-slate-300 mb-6">Descubre funciones avanzadas y elige el plan que mejor se adapte a tu equipo.</p>

            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25"
              onClick={() => alert("Próximamente: página de planes y precios")}
            >
              <Crown className="w-5 h-5 mr-2" />
              Actualiza tu plan
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

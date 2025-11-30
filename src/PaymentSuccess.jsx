"use client"

import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const { session } = useAuth()

  const primaryPath = useMemo(() => (session ? "/app/mentions" : "/"), [session])
  const primaryLabel = session ? "Ir a tu panel" : "Volver al inicio"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-52 -left-40 w-[28rem] h-[28rem] bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <main className="relative z-10 flex items-center justify-center px-6 py-16">
        <Card className="w-full max-w-3xl bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-slate-800/70 border border-slate-700/50 shadow-xl backdrop-blur-lg">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 border border-green-500/30">
              <CheckCircle2 className="h-9 w-9 text-green-400" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              Pago completado con éxito
            </CardTitle>
            <CardDescription className="text-base text-slate-300">
              Tu suscripción está activa y lista para usarse. Gracias por confiar en Listening Lab para potenciar tu monitoreo.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="mt-1 rounded-lg bg-blue-500/10 p-2">
                  <Sparkles className="h-4 w-4 text-blue-300" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-white">Beneficios desbloqueados</p>
                  <p className="text-sm text-slate-400">
                    Acceso a las herramientas premium, reportes avanzados y alertas inteligentes en tiempo real.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="mt-1 rounded-lg bg-emerald-500/10 p-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-white">Pago verificado</p>
                  <p className="text-sm text-slate-400">
                    Hemos confirmado tu transacción. Recibirás un comprobante en tu correo y podrás gestionar tu plan en
                    cualquier momento.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-200">Estado de la suscripción</p>
                <p className="text-lg font-semibold text-white">Activa y lista para usar</p>
              </div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-100 border-green-500/30 text-sm px-3 py-1">
                Renovación automática habilitada
              </Badge>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">Puedes modificar tu plan o método de pago desde la configuración de cuenta.</p>
              <Button size="lg" className="gap-2" onClick={() => navigate(primaryPath)}>
                {primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

